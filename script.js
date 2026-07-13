document.addEventListener('DOMContentLoaded', () => {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const text = 'SITES WORTH HIRING FOR';
    const typingElement = document.querySelector('.typing-effect');
    let index = 0;

    function typeWriter() {
        if (!typingElement) return;
        if (index < text.length) {
            typingElement.innerHTML =
                text.substring(0, index + 1) + '<span class="blinking-cursor">_</span>';
            index += 1;
            setTimeout(typeWriter, 70);
        } else {
            // Keep the trailing underscore blinking like a terminal cursor.
            typingElement.innerHTML = text + '<span class="blinking-cursor">_</span>';
        }
    }

    setTimeout(typeWriter, 600);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
    document.querySelectorAll('.glitch-link').forEach(link => {
        link.addEventListener('mouseover', event => {
            let iterations = 0;
            const originalText = link.dataset.text;
            if (!originalText) return;

            const interval = setInterval(() => {
                event.target.innerText = originalText
                    .split('')
                    .map((letter, i) => {
                        if (i < iterations) return originalText[i];
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iterations >= originalText.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    });

    const siteTypes = [
        {
            index: '01',
            title: 'Personal / Portfolio',
            desc: 'A sharp one-pager or short multi-page site that presents you or your work — brand-first, fast, and easy to update.',
            meta: 'GitHub Pages · Cloudflare Pages',
            accent: '#3de0d0'
        },
        {
            index: '02',
            title: 'Small Business',
            desc: 'Services, hours, contact, and trust — a clean public face for a local business or solo practice.',
            meta: 'Static · SEO-ready · mobile-first',
            accent: '#ff4d8d'
        },
        {
            index: '03',
            title: 'Product Landing',
            desc: 'One job: explain the product and convert. Hero, proof, pricing or waitlist, clear CTA.',
            meta: 'Campaign-ready · analytics-friendly',
            accent: '#f0a46a'
        },
        {
            index: '04',
            title: 'Event / Campaign',
            desc: 'Time-bound pages for launches, events, or announcements — focused story, strong visual anchor.',
            meta: 'Fast ship · short lifespan OK',
            accent: '#8ad4ff'
        }
    ];

    const typesGrid = document.getElementById('types-grid');
    if (typesGrid) {
        siteTypes.forEach(type => {
            const card = document.createElement('article');
            card.className = 'type-card';
            card.style.setProperty('--type-accent', type.accent);
            card.innerHTML = `
                <span class="type-card__index">${type.index}</span>
                <h3 class="type-card__title">${type.title}</h3>
                <p class="type-card__desc">${type.desc}</p>
                <p class="type-card__meta">${type.meta}</p>
            `;
            typesGrid.appendChild(card);
        });
    }

    const projects = [
        {
            title: 'CATAMIST',
            desc: 'AI-powered news platform that aggregates global stories and uses LLMs for neutral, concise summaries.',
            tech: ['Ruby on Rails 8', 'PostgreSQL', 'Gemini AI', 'Self-hosted Docker'],
            link: 'https://github.com/JoshBubis/catamist',
            liveSystem: 'https://catamist.com'
        },
        {
            title: 'HACKYCHAT',
            desc: 'Real-time web chat with a Chrome extension, Rails API, and React frontend.',
            tech: ['Rails API', 'React', 'ActionCable', 'Redis'],
            link: 'https://github.com/JoshBubis/hackychat',
            liveSystem: 'https://hacky.chat'
        },
        {
            title: 'RELAYRA',
            desc: 'AI phone receptionist for inbound calls, appointments, and Stripe billing.',
            tech: ['Node.js', 'Twilio', 'Deepgram', 'Stripe'],
            link: 'https://github.com/JoshBubis/relayra',
            liveSystem: 'https://relayra.com'
        }
    ];

    const projectsContainer = document.getElementById('projects-grid');
    if (projectsContainer) {
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const title = document.createElement('h3');
            title.className = 'project-title';
            title.textContent = project.title;
            card.appendChild(title);

            const desc = document.createElement('p');
            desc.className = 'project-desc';
            desc.textContent = project.desc;
            card.appendChild(desc);

            const techStack = document.createElement('div');
            techStack.className = 'tech-stack';
            project.tech.forEach(tech => {
                const tag = document.createElement('span');
                tag.className = 'tech-tag';
                tag.textContent = tech;
                techStack.appendChild(tag);
            });
            card.appendChild(techStack);

            const linksContainer = document.createElement('div');
            linksContainer.className = 'project-links';

            const codeLink = document.createElement('a');
            codeLink.href = project.link;
            codeLink.target = '_blank';
            codeLink.rel = 'noopener noreferrer';
            codeLink.textContent = '[ CODE ]';
            linksContainer.appendChild(codeLink);

            const liveLink = document.createElement('a');
            liveLink.href = project.liveSystem;
            liveLink.target = '_blank';
            liveLink.rel = 'noopener noreferrer';
            liveLink.textContent = '[ LIVE_SITE ]';
            linksContainer.appendChild(liveLink);

            card.appendChild(linksContainer);
            projectsContainer.appendChild(card);
        });
    }
});
