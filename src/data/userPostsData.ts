import { Post } from '../types/social';
import {
  jenniesPortrait,
  portraitAnnaSan,
  portraitAlexanderPatrick,
  portraitClassieWilley,
  portraitGeorgeAllan,
  portraitMacRoseville,
  portraitHiroshiTanaka,
  portraitElenaRostova,
  portraitMarcusVance,
  portraitPriyaPatel,
  portraitLiamChen,
  portraitAmaraOkafor,
  portraitKenjiTakahashi,
  portraitZoeKim,
  portraitTariqAlmansoor,
  portraitCamilleLaurent,
  portraitMalikWashington,
  portraitAntonZeilinger,
  portraitMayaLin,
  portraitKaelenMiller,
  portraitEvelynFoster,
  portraitAstridLindholm,
  portraitMateoSilva,
  portraitJasonZhao,
  portraitNadiaChernova,
  resolveGenderMatchedAvatar,
} from './mockData';
import { INITIAL_SOCIAL_POSTS } from './mockSocialPosts';
import { COMPREHENSIVE_FRESH_POSTS } from './freshFeedPostsData';

// ---------------------------------------------------------------------------
// Curated profile-only posts for each individual.
// IMPORTANT:
// 1. Every mediaUrl here is strictly unique across ALL individuals and does NOT
//    overlap with any Feed mediaUrl in INITIAL_SOCIAL_POSTS or COMPREHENSIVE_FRESH_POSTS.
// 2. Each person's actual Feed image/video posts are merged in dynamically by
//    getUserPosts() so their Feed media appears on their profile without duplication.
// 3. Each individual's posts have distinct voices, structures, lengths, and topics.
// ---------------------------------------------------------------------------
export const DEDICATED_USER_POSTS: Record<string, Post[]> = {
  // Jennies Vance — Head of AI Product & Systems Architecture
  user_jennies: [
    {
      id: 'post_jennies_mesh_agents',
      authorId: 'user_jennies',
      authorName: 'Jennies Vance',
      authorAvatar: jenniesPortrait,
      authorHeadline: 'Head of AI Product & Systems Architecture',
      communityId: 'machine-learning',
      communityName: 'Autonomous AI & Distributed Mesh',
      communityColor: 'indigo',
      timestamp: '2h ago',
      content: `Autonomous mesh agent coordination update: zero-knowledge verification over peer RPCs just crossed 4.2ms proof generation on consumer M4 Max silicon — no central coordinator bottleneck.

Key architecture shifts that made it click:
• Deterministic state transitions via succinct zk-SNARKs verified peer-to-peer
• Lock-free routing tables with bounded gossip convergence
• Sub-millisecond signature batching across regional relays

Benchmark whitepaper & reproducible harness going public next week.`,
      tags: ['AutonomousAgents', 'ZKProofs', 'DistributedSystems', 'AIArchitecture'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 184, insightful: 92, brilliant: 76, celebrate: 48 },
      userReaction: 'brilliant',
      totalCommentsCount: 154,
      sharesCount: 38,
      comments: [],
    },
    {
      id: 'post_jennies_formal_audit',
      authorId: 'user_jennies',
      authorName: 'Jennies Vance',
      authorAvatar: jenniesPortrait,
      authorHeadline: 'Head of AI Product & Systems Architecture',
      communityId: 'infosec',
      communityName: 'Cronium Infrastructure Core',
      communityColor: 'emerald',
      timestamp: 'Yesterday',
      content: `Cronium's zero-knowledge state sync protocol just cleared formal verification in TLA+ with 0 critical findings across 14,000 simulated Byzantine nodes. Mathematical certainty is non-negotiable for sovereign networks.`,
      tags: ['FormalMethods', 'TLA+', 'SecurityAudit', 'Cryptography'],
      reactions: { like: 142, celebrate: 110, insightful: 65 },
      totalCommentsCount: 138,
      sharesCount: 22,
      comments: [],
    },
    {
      id: 'post_jennies_tamalpais_trail',
      authorId: 'user_jennies',
      authorName: 'Jennies Vance',
      authorAvatar: jenniesPortrait,
      authorHeadline: 'Head of AI Product & Systems Architecture',
      communityId: 'lifestyle',
      communityName: 'Trail Running & Alpine Hiking',
      communityColor: 'cyan',
      timestamp: '5d ago',
      content: `Golden hour trail run along Dipsea to Mount Tamalpais after wrapping our zero-copy mesh buffers sprint. Pacific marine fog rolling through coastal redwoods resets the mind better than anything else.`,
      tags: ['TrailRunning', 'MountTamalpais', 'WorkLifeBalance', 'Outdoors'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 132, like: 88, celebrate: 40 },
      totalCommentsCount: 126,
      sharesCount: 14,
      comments: [],
    },
    {
      id: 'post_jennies_stanford_panel',
      authorId: 'user_jennies',
      authorName: 'Jennies Vance',
      authorAvatar: jenniesPortrait,
      authorHeadline: 'Head of AI Product & Systems Architecture',
      communityId: 'academia',
      communityName: 'Stanford AI Lab Alumni',
      communityColor: 'rose',
      timestamp: '1w ago',
      content: `Speaking at the Stanford AI Lab Alum Symposium tomorrow on "Sovereign Compute & Verifiable Memory Architectures" — why deterministic latency and cryptographic memory provenance beat raw parameter count in mission-critical deployments.`,
      tags: ['StanfordAI', 'Alumni', 'Keynote', 'AgenticAI'],
      reactions: { like: 98, insightful: 52 },
      totalCommentsCount: 119,
      sharesCount: 18,
      comments: [],
    },
  ],

  // Kenji Takahashi — Aerospace Propulsion & Spacecraft Guidance
  user_kenji: [
    {
      id: 'post_kenji_static_fire_stand',
      authorId: 'user_kenji',
      authorName: 'Kenji Takahashi',
      authorAvatar: portraitKenjiTakahashi,
      authorHeadline: 'Aerospace Propulsion & Spacecraft Guidance Engineer',
      communityId: 'deep-space',
      communityName: 'Spacecraft Systems & Thermal',
      communityColor: 'amber',
      timestamp: '1d ago',
      content: `Cryogenic tank boiloff qualification under full solar-flux simulation:
- Liquid hydrogen loss held at 0.074% / day
- Active 20K pulse-tube cryocooler loop drew 18% less bus power than projected
- Zero delamination across 60-layer aerogel MLI blankets

Next milestone: integrated hot-fire test with flight-weight composite feedlines.`,
      tags: ['Cryogenics', 'ThermalSystems', 'Hydrogen', 'SpaceFlight'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 124, insightful: 79, brilliant: 58 },
      totalCommentsCount: 142,
      sharesCount: 29,
      comments: [],
    },
    {
      id: 'post_kenji_cislunar_trajectory',
      authorId: 'user_kenji',
      authorName: 'Kenji Takahashi',
      authorAvatar: portraitKenjiTakahashi,
      authorHeadline: 'Aerospace Propulsion & Spacecraft Guidance Engineer',
      communityId: 'deep-space',
      communityName: 'Deep Space Navigation & Propulsion',
      communityColor: 'cyan',
      timestamp: '4d ago',
      content: `Simulated 12,000 cis-lunar low-energy transfers along Earth–Moon L1/L2 invariant manifolds this morning. Electric staging trims total delta-V budget by 34% compared to traditional Hohmann burns.`,
      tags: ['Astrodynamics', 'OrbitalMechanics', 'CisLunar', 'JAXA'],
      reactions: { like: 112, insightful: 84, brilliant: 51 },
      totalCommentsCount: 131,
      sharesCount: 24,
      comments: [],
    },
    {
      id: 'post_kenji_atacama_downlink',
      authorId: 'user_kenji',
      authorName: 'Kenji Takahashi',
      authorAvatar: portraitKenjiTakahashi,
      authorHeadline: 'Aerospace Propulsion & Spacecraft Guidance Engineer',
      communityId: 'deep-space',
      communityName: 'Deep Space Optical Telemetry',
      communityColor: 'violet',
      timestamp: '1w ago',
      content: `Locked our 1550nm optical laser downlink at 1.4 AU from the Atacama ground terminal — 120 Mbps sustained telemetry with real-time adaptive optics wavefront correction.`,
      tags: ['OpticalComms', 'DeepSpace', 'Atacama', 'Photonics'],
      reactions: { celebrate: 135, like: 94, brilliant: 72 },
      totalCommentsCount: 139,
      sharesCount: 31,
      comments: [],
    },
  ],

  // Dr. Marcus Vance / Marcus Thorne — Compiler & Propulsion Systems Architect
  user_marcus: [
    {
      id: 'post_marcus_turbopump_telemetry',
      authorId: 'user_marcus',
      authorName: 'Dr. Marcus Vance',
      authorAvatar: portraitMarcusVance,
      authorHeadline: 'Distributed Systems Fellow • Compiler Architect',
      communityId: 'deep-space',
      communityName: 'Spacecraft Systems Architecture',
      communityColor: 'indigo',
      timestamp: '1d ago',
      content: `Flight telemetry review from today's upper-stage bench run: high-frequency cavitation chatter on the LOX turbopump inducer is damped below 1.2% peak-to-peak after adding tuned Helmholtz acoustic cavities.`,
      tags: ['Propulsion', 'FluidDynamics', 'Acoustics', 'RealTimeSystems'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1517976487502-5f6974797175?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 145, insightful: 88, brilliant: 72 },
      totalCommentsCount: 147,
      sharesCount: 26,
      comments: [],
    },
    {
      id: 'post_marcus_3d_copper_combustion',
      authorId: 'user_marcus',
      authorName: 'Dr. Marcus Vance',
      authorAvatar: portraitMarcusVance,
      authorHeadline: 'Distributed Systems Fellow • Compiler Architect',
      communityId: 'deep-space',
      communityName: 'Additive Manufacturing & Advanced Alloys',
      communityColor: 'amber',
      timestamp: '4d ago',
      content: `Quick compiler note for embedded Rust & C++ folks: encoding DMA buffer ownership as affine types caught 3 subtle ISR race conditions at compile time before a single line hit hardware.`,
      tags: ['Compilers', 'AffineTypes', 'Avionics', 'Rust'],
      reactions: { like: 122, celebrate: 89, insightful: 56 },
      totalCommentsCount: 128,
      sharesCount: 20,
      comments: [],
    },
    {
      id: 'post_marcus_mesh_telemetry_protocol',
      authorId: 'user_marcus',
      authorName: 'Dr. Marcus Vance',
      authorAvatar: portraitMarcusVance,
      authorHeadline: 'Distributed Systems Fellow • Compiler Architect',
      communityId: 'deep-space',
      communityName: 'Mesh Telemetry & Secure Networks',
      communityColor: 'emerald',
      timestamp: '1w ago',
      content: `Inter-stage telemetry mesh held 100% deterministic consensus across 4,200 km separation with zero dropped frames during phased-array handover tests.`,
      tags: ['MeshTelemetry', 'SpaceNetworks', 'P2P', 'Consensus'],
      reactions: { like: 95, brilliant: 64 },
      totalCommentsCount: 118,
      sharesCount: 16,
      comments: [],
    },
  ],

  // Alexander Patrick — Founder & CEO @ NeuralMesh
  user_alexander: [
    {
      id: 'post_alexander_h100_cluster_triton',
      authorId: 'user_alexander',
      authorName: 'Alexander Patrick',
      authorAvatar: portraitAlexanderPatrick,
      authorHeadline: 'Founder & CEO @ NeuralMesh • YC Alum',
      communityId: 'machine-learning',
      communityName: 'GPU Kernel Engineering',
      communityColor: 'cyan',
      timestamp: '2d ago',
      content: `Fresh cluster numbers from our custom Triton FlashAttention-3 forward kernel on 1,024 H100 SXM5 nodes:
→ 88.2% MFU at 128k context length
→ 2.1x lower tail jitter during all-to-all expert routing
→ Zero warp divergence in FP8 fused epilogues

Writing up the full PTX disassembly notes for anyone squeezing extra flops out of Hopper.`,
      tags: ['Triton', 'CUDA', 'H100', 'HighPerformanceComputing'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 167, brilliant: 130, insightful: 94 },
      totalCommentsCount: 162,
      sharesCount: 40,
      comments: [],
    },
    {
      id: 'post_alexander_hiring_engineers',
      authorId: 'user_alexander',
      authorName: 'Alexander Patrick',
      authorAvatar: portraitAlexanderPatrick,
      authorHeadline: 'Founder & CEO @ NeuralMesh • YC Alum',
      communityId: 'machine-learning',
      communityName: 'NeuralMesh Careers & Culture',
      communityColor: 'emerald',
      timestamp: '6d ago',
      content: `Expanding the founding engineering team in San Francisco & Remote. If you dream in MLIR passes, kernel scheduling, or sub-millisecond robotics control loops, DM me directly — skip the cover letter and send a repo or benchmark.`,
      tags: ['Hiring', 'Startups', 'SanFrancisco', 'Careers'],
      reactions: { celebrate: 180, like: 110 },
      totalCommentsCount: 148,
      sharesCount: 65,
      comments: [],
    },
  ],

  // Elena Rostova — Neuromorphic Hardware Researcher & Quantum Cryptographer
  user_elena: [
    {
      id: 'post_elena_sourdough_science',
      authorId: 'user_elena',
      authorName: 'Elena Rostova',
      authorAvatar: portraitElenaRostova,
      authorHeadline: 'Neuromorphic Hardware Researcher • Baker & Urban Gardener',
      communityId: 'lifestyle',
      communityName: 'Bio-Fermentation & Culinary Arts',
      communityColor: 'amber',
      timestamp: '2d ago',
      content: `Sunday micro-fermentation log: 82% hydration country loaf with stone-milled spelt and heirloom einkorn. Wild yeast colony dynamics look uncannily like spike-timing dependent plasticity once you chart the pH curve.`,
      tags: ['Sourdough', 'Fermentation', 'Baking', 'WeekendCraft'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 168, like: 92, celebrate: 54 },
      totalCommentsCount: 141,
      sharesCount: 18,
      comments: [],
    },
    {
      id: 'post_elena_kyber_dilithium',
      authorId: 'user_elena',
      authorName: 'Elena Rostova',
      authorAvatar: portraitElenaRostova,
      authorHeadline: 'Neuromorphic Hardware Researcher • Quantum Lab',
      communityId: 'infosec',
      communityName: 'Post-Quantum Lattice Cryptography',
      communityColor: 'violet',
      timestamp: '4d ago',
      content: `Completed 100M differential power-analysis traces on our masked Kyber-1024 implementation inside ARM TrustZone — zero statistically significant side-channel leakage. Constant-time polynomial multiplication held rock solid.`,
      tags: ['PostQuantum', 'Kyber', 'Infosec', 'TrustZone'],
      reactions: { like: 142, insightful: 98, brilliant: 76 },
      totalCommentsCount: 136,
      sharesCount: 25,
      comments: [],
    },
    {
      id: 'post_elena_analog_photonic_interconnect',
      authorId: 'user_elena',
      authorName: 'Elena Rostova',
      authorAvatar: portraitElenaRostova,
      authorHeadline: 'Neuromorphic Hardware Researcher • Quantum Lab',
      communityId: 'machine-learning',
      communityName: 'Photonic & Quantum Interconnects',
      communityColor: 'cyan',
      timestamp: '1w ago',
      content: `Co-packaged silicon photonics bench measurement: 3.2 Tbps bidirectional optical link at 0.8 pJ/bit. Copper trace parasitics are running out of runway for dense analog-digital hybrids.`,
      tags: ['SiliconPhotonics', 'OpticalComputing', 'Interconnects', 'Hardware'],
      reactions: { like: 125, brilliant: 88, insightful: 65 },
      totalCommentsCount: 129,
      sharesCount: 21,
      comments: [],
    },
  ],

  // Anna San — Lead Architect @ Cerebras Systems
  user_anna: [
    {
      id: 'post_anna_mentoring_women_stem',
      authorId: 'user_anna',
      authorName: 'Anna San',
      authorAvatar: portraitAnnaSan,
      authorHeadline: 'Lead Architect @ Cerebras Systems • Wafer-Scale AI',
      communityId: 'lifestyle',
      communityName: 'Diversity in Engineering & STEM',
      communityColor: 'rose',
      timestamp: '2d ago',
      content: `Wrapped our 10-week open-silicon mentorship cohort with 45 brilliant women engineers sending their very first RISC-V cores to tape-out! Watching first-time designers debug timing closure and nail DRC signoff never gets old.`,
      tags: ['WomenInSTEM', 'Mentorship', 'RISCV', 'HardwareDesign'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 195, celebrate: 142, like: 118 },
      totalCommentsCount: 152,
      sharesCount: 38,
      comments: [],
    },
    {
      id: 'post_anna_hardware_workshop',
      authorId: 'user_anna',
      authorName: 'Anna San',
      authorAvatar: portraitAnnaSan,
      authorHeadline: 'Lead Architect @ Cerebras Systems • Wafer-Scale AI',
      communityId: 'machine-learning',
      communityName: 'Hardware Architecture & Thermal Dynamics',
      communityColor: 'cyan',
      timestamp: '5d ago',
      content: `Direct-to-die micro-jet liquid cooling update on our 23kW wafer-scale chassis: junction temps held steady at 58°C across all 850,000 cores under sustained dense GEMM load — zero thermal throttling.`,
      tags: ['ThermalEngineering', 'LiquidCooling', 'WaferScale', 'Hardware'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 154, insightful: 92, brilliant: 78 },
      totalCommentsCount: 149,
      sharesCount: 33,
      comments: [],
    },
    {
      id: 'post_anna_compiler_lowering_mlir',
      authorId: 'user_anna',
      authorName: 'Anna San',
      authorAvatar: portraitAnnaSan,
      authorHeadline: 'Lead Architect @ Cerebras Systems • Wafer-Scale AI',
      communityId: 'machine-learning',
      communityName: 'Compilers & MLIR Ecosystem',
      communityColor: 'violet',
      timestamp: '1w ago',
      content: `Shipped a custom MLIR lowering pass that maps block-sparse attention directly onto 2D systolic tiles. Off-chip DRAM traffic dropped by 94% on long-context inference traces.`,
      tags: ['MLIR', 'LLVM', 'Compilers', 'SparseAttention'],
      reactions: { like: 110, brilliant: 84 },
      totalCommentsCount: 127,
      sharesCount: 18,
      comments: [],
    },
  ],

  // Amara Okafor — Zero-Knowledge Proofs & Distributed Cryptography Lead
  user_amara: [
    {
      id: 'post_amara_paris_crypto_talk',
      authorId: 'user_amara',
      authorName: 'Amara Okafor',
      authorAvatar: portraitAmaraOkafor,
      authorHeadline: 'Zero-Knowledge Proofs & Distributed Cryptography Lead',
      communityId: 'lifestyle',
      communityName: 'Cryptographic Conferences & Travel',
      communityColor: 'amber',
      timestamp: '2d ago',
      content: `Touchdown in Paris for Real-World Crypto! Presenting our new multi-scalar multiplication schedule for mobile provers tomorrow morning — always energized by hallway whiteboard debates with cryptographers from around the world.`,
      tags: ['Paris', 'RealWorldCrypto', 'Conference', 'Cryptography'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 145, like: 92, celebrate: 61 },
      totalCommentsCount: 138,
      sharesCount: 19,
      comments: [],
    },
    {
      id: 'post_amara_pasta_curves_bench',
      authorId: 'user_amara',
      authorName: 'Amara Okafor',
      authorAvatar: portraitAmaraOkafor,
      authorHeadline: 'Zero-Knowledge Proofs & Distributed Cryptography Lead',
      communityId: 'machine-learning',
      communityName: 'Elliptic Curve Cryptography',
      communityColor: 'indigo',
      timestamp: '5d ago',
      content: `Halo2 folding benchmark on Pallas/Vesta 2-cycle curves: 1.2M constraints/sec on an M3 laptop with zero trusted setup. Folding accumulators are quietly turning client-side ZK into everyday infrastructure.`,
      tags: ['Halo2', 'EllipticCurves', 'Math', 'ZeroKnowledge'],
      reactions: { like: 138, brilliant: 95, insightful: 68 },
      totalCommentsCount: 134,
      sharesCount: 22,
      comments: [],
    },
  ],

  // Priya Patel — CleanTech Microgrid Specialist
  user_priya: [
    {
      id: 'post_priya_desert_solar_audit',
      authorId: 'user_priya',
      authorName: 'Priya Patel',
      authorAvatar: portraitPriyaPatel,
      authorHeadline: 'CleanTech Microgrid Specialist • Energy Systems',
      communityId: 'lifestyle',
      communityName: 'Solar Field Engineering',
      communityColor: 'amber',
      timestamp: '2d ago',
      content: `Field audit out in the Mojave basin: swapping dark gravel for high-albedo crushed limestone beneath bifacial solar arrays boosted rear-side energy harvest by 23.4% with zero panel hardware changes.`,
      tags: ['SolarEnergy', 'MojaveDesert', 'Fieldwork', 'CleanTech'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 115, celebrate: 78, love: 52 },
      totalCommentsCount: 128,
      sharesCount: 17,
      comments: [],
    },
    {
      id: 'post_priya_battery_degradation_models',
      authorId: 'user_priya',
      authorName: 'Priya Patel',
      authorAvatar: portraitPriyaPatel,
      authorHeadline: 'CleanTech Microgrid Specialist • Energy Systems',
      communityId: 'lifestyle',
      communityName: 'Electrochemical Modeling & Energy Storage',
      communityColor: 'cyan',
      timestamp: '6d ago',
      content: `Our electrochemical impedance spectroscopy model now flags LFP cell knee-point fade 600 cycles ahead of schedule at 99.2% precision — giving community battery fleets months of predictive maintenance runway.`,
      tags: ['BatteryStorage', 'Electrochemistry', 'CleanEnergy', 'Research'],
      reactions: { like: 132, insightful: 88, brilliant: 64 },
      totalCommentsCount: 133,
      sharesCount: 20,
      comments: [],
    },
  ],

  // Liam Chen — Lead Engine Architect • Low-Latency Systems & Specialty Coffee
  user_liam: [
    {
      id: 'post_liam_pour_over_coffee',
      authorId: 'user_liam',
      authorName: 'Liam Chen',
      authorAvatar: portraitLiamChen,
      authorHeadline: 'Lead Engine Architect • Low-Latency Systems & Specialty Coffee',
      communityId: 'lifestyle',
      communityName: 'Specialty Coffee & Extraction Chemistry',
      communityColor: 'amber',
      timestamp: '2d ago',
      content: `Dialed in a washed anaerobic Ethiopian Yirgacheffe using remineralized water (120 ppm TDS, 2:1 Mg:Ca). Refractometer read 21.8% extraction yield — crisp bergamot and jasmine finish before the morning profiling session.`,
      tags: ['SpecialtyCoffee', 'ExtractionYield', 'Brewing', 'Craft'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 148, like: 94, celebrate: 62 },
      totalCommentsCount: 144,
      sharesCount: 15,
      comments: [],
    },
    {
      id: 'post_liam_simd_json_parser',
      authorId: 'user_liam',
      authorName: 'Liam Chen',
      authorAvatar: portraitLiamChen,
      authorHeadline: 'Lead Engine Architect • Low-Latency Systems',
      communityId: 'machine-learning',
      communityName: 'Low-Latency Systems Engineering',
      communityColor: 'indigo',
      timestamp: '5d ago',
      content: `Rewrote our market-data parser using AVX-512 structural masks: 4.8 GB/s per core with 99.4% fewer branch mispredicts. Cache-line alignment still beats almost every clever abstraction.`,
      tags: ['SIMD', 'AVX512', 'Optimization', 'Performance'],
      reactions: { like: 180, brilliant: 145, insightful: 98 },
      totalCommentsCount: 152,
      sharesCount: 41,
      comments: [],
    },
  ],

  // Dr. Hiroshi Tanaka — Principal Quantum Physicist & JAXA Fellow
  user_hiroshi: [
    {
      id: 'post_hiroshi_tokyo_astronomy',
      authorId: 'user_hiroshi',
      authorName: 'Dr. Hiroshi Tanaka',
      authorAvatar: portraitHiroshiTanaka,
      authorHeadline: 'Principal Quantum Physicist & JAXA Fellow',
      communityId: 'lifestyle',
      communityName: 'Astronomy & Astrophotography',
      communityColor: 'violet',
      timestamp: '3d ago',
      content: `Clear winter skies above Nobeyama Radio Observatory in Nagano — stacked 4 hours of narrowband exposures on the Orion Nebula (M42). Even after decades in cryogenics, star-forming dust lanes never lose their awe.`,
      tags: ['Astrophotography', 'Nagano', 'Space', 'Astronomy'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 194, like: 112, celebrate: 68 },
      totalCommentsCount: 152,
      sharesCount: 34,
      comments: [],
    },
    {
      id: 'post_hiroshi_quantum_error_correction',
      authorId: 'user_hiroshi',
      authorName: 'Dr. Hiroshi Tanaka',
      authorAvatar: portraitHiroshiTanaka,
      authorHeadline: 'Principal Quantum Physicist & JAXA Fellow',
      communityId: 'machine-learning',
      communityName: 'Quantum Information Theory',
      communityColor: 'indigo',
      timestamp: '6d ago',
      content: `Distance-7 surface code verification crossed break-even today: logical error rate stayed strictly below the best physical transmon in the lattice across 10,000 syndrome cycles.`,
      tags: ['SurfaceCodes', 'QuantumErrorCorrection', 'Physics', 'Computing'],
      reactions: { like: 188, brilliant: 144, celebrate: 92 },
      totalCommentsCount: 163,
      sharesCount: 48,
      comments: [],
    },
  ],

  // George Allan — Senior Infrastructure Engineer • Alpine Trekker
  user_george: [
    {
      id: 'post_george_dawn_ridge_traverse',
      authorId: 'user_george',
      authorName: 'George Allan',
      authorAvatar: portraitGeorgeAllan,
      authorHeadline: 'Senior Infrastructure Engineer @ TensorCloud • Alpine Trekker',
      communityId: 'lifestyle',
      communityName: 'Alpine Explorers & High-Altitude Trails',
      communityColor: 'emerald',
      timestamp: '3d ago',
      content: `5:10 AM headlamp start up the granite traverse before the wind picked up. Packing redundant layers and checking barometric drop every 1,000 ft feels identical to running multi-region failover drills — calm preparation beats heroic recovery.`,
      tags: ['AlpineHiking', 'HighSierra', 'Resilience', 'Outdoors'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 134, like: 96, celebrate: 44 },
      totalCommentsCount: 129,
      sharesCount: 18,
      comments: [],
    },
    {
      id: 'post_george_bgp_anycast_notes',
      authorId: 'user_george',
      authorName: 'George Allan',
      authorAvatar: portraitGeorgeAllan,
      authorHeadline: 'Senior Infrastructure Engineer @ TensorCloud • Alpine Trekker',
      communityId: 'infosec',
      communityName: 'Cloud Edge & Anycast Routing',
      communityColor: 'cyan',
      timestamp: '6d ago',
      content: `Cut cold-start BGP convergence across 18 edge PoPs from 4.6s down to 620ms by decoupling health-check probes from control-plane reloads. Simple state machines win every single outage.`,
      tags: ['Networking', 'Anycast', 'Infrastructure', 'Reliability'],
      reactions: { like: 118, insightful: 84, brilliant: 49 },
      totalCommentsCount: 122,
      sharesCount: 21,
      comments: [],
    },
  ],

  // Classie Willey — AI Product Lead • Acoustics & Workplace Wellness
  user_classie: [
    {
      id: 'post_classie_acoustic_room_build',
      authorId: 'user_classie',
      authorName: 'Classie Willey',
      authorAvatar: portraitClassieWilley,
      authorHeadline: 'AI Product Lead • Workplace Culture & Wellness Advocate',
      communityId: 'lifestyle',
      communityName: 'Acoustic Design & Human-Centered Teams',
      communityColor: 'rose',
      timestamp: '2d ago',
      content: `Installed custom cedar slat diffusers and broadband traps in our voice-notes studio today. Clean room acoustics cut listener fatigue in half during async product reviews — sound quality is UX.`,
      tags: ['Acoustics', 'AudioDesign', 'AsyncWork', 'ProductCraft'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 142, like: 88, insightful: 53 },
      totalCommentsCount: 134,
      sharesCount: 19,
      comments: [],
    },
    {
      id: 'post_classie_focus_blocks_playbook',
      authorId: 'user_classie',
      authorName: 'Classie Willey',
      authorAvatar: portraitClassieWilley,
      authorHeadline: 'AI Product Lead • Workplace Culture & Wellness Advocate',
      communityId: 'lifestyle',
      communityName: 'Modern Engineering Culture',
      communityColor: 'amber',
      timestamp: '5d ago',
      content: `Three small rituals that saved our distributed product squad 9 hours/week:
1. 60-second voice summaries instead of status standups
2. Protected deep-work Tuesdays & Thursdays
3. Friday 15-minute non-work Show & Tell (last week: pottery, synth patches, and bonsai)`,
      tags: ['RemoteWork', 'ProductLeadership', 'TeamWellness', 'Focus'],
      reactions: { celebrate: 162, love: 108, like: 94 },
      totalCommentsCount: 146,
      sharesCount: 37,
      comments: [],
    },
  ],

  // Mac Roseville — Autonomous Robotics Pilot & Core Systems Engineer
  user_mac: [
    {
      id: 'post_mac_flight_controller_calibration',
      authorId: 'user_mac',
      authorName: 'Mac Roseville',
      authorAvatar: portraitMacRoseville,
      authorHeadline: 'Autonomous Robotics Pilot & Core Systems Engineer',
      communityId: 'machine-learning',
      communityName: 'Autonomous Aerial Robotics',
      communityColor: 'indigo',
      timestamp: '2d ago',
      content: `Finished compass-free optical-flow calibration in a GPS-denied hangar. Onboard IMU + stereo-event fusion held position drift under 3.2 cm over a 12-minute autonomous hover.`,
      tags: ['Drones', 'OpticalFlow', 'Autonomy', 'FlightControl'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 156, brilliant: 94, celebrate: 58 },
      totalCommentsCount: 139,
      sharesCount: 28,
      comments: [],
    },
    {
      id: 'post_mac_carbon_airframe_notes',
      authorId: 'user_mac',
      authorName: 'Mac Roseville',
      authorAvatar: portraitMacRoseville,
      authorHeadline: 'Autonomous Robotics Pilot & Core Systems Engineer',
      communityId: 'machine-learning',
      communityName: 'Field Robotics Hardware',
      communityColor: 'cyan',
      timestamp: '6d ago',
      content: `Shaved 140g off our hexacopter avionics bay by switching to rigid-flex PCBs and titanium standoffs — added 7 full minutes of payload endurance in crosswind gust trials.`,
      tags: ['Airframes', 'EmbeddedSystems', 'Hardware', 'Robotics'],
      reactions: { like: 112, insightful: 67 },
      totalCommentsCount: 121,
      sharesCount: 15,
      comments: [],
    },
  ],

  // Zoe Kim — Engineering Director • Async Ops & Edge Inference
  user_zoe: [
    {
      id: 'post_zoe_incident_review_board',
      authorId: 'user_zoe',
      authorName: 'Zoe Kim',
      authorAvatar: portraitZoeKim,
      authorHeadline: 'Engineering Director • Async Operations & Systems Scalability',
      communityId: 'machine-learning',
      communityName: 'Engineering Leadership & Operations',
      communityColor: 'violet',
      timestamp: '3d ago',
      content: `Switched our quarterly architecture reviews from 40-slide decks to live 2-page RFC docs + 15 minutes of silent reading before discussion. Decision latency dropped by 60% and junior engineers are speaking up twice as often.`,
      tags: ['EngineeringLeadership', 'RFCs', 'SystemsDesign', 'Scale'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80',
      reactions: { insightful: 138, like: 112, celebrate: 54 },
      totalCommentsCount: 135,
      sharesCount: 31,
      comments: [],
    },
    {
      id: 'post_zoe_int4_quantization_field_test',
      authorId: 'user_zoe',
      authorName: 'Zoe Kim',
      authorAvatar: portraitZoeKim,
      authorHeadline: 'Engineering Director • Async Operations & Systems Scalability',
      communityId: 'machine-learning',
      communityName: 'Edge AI & Model Compression',
      communityColor: 'indigo',
      timestamp: '1w ago',
      content: `Mixed-precision AWQ quantization kept our vision-language model under 4.1 GB VRAM on industrial edge gateways while retaining 99.1% recall on defect inspection frames.`,
      tags: ['EdgeAI', 'Quantization', 'MLOps', 'Inference'],
      reactions: { like: 124, brilliant: 86 },
      totalCommentsCount: 126,
      sharesCount: 22,
      comments: [],
    },
  ],

  // Dr. Tariq Al-Mansoor — Microgrid Control & Geothermal Sensor Architect
  user_tariq: [
    {
      id: 'post_tariq_wind_sensor_mesh',
      authorId: 'user_tariq',
      authorName: 'Dr. Tariq Al-Mansoor',
      authorAvatar: portraitTariqAlmansoor,
      authorHeadline: 'Microgrid Control & Real-Time Sensor Network Architect',
      communityId: 'lifestyle',
      communityName: 'Renewable Telemetry & IoT Grids',
      communityColor: 'emerald',
      timestamp: '3d ago',
      content: `Deployed 64 solar-powered LoRaWAN acoustic nodes across the turbine ridge to detect gearbox bearing wear 3 weeks before vibration thresholds trip. Zero cellular backhaul required.`,
      tags: ['CleanTech', 'LoRaWAN', 'PredictiveMaintenance', 'IoT'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1509391111737-9b07f052f6b6?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 129, insightful: 84, celebrate: 48 },
      totalCommentsCount: 132,
      sharesCount: 24,
      comments: [],
    },
    {
      id: 'post_tariq_fiber_optic_das',
      authorId: 'user_tariq',
      authorName: 'Dr. Tariq Al-Mansoor',
      authorAvatar: portraitTariqAlmansoor,
      authorHeadline: 'Microgrid Control & Real-Time Sensor Network Architect',
      communityId: 'lifestyle',
      communityName: 'Geothermal & Subsurface Sensing',
      communityColor: 'amber',
      timestamp: '1w ago',
      content: `Distributed Acoustic Sensing (DAS) turns ordinary downhole quartz fiber into a 2,000-channel thermometer and seismometer that survives 290°C brine without a single transistor underground.`,
      tags: ['Geothermal', 'FiberOptics', 'Sensors', 'Energy'],
      reactions: { brilliant: 112, like: 94, insightful: 71 },
      totalCommentsCount: 124,
      sharesCount: 19,
      comments: [],
    },
  ],

  // Dr. Camille Laurent — Computational Neuroscientist
  user_camille: [
    {
      id: 'post_camille_spike_sorting_pipeline',
      authorId: 'user_camille',
      authorName: 'Dr. Camille Laurent',
      authorAvatar: portraitCamilleLaurent,
      authorHeadline: 'Computational Neuroscientist & Spike Timing Researcher',
      communityId: 'academia',
      communityName: 'Neuroengineering & Electrophysiology',
      communityColor: 'violet',
      timestamp: '3d ago',
      content: `Open-sourced our GPU-accelerated real-time spike sorting kernel today: processes 3,840 simultaneous neural channels at 30 kHz with <1.8ms end-to-end closed-loop latency.`,
      tags: ['Neuroscience', 'SignalProcessing', 'BCI', 'OpenScience'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&auto=format&fit=crop&q=80',
      reactions: { brilliant: 148, like: 112, insightful: 89 },
      totalCommentsCount: 141,
      sharesCount: 33,
      comments: [],
    },
    {
      id: 'post_camille_plasticity_reading_group',
      authorId: 'user_camille',
      authorName: 'Dr. Camille Laurent',
      authorAvatar: portraitCamilleLaurent,
      authorHeadline: 'Computational Neuroscientist & Spike Timing Researcher',
      communityId: 'academia',
      communityName: 'Computational Brain Dynamics',
      communityColor: 'rose',
      timestamp: '1w ago',
      content: `Fascinating seminar question from today's lab group: what happens to continual learning in silicon transformers if we borrow dendritic gating mechanisms from layer-5 pyramidal neurons?`,
      tags: ['NeuroAI', 'ContinualLearning', 'Research', 'Plasticity'],
      reactions: { insightful: 121, like: 88 },
      totalCommentsCount: 129,
      sharesCount: 16,
      comments: [],
    },
  ],

  // David Sterling — Distributed Consensus & Storage Lead
  user_david: [
    {
      id: 'post_david_storage_engine_compaction',
      authorId: 'user_david',
      authorName: 'David Sterling',
      authorAvatar: resolveGenderMatchedAvatar('David Sterling'),
      authorHeadline: 'Principal Storage & Consensus Systems Engineer',
      communityId: 'infosec',
      communityName: 'Database Internals & Storage Engines',
      communityColor: 'indigo',
      timestamp: '3d ago',
      content: `Replaced our leveled LSM compaction scheduler with a write-amplification-aware io_uring pipeline — p99 tail latency during heavy ingest flattened by 4.3x with zero read regression.`,
      tags: ['StorageEngines', 'io_uring', 'Databases', 'Performance'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
      reactions: { like: 136, brilliant: 94, insightful: 72 },
      totalCommentsCount: 131,
      sharesCount: 25,
      comments: [],
    },
    {
      id: 'post_david_jepsen_partition_notes',
      authorId: 'user_david',
      authorName: 'David Sterling',
      authorAvatar: resolveGenderMatchedAvatar('David Sterling'),
      authorHeadline: 'Principal Storage & Consensus Systems Engineer',
      communityId: 'infosec',
      communityName: 'Fault Tolerance & Linearizability',
      communityColor: 'emerald',
      timestamp: '1w ago',
      content: `Reminder from this morning's chaos test: asymmetric network partitions (A talks to B, B talks to C, C drops A) expose ten times more consensus bugs than clean split-brains ever will.`,
      tags: ['Jepsen', 'DistributedSystems', 'Linearizability', 'ChaosTesting'],
      reactions: { insightful: 142, like: 109 },
      totalCommentsCount: 127,
      sharesCount: 29,
      comments: [],
    },
  ],

  // Malik Washington — Principal Cryptographic Protocol Auditor
  user_malik: [
    {
      id: 'post_malik_zk_audit_checklist',
      authorId: 'user_malik',
      authorName: 'Malik Washington',
      authorAvatar: portraitMalikWashington,
      authorHeadline: 'Principal Cryptographic Protocol Auditor & Mesh Security Lead',
      communityId: 'infosec',
      communityName: 'Zero-Knowledge Security & Auditing',
      communityColor: 'indigo',
      timestamp: '5h ago',
      content: `Just wrapped a 3-week adversarial review of a multi-region event-driven ledger. Caught an under-constrained polynomial gadget that would have allowed forged witness transitions under edge-case field wraps. Always fuzz your R1CS constraints!`,
      tags: ['ZKSecurity', 'Cryptography', 'Auditing', 'Infosec'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?w=1200&auto=format&fit=crop&q=80',
      reactions: { brilliant: 138, like: 114, insightful: 86 },
      totalCommentsCount: 134,
      sharesCount: 27,
      comments: [],
    },
    {
      id: 'post_malik_sub10ms_gateway',
      authorId: 'user_malik',
      authorName: 'Malik Washington',
      authorAvatar: portraitMalikWashington,
      authorHeadline: 'Principal Cryptographic Protocol Auditor & Mesh Security Lead',
      communityId: 'infosec',
      communityName: 'Low-Latency API Gateways',
      communityColor: 'cyan',
      timestamp: '4d ago',
      content: `Stress-testing our sub-10ms mTLS API gateway mesh across 6 global regions — hardware AES-NI + kernel TLS offload handled 420k req/sec per node without breaking a sweat.`,
      tags: ['mTLS', 'APIGateway', 'NetworkSecurity', 'Performance'],
      mediaType: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80',
      videoDuration: '0:54',
      reactions: { like: 121, celebrate: 68, insightful: 54 },
      totalCommentsCount: 122,
      sharesCount: 19,
      comments: [],
    },
    {
      id: 'post_malik_key_rotation_hygiene',
      authorId: 'user_malik',
      authorName: 'Malik Washington',
      authorAvatar: portraitMalikWashington,
      authorHeadline: 'Principal Cryptographic Protocol Auditor & Mesh Security Lead',
      communityId: 'infosec',
      communityName: 'Sovereign Key Management',
      communityColor: 'emerald',
      timestamp: '1w ago',
      content: `If your production key rotation playbook hasn't been executed automatically in the last 30 days, you don't have a rotation strategy — you have an outage waiting for an expiry date.`,
      tags: ['KeyManagement', 'DevSecOps', 'ZeroTrust', 'Reliability'],
      reactions: { insightful: 164, like: 118 },
      totalCommentsCount: 139,
      sharesCount: 41,
      comments: [],
    },
  ],

  // Dr. Anton Zeilinger — Quantum Entanglement & Photonics Advisor
  user_anton: [
    {
      id: 'post_anton_entangled_photons_bench',
      authorId: 'user_anton',
      authorName: 'Dr. Anton Zeilinger',
      authorAvatar: portraitAntonZeilinger,
      authorHeadline: 'Quantum Entanglement & Photonics Advisor',
      communityId: 'academia',
      communityName: 'Quantum Optics & Entanglement',
      communityColor: 'violet',
      timestamp: '1d ago',
      content: `Aligned our new spontaneous parametric down-conversion source this morning — Bell inequality violation reached S = 2.79 over 48 km of deployed metropolitan dark fiber with visibility above 98.4%.`,
      tags: ['QuantumOptics', 'Entanglement', 'Photonics', 'Physics'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=1200&auto=format&fit=crop&q=80',
      reactions: { brilliant: 174, like: 142, insightful: 108 },
      totalCommentsCount: 148,
      sharesCount: 44,
      comments: [],
    },
    {
      id: 'post_anton_bell_test_essay',
      authorId: 'user_anton',
      authorName: 'Dr. Anton Zeilinger',
      authorAvatar: portraitAntonZeilinger,
      authorHeadline: 'Quantum Entanglement & Photonics Advisor',
      communityId: 'academia',
      communityName: 'Foundations of Quantum Mechanics',
      communityColor: 'indigo',
      timestamp: '6d ago',
      content: `Whenever students ask whether quantum mechanics is "too counterintuitive," I remind them that intuition is simply what our brains trained on at macroscopic scales. Nature has no obligation to match billiard balls.`,
      tags: ['QuantumPhysics', 'Mentorship', 'Science', 'Academia'],
      reactions: { love: 186, insightful: 132, like: 119 },
      totalCommentsCount: 156,
      sharesCount: 52,
      comments: [],
    },
  ],

  // Maya Lin — Creative Technologist & Real-Time GPU Shaders Lead
  user_maya: [
    {
      id: 'post_maya_raymarched_fluid_shader',
      authorId: 'user_maya',
      authorName: 'Maya Lin',
      authorAvatar: portraitMayaLin,
      authorHeadline: 'Creative Technologist & Real-Time GPU Shaders Lead',
      communityId: 'lifestyle',
      communityName: 'Real-Time Graphics & WebGPU',
      communityColor: 'rose',
      timestamp: '6h ago',
      content: `Built a 120 FPS volumetric caustic solver in WebGPU compute shaders using signed distance fields and temporal reprojection — runs smoothly even on mobile GPUs without blowing the thermal envelope.`,
      tags: ['WebGPU', 'Shaders', 'CreativeCoding', 'Graphics'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
      reactions: { love: 178, brilliant: 112, like: 96 },
      totalCommentsCount: 142,
      sharesCount: 38,
      comments: [],
    },
    {
      id: 'post_maya_light_sculpture_demo',
      authorId: 'user_maya',
      authorName: 'Maya Lin',
      authorAvatar: portraitMayaLin,
      authorHeadline: 'Creative Technologist & Real-Time GPU Shaders Lead',
      communityId: 'lifestyle',
      communityName: 'Interactive Media Installations',
      communityColor: 'amber',
      timestamp: '5d ago',
      content: `Quick rehearsal clip from our audio-reactive laser & projection gallery piece — 64-band FFT driving real-time curl-noise particle ribbons at 4K.`,
      tags: ['GenerativeArt', 'Installation', 'GLSL', 'DesignTech'],
      mediaType: 'video',
      mediaUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1200&auto=format&fit=crop&q=80',
      videoDuration: '0:36',
      reactions: { love: 164, celebrate: 92, like: 88 },
      totalCommentsCount: 133,
      sharesCount: 29,
      comments: [],
    },
  ],

  // Kaelen Miller — Autonomous Maritime Robotics & Frontier Hardware
  user_kaelen: [
    {
      id: 'post_kaelen_ocean_glider_trial',
      authorId: 'user_kaelen',
      authorName: 'Kaelen Miller',
      authorAvatar: portraitKaelenMiller,
      authorHeadline: 'Founding Partner • Frontier Hardware & Autonomous Maritime',
      communityId: 'deep-space',
      communityName: 'Marine Robotics & Ocean Telemetry',
      communityColor: 'cyan',
      timestamp: '1d ago',
      content: `Sea-trialed our wave-propelled autonomous hydrographic glider 40 nautical miles offshore — 14 days continuous acoustic bathymetry streaming via LEO satellite with zero fossil fuel burned.`,
      tags: ['MaritimeRobotics', 'OceanTech', 'FrontierHardware', 'Autonomy'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200&auto=format&fit=crop&q=80',
      reactions: { celebrate: 144, like: 116, insightful: 78 },
      totalCommentsCount: 136,
      sharesCount: 24,
      comments: [],
    },
    {
      id: 'post_kaelen_hardtech_diligence',
      authorId: 'user_kaelen',
      authorName: 'Kaelen Miller',
      authorAvatar: portraitKaelenMiller,
      authorHeadline: 'Founding Partner • Frontier Hardware & Autonomous Maritime',
      communityId: 'machine-learning',
      communityName: 'Deep Tech & Frontier Investing',
      communityColor: 'indigo',
      timestamp: '5d ago',
      content: `The best hardware founders we back don't hide their failed prototypes — they bring the charred PCB and cracked gearbox to the first meeting and walk you through the root-cause physics.`,
      tags: ['HardTech', 'Founders', 'Hardware', 'VentureCapital'],
      reactions: { insightful: 158, like: 124, love: 66 },
      totalCommentsCount: 141,
      sharesCount: 35,
      comments: [],
    },
  ],

  // Evelyn Foster — VP of Systems Engineering & MLIR Contributor
  user_evelyn: [
    {
      id: 'post_evelyn_mlir_fusion_pass',
      authorId: 'user_evelyn',
      authorName: 'Evelyn Foster',
      authorAvatar: portraitEvelynFoster,
      authorHeadline: 'VP of Systems Engineering • Sovereign Cloud & MLIR',
      communityId: 'machine-learning',
      communityName: 'Compiler Optimization & MLIR',
      communityColor: 'indigo',
      timestamp: '1d ago',
      content: `Merged our new polyhedral loop-fusion dialect into upstream MLIR this week — eliminated 38% of intermediate tensor materializations on transformer prefill graphs without hurting compile times.`,
      tags: ['MLIR', 'Compilers', 'SystemsEngineering', 'OpenSource'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&auto=format&fit=crop&q=80',
      reactions: { brilliant: 152, like: 118, celebrate: 74 },
      totalCommentsCount: 138,
      sharesCount: 29,
      comments: [],
    },
    {
      id: 'post_evelyn_sovereign_cloud_slas',
      authorId: 'user_evelyn',
      authorName: 'Evelyn Foster',
      authorAvatar: portraitEvelynFoster,
      authorHeadline: 'VP of Systems Engineering • Sovereign Cloud & MLIR',
      communityId: 'infosec',
      communityName: 'Sovereign Cloud Architecture',
      communityColor: 'emerald',
      timestamp: '6d ago',
      content: `Confidential VMs + hardware attestation just hit sub-3% overhead on our production inference fleet. Privacy-preserving cloud compute is finally fast enough to be the default, not the premium tier.`,
      tags: ['SovereignCloud', 'ConfidentialCompute', 'Systems', 'Security'],
      reactions: { insightful: 132, like: 97 },
      totalCommentsCount: 125,
      sharesCount: 21,
      comments: [],
    },
  ],

  // Astrid Lindholm — Autonomous Navigation Lead • Micro-LIDAR
  user_astrid: [
    {
      id: 'post_astrid_solid_state_lidar_fog',
      authorId: 'user_astrid',
      authorName: 'Astrid Lindholm',
      authorAvatar: portraitAstridLindholm,
      authorHeadline: 'Autonomous Navigation Lead • Micro-LIDAR Systems',
      communityId: 'machine-learning',
      communityName: 'Perception & Solid-State LIDAR',
      communityColor: 'cyan',
      timestamp: '2d ago',
      content: `Tested our FMCW coherent micro-LIDAR through heavy Nordic coastal fog this morning — instantaneous per-pixel Doppler velocity cuts false-positive backscatter returns by 92% vs. time-of-flight units.`,
      tags: ['LIDAR', 'AutonomousVehicles', 'Photonics', 'Perception'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
      reactions: { brilliant: 144, like: 108, insightful: 76 },
      totalCommentsCount: 132,
      sharesCount: 23,
      comments: [],
    },
    {
      id: 'post_astrid_sensor_calibration_note',
      authorId: 'user_astrid',
      authorName: 'Astrid Lindholm',
      authorAvatar: portraitAstridLindholm,
      authorHeadline: 'Autonomous Navigation Lead • Micro-LIDAR Systems',
      communityId: 'machine-learning',
      communityName: 'Sensor Fusion & Localization',
      communityColor: 'indigo',
      timestamp: '1w ago',
      content: `Online targetless extrinsic calibration between IMU, radar, and LIDAR now converges in 14 seconds of normal driving — no more checkerboards in the depot.`,
      tags: ['SensorFusion', 'SLAM', 'Robotics', 'Calibration'],
      reactions: { like: 115, insightful: 82 },
      totalCommentsCount: 121,
      sharesCount: 17,
      comments: [],
    },
  ],

  // Mateo Silva — Robotics Sim2Real & Tactile Sensing Researcher
  user_mateo: [
    {
      id: 'post_mateo_tactile_dexterous_grasp',
      authorId: 'user_mateo',
      authorName: 'Mateo Silva',
      authorAvatar: portraitMateoSilva,
      authorHeadline: 'Robotics Sim2Real Specialist & Tactile Sensing Researcher',
      communityId: 'machine-learning',
      communityName: 'Dexterous Manipulation & Tactile AI',
      communityColor: 'amber',
      timestamp: '1d ago',
      content: `Zero-shot tactile manipulation win: our visuo-tactile policy threaded an M3 nut onto a bolt blindfolded using only high-resolution gel-elastomer shear maps at 120 Hz.`,
      tags: ['TactileSensing', 'Manipulation', 'Sim2Real', 'Robotics'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=1200&auto=format&fit=crop&q=80',
      reactions: { celebrate: 158, brilliant: 119, like: 104 },
      totalCommentsCount: 145,
      sharesCount: 34,
      comments: [],
    },
    {
      id: 'post_mateo_flight_dynamics_sim',
      authorId: 'user_mateo',
      authorName: 'Mateo Silva',
      authorAvatar: portraitMateoSilva,
      authorHeadline: 'Lead Autonomous Flight Systems Engineer',
      communityId: 'deep-space',
      communityName: 'Autonomous Flight & Control',
      communityColor: 'cyan',
      timestamp: '6d ago',
      content: `Differentiable physics engines let us backpropagate directly through contact friction impulses — cutting training wall-clock time for fragile object grasping from 18 hours down to 47 minutes.`,
      tags: ['DifferentiablePhysics', 'Simulation', 'ReinforcementLearning', 'Control'],
      reactions: { insightful: 126, like: 94 },
      totalCommentsCount: 124,
      sharesCount: 18,
      comments: [],
    },
  ],

  // Jason Zhao — Cluster Networking & InfiniBand Architect
  user_jason: [
    {
      id: 'post_jason_infiniband_fabric',
      authorId: 'user_jason',
      authorName: 'Jason Zhao',
      authorAvatar: portraitJasonZhao,
      authorHeadline: 'High-Performance Cluster Networking & InfiniBand Architect',
      communityId: 'machine-learning',
      communityName: 'HPC Fabrics & Optical Interconnects',
      communityColor: 'indigo',
      timestamp: '2d ago',
      content: `Brought up a 2,048-port rail-optimized 800G InfiniBand fabric with adaptive routing enabled — congestion-induced tail stalls during AllReduce dropped by 81% compared to static ECMP.`,
      tags: ['InfiniBand', 'RDMA', 'ClusterNetworking', 'HPC'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=1200&auto=format&fit=crop&q=80',
      reactions: { brilliant: 142, like: 118, insightful: 84 },
      totalCommentsCount: 136,
      sharesCount: 28,
      comments: [],
    },
    {
      id: 'post_jason_roce_ecn_tuning',
      authorId: 'user_jason',
      authorName: 'Jason Zhao',
      authorAvatar: portraitJasonZhao,
      authorHeadline: 'High-Performance Cluster Networking & InfiniBand Architect',
      communityId: 'machine-learning',
      communityName: 'Data Center Network Telemetry',
      communityColor: 'cyan',
      timestamp: '1w ago',
      content: `Quick RoCEv2 field note: if your PFC pause frames are firing during steady-state training, your ECN marking threshold is almost certainly set too high. Tune ECN first, treat PFC as an airbag.`,
      tags: ['RoCE', 'Networking', 'GPUClusters', 'Infrastructure'],
      reactions: { insightful: 151, like: 109 },
      totalCommentsCount: 128,
      sharesCount: 33,
      comments: [],
    },
  ],

  // Nadia Chernova — Principal Photonic Computing Scientist
  user_nadia: [
    {
      id: 'post_nadia_photonic_cavity',
      authorId: 'user_nadia',
      authorName: 'Nadia Chernova',
      authorAvatar: portraitNadiaChernova,
      authorHeadline: 'Principal Photonic Computing Scientist',
      communityId: 'academia',
      communityName: 'Photonic Computing & Optical Chips',
      communityColor: 'violet',
      timestamp: '1d ago',
      content: `Measured a 64x64 Mach-Zehnder interferometer mesh performing matrix-vector multiplies purely in the optical domain at 12 GHz modulation bandwidth — sub-nanosecond latency at a fraction of CMOS heat density.`,
      tags: ['PhotonicComputing', 'SiliconPhotonics', 'Optics', 'Hardware'],
      mediaType: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=1200&auto=format&fit=crop&q=80',
      reactions: { brilliant: 162, like: 128, insightful: 94 },
      totalCommentsCount: 144,
      sharesCount: 31,
      comments: [],
    },
    {
      id: 'post_nadia_optical_adc_note',
      authorId: 'user_nadia',
      authorName: 'Nadia Chernova',
      authorAvatar: portraitNadiaChernova,
      authorHeadline: 'Principal Photonic Computing Scientist',
      communityId: 'academia',
      communityName: 'Analog & Optical Accelerators',
      communityColor: 'indigo',
      timestamp: '6d ago',
      content: `The real bottleneck in optical neural accelerators isn't the waveguide lattice anymore — it's the DAC/ADC boundary energy cost. Keeping multi-layer nonlinearities all-optical changes the whole power curve.`,
      tags: ['OpticalAI', 'AnalogComputing', 'Photonics', 'DeepTech'],
      reactions: { insightful: 134, like: 91 },
      totalCommentsCount: 123,
      sharesCount: 19,
      comments: [],
    },
  ],
};

// ---------------------------------------------------------------------------
// Dedicated fallback media pool — 72 verified HTTP-200 URLs with ZERO overlap
// against Feed posts, cover banners, or DEDICATED_USER_POSTS
// ---------------------------------------------------------------------------
const FALLBACK_UNIQUE_MEDIA: Array<{
  url: string;
  mediaType: 'image' | 'video';
  videoDuration?: string;
}> = [
  { url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200&auto=format&fit=crop&q=80', mediaType: 'video', videoDuration: '0:49' },
  { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&auto=format&fit=crop&q=80', mediaType: 'video', videoDuration: '0:42' },
  { url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80', mediaType: 'video', videoDuration: '0:38' },
  { url: 'https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80', mediaType: 'video', videoDuration: '1:04' },
  { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1548613053-22087dd8edb8?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80', mediaType: 'video', videoDuration: '0:52' },
  { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1562813733-b31f71025d54?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1526374870839-e155464bb9b2?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
  { url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=1200&auto=format&fit=crop&q=80', mediaType: 'image' },
];

// Global registry ensuring NO TWO PEOPLE EVER share a fallback post photo or generated post text
const usedGlobalPostMediaUrls = new Set<string>();
for (const p of [...INITIAL_SOCIAL_POSTS, ...COMPREHENSIVE_FRESH_POSTS]) {
  if (p.mediaUrl) usedGlobalPostMediaUrls.add(p.mediaUrl);
}
for (const list of Object.values(DEDICATED_USER_POSTS)) {
  for (const p of list) {
    if (p.mediaUrl) usedGlobalPostMediaUrls.add(p.mediaUrl);
  }
}

const assignedFallbackPostsByPerson = new Map<string, Post[]>();

// Diverse personalized fallback post archetypes — every template incorporates person-specific metrics & focus
interface FallbackArchetype {
  communityId: string;
  communityName: string;
  communityColor: string;
  timestamp: string;
  buildContent: (focus: string, fullName: string, metricA: number, metricB: number) => string;
  tags: string[];
  hasMedia: boolean;
  baseReactions: Post['reactions'];
  commentsCount: number;
  sharesCount: number;
}

const FALLBACK_ARCHETYPES: FallbackArchetype[] = [
  {
    communityId: 'machine-learning',
    communityName: 'Applied Craft & Benchmarks',
    communityColor: 'indigo',
    timestamp: '3h ago',
    buildContent: (focus, fullName, mA, mB) =>
      `${fullName}'s bench log on ${focus}:\n• Trimmed variance by ${mA}% across ${mB} back-to-back test runs\n• Simplified the core workflow down to deterministic, repeatable steps\n• Full notes and comparison charts are up in the channel for peer feedback.`,
    tags: ['Benchmarks', 'Craft', 'FieldNotes', 'PeerReview'],
    hasMedia: true,
    baseReactions: { like: 112, insightful: 68, brilliant: 44 },
    commentsCount: 132,
    sharesCount: 19,
  },
  {
    communityId: 'infosec',
    communityName: 'Peer Discussions & Methods',
    communityColor: 'emerald',
    timestamp: '2d ago',
    buildContent: (focus, fullName, mA, mB) =>
      `Question from ${fullName} for everyone working deeply in ${focus}: after ${mB} iterations this quarter, which single diagnostic check caught ${mA}% of subtle edge cases before release?`,
    tags: ['Methodology', 'Diagnostics', 'DeepWork', 'Community'],
    hasMedia: false,
    baseReactions: { insightful: 94, like: 78 },
    commentsCount: 124,
    sharesCount: 14,
  },
  {
    communityId: 'deep-space',
    communityName: 'Prototypes & Lab Notes',
    communityColor: 'cyan',
    timestamp: '4d ago',
    buildContent: (focus, fullName, mA, mB) =>
      `Workbench milestone (${fullName}): wrapped version ${mB} of our ${focus} prototype — real-world stability jumped ${mA}% once we replaced heuristic shortcuts with a clean, verifiable test harness.`,
    tags: ['Prototyping', 'AppliedResearch', 'Iteration', 'Verification'],
    hasMedia: true,
    baseReactions: { celebrate: 98, like: 84, brilliant: 52 },
    commentsCount: 129,
    sharesCount: 17,
  },
  {
    communityId: 'academia',
    communityName: 'Retrospectives & Open Notes',
    communityColor: 'violet',
    timestamp: '5d ago',
    buildContent: (focus, fullName, mA, mB) =>
      `Published ${fullName}'s field retrospective on ${focus}. Documenting the ${mB} false starts that led to a ${mA}% breakthrough — candid postmortems teach far more than polished highlight reels.`,
    tags: ['Retrospective', 'OpenNotes', 'Learning', 'TechnicalWriting'],
    hasMedia: false,
    baseReactions: { insightful: 128, like: 92, brilliant: 61 },
    commentsCount: 138,
    sharesCount: 25,
  },
  {
    communityId: 'lifestyle',
    communityName: 'Practice & Perspective',
    communityColor: 'amber',
    timestamp: '6d ago',
    buildContent: (focus, fullName, mA, mB) =>
      `Offline reflection by ${fullName} after ${mB} intense days on ${focus}: stepping away for an uninterrupted morning reset unlocked a ${mA}% cleaner architecture in fifteen minutes on paper.`,
    tags: ['Perspective', 'DesignClarity', 'Focus', 'Craftsmanship'],
    hasMedia: false,
    baseReactions: { love: 106, like: 79, celebrate: 36 },
    commentsCount: 118,
    sharesCount: 12,
  },
];

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  return Math.abs(hash);
}

function normalizePersonName(name?: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/^(dr|prof|chef|grandmaster|mr|ms|mrs)\.?\s+/i, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Strict canonical full-name lookup (NEVER substring matching like 'anna' in 'hannah'!)
const DEDICATED_CANONICAL_NAME_MAP: Record<string, string> = {
  'jennies vance': 'user_jennies',
  jennies: 'user_jennies',
  'kenji takahashi': 'user_kenji',
  'marcus vance': 'user_marcus',
  'alexander patrick': 'user_alexander',
  'elena rostova': 'user_elena',
  'anna san': 'user_anna',
  'amara okafor': 'user_amara',
  'priya patel': 'user_priya',
  'liam chen': 'user_liam',
  'hiroshi tanaka': 'user_hiroshi',
  'george allan': 'user_george',
  'classie willey': 'user_classie',
  'mac roseville': 'user_mac',
  'zoe kim': 'user_zoe',
  'tariq al mansoor': 'user_tariq',
  'camille laurent': 'user_camille',
  'david sterling': 'user_david',
  'malik washington': 'user_malik',
  'anton zeilinger': 'user_anton',
  'maya lin': 'user_maya',
  'kaelen miller': 'user_kaelen',
  'evelyn foster': 'user_evelyn',
  'astrid lindholm': 'user_astrid',
  'mateo silva': 'user_mateo',
  'jason zhao': 'user_jason',
  'nadia chernova': 'user_nadia',
};

function resolveDedicatedKey(userId: string, userName?: string): string | null {
  if (DEDICATED_USER_POSTS[userId]) return userId;

  const normName = normalizePersonName(userName);
  if (normName && DEDICATED_CANONICAL_NAME_MAP[normName]) {
    return DEDICATED_CANONICAL_NAME_MAP[normName];
  }
  return null;
}

function getAllFeedPostsForMatching(): Post[] {
  const combined: Post[] = [];
  const seenIds = new Set<string>();

  for (const p of [...INITIAL_SOCIAL_POSTS, ...COMPREHENSIVE_FRESH_POSTS]) {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      combined.push(p);
    }
  }
  return combined;
}

function getIndividualFeedPosts(
  userId: string,
  userName?: string,
  dedicatedKey?: string | null
): Post[] {
  const normTargetName = normalizePersonName(userName);
  const targetIds = new Set<string>([userId.toLowerCase()]);
  if (dedicatedKey) targetIds.add(dedicatedKey.toLowerCase());

  const feedPool = getAllFeedPostsForMatching();
  const matched: Post[] = [];
  const seenMediaUrls = new Set<string>();
  const seenIds = new Set<string>();

  for (const post of feedPool) {
    const postAuthorId = (post.authorId || '').toLowerCase();
    const postNormName = normalizePersonName(post.authorName);

    const idMatches = targetIds.has(postAuthorId);
    const exactNameMatches = Boolean(normTargetName) && postNormName === normTargetName;

    if (idMatches || exactNameMatches) {
      if (seenIds.has(post.id)) continue;
      if (post.mediaUrl && seenMediaUrls.has(post.mediaUrl)) continue;
      seenIds.add(post.id);
      if (post.mediaUrl) seenMediaUrls.add(post.mediaUrl);
      matched.push(post);
    }
  }

  return matched.sort((a, b) => {
    const aHasMedia = a.mediaUrl ? 1 : 0;
    const bHasMedia = b.mediaUrl ? 1 : 0;
    return bHasMedia - aHasMedia;
  });
}

function claimUniqueFallbackMedia(seed: number): {
  url: string;
  mediaType: 'image' | 'video';
  videoDuration?: string;
} | null {
  const count = FALLBACK_UNIQUE_MEDIA.length;
  const start = seed % count;
  for (let offset = 0; offset < count; offset++) {
    const candidate = FALLBACK_UNIQUE_MEDIA[(start + offset) % count];
    if (!usedGlobalPostMediaUrls.has(candidate.url)) {
      usedGlobalPostMediaUrls.add(candidate.url);
      return candidate;
    }
  }
  return null;
}

/**
 * Returns distinct, non-overlapping posts for any individual, always including
 * the image or video post(s) they published in the main Feed.
 */
export function getUserPosts(
  userId: string,
  userName?: string,
  userAvatar?: string,
  userHeadline?: string
): Post[] {
  const resolvedAvatar = resolveGenderMatchedAvatar(userName || '', userAvatar);
  const syncWithAuthor = (posts: Post[]): Post[] => {
    return posts.map((p) => ({
      ...p,
      authorAvatar: resolvedAvatar || p.authorAvatar,
      authorName: userName || p.authorName,
      authorHeadline: userHeadline || p.authorHeadline,
    }));
  };

  const dedicatedKey = resolveDedicatedKey(userId, userName);
  const feedPosts = getIndividualFeedPosts(userId, userName, dedicatedKey);
  const profileOnlyPosts = dedicatedKey ? DEDICATED_USER_POSTS[dedicatedKey] || [] : [];

  const merged: Post[] = [];
  const usedIds = new Set<string>();
  const usedMediaUrls = new Set<string>();

  const pushUnique = (post: Post) => {
    if (usedIds.has(post.id)) return;
    if (post.mediaUrl && usedMediaUrls.has(post.mediaUrl)) return;
    usedIds.add(post.id);
    if (post.mediaUrl) usedMediaUrls.add(post.mediaUrl);
    merged.push(post);
  };

  if (feedPosts.length > 0) {
    pushUnique(feedPosts[0]);
  }
  if (profileOnlyPosts.length > 0) {
    pushUnique(profileOnlyPosts[0]);
  }
  for (let i = 1; i < feedPosts.length; i++) {
    pushUnique(feedPosts[i]);
  }
  for (let i = 1; i < profileOnlyPosts.length; i++) {
    pushUnique(profileOnlyPosts[i]);
  }

  if (merged.length >= 3) {
    return syncWithAuthor(merged);
  }

  const displayName = userName || 'Verified Member';
  const personKey = normalizePersonName(displayName) || userId.toLowerCase();
  const cachedFallback = assignedFallbackPostsByPerson.get(personKey);
  if (cachedFallback) {
    for (const p of cachedFallback) {
      pushUnique(p);
    }
    return syncWithAuthor(merged);
  }

  const displayHeadline = userHeadline || `${displayName}'s Applied Research`;
  const focusPhrase = displayHeadline.split('•')[0].trim() || displayHeadline;
  const cleanId = userId || `user_${personKey.replace(/\s+/g, '_')}`;
  const seed = hashString(`${personKey}::posts`);

  const needed = Math.max(0, 3 - merged.length);
  const archetypeCount = FALLBACK_ARCHETYPES.length;
  const newlyGenerated: Post[] = [];
  let mediaAssignedForPerson = 0;

  for (let idx = 0; idx < needed; idx++) {
    const archetype = FALLBACK_ARCHETYPES[(seed + idx * 2) % archetypeCount];
    let mediaUrl: string | undefined;
    let mediaType: 'image' | 'video' | undefined;
    let videoDuration: string | undefined;

    // Give each dynamic user at most 1 globally unshared visual post so all 60+ users stay 100% non-overlapping
    if (archetype.hasMedia && mediaAssignedForPerson < 1) {
      const claimed = claimUniqueFallbackMedia(seed + idx * 17);
      if (claimed) {
        mediaUrl = claimed.url;
        mediaType = claimed.mediaType;
        videoDuration = claimed.videoDuration;
        mediaAssignedForPerson += 1;
      }
    }

    const metricA = 19 + ((seed + idx * 13) % 58);
    const metricB = 4 + ((seed + idx * 7) % 19);

    const post: Post = {
      id: `gen_post_${cleanId}_${idx + 1}`,
      authorId: cleanId,
      authorName: displayName,
      authorAvatar: resolvedAvatar,
      authorHeadline: displayHeadline,
      communityId: archetype.communityId,
      communityName: archetype.communityName,
      communityColor: archetype.communityColor,
      timestamp: archetype.timestamp,
      content: archetype.buildContent(focusPhrase, displayName, metricA, metricB),
      tags: archetype.tags,
      mediaType,
      mediaUrl,
      videoDuration,
      reactions: { ...archetype.baseReactions },
      totalCommentsCount: archetype.commentsCount + ((seed + idx * 7) % 25),
      sharesCount: archetype.sharesCount + ((seed + idx * 3) % 11),
      comments: [],
    };
    newlyGenerated.push(post);
    pushUnique(post);
  }

  assignedFallbackPostsByPerson.set(personKey, newlyGenerated);
  return syncWithAuthor(merged);
}
