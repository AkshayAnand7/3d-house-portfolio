// ============================================
// Configuration & Portfolio Data
// ============================================

export const PORTFOLIO = {
  name: 'Akshay Anand M P',
  roles: ['Full Stack Developer', 'Web Developer', 'Prompt Engineer'],
  
  about: {
    title: 'ABOUT ME',
    description: `Hi, I'm Akshay Anand M P — a passionate Full Stack Developer who loves building innovative digital experiences. With expertise spanning frontend frameworks, backend systems, blockchain, and IoT, I bring ideas to life through clean code and creative solutions.`,
    story: `My journey into tech started with curiosity about how websites work, which quickly grew into a full-blown passion for development. From building my first HTML page to architecting full-stack applications, every step has been driven by the excitement of creating something meaningful.`,
  },

  skills: {
    frontend: {
      title: 'Frontend',
      items: [
        { name: 'React.js', level: 90 },
        { name: 'Next.js', level: 85 },
        { name: 'Vue.js', level: 75 },
        { name: 'HTML5/CSS3', level: 95 },
        { name: 'JavaScript (ES6+)', level: 92 },
        { name: 'TypeScript', level: 80 },
        { name: 'Tailwind CSS', level: 88 },
        { name: 'Three.js', level: 70 },
      ]
    },
    backend: {
      title: 'Backend',
      items: [
        { name: 'Node.js', level: 88 },
        { name: 'Express.js', level: 85 },
        { name: 'Python', level: 80 },
        { name: 'Java', level: 75 },
        { name: 'REST APIs', level: 90 },
        { name: 'GraphQL', level: 70 },
      ]
    },
    database: {
      title: 'Databases',
      items: [
        { name: 'MongoDB', level: 85 },
        { name: 'PostgreSQL', level: 78 },
        { name: 'MySQL', level: 80 },
        { name: 'Firebase', level: 82 },
        { name: 'Redis', level: 65 },
      ]
    },
    devops: {
      title: 'DevOps & Cloud',
      items: [
        { name: 'Docker', level: 75 },
        { name: 'AWS', level: 70 },
        { name: 'Git/GitHub', level: 92 },
        { name: 'CI/CD', level: 72 },
        { name: 'Linux', level: 78 },
        { name: 'Vercel/Netlify', level: 85 },
      ]
    },
  },

  projects: [
    {
      title: 'Musky & Misty',
      description: 'A creative web application showcasing innovative UI/UX design with modern web technologies and engaging user interactions.',
      tech: ['React', 'Node.js', 'CSS3', 'JavaScript'],
      color: '#FF6B6B',
    },
    {
      title: 'Blockchain Certificate Validation',
      description: 'A decentralized system for validating academic certificates using blockchain technology, ensuring tamper-proof verification and transparency.',
      tech: ['Solidity', 'Ethereum', 'React', 'Web3.js', 'IPFS'],
      color: '#4ECDC4',
    },
    {
      title: 'Smart Irrigation System',
      description: 'An IoT-based smart irrigation system that monitors soil moisture, weather conditions, and automates watering schedules for optimal crop growth.',
      tech: ['Arduino', 'IoT Sensors', 'Python', 'MQTT', 'Dashboard'],
      color: '#45B7D1',
    },
    {
      title: 'RK Group Management System',
      description: 'A comprehensive business management system with inventory tracking, billing, employee management, and analytics dashboard.',
      tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Chart.js'],
      color: '#96CEB4',
    },
  ],

  achievements: [
    {
      title: 'Prompt Engineering Certification',
      issuer: 'Professional Certification',
      description: 'Advanced certification in AI prompt engineering techniques and best practices.',
    },
    {
      title: 'IIT Bombay Git Certification',
      issuer: 'IIT Bombay',
      description: 'Certification in Git version control from IIT Bombay, covering advanced branching, merging, and collaboration workflows.',
    },
    {
      title: 'IoT Workshop Certification',
      issuer: 'Technical Workshop',
      description: 'Hands-on IoT workshop certification covering sensor integration, microcontroller programming, and cloud connectivity.',
    },
  ],

  timeline: [
    {
      phase: 'School Journey',
      period: 'Foundation Years',
      description: 'Discovered my love for computers and technology. Built my first programs and developed logical thinking skills.',
      icon: '🎓',
    },
    {
      phase: 'College Journey',
      period: 'Engineering Years',
      description: 'Pursued Computer Science engineering. Deep-dived into algorithms, data structures, and software development.',
      icon: '🏫',
    },
    {
      phase: 'Developer Journey',
      period: 'Professional Growth',
      description: 'Started building real-world applications. Mastered full-stack development, explored blockchain and IoT.',
      icon: '💻',
    },
    {
      phase: 'Future Goals',
      period: 'What\'s Next',
      description: 'Aspiring to build impactful products, contribute to open source, and push the boundaries of web technology.',
      icon: '🚀',
    },
  ],

  techShowcase: {
    web: { title: 'Web Development', items: ['React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Three.js'] },
    blockchain: { title: 'Blockchain', items: ['Solidity', 'Ethereum', 'Web3.js', 'IPFS', 'Smart Contracts'] },
    ai: { title: 'AI & Tools', items: ['ChatGPT', 'Prompt Engineering', 'GitHub Copilot', 'Midjourney'] },
    cloud: { title: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
    iot: { title: 'IoT', items: ['Arduino', 'Raspberry Pi', 'MQTT', 'Sensors', 'Embedded C'] },
  },

  learning: [
    { title: 'Data Structures & Algorithms', short: 'DSA', color: '#FF6B6B' },
    { title: 'Database Management Systems', short: 'DBMS', color: '#4ECDC4' },
    { title: 'Operating Systems', short: 'OS', color: '#45B7D1' },
    { title: 'Computer Networks', short: 'CN', color: '#96CEB4' },
    { title: 'System Design', short: 'SD', color: '#DDA0DD' },
  ],

  contact: {
    github: { url: 'https://github.com/akshay', label: 'GitHub', icon: '⌨' },
    linkedin: { url: 'https://linkedin.com/in/akshay', label: 'LinkedIn', icon: '💼' },
    email: { url: 'mailto:akshay@example.com', label: 'Email', icon: '✉' },
    resume: { url: '#', label: 'Download Resume', icon: '📄' },
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
  width: 30,
  depth: 24,
  floorHeight: 5,
  wallThickness: 0.3,
  position: { x: 0, y: 0, z: 0 },
};

export const ROOMS = {
  livingRoom: { x: -7, z: -4, w: 10, d: 8, floor: 0, label: 'LIVING ROOM' },
  kitchen: { x: 5, z: -4, w: 8, d: 8, floor: 0, label: 'KITCHEN' },
  office: { x: -7, z: 6, w: 8, d: 8, floor: 0, label: 'OFFICE' },
  garage: { x: 5, z: 6, w: 8, d: 8, floor: 0, label: 'GARAGE' },
  masterBedroom: { x: -7, z: -4, w: 10, d: 8, floor: 1, label: 'MASTER BEDROOM' },
  gamingRoom: { x: 5, z: -4, w: 8, d: 8, floor: 1, label: 'GAMING ROOM' },
  library: { x: -7, z: 6, w: 8, d: 8, floor: 1, label: 'LIBRARY' },
  balcony: { x: 5, z: 6, w: 8, d: 6, floor: 1, label: 'BALCONY' },
};

export const PLAYER = {
  height: 1.7,
  radius: 0.35,
  walkSpeed: 4,
  runSpeed: 8,
  jumpForce: 7,
  gravity: -20,
  spawnPosition: { x: 0, y: 0, z: -18 },
};

export const CAMERA = {
  thirdPersonDistance: 5,
  thirdPersonHeight: 2.5,
  fov: 65,
  near: 0.1,
  far: 500,
  sensitivity: 0.002,
  smoothing: 1.0, // Instant follow for zero camera lag
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
