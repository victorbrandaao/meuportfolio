// Salesforce Portfolio Scripts - Atualizado com projetos reais
document.addEventListener("DOMContentLoaded", () => {
  // Salesforce Projects Data - Projetos reais do GitHub
  const salesforceProjects = [
    {
      id: 1,
      title: "🚀 Salesforce Arc Pilot",
      description:
        "Extensão completa para Chrome que revoluciona o workflow de desenvolvedores Salesforce. Organização inteligente de orgs, busca avançada, analytics dashboard e sincronização na nuvem. Mais de 800+ desenvolvedores já usam!",
      category: ["salesforce", "tools"],
      technologies: ["Chrome Extension", "JavaScript", "Node.js", "Railway", "HTML/CSS"],
      icon: "fas fa-rocket",
      githubUrl: "https://github.com/victorbrandaao/SalesforceArcPilot",
      demoUrl: "https://victorbrandaao.github.io/salesforce-arc-pilot-landing",
      featured: true,
      stats: "⭐ 4.9/5 - 800+ usuários"
    },
    {
      id: 2,
      title: "🎉 Event Management System",
      description:
        "Sistema completo de gerenciamento de eventos construído na plataforma Salesforce. Inclui controle de capacidade, automação de emails, Lightning Web Components dinâmicos e testes com 100% de cobertura.",
      category: ["salesforce"],
      technologies: ["Apex", "Lightning Web Components", "SOQL", "Salesforce Flow", "SLDS"],
      icon: "fas fa-calendar-alt",
      githubUrl: "https://github.com/victorbrandaao/EventManagementSystem",
      featured: true,
      stats: "🧪 100% test coverage"
    },
    {
      id: 3,
      title: "📚 Salesforce Learning Journey",
      description:
        "Documentação completa da minha jornada de aprendizado Salesforce. Projetos práticos, anotações do Trailhead, conceitos aplicados e melhores práticas. Um portfólio transparente do meu crescimento.",
      category: ["salesforce", "automation"],
      technologies: ["Salesforce DX", "Apex", "Flow Builder", "Documentation"],
      icon: "fas fa-graduation-cap",
      githubUrl: "https://github.com/victorbrandaao/salesforce-learning-journey",
      featured: true,
      stats: "📖 Aprendizado contínuo"
    },
    {
      id: 4,
      title: "🔧 File Organizer CLI",
      description:
        "Ferramenta de linha de comando em C# para organização automática de arquivos. Demonstra habilidades em desenvolvimento backend e automação de processos.",
      category: ["tools", "backend"],
      technologies: ["C#", ".NET", "CLI", "File System"],
      icon: "fas fa-folder-open",
      githubUrl: "https://github.com/victorbrandaao/FileOrganizerCli",
      featured: false,
      stats: "⚡ Automação inteligente"
    },
    {
      id: 5,
      title: "🕷️ Web Scraping Process",
      description:
        "Sistema automatizado de Web Scraping desenvolvido em C#. Extração inteligente de dados de sites web com tratamento de erros e processamento assíncrono.",
      category: ["backend", "automation"],
      technologies: ["C#", "Web Scraping", "HTTP Clients", "Data Processing"],
      icon: "fas fa-spider",
      githubUrl: "https://github.com/victorbrandaao/WebScrapingProcess",
      featured: false,
      stats: "🔍 Extração automática"
    },
    {
      id: 6,
      title: "📱 Instagram Follower Tracker",
      description:
        "Ferramenta para monitoramento da lista de seguidores do Instagram. Desenvolvida em C# com interface intuitiva e relatórios detalhados de crescimento.",
      category: ["tools", "backend"],
      technologies: ["C#", "Instagram API", "Data Analysis", "Windows Forms"],
      icon: "fas fa-chart-line",
      githubUrl: "https://github.com/victorbrandaao/InstagramFollowerTracker",
      featured: false,
      stats: "📊 Analytics completo"
    },
    {
      id: 7,
      title: "🛡️ Gunbound Game Guard",
      description:
        "Sistema de proteção contra trapaças para o jogo Gunbound. Projeto que demonstra conhecimentos avançados em segurança de software e detecção de modificações não autorizadas.",
      category: ["tools"],
      technologies: ["C#", "Game Security", "Process Monitoring", "Anti-Cheat"],
      icon: "fas fa-shield-alt",
      githubUrl: "https://github.com/victorbrandaao/GunboundGameGuard",
      featured: false,
      stats: "🛡️ Segurança avançada"
    }
  ];

  // Render Projects
  const renderProjects = () => {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '';

    salesforceProjects.forEach(project => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card fade-in-up';
      projectCard.setAttribute('data-category', project.category.join(' '));

      const featuredBadge = project.featured ? '<div class="featured-badge">⭐ Destaque</div>' : '';
      const statsInfo = project.stats ? `<div class="project-stats">${project.stats}</div>` : '';

      projectCard.innerHTML = `
        ${featuredBadge}
        <div class="project-image">
          <i class="${project.icon}"></i>
        </div>
        <div class="project-content">
          <div class="project-tags">
            ${project.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('')}
          </div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          ${statsInfo}
          <div class="project-links">
            ${project.githubUrl !== '#' ? `<a href="${project.githubUrl}" target="_blank" class="project-link">
              <i class="fab fa-github"></i> GitHub
            </a>` : ''}
            ${project.demoUrl && project.demoUrl !== '#' ? `<a href="${project.demoUrl}" target="_blank" class="project-link">
              <i class="fas fa-external-link-alt"></i> Demo
            </a>` : ''}
          </div>
        </div>
      `;

      projectsGrid.appendChild(projectCard);
    });
  };

  // Project Filtering System
  const initProjectFilters = () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        projectCards.forEach((card) => {
          const categories = card.getAttribute("data-category");

          if (filter === "all" || categories.includes(filter)) {
            card.classList.remove("hidden");
            card.style.display = "block";
          } else {
            card.classList.add("hidden");
            card.style.display = "none";
          }
        });
      });
    });
  };

  // Salesforce Skills Animation
  const animateSalesforceSkills = () => {
    const skillBars = document.querySelectorAll(".skill-progress");

    const animateSkill = (skillBar) => {
      const targetWidth = skillBar.getAttribute("data-width") || "90";
      skillBar.style.width = "0%";

      setTimeout(() => {
        skillBar.style.width = targetWidth + "%";
      }, 300);
    };

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skillBar = entry.target;
            animateSkill(skillBar);
            skillObserver.unobserve(skillBar);
          }
        });
      },
      { threshold: 0.5 }
    );

    skillBars.forEach((skillBar) => {
      skillObserver.observe(skillBar);
    });
  };

  // General Animations
  const initAnimations = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
      observer.observe(el);
    });
  };

  // Theme Toggle Functionality
  const initThemeToggle = () => {
    const themeToggle = document.querySelector(".theme-toggle");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    // Set initial theme
    const currentTheme =
      localStorage.getItem("theme") || (prefersDark.matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", currentTheme);

    if (currentTheme === "light") {
      document.body.classList.add("light-theme");
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.contains("light-theme");

        if (isLight) {
          document.body.classList.remove("light-theme");
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "dark");
          themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
          document.body.classList.add("light-theme");
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "light");
          themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
      });
    }
  };

  // Scroll Progress Indicator
  const initScrollProgress = () => {
    const scrollProgress = document.querySelector(".scroll-progress");

    if (scrollProgress) {
      window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        scrollProgress.style.width = scrollPercent + "%";
      });
    }
  };

  // Navigation Active State
  const initNavigation = () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const nav = document.querySelector(".nav");

    const setActiveNavLink = () => {
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });

      // Add scrolled class to nav
      if (window.pageYOffset > 100) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", setActiveNavLink);

    // Mobile menu toggle
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        
        // Toggle hamburger icon
        const icon = mobileToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      });

      // Close mobile menu when clicking on a link
      const mobileLinks = mobileMenu.querySelectorAll(".nav-link");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.remove("active");
          mobileToggle.querySelector('i').className = 'fas fa-bars';
        });
      });
    }
  };

  // Particles Animation for Salesforce Theme
  const createParticles = () => {
    const particlesContainer = document.querySelector(".particles");

    if (particlesContainer) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 15 + "s";
        particle.style.animationDuration = Math.random() * 10 + 10 + "s";
        particlesContainer.appendChild(particle);
      }
    }
  };

  // Contact Form with Salesforce Integration
  const initContactForm = () => {
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const formButton = contactForm.querySelector(".form-submit");
        const originalText = formButton.innerHTML;

        // Show loading state
        formButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        formButton.disabled = true;

        try {
          // Simulate form submission (replace with actual endpoint)
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Success feedback
          formButton.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
          formButton.style.background = "var(--accent-secondary)";

          // Reset form
          contactForm.reset();

          setTimeout(() => {
            formButton.innerHTML = originalText;
            formButton.disabled = false;
            formButton.style.background = "";
          }, 3000);
        } catch (error) {
          console.error("Erro ao enviar formulário:", error);
          formButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro - Tente novamente';
          formButton.style.background = "#f56565";

          setTimeout(() => {
            formButton.innerHTML = originalText;
            formButton.disabled = false;
            formButton.style.background = "";
          }, 3000);
        }
      });
    }
  };

  // Smooth scroll functionality
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");

        try {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            // Close mobile menu if open
            const mobileMenu = document.querySelector(".mobile-menu");
            if (mobileMenu && mobileMenu.classList.contains("active")) {
              mobileMenu.classList.remove("active");
              const mobileToggle = document.querySelector(".mobile-menu-toggle");
              if (mobileToggle) {
                mobileToggle.querySelector('i').className = 'fas fa-bars';
              }
            }

            // Calculate offset for fixed navigation
            const offset = 80;
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
          } else if (targetId === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } catch (error) {
          console.error(`Erro no scroll suave: ${error.message}`);
        }
      });
    });
  };

  // Initialize all functionality
  renderProjects();
  initProjectFilters();
  initAnimations();
  initSmoothScroll();
  initNavigation();
  initThemeToggle();
  initScrollProgress();
  initContactForm();
  animateSalesforceSkills();
  createParticles();

  // Console message for developers
  console.log(`
    🚀 Victor Brandão - Salesforce Developer Portfolio
    ⚡ Desenvolvedor em aprendizado contínuo
    🔧 Especializado em Salesforce Platform
    
    Projetos em destaque:
    • Salesforce Arc Pilot (800+ usuários)
    • Event Management System (100% test coverage)
    • Salesforce Learning Journey (documentação completa)
    
    Interessado em trabalhar juntos?
    📧 victorbrandaotech@gmail.com
  `);
});
