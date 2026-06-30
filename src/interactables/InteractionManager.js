// ============================================
// Interaction Manager — Proximity & UI
// ============================================

import { PORTFOLIO } from '../config.js';

export class InteractionManager {
  constructor(inputManager) {
    this.input = inputManager;
    this.interactables = []; // { position: {x,y,z}, radius, label, contentKey, onInteract }
    this.activeInteractable = null;
    this.panelOpen = false;
    
    this.promptEl = document.getElementById('interaction-prompt');
    this.promptText = document.getElementById('prompt-text');
    this.panelEl = document.getElementById('content-panel');
    this.panelBody = document.getElementById('content-body');
    this.closeBtn = document.getElementById('content-close');
    
    this.closeBtn.addEventListener('click', () => this.closePanel());
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && this.panelOpen) this.closePanel();
    });
  }

  register(x, y, z, radius, label, contentKey) {
    this.interactables.push({ position: { x, y, z }, radius, label, contentKey });
  }

  update(playerPos) {
    if (this.panelOpen) return;
    
    let closest = null;
    let closestDist = Infinity;
    
    for (const item of this.interactables) {
      const dx = playerPos.x - item.position.x;
      const dy = playerPos.y - item.position.y;
      const dz = playerPos.z - item.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (dist < item.radius && dist < closestDist) {
        closest = item;
        closestDist = dist;
      }
    }
    
    if (closest) {
      this.activeInteractable = closest;
      this.promptEl.style.display = 'flex';
      this.promptText.textContent = closest.label;
      
      if (this.input.isKeyOnce('KeyE')) {
        this.openPanel(closest.contentKey);
      }
    } else {
      this.activeInteractable = null;
      this.promptEl.style.display = 'none';
    }
  }

  openPanel(contentKey) {
    this.panelOpen = true;
    this.promptEl.style.display = 'none';
    this.panelEl.style.display = 'block';
    this.panelBody.innerHTML = this.getContentHTML(contentKey);
    
    // Exit pointer lock so user can interact with panel
    document.exitPointerLock();
  }

  closePanel() {
    this.panelOpen = false;
    this.panelEl.style.display = 'none';
    this.panelBody.innerHTML = '';
  }

  getContentHTML(key) {
    const P = PORTFOLIO;
    
    switch (key) {
      case 'about_me':
        return `
          <h2>${P.about.title}</h2>
          <p>${P.about.description}</p>
          <h3>My Roles</h3>
          <div>${P.roles.map(r => `<span class="tag">${r}</span>`).join('')}</div>
        `;
      
      case 'personal_story':
        return `
          <h2>MY STORY</h2>
          <p>${P.about.story}</p>
        `;
      
      case 'download_resume':
        return `
          <h2>RESUME</h2>
          <p>Download my resume to learn more about my experience and qualifications.</p>
          <a href="${P.contact.resume.url}" class="contact-link" target="_blank">
            <span class="link-icon">📄</span>
            <div>
              <strong>Download Resume</strong>
              <p style="margin:0;font-size:0.75rem;">PDF Format</p>
            </div>
          </a>
        `;

      case 'frontend_skills':
        return this._skillsHTML(P.skills.frontend);
      case 'backend_skills':
        return this._skillsHTML(P.skills.backend);
      case 'database_skills':
        return this._skillsHTML(P.skills.database);
      case 'devops_cloud':
        return this._skillsHTML(P.skills.devops);

      case 'project_0':
      case 'project_1':
      case 'project_2':
      case 'project_3':
        const idx = parseInt(key.split('_')[1]);
        const proj = P.projects[idx];
        return `
          <h2>${proj.title.toUpperCase()}</h2>
          <p>${proj.description}</p>
          <h3>Tech Stack</h3>
          <div>${proj.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        `;

      case 'achievements':
        return `
          <h2>ACHIEVEMENTS & CERTIFICATIONS</h2>
          ${P.achievements.map(a => `
            <div class="project-card">
              <h3>${a.title}</h3>
              <p style="font-size:0.75rem;color:var(--color-accent);margin-bottom:0.5rem;">${a.issuer}</p>
              <p>${a.description}</p>
            </div>
          `).join('')}
        `;

      case 'timeline':
        return `
          <h2>MY JOURNEY</h2>
          ${P.timeline.map(t => `
            <div class="timeline-item">
              <h3>${t.icon} ${t.phase}</h3>
              <p style="font-size:0.75rem;color:var(--color-accent);">${t.period}</p>
              <p>${t.description}</p>
            </div>
          `).join('')}
        `;

      case 'tech_showcase':
        return `
          <h2>TECHNOLOGY SHOWCASE</h2>
          ${Object.values(P.techShowcase).map(section => `
            <h3>${section.title}</h3>
            <div>${section.items.map(i => `<span class="tag">${i}</span>`).join('')}</div>
          `).join('')}
        `;

      case 'learning':
        return `
          <h2>KNOWLEDGE BASE</h2>
          ${P.learning.map(l => `
            <div class="project-card" style="border-left: 3px solid ${l.color};">
              <h3>${l.title}</h3>
              <span class="tag">${l.short}</span>
            </div>
          `).join('')}
        `;

      case 'contact':
        return `
          <h2>CONTACT ME</h2>
          <p>Let's connect! Feel free to reach out through any of these channels.</p>
          ${Object.values(P.contact).map(c => `
            <a href="${c.url}" class="contact-link" target="_blank">
              <span class="link-icon">${c.icon}</span>
              <strong>${c.label}</strong>
            </a>
          `).join('')}
        `;

      case 'secret_room':
        return `
          <h2>🔓 SECRET ROOM UNLOCKED!</h2>
          <h3>Fun Facts</h3>
          <ul>${P.secretRoom.funFacts.map(f => `<li style="color:var(--color-text-dim);margin-bottom:0.5rem;">${f}</li>`).join('')}</ul>
          <h3>Dev Setup</h3>
          <p>${P.secretRoom.devSetup}</p>
          <h3>Future Projects</h3>
          <div>${P.secretRoom.futureProjects.map(p => `<span class="tag">${p}</span>`).join('')}</div>
          <h3>Hidden Achievements</h3>
          <div>${P.secretRoom.hiddenAchievements.map(a => `<span class="tag">${a}</span>`).join('')}</div>
        `;

      default:
        return `<h2>CONTENT</h2><p>Interactive content for ${key}</p>`;
    }
  }

  _skillsHTML(skillGroup) {
    return `
      <h2>${skillGroup.title.toUpperCase()}</h2>
      ${skillGroup.items.map(s => `
        <div>
          <div style="display:flex;justify-content:space-between;margin-top:0.8rem;">
            <span style="font-size:0.85rem;">${s.name}</span>
            <span style="font-size:0.75rem;color:var(--color-accent);">${s.level}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-bar-fill" style="width:${s.level}%"></div>
          </div>
        </div>
      `).join('')}
    `;
  }
}
