import { Post } from '../types/social';
import { INITIAL_SOCIAL_POSTS } from '../data/mockSocialPosts';
import { COMPREHENSIVE_FRESH_POSTS } from '../data/freshFeedPostsData';
import { DEDICATED_USER_POSTS } from '../data/userPostsData';
import {
  portraitAlexanderPatrick,
  portraitAnnaSan,
  portraitElenaRostova,
  portraitHiroshiTanaka,
  portraitLiamChen,
  portraitMarcusVance,
  portraitPriyaPatel,
  portraitZoeKim,
  portraitTariqAlmansoor,
  portraitAmaraOkafor,
  portraitGeorgeAllan,
  portraitClassieWilley,
  jenniesPortrait,
} from '../data/mockData';

export type BrandLogoVariant =
  | 'a16z'
  | 'ycombinator'
  | 'stanford'
  | 'jaxa'
  | 'neuralmesh'
  | 'cerebras'
  | 'nvidia'
  | 'mlir'
  | 'riscv'
  | 'cronium'
  | 'rwc';

export interface BrandPageInfo {
  kind: 'organization';
  name: string;
  verified: boolean;
  pillText: string;
  activityUnit: string;
  logoVariant: BrandLogoVariant;
  tag: string;
  followers: number;
  weeklyActivity: number;
  description: string;
}

export interface HashtagMetadata {
  tag: string;
  displayTag: string;
  description: string;
  baseFollowers: number;
  weeklyPosts: number;
  activityUnit: string;
  category: string;
  relatedTags: string[];
  isSpecificBrand: boolean;
  brand?: BrandPageInfo;
  relatedPages: BrandPageInfo[];
}

const FOLLOWED_HASHTAGS_KEY = 'cronium_followed_hashtags_v1';

export const cleanHashtag = (raw: string): string => {
  return raw.trim().replace(/^#+/, '');
};

export const normalizeHashtagKey = (raw: string): string => {
  return cleanHashtag(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

export const formatHashtagDisplay = (raw: string): string => {
  const cleaned = cleanHashtag(raw);
  return `#${cleaned}`;
};

export const SPECIFIC_BRAND_PAGES: Record<string, BrandPageInfo> = {
  a16z: {
    kind: 'organization',
    name: 'Andreessen Horowitz',
    verified: true,
    pillText: 'Venture Capital · Menlo Park',
    activityUnit: 'portfolio updates this week',
    logoVariant: 'a16z',
    tag: 'a16z',
    followers: 142800,
    weeklyActivity: 48,
    description:
      'Backing bold founders building the future across AI, bio, crypto, American dynamism, consumer, enterprise, and fintech.',
  },
  ycombinator: {
    kind: 'organization',
    name: 'Y Combinator',
    verified: true,
    pillText: 'Startup Accelerator · San Francisco',
    activityUnit: 'batch launches this week',
    logoVariant: 'ycombinator',
    tag: 'YCombinator',
    followers: 215400,
    weeklyActivity: 64,
    description:
      'Funding early-stage technical founders twice a year to make something people want across AI, developer tools, bio, and frontier hardware.',
  },
  stanfordai: {
    kind: 'organization',
    name: 'Stanford AI Lab',
    verified: true,
    pillText: 'AI Research Lab · Stanford, CA',
    activityUnit: 'research updates this week',
    logoVariant: 'stanford',
    tag: 'StanfordAI',
    followers: 128600,
    weeklyActivity: 31,
    description:
      'Advancing foundational machine learning, robotics, verifiable reasoning, and human-centered autonomous systems since 1962.',
  },
  jaxa: {
    kind: 'organization',
    name: 'JAXA Aerospace',
    verified: true,
    pillText: 'Space Agency · Tokyo',
    activityUnit: 'mission updates this week',
    logoVariant: 'jaxa',
    tag: 'JAXA',
    followers: 96400,
    weeklyActivity: 19,
    description:
      'Deep-space electric propulsion, orbital navigation, lunar exploration, and cryogenic instrumentation research from Japan.',
  },
  neuralmesh: {
    kind: 'organization',
    name: 'NeuralMesh',
    verified: true,
    pillText: 'AI Infrastructure · San Francisco',
    activityUnit: 'engineering updates this week',
    logoVariant: 'neuralmesh',
    tag: 'NeuralMesh',
    followers: 48200,
    weeklyActivity: 22,
    description:
      'Building decentralized compute fabrics, custom GPU kernels, and autonomous agent orchestration backed by a16z and Y Combinator.',
  },
  cerebras: {
    kind: 'organization',
    name: 'Cerebras Systems',
    verified: true,
    pillText: 'AI Semiconductors · Sunnyvale',
    activityUnit: 'silicon updates this week',
    logoVariant: 'cerebras',
    tag: 'Cerebras',
    followers: 84500,
    weeklyActivity: 27,
    description:
      'Pioneering wafer-scale compute engines with on-chip SRAM fabrics delivering ultra-low-latency AI training and inference.',
  },
  nvidia: {
    kind: 'organization',
    name: 'NVIDIA Compute',
    verified: true,
    pillText: 'GPU Architecture · Santa Clara',
    activityUnit: 'kernel updates this week',
    logoVariant: 'nvidia',
    tag: 'CUDA',
    followers: 318900,
    weeklyActivity: 74,
    description:
      'Accelerated computing, CUDA and Triton kernel engineering, Hopper clusters, and full-stack infrastructure for AI and simulation.',
  },
  mlir: {
    kind: 'organization',
    name: 'MLIR & LLVM',
    verified: true,
    pillText: 'Compiler Infrastructure · Open Source',
    activityUnit: 'compiler updates this week',
    logoVariant: 'mlir',
    tag: 'MLIR',
    followers: 67300,
    weeklyActivity: 39,
    description:
      'Modular intermediate representations, polyhedral optimization dialects, and next-generation heterogeneous compiler toolchains.',
  },
  riscv: {
    kind: 'organization',
    name: 'RISC-V International',
    verified: true,
    pillText: 'Open Silicon ISA · Zurich',
    activityUnit: 'tape-out updates this week',
    logoVariant: 'riscv',
    tag: 'RISCV',
    followers: 73100,
    weeklyActivity: 29,
    description:
      'Open-standard instruction set architecture enabling custom accelerators, edge controllers, and verifiable open-source silicon.',
  },
  realworldcrypto: {
    kind: 'organization',
    name: 'Real-World Crypto',
    verified: true,
    pillText: 'Cryptography Symposium · Global',
    activityUnit: 'protocol updates this week',
    logoVariant: 'rwc',
    tag: 'RealWorldCrypto',
    followers: 52900,
    weeklyActivity: 24,
    description:
      'Bridging applied cryptographic research and deployed zero-knowledge, post-quantum, and privacy-preserving systems.',
  },
  cronium: {
    kind: 'organization',
    name: 'Cronium Core',
    verified: true,
    pillText: 'Sovereign AI Network · San Francisco',
    activityUnit: 'network updates this week',
    logoVariant: 'cronium',
    tag: 'Cronium',
    followers: 112400,
    weeklyActivity: 42,
    description:
      'Zero-knowledge peer-to-peer communities, encrypted messaging, and verifiable identity infrastructure for technical builders.',
  },
};

const BRAND_ALIAS_MAP: Record<string, string> = {
  a16z: 'a16z',
  andreessenhorowitz: 'a16z',
  ycombinator: 'ycombinator',
  yc: 'ycombinator',
  stanfordai: 'stanfordai',
  stanfordailab: 'stanfordai',
  jaxa: 'jaxa',
  neuralmesh: 'neuralmesh',
  cerebras: 'cerebras',
  cerebrassystems: 'cerebras',
  cuda: 'nvidia',
  h100: 'nvidia',
  triton: 'nvidia',
  nvidia: 'nvidia',
  mlir: 'mlir',
  llvm: 'mlir',
  riscv: 'riscv',
  realworldcrypto: 'realworldcrypto',
  cronium: 'cronium',
};

const BROAD_TOPIC_RELATED_PAGES: Record<string, string[]> = {
  venturecapital: ['a16z', 'ycombinator', 'neuralmesh'],
  funding: ['a16z', 'ycombinator', 'neuralmesh'],
  startups: ['ycombinator', 'a16z', 'neuralmesh'],
  aistartups: ['ycombinator', 'a16z', 'neuralmesh'],
  aistartupshardware: ['ycombinator', 'a16z', 'cerebras'],
  autonomousagents: ['stanfordai', 'a16z', 'neuralmesh'],
  aiarchitecture: ['stanfordai', 'cerebras', 'nvidia'],
  robotics: ['stanfordai', 'ycombinator', 'nvidia'],
  waferscale: ['cerebras', 'nvidia', 'mlir'],
  hardware: ['cerebras', 'riscv', 'nvidia'],
  systems: ['mlir', 'nvidia', 'cronium'],
  distributedsystems: ['cronium', 'neuralmesh', 'mlir'],
  compilers: ['mlir', 'riscv', 'nvidia'],
  rust: ['mlir', 'cronium', 'realworldcrypto'],
  cryptography: ['realworldcrypto', 'cronium', 'stanfordai'],
  zkproofs: ['realworldcrypto', 'cronium', 'a16z'],
  aerospace: ['jaxa', 'stanfordai'],
  deepspace: ['jaxa', 'stanfordai'],
  propulsion: ['jaxa', 'stanfordai'],
  quantumcomputing: ['jaxa', 'stanfordai'],
  hackathons: ['ycombinator', 'cerebras', 'cronium'],
};

const resolveRelatedPagesForTopic = (key: string): BrandPageInfo[] => {
  const mappedKeys = BROAD_TOPIC_RELATED_PAGES[key];
  if (mappedKeys) {
    return mappedKeys.map((k) => SPECIFIC_BRAND_PAGES[k]).filter(Boolean);
  }
  if (key.includes('venture') || key.includes('fund') || key.includes('startup') || key.includes('seed')) {
    return [SPECIFIC_BRAND_PAGES.a16z, SPECIFIC_BRAND_PAGES.ycombinator, SPECIFIC_BRAND_PAGES.neuralmesh];
  }
  if (key.includes('ai') || key.includes('ml') || key.includes('agent') || key.includes('diffusion')) {
    return [SPECIFIC_BRAND_PAGES.stanfordai, SPECIFIC_BRAND_PAGES.a16z, SPECIFIC_BRAND_PAGES.cerebras];
  }
  if (key.includes('space') || key.includes('aero') || key.includes('quantum') || key.includes('astro')) {
    return [SPECIFIC_BRAND_PAGES.jaxa, SPECIFIC_BRAND_PAGES.stanfordai];
  }
  if (key.includes('crypto') || key.includes('zk') || key.includes('privacy') || key.includes('security')) {
    return [SPECIFIC_BRAND_PAGES.realworldcrypto, SPECIFIC_BRAND_PAGES.cronium];
  }
  if (key.includes('chip') || key.includes('gpu') || key.includes('compiler') || key.includes('silicon')) {
    return [SPECIFIC_BRAND_PAGES.cerebras, SPECIFIC_BRAND_PAGES.nvidia, SPECIFIC_BRAND_PAGES.mlir];
  }
  return [SPECIFIC_BRAND_PAGES.ycombinator, SPECIFIC_BRAND_PAGES.a16z];
};

const CURATED_HASHTAG_META: Record<
  string,
  Omit<HashtagMetadata, 'tag' | 'displayTag' | 'isSpecificBrand' | 'brand' | 'relatedPages' | 'activityUnit'> & {
    activityUnit?: string;
  }
> = {
  venturecapital: {
    description:
      'Institutional funding rounds, deep-tech thesis memos, founder fundraising notes, and frontier hardware capital allocation.',
    baseFollowers: 148200,
    weeklyPosts: 2410,
    category: 'Finance & Venture',
    relatedTags: ['Funding', 'YCombinator', 'a16z', 'Startups', 'AIStartups'],
  },
  funding: {
    description:
      'Seed to Series C announcements, cap table lessons, non-dilutive research grants, and investor updates across deep tech.',
    baseFollowers: 94600,
    weeklyPosts: 1680,
    category: 'Capital & Growth',
    relatedTags: ['VentureCapital', 'Startups', 'YCombinator', 'a16z', 'AIHardware'],
  },
  ycombinator: {
    description:
      'Funding early-stage technical founders twice a year to make something people want across AI, developer tools, bio, and frontier hardware.',
    baseFollowers: 215400,
    weeklyPosts: 64,
    activityUnit: 'batch launches this week',
    category: 'Startup Accelerator · San Francisco',
    relatedTags: ['Startups', 'VentureCapital', 'Funding', 'a16z', 'AutonomousAgents'],
  },
  a16z: {
    description:
      'Backing bold founders building the future across AI, bio, crypto, American dynamism, consumer, enterprise, and fintech.',
    baseFollowers: 142800,
    weeklyPosts: 48,
    activityUnit: 'portfolio updates this week',
    category: 'Venture Capital · Menlo Park',
    relatedTags: ['VentureCapital', 'YCombinator', 'Funding', 'AIInfrastructure', 'Startups'],
  },
  startups: {
    description:
      'Zero-to-one engineering, founder journeys, early hiring playbooks, and product launches from technical builders.',
    baseFollowers: 412500,
    weeklyPosts: 6840,
    category: 'Entrepreneurship',
    relatedTags: ['VentureCapital', 'YCombinator', 'Funding', 'AIStartups', 'Hackathons'],
  },
  aistartupshardware: {
    description:
      'Custom silicon, neural mesh interconnects, robotics startups, and wafer-scale AI infrastructure builders.',
    baseFollowers: 78400,
    weeklyPosts: 1290,
    category: 'AI & Hardware',
    relatedTags: ['VentureCapital', 'WaferScale', 'AIHardware', 'Robotics', 'Startups'],
  },
  aistartups: {
    description:
      'Applied AI companies shipping autonomous agents, inference engines, and next-gen developer workflows.',
    baseFollowers: 164300,
    weeklyPosts: 3450,
    category: 'Artificial Intelligence',
    relatedTags: ['Startups', 'VentureCapital', 'YCombinator', 'AutonomousAgents', 'Funding'],
  },
  hackathons: {
    description:
      '48-hour hardware & AI build sprints, live demos, benchmark breakthroughs, and rapid open-source prototyping.',
    baseFollowers: 63200,
    weeklyPosts: 980,
    category: 'Builder Events',
    relatedTags: ['WaferScale', 'Systems', 'Rust', 'Startups', 'AIArchitecture'],
  },
  waferscale: {
    description:
      'Wafer-scale compute fabrics, ultra-low-latency chip interconnects, and massive parallel AI training clusters.',
    baseFollowers: 31800,
    weeklyPosts: 420,
    category: 'Semiconductors',
    relatedTags: ['Systems', 'Diffusion', 'Hackathons', 'AIHardware', 'Hardware'],
  },
  diffusion: {
    description:
      'Distributed diffusion architectures, generative synthesis benchmarks, and real-time inference optimizations.',
    baseFollowers: 54900,
    weeklyPosts: 870,
    category: 'Machine Learning',
    relatedTags: ['WaferScale', 'Systems', 'AIArchitecture', 'AutonomousAgents'],
  },
  systems: {
    description:
      'Kernel engineering, lock-free concurrency, memory bandwidth tuning, and high-throughput distributed runtimes.',
    baseFollowers: 118500,
    weeklyPosts: 1840,
    category: 'Systems Engineering',
    relatedTags: ['DistributedSystems', 'Rust', 'WaferScale', 'Hackathons'],
  },
  hiking: {
    description:
      'High-altitude alpine routes, weekend summit trails, and builders recharging offline in the backcountry.',
    baseFollowers: 87300,
    weeklyPosts: 1520,
    category: 'Outdoors & Wellness',
    relatedTags: ['Outdoors', 'Workplace', 'Philosophy', 'DailyLifestyle'],
  },
  outdoors: {
    description:
      'Trail reports, gear notes, and outdoor community adventures organized by engineers and researchers.',
    baseFollowers: 102400,
    weeklyPosts: 1790,
    category: 'Lifestyle & Outdoors',
    relatedTags: ['Hiking', 'Workplace', 'Philosophy'],
  },
  workplace: {
    description:
      'High-trust engineering culture, sustainable velocity, remote research labs, and leadership practices.',
    baseFollowers: 134700,
    weeklyPosts: 2150,
    category: 'Leadership & Culture',
    relatedTags: ['Startups', 'Philosophy', 'Hiking', 'Outdoors'],
  },
  cryptography: {
    description:
      'Applied cryptography, zero-knowledge proofs, post-quantum primitives, and verifiable computation.',
    baseFollowers: 68900,
    weeklyPosts: 940,
    category: 'Security & Cryptography',
    relatedTags: ['ZKProofs', 'Privacy', 'DistributedSystems', 'Rust'],
  },
  zkproofs: {
    description:
      'Succinct zk-SNARKs, recursive folding schemes, mobile prover optimization, and private state verification.',
    baseFollowers: 49200,
    weeklyPosts: 760,
    category: 'Zero-Knowledge',
    relatedTags: ['Cryptography', 'Privacy', 'AutonomousAgents', 'DistributedSystems'],
  },
  robotics: {
    description:
      'Humanoid kinematics, actuator control loops, ROS2 autonomy stacks, and real-world embodied AI.',
    baseFollowers: 156100,
    weeklyPosts: 2310,
    category: 'Robotics & Hardware',
    relatedTags: ['AIStartups', 'Hardware', 'AutonomousAgents', 'Systems'],
  },
  autonomousagents: {
    description:
      'Multi-agent orchestration, verifiable tool execution, and real-time reasoning protocols in production.',
    baseFollowers: 129400,
    weeklyPosts: 2680,
    category: 'Agentic AI',
    relatedTags: ['AIArchitecture', 'ZKProofs', 'DistributedSystems', 'YCombinator'],
  },
  rust: {
    description:
      'Memory-safe systems programming, async runtimes, WebAssembly compilers, and embedded firmware in Rust.',
    baseFollowers: 141600,
    weeklyPosts: 2290,
    category: 'Programming Languages',
    relatedTags: ['Systems', 'DistributedSystems', 'Cryptography', 'Hackathons'],
  },
};

const hashString = (input: string): number => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

export const getHashtagMetadata = (rawTag: string): HashtagMetadata => {
  const cleaned = cleanHashtag(rawTag);
  const key = normalizeHashtagKey(cleaned);

  // 1. Check if this hashtag corresponds to a specific organization / brand page
  const brandKey = BRAND_ALIAS_MAP[key];
  const brand = brandKey ? SPECIFIC_BRAND_PAGES[brandKey] : undefined;
  const curated = CURATED_HASHTAG_META[key];

  if (brand) {
    return {
      tag: cleaned,
      displayTag: `#${cleaned}`,
      description: brand.description,
      baseFollowers: brand.followers,
      weeklyPosts: brand.weeklyActivity,
      activityUnit: brand.activityUnit,
      category: brand.pillText,
      relatedTags:
        curated?.relatedTags ||
        ['VentureCapital', 'Startups', 'AIStartups', 'Funding', 'Systems'].filter(
          (t) => normalizeHashtagKey(t) !== key
        ),
      isSpecificBrand: true,
      brand,
      relatedPages: [],
    };
  }

  if (curated) {
    return {
      tag: cleaned,
      displayTag: `#${cleaned}`,
      description: curated.description,
      baseFollowers: curated.baseFollowers,
      weeklyPosts: curated.weeklyPosts,
      activityUnit: curated.activityUnit || 'posts this week',
      category: curated.category,
      relatedTags: curated.relatedTags,
      isSpecificBrand: false,
      relatedPages: resolveRelatedPagesForTopic(key),
    };
  }

  const seed = hashString(key || 'cronium');
  const baseFollowers = 12400 + (seed % 85000);
  const weeklyPosts = 180 + (seed % 1450);

  return {
    tag: cleaned,
    displayTag: `#${cleaned}`,
    description: `Curated discussions, field notes, and verified updates from builders and researchers posting about #${cleaned} across Cronium.`,
    baseFollowers,
    weeklyPosts,
    activityUnit: 'posts this week',
    category: 'Cronium Topic',
    relatedTags: ['Startups', 'VentureCapital', 'AIArchitecture', 'Systems', 'Hackathons'].filter(
      (t) => normalizeHashtagKey(t) !== key
    ),
    isSpecificBrand: false,
    relatedPages: resolveRelatedPagesForTopic(key),
  };
};

// Additional curated posts specifically enriching Venture, Funding, YC, a16z, Startups, and core tags
const HASHTAG_ENRICHMENT_POSTS: Post[] = [
  {
    id: 'hashtag_vc_memo_priya',
    authorId: 'user_priya',
    authorName: 'Dr. Priya Patel',
    authorAvatar: portraitPriyaPatel,
    authorHeadline: 'Partner @ Frontier Bio & Compute Ventures • Stanford PhD',
    communityId: 'machine-learning',
    communityName: 'AI Startups & Hardware',
    communityColor: 'indigo',
    timestamp: '3h ago',
    content: `What separates deep-tech Series A decks that close in 14 days from the ones stuck in diligence for 4 months?

1. Real hardware or cluster telemetry — not synthetic slides.
2. Clear unit economics at 10x utilization, not just lab benchmarks.
3. Three design partners who would break production if you shut down tomorrow.

We just published our Q4 deep-tech investment thesis memo covering decentralized inference, wafer-scale interconnects, and verifiable agent networks.`,
    tags: ['VentureCapital', 'Funding', 'Startups', 'AIStartups'],
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    reactions: {
      like: 118,
      insightful: 84,
      brilliant: 41,
      celebrate: 29,
    },
    userReaction: null,
    totalCommentsCount: 94,
    sharesCount: 52,
    comments: [
      {
        id: 'c_ht_vc_1',
        authorId: 'user_alexander',
        authorName: 'Alexander Patrick',
        authorAvatar: portraitAlexanderPatrick,
        authorHeadline: 'Founder & CEO @ NeuralMesh • YC Alum',
        text: 'Point #3 is everything. Live telemetry from design partners cut our entire Series A diligence cycle in half.',
        timestamp: '2h ago',
        likes: 27,
        hasLiked: false,
      },
    ],
  },
  {
    id: 'hashtag_yc_demo_liam',
    authorId: 'user_liam',
    authorName: 'Liam Chen',
    authorAvatar: portraitLiamChen,
    authorHeadline: 'Co-Founder & CTO @ PulseKernel • YC W24',
    communityId: 'machine-learning',
    communityName: 'AI Startups & Hardware',
    communityColor: 'indigo',
    timestamp: '6h ago',
    content: `12 months post-Y Combinator Demo Day retrospective: we rewrote our distributed scheduler twice, cut cold-start latency from 480ms to 19ms, and scaled to 42 enterprise teams with a 7-person engineering core.

Biggest lesson from our YC group partners and seed investors: talk to users every morning, ship benchmarks every Friday, and ignore vanity headcount.`,
    tags: ['YCombinator', 'Startups', 'Funding', 'Systems', 'VentureCapital'],
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=1200&auto=format&fit=crop&q=80',
    reactions: {
      like: 156,
      celebrate: 72,
      insightful: 53,
      love: 24,
    },
    userReaction: null,
    totalCommentsCount: 81,
    sharesCount: 37,
    comments: [
      {
        id: 'c_ht_yc_1',
        authorId: 'user_jennies',
        authorName: 'Jennies Vance',
        authorAvatar: jenniesPortrait,
        authorHeadline: 'Head of AI Product & Systems Architecture',
        text: '19ms cold starts with a 7-person core is an incredible benchmark Liam. Congrats on the momentum!',
        timestamp: '4h ago',
        likes: 19,
        hasLiked: true,
      },
    ],
  },
  {
    id: 'hashtag_a16z_infra_tariq',
    authorId: 'user_tariq',
    authorName: 'Tariq Al-Mansoor',
    authorAvatar: portraitTariqAlmansoor,
    authorHeadline: 'Principal Infrastructure Architect • Sovereign Cloud & AI',
    communityId: 'machine-learning',
    communityName: 'AI Startups & Hardware',
    communityColor: 'indigo',
    timestamp: '9h ago',
    content: `Fascinating panel at the a16z Infrastructure Summit this morning on energy-aware inference routing and custom photonic backplanes.

The consensus among founders and LPs alike: the next decade of #VentureCapital returns won't come from thin wrapper apps—it will come from full-stack systems teams owning both orchestration software and bare-metal performance.`,
    tags: ['a16z', 'VentureCapital', 'AIStartups', 'Funding', 'Startups'],
    reactions: {
      like: 96,
      insightful: 67,
      brilliant: 33,
    },
    userReaction: null,
    totalCommentsCount: 64,
    sharesCount: 28,
    comments: [],
  },
  {
    id: 'hashtag_robotics_elena',
    authorId: 'user_elena',
    authorName: 'Elena Rostova',
    authorAvatar: portraitElenaRostova,
    authorHeadline: 'Neuromorphic Hardware Researcher • Quantum Lab',
    communityId: 'robotics',
    communityName: 'Robotics & Embodied AI',
    communityColor: 'indigo',
    timestamp: '11h ago',
    content: `Benchmarked our closed-loop tendon actuator rig running deterministic ROS2 control at 2kHz with zero dropped frames. Open-sourcing the CAD files and Rust firmware controller ahead of next weekend's hardware sprint!`,
    tags: ['Robotics', 'Hardware', 'Rust', 'Hackathons', 'Systems'],
    mediaType: 'image',
    mediaUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
    reactions: {
      like: 132,
      brilliant: 58,
      celebrate: 44,
    },
    userReaction: null,
    totalCommentsCount: 73,
    sharesCount: 41,
    comments: [],
  },
  {
    id: 'hashtag_culture_classie',
    authorId: 'user_classie',
    authorName: 'Classie Willey',
    authorAvatar: portraitClassieWilley,
    authorHeadline: 'AI Product Lead • Workplace Culture & Wellness',
    communityId: 'travel',
    communityName: 'Global Trailblazers & Outdoor Treks',
    communityColor: 'emerald',
    timestamp: '1d ago',
    content: `We replaced 6 hours of recurring status meetings with two written async memos and a Friday trail walk. Sprint completion jumped 28% and burnout scores hit an all-time low.`,
    tags: ['Workplace', 'Philosophy', 'Hiking', 'Outdoors', 'Startups'],
    reactions: {
      like: 174,
      love: 68,
      insightful: 91,
      support: 49,
    },
    userReaction: null,
    totalCommentsCount: 112,
    sharesCount: 59,
    comments: [],
  },
  {
    id: 'hashtag_zk_amara',
    authorId: 'user_amara',
    authorName: 'Amara Okafor',
    authorAvatar: portraitAmaraOkafor,
    authorHeadline: 'Zero-Knowledge Proofs & Distributed Cryptography Lead',
    communityId: 'machine-learning',
    communityName: 'ZK Proofs & Cryptographic Mesh',
    communityColor: 'violet',
    timestamp: '1d ago',
    content: `Just shipped v0.9 of our browser-native zero-knowledge credential verifier. Users prove verified employment, university alumni status, and conference attendance in 62ms without exposing a single byte of personal data.`,
    tags: ['ZKProofs', 'Cryptography', 'Privacy', 'Rust', 'AutonomousAgents'],
    reactions: {
      like: 141,
      brilliant: 74,
      insightful: 61,
    },
    userReaction: null,
    totalCommentsCount: 58,
    sharesCount: 34,
    comments: [],
  },
];

const buildDynamicFallbackPost = (displayTag: string, cleanTag: string): Post => {
  const seed = hashString(normalizeHashtagKey(cleanTag));
  const authors = [
    {
      id: 'user_marcus',
      name: 'Dr. Marcus Vance',
      avatar: portraitMarcusVance,
      headline: 'Applied Deep Learning Lead @ NVIDIA Research',
    },
    {
      id: 'user_zoe',
      name: 'Zoe Kim',
      avatar: portraitZoeKim,
      headline: 'Staff Systems Architect • Distributed Compute',
    },
    {
      id: 'user_hiroshi',
      name: 'Dr. Hiroshi Tanaka',
      avatar: portraitHiroshiTanaka,
      headline: 'Principal Quantum Physicist & JAXA Fellow',
    },
    {
      id: 'user_anna',
      name: 'Anna San',
      avatar: portraitAnnaSan,
      headline: 'Lead Architect @ Cerebras Systems • Wafer-Scale AI',
    },
    {
      id: 'user_george',
      name: 'George Allan',
      avatar: portraitGeorgeAllan,
      headline: 'Senior Infrastructure Engineer @ TensorCloud',
    },
  ];
  const author = authors[seed % authors.length];
  return {
    id: `hashtag_curated_${normalizeHashtagKey(cleanTag)}`,
    authorId: author.id,
    authorName: author.name,
    authorAvatar: author.avatar,
    authorHeadline: author.headline,
    communityId: 'machine-learning',
    communityName: cleanTag,
    communityColor: 'indigo',
    timestamp: '4h ago',
    content: `Sharing field notes from this week's Cronium roundtable on ${displayTag}. The technical depth from practitioners comparing real production benchmarks—instead of surface-level hype—is what makes this topic feed worth checking every morning. Drop your best papers or production lessons below!`,
    tags: [cleanTag, 'Systems', 'Startups'],
    reactions: {
      like: 42 + (seed % 70),
      insightful: 24 + (seed % 40),
      brilliant: 14 + (seed % 25),
    },
    userReaction: null,
    totalCommentsCount: 28 + (seed % 45),
    sharesCount: 11 + (seed % 18),
    comments: [],
  };
};

export const getPostsForHashtag = (rawTag: string, extraPosts: Post[] = []): Post[] => {
  const cleaned = cleanHashtag(rawTag);
  const targetKey = normalizeHashtagKey(cleaned);
  if (!targetKey) return [];

  // Pool all posts across active feed + catalogs and deduplicate by id
  const pool: Post[] = [
    ...extraPosts,
    ...INITIAL_SOCIAL_POSTS,
    ...COMPREHENSIVE_FRESH_POSTS,
    ...HASHTAG_ENRICHMENT_POSTS,
    ...Object.values(DEDICATED_USER_POSTS).flat(),
  ];

  const seenIds = new Set<string>();
  const uniquePool: Post[] = [];
  for (const post of pool) {
    if (!post?.id || seenIds.has(post.id)) continue;
    seenIds.add(post.id);
    uniquePool.push(post);
  }

  const exactMatches: Post[] = [];
  const partialMatches: Post[] = [];

  for (const post of uniquePool) {
    const tagKeys = (post.tags || []).map((t) => normalizeHashtagKey(t));
    const communityKey = normalizeHashtagKey(post.communityName || '');
    const contentLower = (post.content || '').toLowerCase();
    const cleanedLower = cleaned.toLowerCase();

    const isExactTag = tagKeys.includes(targetKey) || communityKey === targetKey;
    if (isExactTag) {
      exactMatches.push(post);
      continue;
    }

    const isPartial =
      tagKeys.some((k) => k.includes(targetKey) || targetKey.includes(k)) ||
      (communityKey.length > 2 &&
        (communityKey.includes(targetKey) || targetKey.includes(communityKey))) ||
      contentLower.includes(`#${cleanedLower}`) ||
      (cleanedLower.length >= 4 && contentLower.includes(cleanedLower));

    if (isPartial) {
      partialMatches.push(post);
    }
  }

  const combined = [...exactMatches, ...partialMatches];

  if (combined.length < 2) {
    combined.push(buildDynamicFallbackPost(`#${cleaned}`, cleaned));
  }

  return combined;
};

const sessionFollowedHashtags = new Set<string>();

export const hashtagFollowService = {
  getFollowedKeys(): Set<string> {
    return new Set(sessionFollowedHashtags);
  },

  isFollowing(rawTag: string): boolean {
    const key = normalizeHashtagKey(rawTag);
    return sessionFollowedHashtags.has(key);
  },

  toggleFollow(rawTag: string): boolean {
    const key = normalizeHashtagKey(rawTag);
    const nextState = !sessionFollowedHashtags.has(key);
    if (nextState) {
      sessionFollowedHashtags.add(key);
    } else {
      sessionFollowedHashtags.delete(key);
    }
    return nextState;
  },
};

export const formatCompactCount = (count: number): string => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
};
