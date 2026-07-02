/**
 * Portfolio Data — All personal data in one typed location.
 *
 * Migrated from config.js. Separated from engine configuration
 * so content changes never touch engine code.
 */

// ---- Types ----

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  items: SkillItem[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  color: string;
}

export interface Achievement {
  title: string;
  issuer: string;
  description: string;
}

export interface TimelineEntry {
  phase: string;
  period: string;
  description: string;
  icon: string;
}

export interface TechCategory {
  title: string;
  items: string[];
}

export interface ContactLink {
  url: string;
  label: string;
  icon: string;
}

export interface Portfolio {
  name: string;
  roles: string[];
  about: {
    title: string;
    description: string;
    story: string;
  };
  skills: Record<string, SkillCategory>;
  projects: Project[];
  achievements: Achievement[];
  timeline: TimelineEntry[];
  techShowcase: Record<string, TechCategory>;
  learning: { title: string; short: string; color: string }[];
  contact: Record<string, ContactLink>;
  secretRoom: {
    funFacts: string[];
    devSetup: string;
    futureProjects: string[];
    hiddenAchievements: string[];
  };
}

// ---- Data ----

export const PORTFOLIO: Portfolio = {
  name: 'Akshay Anand M P',
  roles: ['Full Stack Developer', 'Web Developer', 'Prompt Engineer'],

  about: {
    title: 'CAREER OBJECTIVE',
    description: `Aspiring Full Stack and Web Developer with a strong interest in Prompt Engineering. Passionate about building efficient and scalable applications, and eager to apply programming, web development, and problem-solving skills in real-world projects.`,
    story: `My journey into tech started with curiosity about how websites work, which quickly grew into a full-blown passion for development. From building my first HTML page to architecting full-stack applications, every step has been driven by the excitement of creating something meaningful.`,
  },

  skills: {
    frontend: {
      title: 'Web Technologies',
      items: [
        { name: 'HTML', level: 90 },
        { name: 'CSS', level: 85 },
        { name: 'JavaScript', level: 80 },
      ],
    },
    backend: {
      title: 'Languages',
      items: [
        { name: 'C', level: 80 },
        { name: 'Java', level: 75 },
        { name: 'Python', level: 85 },
      ],
    },
    database: {
      title: 'Databases',
      items: [
        { name: 'MySQL', level: 80 },
      ],
    },
    devops: {
      title: 'Tools',
      items: [
        { name: 'GitHub', level: 85 },
        { name: 'Excel', level: 90 },
      ],
    },
  },

  projects: [
    {
      title: 'Musky & Misty Perfumes',
      description: 'Developed the official e-commerce website for a perfume brand. Designed responsive UI and optimized user experience.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      color: '#FF6B6B',
    },
    {
      title: 'Blockchain-Powered Smart Certificate Validation',
      description: 'Developed a system to verify certificates using blockchain to prevent forgery. Integrated AI for validation and real-time verification.',
      tech: ['Python', 'Blockchain', 'AI'],
      color: '#4ECDC4',
    },
    {
      title: 'Smart Irrigation System',
      description: 'Automated irrigation system using soil moisture detection and sensors like DHT11 and PIR.',
      tech: ['IoT', 'Sensors'],
      color: '#45B7D1',
    },
  ],

  achievements: [
    {
      title: 'Git Training',
      issuer: 'IIT Bombay',
      description: 'Completed Git Training from IIT Bombay.',
    },
    {
      title: 'Prompt Engineering',
      issuer: 'Visaithalam Academy & Solutions',
      description: 'Certification in Prompt Engineering from Visaithalam Academy & Solutions.',
    },
    {
      title: 'IoT Workshop',
      issuer: 'MIT Chennai',
      description: 'Participated in IoT Workshop at MIT Chennai.',
    },
  ],

  timeline: [
    {
      phase: 'Higher Secondary Education',
      period: '2024',
      description: 'Devadhar Government Higher Secondary School, Tanur, Malappuram, Kerala. Score: 1025 / 1200 (85.4%).',
      icon: '🏫',
    },
    {
      phase: 'B.Tech in Information Technology',
      period: '2024 - 2028',
      description: 'Dr. NGP Institute of Technology, Coimbatore (Anna University). CGPA: 7.25 / 10.',
      icon: '🎓',
    },
    {
      phase: 'Freelance Experience',
      period: 'Present',
      description: 'Developed the official e-commerce website for Musky & Misty Perfumes.',
      icon: '💼',
    },
  ],

  techShowcase: {
    web: { title: 'Web Technologies', items: ['HTML', 'CSS', 'JavaScript'] },
    languages: { title: 'Programming Languages', items: ['C', 'Java', 'Python'] },
    tools: { title: 'Tools & Databases', items: ['MySQL', 'GitHub', 'Excel'] },
    other: { title: 'Other Interests', items: ['Blockchain', 'IoT', 'Prompt Engineering'] },
  },

  learning: [
    { title: 'Data Structures & Algorithms', short: 'DSA', color: '#FF6B6B' },
    { title: 'Database Management Systems', short: 'DBMS', color: '#4ECDC4' },
    { title: 'Operating Systems', short: 'OS', color: '#45B7D1' },
    { title: 'Computer Networks', short: 'CN', color: '#96CEB4' },
    { title: 'System Design', short: 'SD', color: '#DDA0DD' },
  ],

  contact: {
    github: { url: 'https://github.com/AkshayAnand7', label: 'github.com/AkshayAnand7', icon: '⌨' },
    linkedin: { url: 'https://linkedin.com/in/akshay-anand-mp-27y06', label: 'linkedin.com/in/akshay-anand-mp-27y06', icon: '💼' },
    email: { url: 'mailto:akshayanandmp7@gmail.com', label: 'akshayanandmp7@gmail.com', icon: '✉' },
    phone: { url: 'tel:+918089779583', label: '+91 8089779583', icon: '📞' },
    resume: { url: '/Akshayanand_Resume.pdf', label: 'Download Resume', icon: '📄' },
  },

  secretRoom: {
    funFacts: [
      'I built this entire 3D portfolio from scratch with Three.js!',
      'My first program was a calculator in C++',
      'I can type at 90+ WPM',
      'Coffee is my debugging fuel ☕',
    ],
    devSetup: 'VS Code + Arc Browser + Warp Terminal + GitHub Copilot',
    futureProjects: ['AI-Powered Code Review Tool', 'Decentralized Social Platform', 'AR Portfolio Experience'],
    hiddenAchievements: ['100+ GitHub contributions', 'Hackathon Finalist', 'Open Source Contributor'],
  },
};
