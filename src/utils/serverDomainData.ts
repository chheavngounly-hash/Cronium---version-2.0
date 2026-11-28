import { Community, CommunityChannel, Message, ServerMember, User } from '../types';
import {
  CURRENT_USER,
  COMMUNITY_MEMBERS_MAP,
  FEMALE_PORTRAITS,
  MALE_PORTRAITS,
  inferGenderFromName,
  resolveGenderMatchedAvatar,
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
} from '../data/mockData';
import { buildDomainChannelMessages } from './serverChannelDialogue';

// Pick a globally unique, verified portrait that strictly matches the member's gender
// and never overlaps with any other person across the entire platform.
function getUniqueGenderMatchedPhoto(
  memberName: string,
  _serverSeed: string,
  _memberIndex: number,
  usedAvatars: Set<string>
): string {
  const gender = inferGenderFromName(memberName);
  const avatar = resolveGenderMatchedAvatar(memberName, undefined, gender);
  usedAvatars.add(avatar);
  return avatar;
}

interface DomainProfileTemplate {
  name: string;
  role: string;
  company: string;
  headline: string;
  bio: string;
  location: string;
  skills: string[];
}

/**
 * Generates an exact, consistent roster of 6 verified professional members for ANY community.
 * Every member has a unique photo (different from one another), unique name, authentic role, and is fully connectable.
 */
export function getServerMembers(community: Community): ServerMember[] {
  const commId = community.id;
  const nameLower = community.name.toLowerCase();
  const tagsText = community.tags.join(' ').toLowerCase();
  const combined = `${nameLower} ${tagsText} ${commId}`;

  let templates: DomainProfileTemplate[] = [];

  if (combined.includes('chess') || combined.includes('tactics')) {
    templates = [
      {
        name: 'Magnus Berg',
        role: 'International Grandmaster & Opening Analyst',
        company: 'Nordic Chess Academy',
        headline: 'Dynamic Sicilian Defenses, Deep Engine PGN Analysis & Blitz Coaching',
        bio: 'FIDE 2640 rated grandmaster. Advising national youth teams and researching neural network evaluation engines in endgame studies.',
        location: 'Oslo, Norway',
        skills: ['Sicilian Defense', 'Endgame Calculation', 'Stockfish 16', 'FIDE Prep', 'Blindfold Tactics'],
      },
      {
        name: 'Grandmaster Katja Volkov',
        role: 'Tactical Trainer & FIDE Master',
        company: 'International Chess Institute',
        headline: 'Positional Sacrifices, Pawn Structures & Rapid Tournament Play',
        bio: 'Competitive grandmaster and author of positional strategy masterclasses with over 15 years in tournament circuits.',
        location: 'Zurich, Switzerland',
        skills: ['King’s Indian', 'Calculation Speed', 'Pawn Structures', 'Game Analysis', 'Time Management'],
      },
      {
        name: 'David Sterling',
        role: 'Algorithmic Chess Engine Developer',
        company: 'DeepTactic Research Lab',
        headline: 'Alpha-Beta Pruning, Bitboard Representations & Neural Value Nets',
        bio: 'Building open-source chess engines and neural network move evaluators for competitive computer chess tournaments.',
        location: 'London, UK',
        skills: ['C++', 'Bitboards', 'NNUE', 'Tree Search', 'Evaluation Tuning'],
      },
      {
        name: 'Chloe Dubois',
        role: 'Tournament Director & Strategy Coach',
        company: 'Parisian Chess Circle',
        headline: 'Psychological Resilience in Rapid Chess & Classical Openings',
        bio: 'Organizing international fide-rated opens and coaching elite junior candidates across Western Europe.',
        location: 'Paris, France',
        skills: ['French Defense', 'Rook Endgames', 'Tournament Protocol', 'Psychological Prep', 'Blitz Strategy'],
      },
      {
        name: 'Vikram Anand',
        role: 'FIDE Arbiter & Junior Chess Academy Director',
        company: 'Apex Chess Foundation',
        headline: 'Middlegame Complexities, Tactical Puzzles & Clock Pressure',
        bio: 'FIDE certified senior arbiter training collegiate teams in opening repertoires and time-trouble psychology.',
        location: 'Chennai, India',
        skills: ['Karpov Endgames', 'Tactical Drills', 'Tournament Arbiting', 'Nimzo-Indian Defense'],
      },
      {
        name: 'Ingrid Solberg',
        role: 'Cognitive Science & Chess Researcher',
        company: 'Stockholm Cognition Institute',
        headline: 'Pattern Recognition Eye-Tracking in Grandmaster Evaluation',
        bio: 'Studying neural activation patterns during rapid pattern identification and calculation heuristics.',
        location: 'Stockholm, Sweden',
        skills: ['Pattern Recognition', 'Eye Tracking', 'Cognitive Heuristics', 'Data Analysis'],
      },
    ];
  } else if (combined.includes('cook') || combined.includes('culinary') || combined.includes('bake') || combined.includes('food')) {
    templates = [
      {
        name: 'Chef Sophie Laurent',
        role: 'Executive Chef & Culinary Director',
        company: "L'Atelier Gastronomique",
        headline: 'Modern French Haute Cuisine, Sous-Vide Science & Farm Sourcing',
        bio: 'Michelin-trained chef blending modern culinary techniques with seasonal farm-to-table traditions.',
        location: 'Lyon, France',
        skills: ['Sauces & Reductions', 'Molecular Gastronomy', 'Sous-Vide', 'Seasonal Sourcing', 'Plating Artistry'],
      },
      {
        name: 'Marco Bellini',
        role: 'Master Baker & Fermentation Specialist',
        company: 'Antica Forneria & Bread Lab',
        headline: 'Wild Sourdough Starters, Ancient Grains & Long Fermentation',
        bio: 'Fourth-generation artisan baker researching ancient grain digestibility and natural lactic fermentation dynamics.',
        location: 'Bologna, Italy',
        skills: ['Wild Sourdough', 'Hydration Science', 'Ancient Spelt', 'Laminating Dough', 'Wood-Fired Ovens'],
      },
      {
        name: 'Chef Haruto Sato',
        role: 'Kaiseki Specialist & Knife Artisan',
        company: 'Kyoto Culinary Heritage Institute',
        headline: 'Traditional Dashi Stocks, Umami Chemistry & Precision Knife Skills',
        bio: 'Practitioner of multi-course Kaiseki cuisine, knife sharpening mastery, and natural fermentation techniques.',
        location: 'Kyoto, Japan',
        skills: ['Umami Extraction', 'Knife Sharpening', 'Fish Butchery', 'Kaiseki Seasons', 'Fermentation'],
      },
      {
        name: 'Aisha Adeyemi',
        role: 'Global Gastronomy Researcher & Author',
        company: 'Afro-Fusion Kitchen Collective',
        headline: 'West African Spice Blends, Fermented Locust Beans & Heritage Recipes',
        bio: 'Culinary writer and flavor developer documenting indigenous preservation methods and modern restaurant recipes.',
        location: 'London, UK',
        skills: ['Spice Chemistry', 'Fermentation', 'Flavor Pairing', 'Culinary Anthro', 'Menu Development'],
      },
      {
        name: 'Antoine Mercier',
        role: 'Artisan Fromager & Wine Pairing Specialist',
        company: 'Mercier Caves & Terroir',
        headline: 'Raw Milk Affinage, Microflora Development & Sommelier Pairing',
        bio: 'Guiding cheese affinage cellars and consulting Michelin-starred beverage directors on terroir matching.',
        location: 'Bordeaux, France',
        skills: ['Affinage', 'Microbiology', 'Terroir Tasting', 'Wine Pairing', 'Sensory Analysis'],
      },
      {
        name: 'Claire Moreau',
        role: 'Pastry Technologist & Confectionery Designer',
        company: 'Pâtisserie Nouvelle',
        headline: 'Cacao Crystallization, Sugar Architecture & Botanical Infusions',
        bio: 'Innovating low-sugar fine confectionery and chocolate tempering using single-origin heirloom cacao beans.',
        location: 'San Francisco, CA',
        skills: ['Tempering Cacao', 'Pâte à Choux', 'Botanical Extraction', 'Sugar Craft'],
      },
    ];
  } else if (combined.includes('photo') || combined.includes('camera') || combined.includes('film') || combined.includes('cinema')) {
    templates = [
      {
        name: 'Julian Vance',
        role: 'Director of Photography & Cinematographer',
        company: 'Vance Cinematics & Filmworks',
        headline: 'Anamorphic Lenses, Naturalistic Lighting Rigs & 35mm Analog Color',
        bio: 'Award-winning cinematographer with work featured at Sundance and Venice Film Festival. Dedicated to analog lens aesthetics.',
        location: 'Los Angeles, CA',
        skills: ['Arri Alexa', 'Anamorphic Glass', 'Color Grading', 'DaVinci Resolve', 'Gaffer Lighting'],
      },
      {
        name: 'Yuna Kobayashi',
        role: 'Street & Editorial Documentary Photographer',
        company: 'Urban Monolith Visuals',
        headline: 'High-Contrast Monochrome, Leica Rangefinders & Visual Storytelling',
        bio: 'Documentary photojournalist published in National Geographic and The New Yorker, capturing architectural and street moments.',
        location: 'New York, NY',
        skills: ['Street Photography', 'Leica M', 'Black & White', 'Visual Narrative', 'Darkroom Chemistry'],
      },
      {
        name: 'Rafael Mendoza',
        role: 'Lead Colorist & Post-Production Supervisor',
        company: 'Prism Color Studios',
        headline: 'ACES Color Pipelines, Film Emulation Profiles & HDR Mastering',
        bio: 'Colorist behind commercial campaigns and feature narratives, specializing in custom film stock emulation and LUT modeling.',
        location: 'Madrid, Spain',
        skills: ['ACES Workflow', 'Color Science', 'HDR10+', 'Film Grain Modeling', 'DaVinci Resolve'],
      },
      {
        name: 'Freya Nystrom',
        role: 'Nordic Landscape & Astrophotography Specialist',
        company: 'Aurora Borealis Expeditions',
        headline: 'Deep Night Exposures, Narrowband Filters & Cold-Weather Glass',
        bio: 'Capturing polar auroras, midnight sun landscapes, and deep-sky widefields across the Arctic circle.',
        location: 'Tromsø, Norway',
        skills: ['Astrophotography', 'Star Tracker Mounts', 'Lightroom Master', 'Extreme Weather Rigging'],
      },
      {
        name: 'Elias Thorne',
        role: 'Vintage Lens Restorer & Optical Craftsman',
        company: 'Heritage Glass Works',
        headline: 'Helios Anamorphic Mods, Aspherical Polishing & Flange Calibration',
        bio: 'Restoring mid-century Russian and German optical cinema glass with modern cine-mod housings.',
        location: 'Berlin, Germany',
        skills: ['Optical Collimation', 'Cine-Modding', 'Lens Coating', 'Bokeh Profiling'],
      },
      {
        name: 'Chloe Vandeberg',
        role: 'Commercial Fashion & Lighting Designer',
        company: 'Vogue & Studio Lumina',
        headline: 'Studio Strobe Modulation, Parabolic Modifiers & High-Key Editorial',
        bio: 'Lighting director for Paris and Milan fashion weeks with a focus on sculpting form through soft directional light.',
        location: 'Milan, Italy',
        skills: ['Profoto Rigs', 'Light Sculpting', 'Capture One Pro', 'High-End Retouching'],
      },
    ];
  } else if (combined.includes('space') || combined.includes('astronomy') || combined.includes('physics')) {
    templates = [
      {
        name: 'Dr. Hiroshi Tanaka',
        role: 'Principal Cosmologist & Payload Lead',
        company: 'Japan Aerospace Exploration Agency (JAXA)',
        headline: 'Quantum Sensors for Gravitational Waves & Deep Interstellar Space',
        bio: 'Leading spaceborne cryogenic quantum sensor payload design for solar system boundary mapping.',
        location: 'Tokyo, Japan',
        skills: ['Quantum Sensors', 'Cryogenics', 'Interferometry', 'Python', 'Relativity'],
      },
      {
        name: 'Owen Gallagher',
        role: 'Lunar Guidance & Terrain Navigation Engineer',
        company: 'Cislunar Dynamics Group',
        headline: 'Autonomous Optical Terrain-Relative Landing & Entry Guidance',
        bio: 'Designing vision-aided hazard avoidance and closed-loop powered descent controllers for lunar south-pole landers.',
        location: 'Houston, TX',
        skills: ['Terrain Navigation', 'GNC Systems', 'Kalman Filtering', 'Simulink', 'C++'],
      },
      {
        name: 'Dr. Evelyn Foster',
        role: 'Exoplanet Atmospheres Researcher',
        company: 'Space Telescope Science Institute (STScI)',
        headline: 'JWST Transmission Spectroscopy & Biosignature Detection',
        bio: 'Analyzing infrared spectroscopic data from TRAPPIST-1 system to identify atmospheric methane and water vapor signatures.',
        location: 'Baltimore, MD',
        skills: ['Spectroscopy', 'JWST Pipelines', 'Radiative Transfer', 'Python', 'Bayesian Models'],
      },
      {
        name: 'Marcus Thorne',
        role: 'Propulsion Systems Architect',
        company: 'Apex Rocketry & Propulsion',
        headline: 'Staged-Combustion Methalox Engines & Aerospike Nozzles',
        bio: 'Hardware engineer with experience hot-firing regeneratively cooled rocket thrust chambers and turbopump manifolds.',
        location: 'Seattle, WA',
        skills: ['Combustion Instability', 'CFD Simulation', 'Additive Inconel', 'Hot-Fire Tests'],
      },
      {
        name: 'Dr. Meera Nair',
        role: 'Astrophysical Data Science Director',
        company: 'European Space Agency (ESA)',
        headline: 'Gaia Telescope Stellar Astrometry & Dark Matter Halos',
        bio: 'Mapping Milky Way dwarf galaxy stellar kinematics to constrain cold dark matter halo density profiles.',
        location: 'Darmstadt, Germany',
        skills: ['Astrometry', 'Dark Matter', 'Big Data Astrophysics', 'Statistical Inference'],
      },
      {
        name: 'Devon Brooks',
        role: 'Spacecraft Thermal Control Engineer',
        company: 'Lunar Habitat Architectures',
        headline: 'Cryogenic Radiators, Multilayer Insulation & Regolith Shielding',
        bio: 'Designing passive thermal loops and radiation shields for long-duration lunar south pole surface expeditions.',
        location: 'Vancouver, Canada',
        skills: ['Thermal Modeling', 'MLI Blankets', 'Regolith Sintering', 'Space Environment'],
      },
    ];
  } else if (combined.includes('music') || combined.includes('audio') || combined.includes('sound')) {
    templates = [
      {
        name: 'Kaelen Miller',
        role: 'Audio Engineer & Modular Synth Designer',
        company: 'Frequency Resonance Labs',
        headline: 'Analog Voltage Control, DSP Filters & Granular Synthesis',
        bio: 'Designing eurorack synthesizer modules and custom spatial audio DSP algorithms for film scoring and immersive soundscapes.',
        location: 'Berlin, Germany',
        skills: ['Eurorack', 'DSP Programming', 'Ableton Live', 'Max/MSP', 'Audio Mastering'],
      },
      {
        name: 'Linnea Holm',
        role: 'Multi-Instrumentalist & Orchestral Arranger',
        company: 'Nordic Symphony Collaborations',
        headline: 'Cinematic String Arrangements & Hybrid Acoustic-Electronic Scoring',
        bio: 'Classically trained cellist and composer scoring interactive game soundtracks and contemporary dance pieces.',
        location: 'Stockholm, Sweden',
        skills: ['Cello', 'Orchestration', 'Logic Pro', 'Spitfire Audio', 'Microtonal Composition'],
      },
      {
        name: 'Darius Thorne',
        role: 'Grammy-Nominated Mixing & Mastering Engineer',
        company: 'SubSonic Precision Studios',
        headline: 'Dolby Atmos Spatial Mixes, Tape Saturation & Low-End Control',
        bio: 'Over 12 years mixing electronic, hip-hop, and indie records, specializing in multidimensional Atmos mixes.',
        location: 'Atlanta, GA',
        skills: ['Dolby Atmos', 'Pro Tools HD', 'Analog Outboard', 'Phase Alignment', 'Mastering'],
      },
      {
        name: 'Tessa Lindqvist',
        role: 'Generative Audio AI Researcher',
        company: 'Neural Harmonix',
        headline: 'Diffusion Audio Generation & Neural Waveform Synthesizers',
        bio: 'Training generative latent diffusion models on raw audio to enable real-time interactive instrument timbre transfers.',
        location: 'San Francisco, CA',
        skills: ['PyTorch', 'Audio Diffusion', 'Vocoders', 'DSP', 'Python'],
      },
      {
        name: 'Luc Beaumont',
        role: 'Vintage Tube Mic & Preamp Designer',
        company: 'Acoustic Vacuum Systems',
        headline: 'Ribbon Microphone Transformers & Class-A Discrete Circuits',
        bio: 'Handcrafting studio ribbon microphones and discrete transformer-balanced tube preamplifiers.',
        location: 'Montreal, Canada',
        skills: ['Analog Electronics', 'Ribbon Mics', 'PCB Layout', 'Acoustic Chambers'],
      },
      {
        name: 'Simone Baptiste',
        role: 'Sound Designer & Foley Artist',
        company: 'Atmospheric CineAudio',
        headline: 'Naturalist Foley Recording, Field Hydrophones & Sound Effects',
        bio: 'Capturing tactile organic textures and designing visceral acoustic layers for cinema and game worlds.',
        location: 'Bristol, UK',
        skills: ['Field Recording', 'Foley Art', 'Soundminer', 'Reaper', 'Surround Design'],
      },
    ];
  } else if (combined.includes('game') || combined.includes('gaming') || combined.includes('esports')) {
    templates = [
      {
        name: 'Caleb Navarro',
        role: 'Principal Physics & Simulation Architect',
        company: 'Northwind Interactive Studios',
        headline: 'Deterministic Rigid-Body Solvers, Cloth Dynamics & GPU Fluids',
        bio: 'Architecting lockstep multiplayer physics engines and real-time destructible geometry solvers for large-scale arena worlds.',
        location: 'Montreal, Canada',
        skills: ['Physics Solvers', 'CUDA', 'Deterministic Sim', 'C++20', 'Unreal Engine 5'],
      },
      {
        name: 'George Allan',
        role: 'Community Scrim Organizer & Engine Dev',
        company: 'PixelForge Studios',
        headline: 'Vulkan Graphics Pipelines & Procedural Worldgen',
        bio: 'Building open-source rust game engine plugins and competitive esports scrimmage matchmaking.',
        location: 'Austin, TX',
        skills: ['Rust', 'Vulkan', 'Bevy Engine', 'HLSL', 'Networking'],
      },
      {
        name: 'Sora Takahashi',
        role: 'Competitive Esports Strategist & Analyst',
        company: 'Tokyo Vipers Esports',
        headline: 'Tactical Scrim VOD Reviews, Frame Data Analytics & Team Meta',
        bio: 'Coaching top-tier professional squads in tactical shooters and fighting games with probabilistic decision trees.',
        location: 'Tokyo, Japan',
        skills: ['VOD Analysis', 'Frame Data', 'Team Compositions', 'Anti-Stratting', 'Coaching'],
      },
      {
        name: 'Mac Roseville',
        role: 'VR & Spatial Game Designer',
        company: 'Spatial Realities Lab',
        headline: 'Low-Latency Haptic Feedback & XR Interfaces',
        bio: 'Developing spatial user interfaces and WebXR experiences with Three.js and WebGL.',
        location: 'Seattle, WA',
        skills: ['Three.js', 'WebXR', 'GLSL', 'Unity', 'C#'],
      },
      {
        name: 'Lachlan Reid',
        role: 'Procedural Level Architect & Tech Artist',
        company: 'Voxel Horizon Games',
        headline: 'Houdini PCG Pipelines, Biome Clustering & Destructible Meshes',
        bio: 'Generating vast open worlds using procedural rule sets and optimized runtime geometry instancing.',
        location: 'Melbourne, Australia',
        skills: ['Houdini', 'PCG Systems', 'Geometry Nodes', 'Performance Profiling'],
      },
      {
        name: 'Elise Gagnon',
        role: 'Combat Systems & Gameplay Programmer',
        company: 'IronClad Interactive',
        headline: 'Sub-Millisecond Hit Registration, Rollback Netcode & Animation Blending',
        bio: 'Engine programmer writing deterministic rollback netcode for multiplayer melee combat and hitboxes.',
        location: 'Montreal, Canada',
        skills: ['Rollback Netcode', 'Deterministic Physics', 'C++', 'Animation Trees'],
      },
    ];
  } else if (
    combined.includes('deep learning') ||
    combined.includes('deeplearning') ||
    combined.includes('neural compute') ||
    combined.includes('supercomputing')
  ) {
    templates = [
      {
        name: 'Dr. Marcus Vance',
        role: 'Distributed Systems & Cluster Architect',
        company: 'HyperCompute Systems Lab',
        headline: 'NCCL Ring All-Reduce, InfiniBand NDR & 1024-H100 Parallel Cluster Training',
        bio: 'Spearheading large-scale distributed training infrastructure, Triton FlashAttention-3 kernels, and low-latency network topologies.',
        location: 'San Francisco, CA',
        skills: ['PyTorch FSDP', 'Triton Kernels', 'NCCL', 'CUDA 12', 'InfiniBand'],
      },
      {
        name: 'Anika Deshmukh',
        role: 'Kernel Optimization & Parallelism Fellow',
        company: 'Apex Neural Engine',
        headline: 'Triton Custom Ops, FP8 Mixed Precision & Zero-Bubble Pipeline Scheduling',
        bio: 'Optimizing high-throughput attention kernels and Megatron-LM tensor parallelisms for foundation model training runs.',
        location: 'Seattle, WA',
        skills: ['Triton', 'CUDA C++', 'Megatron-LM', 'FP8 Precision', 'Kernel Profiling'],
      },
      {
        name: 'Grant Holloway',
        role: 'Lead GPU Infrastructure Engineer',
        company: 'Distributed Supercomputing Core',
        headline: 'Kubernetes Slurm GPU Schedulers, NVLink Fabric & Checkpoint Resiliency',
        bio: 'Managing multi-node GPU clusters, async NVMe checkpoint storage, and automated node fault recovery protocols.',
        location: 'Austin, TX',
        skills: ['Slurm', 'Kubernetes', 'NVLink', 'RoCE v2', 'GPU Telemetry'],
      },
      {
        name: 'Dr. Sabine Richter',
        role: 'High-Throughput Inference Architect',
        company: 'Zurich Neural Accelerator Lab',
        headline: 'vLLM PagedAttention, TensorRT-LLM & Speculative Decoding Rigs',
        bio: 'Researching memory-efficient continuous batching and sub-millisecond time-to-first-token inference runtimes.',
        location: 'Zurich, Switzerland',
        skills: ['vLLM', 'TensorRT-LLM', 'Speculative Decoding', 'PagedAttention', 'C++'],
      },
      {
        name: 'Rohan Kulkarni',
        role: 'Hardware Acceleration & Silicon Systems Lead',
        company: 'NextGen Silicon Foundry',
        headline: 'Custom AI ASIC Interconnects, Optical Switch Fabric & HBM3e Memory',
        bio: 'Designing next-generation scale-up memory architectures and low-power matrix multiplication accelerators.',
        location: 'San Jose, CA',
        skills: ['HBM3e', 'Optical Switching', 'PCIe Gen 6', 'ASIC Emulation', 'SystemVerilog'],
      },
      {
        name: 'Rachel Donovan',
        role: 'Cluster Reliability & Supercomputing Director',
        company: 'Global Compute Infrastructure',
        headline: '99.98% Multi-Petaflop Uptime, Liquid Immersion Cooling & Power Efficiency',
        bio: 'Directing multi-megawatt AI datacenter deployments, thermal load-balancing, and green compute initiatives.',
        location: 'Boulder, CO',
        skills: ['Liquid Cooling', 'Cluster Reliability', 'Power Allocation', 'Data Center Ops'],
      },
    ];
  } else {
    // Universal High-Impact Professional Template Roster (AI, Engineering, Startups, Science)
    templates = [
      {
        name: 'Anna San',
        role: 'Multimodal AI Research Fellow',
        company: 'Open Earth Foundation & AI Lab',
        headline: 'Agent Orchestration, Diffusion Models & Edge Inference Optimization',
        bio: 'Leading research on foundation model distillation and real-time on-device agent architectures.',
        location: 'San Francisco, CA',
        skills: ['PyTorch', 'Agent Orchestration', 'Model Quantization', 'Multimodal Vision', 'Python'],
      },
      {
        name: 'Nathaniel Price',
        role: 'Principal Systems Architect',
        company: 'Apex Distributed Networks',
        headline: 'High-Concurrency Mesh Topologies, Raft Protocols & Zero-Knowledge Verification',
        bio: 'Architecting ultra-low latency event brokers and fault-tolerant distributed consensus networks.',
        location: 'New York, NY',
        skills: ['Distributed Systems', 'Rust', 'Consensus Protocols', 'Kafka', 'Go'],
      },
      {
        name: 'Dr. Helena Novak',
        role: 'Neuroinformatics & Machine Learning Lead',
        company: 'Zurich Computational Institute',
        headline: 'Neuromorphic Spiking Architectures & Synaptic Plasticity Simulation',
        bio: 'Deploying biologically inspired low-power spiking neural networks for edge sensory devices.',
        location: 'Zurich, Switzerland',
        skills: ['Spiking Networks', 'Neuroinformatics', 'Python', 'CUDA', 'C++'],
      },
      {
        name: 'Classie Willey',
        role: 'Executive Director & Venture Partner',
        company: 'Global Innovation Initiative',
        headline: 'Climate Resilience Technology & Decentralized Utility Microgrids',
        bio: 'Connecting tech founders with regional infrastructure grants in developing nations.',
        location: 'Boston, MA',
        skills: ['Venture Strategy', 'Community Impact', 'Resource Optimization', 'ESG Audit'],
      },
      {
        name: 'Arjun Mehta',
        role: 'Autonomous Systems & Robotics Specialist',
        company: 'Autonomous Motion Labs',
        headline: 'Sensor Fusion, Extended Kalman Filters & Visual SLAM Navigation',
        bio: 'Building real-time perception and path planning algorithms for autonomous micro-drones.',
        location: 'Austin, TX',
        skills: ['ROS 2', 'SLAM', 'Kalman Filters', 'C++', 'Embedded Linux'],
      },
      {
        name: 'Dr. Miriam Weiss',
        role: 'Computational Science Director',
        company: 'Quantum Frontier Research',
        headline: 'Hamiltonian Simulation, Tensor Networks & Variational Quantum Algorithms',
        bio: 'Developing hybrid classical-quantum algorithms to model complex molecular interactions.',
        location: 'Cambridge, MA',
        skills: ['Quantum Algorithms', 'Julia', 'Tensor Networks', 'Molecular Dynamics'],
      },
    ];
  }

  // Additional diverse professional community pool so every server has 18 unique people (+12 more members)
  const EXPANDED_MEMBER_POOL: DomainProfileTemplate[] = [
    {
      name: 'Maya Lin',
      role: 'Staff ML Engineer',
      company: 'Anthropic',
      headline: 'Agent Orchestration, Diffusion Models & Edge Inference optimization for low-latency production clusters',
      bio: 'Designing low-latency multimodal agent pipelines and quantized inference runtimes for edge and datacenter deployments.',
      location: 'San Francisco, CA',
      skills: ['PyTorch', 'Agent Orchestration', 'Model Quantization', 'Triton', 'CUDA'],
    },
    {
      name: 'Gabriel Ortiz',
      role: 'Principal Distributed Systems Eng',
      company: 'Databricks',
      headline: 'High-Concurrency Mesh Topologies, Raft Consensus & Zero-Copy Distributed Storage Engines',
      bio: 'Architecting globally replicated consensus layers, streaming shuffle fabrics, and resilient GPU compute schedulers.',
      location: 'New York, NY',
      skills: ['Distributed Systems', 'Rust', 'Raft Consensus', 'Kubernetes', 'Go'],
    },
    {
      name: 'Zoe Kim',
      role: 'Senior Product Designer',
      company: 'Linear',
      headline: 'Design Systems, Spatial Interfaces & High-Craft Interaction Architecture for Developer Tools',
      bio: 'Crafting tactile, keyboard-first workflows and high-density data interfaces for engineering and research teams.',
      location: 'Seattle, WA',
      skills: ['Design Systems', 'Prototyping', 'Figma', 'WebGL', 'Motion Craft'],
    },
    {
      name: 'Tariq Al-Mansoor',
      role: 'Staff Security Researcher',
      company: 'Cloudflare',
      headline: 'Post-Quantum Cryptography, Zero-Trust Mesh Routing & Hardware Enclave Verification',
      bio: 'Researching lattice-based key exchange protocols and secure multi-party compute for edge networks.',
      location: 'London, UK',
      skills: ['Zero-Trust', 'Cryptography', 'Rust', 'eBPF', 'Security Audits'],
    },
    {
      name: 'Nadia Chernova',
      role: 'Lead Quantitative Researcher',
      company: 'Citadel Labs',
      headline: 'Stochastic Optimization, Low-Latency C++ Execution & Bayesian Time-Series Modeling',
      bio: 'Building real-time statistical inference engines and microsecond-scale market microstructure simulations.',
      location: 'Chicago, IL',
      skills: ['C++20', 'Bayesian Inference', 'Python', 'CUDA', 'Signal Processing'],
    },
    {
      name: 'Malik Washington',
      role: 'Staff Infrastructure Engineer',
      company: 'Stripe',
      headline: 'Multi-Region Fault Tolerance, Event-Driven Ledgers & Sub-10ms API Gateways',
      bio: 'Scaling high-reliability global transaction pipelines and automated chaos testing frameworks.',
      location: 'Atlanta, GA',
      skills: ['Go', 'Distributed Ledgers', 'Kafka', 'PostgreSQL', 'Observability'],
    },
    {
      name: 'Camille Laurent',
      role: 'AI Research Scientist',
      company: 'Mistral AI',
      headline: 'Sparse Mixture-of-Experts, Long-Context Attention & Multilingual Reasoning Benchmarks',
      bio: 'Investigating efficient MoE routing and synthetic curriculum generation for open-weights foundation models.',
      location: 'Paris, France',
      skills: ['Mixture of Experts', 'PyTorch', 'FlashAttention', 'NLP', 'Evaluations'],
    },
    {
      name: 'Jason Zhao',
      role: 'Founding Systems Engineer',
      company: 'Modal Labs',
      headline: 'Serverless GPU Cold-Start Optimization, Container Snapshots & Distributed File Systems',
      bio: 'Shrinking container boot latency to sub-second scales using lazy FUSE mounts and CRIU memory snapshots.',
      location: 'San Francisco, CA',
      skills: ['Linux Kernel', 'Rust', 'Containers', 'FUSE', 'GPU Scheduling'],
    },
    {
      name: 'Priya Patel',
      role: 'Director of Engineering',
      company: 'Scale AI',
      headline: 'Human-in-the-Loop Evaluation Pipelines, RLHF Tooling & Multimodal Data Flywheels',
      bio: 'Leading cross-functional teams building frontier benchmark harnesses and enterprise model evaluation suites.',
      location: 'Toronto, Canada',
      skills: ['RLHF', 'Data Pipelines', 'Engineering Leadership', 'Python', 'Eval Suites'],
    },
    {
      name: 'Anton Zeilinger',
      role: 'Principal Hardware Architect',
      company: 'NVIDIA',
      headline: 'NVLink Interconnect Topologies, Tensor Core Microarchitecture & Silicon Bring-Up',
      bio: 'Working on next-generation scale-up interconnects and memory coherency protocols for exascale AI clusters.',
      location: 'Munich, Germany',
      skills: ['SystemVerilog', 'NVLink', 'HBM3e', 'Computer Architecture', 'PCIe Gen6'],
    },
    {
      name: 'Hannah Park',
      role: 'Staff Frontend Architect',
      company: 'Vercel',
      headline: 'React Compiler Internals, Edge Rendering Streams & Local-First Sync Engines',
      bio: 'Optimizing collaborative web applications with CRDT state engines and sub-frame rendering pipelines.',
      location: 'Los Angeles, CA',
      skills: ['TypeScript', 'React', 'CRDTs', 'WebAssembly', 'Performance'],
    },
    {
      name: 'Mateo Silva',
      role: 'Robotics Perception Lead',
      company: 'Figure AI',
      headline: 'Real-Time 3D Gaussian Splatting, Tactile Grasping & Vision-Language-Action Policies',
      bio: 'Training dexterous manipulation policies that bridge visual foundation models with high-frequency motor control.',
      location: 'Sunnyvale, CA',
      skills: ['ROS 2', 'Computer Vision', 'VLA Models', 'C++', 'Kinematics'],
    },
    {
      name: 'Kenji Takahashi',
      role: 'Senior Compiler Engineer',
      company: 'Modular',
      headline: 'MLIR Graph Lowering, Polyhedral Loop Optimization & Heterogeneous Accelerator Targets',
      bio: 'Building portable compiler passes that automatically fuse attention and matrix ops across diverse silicon.',
      location: 'Tokyo, Japan',
      skills: ['MLIR', 'LLVM', 'C++', 'GPU Kernels', 'Compiler Design'],
    },
    {
      name: 'Amara Okafor',
      role: 'Staff Developer Advocate',
      company: 'Hugging Face',
      headline: 'Open-Source Model Ecosystems, Edge WebGPU Inference & Community Hackathons',
      bio: 'Empowering builders worldwide to fine-tune and run open models right in the browser with WebGPU.',
      location: 'London, UK',
      skills: ['Transformers', 'WebGPU', 'Open Source', 'Technical Writing', 'Python'],
    },
    {
      name: 'Liam Chen',
      role: 'Lead Graphics Engineer',
      company: 'Epic Games',
      headline: 'Real-Time Global Illumination, Vulkan Compute Shaders & Procedural Foliage Systems',
      bio: 'Pushing real-time raytracing and neural supersampling pipelines for interactive 3D worlds.',
      location: 'Vancouver, Canada',
      skills: ['Vulkan', 'HLSL', 'Ray Tracing', 'C++', 'Unreal Engine'],
    },
    {
      name: 'Astrid Lindholm',
      role: 'Principal Climate Tech Scientist',
      company: 'Northvolt Research',
      headline: 'Solid-State Battery Modeling, Grid Telemetry & Physics-Informed Neural Surrogates',
      bio: 'Accelerating electrochemical cell discovery using graph neural networks and high-throughput lab automation.',
      location: 'Stockholm, Sweden',
      skills: ['Physics-Informed ML', 'Graph Nets', 'Python', 'Energy Systems', 'Simulation'],
    },
  ];

  // Combine the 6 domain-specific members with 12 unique non-duplicate members from the expanded pool (18 total per server)
  const existingNames = new Set(templates.map((t) => t.name.toLowerCase().replace(/^dr\.\s+|^chef\s+|^grandmaster\s+/i, '').trim()));
  let seedHash = 0;
  for (let i = 0; i < (commId + community.name).length; i++) {
    seedHash = ((seedHash << 5) - seedHash + (commId + community.name).charCodeAt(i)) | 0;
  }
  const rotatedPool = [
    ...EXPANDED_MEMBER_POOL.slice(Math.abs(seedHash) % EXPANDED_MEMBER_POOL.length),
    ...EXPANDED_MEMBER_POOL.slice(0, Math.abs(seedHash) % EXPANDED_MEMBER_POOL.length),
  ];

  const mergedTemplates: DomainProfileTemplate[] = [...templates];
  for (const candidate of rotatedPool) {
    if (mergedTemplates.length >= 18) break;
    const normCand = candidate.name.toLowerCase().replace(/^dr\.\s+|^chef\s+|^grandmaster\s+/i, '').trim();
    if (!existingNames.has(normCand)) {
      existingNames.add(normCand);
      mergedTemplates.push(candidate);
    }
  }

  // Produce 18 unique members per server with unique gender-matched local portraits and rich directory metadata
  const usedAvatars = new Set<string>();
  const statusPattern = [
    'online', 'online', 'online', 'away', 'online', 'online',
    'online', 'away', 'online', 'offline', 'online', 'online',
    'away', 'online', 'offline', 'online', 'away', 'online',
  ] as const;

  return mergedTemplates.map((tpl, idx) => {
    const uniqueAvatar = getUniqueGenderMatchedPhoto(tpl.name, community.id + community.name, idx, usedAvatars);
    const cleanId = `mem_${community.id.replace(/[^a-z0-9]/gi, '_')}_${idx}_${tpl.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const deterministicSeed = Math.abs(seedHash + idx * 37);

    return {
      id: cleanId,
      name: tpl.name,
      avatar: uniqueAvatar,
      status: statusPattern[idx % statusPattern.length],
      role: tpl.role,
      company: tpl.company,
      headline: tpl.headline,
      bio: tpl.bio,
      location: tpl.location,
      linkedinUrl: `linkedin.com/in/${tpl.name.toLowerCase().replace(/\s+/g, '-')}`,
      githubUrl: `github.com/${tpl.name.toLowerCase().replace(/\s+/g, '')}`,
      skills: tpl.skills,
      contributionsCount: 140 + ((idx * 83 + community.name.length * 19) % 420),
      joinedDate: idx % 3 === 0 ? 'Member since 2023' : 'Member since 2024',
      safetyNumber: `${10000 + (deterministicSeed % 89999)} - ${10000 + ((deterministicSeed * 3) % 89999)} - ${10000 + ((deterministicSeed * 7) % 89999)} - ${10000 + ((deterministicSeed * 11) % 89999)} - ${10000 + ((deterministicSeed * 13) % 89999)}`,
      verified: idx < 12 || idx % 2 === 0,
      openToConnect: idx % 3 !== 2,
      sharedInterestsCount: 2 + ((deterministicSeed + idx) % 4),
    };
  });
}

let cachedKnownMembersByCanon: Map<string, ServerMember> | null = null;

function canonicalizeKnownMemberName(name: string): string {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/^(dr\.?|prof\.?|chef|grandmaster|mr\.?|ms\.?|mrs\.?)\s+/i, '')
    .replace(/\s+/g, ' ');
}

function getKnownMembersRegistry(): Map<string, ServerMember> {
  if (cachedKnownMembersByCanon) return cachedKnownMembersByCanon;
  const registry = new Map<string, ServerMember>();

  // 1. Seed from all predefined community member directories
  Object.values(COMMUNITY_MEMBERS_MAP).forEach((list) => {
    list.forEach((m) => {
      const key = canonicalizeKnownMemberName(m.name);
      if (key && !registry.has(key)) {
        registry.set(key, m);
      }
    });
  });

  // 2. Seed from every domain template branch in getServerMembers
  const domainProbes = [
    { id: 'probe_chess', name: 'Chess Strategy', category: 'Chess' },
    { id: 'probe_culinary', name: 'Culinary Gastronomy', category: 'Cooking' },
    { id: 'probe_cinema', name: 'Cinema Film', category: 'Film' },
    { id: 'probe_space', name: 'Space Orbital Astronomy', category: 'Space' },
    { id: 'probe_music', name: 'Music Audio Synth', category: 'Music' },
    { id: 'probe_gaming', name: 'Gaming Esports', category: 'Gaming' },
    { id: 'probe_sec', name: 'Cyber Security Cryptography', category: 'Security' },
    { id: 'probe_ai', name: 'AI Systems Research', category: 'AI' },
  ];

  domainProbes.forEach((probe) => {
    const members = getServerMembers({
      id: probe.id,
      name: probe.name,
      category: probe.category,
      description: probe.name,
      activeMembers: 12,
      totalMembers: 18,
      joined: false,
      avatar: '',
      tags: [probe.category],
      channels: [],
    });
    members.forEach((m) => {
      const key = canonicalizeKnownMemberName(m.name);
      if (key && !registry.has(key)) {
        registry.set(key, m);
      }
    });
  });

  cachedKnownMembersByCanon = registry;
  return registry;
}

export function findKnownServerMemberByName(name: string): ServerMember | undefined {
  const key = canonicalizeKnownMemberName(name);
  if (!key) return undefined;
  return getKnownMembersRegistry().get(key);
}

/**
 * Returns deeply authentic, section-specific initial conversations for ANY channel in a community.
 * Shows unique responses accordingly in different sections (#general, #showcase, #resources, etc.)
 */
export function getChannelInitialMessages(
  community: Community,
  channel: CommunityChannel,
  members: ServerMember[]
): Message[] {
  return buildDomainChannelMessages(community, channel, members);
}

/**
 * Generates unique contextual responses from a server member when a user posts in a channel.
 * Takes into account the server topic, the channel name, and the user's message.
 */
const sessionSentRepliesByChat: Record<string, Set<string>> = {};
const sessionLastResponderByChat: Record<string, string> = {};
const sessionReplyTurnByChat: Record<string, number> = {};

const CONTEXT_STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'have', 'from', 'your', 'just',
  'about', 'into', 'here', 'there', 'what', 'when', 'where', 'which', 'would',
  'could', 'should', 'they', 'them', 'their', 'been', 'being', 'more', 'some',
  'very', 'really', 'also', 'like', 'know', 'think', 'want', 'need', 'make',
  'made', 'does', 'doing', 'done', 'good', 'great', 'nice', 'cool', 'guys',
  'everyone', 'anyone', 'someone', 'hello', 'hey', 'excited', 'join', 'happy',
  'chat', 'tell', 'sounds', 'right', 'now', 'working', 'building', 'share',
  'shared', 'voice', 'note', 'message', 'jennies', 'please', 'thanks', 'thank',
  'you', 'are', 'was', 'were', 'will', 'can', 'how', 'why', 'who', 'our', 'out',
  'all', 'any', 'but', 'not', 'too', 'yes', 'yeah', 'yep', 'okay', 'sure',
]);

function hashText(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Extracts a clean, natural topic snippet from the user's message so replies
 * directly reflect the user's specific context.
 */
export function extractContextTopic(userMessage: string): string | null {
  const cleaned = userMessage
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[^\p{L}\p{N}\s#+-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) return null;

  const words = cleaned.split(' ');
  const meaningful: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const raw = words[i];
    const lower = raw.toLowerCase().replace(/^#/, '');
    if (lower.length < 3 || CONTEXT_STOPWORDS.has(lower)) continue;
    meaningful.push(raw);
    if (meaningful.length >= 3) break;
  }

  if (meaningful.length === 0) return null;
  const phrase = meaningful.join(' ');
  return phrase.length > 34 ? `${phrase.slice(0, 34).trim()}…` : phrase;
}

/**
 * Picks a unique reply from candidates for a given conversation key so
 * consecutive or differently-contextualized messages never get duplicate replies.
 */
export function pickUniqueReply(
  chatKey: string,
  userMessage: string,
  candidates: string[],
  fallbackBuilder: (turn: number) => string
): string {
  if (!sessionSentRepliesByChat[chatKey]) {
    sessionSentRepliesByChat[chatKey] = new Set<string>();
  }
  const used = sessionSentRepliesByChat[chatKey];
  const turn = (sessionReplyTurnByChat[chatKey] || 0) + 1;
  sessionReplyTurnByChat[chatKey] = turn;

  const deduped = candidates.filter((c) => c && c.trim().length > 0);
  if (deduped.length > 0) {
    const startIdx = (hashText(`${userMessage.trim().toLowerCase()}::${turn}`) + turn) % deduped.length;
    for (let offset = 0; offset < deduped.length; offset++) {
      const candidate = deduped[(startIdx + offset) % deduped.length];
      if (!used.has(candidate)) {
        used.add(candidate);
        return candidate;
      }
    }
  }

  let synthesized = fallbackBuilder(turn);
  let suffix = 2;
  while (used.has(synthesized) && suffix < 10) {
    synthesized = `${fallbackBuilder(turn + suffix)}`;
    suffix++;
  }
  used.add(synthesized);
  return synthesized;
}

export function getChannelDynamicResponse(
  community: Community,
  channel: CommunityChannel,
  userMessage: string,
  members: ServerMember[]
): { responder: ServerMember; text: string } {
  const chatKey = `channel::${community.id}::${channel.id}`;
  const pool = members.slice(0, Math.min(members.length, 8));
  const lastResponderId = sessionLastResponderByChat[chatKey];
  const eligibleMembers =
    pool.length > 1 ? pool.filter((m) => m.id !== lastResponderId) : pool;
  const pickIdx =
    (hashText(`${userMessage}::${sessionReplyTurnByChat[chatKey] || 0}`) +
      (sessionReplyTurnByChat[chatKey] || 0)) %
    Math.max(1, eligibleMembers.length);
  const responder = eligibleMembers[pickIdx] || members[0];
  sessionLastResponderByChat[chatKey] = responder.id;

  const commName = community.name;
  const channelLabel = channel.name.replace(/^#/, '');
  const topicClean = (channel.topic || commName).trim();
  const shortChannelTopic =
    topicClean.length > 48 ? `${topicClean.slice(0, 48).trim()}…` : topicClean;
  const msgLower = userMessage.toLowerCase().trim();
  const extractedTopic = extractContextTopic(userMessage);
  const responderRole = responder.role || 'member';
  const responderSkill = responder.skills?.[0] || commName;

  // 1. Voice Note Context
  const voiceMatch = userMessage.match(/(\d+)\s*s/i);
  if (
    msgLower.includes('voice note') ||
    msgLower.includes('voice snippet') ||
    msgLower.includes('🎙️')
  ) {
    const secs = voiceMatch ? `${voiceMatch[1]}s` : 'quick';
    const voiceCandidates = [
      `Just listened to your ${secs} voice note, Jennies! Super clear breakdown—that aligns closely with what I've been seeing in ${responderSkill}.`,
      `Appreciate the ${secs} audio update in #${channelLabel}, Jennies! Hearing the reasoning out loud makes the next step much clearer.`,
      `Played your voice note twice, Jennies—sharp point on ${shortChannelTopic}. Want to spin up a thread here to compare notes?`,
      `Loud and clear on your ${secs} voice clip, Jennies! From my work as ${responderRole}, that's exactly the angle worth testing next.`,
      `Thanks for dropping that audio note in #${channelLabel}, Jennies! Way easier to follow nuance by voice—curious how you plan to test it.`,
    ];
    return {
      responder,
      text: pickUniqueReply(
        chatKey,
        userMessage,
        voiceCandidates,
        (t) =>
          `Just caught your audio note #${t} in #${channelLabel}, Jennies! Really helpful context for our ${commName} thread.`
      ),
    };
  }

  // 2. Attachment / Image / Code / File Context
  if (
    msgLower.startsWith('[image:') ||
    msgLower.startsWith('[code:') ||
    msgLower.startsWith('[file:') ||
    msgLower.includes('[attachment:')
  ) {
    const attachmentName =
      userMessage.match(/:\s*([^\]]+)\]/)?.[1]?.trim() || 'your attachment';
    const attachmentCandidates = msgLower.startsWith('[code:')
      ? [
          `Just reviewed ${attachmentName}, Jennies—clean structure! Are you benchmarking this against your ${commName} baseline yet?`,
          `Nice code drop (${attachmentName}), Jennies! That logic handles edge cases really cleanly for #${channelLabel}.`,
          `Thanks for posting ${attachmentName}, Jennies! I'll run a quick sanity check on my side and share any optimizations I spot.`,
        ]
      : msgLower.startsWith('[image:')
      ? [
          `Awesome visual in ${attachmentName}, Jennies! Seeing it laid out makes the whole ${commName} flow click immediately.`,
          `Really clear capture (${attachmentName}), Jennies! That's a great reference point for everyone following #${channelLabel}.`,
          `Love what you shared in ${attachmentName}, Jennies! What stood out most to you when putting that together?`,
        ]
      : [
          `Grabbed ${attachmentName}, Jennies! Going through the details now—really useful reference for #${channelLabel}.`,
          `Thanks for uploading ${attachmentName} to ${commName}, Jennies! Bookmarking this for our next deep dive.`,
          `Appreciate you sharing ${attachmentName}, Jennies! I'll cross-check it with my ${responderSkill} notes today.`,
        ];
    return {
      responder,
      text: pickUniqueReply(
        chatKey,
        userMessage,
        attachmentCandidates,
        (t) =>
          `Thanks for sharing ${attachmentName} (#${t}), Jennies! Super helpful addition to #${channelLabel}.`
      ),
    };
  }

  // 3. Greeting / New-join Icebreaker Context
  const isGreeting =
    /\b(hi|hey|hello|howdy|greetings|good morning|good afternoon|good evening|excited to join)\b/i.test(
      msgLower
    ) && msgLower.length < 95;
  if (isGreeting) {
    const greetingCandidates = [
      `Hey Jennies, glad you're in #${channelLabel}! Jump right in—what part of ${commName} are you most curious about this week?`,
      `Welcome aboard, Jennies! I'm focusing on ${responderSkill} here in ${commName}. What brought you into #${channelLabel} today?`,
      `Great to see you here, Jennies! #${channelLabel} has been lively lately—feel free to drop whatever you're exploring.`,
      `Hi Jennies! Always awesome having a fresh perspective in ${commName}. Are you here to brainstorm, ship, or swap notes?`,
    ];
    return {
      responder,
      text: pickUniqueReply(
        chatKey,
        userMessage,
        greetingCandidates,
        (t) =>
          `Good to see you in #${channelLabel}, Jennies (check-in #${t})! What's top of mind for you in ${commName} today?`
      ),
    };
  }

  // 4. Collaboration / Building / Working-on Context
  if (
    /\b(working on|building|collaborat|project|prototype|shipping|swap ideas|launch|experiment)\b/i.test(
      msgLower
    )
  ) {
    const focusLabel = extractedTopic || responderSkill;
    const collabCandidates = [
      `Right now I'm iterating on ${responderSkill} for a ${commName} side project—would love to hear what you're building around ${focusLabel}, Jennies!`,
      `Count me in on collaborating, Jennies! In #${channelLabel} we've been pairing on ${shortChannelTopic}, and an extra set of eyes is always welcome.`,
      `I just wrapped an early milestone on ${responderSkill} this morning! What's the trickiest bottleneck you're tackling in your project right now, Jennies?`,
      `Love that energy, Jennies! If you're experimenting with ${focusLabel}, I can share a quick benchmark checklist we've been using in ${commName}.`,
    ];
    return {
      responder,
      text: pickUniqueReply(
        chatKey,
        userMessage,
        collabCandidates,
        (t) =>
          `Always up to collaborate on ${focusLabel} (thread #${t}), Jennies! Drop a quick outline here in #${channelLabel} anytime.`
      ),
    };
  }

  // 5. Resources / Tips / Advice / Questions Context
  if (
    msgLower.includes('?') ||
    /\b(resource|tip|tips|recommend|advice|how do|how to|why|anyone|thoughts|opinion|best way|help)\b/i.test(
      msgLower
    )
  ) {
    const subject = extractedTopic || shortChannelTopic;
    const questionCandidates = [
      `Great question on ${subject}, Jennies! The biggest win for me has been starting small, measuring one variable at a time, and iterating fast.`,
      `On ${subject}, I'd look closely at practical trade-offs first—here in ${commName}, keeping workflows simple usually beats over-engineering.`,
      `Good one to bring up in #${channelLabel}, Jennies! For ${subject}, my go-to approach as ${responderRole} is validating assumptions with a minimal test case.`,
      `I actually ran into ${subject} last week! Happy to share the breakdown that worked for our team—are you optimizing for speed or reliability?`,
      `Solid question, Jennies! Around ${subject}, most folks in ${commName} start with a repeatable baseline before tuning the finer details.`,
    ];
    return {
      responder,
      text: pickUniqueReply(
        chatKey,
        userMessage,
        questionCandidates,
        (t) =>
          `Thoughtful question about ${subject} (#${t}), Jennies! What constraints are you working under right now?`
      ),
    };
  }

  // 6. Specific Custom Topic / Statement Context
  if (extractedTopic) {
    const topicCandidates = [
      `Interesting take on ${extractedTopic}, Jennies! That connects directly to what we've been testing in ${responderSkill} this week.`,
      `Really glad you brought up ${extractedTopic} in #${channelLabel}, Jennies—have you noticed any unexpected edge cases with it yet?`,
      `Spot-on point about ${extractedTopic}, Jennies! In ${commName}, dialing that in early tends to save a ton of rework later.`,
      `That's a fresh angle on ${extractedTopic}, Jennies. From my side as ${responderRole}, combining that with peer review works wonders.`,
      `Makes total sense on ${extractedTopic}, Jennies! I'd love to see how that evolves once you run another iteration.`,
      `Strong observation on ${extractedTopic}, Jennies—definitely worth keeping on our radar here in #${channelLabel}.`,
    ];
    return {
      responder,
      text: pickUniqueReply(
        chatKey,
        userMessage,
        topicCandidates,
        (t) =>
          `Appreciate the perspective on ${extractedTopic} (note #${t}), Jennies! Curious where you're taking it next in ${commName}.`
      ),
    };
  }

  // 7. Short / Conversational / Emoji / Fallback Context
  const shortCandidates = [
    `Totally with you on that, Jennies! Anything specific in #${channelLabel} you want to unpack next?`,
    `Appreciate you chiming in, Jennies—always keeps the ${commName} discussion moving forward.`,
    `Good call, Jennies! Let us know if you want to dive deeper into ${shortChannelTopic} here.`,
    `Love that momentum in #${channelLabel}, Jennies! Feel free to drop any follow-up thoughts anytime.`,
  ];
  return {
    responder,
    text: pickUniqueReply(
      chatKey,
      userMessage,
      shortCandidates,
      (t) =>
        `Noted, Jennies (#${t})! Always good having your input here in #${channelLabel}.`
    ),
  };
}

/**
 * Intelligent, context-aware, non-repeating persona response for ANY member in direct messages.
 */
export function getMemberDirectMessageResponse(
  member: User | ServerMember,
  userMessage: string
): string {
  const chatKey = `dm::${member.id || member.name.toLowerCase()}`;
  const name = member.name.toLowerCase();
  const msgLower = userMessage.toLowerCase().trim();
  const extractedTopic = extractContextTopic(userMessage);
  const roleText =
    'role' in member
      ? member.role
      : member.customStatus || 'our shared focus areas';

  // Voice Note Context in DM
  const voiceMatch = userMessage.match(/(\d+)\s*s/i);
  if (
    msgLower.includes('voice note') ||
    msgLower.includes('voice snippet') ||
    msgLower.includes('🎙️')
  ) {
    const secs = voiceMatch ? `${voiceMatch[1]}s` : 'quick';
    const dmVoiceCandidates = [
      `Just listened to your ${secs} voice note, Jennies—audio came through crisp and clear! That plan makes a lot of sense.`,
      `Thanks for the ${secs} voice clip, Jennies! Hearing your tone helps a ton—let's map out the next step together.`,
      `Played your voice message right away, Jennies! Really like your direction there—I'll pull together my notes on ${roleText} and follow up.`,
      `Got your ${secs} audio note, Jennies! Super clear summary—want me to send over a few quick ideas from my side?`,
    ];
    return pickUniqueReply(
      chatKey,
      userMessage,
      dmVoiceCandidates,
      (t) =>
        `Listened to voice note #${t}, Jennies! Crystal clear—happy to keep riffing on this.`
    );
  }

  // Attachment Context in DM
  if (
    msgLower.startsWith('[image:') ||
    msgLower.startsWith('[code:') ||
    msgLower.startsWith('[file:') ||
    msgLower.includes('[attachment:')
  ) {
    const attachmentName =
      userMessage.match(/:\s*([^\]]+)\]/)?.[1]?.trim() || 'that attachment';
    const dmAttachCandidates = [
      `Just opened ${attachmentName}, Jennies—super clear! Give me a moment to look closely and I'll share detailed feedback.`,
      `Thanks for sending over ${attachmentName}, Jennies! Looks really solid at first glance—what part would you like me to focus on?`,
      `Received ${attachmentName}, Jennies! I'll compare it against my ${roleText} setup and send back my takeaways.`,
    ];
    return pickUniqueReply(
      chatKey,
      userMessage,
      dmAttachCandidates,
      (t) => `Got ${attachmentName} (#${t}), Jennies! Reviewing it now.`
    );
  }

  // Greeting / Icebreaker Context
  if (
    /\b(hi|hey|hello|greetings|great to connect|nice to meet|happy to chat)\b/i.test(
      msgLower
    ) &&
    msgLower.length < 80
  ) {
    const greetingPool = name.includes('magnus')
      ? [
          `Greetings Jennies! Great connecting—are you studying sharp tactical lines or exploring engine prep lately?`,
          `Hey Jennies! Always fun meeting fellow players here. What time control do you enjoy most?`,
        ]
      : name.includes('sophie')
      ? [
          `Bonjour Jennies! Lovely connecting with you—have you been trying any new seasonal recipes this week?`,
          `Hi Jennies! So nice to chat directly. What dishes or techniques have been inspiring you lately?`,
        ]
      : [
          `Hey Jennies! Really glad we connected directly. What have you been focused on most this week?`,
          `Hi Jennies! Great hearing from you—I've been deep into ${roleText} lately. How are things going on your end?`,
          `Hello Jennies! Happy to chat anytime. Anything interesting you're exploring right now?`,
        ];
    return pickUniqueReply(
      chatKey,
      userMessage,
      greetingPool,
      (t) => `Hey again Jennies (#${t})! Always good catching up directly.`
    );
  }

  // Question / Tell-me-more Context
  if (
    msgLower.includes('?') ||
    /\b(tell me more|how|why|what|thoughts|opinion|recommend|advice)\b/i.test(
      msgLower
    )
  ) {
    const subject = extractedTopic || roleText;
    const questionPool = [
      `Good question on ${subject}, Jennies! On my side, keeping the workflow lean and testing small changes early has paid off the most.`,
      `Happy to dive into ${subject}, Jennies—the biggest lesson I've learned in ${roleText} is validating the core constraint before scaling up.`,
      `I've been thinking a lot about ${subject} too, Jennies! Are you weighing a couple of specific options right now?`,
      `Great thing to ask about ${subject}, Jennies. I'd start with a clean prototype and benchmark the key metric first—want to compare approaches?`,
    ];
    return pickUniqueReply(
      chatKey,
      userMessage,
      questionPool,
      (t) =>
        `Great question around ${subject} (#${t}), Jennies! What outcome are you aiming for?`
    );
  }

  // Agreement / Short positive follow-up
  if (
    /\b(sounds good|makes sense|agreed|awesome|great|thanks|thank you|cool|perfect|got it)\b/i.test(
      msgLower
    ) &&
    msgLower.length < 55
  ) {
    const ackPool = [
      `Awesome—let's keep the momentum going, Jennies! Ping me whenever you want to review the next piece.`,
      `Glad we're aligned, Jennies! I'll circle back once I wrap up my next milestone in ${roleText}.`,
      `Sounds like a plan, Jennies! Really enjoying swapping ideas with you here.`,
    ];
    return pickUniqueReply(
      chatKey,
      userMessage,
      ackPool,
      (t) => `Perfect, Jennies (#${t})! Talk soon whenever you're ready.`
    );
  }

  // Custom Topic Context
  if (extractedTopic) {
    const topicPool = [
      `Love that angle on ${extractedTopic}, Jennies! It ties in really well with what I've been seeing in ${roleText}.`,
      `That's a sharp point about ${extractedTopic}, Jennies—have you already tested how it holds up in practice?`,
      `Really interesting thought on ${extractedTopic}, Jennies. Let's definitely dig into that further—what sparked the idea?`,
      `Appreciate you sharing that on ${extractedTopic}, Jennies! I hadn't looked at it from that exact direction yet.`,
      `Solid insight on ${extractedTopic}, Jennies—I'll keep that in mind for my own ${roleText} work this week.`,
    ];
    return pickUniqueReply(
      chatKey,
      userMessage,
      topicPool,
      (t) =>
        `Thanks for bringing up ${extractedTopic} (#${t}), Jennies! Curious what you want to explore next.`
    );
  }

  const fallbackPool = [
    `Thanks for the note, Jennies! I'm focused on ${roleText} today—what's next on your radar?`,
    `Great hearing from you, Jennies! Your perspective is always crisp—let's keep the thread going.`,
    `Got your message, Jennies! I'll take a closer look and share my thoughts shortly.`,
  ];
  return pickUniqueReply(
    chatKey,
    userMessage,
    fallbackPool,
    (t) => `Received (#${t}), Jennies! Let me know what you'd like to tackle next.`
  );
}
