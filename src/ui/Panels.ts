/**
 * Panels — Slide-in portfolio content panels.
 *
 * Opens/closes with GSAP animations.
 * Handles pointer lock release/acquire.
 * Renders portfolio content as HTML.
 */

import gsap from 'gsap';
import { PORTFOLIO } from '@data/portfolio';
import type { Input } from '@core/Input';
import { EventEmitter } from '@utils/EventEmitter';

interface PanelEvents {
  open: { action: string };
  close: undefined;
}

export class Panels extends EventEmitter<PanelEvents> {
  private panelEl: HTMLElement | null;
  private panelBody: HTMLElement | null;
  private closeBtn: HTMLElement | null;
  isOpen = false;

  constructor(private readonly input: Input) {
    super();
    this.panelEl = document.getElementById('content-panel');
    this.panelBody = document.getElementById('content-body');
    this.closeBtn = document.getElementById('content-close');

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', this.close);
    }
    document.addEventListener('keydown', this.onKeyDown);
  }

  open(action: string): void {
    if (this.isOpen || !this.panelEl || !this.panelBody) return;

    this.isOpen = true;
    this.input.panelOpen = true;
    this.input.exitPointerLock();

    this.panelBody.innerHTML = this.getContentHTML(action);
    this.panelEl.style.display = 'block';

    // GSAP slide-in animation
    gsap.fromTo(
      this.panelEl,
      { x: 480, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
    );

    this.emit('open', { action });
  }

  close = (): void => {
    if (!this.isOpen || !this.panelEl) return;

    // GSAP slide-out animation
    gsap.to(this.panelEl, {
      x: 480,
      opacity: 0,
      duration: 0.35,
      ease: 'power3.in',
      onComplete: () => {
        if (this.panelEl) this.panelEl.style.display = 'none';
        if (this.panelBody) this.panelBody.innerHTML = '';

        this.isOpen = false;
        this.input.panelOpen = false;
        this.input.requestPointerLock();
        this.emit('close', undefined);
      },
    });
  };

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.code === 'Escape' && this.isOpen) {
      this.close();
    }
  };

  // ---- Content Rendering ----

  private getContentHTML(action: string): string {
    const P = PORTFOLIO;

    switch (action) {
      case 'about_me':
        return `
          <h2>${P.about.title}</h2>
          <p>${P.about.description}</p>
          <h3>My Roles</h3>
          <div>${P.roles.map((r) => `<span class="tag">${r}</span>`).join('')}</div>
        `;

      case 'personal_story':
        return `
          <h2>MY STORY</h2>
          <p>${P.about.story}</p>
        `;

      case 'download_resume':
        return `
          <h2>RESUME</h2>
          <p>Download my latest resume to learn more about my qualifications.</p>
          <a href="${P.contact.resume.url}" target="_blank" class="resume-btn">
            ${P.contact.resume.icon} ${P.contact.resume.label}
          </a>
        `;

      case 'frontend_skills':
        return this.renderSkills(P.skills.frontend);

      case 'backend_skills':
        return this.renderSkills(P.skills.backend);

      case 'project_0':
        return this.renderProjects();

      case 'achievements':
        return this.renderAchievements();

      case 'timeline':
        return this.renderTimeline();

      case 'tech_showcase':
        return this.renderTechShowcase();

      case 'contact':
        return this.renderContact();

      case 'secret_room':
        return this.renderSecretRoom();

      default:
        return `<h2>Unknown Section</h2><p>Content not found for: ${action}</p>`;
    }
  }

  private renderSkills(category: { title: string; items: { name: string; level: number }[] }): string {
    return `
      <h2>${category.title}</h2>
      <div class="skills-grid">
        ${category.items
          .map(
            (s) => `
          <div class="skill-item">
            <div class="skill-header">
              <span class="skill-name">${s.name}</span>
              <span class="skill-level">${s.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" style="width: ${s.level}%"></div>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  private renderProjects(): string {
    return `
      <h2>PROJECTS</h2>
      ${PORTFOLIO.projects
        .map(
          (p) => `
        <div class="project-card" style="border-left: 3px solid ${p.color}">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="tech-tags">
            ${p.tech.map((t) => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      `,
        )
        .join('')}
    `;
  }

  private renderAchievements(): string {
    return `
      <h2>ACHIEVEMENTS</h2>
      ${PORTFOLIO.achievements
        .map(
          (a) => `
        <div class="achievement-card">
          <h3>🏆 ${a.title}</h3>
          <p class="issuer">${a.issuer}</p>
          <p>${a.description}</p>
        </div>
      `,
        )
        .join('')}
    `;
  }

  private renderTimeline(): string {
    return `
      <h2>MY JOURNEY</h2>
      <div class="timeline">
        ${PORTFOLIO.timeline
          .map(
            (t) => `
          <div class="timeline-entry">
            <span class="timeline-icon">${t.icon}</span>
            <div>
              <h3>${t.phase}</h3>
              <p class="period">${t.period}</p>
              <p>${t.description}</p>
            </div>
          </div>
        `,
          )
          .join('')}
      </div>
    `;
  }

  private renderTechShowcase(): string {
    return `
      <h2>TECH SHOWCASE</h2>
      ${Object.values(PORTFOLIO.techShowcase)
        .map(
          (cat) => `
        <div class="tech-category">
          <h3>${cat.title}</h3>
          <div class="tech-tags">
            ${cat.items.map((i) => `<span class="tag">${i}</span>`).join('')}
          </div>
        </div>
      `,
        )
        .join('')}
    `;
  }

  private renderContact(): string {
    return `
      <h2>CONTACT</h2>
      <div class="contact-links">
        ${Object.values(PORTFOLIO.contact)
          .map(
            (c) => `
          <a href="${c.url}" target="_blank" class="contact-link">
            <span class="contact-icon">${c.icon}</span>
            <span>${c.label}</span>
          </a>
        `,
          )
          .join('')}
      </div>
    `;
  }

  private renderSecretRoom(): string {
    const s = PORTFOLIO.secretRoom;
    return `
      <h2>🔮 SECRET ROOM</h2>
      <h3>Fun Facts</h3>
      <ul>${s.funFacts.map((f) => `<li>${f}</li>`).join('')}</ul>
      <h3>Dev Setup</h3>
      <p>${s.devSetup}</p>
      <h3>Future Projects</h3>
      <ul>${s.futureProjects.map((p) => `<li>${p}</li>`).join('')}</ul>
    `;
  }

  dispose(): void {
    if (this.closeBtn) {
      this.closeBtn.removeEventListener('click', this.close);
    }
    document.removeEventListener('keydown', this.onKeyDown);
    this.removeAllListeners();
  }
}
