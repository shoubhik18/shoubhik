"use client";
"use no memo";

/* eslint-disable react-hooks/immutability, react-hooks/purity -- three.js materials are mutated in the render loop */

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Line2 } from "three-stdlib";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { store } from "@/store/store";
import { setWebgl } from "@/store/uiSlice";
import {
  ORBIT_RADII,
  RING_RADIUS,
  computeVisibility,
  highlightAmount,
  nodePositions,
  nodeScaleFor,
  poseFor,
  sceneMotion,
} from "@/components/canvas/cameraPath";

const coreVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const coreFragment = /* glsl */ `
  uniform float uTime;
  uniform float uDim;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main() {
    float fres = pow(1.0 - clamp(dot(normalize(vNormal), normalize(cameraPosition - vWorld)), 0.0, 1.0), 2.05);
    vec3 base = vec3(0.035, 0.05, 0.065);
    vec3 edge = vec3(0.369, 0.918, 0.831);
    float pulse = 0.88 + 0.12 * sin(uTime * 1.15);
    vec3 color = mix(base, edge, fres) * pulse;
    color = mix(color, base, clamp(uDim, 0.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function makeGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(94, 234, 212, 0.52)");
  gradient.addColorStop(0.42, "rgba(94, 234, 212, 0.1)");
  gradient.addColorStop(1, "rgba(94, 234, 212, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function nodeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#111923",
    emissive: "#5eead4",
    emissiveIntensity: 0.18,
    roughness: 0.36,
    metalness: 0.58,
  });
}

function useNodeMaterial(index: number) {
  const material = useMemo(() => nodeMaterial(), []);
  useFrame((_, delta) => {
    const amount = highlightAmount(index);
    const current = Number.isFinite(material.emissiveIntensity) ? material.emissiveIntensity : 0.2;
    const target = Number.isFinite(amount) ? 0.16 + amount * 1.15 : 0.35;
    material.emissiveIntensity = THREE.MathUtils.damp(current, target, 5, delta);
  });
  return material;
}

function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uDim: { value: 0 },
        },
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    const vis = sceneMotion.coreVisible;
    if (mesh.current) {
      mesh.current.visible = vis > 0.005;
      mesh.current.scale.setScalar(Math.max(0.001, vis));
      if (!scrollState.current.reduced) {
        mesh.current.rotation.y += delta * 0.14;
      }
    }
    if (!scrollState.current.reduced) {
      material.uniforms.uTime.value += delta;
    }
    material.uniforms.uDim.value = 1 - vis * (1 - sceneMotion.dim);
  });

  return (
    <mesh ref={mesh} material={material} visible={false}>
      <icosahedronGeometry args={[0.62, 2]} />
    </mesh>
  );
}

function Glow() {
  const texture = useMemo(() => makeGlowTexture(), []);
  const sprite = useRef<THREE.Sprite>(null);
  const material = useRef<THREE.SpriteMaterial>(null);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame(() => {
    const vis = sceneMotion.coreVisible;
    if (sprite.current) {
      sprite.current.visible = vis > 0.005;
      const s = 1.85 * Math.max(0.001, vis);
      sprite.current.scale.set(s, s, 1);
    }
    if (material.current) {
      material.current.opacity = 0.85 * vis * (1 - sceneMotion.dim * 0.75);
    }
  });

  if (!texture) return null;

  return (
    <sprite ref={sprite} scale={[1.85, 1.85, 1]} visible={false}>
      <spriteMaterial
        ref={material}
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
}

const TAN_HALF_FOV = Math.tan((34 * Math.PI) / 360);
const WORK_DEPTH = 5.4;

function SystemNode({ index, children }: { index: number; children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const workVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    const planetVis = sceneMotion.planetVisible;
    if (planetVis <= 0.005) {
      node.visible = false;
      return;
    }
    node.visible = true;

    const orbitScale = sceneMotion.scale * sceneMotion.coreVisible;
    const [bx, by, bz] = nodePositions[index];
    const ox = bx * orbitScale;
    const oy = by * orbitScale;
    const oz = bz * orbitScale;
    // Interpolates from balanced left/right orbital coordinates to the Work 01..04 numbers.

    const w = sceneMotion.workBlend;
    let wx = ox;
    let wy = oy;
    let wz = oz;
    let slideVis = index === 0 ? 1 : 0;

    if (w > 0.001) {
      const numEl = document.getElementById(`work-num-${index}`);
      if (numEl) {
        const rect = numEl.getBoundingClientRect();
        const vw = Math.max(1, window.innerWidth);
        const vh = Math.max(1, window.innerHeight);
        const gap = Math.max(96, rect.height * 0.98);
        const screenX = rect.right + gap;
        const screenY = rect.top + rect.height * 0.5;
        const ndcX = (screenX / vw) * 2 - 1;
        const ndcY = 1 - (screenY / vh) * 2;
        const halfH = WORK_DEPTH * TAN_HALF_FOV;
        const halfW = halfH * (vw / vh);
        workVec.set(ndcX * halfW, ndcY * halfH, -WORK_DEPTH).applyMatrix4(camera.matrixWorld);
        wx = workVec.x;
        wy = workVec.y;
        wz = workVec.z;

        const distFromCenter = Math.abs(rect.left - vw * 0.32);
        slideVis = 1 - Math.min(1, Math.max(0, (distFromCenter - vw * 0.38) / (vw * 0.35)));
      }
    }

    node.position.set(
      ox * (1 - w) + wx * w,
      oy * (1 - w) + wy * w,
      oz * (1 - w) + wz * w,
    );

    const orbitNodeScale = Math.max(0.001, orbitScale);
    const workNodeScale = (scrollState.current.mobile ? 0.38 : 0.44) * slideVis;
    const targetScale = planetVis * (orbitNodeScale * (1 - w) + workNodeScale * w);
    node.visible = targetScale > 0.01;
    node.scale.setScalar(Math.max(0.001, targetScale));

    if (!scrollState.current.reduced) {
      node.rotation.y += delta * (0.32 + index * 0.06);
    }
  });

  return (
    <group ref={group} position={nodePositions[index]} visible={false}>
      {children}
    </group>
  );
}

function CrmNode() {
  const material = useNodeMaterial(0);
  return (
    <SystemNode index={0}>
      <mesh material={material}>
        <icosahedronGeometry args={[0.26, 2]} />
      </mesh>
      <mesh rotation={[Math.PI * 0.42, 0.25, 0]} material={material}>
        <torusGeometry args={[0.42, 0.014, 10, 64]} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.32, 1]} />
        <meshBasicMaterial color="#5eead4" wireframe transparent opacity={0.28} toneMapped={false} />
      </mesh>
    </SystemNode>
  );
}

function CommerceNode() {
  const material = useNodeMaterial(1);
  return (
    <SystemNode index={1}>
      <mesh material={material}>
        <icosahedronGeometry args={[0.3, 3]} />
      </mesh>
      <mesh rotation={[Math.PI * 0.46, -0.2, 0]}>
        <ringGeometry args={[0.38, 0.56, 64]} />
        <meshBasicMaterial
          color="#5eead4"
          transparent
          opacity={0.26}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI * 0.46, -0.2, 0]} material={material}>
        <torusGeometry args={[0.58, 0.012, 8, 64]} />
      </mesh>
    </SystemNode>
  );
}

function RmsNode() {
  const material = useNodeMaterial(2);
  const moonPivot = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!scrollState.current.reduced && moonPivot.current) {
      moonPivot.current.rotation.y += delta * 0.65;
    }
  });
  return (
    <SystemNode index={2}>
      <mesh material={material}>
        <icosahedronGeometry args={[0.27, 2]} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.36, 1]} />
        <meshBasicMaterial color="#5eead4" wireframe transparent opacity={0.34} toneMapped={false} />
      </mesh>
      <group ref={moonPivot} rotation={[0.32, 0, -0.24]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.008, 8, 56]} />
          <meshBasicMaterial color="#5eead4" transparent opacity={0.32} toneMapped={false} />
        </mesh>
        <mesh position={[0.5, 0, 0]} material={material}>
          <icosahedronGeometry args={[0.068, 1]} />
        </mesh>
      </group>
    </SystemNode>
  );
}

function MlmNode() {
  const material = useNodeMaterial(3);
  return (
    <SystemNode index={3}>
      <mesh material={material}>
        <icosahedronGeometry args={[0.29, 3]} />
      </mesh>
      <mesh rotation={[Math.PI * 0.36, 0.4, 0]} material={material}>
        <torusGeometry args={[0.48, 0.012, 8, 64]} />
      </mesh>
      <mesh rotation={[-Math.PI * 0.36, -0.4, 0]} material={material}>
        <torusGeometry args={[0.54, 0.01, 8, 64]} />
      </mesh>
      <mesh position={[0.48, 0.14, 0]} material={material}>
        <icosahedronGeometry args={[0.065, 1]} />
      </mesh>
      <mesh position={[-0.54, -0.14, 0]} material={material}>
        <icosahedronGeometry args={[0.055, 1]} />
      </mesh>
    </SystemNode>
  );
}

function NodeLink({ index }: { index: number }) {
  const [nx, ny, nz] = nodePositions[index];
  const points = useMemo(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(nx, ny, nz)],
    [nx, ny, nz],
  );
  const line = useRef<Line2>(null);

  useFrame((_, delta) => {
    const material = line.current?.material as THREE.Material & { opacity: number };
    if (!material) return;
    const current = Number.isFinite(material.opacity) ? material.opacity : 0.2;
    const rawTarget = (0.08 + highlightAmount(index) * 0.82) * sceneMotion.coreVisible;
    const target = Number.isFinite(rawTarget) ? rawTarget : 0.2;
    material.opacity = THREE.MathUtils.damp(current, target, 5, delta);
  });

  return (
    <Line
      ref={line}
      points={points}
      color="#5eead4"
      lineWidth={1}
      transparent
      opacity={0.2}
    />
  );
}

function Ring({
  radius = RING_RADIUS,
  y = 0,
  color = "#8b97a8",
  opacity = 0.28,
}: {
  radius?: number;
  y?: number;
  color?: string;
  opacity?: number;
}) {
  const points = useMemo(() => {
    const ring: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i += 1) {
      const theta = (i / 160) * Math.PI * 2;
      ring.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
    }
    return ring;
  }, [radius, y]);

  return <Line points={points} color={color} lineWidth={1} transparent opacity={opacity} />;
}

function RingTicks() {
  const outerRadius = ORBIT_RADII[3];
  const points = useMemo(() => {
    const ticks: THREE.Vector3[] = [];
    const count = 64;
    for (let i = 0; i < count; i += 1) {
      const theta = (i / count) * Math.PI * 2;
      const major = i % 4 === 0;
      const inner = outerRadius - (major ? 0.16 : 0.07);
      const outer = outerRadius + 0.04;
      ticks.push(
        new THREE.Vector3(Math.cos(theta) * inner, 0, Math.sin(theta) * inner),
        new THREE.Vector3(Math.cos(theta) * outer, 0, Math.sin(theta) * outer),
      );
    }
    return ticks;
  }, [outerRadius]);

  return <Line points={points} segments color="#8b97a8" lineWidth={1} transparent opacity={0.34} />;
}

function OrbitalPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <ringGeometry args={[1.15, ORBIT_RADII[3] + 0.15, 96]} />
      <meshBasicMaterial
        color="#5eead4"
        transparent
        opacity={0.045}
        side={THREE.DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

function CoreCage() {
  const group = useRef<THREE.Group>(null);
  const innerGimbal = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.MeshBasicMaterial>(null);
  const band = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    const vis = sceneMotion.coreVisible;
    if (group.current) {
      group.current.visible = vis > 0.005;
      group.current.scale.setScalar(Math.max(0.001, vis));
    }
    const opacity = 0.36 * vis;
    if (shell.current) shell.current.opacity = opacity;
    if (band.current) band.current.opacity = Math.min(1, opacity * 1.35);
    if (!scrollState.current.reduced) {
      if (group.current) group.current.rotation.y -= delta * 0.09;
      if (innerGimbal.current) innerGimbal.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group ref={group} visible={false}>
      <mesh>
        <icosahedronGeometry args={[0.84, 1]} />
        <meshBasicMaterial ref={shell} color="#5eead4" wireframe transparent opacity={0.36} toneMapped={false} />
      </mesh>
      <mesh ref={innerGimbal} rotation={[Math.PI * 0.48, 0.18, 0]}>
        <torusGeometry args={[0.76, 0.011, 8, 84]} />
        <meshBasicMaterial ref={band} color="#5eead4" transparent opacity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function DeckGrid() {
  const grid = useRef<THREE.GridHelper>(null);

  useEffect(() => {
    const helper = grid.current;
    if (!helper) return;
    const materials = Array.isArray(helper.material) ? helper.material : [helper.material];
    materials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.015;
      material.depthWrite = false;
    });
  }, []);

  useFrame(() => {
    const helper = grid.current;
    if (!helper) return;
    const opacity = 0.015 + sceneMotion.dim * 0.05;
    const materials = Array.isArray(helper.material) ? helper.material : [helper.material];
    materials.forEach((material) => {
      material.opacity = opacity;
    });
  });

  return <gridHelper ref={grid} args={[72, 14, "#24303a", "#1a242e"]} position={[0, -4.2, 0]} />;
}

function starTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Starfield() {
  const texture = useMemo(() => starTexture(), []);
  const geometry = useMemo(() => {
    const count = 640;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 12 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.55;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame(() => {
    const count = scrollState.current.mobile ? 200 : 640;
    if (geometry.drawRange.count !== count) geometry.setDrawRange(0, count);
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        map={texture ?? undefined}
        color="#c5d0dc"
        size={2.2}
        sizeAttenuation
        transparent
        opacity={0.68}
        depthWrite={false}
      />
    </points>
  );
}

function CameraRig() {
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    const snapshot = scrollState.current;
    const vis = computeVisibility();
    const pose = poseFor(snapshot, vis.coreVisible, vis.workBlend);
    sceneMotion.focus = pose.focus;
    sceneMotion.dim = pose.dim;
    sceneMotion.scale = nodeScaleFor(snapshot, vis.coreVisible);
    sceneMotion.coreVisible = vis.coreVisible;
    sceneMotion.planetVisible = vis.planetVisible;
    sceneMotion.workBlend = vis.workBlend;

    camera.position.set(pose.px, pose.py, pose.pz);
    camera.lookAt(pose.lx, pose.ly, pose.lz);
    camera.updateMatrixWorld();
  }, -1);
  return null;
}

function ScaledSystem({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const s = sceneMotion.scale * sceneMotion.coreVisible;
    group.current.visible = s > 0.005;
    group.current.scale.setScalar(Math.max(0.001, s));
  });
  return (
    <group ref={group} visible={false}>
      {children}
    </group>
  );
}

function HotspotProjector() {
  const camera = useThree((state) => state.camera);
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (sceneMotion.coreVisible < 0.1) return;
    const sticky = document.getElementById("orbit-sticky");
    if (!sticky) return;
    const rect = sticky.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const scale = sceneMotion.scale * sceneMotion.coreVisible;
    nodePositions.forEach((position, index) => {
      const el = document.getElementById(`hotspot-${index}`);
      if (!el) return;
      point.set(position[0] * scale, position[1] * scale, position[2] * scale);
      point.project(camera);
      el.style.left = `${(point.x * 0.5 + 0.5) * rect.width}px`;
      el.style.top = `${(-point.y * 0.5 + 0.5) * rect.height}px`;
    });
  });

  return null;
}

function Lifecycle() {
  const gl = useThree((state) => state.gl);
  const set = useThree((state) => state.set);

  useEffect(() => {
    let active = true;
    store.dispatch(setWebgl(scrollState.current.reduced ? "reduced" : "ready"));
    const canvas = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
      if (active) store.dispatch(setWebgl("failed"));
    };
    canvas.addEventListener("webglcontextlost", onLost);
    const onHide = () => set({ frameloop: document.hidden ? "never" : "always" });
    document.addEventListener("visibilitychange", onHide);
    return () => {
      active = false;
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [gl, set]);

  return null;
}

function Stage() {
  return (
    <>
      <color attach="background" args={["#07090d"]} />
      <fog attach="fog" args={["#07090d", 9, 20]} />
      <ambientLight intensity={0.44} />
      <directionalLight position={[4, 6, 3]} intensity={1.35} color="#eef2f6" />
      <pointLight position={[0, 0.2, 0.4]} intensity={6.5} distance={9} color="#5eead4" />
      <CameraRig />
      <Starfield />
      <DeckGrid />
      <Glow />
      <Core />
      <CoreCage />
      <ScaledSystem>
        <OrbitalPlane />
        {ORBIT_RADII.map((radius, index) => (
          <Ring
            key={radius}
            radius={radius}
            y={nodePositions[index][1]}
            color={index % 2 === 0 ? "#5eead4" : "#8b97a8"}
            opacity={0.2 + index * 0.03}
          />
        ))}
        <RingTicks />
        <NodeLink index={0} />
        <NodeLink index={1} />
        <NodeLink index={2} />
        <NodeLink index={3} />
      </ScaledSystem>
      <CrmNode />
      <CommerceNode />
      <RmsNode />
      <MlmNode />
      <HotspotProjector />
      <Lifecycle />
    </>
  );
}

export function Scene() {
  const supported = useMemo(() => hasWebGL(), []);

  useEffect(() => {
    if (!supported) store.dispatch(setWebgl("failed"));
  }, [supported]);

  if (!supported) return null;

  const mobile = window.matchMedia("(max-width: 900px)").matches;

  return (
    <Canvas
      key="solar-v2"
      dpr={mobile ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [-0.75, 2.65, 10.2], fov: 34, near: 0.1, far: 40 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#07090d", 1);
      }}
    >
      <Stage />
    </Canvas>
  );
}

export default Scene;
