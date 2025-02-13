// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    // GitHub Projects Loader
    const loadProjects = async () => {
        try {
            const response = await fetch('https://api.github.com/users/victorbrandaao/repos?sort=updated');
            const data = await response.json();
            const container = document.getElementById('projects-container');
            
            const projects = data.filter(repo => 
                !repo.fork && repo.description
            ).slice(0, 6);

            container.innerHTML = projects.map(project => `
                <div class="project-card">
                    <div class="project-image">
                        <div class="project-badge">${project.language || 'Code'}</div>
                    </div>
                    <div class="project-info">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            <span class="tag">${project.archived ? 'Archived' : 'Active'}</span>
                            <span class="tag"><i class="fas fa-star"></i> ${project.stargazers_count}</span>
                            <span class="tag"><i class="fas fa-code-branch"></i> ${project.forks}</span>
                        </div>
                        <a href="${project.html_url}" target="_blank" class="btn">
                            Ver Projeto <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading projects:', error);
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Projetos não disponíveis no momento</p>
                </div>
            `;
        }
    };

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('xyz-in');
                entry.target.style.opacity = 1;
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.xyz-in').forEach(element => {
        element.style.opacity = 0;
        observer.observe(element);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    loadProjects();
});