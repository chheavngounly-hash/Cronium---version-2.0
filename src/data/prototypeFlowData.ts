export type PrototypeFlowGroup = 'home' | 'servers' | 'feed' | 'profile';

export type ScreenKind = 'primary-tab' | 'sub-screen' | 'modal-sheet' | 'overlay';

export interface PrototypeScreenNode {
  id: string;
  code: string;
  title: string;
  flow: PrototypeFlowGroup;
  kind: ScreenKind;
  componentName: string;
  dimensions: string;
  cornerRadius: string;
  zIndex: string;
  targetTab: 'home' | 'servers' | 'feed' | 'profile';
  x: number;
  y: number;
  summary: string;
  interactionNotes: string[];
  acceptanceCriteria: string[];
  previewVariant:
    | 'home-onboarding'
    | 'home-loop'
    | 'home-slots'
    | 'home-history'
    | 'matched-servers'
    | 'servers-hub'
    | 'server-chat'
    | 'server-members'
    | 'quick-dm'
    | 'dm-chat'
    | 'call-e2ee'
    | 'feed-stream'
    | 'create-post'
    | 'post-comments'
    | 'hashtag-brand'
    | 'hashtag-broad'
    | 'events-list'
    | 'profile-own'
    | 'profile-edit'
    | 'profile-network'
    | 'profile-member'
    | 'profile-settings';
}

export interface PrototypeEdge {
  id: string;
  from: string;
  to: string;
  trigger: string;
  transition: string;
  condition?: string;
}

export interface FlowLaneMeta {
  id: PrototypeFlowGroup;
  index: string;
  title: string;
  subtitle: string;
  yStart: number;
  accentHex: string;
}

export const CARD_WIDTH = 224;
export const CARD_HEIGHT = 336;

export const FLOW_LANES: FlowLaneMeta[] = [
  {
    id: 'home',
    index: '01',
    title: 'Home & AI Matchmaker',
    subtitle: '3-step prompt onboarding, continuous loop gate, slots & prompt history',
    yStart: 64,
    accentHex: '#6C3BF5',
  },
  {
    id: 'servers',
    index: '02',
    title: 'Servers, Channels, Members & DMs',
    subtitle: 'Server hub, real-time channel chat, 18-member directory, quick DM & E2EE calls',
    yStart: 492,
    accentHex: '#4F46E5',
  },
  {
    id: 'feed',
    index: '03',
    title: 'Social Feed, Topics & Events',
    subtitle: 'Feed stream, post composer, z-70 comments, brand/broad hashtag pages & events',
    yStart: 920,
    accentHex: '#0EA5E9',
  },
  {
    id: 'profile',
    index: '04',
    title: 'Profile, Credentials & Member View',
    subtitle: 'Jennies Vance profile, inline/modal edit, network sheet & 2/3-banner member profiles',
    yStart: 1348,
    accentHex: '#059669',
  },
];

export const PROTOTYPE_SCREENS: PrototypeScreenNode[] = [
  // ======================== FLOW 01: HOME & AI MATCHMAKER ========================
  {
    id: 'home-onboarding',
    code: 'A-01',
    title: 'Home · 3-Step Prompt',
    flow: 'home',
    kind: 'primary-tab',
    componentName: 'HomeScreen.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'home',
    x: 56,
    y: 120,
    summary:
      'Entry screen featuring tracked uppercase eyebrow, extra-bold hero greeting ("Welcome jennies, to Cronium"), curved step progress bar, and prompt composer across 3 onboarding steps.',
    interactionNotes: [
      'Eyebrow uses Plus Jakarta Sans 11px uppercase (tracking 0.09em).',
      'Step 1 (Topics) -> Step 2 (Offline & Fun) -> Step 3 (Right Now) before unlocking full community matches.',
      'Clicking 0/2 Slots pill opens Earn Slots / Gamification directly without requiring an arrow tap.',
    ],
    acceptanceCriteria: [
      'Preserves exact phrase "Welcome jennies, to Cronium" at font-extrabold.',
      'Shows CurvedProgressBar only while hasPrompted is false.',
    ],
    previewVariant: 'home-onboarding',
  },
  {
    id: 'home-loop',
    code: 'A-02',
    title: 'Home · Continuous Loop',
    flow: 'home',
    kind: 'primary-tab',
    componentName: 'HomeScreen.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'home',
    x: 360,
    y: 120,
    summary:
      'Post-onboarding Home view with the unified 3-stage segmented pill switcher (1 · Topics, 2 · Offline & Fun, 3 · Right Now) with leading icons and green checkmarks per completed stage.',
    interactionNotes: [
      'Submitting 1 or 2 prompts advances to the next incomplete stage and keeps the user on Home.',
      'Only submitting all 3 stages triggers transition to Matched Servers.',
    ],
    acceptanceCriteria: [
      'Icons remain in front of 1 · Topics, 2 · Offline & Fun, and 3 · Right Now.',
      'Proportional flex widths prevent truncation across 390px–432px viewports.',
    ],
    previewVariant: 'home-loop',
  },
  {
    id: 'matched-servers',
    code: 'A-03',
    title: 'Matched Servers Result',
    flow: 'home',
    kind: 'sub-screen',
    componentName: 'HomeScreen.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'home',
    x: 664,
    y: 120,
    summary:
      'AI-curated server match cards generated after all three prompts are submitted, showing match confidence, topic tags, active member counts, and Join/Open actions.',
    interactionNotes: [
      'Respects user slot quota (2 slots on Free plan, expandable via gamification or upgrade).',
      'Joining a server adds it immediately to Tab 2 (Servers & DMs).',
    ],
    acceptanceCriteria: [
      'Never renders duplicate server cards for the same prompt batch.',
      'Back button returns cleanly to Home continuous loop.',
    ],
    previewVariant: 'matched-servers',
  },
  {
    id: 'home-slots',
    code: 'A-04',
    title: 'Slots & Gamification',
    flow: 'home',
    kind: 'modal-sheet',
    componentName: 'GamificationDashboard.tsx',
    dimensions: '432 × 740',
    cornerRadius: '28px',
    zIndex: 'z-50',
    targetTab: 'home',
    x: 968,
    y: 120,
    summary:
      'Direct destination when tapping the "0/2 Slots +" pill in the Home header. Displays slot progress, community quests, and plan upgrade options.',
    interactionNotes: [
      'Opens directly on Free plan; opens PremiumUnlockModal on Plus/Pro plans.',
      'Esc key or backdrop tap closes modal cleanly.',
    ],
    acceptanceCriteria: [
      'Slot count stays synced with joined communities in real time.',
    ],
    previewVariant: 'home-slots',
  },
  {
    id: 'home-history',
    code: 'A-05',
    title: 'Prompt History Modal',
    flow: 'home',
    kind: 'modal-sheet',
    componentName: 'PromptHistoryModal.tsx',
    dimensions: '432 × 740',
    cornerRadius: '28px',
    zIndex: 'z-50',
    targetTab: 'home',
    x: 1272,
    y: 120,
    summary:
      'Chronological log of previous 3-prompt batches and the servers matched from each session, allowing instant re-entry or server joining.',
    interactionNotes: [
      'Triggered from the "History" pill inside the post-prompt Home card.',
    ],
    acceptanceCriteria: [
      'Every saved prompt run lists its associated Topics, Offline & Fun, and Right Now answers.',
    ],
    previewVariant: 'home-history',
  },

  // ======================== FLOW 02: SERVERS, CHANNELS, MEMBERS & DMS ========================
  {
    id: 'servers-hub',
    code: 'B-01',
    title: 'Servers & DMs Hub',
    flow: 'servers',
    kind: 'primary-tab',
    componentName: 'ServersScreen.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'servers',
    x: 56,
    y: 548,
    summary:
      'Unified messaging inbox showing joined AI-matched servers with unread counters alongside encrypted direct message threads and online presence.',
    interactionNotes: [
      'Tab state and scroll offset persist when switching across the 4 bottom tabs.',
      'Tapping a server opens ServerView; tapping a DM thread opens ChatView.',
    ],
    acceptanceCriteria: [
      'No subscription promotional bar pinned at the bottom.',
    ],
    previewVariant: 'servers-hub',
  },
  {
    id: 'server-chat',
    code: 'B-02',
    title: 'Server · Channel Chat',
    flow: 'servers',
    kind: 'sub-screen',
    componentName: 'ServerView.tsx / ChatView.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'servers',
    x: 360,
    y: 548,
    summary:
      'Domain-authentic multi-channel server chat (#general, #showcase, #resources) supporting replies, attachments, voice notes, and single-emoji user reactions.',
    interactionNotes: [
      'Top segmented switcher toggles between Chat and Members.',
      'Single-emoji constraint: each user can hold at most 1 active emoji per message (picking a new one swaps the previous).',
      'Clicking any sender avatar/name opens MemberProfileModal.',
    ],
    acceptanceCriteria: [
      '1-emoji-per-user rule enforced on every message bubble.',
      'Channel switch preserves per-channel history.',
    ],
    previewVariant: 'server-chat',
  },
  {
    id: 'server-members',
    code: 'B-03',
    title: 'Server · Members Directory',
    flow: 'servers',
    kind: 'sub-screen',
    componentName: 'ServerView.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'servers',
    x: 664,
    y: 548,
    summary:
      'Searchable, filterable roster of 18 unique verified members per server showing unique portrait, name, role, company, location, shared interests, skills, Follow, and Message CTAs.',
    interactionNotes: [
      'Tapping any member card passes exact directory avatar, name, role, company, bio, and skills to MemberProfileModal.',
      'Tapping "Message" opens the Quick Direct Message bottom sheet.',
    ],
    acceptanceCriteria: [
      'Zero duplicate names across all 64 domain + expanded member templates.',
      'Zero duplicate cover backgrounds across the 87-image registry.',
    ],
    previewVariant: 'server-members',
  },
  {
    id: 'quick-dm',
    code: 'B-04',
    title: 'Quick Direct Message Sheet',
    flow: 'servers',
    kind: 'modal-sheet',
    componentName: 'ServerView.tsx',
    dimensions: '432 × 360',
    cornerRadius: '28px top',
    zIndex: 'z-50',
    targetTab: 'servers',
    x: 968,
    y: 548,
    summary:
      'Slide-up bottom sheet triggered from a member card "Message" CTA with contextual one-tap icebreaker pill based on the member’s top skill.',
    interactionNotes: [
      'Submitting sends the initial encrypted message and navigates directly to the DM ChatView.',
    ],
    acceptanceCriteria: [
      'Auto-focuses composer textarea on open; Cancel or backdrop tap dismisses.',
    ],
    previewVariant: 'quick-dm',
  },
  {
    id: 'dm-chat',
    code: 'B-05',
    title: 'Direct Message Thread',
    flow: 'servers',
    kind: 'sub-screen',
    componentName: 'ChatView.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'servers',
    x: 1272,
    y: 548,
    summary:
      'End-to-end encrypted 1:1 conversation view with voice note playback, reply quoting, single-emoji reactions, audio/video call trigger, and safety number verification.',
    interactionNotes: [
      'Enforces the same 1-emoji-per-user rule as server channels.',
      'Header avatar tap opens MemberProfileModal.',
    ],
    acceptanceCriteria: [
      'Consistent timestamps and persisted session messages when returning to inbox.',
    ],
    previewVariant: 'dm-chat',
  },
  {
    id: 'call-e2ee',
    code: 'B-06',
    title: 'Call & E2EE Safety Verify',
    flow: 'servers',
    kind: 'overlay',
    componentName: 'CallModal.tsx / E2EEVerificationModal.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px',
    zIndex: 'z-50',
    targetTab: 'servers',
    x: 1576,
    y: 548,
    summary:
      'Encrypted voice/video call interface and cryptographic 60-digit safety number comparison screen with QR scan verification.',
    interactionNotes: [
      'Accessible from any DM or Server header.',
    ],
    acceptanceCriteria: [
      'Mute, camera, speaker, and hang-up states respond immediately.',
    ],
    previewVariant: 'call-e2ee',
  },

  // ======================== FLOW 03: SOCIAL FEED, TOPICS & EVENTS ========================
  {
    id: 'feed-stream',
    code: 'C-01',
    title: 'Social Feed Stream',
    flow: 'feed',
    kind: 'primary-tab',
    componentName: 'SocialFeedScreen.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'feed',
    x: 56,
    y: 976,
    summary:
      'Professional network feed with distinct per-author imagery/video, LinkedIn-style clickable #hashtags, reactions, comment counts, reposts, and Events entry.',
    interactionNotes: [
      'Clicking any #hashtag opens HashtagPageView (z-60) in iPhone 15 modal dimensions.',
      'Clicking Comments opens PostCommentsModal (z-70) in matching iPhone 15 dimensions.',
      'Clicking author avatar/name opens UserProfileModal (432×804).',
    ],
    acceptanceCriteria: [
      'Every individual author’s posts feature distinct, non-overlapping images/videos.',
    ],
    previewVariant: 'feed-stream',
  },
  {
    id: 'create-post',
    code: 'C-02',
    title: 'Create Post Composer',
    flow: 'feed',
    kind: 'modal-sheet',
    componentName: 'CreatePostModal.tsx',
    dimensions: '432 × 680',
    cornerRadius: '28px',
    zIndex: 'z-50',
    targetTab: 'feed',
    x: 360,
    y: 976,
    summary:
      'Rich post creation modal supporting community selection, pre-filled #hashtags (when launched from a Topic/Brand page), and image/video media attachments.',
    interactionNotes: [
      'Launching from a Brand or Topic page pre-populates that page’s hashtag automatically.',
    ],
    acceptanceCriteria: [
      'Published post immediately prepends to the live Feed and matching Hashtag page.',
    ],
    previewVariant: 'create-post',
  },
  {
    id: 'post-comments',
    code: 'C-03',
    title: 'Post Comments Modal',
    flow: 'feed',
    kind: 'modal-sheet',
    componentName: 'PostCommentsModal.tsx',
    dimensions: '440–465 × 820',
    cornerRadius: '28px / 32px',
    zIndex: 'z-[70]',
    targetTab: 'feed',
    x: 664,
    y: 976,
    summary:
      'iPhone 15 / Events-sized threaded comments & replies drawer that stacks cleanly above both Social Feed and Hashtag Page (z-70 > z-60).',
    interactionNotes: [
      'Clickable emoji reaction bar on every comment and nested reply.',
      'Strictly enforces max 1 emoji per user per comment/reply.',
    ],
    acceptanceCriteria: [
      'Matches exact Events modal footprint (max-w-[465px] h-[92vh] sm:max-h-[820px]).',
      'Dismissing Comments from inside a Hashtag Page never closes the Hashtag Page underneath.',
    ],
    previewVariant: 'post-comments',
  },
  {
    id: 'hashtag-brand',
    code: 'C-04',
    title: 'Brand / Org Topic Page',
    flow: 'feed',
    kind: 'modal-sheet',
    componentName: 'HashtagPageView.tsx',
    dimensions: '440–465 × 820',
    cornerRadius: '28px / 32px',
    zIndex: 'z-[60]',
    targetTab: 'feed',
    x: 968,
    y: 976,
    summary:
      'Dedicated branded organization interface for specific tags (#a16z, #YCombinator, #StanfordAI, #JAXA, etc.) with custom square logo tile, verified purple badge, location pill, stats, and 2-button Follow / Start a post row.',
    interactionNotes: [
      'Supports internal navigation history stack (Back arrow steps back across previously visited topics).',
      'Top / Recent post sorting + full FeedPostCard interactivity.',
    ],
    acceptanceCriteria: [
      'Matches Andreessen Horowitz / Y Combinator reference card layout.',
      'Dedicated backdrop prevents child modal clicks from bubbling.',
    ],
    previewVariant: 'hashtag-brand',
  },
  {
    id: 'hashtag-broad',
    code: 'C-05',
    title: 'Broad Topic + Relevant Pages',
    flow: 'feed',
    kind: 'modal-sheet',
    componentName: 'HashtagPageView.tsx',
    dimensions: '440–465 × 820',
    cornerRadius: '28px / 32px',
    zIndex: 'z-[60]',
    targetTab: 'feed',
    x: 1272,
    y: 976,
    summary:
      'Topic discovery view for broad tags (#VentureCapital, #Funding, #Startups, #Robotics) showcasing a Relevant Pages section of clickable brand cards above filtered topic posts.',
    interactionNotes: [
      'Tapping any Relevant Page pushes that organization’s branded view onto the navigation stack.',
    ],
    acceptanceCriteria: [
      'Always surfaces curated Relevant Pages + Related Topic chips + sorted posts.',
    ],
    previewVariant: 'hashtag-broad',
  },
  {
    id: 'events-list',
    code: 'C-06',
    title: 'Community Events & Details',
    flow: 'feed',
    kind: 'modal-sheet',
    componentName: 'CommunityEventsModal.tsx / EventDetailsModal.tsx',
    dimensions: '440–465 × 820',
    cornerRadius: '28px / 32px',
    zIndex: 'z-50',
    targetTab: 'feed',
    x: 1576,
    y: 976,
    summary:
      'Canonical iPhone 15 reference modal size hosting live/upcoming community events, RSVP toggles, speaker lineups, and full event detail sheets.',
    interactionNotes: [
      'Serves as the dimension benchmark matched by HashtagPageView and PostCommentsModal.',
    ],
    acceptanceCriteria: [
      'RSVP toggles update attendee counts and persist across modal close/reopen.',
    ],
    previewVariant: 'events-list',
  },

  // ======================== FLOW 04: PROFILE, CREDENTIALS & MEMBER VIEW ========================
  {
    id: 'profile-own',
    code: 'D-01',
    title: 'Own Profile (Jennies Vance)',
    flow: 'profile',
    kind: 'primary-tab',
    componentName: 'ProfileScreen.tsx',
    dimensions: '432 × 804',
    cornerRadius: '32px inner',
    zIndex: 'z-0',
    targetTab: 'profile',
    x: 56,
    y: 1404,
    summary:
      'Primary user profile with top Verified Profile pill, cover banner + Change Cover CTA, Edit & QR controls, single-row Cronium Infrastructure Core • Stanford AI Lab Alum, metrics bar, Identity & Credentials, Key Achievements, and Posts.',
    interactionNotes: [
      'Single-row organization bar reclaims right padding (-mr-3) so "Core" renders completely alongside "Stanford AI Lab Alum".',
      'Tapping Communities or Connections metric opens ProfileNetworkSheet.',
    ],
    acceptanceCriteria: [
      'QR button sits exclusively next to the top Edit button.',
      'Full "Cronium Infrastructure Core" visible with zero "C..." truncation.',
    ],
    previewVariant: 'profile-own',
  },
  {
    id: 'profile-edit',
    code: 'D-02',
    title: 'Edit Profile, Links & Honors',
    flow: 'profile',
    kind: 'modal-sheet',
    componentName: 'ProfileEditModals.tsx',
    dimensions: '432 × 760',
    cornerRadius: '28px',
    zIndex: 'z-50',
    targetTab: 'profile',
    x: 360,
    y: 1404,
    summary:
      'Inline profile editing plus dedicated modals for Social & Identity links, Key Achievements management, Cover Photo picker, and Public QR Code sharing.',
    interactionNotes: [
      'Cancel restores the pre-edit snapshot cleanly without mutating stored values.',
    ],
    acceptanceCriteria: [
      'Unified PencilLine edit icon used consistently across Profile sections.',
    ],
    previewVariant: 'profile-edit',
  },
  {
    id: 'profile-network',
    code: 'D-03',
    title: 'Communities & Connections',
    flow: 'profile',
    kind: 'modal-sheet',
    componentName: 'ProfileNetworkSheet.tsx',
    dimensions: '432 × 780',
    cornerRadius: '28px',
    zIndex: 'z-50',
    targetTab: 'profile',
    x: 664,
    y: 1404,
    summary:
      'Two-tab network directory listing joined communities and 1,480+ verified connections with instant Message buttons and privacy toggle.',
    interactionNotes: [
      'Bottom subscription promotional banner removed per product spec.',
    ],
    acceptanceCriteria: [
      'Clean bottom edge with zero subscription CTA bar.',
    ],
    previewVariant: 'profile-network',
  },
  {
    id: 'profile-member',
    code: 'D-04',
    title: 'Other Member Profile Modal',
    flow: 'profile',
    kind: 'modal-sheet',
    componentName: 'UserProfileModal.tsx / MemberProfileModal.tsx',
    dimensions: '432 × 804',
    cornerRadius: '28px / 32px',
    zIndex: 'z-50',
    targetTab: 'feed',
    x: 968,
    y: 1404,
    summary:
      'Exact Jennies-sized (432×804) profile modal opened from Feeds, Hashtags, Server Chat, and Members Directory. Features 2/3-height unique cover banner, back-only top-left arrow (no top-right X), Follow/Message CTAs, Briefcase/GraduationCap icons, Jennies-style Key Achievements, and Posts.',
    interactionNotes: [
      'No top-right close (X) icon anywhere on Feeds or Servers & DMs profiles.',
      'Preserves exact avatar, name, role, company, and bio from the Members card clicked.',
    ],
    acceptanceCriteria: [
      'Dimensions match Jennies Vance Profile screen 1:1 (432×804).',
      'Cover banner height set to 2/3 (76px–85px) with unique background per person.',
    ],
    previewVariant: 'profile-member',
  },
  {
    id: 'profile-settings',
    code: 'D-05',
    title: 'Security, Biometrics & Sync',
    flow: 'profile',
    kind: 'modal-sheet',
    componentName: 'BiometricModal.tsx / DeviceSyncModal.tsx',
    dimensions: '432 × 740',
    cornerRadius: '28px',
    zIndex: 'z-50',
    targetTab: 'profile',
    x: 1272,
    y: 1404,
    summary:
      'Settings menu launched from the top-right "···" icon on Jennies’s profile, housing Face ID / Touch ID biometric lock, cross-device sync status, sound toggles, and cache reset.',
    interactionNotes: [
      'Biometric lock secures the entire viewport until authenticated.',
    ],
    acceptanceCriteria: [
      'Theme toggle syncs Tailwind v4 .dark variant cleanly across all modals.',
    ],
    previewVariant: 'profile-settings',
  },
];

export const PROTOTYPE_EDGES: PrototypeEdge[] = [
  // Flow A edges
  {
    id: 'e-a1-a2',
    from: 'home-onboarding',
    to: 'home-loop',
    trigger: 'Complete 3 Steps',
    transition: 'Smart Animate · 200ms',
  },
  {
    id: 'e-a2-a3',
    from: 'home-loop',
    to: 'matched-servers',
    trigger: 'Submit All 3 Prompts',
    transition: 'Dissolve · 200ms',
    condition: 'Gate: Topics + Offline & Fun + Right Now required',
  },
  {
    id: 'e-a1-a4',
    from: 'home-onboarding',
    to: 'home-slots',
    trigger: 'Tap "0/2 Slots +"',
    transition: 'Zoom In · 180ms',
  },
  {
    id: 'e-a2-a5',
    from: 'home-loop',
    to: 'home-history',
    trigger: 'Tap "History"',
    transition: 'Zoom In · 180ms',
  },
  {
    id: 'e-a3-b1',
    from: 'matched-servers',
    to: 'servers-hub',
    trigger: 'Join / Open Server',
    transition: 'Tab Switch · Instant',
  },

  // Flow B edges
  {
    id: 'e-b1-b2',
    from: 'servers-hub',
    to: 'server-chat',
    trigger: 'Tap Server Card',
    transition: 'Push Left · 200ms',
  },
  {
    id: 'e-b2-b3',
    from: 'server-chat',
    to: 'server-members',
    trigger: 'Toggle "Members"',
    transition: 'Instant',
  },
  {
    id: 'e-b3-b4',
    from: 'server-members',
    to: 'quick-dm',
    trigger: 'Tap "Message"',
    transition: 'Move In Bottom · 200ms',
  },
  {
    id: 'e-b4-b5',
    from: 'quick-dm',
    to: 'dm-chat',
    trigger: 'Send Message',
    transition: 'Push Left · 200ms',
  },
  {
    id: 'e-b5-b6',
    from: 'dm-chat',
    to: 'call-e2ee',
    trigger: 'Tap Call / Shield',
    transition: 'Dissolve · 180ms',
  },
  {
    id: 'e-b3-d4',
    from: 'server-members',
    to: 'profile-member',
    trigger: 'Tap Member Card',
    transition: 'Zoom In · 200ms',
    condition: 'Passes exact directory avatar, role, company & bio',
  },

  // Flow C edges
  {
    id: 'e-c1-c2',
    from: 'feed-stream',
    to: 'create-post',
    trigger: 'Tap "Create Post"',
    transition: 'Move In Bottom · 200ms',
  },
  {
    id: 'e-c1-c3',
    from: 'feed-stream',
    to: 'post-comments',
    trigger: 'Tap Comment Icon',
    transition: 'Zoom In · 180ms (z-70)',
  },
  {
    id: 'e-c1-c4',
    from: 'feed-stream',
    to: 'hashtag-brand',
    trigger: 'Tap #a16z / #YC',
    transition: 'Zoom In · 180ms (z-60)',
  },
  {
    id: 'e-c5-c4',
    from: 'hashtag-broad',
    to: 'hashtag-brand',
    trigger: 'Tap Relevant Page',
    transition: 'Push Stack · 160ms',
  },
  {
    id: 'e-c4-c3',
    from: 'hashtag-brand',
    to: 'post-comments',
    trigger: 'Tap Post Comment',
    transition: 'Overlay z-70 > z-60',
  },
  {
    id: 'e-c1-c5',
    from: 'feed-stream',
    to: 'hashtag-broad',
    trigger: 'Tap #VentureCapital',
    transition: 'Zoom In · 180ms (z-60)',
  },
  {
    id: 'e-c1-c6',
    from: 'feed-stream',
    to: 'events-list',
    trigger: 'Tap "Events"',
    transition: 'Zoom In · 180ms',
  },
  {
    id: 'e-c1-d4',
    from: 'feed-stream',
    to: 'profile-member',
    trigger: 'Tap Author Avatar',
    transition: 'Zoom In · 200ms',
  },

  // Flow D edges
  {
    id: 'e-d1-d2',
    from: 'profile-own',
    to: 'profile-edit',
    trigger: 'Tap "Edit" / QR',
    transition: 'Zoom In · 180ms',
  },
  {
    id: 'e-d1-d3',
    from: 'profile-own',
    to: 'profile-network',
    trigger: 'Tap Connections',
    transition: 'Move In · 200ms',
  },
  {
    id: 'e-d1-d5',
    from: 'profile-own',
    to: 'profile-settings',
    trigger: 'Tap "···" Menu',
    transition: 'Move In · 200ms',
  },
  {
    id: 'e-d4-b5',
    from: 'profile-member',
    to: 'dm-chat',
    trigger: 'Tap "Message"',
    transition: 'Tab Switch + Open DM',
  },
];

export const DESIGN_TOKENS_PREVIEW = {
  colors: [
    { name: 'brand.primary', hex: '#6C3BF5', usage: 'Primary CTA, verified brand badges' },
    { name: 'brand.indigo', hex: '#4F46E5', usage: 'Active nav, links, secondary CTAs' },
    { name: 'brand.sky', hex: '#0EA5E9', usage: 'Hero gradient end' },
    { name: 'brand.ycOrange', hex: '#F26522', usage: 'Y Combinator brand tile' },
    { name: 'brand.a16zObsidian', hex: '#0F1117', usage: 'a16z brand tile' },
    { name: 'surface.canvas', hex: '#F5F8FF', usage: 'App viewport canvas' },
    { name: 'surface.card', hex: '#FFFFFF', usage: 'Primary cards & modals' },
    { name: 'text.primary', hex: '#0F172A', usage: 'Headlines & primary body' },
    { name: 'text.secondary', hex: '#475569', usage: 'Body copy & inactive tabs' },
    { name: 'semantic.verifiedText', hex: '#059669', usage: 'Verified badge & online status' },
  ],
  typography: [
    { token: 'eyebrow', font: 'Plus Jakarta Sans', size: '11px', weight: '600', tracking: '0.09em' },
    { token: 'heroGreeting', font: 'Plus Jakarta Sans', size: '24px', weight: '800', tracking: '-0.03em' },
    { token: 'sectionTitle', font: 'Plus Jakarta Sans', size: '18px', weight: '800', tracking: '-0.02em' },
    { token: 'cardTitle', font: 'Plus Jakarta Sans', size: '15px', weight: '700', tracking: '-0.01em' },
    { token: 'body', font: 'Plus Jakarta Sans', size: '13px', weight: '400', tracking: '0' },
    { token: 'meta', font: 'Plus Jakarta Sans', size: '12px', weight: '500', tracking: '0' },
  ],
  radii: [
    { token: 'deviceOuter', value: '40px' },
    { token: 'modal', value: '32px' },
    { token: 'cardLarge', value: '26px' },
    { token: 'card', value: '24px' },
    { token: 'banner', value: '16px' },
    { token: 'pill', value: '9999px' },
  ],
  zIndex: [
    { token: 'stickyHeader', value: '30' },
    { token: 'floatingToast', value: '40' },
    { token: 'profileAndEvents', value: '50' },
    { token: 'hashtagAndBrandPage', value: '60' },
    { token: 'postCommentsModal', value: '70' },
  ],
};
