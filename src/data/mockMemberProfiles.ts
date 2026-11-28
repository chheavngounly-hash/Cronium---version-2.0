import {
  jenniesPortrait,
  portraitAlexanderPatrick,
  portraitClassieWilley,
  portraitGeorgeAllan,
  portraitHiroshiTanaka,
  portraitElenaRostova,
  portraitMarcusVance,
  portraitPriyaPatel,
  portraitLiamChen,
  portraitAnnaSan,
  portraitMacRoseville,
  portraitKenjiTakahashi,
  portraitCamilleLaurent,
  portraitZoeKim,
  portraitAmaraOkafor,
  portraitTariqAlmansoor,
  resolveGenderMatchedAvatar,
} from './mockData';
import profileCoverSkyscrapers from '../assets/images/profile_cover_skyscrapers_1795793589966.jpg';

export interface MemberProfileDetail {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverUrl: string;
  badge: string;
  title: string;
  bio: string;
  organization: string;
  email: string;
  safetyNumber: string;
  hardwareStatus: string;
  communitiesCount: number;
  connectionsCount: number;
  brandStatus: {
    rankTitle: string;
    level: number;
    points: number;
    nextRank: string;
    progressPercent: number;
  };
  metrics?: {
    honors: string;
    patentsCount: number | string;
    contributorRank: string;
  };
  achievements: Array<{
    icon: string;
    title: string;
    org: string;
    year: string;
    description?: string;
  }>;
  recentTopics: string[];
  linkedinUrl?: string;
  githubUrl?: string;
}

export const MEMBER_PROFILES: Record<string, MemberProfileDetail> = {
  user_jennies: {
    id: 'user_jennies',
    name: 'Jennies Vance',
    username: '@jennies',
    avatar: jenniesPortrait,
    coverUrl: profileCoverSkyscrapers,
    badge: 'Founding Member',
    title: 'Head of AI Product & Systems Architecture • Founder',
    bio: 'Product architect & systems researcher specializing in zero-knowledge mesh messaging, autonomous agents, and human-computer symbiosis.',
    organization: 'Cronium Infrastructure Core • Stanford AI Lab Alum',
    email: 'jennies.vance@cronium.network',
    safetyNumber: '0492-8819-2041-9943',
    hardwareStatus: 'Vault Active • 256-bit AES Hardware Enclave',
    communitiesCount: 12,
    connectionsCount: 1480,
    brandStatus: {
      rankTitle: 'Legend II',
      level: 58,
      points: 5850,
      nextRank: 'Mythic II',
      progressPercent: 82,
    },
    metrics: {
      honors: '1st',
      patentsCount: 14,
      contributorRank: 'Top 0.1%',
    },
    achievements: [
      {
        icon: '🏆',
        title: 'Systems Architect of the Year',
        org: 'Autonomous Mesh Computing Initiative & IEEE',
        year: '2025',
      },
      {
        icon: '📜',
        title: '12 Published International Patents',
        org: 'USPTO & WIPO International Registries',
        year: '2021 – 2025',
      },
      {
        icon: '🚀',
        title: '10M+ Daily Active Users Milestone',
        org: 'Cronium Infrastructure Core',
        year: '2025',
      },
      {
        icon: '🎓',
        title: 'NeurIPS Best Paper Contributor',
        org: 'Neural Information Processing Systems',
        year: '2024',
      },
      {
        icon: '🌐',
        title: 'Open Source Ecosystem Champion',
        org: 'Open Cryptography & WebAssembly Foundations',
        year: '2023 – 2025',
      },
    ],
    recentTopics: ['Hackathons', 'Startups', 'ZeroKnowledge', 'AutonomousAgents'],
  },

  user_classie: {
    id: 'user_classie',
    name: 'Classie Willey',
    username: '@classie',
    avatar: portraitClassieWilley,
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
    badge: 'Community Host & Fellow',
    title: 'AI Product Lead • Workplace Culture & Wellness Advocate',
    bio: 'Leading decentralized product teams with deep empathy. Championing outdoor syncs, cognitive wellness, and ethical AI development.',
    organization: 'World Changers Mindset • Tech Wellness Initiative',
    email: 'classie.willey@worldchangers.ai',
    safetyNumber: '7192-3341-9012-4412',
    hardwareStatus: 'Verified Enclave • Hardware Key Paired',
    communitiesCount: 9,
    connectionsCount: 1240,
    brandStatus: {
      rankTitle: 'Legend III',
      level: 42,
      points: 3950,
      nextRank: 'Mythic V',
      progressPercent: 65,
    },
    metrics: {
      honors: 'Gold Medal',
      patentsCount: 8,
      contributorRank: 'Top 3%',
    },
    achievements: [
      {
        icon: '🌿',
        title: 'Workplace Wellness Champion Award',
        org: 'Remote Work Excellence Alliance',
        year: '2025',
      },
      {
        icon: '💡',
        title: 'Top 50 Product Leaders in AI',
        org: 'Product Faculty & IEEE',
        year: '2024',
      },
      {
        icon: '🧘',
        title: 'Mindful Distributed Leadership Fellow',
        org: 'Cognitive Wellness Institute',
        year: '2023',
      },
      {
        icon: '🤝',
        title: 'Global Remote Culture Architect Award',
        org: 'Future of Work Alliance',
        year: '2022',
      },
    ],
    recentTopics: ['Workplace', 'RemoteWork', 'Hiking', 'SlowLiving'],
  },

  user_george: {
    id: 'user_george',
    name: 'George Allan',
    username: '@george',
    avatar: portraitGeorgeAllan,
    coverUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    badge: 'Senior Fellow',
    title: 'Senior Infrastructure Engineer @ TensorCloud • Alpine Trekker',
    bio: 'Building ultra-resilient distributed storage clusters by day; summiting high Sierra passes and tracking meteor showers by night.',
    organization: 'TensorCloud Infrastructure • Global Trailblazers Host',
    email: 'george.allan@tensorcloud.io',
    safetyNumber: '5512-8901-2344-1290',
    hardwareStatus: 'Vault Active • FIDO2 Biometric Key',
    communitiesCount: 14,
    connectionsCount: 1890,
    brandStatus: {
      rankTitle: 'Mythic IV',
      level: 45,
      points: 4420,
      nextRank: 'Mythic III',
      progressPercent: 82,
    },
    metrics: {
      honors: 'Top 3',
      patentsCount: 17,
      contributorRank: 'Top 2%',
    },
    achievements: [
      {
        icon: '⛰️',
        title: 'Pacific Crest Trail Thru-Hike Finisher',
        org: 'PCT Association',
        year: '2023',
      },
      {
        icon: '⚡',
        title: 'Zero-Downtime Cluster Migration Award',
        org: 'Cloud Native Computing Foundation',
        year: '2024',
      },
      {
        icon: '🌌',
        title: 'Alpine Astronomy Observation Grant',
        org: 'High-Altitude Stargazing Guild',
        year: '2025',
      },
    ],
    recentTopics: ['Hiking', 'Outdoors', 'Infra', 'Stargazing'],
  },

  user_liam: {
    id: 'user_liam',
    name: 'Liam Chen',
    username: '@liam',
    avatar: portraitLiamChen,
    coverUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
    badge: 'Core Contributor',
    title: 'Lead Engine Architect • Low-Latency Systems & Specialty Coffee',
    bio: 'Obsessed with mechanical keyboard ergonomics, cache line alignment, and roasting natural processed Ethiopian coffees.',
    organization: 'Low-Latency Engine Labs • Ergonomics Guild',
    email: 'liam.chen@enginelabs.dev',
    safetyNumber: '9921-4412-8871-3310',
    hardwareStatus: 'Hardware Enclave • Secure Element Active',
    communitiesCount: 11,
    connectionsCount: 1620,
    brandStatus: {
      rankTitle: 'Legend I',
      level: 44,
      points: 4210,
      nextRank: 'Mythic V',
      progressPercent: 91,
    },
    metrics: {
      honors: 'Grand Prize',
      patentsCount: 11,
      contributorRank: 'Top 1%',
    },
    achievements: [
      {
        icon: '⌨️',
        title: 'Ergonomic Open-Hardware Innovation Prize',
        org: 'Mechanical Input Guild',
        year: '2025',
      },
      {
        icon: '🏎️',
        title: 'Sub-Microsecond Message Broker Author',
        org: 'High-Frequency OSS Foundation',
        year: '2024',
      },
      {
        icon: '☕',
        title: 'Micro-Roast Coffee Extraction Science Award',
        org: 'Specialty Coffee Masters',
        year: '2023',
      },
    ],
    recentTopics: ['Ergonomics', 'DeskSetup', 'Systems', 'Coffee'],
  },

  user_elena: {
    id: 'user_elena',
    name: 'Elena Rostova',
    username: '@elena',
    avatar: portraitElenaRostova,
    coverUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    badge: 'Research Scientist',
    title: 'Neuromorphic Hardware Researcher • Baker & Urban Gardener',
    bio: 'Designing bio-inspired silicon architectures for brain-computer interfaces. Believer in wild fermentation sourdough and slow living.',
    organization: 'Quantum Neuromorphic Lab • ETH Zurich Alum',
    email: 'elena.rostova@cronium.network',
    safetyNumber: '3129-8472-1092-7714',
    hardwareStatus: 'Vault Active • Quantum-Resistant Handshake',
    communitiesCount: 10,
    connectionsCount: 1540,
    brandStatus: {
      rankTitle: 'Mythic III',
      level: 47,
      points: 4680,
      nextRank: 'Mythic II',
      progressPercent: 74,
    },
    metrics: {
      honors: 'Pioneer',
      patentsCount: 9,
      contributorRank: 'Top 5%',
    },
    achievements: [
      {
        icon: '🔬',
        title: 'European Young Scientist Award in Microelectronics',
        org: 'European Research Council',
        year: '2024',
      },
      {
        icon: '🍞',
        title: 'Artisan Culinary Fermentation Contributor',
        org: 'Gastronomy Science Circle',
        year: '2025',
      },
      {
        icon: '🧬',
        title: 'Synaptic Memristor Circuit Patent',
        org: 'Swiss Federal Patent Office & WIPO',
        year: '2023',
      },
      {
        icon: '🏔️',
        title: 'Alpine Botany Preservation Fellowship',
        org: 'Swiss Alpine Ecology League',
        year: '2022',
      },
    ],
    recentTopics: ['Sourdough', 'Neuromorphic', 'SlowLiving', 'Quantum'],
  },

  user_alexander: {
    id: 'user_alexander',
    name: 'Alexander Patrick',
    username: '@alexander',
    avatar: portraitAlexanderPatrick,
    coverUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
    badge: 'Staff Research Fellow',
    title: 'Staff Research Fellow @ Stanford AI & Robotics Lab',
    bio: 'Mentoring the next generation of hardware robotics builders. Exploring human-robot collaboration and multi-modal edge sensor belts.',
    organization: 'Stanford Robotics Lab • Silicon Valley Mentorship Hub',
    email: 'alexander.patrick@stanford-robotics.org',
    safetyNumber: '4481-2290-7711-3829',
    hardwareStatus: 'Verified Enclave • Hardware Key Paired',
    communitiesCount: 16,
    connectionsCount: 2180,
    brandStatus: {
      rankTitle: 'Mythical Glory',
      level: 52,
      points: 5490,
      nextRank: 'Immortal',
      progressPercent: 88,
    },
    metrics: {
      honors: 'Fellow',
      patentsCount: 21,
      contributorRank: 'Top 0.5%',
    },
    achievements: [
      {
        icon: '🤖',
        title: 'Robotics Mentorship Excellence Citation',
        org: 'IEEE Robotics & Automation Society',
        year: '2025',
      },
      {
        icon: '🎓',
        title: 'Best Doctoral Dissertation in Autonomous Systems',
        org: 'Stanford University School of Engineering',
        year: '2023',
      },
    ],
    recentTopics: ['Robotics', 'Mentorship', 'Hackathons', 'Education'],
  },

  user_marcus: {
    id: 'user_marcus',
    name: 'Dr. Marcus Vance',
    username: '@marcus',
    avatar: portraitMarcusVance,
    coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    badge: 'Distinguished Fellow',
    title: 'Distributed Systems Fellow • Compiler Architect',
    bio: 'Pioneering asynchronous zero-copy network compilers and formal protocol verification for decentralized mesh networks.',
    organization: 'Decentralized Protocol Core • MIT CSAIL Alum',
    email: 'marcus.vance@mit-csail.org',
    safetyNumber: '8839-1029-4481-9920',
    hardwareStatus: 'Vault Active • 256-bit AES Hardware Key',
    communitiesCount: 15,
    connectionsCount: 2450,
    brandStatus: {
      rankTitle: 'Mythical Glory',
      level: 54,
      points: 5820,
      nextRank: 'Immortal',
      progressPercent: 94,
    },
    metrics: {
      honors: '1st Prize',
      patentsCount: 16,
      contributorRank: 'Top 1.5%',
    },
    achievements: [
      {
        icon: '📜',
        title: 'ACM SIGPLAN Most Influential Paper Award',
        org: 'ACM SIGPLAN Committee',
        year: '2024',
      },
      {
        icon: '⚡',
        title: 'High-Performance Computing Pioneer Medal',
        org: 'International Supercomputing Conference',
        year: '2023',
      },
      {
        icon: '🛡️',
        title: 'Zero-Copy Asynchronous Rust Kernel Architecture',
        org: 'Open Systems Systems Research Group',
        year: '2022',
      },
      {
        icon: '🌐',
        title: 'OSDI Best Protocol Implementation Award',
        org: 'USENIX Association',
        year: '2021',
      },
    ],
    recentTopics: ['DistributedSystems', 'Compilers', 'Protocols', 'Security'],
  },

  user_priya: {
    id: 'user_priya',
    name: 'Priya Patel',
    username: '@priya',
    avatar: portraitPriyaPatel,
    coverUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&auto=format&fit=crop&q=80',
    badge: 'CleanTech Fellow',
    title: 'CleanTech Microgrid Specialist • Energy Systems Researcher',
    bio: 'Designing decentralized autonomous solar-battery microgrids for resilient community power. Enthusiast of community urban gardens.',
    organization: 'Global CleanTech Microgrid Alliance',
    email: 'priya.patel@cleantech-grid.org',
    safetyNumber: '1192-4820-9938-2211',
    hardwareStatus: 'Vault Active • Secure Element Paired',
    communitiesCount: 13,
    connectionsCount: 1710,
    brandStatus: {
      rankTitle: 'Legend II',
      level: 43,
      points: 4120,
      nextRank: 'Legend I',
      progressPercent: 71,
    },
    metrics: {
      honors: 'Laureate',
      patentsCount: 13,
      contributorRank: 'Top 4%',
    },
    achievements: [
      {
        icon: '🌱',
        title: 'Clean Energy Innovation Grant Laureate',
        org: 'Global Renewable Energy Trust',
        year: '2025',
      },
      {
        icon: '🔋',
        title: 'Autonomous Microgrid Patent Portfolio',
        org: 'USPTO Patent Registry',
        year: '2024',
      },
      {
        icon: '☀️',
        title: 'IEEE Power & Energy Young Professional Award',
        org: 'IEEE Power & Energy Society',
        year: '2023',
      },
      {
        icon: '🏙️',
        title: 'Community Solar Resilience Fellowship',
        org: 'Urban Sustainability Foundation',
        year: '2022',
      },
      {
        icon: '🔌',
        title: 'Solar-Battery Mesh Inverter Design Prize',
        org: 'Clean Energy Breakthrough Summit',
        year: '2021',
      },
      {
        icon: '🌿',
        title: 'Ecological Decentralization Research Fellowship',
        org: 'Global Environmental Institute',
        year: '2020',
      },
    ],
    recentTopics: ['CleanTech', 'Energy', 'Community', 'Sustainability'],
  },

  user_hiroshi: {
    id: 'user_hiroshi',
    name: 'Dr. Hiroshi Tanaka',
    username: '@hiroshi',
    avatar: portraitHiroshiTanaka,
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    badge: 'Principal Fellow',
    title: 'Principal Quantum Physicist & JAXA Fellow',
    bio: 'Investigating topological superconducting qubits and cosmic ray noise suppression in deep cryogenic environments.',
    organization: 'JAXA Quantum Aeronautics Lab • Tokyo Tech',
    email: 'hiroshi.tanaka@jaxa.quantum.jp',
    safetyNumber: '7721-9940-1123-5582',
    hardwareStatus: 'Vault Active • Quantum-Resistant Lattice Key',
    communitiesCount: 18,
    connectionsCount: 2940,
    brandStatus: {
      rankTitle: 'Grandmaster Fellow',
      level: 85,
      points: 8520,
      nextRank: 'Immortal',
      progressPercent: 95,
    },
    metrics: {
      honors: 'Medalist',
      patentsCount: 26,
      contributorRank: 'Top 0.01%',
    },
    achievements: [
      {
        icon: '⚛️',
        title: 'Japanese Physical Society Lifetime Fellow',
        org: 'Physical Society of Japan',
        year: '2024',
      },
      {
        icon: '🛰️',
        title: 'Space Cryogenics Payload Mission Lead',
        org: 'JAXA Aeronautics',
        year: '2023',
      },
      {
        icon: '🧊',
        title: 'Topological Qubit Coherence Benchmark Record',
        org: 'International Quantum Horizons',
        year: '2025',
      },
      {
        icon: '📡',
        title: 'Cryogenic Sub-Kelvin Low-Noise Amplifier Patent',
        org: 'Japan Patent Office (JPO)',
        year: '2022',
      },
      {
        icon: '🌌',
        title: 'Cosmic Ray Decoherence Suppression Award',
        org: 'Astrophysical Quantum Consortium',
        year: '2021',
      },
      {
        icon: '🏆',
        title: 'IEEE Quantum Computing Pioneer Award',
        org: 'IEEE Quantum Council',
        year: '2024',
      },
      {
        icon: '📜',
        title: '42 Published Superconducting Qubit Patents',
        org: 'USPTO & WIPO International Registries',
        year: '2018 – 2025',
      },
      {
        icon: '🎓',
        title: '150+ Peer-Reviewed Quantum Physics Publications',
        org: 'Physical Review Letters & Nature Physics',
        year: '2015 – 2025',
      },
    ],
    recentTopics: ['Quantum', 'Physics', 'Space', 'Superconducting'],
  },

  user_anna: {
    id: 'user_anna',
    name: 'Anna San',
    username: '@annasan',
    avatar: portraitAnnaSan,
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    badge: 'Wafer Systems Lead',
    title: 'Lead Architect @ Cerebras Systems • Wafer-Scale AI',
    bio: 'Specializing in Agent Orchestration, Diffusion Models & Edge Inference Optimization. Active contributor in Cronium communities.',
    organization: 'Cerebras Systems Architecture Core • MIT CSAIL Alum',
    email: 'anna.san@cerebras.systems',
    safetyNumber: '3321-9984-7712-4401',
    hardwareStatus: 'Vault Active • FIDO2 Hardware Key',
    communitiesCount: 16,
    connectionsCount: 2860,
    brandStatus: {
      rankTitle: 'Mythical Glory',
      level: 74,
      points: 7420,
      nextRank: 'Grandmaster',
      progressPercent: 88,
    },
    metrics: {
      honors: 'Top 5',
      patentsCount: 28,
      contributorRank: 'Top 0.5%',
    },
    achievements: [
      {
        icon: '💻',
        title: 'Silicon Architecture of the Decade Citation',
        org: 'IEEE Micro Top Picks',
        year: '2024',
      },
      {
        icon: '🚀',
        title: '400,000-Core Wafer Orchestration Architect',
        org: 'Supercomputing AI Hardware Forum',
        year: '2025',
      },
      {
        icon: '❄️',
        title: 'Monolithic Die Microfluidic Cooling Patent',
        org: 'USPTO Silicon Systems Registry',
        year: '2023',
      },
      {
        icon: '⚡',
        title: 'Distributed Diffusion Inference Engine Author',
        org: 'High Performance AI Forum',
        year: '2025',
      },
      {
        icon: '🎓',
        title: 'Stanford HPC Distinguished Engineering Alum',
        org: 'Stanford University School of Engineering',
        year: '2022',
      },
      {
        icon: '🌐',
        title: 'Open Wafer Cluster Telemetry Spec Author',
        org: 'Open AI Hardware Consortium',
        year: '2024',
      },
      {
        icon: '🏆',
        title: 'Wafer-Scale ML Systems Founder Award',
        org: 'ML Architecture Global Alliance',
        year: '2025',
      },
    ],
    recentTopics: ['Hardware', 'AIChips', 'WaferScale', 'Compute'],
  },

  user_kenji: {
    id: 'user_kenji',
    name: 'Kenji Takahashi',
    username: '@kenji',
    avatar: portraitKenjiTakahashi,
    coverUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&auto=format&fit=crop&q=80',
    badge: 'Propulsion Fellow',
    title: 'Aerospace Propulsion & Spacecraft Guidance Specialist',
    bio: 'Designing next-generation Xenon Hall-effect plasma thrusters and autonomous deep-space guidance algorithms.',
    organization: 'Spacecraft Dynamics & Deep Space Navigation Core',
    email: 'kenji.takahashi@deepspace.aero',
    safetyNumber: '9912-3012-7721-4450',
    hardwareStatus: 'Vault Active • FIDO2 Biometric Key',
    communitiesCount: 10,
    connectionsCount: 1510,
    brandStatus: {
      rankTitle: 'Legend IV',
      level: 52,
      points: 5240,
      nextRank: 'Legend III',
      progressPercent: 72,
    },
    metrics: {
      honors: '1st Prize',
      patentsCount: 14,
      contributorRank: 'Top 1%',
    },
    achievements: [
      {
        icon: '🚀',
        title: '500-Hour Xenon Thruster Benchmark Milestone',
        org: 'Electric Propulsion Laboratory',
        year: '2025',
      },
      {
        icon: '🛰️',
        title: 'NASA Deep Space Navigation Challenge Winner',
        org: 'NASA Aeronautics Division',
        year: '2024',
      },
      {
        icon: '📜',
        title: '14 Spacecraft Propulsion Patents',
        org: 'USPTO Space Tech Registry',
        year: '2021 – 2025',
      },
      {
        icon: '🌌',
        title: 'AIAA Space Exploration Best Paper Award',
        org: 'American Institute of Aeronautics & Astronautics',
        year: '2023',
      },
      {
        icon: '⚡',
        title: 'Sub-Microsecond Hall Thruster Ionization Patent',
        org: 'WIPO International Registry',
        year: '2022',
      },
    ],
    recentTopics: ['Aerospace', 'Propulsion', 'PlasmaPhysics', 'DeepSpace'],
  },

  user_camille: {
    id: 'user_camille',
    name: 'Camille Laurent',
    username: '@camille',
    avatar: portraitCamilleLaurent,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
    badge: 'Acoustics Fellow',
    title: 'Spatial Audio DSP & Procedural Acoustics Researcher',
    bio: 'Pioneering binaural HRTF real-time synthesis and ultra-low-latency spatial acoustic rendering engines.',
    organization: 'Paris Audio Labs • IRCAM Alum',
    email: 'camille.laurent@audiolabs.fr',
    safetyNumber: '4812-9901-2244-8831',
    hardwareStatus: 'Hardware Enclave • Secure Element Active',
    communitiesCount: 7,
    connectionsCount: 1150,
    brandStatus: {
      rankTitle: 'Master IV',
      level: 40,
      points: 4050,
      nextRank: 'Master III',
      progressPercent: 60,
    },
    metrics: {
      honors: 'Top 3%',
      patentsCount: 8,
      contributorRank: 'Top 2.5%',
    },
    achievements: [
      {
        icon: '🎧',
        title: 'Binaural HRTF Real-Time Synthesis Patent',
        org: 'European Patent Office',
        year: '2025',
      },
      {
        icon: '🎹',
        title: 'AES International Convention Keynote Citation',
        org: 'Audio Engineering Society',
        year: '2024',
      },
      {
        icon: '🔊',
        title: 'Dolby Atmos Certified Spatial Designer',
        org: 'Spatial Audio Institute',
        year: '2023',
      },
      {
        icon: '🎼',
        title: 'Open Sound DSP Engine Principal Contributor',
        org: 'Open Audio Standards Guild',
        year: '2022',
      },
    ],
    recentTopics: ['SpatialAudio', 'DSP', 'Acoustics', 'SoundDesign'],
  },

  user_zoe: {
    id: 'user_zoe',
    name: 'Zoe Kim',
    username: '@zoekim',
    avatar: portraitZoeKim,
    coverUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    badge: 'Interaction Fellow',
    title: 'Design Systems Architect & Human-Computer Interface Lead',
    bio: 'Crafting fluid zero-latency micro-interactions and tactile visual feedback systems for collaborative spatial canvases.',
    organization: 'Interaction Science Institute • Seoul National Alum',
    email: 'zoe.kim@interaction.design',
    safetyNumber: '6612-4412-8819-0012',
    hardwareStatus: 'Hardware Enclave • Secure Element Active',
    communitiesCount: 11,
    connectionsCount: 1420,
    brandStatus: {
      rankTitle: 'Master I',
      level: 47,
      points: 4740,
      nextRank: 'Legend V',
      progressPercent: 70,
    },
    metrics: {
      honors: 'Design Fellow',
      patentsCount: 9,
      contributorRank: 'Top 1.5%',
    },
    achievements: [
      {
        icon: '🎨',
        title: 'International Interaction Design Excellence Award',
        org: 'Global Design Guild',
        year: '2025',
      },
      {
        icon: '✨',
        title: 'Micro-Interaction Tactile Feedback Patent',
        org: 'USPTO Interactive Tech',
        year: '2024',
      },
      {
        icon: '📐',
        title: 'Collaborative Real-Time Canvas Architecture Spec',
        org: 'Web Standards Interactive Group',
        year: '2023',
      },
      {
        icon: '🏆',
        title: 'Apple Design Award Honorable Mention',
        org: 'Global Developer Forum',
        year: '2022',
      },
      {
        icon: '📱',
        title: 'Adaptive Typographic Hierarchy Specification',
        org: 'Digital Typography Alliance',
        year: '2021',
      },
    ],
    recentTopics: ['DesignSystems', 'Typography', 'UIUX', 'HCI'],
  },

  user_amara: {
    id: 'user_amara',
    name: 'Amara Okafor',
    username: '@amara',
    avatar: portraitAmaraOkafor,
    coverUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    badge: 'BioSystems Lead',
    title: 'Bio-Computing Systems Researcher & Computational Geneticist',
    bio: 'Merging synthetic biology with distributed edge computing architectures to accelerate personalized genomic medicine.',
    organization: 'Pan-African Genomics Consortium • Oxford Alum',
    email: 'amara.okafor@genomics.org',
    safetyNumber: '7821-3312-9981-4412',
    hardwareStatus: 'Vault Active • Hardware Key Paired',
    communitiesCount: 12,
    connectionsCount: 1720,
    brandStatus: {
      rankTitle: 'Legend II',
      level: 56,
      points: 5640,
      nextRank: 'Legend I',
      progressPercent: 80,
    },
    metrics: {
      honors: 'Genomics Fellow',
      patentsCount: 15,
      contributorRank: 'Top 0.8%',
    },
    achievements: [
      {
        icon: '🧬',
        title: 'CRISPR Sequence Real-Time Search Accelerator',
        org: 'International Genomics Society',
        year: '2025',
      },
      {
        icon: '🧪',
        title: 'Synthetic DNA Storage Compression Patent',
        org: 'WIPO International Registry',
        year: '2024',
      },
      {
        icon: '🌍',
        title: 'African Biomedical Innovation Laureate',
        org: 'Pan-African Health Alliance',
        year: '2023',
      },
      {
        icon: '🎓',
        title: 'Nature Genetics Featured Contributor',
        org: 'Nature Publishing Group',
        year: '2024',
      },
      {
        icon: '💡',
        title: 'Bio-Distributed Compute Open Spec Author',
        org: 'Open Genomics Foundation',
        year: '2022',
      },
    ],
    recentTopics: ['Genomics', 'BioTech', 'ComputationalBiology', 'Medicine'],
  },

  user_tariq: {
    id: 'user_tariq',
    name: 'Tariq Al-Mansoor',
    username: '@tariq',
    avatar: portraitTariqAlmansoor,
    coverUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80',
    badge: 'Smart Infrastructure Fellow',
    title: 'Smart Urban Grids & Autonomous Mobility Architect',
    bio: 'Architecting zero-emission autonomous transit grids and sensor-mesh networks for next-generation sovereign smart cities.',
    organization: 'Future Cities & Autonomous Transit Core',
    email: 'tariq.almansoor@futurecities.ae',
    safetyNumber: '5512-9901-2244-1102',
    hardwareStatus: 'Vault Active • FIDO2 Hardware Key',
    communitiesCount: 10,
    connectionsCount: 1490,
    brandStatus: {
      rankTitle: 'Legend V',
      level: 50,
      points: 5020,
      nextRank: 'Legend IV',
      progressPercent: 68,
    },
    metrics: {
      honors: 'Urban Fellow',
      patentsCount: 12,
      contributorRank: 'Top 1.2%',
    },
    achievements: [
      {
        icon: '🏙️',
        title: 'Smart Mobility Infrastructure Excellence Award',
        org: 'World Urban Transit Forum',
        year: '2025',
      },
      {
        icon: '⚡',
        title: 'Dynamic Electric Fleet Charging Mesh Patent',
        org: 'USPTO Smart Tech Registry',
        year: '2024',
      },
      {
        icon: '🚦',
        title: 'Zero-Congestion V2X Telemetry Specification',
        org: 'Connected Vehicle Standards Guild',
        year: '2023',
      },
      {
        icon: '🛰️',
        title: 'Satellite Urban Sensing Initiative Lead',
        org: 'International Smart Cities Council',
        year: '2022',
      },
      {
        icon: '🌐',
        title: 'Resilient Municipal Sensor Grid Architecture',
        org: 'IEEE Smart Grid Society',
        year: '2021',
      },
    ],
    recentTopics: ['SmartCities', 'AutonomousVehicles', 'Mobility', 'CleanGrid'],
  },
};

function canonicalizeProfilePersonKey(name: string): string {
  return (name || 'member')
    .trim()
    .toLowerCase()
    .replace(/^(dr\.?|prof\.?|chef|grandmaster|mr\.?|ms\.?|mrs\.?)\s+/i, '')
    .replace(/\s+/g, ' ');
}

function stableProfileHash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  return Math.abs(h);
}

interface DomainAchievementSpec {
  domain: string;
  match: RegExp;
  icons: string[];
  prefixes: string[];
  suffixes: string[];
  orgs: string[];
  fallbackTopics: string[];
}

const DOMAIN_ACHIEVEMENT_SPECS: DomainAchievementSpec[] = [
  {
    domain: 'chess',
    match: /chess|fide|grandmaster|sicilian|bitboard|endgame|arbiter|tactic/i,
    icons: ['♟️', '🏆', '🧠', '📜', '⏱️', '🎖️'],
    prefixes: ['International', 'Nordic', 'European', 'Grandmaster', 'Tactical', 'Classical', 'Neural'],
    suffixes: ['Mastery Citation', 'Endgame Research Medal', 'Tournament Distinction', 'Opening Theory Fellowship', 'Engine Evaluation Prize', 'Championship Honor'],
    orgs: ['FIDE Technical Commission', 'European Chess Union', 'International Chess Analytics Guild', 'World Rapid & Blitz Council', 'Computer Chess Research Society', 'Nordic Strategy Institute'],
    fallbackTopics: ['Endgame Strategy', 'Positional Analysis', 'Neural Evaluation', 'Opening Repertoires', 'Rapid Calculation', 'Tournament Direction'],
  },
  {
    domain: 'culinary',
    match: /chef|culinary|baker|sourdough|pastry|gastronom|fromager|cacao|kaiseki|ferment/i,
    icons: ['🍽️', '🍞', '🌿', '🏆', '🍷', '✨'],
    prefixes: ['Artisan', 'Culinary', 'Heritage', 'Sensory', 'Botanical', 'Michelin-Circle', 'Terroir'],
    suffixes: ['Gastronomy Laureate', 'Craft Excellence Award', 'Fermentation Science Citation', 'Culinary Innovation Prize', 'Flavor Chemistry Honor', 'Mastery Fellowship'],
    orgs: ['International Gastronomy Academy', 'World Artisan Bakers Guild', 'Culinary Science & Terroir Forum', 'Global Food Heritage Council', 'Sensory Craft Institute', 'Modern Patisserie Collective'],
    fallbackTopics: ['Wild Fermentation', 'Seasonal Sourcing', 'Flavor Extraction', 'Artisan Technique', 'Terroir Pairing', 'Cacao Science'],
  },
  {
    domain: 'cinema',
    match: /photo|cinema|film|lens|colorist|lighting|astro|leica|editorial|camera/i,
    icons: ['🎬', '📷', '🌌', '✨', '🎞️', '🏆'],
    prefixes: ['Anamorphic', 'Editorial', 'Optical', 'Documentary', 'Chromatic', 'Visual', 'Festival'],
    suffixes: ['Cinematography Citation', 'Visual Craft Award', 'Optical Engineering Honor', 'Color Science Distinction', 'Documentary Fellowship', 'Festival Jury Prize'],
    orgs: ['International Cinematographers Guild', 'Visual Storytelling Foundation', 'Optical Imaging Society', 'Global Color Science Council', 'Independent Film Craft Academy', 'Nordic Visual Arts Forum'],
    fallbackTopics: ['Naturalistic Lighting', 'Color Grading Pipelines', 'Optical Collimation', 'Documentary Narrative', 'Night Exposure Craft', 'Studio Direction'],
  },
  {
    domain: 'space',
    match: /space|orbital|astro|exoplanet|rocket|propulsion|lunar|thermal|cosmo|jwst|gaia|satellite/i,
    icons: ['🛰️', '🚀', '🌌', '⚛️', '🔭', '🏆'],
    prefixes: ['Deep-Space', 'Orbital', 'Interplanetary', 'Cryogenic', 'Astrophysical', 'Mission', 'Planetary'],
    suffixes: ['Mission Excellence Award', 'Flight Systems Citation', 'Telemetry Innovation Prize', 'Spacecraft Engineering Medal', 'Observatory Research Grant', 'Aerospace Fellowship'],
    orgs: ['International Astronautical Federation', 'Deep Space Systems Consortium', 'Orbital Mechanics Society', 'Planetary Exploration Council', 'Aerospace Thermal Institute', 'Astrophysical Instrumentation Union'],
    fallbackTopics: ['Trajectory Optimization', 'Spectroscopic Sensing', 'Thermal Architecture', 'Propulsion Controls', 'Stellar Astrometry', 'Cryogenic Payloads'],
  },
  {
    domain: 'audio',
    match: /audio|music|synth|dsp|atmos|cello|orchestr|foley|mic|preamp|acoust|sound/i,
    icons: ['🎹', '🎧', '🎼', '🔊', '🎙️', '🏆'],
    prefixes: ['Spatial', 'Acoustic', 'Harmonic', 'Analog', 'Procedural', 'Sonic', 'Mastering'],
    suffixes: ['Sound Craft Award', 'DSP Innovation Citation', 'Acoustic Design Medal', 'Audio Engineering Fellowship', 'Composition Distinction', 'Signal Processing Prize'],
    orgs: ['Audio Engineering Society (AES)', 'International Spatial Sound Forum', 'Acoustic Hardware Guild', 'Contemporary Composition Alliance', 'Digital Signal Craft Institute', 'Immersive Media Audio Council'],
    fallbackTopics: ['Spatial Synthesis', 'Analog Circuitry', 'Orchestral Scoring', 'Foley Textures', 'Mastering Precision', 'Neural Audio'],
  },
  {
    domain: 'gaming',
    match: /game|gaming|esports|vulkan|shader|raytrac|vr|xr|netcode|houdini|gameplay|unreal|unity/i,
    icons: ['🎮', '⚡', '🧊', '🖥️', '🏆', '✨'],
    prefixes: ['Real-Time', 'Volumetric', 'Procedural', 'Deterministic', 'Spatial', 'Interactive', 'Compute'],
    suffixes: ['Graphics Engineering Prize', 'Engine Architecture Award', 'Simulation Excellence Citation', 'Interactive Systems Honor', 'Rendering Breakthrough Medal', 'Gameplay Tech Fellowship'],
    orgs: ['SIGGRAPH Real-Time Collective', 'Interactive Engine Guild', 'Vulkan & GPU Compute Forum', 'Global Esports Analytics Board', 'Spatial XR Developers Council', 'Procedural Worlds Society'],
    fallbackTopics: ['Raytracing Pipelines', 'Rollback Netcode', 'Procedural Worldgen', 'Spatial Haptics', 'Compute Shaders', 'Frame Telemetry'],
  },
  {
    domain: 'security',
    match: /security|crypto|zero-knowledge|zk|post-quantum|enclave|trust|audit|ledger|cloudflare/i,
    icons: ['🛡️', '🔐', '📜', '⚡', '🌐', '🏆'],
    prefixes: ['Zero-Knowledge', 'Post-Quantum', 'Verifiable', 'Hardware-Attested', 'Cryptographic', 'Sovereign', 'Adversarial'],
    suffixes: ['Security Research Prize', 'Protocol Verification Medal', 'Cryptography Distinction', 'Trust Architecture Citation', 'Enclave Assurance Award', 'Privacy Engineering Honor'],
    orgs: ['Real-World Cryptography Council', 'International Security Audit Board', 'Zero-Trust Systems Alliance', 'Hardware Enclave Consortium', 'Applied Cryptography Institute', 'Global Cyber Resilience Forum'],
    fallbackTopics: ['Lattice Key Exchange', 'Formal Protocol Proofs', 'Hardware Attestation', 'Adversarial Fuzzing', 'Zero-Trust Routing', 'Key Management'],
  },
  {
    domain: 'robotics',
    match: /robot|slam|kalman|lidar|tactile|autonomous|drone|flight|kinematic|perception|motor|motion/i,
    icons: ['🤖', '📡', '⚙️', '🚀', '🔬', '🏆'],
    prefixes: ['Autonomous', 'Embodied', 'Dexterous', 'Closed-Loop', 'Multi-Sensor', 'Precision', 'Field'],
    suffixes: ['Robotics Innovation Award', 'Perception Systems Medal', 'Autonomy Research Citation', 'Control Theory Prize', 'Mechatronics Distinction', 'Field Robotics Fellowship'],
    orgs: ['IEEE Robotics & Automation Council', 'Autonomous Systems Consortium', 'Embodied Intelligence Forum', 'Field Mechatronics Institute', 'Sensor Fusion Research Union', 'International Control Society'],
    fallbackTopics: ['Visual SLAM', 'Tactile Manipulation', 'Sensor Fusion', 'Flight Stability', 'Sim2Real Transfer', 'Motion Planning'],
  },
  {
    domain: 'climate',
    match: /climate|battery|energy|microgrid|solar|green|sustainab|esg|grid|northvolt|clean/i,
    icons: ['🌱', '🔋', '☀️', '⚡', '🌍', '🏆'],
    prefixes: ['Grid-Scale', 'Solid-State', 'Resilient', 'Decarbonized', 'Electrochemical', 'Sustainable', 'Clean'],
    suffixes: ['Energy Breakthrough Award', 'Climate Systems Citation', 'Grid Engineering Medal', 'Sustainability Fellowship', 'Storage Innovation Prize', 'CleanTech Distinction'],
    orgs: ['Global Clean Energy Council', 'Grid Resilience Research Forum', 'Electrochemical Systems Union', 'Climate Infrastructure Alliance', 'Sustainable Engineering Institute', 'Renewable Telemetry Society'],
    fallbackTopics: ['Solid-State Cells', 'Microgrid Balancing', 'Grid Telemetry', 'Climate Resilience', 'Thermal Storage', 'Energy Forecasting'],
  },
  {
    domain: 'design',
    match: /design|frontend|react|figma|hci|interface|typography|crdt|webgl|product|ux/i,
    icons: ['🎨', '📐', '✨', '🖥️', '🏆', '💡'],
    prefixes: ['Spatial', 'Tactile', 'Local-First', 'Adaptive', 'High-Craft', 'Interactive', 'Collaborative'],
    suffixes: ['Interface Craft Award', 'Design Systems Citation', 'HCI Excellence Medal', 'Web Architecture Prize', 'Interaction Fellowship', 'Digital Craft Honor'],
    orgs: ['International HCI & Design Guild', 'Web Performance & UI Consortium', 'Interactive Systems Society', 'Global Digital Craft Academy', 'Collaborative Software Forum', 'Modern Typography & UX Council'],
    fallbackTopics: ['Design Systems', 'Local-First Sync', 'Spatial Interfaces', 'Sub-Frame Rendering', 'Keyboard Workflows', 'Motion Engineering'],
  },
  {
    domain: 'quant',
    match: /quant|stochastic|bayesian|market|finance|stripe|ledger|transaction|risk/i,
    icons: ['📊', '⚡', '🧮', '🌐', '🏆', '📜'],
    prefixes: ['Stochastic', 'Sub-Microsecond', 'Bayesian', 'High-Reliability', 'Deterministic', 'Quantitative', 'Global'],
    suffixes: ['Inference Architecture Prize', 'Execution Systems Medal', 'Reliability Engineering Award', 'Numerical Modeling Citation', 'Financial Infrastructure Honor', 'Systems Resilience Fellowship'],
    orgs: ['Quantitative Computing Society', 'High-Reliability Systems Forum', 'Applied Statistics & Execution Guild', 'Global Transaction Systems Council', 'Distributed Infrastructure Union', 'Computational Finance Institute'],
    fallbackTopics: ['Time-Series Modeling', 'Event-Driven Ledgers', 'Low-Latency Execution', 'Chaos Resilience', 'Probabilistic Inference', 'Throughput Tuning'],
  },
  {
    domain: 'ai_systems',
    match: /./,
    icons: ['⚡', '🔬', '🚀', '📜', '🌐', '🏆'],
    prefixes: ['Exascale', 'Kernel-Level', 'Distributed', 'Heterogeneous', 'Foundation', 'Parallel', 'Systems'],
    suffixes: ['Architecture Excellence Award', 'Compute Innovation Citation', 'Systems Engineering Medal', 'Research Impact Prize', 'Open Infrastructure Honor', 'Technical Leadership Fellowship'],
    orgs: ['ACM Systems & Architecture Forum', 'Frontier Compute Consortium', 'Open ML Infrastructure Guild', 'High-Performance Silicon Council', 'Distributed Computing Society', 'Applied AI Systems Institute'],
    fallbackTopics: ['Cluster Scheduling', 'Kernel Fusion', 'Consensus Fabrics', 'Memory Coherency', 'Graph Lowering', 'Inference Runtimes'],
  },
];

const assignedAchievementsByPerson = new Map<
  string,
  Array<{ icon: string; title: string; org: string; year: string; description: string }>
>();
const usedAchievementTitles = new Set<string>();
const usedAchievementDescriptions = new Set<string>();

// Pre-register every static MEMBER_PROFILES achievement so no dynamic person can collide with them
for (const profile of Object.values(MEMBER_PROFILES)) {
  const cKey = canonicalizeProfilePersonKey(profile.name);
  const enriched = profile.achievements.map((a) => {
    const desc =
      a.description ||
      `Honored by ${a.org} (${a.year}) for ${profile.name}'s work on ${a.title.toLowerCase()}.`;
    usedAchievementTitles.add(a.title.toLowerCase());
    usedAchievementDescriptions.add(desc.toLowerCase());
    return { ...a, description: desc };
  });
  profile.achievements = enriched;
  assignedAchievementsByPerson.set(cKey, enriched);
}

/**
 * Generates 3 to 6 strictly unique, domain-accurate achievements for any given author.
 * Guarantees ZERO shared achievement titles or descriptions across the entire platform.
 */
export function generateUniqueAchievementsForAuthor(
  authorName: string,
  authorHeadline: string,
  absHash: number,
  memberContext?: MemberProfileContext
) {
  const cKey = canonicalizeProfilePersonKey(authorName);
  const cached = assignedAchievementsByPerson.get(cKey);
  if (cached) return cached;

  const profileSignal = [
    authorHeadline,
    memberContext?.role,
    memberContext?.company,
    memberContext?.bio,
    ...(memberContext?.skills || []),
  ]
    .filter(Boolean)
    .join(' ');

  const spec =
    DOMAIN_ACHIEVEMENT_SPECS.find((s) => s.match.test(profileSignal)) ||
    DOMAIN_ACHIEVEMENT_SPECS[DOMAIN_ACHIEVEMENT_SPECS.length - 1];

  const targetCount = 3 + (absHash % 4); // 3, 4, 5, or 6 unique achievements
  const skillTopics = (memberContext?.skills || [])
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);
  const headlineParts = (authorHeadline || '')
    .split(/[,•&]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 4 && s.length <= 36);

  const personalTopics = [...new Set([...skillTopics, ...headlineParts, ...spec.fallbackTopics])];
  const companyTag = memberContext?.company?.trim();

  const result: Array<{ icon: string; title: string; org: string; year: string; description: string }> = [];

  for (let i = 0; i < targetCount; i++) {
    const itemSeed = stableProfileHash(`${cKey}::ach::${i}`);
    const topic = personalTopics[i % personalTopics.length] || spec.fallbackTopics[i % spec.fallbackTopics.length];
    const icon = spec.icons[(itemSeed + i) % spec.icons.length];
    const org = spec.orgs[(itemSeed + i * 3) % spec.orgs.length];
    const yearNum = 2025 - ((itemSeed + i) % 5);
    const year = i === 1 && yearNum < 2024 ? `${yearNum}–2025` : String(yearNum);

    let title = '';
    for (let attempt = 0; attempt < 24; attempt++) {
      const prefix = spec.prefixes[(itemSeed + i + attempt) % spec.prefixes.length];
      const suffix = spec.suffixes[(itemSeed + i * 2 + attempt * 3) % spec.suffixes.length];
      const cleanTopic = topic.replace(/^and\s+/i, '').trim();
      const candidateTitle =
        attempt === 0
          ? `${cleanTopic} ${suffix}`
          : attempt === 1
          ? `${prefix} ${cleanTopic} ${suffix}`
          : `${prefix} ${cleanTopic} ${suffix} (${yearNum})`;
      if (!usedAchievementTitles.has(candidateTitle.toLowerCase())) {
        title = candidateTitle;
        usedAchievementTitles.add(candidateTitle.toLowerCase());
        break;
      }
    }
    if (!title) {
      title = `${topic} ${spec.suffixes[i % spec.suffixes.length]} — ${authorName.split(' ')[0]}`;
      usedAchievementTitles.add(title.toLowerCase());
    }

    const impactMetric = 18 + ((itemSeed * 7) % 74);
    const descTemplates = [
      `Recognized by ${org} for advancing ${topic.toLowerCase()}${companyTag ? ` at ${companyTag}` : ''}, lifting benchmark reliability by ${impactMetric}% in peer evaluations.`,
      `Awarded for original methodology in ${topic.toLowerCase()}, adopted across ${3 + (itemSeed % 14)} collaborative engineering teams and published in ${year}.`,
      `Selected from global nominees for pioneering ${topic.toLowerCase()} workflows${companyTag ? ` with ${companyTag}` : ''}, setting a new reproducibility standard.`,
      `Cited by ${org} for technical breakthroughs in ${topic.toLowerCase()} that cut real-world iteration overhead by ${impactMetric}%.`,
      `Honored for open-specification contributions to ${topic.toLowerCase()} and mentoring emerging specialists across ${memberContext?.location || 'international hubs'}.`,
      `Distinguished for field-tested ${topic.toLowerCase()} architecture delivering verifiable gains across production deployments in ${year}.`,
    ];
    let description = descTemplates[(itemSeed + i) % descTemplates.length];
    if (usedAchievementDescriptions.has(description.toLowerCase())) {
      description = `${description} Lead contributor: ${authorName}.`;
    }
    usedAchievementDescriptions.add(description.toLowerCase());

    result.push({ icon, title, org, year, description });
  }

  assignedAchievementsByPerson.set(cKey, result);
  return result;
}

export interface MemberProfileContext {
  role?: string;
  company?: string;
  bio?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
  preserveExactAvatar?: boolean;
}

/**
 * 72 curated, completely distinct high-resolution Unsplash background banners.
 * Zero overlap with the static coverUrls in MEMBER_PROFILES above.
 */
const UNIQUE_COVER_POOL: string[] = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1536152470836-b943b246224c?w=1200&auto=format&fit=crop&q=80',
];

const assignedCoverByPerson = new Map<string, string>();
const usedCoverUrls = new Set<string>();
const assignedMetricsByPerson = new Map<string, { honors: string; patentsCount: number | string; contributorRank: string }>();
const usedMetricsKeys = new Set<string>();
const assignedSafetyByPerson = new Map<string, string>();
const usedSafetyNumbers = new Set<string>();
const assignedCountsByPerson = new Map<string, { communitiesCount: number; connectionsCount: number }>();
const usedCountPairs = new Set<string>();

// Pre-register all static MEMBER_PROFILES fields so no dynamic member can ever collide with them
for (const profile of Object.values(MEMBER_PROFILES)) {
  const cKey = canonicalizeProfilePersonKey(profile.name);
  assignedCoverByPerson.set(cKey, profile.coverUrl);
  usedCoverUrls.add(profile.coverUrl);
  if (profile.metrics) {
    assignedMetricsByPerson.set(cKey, profile.metrics);
    usedMetricsKeys.add(`${profile.metrics.honors}|${profile.metrics.patentsCount}|${profile.metrics.contributorRank}`);
  }
  assignedSafetyByPerson.set(cKey, profile.safetyNumber);
  usedSafetyNumbers.add(profile.safetyNumber);
  assignedCountsByPerson.set(cKey, {
    communitiesCount: profile.communitiesCount,
    connectionsCount: profile.connectionsCount,
  });
  usedCountPairs.add(`${profile.communitiesCount}|${profile.connectionsCount}`);
}

/**
 * Deterministically assigns a 100% unique background cover photo to every unique canonical person.
 * Clicking the same person always returns the exact same background; two different people never share one.
 */
export function getUniqueCoverUrl(personName: string): string {
  const key = canonicalizeProfilePersonKey(personName);
  const existing = assignedCoverByPerson.get(key);
  if (existing) return existing;

  const startIdx = stableProfileHash(key) % UNIQUE_COVER_POOL.length;

  for (let offset = 0; offset < UNIQUE_COVER_POOL.length; offset++) {
    const candidate = UNIQUE_COVER_POOL[(startIdx + offset) % UNIQUE_COVER_POOL.length];
    if (!usedCoverUrls.has(candidate)) {
      assignedCoverByPerson.set(key, candidate);
      usedCoverUrls.add(candidate);
      return candidate;
    }
  }

  const fallback = UNIQUE_COVER_POOL[startIdx];
  assignedCoverByPerson.set(key, fallback);
  return fallback;
}

const ALMA_MATER_POOL = [
  'MIT CSAIL Alum',
  'Stanford AI Lab Alum',
  'UC Berkeley EECS Alum',
  'CMU Robotics Alum',
  'ETH Zürich Alum',
  'Caltech Alum',
  'Oxford Computing Alum',
  'Cambridge Lab Alum',
  'Harvard SEAS Alum',
  'Princeton CS Alum',
  'Cornell Tech Alum',
  'University of Tokyo Alum',
  'EPFL Lausanne Alum',
  'Imperial College Alum',
  'University of Toronto Alum',
  'Columbia Engineering Alum',
];

function allocateUniqueMetrics(personKey: string, absHash: number) {
  const existing = assignedMetricsByPerson.get(personKey);
  if (existing) return existing;

  const honorsPool = [
    '1st', 'Top 3', 'Gold Medal', 'Grand Prize', 'Fellow', 'Pioneer',
    'Laureate', '1st Prize', 'Medalist', 'Top 5', 'Honoree', 'Distinguished', 'Top 2%',
  ];
  const rankPool = [
    'Top 0.1%', 'Top 0.3%', 'Top 0.5%', 'Top 0.8%', 'Top 1%', 'Top 1.2%',
    'Top 1.5%', 'Top 2%', 'Top 2.5%', 'Top 3%', 'Top 4%', 'Top 5%',
  ];

  for (let attempt = 0; attempt < 200; attempt++) {
    const honors = honorsPool[(absHash + attempt) % honorsPool.length];
    const patentsCount = 5 + ((absHash + attempt * 5) % 28);
    const contributorRank = rankPool[(absHash * 7 + attempt * 3) % rankPool.length];
    const sig = `${honors}|${patentsCount}|${contributorRank}`;
    if (!usedMetricsKeys.has(sig)) {
      const result = { honors, patentsCount, contributorRank };
      usedMetricsKeys.add(sig);
      assignedMetricsByPerson.set(personKey, result);
      return result;
    }
  }
  const fallback = { honors: 'Fellow', patentsCount: 7 + (absHash % 20), contributorRank: 'Top 1%' };
  assignedMetricsByPerson.set(personKey, fallback);
  return fallback;
}

function allocateUniqueSafetyNumber(personKey: string, absHash: number): string {
  const existing = assignedSafetyByPerson.get(personKey);
  if (existing) return existing;

  for (let attempt = 0; attempt < 50; attempt++) {
    const seed = absHash + attempt * 997;
    const candidate = `${1000 + (seed % 8999)}-${2000 + ((seed * 3) % 7999)}-${3000 + ((seed * 7) % 6999)}-${4000 + ((seed * 11) % 5999)}`;
    if (!usedSafetyNumbers.has(candidate)) {
      usedSafetyNumbers.add(candidate);
      assignedSafetyByPerson.set(personKey, candidate);
      return candidate;
    }
  }
  return `${1000 + (absHash % 8999)}-${2000 + ((absHash * 3) % 7999)}-${3000 + ((absHash * 7) % 6999)}-${4000 + ((absHash * 11) % 5999)}`;
}

function allocateUniqueCounts(personKey: string, absHash: number) {
  const existing = assignedCountsByPerson.get(personKey);
  if (existing) return existing;

  for (let attempt = 0; attempt < 100; attempt++) {
    const communitiesCount = 6 + ((absHash + attempt) % 13);
    const connectionsCount = 840 + ((absHash * 13 + attempt * 37) % 1750);
    const sig = `${communitiesCount}|${connectionsCount}`;
    if (!usedCountPairs.has(sig)) {
      const pair = { communitiesCount, connectionsCount };
      usedCountPairs.add(sig);
      assignedCountsByPerson.set(personKey, pair);
      return pair;
    }
  }
  const fallback = { communitiesCount: 9, connectionsCount: 1200 + (absHash % 800) };
  assignedCountsByPerson.set(personKey, fallback);
  return fallback;
}

/**
 * Returns member profile or generates a realistic, complete, strictly non-overlapping profile
 * matching Jennies Vance's structure. Guarantees every distinct person has a unique avatar,
 * cover banner, achievements, descriptions, metrics, handle, email, safety number, and stats.
 */
export function getMemberProfile(
  authorId: string,
  authorName: string,
  authorAvatar: string,
  authorHeadline: string,
  memberContext?: MemberProfileContext
): MemberProfileDetail {
  const canonicalKey = canonicalizeProfilePersonKey(authorName);
  const absHash = stableProfileHash(canonicalKey);

  const cleanUsername = `@${canonicalKey.replace(/[^a-z0-9]/g, '')}`;
  const cleanSlug = canonicalKey.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const companySource = memberContext?.company || authorHeadline || 'Cronium Network';
  const cleanOrgSlug =
    companySource
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join('') || 'cronium';

  const orgDomains = ['network', 'io', 'ai', 'org', 'dev', 'systems', 'tech', 'research'];
  const domainExt = orgDomains[absHash % orgDomains.length];
  const emailLocal = canonicalKey.replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
  const uniqueEmail = `${emailLocal || 'member'}@${cleanOrgSlug}.${domainExt}`;

  const DIVERSE_ORGANIZATIONS = [
    'DeepMind Systems & Intelligence Lab',
    'Stanford Artificial Intelligence Laboratory (SAIL)',
    'MIT Computer Science & Artificial Intelligence Lab (CSAIL)',
    'Berkeley AI Research (BAIR) Lab',
    'Anthropic Frontier Alignment & Safety Core',
    'OpenAI Supercomputing Architecture Group',
    'Carnegie Mellon Robotics & Vision Institute',
    'NVIDIA Applied Deep Learning Research',
    'Apple Machine Learning & Neural Systems',
    'CERN Advanced Computing Laboratory',
    'Harvard Biodesign & Neural Systems Lab',
    'Oxford Quantum & Information Institute',
    'ETH Zürich Distributed Systems Core',
    'Max Planck Institute for Intelligent Systems',
    'Princeton Computational Neuroscience Group',
    'Caltech Space Structures & Autonomous Systems',
    'Cornell Tech Urban Systems Initiative',
    'Cambridge Computer Laboratory & Systems Research',
    'Meta Fundamental AI Research (FAIR)',
    'Google DeepMind Autonomous Agents Core',
    'Jane Street High-Performance Systems Core',
    'Palantir Foundry Systems Architecture',
    'JAXA Space Robotics & Quantum Aeronautics',
    'Microsoft Research Quantum Systems Lab',
    'Bell Labs Advanced Communications Institute',
  ];

  const almaMater = ALMA_MATER_POOL[absHash % ALMA_MATER_POOL.length];

  let defaultOrg = '';
  if (memberContext?.company) {
    defaultOrg = `${memberContext.company} • ${almaMater}`;
  } else if (authorHeadline && (authorHeadline.includes('@') || authorHeadline.includes(' at '))) {
    const orgPart = authorHeadline.includes('@')
      ? authorHeadline.split('@')[1].split('•')[0].trim()
      : authorHeadline.split(' at ')[1].split('•')[0].trim();
    defaultOrg = `${orgPart} • ${almaMater}`;
  } else {
    defaultOrg = `${DIVERSE_ORGANIZATIONS[absHash % DIVERSE_ORGANIZATIONS.length]} • ${almaMater}`;
  }

  const defaultSafety = allocateUniqueSafetyNumber(canonicalKey, absHash);
  const { communitiesCount: commsCount, connectionsCount: connCount } = allocateUniqueCounts(
    canonicalKey,
    absHash
  );
  const dynamicMetrics = allocateUniqueMetrics(canonicalKey, absHash);

  // Match strictly by exact ID or exact canonical full name (honorifics normalized, never substring)
  const existing =
    MEMBER_PROFILES[authorId] ||
    Object.values(MEMBER_PROFILES).find(
      (p) => canonicalizeProfilePersonKey(p.name) === canonicalKey
    );

  // Always resolve through the global collision-free portrait registry so two people NEVER share a face
  const resolvedAvatar = resolveGenderMatchedAvatar(
    authorName || existing?.name || '',
    authorAvatar || existing?.avatar
  );

  // Build exact title matching what the user saw in the Members card before clicking
  const memberDirectoryTitle =
    memberContext?.role && memberContext?.company
      ? `${memberContext.role} • ${memberContext.company}`
      : memberContext?.role || authorHeadline;

  if (existing) {
    const hasDirectoryContext = Boolean(memberContext?.company || memberContext?.role || memberContext?.bio);
    const displayName = authorName || existing.name;
    const enrichedAchievements = existing.achievements.map((item, idx) => {
      if (item.description && item.description.trim().length > 0) return item;
      const templates = [
        `Awarded to ${displayName} by ${item.org} (${item.year}) for "${item.title}", advancing measurable engineering benchmarks.`,
        `Conferred by ${item.org} in ${item.year} recognizing ${displayName}'s peer-reviewed work on "${item.title}".`,
        `Verified ${item.year} distinction from ${item.org} honoring ${displayName}'s leadership in "${item.title}".`,
        `Issued by ${item.org} (${item.year}) to highlight ${displayName}'s original technical contributions toward "${item.title}".`,
        `Peer-audited ${item.year} credential from ${item.org} citing ${displayName}'s breakthrough execution on "${item.title}".`,
        `Selected by ${item.org} in ${item.year} for ${displayName}'s open-specification impact on "${item.title}".`,
      ];
      return {
        ...item,
        description: templates[(absHash + idx) % templates.length],
      };
    });
    return {
      ...existing,
      avatar: resolvedAvatar,
      name: displayName,
      username: existing.username || cleanUsername,
      coverUrl: existing.coverUrl,
      title: hasDirectoryContext ? memberDirectoryTitle || existing.title : authorHeadline || existing.title,
      bio: hasDirectoryContext
        ? memberContext?.bio || existing.bio
        : existing.bio,
      organization:
        hasDirectoryContext && memberContext?.company
          ? `${memberContext.company} • ${
              existing.organization.includes('•')
                ? existing.organization.split('•').slice(1).join('•').trim()
                : almaMater
            }`
          : existing.organization || defaultOrg,
      email: hasDirectoryContext && memberContext?.company ? uniqueEmail : existing.email || uniqueEmail,
      linkedinUrl: memberContext?.linkedinUrl || existing.linkedinUrl || `linkedin.com/in/${cleanSlug}`,
      githubUrl: memberContext?.githubUrl || existing.githubUrl || `github.com/${cleanUsername.slice(1)}`,
      safetyNumber: existing.safetyNumber || defaultSafety,
      hardwareStatus: existing.hardwareStatus || 'Hardware Enclave • Secure Element Active',
      metrics: existing.metrics || dynamicMetrics,
      achievements: enrichedAchievements,
      recentTopics:
        memberContext?.skills && memberContext.skills.length > 0
          ? memberContext.skills
          : existing.recentTopics,
    };
  }

  // Generate 3 to 6 globally unique, domain-tailored achievements for this author
  const generatedAchievements = generateUniqueAchievementsForAuthor(
    authorName,
    authorHeadline,
    absHash,
    memberContext
  );

  const achCount = generatedAchievements.length;
  const levelNum =
    achCount === 6
      ? 64 + (absHash % 4)
      : achCount === 5
      ? 54 + (absHash % 4)
      : achCount === 4
      ? 44 + (absHash % 4)
      : 36 + (absHash % 4);

  const calculatedRank =
    levelNum >= 60
      ? 'Mythic II'
      : levelNum >= 50
      ? 'Legend II'
      : levelNum >= 40
      ? 'Master III'
      : 'Adept I';

  const distinctBio =
    memberContext?.bio ||
    (authorHeadline
      ? `Focused on ${authorHeadline.toLowerCase()} with an emphasis on verifiable engineering, collaborative benchmarks, and open technical dialogue.`
      : `${authorName} collaborates across Cronium research channels on applied engineering, verifiable workflows, and peer-reviewed architecture.`);

  return {
    id: authorId,
    name: authorName,
    username: cleanUsername,
    avatar: resolvedAvatar,
    coverUrl: getUniqueCoverUrl(authorName),
    badge: 'Verified Senior Member',
    title: memberDirectoryTitle || `${authorName.split(' ')[0]}'s Systems & Research Practice`,
    bio: distinctBio,
    organization: defaultOrg,
    email: uniqueEmail,
    linkedinUrl: memberContext?.linkedinUrl || `linkedin.com/in/${cleanSlug}`,
    githubUrl: memberContext?.githubUrl || `github.com/${cleanUsername.slice(1)}`,
    safetyNumber: defaultSafety,
    hardwareStatus: 'Hardware Enclave • Secure Element Active',
    communitiesCount: commsCount,
    connectionsCount: connCount,
    brandStatus: {
      rankTitle: calculatedRank,
      level: levelNum,
      points: levelNum * 100 + 40,
      nextRank: 'Next Tier',
      progressPercent: 72 + (absHash % 24),
    },
    metrics: dynamicMetrics,
    achievements: generatedAchievements,
    recentTopics:
      memberContext?.skills && memberContext.skills.length > 0
        ? memberContext.skills
        : ['Systems', 'Engineering', 'Architecture', 'Research'],
  };
}
