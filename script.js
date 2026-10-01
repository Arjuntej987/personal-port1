/**
 * Mittireddi Teja — Modern Portfolio Interactive Scripts
 */

document.addEventListener("DOMContentLoaded", () => {
  // ---------- 1. THEME CONTROLLER ----------
  const htmlRoot = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    htmlRoot.setAttribute("data-theme", theme);
    if (themeMeta) {
      themeMeta.setAttribute("content", theme === "dark" ? "#08090f" : "#f8fafc");
    }
  }

  // Initial theme detection
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("teja_portfolio_theme");
  } catch (e) {}

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "dark"); // Dark by default for max visual impact
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem("teja_portfolio_theme", nextTheme);
      } catch (e) {}
      showToast(`Switched to ${nextTheme} mode`);
    });
  }

  // ---------- 2. BACKGROUND CONSTELLATION CANVAS ----------
  const canvas = document.getElementById("bg-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55);
    const maxDistance = 130;

    let mouse = { x: -1000, y: -1000, radius: 120 };

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.size = Math.random() * 2 + 1;
        this.color = Math.random() > 0.4 ? "rgba(99, 102, 241, " : "rgba(6, 182, 212, ";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse gentle repulsion
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + "0.6)";
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId;
    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(renderCanvas);
    }

    // Run animation when page is visible
    renderCanvas();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        renderCanvas();
      }
    });
  }

  // ---------- 3. TYPEWRITER EFFECT ----------
  const typingElement = document.getElementById("typing-text");
  if (typingElement) {
    const roles = [
      "Frontend Web Development",
      "React & Modern JavaScript",
      "AI-Assisted Workflows",
      "Pixel-Perfect UI/UX Design",
      "High-Performance Web Apps"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 38 : 75;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400; // Pause before typing next word
      }

      setTimeout(typeLoop, speed);
    }
    typeLoop();
  }

  // ---------- 5. HEADER SCROLL & ACTIVE SCROLL-SPY ----------
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Header styling
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById("btn-back-to-top");
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    // Scroll spy
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 140;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }
  window.addEventListener("scroll", handleScroll);

  // Back to top click
  const backToTopBtn = document.getElementById("btn-back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- 6. MOBILE DRAWER NAVIGATION ----------
  const menuBtn = document.getElementById("menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const drawerCloseBtn = document.getElementById("drawer-close");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add("open");
      document.body.style.overflow = "hidden";
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    }
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove("open");
      document.body.style.overflow = "";
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    }
  }

  if (menuBtn) menuBtn.addEventListener("click", openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeDrawer);
  if (mobileDrawer) {
    mobileDrawer.addEventListener("click", (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }
  drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));

  // ---------- 7. 3D HERO CARD MOUSE TILT ----------
  const tiltCard = document.getElementById("hero-tilt-card");
  if (tiltCard && window.innerWidth > 1024) {
    tiltCard.addEventListener("mousemove", (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    tiltCard.addEventListener("mouseleave", () => {
      tiltCard.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  }

  // ---------- 8. ANIMATED STATS COUNTER ----------
  const statNumbers = document.querySelectorAll(".stat-number");
  let hasAnimatedStats = false;

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedStats) {
          hasAnimatedStats = true;
          statNumbers.forEach((el) => {
            const target = parseInt(el.getAttribute("data-target"), 10) || 0;
            let current = 0;
            const duration = 1500;
            const increment = target / (duration / 25);

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
              } else {
                el.textContent = Math.floor(current);
              }
            }, 25);
          });
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.querySelector(".stats-bar-section");
  if (statsSection) statsObserver.observe(statsSection);

  // ---------- 9. SKILLS FILTER TABS ----------
  const skillTabs = document.querySelectorAll(".skill-tab");
  const skillCards = document.querySelectorAll(".skill-card");

  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      skillTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      skillCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // ---------- 10. PROJECTS FILTER BUTTONS ----------
  const projFilterBtns = document.querySelectorAll(".proj-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  projFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      projFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // ---------- 11. MODAL WINDOWS (PROJECTS & RESUME) ----------
  const modalTriggers = document.querySelectorAll("[data-modal]");
  const modalBackdrops = document.querySelectorAll(".modal-backdrop");
  const modalCloseBtns = document.querySelectorAll(".modal-close-btn, .modal-dismiss");

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  modalTriggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute("data-modal");
      openModal(modalId);
    });
  });

  // Resume button triggers
  const btnViewResume = document.getElementById("btn-view-resume");
  if (btnViewResume) {
    btnViewResume.addEventListener("click", () => {
      openModal("modal-resume");
    });
  }

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-backdrop");
      closeModal(modal);
    });
  });

  modalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modalBackdrops.forEach((m) => closeModal(m));
      closeDrawer();
    }
  });

  // Print Resume — opens isolated popup with only resume content
  const btnPrintResume = document.getElementById("btn-print-resume");
  if (btnPrintResume) {
    btnPrintResume.addEventListener("click", () => {
      const resumeContent = document.getElementById("printable-resume");
      if (!resumeContent) return;

      const printWindow = window.open("", "_blank", "width=900,height=700");
      printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mittireddi Teja — Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 12px;
      color: #111;
      background: #fff;
      padding: 32px 40px;
      line-height: 1.55;
    }
    .res-head { text-align: center; border-bottom: 2px solid #6366f1; padding-bottom: 14px; margin-bottom: 18px; }
    .res-head h1 { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #111; margin-bottom: 4px; }
    .res-sub { font-size: 13px; color: #555; margin-bottom: 10px; }
    .res-contact-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px 20px; font-size: 11.5px; color: #444; }
    .res-section { margin-bottom: 18px; }
    .res-sec-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #6366f1;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }
    .res-section p { color: #333; }
    .res-skills-list { display: grid; grid-template-columns: 1fr 1fr; gap: 5px 20px; }
    .res-skills-list div { color: #333; }
    .res-skills-list strong { color: #111; }
    .res-item { margin-bottom: 12px; }
    .res-item-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 5px;
    }
    .res-item-head strong { font-size: 12.5px; color: #111; }
    .res-item-head a { color: #6366f1; font-size: 11px; text-decoration: none; }
    .res-item-date { font-size: 11px; color: #666; }
    .res-item-bullets { padding-left: 18px; color: #333; }
    .res-item-bullets li { margin-bottom: 3px; }
    .res-item > p { color: #444; margin-top: 3px; }
    @page { margin: 0; size: A4 portrait; }
    @media print {
      body { padding: 15mm 18mm; }
    }
  </style>
</head>
<body>
${resumeContent.innerHTML}
</body>
</html>`);
      printWindow.document.close();
      printWindow.focus();
      // Small delay to let content render before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 400);
    });
  }

  // ---------- 12. 1-CLICK CLIPBOARD COPY ----------
  const copyButtons = document.querySelectorAll(".btn-copy-chip");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.classList.add("copied");
        btn.innerHTML = `<span>Copied! ✓</span>`;
        showToast(`Copied "${textToCopy}" to clipboard!`);

        setTimeout(() => {
          btn.classList.remove("copied");
          btn.innerHTML = originalText;
        }, 2200);
      } catch (err) {
        showToast("Press Ctrl+C to copy");
      }
    });
  });

  // Toast Notification helper
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // ---------- 13. CONTACT FORM VALIDATION & SUBMISSION ----------
  const contactForm = document.getElementById("contact-form");
  const messageInput = document.getElementById("contact-message");
  const charCounter = document.getElementById("char-counter");
  const formFeedback = document.getElementById("form-feedback");

  if (messageInput && charCounter) {
    messageInput.addEventListener("input", () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 1000`;
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("contact-name");
      const emailInput = document.getElementById("contact-email");
      const subjectInput = document.getElementById("contact-subject");
      const nameError = document.getElementById("name-error");
      const emailError = document.getElementById("email-error");
      const messageError = document.getElementById("message-error");

      // Reset errors
      nameError.textContent = "";
      emailError.textContent = "";
      messageError.textContent = "";
      formFeedback.textContent = "";
      formFeedback.className = "form-feedback";

      let isValid = true;

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput.value.trim();
      const messageVal = messageInput.value.trim();
      const subjectVal = subjectInput ? subjectInput.value : "Portfolio Inquiry";

      if (!nameVal) {
        nameError.textContent = "Please enter your name.";
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal) {
        emailError.textContent = "Please enter your email address.";
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        emailError.textContent = "Please enter a valid email format.";
        isValid = false;
      }

      if (!messageVal) {
        messageError.textContent = "Please write a message.";
        isValid = false;
      } else if (messageVal.length < 10) {
        messageError.textContent = "Message should be at least 10 characters.";
        isValid = false;
      }

      if (!isValid) return;

      // Submit feedback animation
      const submitBtn = document.getElementById("btn-submit-form");
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Preparing Email Client...</span>`;

      setTimeout(() => {
        formFeedback.textContent = "✓ Opening your email client to dispatch message...";
        formFeedback.classList.add("success");
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;

        // Open mailto link
        const mailtoLink = `mailto:arjuntej121@gmail.com?subject=${encodeURIComponent(
          `[Portfolio] ${subjectVal} from ${nameVal}`
        )}&body=${encodeURIComponent(
          `${messageVal}\n\n---\nSender Details:\nName: ${nameVal}\nEmail: ${emailVal}\nInquiry Type: ${subjectVal}`
        )}`;

        window.location.href = mailtoLink;
      }, 700);
    });
  }

  // ---------- 14. DYNAMIC CURRENT YEAR ----------
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
