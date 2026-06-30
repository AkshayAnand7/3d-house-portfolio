// ============================================
// Configuration & Portfolio Data
// ============================================

export const PORTFOLIO = {
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
      ]
    },
    backend: {
      title: 'Languages',
      items: [
        { name: 'C', level: 80 },
        { name: 'Java', level: 75 },
        { name: 'Python', level: 85 },
      ]
    },
    database: {
      title: 'Databases',
      items: [
        { name: 'MySQL', level: 80 },
      ]
    },
    devops: {
      title: 'Tools',
      items: [
        { name: 'GitHub', level: 85 },
        { name: 'Excel', level: 90 },
      ]
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

// ============================================
// Scene Configuration
// ============================================

export const COLORS = {
  sun: 0xFFB366,
  sunLight: 0xFFD4A6,
  sky: 0x1a0a2e,
  skyHorizon: 0xFF6B35,
  ambient: 0x404060,
  fog: 0x1a0a2e,
  
  // Materials
  whiteWall: 0xf5f0e8,
  wood: 0x8B6914,
  woodDark: 0x5C4033,
  glass: 0xadd8e6,
  marble: 0xf0ece4,
  metal: 0x2a2a2a,
  metalGate: 0x1a1a1a,
  grass: 0x2d5a1e,
  grassLight: 0x3a7a28,
  road: 0x2a2a2a,
  sidewalk: 0xc0b8a8,
  driveway: 0x8a8078,
  poolWater: 0x0066cc,
  poolLight: 0x00aaff,
  carBody: 0x1a1a1a,
  carAccent: 0xff3300,
  roofTop: 0x3a3a3a,
  
  // Room accents
  rgbPink: 0xff00aa,
  rgbCyan: 0x00ffcc,
  rgbPurple: 0xaa00ff,
  neonBlue: 0x0088ff,
  gold: 0xffd700,
};

export const HOUSE = {
  width: 15.4,
  depth: 10.4,
  floorHeight: 3.2,
  wallThickness: 0.2,
  position: { x: -2.5, y: 0, z: 0 },
};

export const ROOMS = {
  livingRoom: { x: -2.3, z: 3, w: 5, d: 4, floor: 0, label: 'LIVING ROOM' },
  kitchen: { x: -2.3, z: -3.2, w: 5, d: 6, floor: 0, label: 'KITCHEN' },
  bedroom: { x: 2.4, z: -1.5, w: 5, d: 6, floor: 0, label: 'BEDROOM' },
  garage: { x: -7.5, z: 0, w: 5, d: 10, floor: 0, label: 'GARAGE' },
};

export const PLAYER = {
  height: 1.65,
  radius: 0.32,
  walkSpeed: 3.0,
  runSpeed: 5.5,
  jumpForce: 5,
  gravity: -15,
  spawnPosition: { x: 0, y: 0, z: 8.5 },
};

export const CAMERA = {
  thirdPersonDistance: 3.5,
  thirdPersonHeight: 2.0,
  fov: 62,
  near: 0.05,
  far: 200,
  sensitivity: 0.002,
  smoothing: 1.0,
};

export const LOADING_TIPS = [
  'Constructing luxury villa...',
  'Planting garden trees...',
  'Polishing marble floors...',
  'Parking the supercar...',
  'Setting up the office...',
  'Tuning RGB lights...',
  'Filling the pool...',
  'Hanging certificates...',
  'Stocking the library...',
  'Hiding collectibles...',
];
