// Modern Salesforce Portfolio - Enhanced with External Libraries
document.addEventListener("DOMContentLoaded", () => {
  // Initialize loading screen
  initLoadingScreen();
  
  // Initialize external libraries
  initExternalLibraries();
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
      
      // Add data-repo attribute for GitHub API integration
      if (project.githubUrl && project.githubUrl.includes('github.com')) {
        const repoName = project.githubUrl.split('/').pop();
        projectCard.setAttribute('data-repo', repoName);
      }

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

  // Salesforce Skills Animation (simplified for inline layout)
  const animateSalesforceSkills = () => {
    const skillItems = document.querySelectorAll(".skill-item");

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.opacity = '1';
          }
        });
      },
      { threshold: 0.5 }
    );

    skillItems.forEach((item) => {
      item.style.transform = 'translateY(20px)';
      item.style.opacity = '0';
      item.style.transition = 'all 0.5s ease';
      skillObserver.observe(item);
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
  initGitHubAPI();

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

  // Loading Screen Functions
  function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.querySelector('.loading-bar');
    
    if (!loadingScreen) return;

    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      
      if (loadingBar) {
        loadingBar.style.width = progress + '%';
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          // Initialize AOS after loading
          if (typeof AOS !== 'undefined') {
            AOS.refresh();
          }
        }, 500);
      }
    }, 100);
  }

  // External Libraries Initialization
  function initExternalLibraries() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
      });
    }

    // Initialize Typed.js for hero subtitle
    if (typeof Typed !== 'undefined') {
      const typedElement = document.querySelector('.typed-text');
      if (typedElement) {
        new Typed('.typed-text', {
          strings: [
            'Salesforce Developer em Formação',
            'Apex & Lightning Web Components',
            'Criador do Salesforce Arc Pilot',
            'Apaixonado por Tecnologia'
          ],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 2000,
          loop: true,
          showCursor: false
        });
      }

      // Loading screen typed text
      const typedLoading = document.querySelector('.typed-loading');
      if (typedLoading) {
        new Typed('.typed-loading', {
          strings: [
            'Carregando portfolio...',
            'Preparando experiência...',
            'Quase pronto!'
          ],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 1000,
          loop: true,
          showCursor: false
        });
      }
    }

    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#0070f3' },
          shape: { type: 'circle' },
          opacity: { value: 0.3, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#0070f3',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      });
    }

    // Initialize GSAP animations
    if (typeof gsap !== 'undefined') {
      // Hero image animation
      gsap.from('.hero-image img', {
        duration: 1.5,
        scale: 0.8,
        opacity: 0,
        ease: 'back.out(1.7)',
        delay: 0.5
      });

      // Cards hover animation
      const cards = document.querySelectorAll('.glass-card, .project-card, .contact-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            duration: 0.3,
            y: -10,
            scale: 1.02,
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            duration: 0.3,
            y: 0,
            scale: 1,
            ease: 'power2.out'
          });
        });
      });
    }
  }



  // GitHub API Integration with cache and error handling
  function initGitHubAPI() {
    const githubUsername = 'victorbrandaao';
    const cacheKey = 'github_data_cache';
    const cacheExpiry = 1000 * 60 * 60; // 1 hour cache
    
    // Check for cached data
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < cacheExpiry) {
        updateProjectsWithGitHubData(data.repos);
        return;
      }
    }

    // Fetch GitHub repositories
    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=20`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        return response.json();
      })
      .then(repos => {
        // Cache the data
        localStorage.setItem(cacheKey, JSON.stringify({
          data: { repos },
          timestamp: Date.now()
        }));
        
        updateProjectsWithGitHubData(repos);
      })
      .catch(error => {
        console.warn('GitHub API error (using fallback data):', error);
        // Use fallback/demo data if API fails
        updateProjectsWithFallbackData();
      });
  }

  function updateProjectsWithGitHubData(repos) {
    // Filter and enhance existing projects with real GitHub data
    const projectRepoMapping = {
      'SalesforceArcPilot': 'salesforce-arc-pilot',
      'EventManagementSystem': 'event-management-system', 
      'salesforce-learning-journey': 'salesforce-learning-journey'
    };

    // Update existing project stats
    Object.keys(projectRepoMapping).forEach(projectKey => {
      const repoName = projectRepoMapping[projectKey];
      const repo = repos.find(r => r.name.toLowerCase().includes(repoName.toLowerCase()) || 
                                  r.name === projectKey);
      
      if (repo) {
        const projectCard = document.querySelector(`[data-repo="${projectKey}"]`);
        if (projectCard) {
          const statsElement = projectCard.querySelector('.project-stats');
          if (statsElement) {
            statsElement.innerHTML = `⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks | ${repo.language || 'Multiple'}`;
          }
        }
      }
    });

    // Add additional real repositories from GitHub
    addGitHubRepositories(repos);
  }

  function addGitHubRepositories(repos) {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    // Filter out repos that are already displayed and get interesting ones
    const existingRepos = ['SalesforceArcPilot', 'EventManagementSystem', 'salesforce-learning-journey'];
    const newRepos = repos.filter(repo => 
      !repo.fork && 
      repo.stargazers_count >= 0 &&
      !existingRepos.some(existing => repo.name.toLowerCase().includes(existing.toLowerCase()))
    ).slice(0, 3); // Add up to 3 additional repos

    newRepos.forEach(repo => {
      const projectCard = createGitHubProjectCard(repo);
      projectsGrid.appendChild(projectCard);
    });
  }

  function createGitHubProjectCard(repo) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card fade-in-up';
    projectCard.setAttribute('data-category', 'backend tools');
    
    // Determine icon based on language
    const languageIcons = {
      'JavaScript': 'fab fa-js-square',
      'TypeScript': 'fab fa-js-square', 
      'Python': 'fab fa-python',
      'C#': 'fas fa-code',
      'HTML': 'fab fa-html5',
      'CSS': 'fab fa-css3-alt',
      'Java': 'fab fa-java'
    };
    
    const icon = languageIcons[repo.language] || 'fas fa-code';
    const description = repo.description || 'Projeto desenvolvido em ' + (repo.language || 'múltiplas linguagens');
    
    projectCard.innerHTML = `
      <div class="project-image">
        <i class="${icon}"></i>
      </div>
      <div class="project-content">
        <div class="project-tags">
          ${repo.language ? `<span class="project-tag">${repo.language}</span>` : ''}
          <span class="project-tag">GitHub</span>
        </div>
        <h3 class="project-title">${repo.name}</h3>
        <p class="project-description">${description}</p>
        <div class="project-stats">⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks</div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" class="project-link">
            <i class="fab fa-github"></i> GitHub
          </a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="project-link">
            <i class="fas fa-external-link-alt"></i> Demo
          </a>` : ''}
        </div>
      </div>
    `;

    return projectCard;
  }

  function updateProjectsWithFallbackData() {
    // Fallback data when GitHub API is not available
    const fallbackStats = {
      'SalesforceArcPilot': '⭐ 5 stars | 🍴 2 forks | JavaScript',
      'EventManagementSystem': '⭐ 3 stars | 🍴 1 forks | Apex', 
      'salesforce-learning-journey': '⭐ 8 stars | 🍴 3 forks | Documentation'
    };

    Object.keys(fallbackStats).forEach(projectKey => {
      const projectCard = document.querySelector(`[data-repo="${projectKey}"]`);
      if (projectCard) {
        const statsElement = projectCard.querySelector('.project-stats');
        if (statsElement) {
          statsElement.innerHTML = fallbackStats[projectKey];
        }
      }
    });
  }
});
