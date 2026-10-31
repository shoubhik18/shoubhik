import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ChapterId } from "@/lib/scroll";

export type WebglStatus = "pending" | "ready" | "failed" | "reduced";

type UiState = {
  menuOpen: boolean;
  webgl: WebglStatus;
  activeChapter: ChapterId;
  activeProject: number;
  hoveredProject: number | null;
  caseId: string | null;
};

const initialState: UiState = {
  menuOpen: false,
  webgl: "pending",
  activeChapter: "hero",
  activeProject: 0,
  hoveredProject: null,
  caseId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMenuOpen(state, action: PayloadAction<boolean>) {
      state.menuOpen = action.payload;
    },
    setWebgl(state, action: PayloadAction<WebglStatus>) {
      state.webgl = action.payload;
    },
    setChapter(state, action: PayloadAction<ChapterId>) {
      state.activeChapter = action.payload;
    },
    setActiveProject(state, action: PayloadAction<number>) {
      state.activeProject = action.payload;
    },
    setHoveredProject(state, action: PayloadAction<number | null>) {
      state.hoveredProject = action.payload;
    },
    openCase(state, action: PayloadAction<string>) {
      state.caseId = action.payload;
      state.menuOpen = false;
    },
    closeCase(state) {
      state.caseId = null;
    },
  },
});

export const {
  setMenuOpen,
  setWebgl,
  setChapter,
  setActiveProject,
  setHoveredProject,
  openCase,
  closeCase,
} = uiSlice.actions;

export default uiSlice.reducer;
