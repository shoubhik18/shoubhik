// ==========================================
// SHOUBHIK PAN - PROFESSIONAL PORTFOLIO
// Enhanced Interactive Features
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // PAGE LOADER
  // ==========================================
  const pageLoader = document.getElementById("pageLoader");

  window.addEventListener("load", function () {
    setTimeout(() => {
      pageLoader.classList.add("hidden");
      setTimeout(() => {
        if (pageLoader.parentNode) {
          pageLoader.style.display = "none";
        }
      }, 500);
    }, 300);
  });

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursorDot = document.getElementById("cursorDot");
  const cursorOutline = document.getElementById("cursorOutline");

  // Only enable custom cursor on desktop
  if (window.matchMedia("(hover: hover)").matches && cursorDot && cursorOutline) {
    let cursorVisible = false;
    let cursorEnlarged = false;

    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;

    let dotX = endX;
    let dotY = endY;
    let outlineX = endX;
    let outlineY = endY;

    // Show cursor on first mouse move
    document.addEventListener("mousemove", function (e) {
      if (!cursorVisible) {
        cursorDot.classList.add("visible");
        cursorOutline.classList.add("visible");
        cursorVisible = true;
      }

      dotX = e.clientX;
      dotY = e.clientY;
    });

    // Animate cursor with smooth follow
    function animateCursor() {
      // Dot follows immediately
      cursorDot.style.left = dotX + "px";
      cursorDot.style.top = dotY + "px";

      // Outline follows with delay
      outlineX += (dotX - outlineX) * 0.15;
      outlineY += (dotY - outlineY) * 0.15;
      cursorOutline.style.left = outlineX + "px";
      cursorOutline.style.top = outlineY + "px";

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, .btn, .project-card, .skill-tag, .service-card, input, textarea"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursorOutline.classList.add("hover");
      });
      el.addEventListener("mouseleave", () => {
        cursorOutline.classList.remove("hover");
      });
    });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("visible");
      cursorOutline.classList.remove("visible");
      cursorVisible = false;
    });

    document.addEventListener("mouseenter", () => {
      cursorDot.classList.add("visible");
      cursorOutline.classList.add("visible");
      cursorVisible = true;
    });
  }

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ==========================================
  // HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById("header");

  function handleHeaderScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", throttle(handleHeaderScroll, 100));
  handleHeaderScroll(); // Initial check

  // ==========================================
  // SMOOTH SCROLLING FOR NAVIGATION LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");

      if (targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ==========================================
  // STATS COUNTER ANIMATION
  // ==========================================
  const stats = document.querySelectorAll(".stat-number");
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;

    stats.forEach((stat) => {
      const target = parseInt(stat.dataset.target || stat.textContent);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        stat.textContent = current + "+";

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target + "+";
        }
      }

      requestAnimationFrame(updateCounter);
    });

    statsAnimated = true;
  }

  // Trigger stats animation when hero section is in view
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statsObserver.observe(heroSection);
  }

  // ==========================================
  // ACTIVE NAVIGATION HIGHLIGHT
  // ==========================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  function highlightNavigation() {
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", throttle(highlightNavigation, 100));

  // ==========================================
  // PROJECT CARD HOVER EFFECTS
  // ==========================================
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    });
  });

  // ==========================================
  // SKILL TAGS INTERACTION
  // ==========================================
  const skillTags = document.querySelectorAll(".skill-tag, .tech-tag, .service-tag");

  skillTags.forEach((tag) => {
    tag.addEventListener("mouseenter", function () {
      // Add subtle scale effect to siblings
      const siblings = Array.from(this.parentElement.children);
      siblings.forEach((sibling) => {
        if (sibling !== this) {
          sibling.style.opacity = "0.7";
        }
      });
    });

    tag.addEventListener("mouseleave", function () {
      const siblings = Array.from(this.parentElement.children);
      siblings.forEach((sibling) => {
        sibling.style.opacity = "1";
      });
    });
  });

  // ==========================================
  // CONTACT FORM HANDLING (Formspree Integration)
  // ==========================================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Show loading state
      submitBtn.innerHTML = '<span class="loading"></span> Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      try {
        // Send form data to Formspree
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // Success - form submitted
          showNotification("success", "Message sent successfully! I'll get back to you soon. 🎉");
          contactForm.reset();
        } else {
          // Formspree returned an error
          const data = await response.json();
          if (data.errors) {
            showNotification("error", data.errors.map(err => err.message).join(", "));
          } else {
            showNotification("error", "Oops! Something went wrong. Please try again.");
          }
        }
      } catch (error) {
        // Network error
        showNotification("error", "Network error. Please check your connection and try again.");
      } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    });
  }

  // ==========================================
  // NOTIFICATION SYSTEM
  // ==========================================
  function showNotification(type, message) {
    // Remove any existing notifications
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 24px;
      background: ${type === "success" ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)" : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)"};
      color: #0a0a0b;
      padding: 20px 28px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 400px;
      font-weight: 600;
      font-size: 15px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 500);
    }, 5000);
  }

  // Add notification animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(120%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(120%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // ==========================================
  // TYPING EFFECT (Optional Enhancement)
  // ==========================================
  const typingElements = document.querySelectorAll('[data-typing]');
  
  typingElements.forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    let i = 0;

    function typeWriter() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
      }
    }

    // Start typing when element is in view
    const typingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeWriter();
            typingObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    typingObserver.observe(el);
  });

  // ==========================================
  // PARALLAX EFFECT FOR FLOATING BADGES
  // ==========================================
  const floatingBadges = document.querySelectorAll(".floating-badge");

  if (floatingBadges.length > 0 && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("mousemove", throttle(function (e) {
      const mouseX = e.clientX / window.innerWidth - 0.5;
      const mouseY = e.clientY / window.innerHeight - 0.5;

      floatingBadges.forEach((badge, index) => {
        const speed = (index + 1) * 10;
        const x = mouseX * speed;
        const y = mouseY * speed;
        badge.style.transform = `translate(${x}px, ${y}px)`;
      });
    }, 16));
  }

  // ==========================================
  // RESUME DOWNLOAD HANDLER
  // ==========================================
  const downloadResumeBtn = document.getElementById("downloadResume");

  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      
      // Show notification since resume file doesn't exist yet
      showNotification("success", "Resume download will be available soon!");
      
      // When you have a resume file, uncomment this:
      // const link = document.createElement('a');
      // link.href = 'path/to/resume.pdf';
      // link.download = 'Shoubhik_Pan_Resume.pdf';
      // link.click();
    });
  }

  // ==========================================
  // SMOOTH SCROLL PROGRESS INDICATOR (Optional)
  // ==========================================
  function createScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981, #34d399);
      z-index: 9999;
      transition: width 0.1s ease-out;
      width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", throttle(function () {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = scrollPercent + "%";
    }, 16));
  }

  createScrollProgress();

  // ==========================================
  // CONSOLE MESSAGE
  // ==========================================
  console.log(
    "%c👋 Hello, Developer!",
    "color: #10b981; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"
  );
  console.log(
    "%c🚀 Interested in the code? Check out my GitHub: https://github.com/shoubhik18",
    "color: #a1a1aa; font-size: 14px;"
  );
  console.log(
    "%c✨ Let's build something amazing together!",
    "color: #34d399; font-size: 14px; font-style: italic;"
  );
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lerp function for smooth animations
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}
