document.addEventListener('DOMContentLoaded', () => {
    console.log('SYSTEM_INITIALIZED...');

    // Typing Effect for Hero
    const text = "ARCHITECTING INTELLIGENCE_";
    const typingElement = document.querySelector('.typing-effect');
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            typingElement.innerHTML = text.substring(0, index + 1) + '<span class="blinking-cursor">|</span>';
            index++;
            setTimeout(typeWriter, 100); // Speed
        } else {
            typingElement.innerHTML = text; // Remove cursor at end
        }
    }

    // Start typing after a slight delay
    setTimeout(typeWriter, 1000);

    // Glitch Effect on Hover (Random characters)
    const glitchLinks = document.querySelectorAll('.glitch-link');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

    glitchLinks.forEach(link => {
        link.addEventListener('mouseover', event => {
            let iterations = 0;
            const originalText = link.dataset.text;

            const interval = setInterval(() => {
                event.target.innerText = originalText
                    .split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('');

                if (iterations >= originalText.length) {
                    clearInterval(interval);
                }

                iterations += 1 / 3;
            }, 30);
        });
    });

    // --- Project Data Injection ---
    const projects = [
        {
            title: "CATAMIST",
            desc: "AI-powered news summarization platform. Aggregates global news and uses LLMs to generate neutral, concise summaries.",
            tech: ["Ruby on Rails 8", "PostgreSQL", "Gemini AI", "Heroku"],
            link: "https://github.com/JoshBubis/catamist"
        },
        {
            title: "HACKYCHAT",
            desc: "Real-time chat platform overlay for the web. Chrome extension + Rails API + React Frontend monorepo.",
            tech: ["Rails API", "React", "ActionCable", "Redis"],
            link: "https://github.com/JoshBubis/hackychat"
        },
        {
            title: "RELAYRA",
            desc: "AI Phone Receptionist. Handles inbound calls, schedules appointments, and manages billing via Stripe.",
            tech: ["Node.js", "Twilio", "Deepgram", "Stripe"],
            link: "https://github.com/JoshBubis/relayra"
        },
        {
            title: "WHITE HAT SCANNER",
            desc: "Security research tool to detect credential leaks in git history. Includes entropy scanning and real-time GitHub firehose monitoring.",
            tech: ["Python", "Git", "Entropy Analysis", "GitHub API"],
            link: "https://github.com/JoshBubis/whitehat_scanner"
        }
    ];

    const projectsContainer = document.querySelector('.projects-grid');

    if (projectsContainer) {
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';

            const techTags = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');

            card.innerHTML = `
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.desc}</p>
                <div class="tech-stack">${techTags}</div>
                <div class="project-links">
                    <a href="${project.link}" target="_blank">[ VIEW_CODE ]</a>
                    <a href="#" onclick="alert('Demo coming soon')">[ LIVE_SYSTEM ]</a>
                </div>
            `;

            projectsContainer.appendChild(card);
        });
    }
});
