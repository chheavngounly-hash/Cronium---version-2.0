import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getUserPosts } from '../data/userPostsData';
import { UserPostsSection } from './UserPostsSection';
import { UserPostsScreen } from './UserPostsScreen';
import { GamificationDashboard } from './GamificationDashboard';
import { gamificationService } from '../utils/gamificationService';
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  Moon,
  Sun,
  Laptop,
  Bell,
  Volume2,
  VolumeX,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  Trash2,
  Copy,
  Check,
  QrCode,
  Building2,
  Landmark,
  Mail,
  Key,
  Sparkles,
  PencilLine,
  ExternalLink,
  Smartphone,
  Tablet,
  X,
  Share2,
  Linkedin,
  Github,
  Trophy,
  Crown,
  Wand2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Eye,
  TrendingUp,
  GraduationCap,
  Zap,
  Plus,
} from 'lucide-react';
import profileCoverSkyscrapers from '../assets/images/profile_cover_skyscrapers_1795793589966.jpg';
import {
  CURRENT_USER,
  PLAN_CONFIGS,
  portraitAnnaSan,
  portraitMarcusVance,
  portraitAlexanderPatrick,
} from '../data/mockData';
import { UserPlan, Community, User } from '../types';
import { Post } from '../types/social';
import { PremiumUnlockModal } from './PremiumUnlockModal';
import { BrandLevelModal } from './BrandLevelModal';
import { calculateBrandLevel, BrandLevelStatus } from '../utils/brandLevel';
import { biometricsService } from '../services/biometrics';
import { notificationService } from '../services/notifications';
import { syncService } from '../services/sync';
import {
  EditIdentityModal,
  EditAchievementsModal,
  SocialProfileLink,
  AchievementItem,
  AchievementMetrics,
  ProfileMetricsOverride,
  SocialPlatformIcon,
  getPlatformMeta,
  normalizeExternalHref,
  formatDisplayUrl,
} from './ProfileEditModals';
import { ProfileNetworkSheet } from './ProfileNetworkSheet';
import { getProfileBadgeStyle } from '../utils/profileBadge';
import { ProfileQrModal } from './ProfileQrModal';

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach_1',
    icon: '🏆',
    title: 'Systems Architect of the Year',
    organization: 'Autonomous Mesh Computing Initiative & IEEE',
    year: '2025',
    badge: 'Global Award',
    description: 'Awarded for pioneering zero-knowledge peer mesh routing supporting 10M+ concurrent nodes with sub-50ms cryptographic latency.',
  },
  {
    id: 'ach_2',
    icon: '📜',
    title: '12 Published International Patents',
    organization: 'USPTO & WIPO International Registries',
    year: '2021 – 2025',
    badge: 'Core IP',
    description: 'Lead inventor on hardware-enclave biometric handshakes, edge-inferencing neural meshes, and ratcheted forward-secret keychains.',
  },
  {
    id: 'ach_3',
    icon: '🚀',
    title: '10M+ Daily Active Users Milestone',
    organization: 'Cronium Infrastructure Core',
    year: '2025',
    badge: 'Scale',
    description: 'Designed and deployed the global mesh synchronization pipeline across 140 countries with 99.999% SLA reliability.',
  },
  {
    id: 'ach_4',
    icon: '🎓',
    title: 'NeurIPS Best Paper Contributor',
    organization: 'Neural Information Processing Systems',
    year: '2024',
    badge: 'Research',
    description: 'Co-authored foundational research on "Privacy-Preserving On-Device Latent Diffusion Models for Edge Robotics".',
  },
  {
    id: 'ach_5',
    icon: '🌐',
    title: 'Open Source Ecosystem Champion',
    organization: 'Open Cryptography & WebAssembly Foundations',
    year: '2023 – 2025',
    badge: '45K★ Stars',
    description: 'Creator and core maintainer of open WebAssembly cryptographic primitives and high-throughput audio stream codecs.',
  },
];

export const CURATED_COVER_BACKGROUNDS = [
  {
    id: 'glass_tower',
    name: 'Skyscraper Architectural Facade',
    tag: 'Executive Corporate',
    url: profileCoverSkyscrapers,
  },
  {
    id: 'tech_campus',
    name: 'Modern Glass Headquarters',
    tag: 'Silicon Valley Campus',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'datacenter',
    name: 'Neural Datacenter Corridor',
    tag: 'Cloud Infrastructure',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'alpine',
    name: 'Alpine Executive Summit',
    tag: 'Mountain Horizon',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
  },
  {
    id: 'architectural',
    name: 'Minimalist Design Studio',
    tag: 'Creative Loft',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
  },
];

// Clear any legacy persisted profile edits so refreshes/updates always revert cleanly to defaults
const LEGACY_PROFILE_EDIT_STORAGE_KEYS = [
  'cronium_profile_identity_v1',
  'cronium_profile_achievements_v1',
  'cronium_profile_ach_metrics_v1',
  'cronium_profile_metrics_override_v1',
  'cronium_profile_cover',
  'cronium_deleted_profile_post_ids_v1',
  'cronium_profile_privacy_v1',
];

try {
  LEGACY_PROFILE_EDIT_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
} catch {
  // ignore storage errors
}

// Session-only in-memory profile state (persists across tab switches during a session,
// but NEVER saved across page refreshes or platform updates)
const DEFAULT_WORK_EMAIL = 'jennies.vance@cronium.network';
const DEFAULT_LINKEDIN_URL = 'linkedin.com/in/jennies-vance';
const DEFAULT_GITHUB_URL = 'github.com/jennies-vance';
const DEFAULT_ORGANIZATION = 'Cronium Infrastructure Core • Stanford AI Lab Alum';
const DEFAULT_ACHIEVEMENT_METRICS: AchievementMetrics = {
  honors: '1st',
  patents: '14',
  contributor: 'Top 0.1%',
};

const sessionProfileStore: {
  coverUrl: string;
  userName: string;
  userTitle: string;
  userBio: string;
  userOrganization: string;
  workEmail: string;
  linkedinUrl: string;
  githubUrl: string;
  socialLinks: SocialProfileLink[];
  achievements: AchievementItem[];
  achievementMetrics: AchievementMetrics;
  profileMetricsOverride: ProfileMetricsOverride;
  deletedPostIds: Set<string>;
} = {
  coverUrl: CURATED_COVER_BACKGROUNDS[0].url,
  userName: CURRENT_USER.name,
  userTitle: CURRENT_USER.customStatus || '',
  userBio: CURRENT_USER.bio || '',
  userOrganization: DEFAULT_ORGANIZATION,
  workEmail: DEFAULT_WORK_EMAIL,
  linkedinUrl: DEFAULT_LINKEDIN_URL,
  githubUrl: DEFAULT_GITHUB_URL,
  socialLinks: [],
  achievements: INITIAL_ACHIEVEMENTS,
  achievementMetrics: DEFAULT_ACHIEVEMENT_METRICS,
  profileMetricsOverride: {},
  deletedPostIds: new Set<string>(),
};

interface ProfileScreenProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLockApp: () => void;
  onOpenDeviceSync: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onTriggerTestPush: () => void;
  userPlan?: UserPlan;
  onUnlockPlan?: (plan: UserPlan) => void;
  communities?: Community[];
  connectedUserIds?: string[];
  onStartDirectChatWithUser?: (user: User) => void;
  onNavigateToFeed?: () => void;
  onNavigateToServers?: () => void;
  onBack?: () => void;
  bottomNav?: React.ReactNode;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  darkMode,
  onToggleDarkMode,
  onLockApp,
  onOpenDeviceSync,
  isOfflineMode,
  onToggleOfflineMode,
  onTriggerTestPush,
  userPlan = 'free',
  onUnlockPlan,
  communities,
  connectedUserIds,
  onStartDirectChatWithUser,
  onNavigateToFeed,
  onNavigateToServers,
  onBack,
  bottomNav,
}) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(biometricsService.isEnabled());
  const [soundEnabled, setSoundEnabled] = useState(notificationService.isSoundEnabled());
  const [cacheCleared, setCacheCleared] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [planModalTargetTab, setPlanModalTargetTab] = useState<'free' | 'plus' | 'pro'>('plus');
  const [showImpressionsModal, setShowImpressionsModal] = useState(false);
  const [visibilityRange, setVisibilityRange] = useState<'7d' | '30d'>('30d');
  const [visibilityMultiplier, setVisibilityMultiplier] = useState<'1x' | '3.4x' | '5x'>('1x');
  const [connectedViewerIds, setConnectedViewerIds] = useState<Set<string>>(() => new Set());
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);
  const [metricToast, setMetricToast] = useState<string | null>(null);
  const [networkSheetTab, setNetworkSheetTab] = useState<'communities' | 'connections' | null>(null);
  const achievementsSectionRef = useRef<HTMLDivElement>(null);
  const [showAllPostsScreen, setShowAllPostsScreen] = useState(false);
  const [targetPostId, setTargetPostId] = useState<string | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<
    'security' | 'devices' | 'vault' | 'notifications' | 'appearance' | null
  >(null);
  const [dmAlertsEnabled, setDmAlertsEnabled] = useState(true);
  const [communityAlertsEnabled, setCommunityAlertsEnabled] = useState(true);
  const [connectionAlertsEnabled, setConnectionAlertsEnabled] = useState(true);

  const [jenniesPosts, setJenniesPosts] = useState<Post[]>(() => {
    const basePosts = getUserPosts(
      CURRENT_USER.id,
      CURRENT_USER.name,
      CURRENT_USER.avatar,
      CURRENT_USER.customStatus
    );
    return basePosts.filter((p) => !sessionProfileStore.deletedPostIds.has(p.id));
  });

  const handleDeleteJenniesPost = (postId: string) => {
    sessionProfileStore.deletedPostIds.add(postId);
    setJenniesPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleRepostJenniesPost = (post: Post, _thoughts: string) => {
    setJenniesPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, sharesCount: (p.sharesCount || 78) + 1 } : p
      )
    );
    notificationService.playSentChime();
  };

  useEffect(() => {
    if (!metricToast) return;
    const t = setTimeout(() => setMetricToast(null), 3000);
    return () => clearTimeout(t);
  }, [metricToast]);

  // Professional Cover Background state (session-only; resets on refresh/update)
  const [coverUrl, setCoverUrl] = useState<string>(() => sessionProfileStore.coverUrl);
  const [showCoverModal, setShowCoverModal] = useState(false);

  // Dynamic Brand Level Status state (Mobile Legends-inspired tier structure)
  const [showBrandLevelModal, setShowBrandLevelModal] = useState(false);
  const [brandStatusVersion, setBrandStatusVersion] = useState(0);

  // Editable Profile, Identity, Metrics & Achievements state (session-only; NOT saved on refresh/update)
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editBioText, setEditBioText] = useState('');
  const [editInstitutionPrimary, setEditInstitutionPrimary] = useState('');
  const [editInstitutionSecondary, setEditInstitutionSecondary] = useState('');
  const [showEditIdentityModal, setShowEditIdentityModal] = useState(false);
  const [showEditAchievementsModal, setShowEditAchievementsModal] = useState(false);
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [profileMetricsOverride, setProfileMetricsOverride] = useState<ProfileMetricsOverride>(
    () => sessionProfileStore.profileMetricsOverride
  );

  const [userName, setUserName] = useState(() => sessionProfileStore.userName);
  const [userTitle, setUserTitle] = useState(() => sessionProfileStore.userTitle);
  const [userBio, setUserBio] = useState(() => sessionProfileStore.userBio);
  const [userOrganization, setUserOrganization] = useState(
    () => sessionProfileStore.userOrganization
  );

  const [workEmail, setWorkEmail] = useState<string>(() => sessionProfileStore.workEmail);
  const [linkedinUrl, setLinkedinUrl] = useState<string>(() => sessionProfileStore.linkedinUrl);
  const [githubUrl, setGithubUrl] = useState<string>(() => sessionProfileStore.githubUrl);
  const [socialLinks, setSocialLinks] = useState<SocialProfileLink[]>(
    () => sessionProfileStore.socialLinks
  );

  const countProfileSocialLinks = (
    linkedin: string = linkedinUrl,
    github: string = githubUrl,
    extraLinks: SocialProfileLink[] = socialLinks
  ): number => {
    let count = 0;
    if (linkedin.trim().length > 0) count += 1;
    if (github.trim().length > 0) count += 1;
    count += extraLinks.filter((l) => l.url.trim().length > 0).length;
    return count;
  };

  // Listen for Earn Servers "Complete Your Profile" mission launch
  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ missionId?: string }>).detail;
      if (detail?.missionId !== 'task_profile_complete') return;
      const progress = gamificationService.getActivityProgress();
      const profileDetailsDone =
        progress.profileBioSaved &&
        progress.profileTitleSaved &&
        progress.profileOrgSaved &&
        progress.profileEmailSaved &&
        progress.profileSocialLinksCount >= 2;
      if (profileDetailsDone && !progress.profileAchievementSaved) {
        setEditingAchievementId(null);
        setShowEditAchievementsModal(true);
        setMetricToast('Add or save 1 achievement to complete the mission!');
      } else {
        const orgParts = userOrganization
          .split('•')
          .map((p) => p.trim())
          .filter(Boolean);
        setEditDisplayName(userName);
        setEditRoleTitle(userTitle);
        setEditBioText(userBio);
        setEditInstitutionPrimary(orgParts[0] || '');
        setEditInstitutionSecondary(orgParts.slice(1).join(' • ') || '');
        setIsEditing(true);
        const scroller = document.querySelector('[data-tab-scroller="profile"]');
        if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
        setMetricToast(
          'Add your bio, Title, organization, 1 email, 2 social links, then Save!'
        );
      }
    };
    window.addEventListener('cronium:mission-action', handler);
    return () => window.removeEventListener('cronium:mission-action', handler);
  }, [userName, userTitle, userBio, userOrganization, workEmail, linkedinUrl, githubUrl]);

  const handleOpenEditProfileSheet = () => {
    const orgParts = userOrganization
      .split('•')
      .map((p) => p.trim())
      .filter(Boolean);
    setEditDisplayName(userName);
    setEditRoleTitle(userTitle);
    setEditBioText(userBio);
    setEditInstitutionPrimary(orgParts[0] || '');
    setEditInstitutionSecondary(orgParts.slice(1).join(' • ') || '');
    setIsEditing(true);
  };

  const handleSaveInlineProfile = () => {
    const nextName = editDisplayName.trim() || userName;
    const nextTitle = editRoleTitle.trim() || userTitle;
    const nextBio = editBioText.trim() || userBio;
    const combinedInstitutions = [
      editInstitutionPrimary.trim(),
      editInstitutionSecondary.trim(),
    ]
      .filter(Boolean)
      .join(' • ');
    const nextOrganization = combinedInstitutions || userOrganization;
    const cleanedEmail = workEmail.trim();
    const cleanedLinkedin = formatDisplayUrl(linkedinUrl);
    const cleanedGithub = formatDisplayUrl(githubUrl);

    setUserName(nextName);
    setUserTitle(nextTitle);
    setUserBio(nextBio);
    setUserOrganization(nextOrganization);

    sessionProfileStore.userName = nextName;
    sessionProfileStore.userTitle = nextTitle;
    sessionProfileStore.userBio = nextBio;
    sessionProfileStore.userOrganization = nextOrganization;
    persistIdentity({
      workEmail: cleanedEmail || DEFAULT_WORK_EMAIL,
      linkedinUrl: cleanedLinkedin,
      githubUrl: cleanedGithub,
      socialLinks,
    });
    const unlockedProfileMission = gamificationService.recordProfileUpdate({
      bio: nextBio,
      title: nextTitle,
      organization: nextOrganization,
      email: cleanedEmail,
      socialLinksCount: countProfileSocialLinks(cleanedLinkedin, cleanedGithub, socialLinks),
    });
    const progress = gamificationService.getActivityProgress();
    setIsEditing(false);
    const profileDetailsDone =
      progress.profileBioSaved &&
      progress.profileTitleSaved &&
      progress.profileOrgSaved &&
      progress.profileEmailSaved &&
      progress.profileSocialLinksCount >= 2;
    if (unlockedProfileMission || gamificationService.isMissionReady('task_profile_complete')) {
      setMetricToast('Profile completed · Tap Claim +1 Slot in Earn Servers!');
      notificationService.playSentChime();
      if (unlockedProfileMission) {
        notificationService.notify(
          'Mission Ready to Claim!',
          'You completed "Complete Your Profile". Tap Claim +1 Slot in Earn Servers!'
        );
      }
      window.setTimeout(() => {
        document.getElementById('gamification-dashboard')?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 150);
    } else if (profileDetailsDone && !progress.profileAchievementSaved) {
      setMetricToast(
        'Profile details saved! Now save 1 achievement to unlock Claim +1 Slot.'
      );
      setEditingAchievementId(null);
      setShowEditAchievementsModal(true);
    } else {
      const status = gamificationService.getMissionStatus('task_profile_complete');
      setMetricToast(`Profile saved · ${status.progressText}`);
    }
  };

  const [achievements, setAchievements] = useState<AchievementItem[]>(
    () => sessionProfileStore.achievements
  );

  const [achievementMetrics, setAchievementMetrics] = useState<AchievementMetrics>(
    () => sessionProfileStore.achievementMetrics
  );

  const joinedCommunitiesCount = communities ? communities.filter((c) => c.joined).length : 2;
  const connectionsCount = 1480 + (connectedUserIds ? connectedUserIds.length : 0);

  const displayedCommunitiesCount =
    profileMetricsOverride.communities !== undefined
      ? profileMetricsOverride.communities
      : joinedCommunitiesCount;
  const displayedConnectionsCount =
    profileMetricsOverride.connections !== undefined
      ? profileMetricsOverride.connections
      : connectionsCount;
  const displayedAchievementsCount =
    profileMetricsOverride.achievements !== undefined
      ? profileMetricsOverride.achievements
      : achievements.length;
  const hasCustomMetricsOverride =
    profileMetricsOverride.communities !== undefined ||
    profileMetricsOverride.connections !== undefined ||
    profileMetricsOverride.achievements !== undefined;

  const brandStatus = calculateBrandLevel(
    displayedConnectionsCount,
    displayedCommunitiesCount,
    displayedAchievementsCount
  );

  const handleSelectCover = (url: string) => {
    sessionProfileStore.coverUrl = url;
    setCoverUrl(url);
    setShowCoverModal(false);
    notificationService.playSentChime();
  };

  const handleSaveProfileMetrics = (next: ProfileMetricsOverride) => {
    sessionProfileStore.profileMetricsOverride = next;
    setProfileMetricsOverride(next);
    setMetricToast('Profile metrics updated');
    notificationService.playSentChime();
  };

  const handleResetProfileMetrics = () => {
    sessionProfileStore.profileMetricsOverride = {};
    setProfileMetricsOverride({});
    setMetricToast('Profile metrics reset to automatic');
  };

  const persistIdentity = (next: {
    workEmail: string;
    linkedinUrl: string;
    githubUrl: string;
    socialLinks: SocialProfileLink[];
  }) => {
    sessionProfileStore.workEmail = next.workEmail;
    sessionProfileStore.linkedinUrl = next.linkedinUrl;
    sessionProfileStore.githubUrl = next.githubUrl;
    sessionProfileStore.socialLinks = next.socialLinks;
    setWorkEmail(next.workEmail);
    setLinkedinUrl(next.linkedinUrl);
    setGithubUrl(next.githubUrl);
    setSocialLinks(next.socialLinks);
  };

  const handleSaveAchievements = (
    nextAchievements: AchievementItem[],
    nextMetrics: AchievementMetrics,
    options?: { silent?: boolean }
  ) => {
    const countChanged = nextAchievements.length !== achievements.length;
    sessionProfileStore.achievements = nextAchievements;
    sessionProfileStore.achievementMetrics = nextMetrics;
    setAchievements(nextAchievements);
    setAchievementMetrics(nextMetrics);
    if (countChanged && profileMetricsOverride.achievements !== undefined) {
      const updatedOverride: ProfileMetricsOverride = { ...profileMetricsOverride };
      delete updatedOverride.achievements;
      sessionProfileStore.profileMetricsOverride = updatedOverride;
      setProfileMetricsOverride(updatedOverride);
    }
    const wasProfileMissionReady = gamificationService.isMissionReady('task_profile_complete');
    sessionProfileStore.userBio = userBio;
    sessionProfileStore.userTitle = userTitle;
    sessionProfileStore.userOrganization = userOrganization;
    gamificationService.recordProfileUpdate({
      bio: userBio,
      title: userTitle,
      organization: userOrganization,
      email: workEmail,
      socialLinksCount: countProfileSocialLinks(linkedinUrl, githubUrl, socialLinks),
    });
    gamificationService.recordAchievementSaved();
    const unlockedProfileMission =
      !wasProfileMissionReady && gamificationService.isMissionReady('task_profile_complete');

    if (unlockedProfileMission) {
      setMetricToast('Profile mission completed · Tap Claim +1 Slot in Earn Servers!');
      notificationService.playSentChime();
      notificationService.notify(
        'Mission Ready to Claim!',
        'You completed "Complete Your Profile". Tap Claim +1 Slot in Earn Servers!'
      );
      if (!options?.silent) {
        window.setTimeout(() => {
          document.getElementById('gamification-dashboard')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 180);
      }
    } else if (!options?.silent) {
      setMetricToast('Key achievements updated');
      notificationService.playSentChime();
    }
  };

  const handleToggleBiometrics = () => {
    const nextVal = !biometricsEnabled;
    setBiometricsEnabled(nextVal);
    biometricsService.setEnabled(nextVal);
  };

  const handleToggleSound = () => {
    const nextVal = notificationService.toggleSound();
    setSoundEnabled(nextVal);
  };

  const handleClearCache = () => {
    try {
      localStorage.removeItem('cronium_cached_messages');
      setCacheCleared(true);
      setTimeout(() => setCacheCleared(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      data-tab-scroller="profile"
      className="flex flex-col flex-1 h-full min-h-0 bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-y-auto"
    >
      {/* Full-Bleed Architectural Cover Banner matching reference design */}
      <div className="relative w-full h-[186px] sm:h-[196px] bg-slate-900 overflow-hidden shrink-0 group">
        <img
          src={coverUrl}
          alt="Executive Profile Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Subtle depth gradient for button legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-950/25 pointer-events-none" />

        {/* Floating Top-Left Back Button */}
        <button
          type="button"
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              const scroller = document.querySelector<HTMLElement>('[data-tab-scroller="profile"]');
              scroller?.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="absolute left-4 top-11 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-slate-900/75 dark:hover:bg-slate-900 backdrop-blur-md text-slate-900 dark:text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
          title="Back"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.2] -ml-0.5" />
        </button>

        {/* Floating Top-Right Change Cover Camera & Three Vertical Dots Menu */}
        <div className="absolute right-4 top-11 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCoverModal(true)}
            className="w-9 h-9 rounded-full bg-slate-700/65 hover:bg-slate-800/85 backdrop-blur-md text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Change cover photo"
            aria-label="Change cover photo"
          >
            <Camera className="w-[18px] h-[18px] stroke-[1.9]" />
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSettingsSection(null);
              setShowSettingsMenu(true);
            }}
            className="w-9 h-9 rounded-full bg-slate-700/65 hover:bg-slate-800/85 backdrop-blur-md text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
            title="Settings & Account Controls"
            aria-label="Open profile settings menu"
          >
            <MoreVertical className="w-[18px] h-[18px] stroke-[2.1]" />
          </button>
        </div>
      </div>

      {/* Overlapping Curved White Hero Surface */}
      <div className="relative z-10 -mt-5 rounded-t-[24px] bg-white dark:bg-slate-900 border-b border-slate-100/90 dark:border-slate-800/80 shrink-0">
        <div className="max-w-lg mx-auto w-full px-5 pt-0 pb-5 text-left">
          {/* Avatar + Right Action Pills */}
          <div className="flex items-start justify-between gap-3">
            <div className="relative -mt-[46px] z-20 shrink-0">
              <img
                src={CURRENT_USER.avatar}
                alt={userName}
                className="w-[92px] h-[92px] rounded-full object-cover object-top border-[4px] border-white dark:border-slate-900 shadow-md bg-slate-100 dark:bg-slate-800"
              />
              <span
                className="absolute bottom-0.5 right-0.5 w-[18px] h-[18px] bg-[#10B981] rounded-full border-[3px] border-white dark:border-slate-900 shadow-2xs"
                title="Online & Verified on Cronium Mesh"
              />
            </div>

            <div className="flex items-center gap-2 pt-3">
              <button
                type="button"
                onClick={handleOpenEditProfileSheet}
                className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors cursor-pointer active:scale-95"
              >
                <PencilLine className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2]" />
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors cursor-pointer active:scale-95 shrink-0"
                title="View Public QR Card"
                aria-label="View Public QR Card"
              >
                {/* Crisp QR icon matching reference design */}
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect x="2.25" y="2.25" width="5.75" height="5.75" rx="1.15" stroke="currentColor" strokeWidth="1.65" />
                  <rect x="4.5" y="4.5" width="1.25" height="1.25" rx="0.35" fill="currentColor" />
                  <rect x="12" y="2.25" width="5.75" height="5.75" rx="1.15" stroke="currentColor" strokeWidth="1.65" />
                  <rect x="14.25" y="4.5" width="1.25" height="1.25" rx="0.35" fill="currentColor" />
                  <rect x="2.25" y="12" width="5.75" height="5.75" rx="1.15" stroke="currentColor" strokeWidth="1.65" />
                  <rect x="4.5" y="14.25" width="1.25" height="1.25" rx="0.35" fill="currentColor" />
                  <rect x="11.5" y="11.5" width="2" height="2" rx="0.45" fill="currentColor" />
                  <rect x="14.75" y="11.5" width="2" height="2" rx="0.45" fill="currentColor" />
                  <rect x="11.5" y="14.75" width="2" height="2" rx="0.45" fill="currentColor" />
                  <rect x="15.75" y="15.75" width="2" height="2" rx="0.45" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-3.5">
            {/* Name, Verified Checkmark, Handle & Online Pill */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[24px] sm:text-[25px] font-bold text-slate-950 dark:text-white tracking-[-0.025em] leading-tight truncate">
                    {userName}
                  </h2>
                  {(() => {
                    const badge = getProfileBadgeStyle(userName, {
                      isCurrentUser: true,
                      userPlan,
                    });
                    return (
                      <span
                        title={badge.title}
                        className={`w-[20px] h-[20px] rounded-full inline-flex items-center justify-center shrink-0 text-white ${badge.bgClass}`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    );
                  })()}
                </div>
                <span className="text-[13.5px] text-slate-500 dark:text-slate-400 font-normal block mt-0.5">
                  @jennies
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F5F8] dark:bg-slate-800 text-[12px] font-medium text-slate-700 dark:text-slate-200 shrink-0 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                <span>Online</span>
              </div>
            </div>

            {/* Role Title & Description */}
            <p className="text-[14px] sm:text-[14.5px] font-semibold text-slate-900 dark:text-white leading-snug mt-4">
              {userTitle}
            </p>
            <p className="text-[13.5px] sm:text-[14px] text-[#5B6472] dark:text-slate-300 leading-[1.55] mt-1.5 font-normal">
              {userBio}
            </p>

            {/* Organization & Alma Mater Row */}
            {userOrganization && (() => {
              const orgParts = userOrganization
                .split('•')
                .map((p) => p.trim())
                .filter(Boolean);
              const primaryOrg = orgParts[0] || userOrganization;
              const secondaryOrg = orgParts.slice(1).join(' • ');
              return (
                <div className="flex items-center flex-wrap sm:flex-nowrap gap-2 mt-3.5 text-[12px] sm:text-[12.5px] text-[#4E5969] dark:text-slate-400 font-normal">
                  <span className="inline-flex items-center gap-1.5 shrink-0">
                    <Landmark className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 stroke-[1.9]" />
                    <span>{primaryOrg}</span>
                  </span>
                  {secondaryOrg && (
                    <>
                      <span className="text-slate-300 dark:text-slate-700 select-none shrink-0" aria-hidden="true">
                        |
                      </span>
                      <span className="inline-flex items-center gap-1.5 shrink-0">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 stroke-[1.9]" />
                        <span>{secondaryOrg}</span>
                      </span>
                    </>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Monochrome 3-Column Metrics Summary Card */}
          <div className="mt-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 py-3 px-2">
            <div className="grid grid-cols-3 divide-x divide-slate-200/80 dark:divide-slate-700/80 text-center">
              <button
                type="button"
                onClick={() => setNetworkSheetTab('communities')}
                className="group py-1 px-1 hover:bg-slate-100/70 dark:hover:bg-slate-700/40 rounded-lg active:scale-[0.98] transition-all cursor-pointer text-center"
                title={`View ${displayedCommunitiesCount} joined communities`}
              >
                <span className="block text-[18px] sm:text-[19px] font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                  {displayedCommunitiesCount}
                </span>
                <span className="block text-[11.5px] text-slate-500 dark:text-slate-400 font-normal mt-1">
                  Communities
                </span>
              </button>
              <button
                type="button"
                onClick={() => setNetworkSheetTab('connections')}
                className="group py-1 px-1 hover:bg-slate-100/70 dark:hover:bg-slate-700/40 rounded-lg active:scale-[0.98] transition-all cursor-pointer text-center"
                title={`View ${displayedConnectionsCount.toLocaleString()} verified connections`}
              >
                <span className="block text-[18px] sm:text-[19px] font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                  {displayedConnectionsCount.toLocaleString()}
                </span>
                <span className="block text-[11.5px] text-slate-500 dark:text-slate-400 font-normal mt-1">
                  Connections
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAllAchievements(true);
                  setTimeout(() => {
                    achievementsSectionRef.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  }, 50);
                }}
                className="group py-1 px-1 hover:bg-slate-100/70 dark:hover:bg-slate-700/40 rounded-lg active:scale-[0.98] transition-all cursor-pointer text-center"
                title={`Jump to ${displayedAchievementsCount} achievements below`}
              >
                <span className="block text-[18px] sm:text-[19px] font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                  {displayedAchievementsCount}
                </span>
                <span className="block text-[11.5px] text-slate-500 dark:text-slate-400 font-normal mt-1">
                  Achievements
                </span>
              </button>
            </div>
          </div>

          {/* Interactive Metric Toast Feedback */}
          {metricToast && (
            <div className="mt-2.5 text-center animate-fadeIn">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md">
                <Sparkles className="w-3 h-3 text-amber-400 dark:text-amber-500" />
                <span>{metricToast}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-3.5 sm:px-4 pt-4 pb-6 space-y-4 max-w-lg mx-auto w-full text-left">
        {/* Profile Visibility & Boost Card (Matching attached design) */}
        {(() => {
          const multiplierFactor =
            visibilityMultiplier === '5x' ? 5 : visibilityMultiplier === '3.4x' ? 3.4 : 1;
          const baseViews = visibilityRange === '30d' ? 1420 : 385;
          const displayedViews = Math.round(baseViews * multiplierFactor);
          const growthPct = visibilityRange === '30d' ? '+42%' : '+18%';
          const tierLabel =
            visibilityMultiplier === '5x'
              ? 'Spotlight 5x'
              : visibilityMultiplier === '3.4x'
              ? 'Pro Boost 3.4x'
              : 'Standard 1x';
          const sparklinePoints =
            visibilityRange === '30d'
              ? [
                  { x: 6, y: 42 },
                  { x: 30, y: 36 },
                  { x: 54, y: 31 },
                  { x: 78, y: 23 },
                  { x: 102, y: 16 },
                  { x: 126, y: 8 },
                ]
              : [
                  { x: 6, y: 40 },
                  { x: 30, y: 38 },
                  { x: 54, y: 30 },
                  { x: 78, y: 26 },
                  { x: 102, y: 18 },
                  { x: 126, y: 11 },
                ];
          const polylinePath = sparklinePoints.map((p) => `${p.x},${p.y}`).join(' ');
          const areaPath = `M ${sparklinePoints[0].x},${sparklinePoints[0].y} ${sparklinePoints
            .slice(1)
            .map((p) => `L ${p.x},${p.y}`)
            .join(' ')} L ${sparklinePoints[sparklinePoints.length - 1].x},52 L ${
            sparklinePoints[0].x
          },52 Z`;

          return (
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowImpressionsModal(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowImpressionsModal(true);
                }
              }}
              className="w-full p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-[#E5DCFF] dark:border-slate-800 shadow-[0_6px_24px_rgba(108,59,245,0.08)] hover:border-[#C4B5FD] dark:hover:border-violet-700/70 transition-all cursor-pointer text-left"
              title="Open Boost & Viewer Insights"
            >
              {/* Top Row: Icon + Title + 7d/30d Toggle */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#F3EFFF] dark:bg-violet-950/70 text-[#6C3BF5] dark:text-violet-400 flex items-center justify-center shrink-0">
                    <Eye className="w-[18px] h-[18px] stroke-[2]" />
                  </div>
                  <span className="text-[15px] font-bold text-slate-950 dark:text-white tracking-tight truncate">
                    Profile Visibility &amp; Boost
                  </span>
                </div>

                <div
                  className="inline-flex items-center p-0.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setVisibilityRange('7d')}
                    className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-all cursor-pointer ${
                      visibilityRange === '7d'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    7d
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibilityRange('30d')}
                    className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-all cursor-pointer ${
                      visibilityRange === '30d'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    30d
                  </button>
                </div>
              </div>

              {/* Middle Row: Big Count + Growth + Multiplier Pill & Violet Area Sparkline */}
              <div className="mt-3.5 flex items-end justify-between gap-3">
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[30px] font-extrabold text-slate-950 dark:text-white tracking-tight leading-none tabular-nums">
                      {displayedViews.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBFBF3] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-400 text-[12px] font-bold">
                      <TrendingUp className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span>{growthPct}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F3EFFF] dark:bg-violet-950/70 text-[#6C3BF5] dark:text-violet-300 text-[11.5px] font-bold">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>{tierLabel}</span>
                    </span>
                    <span className="text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                      profile views
                    </span>
                  </div>
                </div>

                {/* Violet Area Sparkline Chart */}
                <div className="w-[132px] h-[56px] shrink-0">
                  <svg
                    viewBox="0 0 134 56"
                    className="w-full h-full overflow-visible"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="profileVisSparkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6C3BF5" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="#6C3BF5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line
                      x1="4"
                      y1="52"
                      x2="130"
                      y2="52"
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-700"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                    <path d={areaPath} fill="url(#profileVisSparkGrad)" />
                    <polyline
                      points={polylinePath}
                      fill="none"
                      stroke="#6C3BF5"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {sparklinePoints.map((pt, idx) => {
                      const isLast = idx === sparklinePoints.length - 1;
                      return (
                        <circle
                          key={idx}
                          cx={pt.x}
                          cy={pt.y}
                          r={isLast ? 4.2 : 2.7}
                          fill={isLast ? '#6C3BF5' : '#FFFFFF'}
                          stroke="#6C3BF5"
                          strokeWidth={isLast ? 1.5 : 2}
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Bottom Divider + Viewers Row */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center -space-x-2 shrink-0">
                    {[portraitMarcusVance, portraitAnnaSan, portraitAlexanderPatrick].map(
                      (avatarSrc, idx) => (
                        <img
                          key={idx}
                          src={avatarSrc}
                          alt="Profile viewer"
                          className="w-6 h-6 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-2xs"
                        />
                      )
                    )}
                  </div>
                  <span className="text-[11.5px] sm:text-[12px] font-medium text-slate-700 dark:text-slate-300 truncate">
                    +14 founders &amp; VCs viewed
                  </span>
                </div>

                <span className="text-[12px] font-semibold text-[#6C3BF5] dark:text-violet-400 shrink-0 whitespace-nowrap">
                  Insights &amp; Boost →
                </span>
              </div>
            </div>
          );
        })()}

        {/* Section 1: Professional Identity & Credentials */}
        <div className="px-4 py-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#F3EFFF] dark:bg-violet-950/70 text-[#6C3BF5] dark:text-violet-400 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider truncate">
                Identity &amp; Credentials
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowEditIdentityModal(true)}
              className="px-2.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors cursor-pointer active:scale-95 shrink-0"
              title="Edit Identity, Credentials & Social Links"
              aria-label="Edit Identity, Credentials and Social Links"
            >
              <PencilLine className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2]" />
              <span>Edit</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {/* Work Email */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-100/90 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-slate-400 block">Work Email</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {workEmail}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                Verified
              </span>
            </div>

            {/* LinkedIn Profile */}
            {linkedinUrl && (
              <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center shrink-0">
                    <Linkedin className="w-[18px] h-[18px] text-[#0A66C2]" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">LinkedIn Profile</span>
                    <a
                      href={normalizeExternalHref(linkedinUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block transition-colors"
                    >
                      {formatDisplayUrl(linkedinUrl)}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(normalizeExternalHref(linkedinUrl), 'linkedin')}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
                    title="Copy LinkedIn URL"
                  >
                    {copiedField === 'linkedin' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={normalizeExternalHref(linkedinUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                    title="Open LinkedIn in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* GitHub Profile */}
            {githubUrl && (
              <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <Github className="w-[18px] h-[18px] text-slate-900 dark:text-slate-100" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">GitHub Profile</span>
                    <a
                      href={normalizeExternalHref(githubUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block transition-colors"
                    >
                      {formatDisplayUrl(githubUrl)}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(normalizeExternalHref(githubUrl), 'github')}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
                    title="Copy GitHub URL"
                  >
                    {copiedField === 'github' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={normalizeExternalHref(githubUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                    title="Open GitHub in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* User-Added Social Media & Other Links */}
            {socialLinks.map((link) => {
              const meta = getPlatformMeta(link.platform);
              const href = normalizeExternalHref(link.url);
              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 pt-2.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl ${meta.bgClass} ${meta.colorClass} flex items-center justify-center shrink-0`}
                    >
                      <SocialPlatformIcon platform={link.platform} className="w-[18px] h-[18px]" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 block truncate">
                        {link.label}
                      </span>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block transition-colors"
                      >
                        {formatDisplayUrl(link.url)}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(href, link.id)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0 cursor-pointer"
                      title={`Copy ${link.label} URL`}
                    >
                      {copiedField === link.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
                      title={`Open ${link.label} in new tab`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gamification Dashboard (Located below Identity & Credentials to complete tasks and earn server slots) */}
        <GamificationDashboard
          userPlan={userPlan}
          onOpenSubscription={() => {
            setPlanModalTargetTab('plus');
            setShowPlanModal(true);
          }}
          onNavigateToProfile={() => {}}
          onNavigateToFeed={onNavigateToFeed}
          onNavigateToServers={onNavigateToServers}
        />


        {/* Section: Achievements (Honors & Accomplishments) */}
        <div
          ref={achievementsSectionRef}
          id="achievements-section"
          className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_10px_rgba(15,23,42,0.03)] overflow-hidden scroll-mt-4"
        >
          {/* Card Header */}
          <div className="px-4 py-4 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                Key Achievements
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingAchievementId(null);
                setShowEditAchievementsModal(true);
              }}
              className="px-2.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors cursor-pointer active:scale-95 shrink-0"
              title="Edit Key Achievements"
              aria-label="Edit Key Achievements"
            >
              <PencilLine className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2]" />
              <span>Edit</span>
            </button>
          </div>

          {/* 3-Column Summary Metrics Strip */}
          <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 py-4 px-2 border-b border-slate-100 dark:border-slate-800 text-center">
            <div className="px-1">
              <span className="block text-[15px] font-bold text-amber-600 dark:text-amber-400 leading-tight">
                {achievementMetrics.honors}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Honors
              </span>
            </div>
            <div className="px-1">
              <span className="block text-[15px] font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                {achievementMetrics.patents}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Patents &amp; Papers
              </span>
            </div>
            <div className="px-1">
              <span className="block text-[15px] font-bold text-[#4F46E5] dark:text-indigo-400 leading-tight">
                {achievementMetrics.contributor}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Contributor
              </span>
            </div>
          </div>

          {/* Clean Hairline-Separated Honors List */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 px-4">
            {(showAllAchievements ? achievements : achievements.slice(0, 2)).map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setSelectedAchievement(item)}
                className="w-full py-4 flex items-start gap-3 text-left transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50/90 dark:bg-amber-950/50 flex items-center justify-center shrink-0 text-lg mt-0.5">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#4F46E5] dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 tabular-nums pt-0.5">
                      {item.year.replace(/\s*–\s*/g, '–')}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#4F46E5] dark:text-indigo-400 truncate mt-0.5">
                    {item.organization}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mt-1.5">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Expand / Collapse Footer */}
          {achievements.length > 2 && (
            <div className="border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAllAchievements((prev) => !prev)}
                className="w-full py-3.5 px-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#4F46E5] dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
              >
                {showAllAchievements ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>View all {achievements.length} honors</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Section: Posts by User below Key Achievements */}
        <UserPostsSection
          authorName={CURRENT_USER.name}
          posts={jenniesPosts}
          onOpenAllPosts={(postId) => {
            setTargetPostId(postId || null);
            setShowAllPostsScreen(true);
          }}
          onDeletePost={handleDeleteJenniesPost}
          onRepostPost={handleRepostJenniesPost}
        />
      </div>

      {/* Profile Settings Menu & Section Detail Modal */}
      {showSettingsMenu && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-150"
          onClick={() => {
            setShowSettingsMenu(false);
            setActiveSettingsSection(null);
          }}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 max-h-[88dvh] flex flex-col overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Grab Handle */}
            <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mt-2.5 shrink-0" />

            {/* Modal Header */}
            <div
              className={`px-5 flex items-center justify-between gap-3 shrink-0 ${
                activeSettingsSection === null
                  ? 'pt-3 pb-2.5'
                  : 'py-3.5 border-b border-slate-100 dark:border-slate-800'
              }`}
            >
              {activeSettingsSection === null ? (
                <h3 className="text-[19px] font-extrabold text-slate-900 dark:text-white font-display tracking-[-0.02em] leading-tight">
                  Settings
                </h3>
              ) : (
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveSettingsSection(null)}
                    className="p-1.5 -ml-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer active:scale-95 shrink-0"
                    title="Back to settings"
                    aria-label="Back to settings"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display leading-tight truncate">
                      {activeSettingsSection === 'security'
                        ? 'Security & Authentication'
                        : activeSettingsSection === 'devices'
                        ? 'Connected Devices'
                        : activeSettingsSection === 'vault'
                        ? 'Offline Mesh Vault'
                        : activeSettingsSection === 'notifications'
                        ? 'Notifications'
                        : 'Interface Appearance'}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {activeSettingsSection === 'security'
                        ? 'Passkeys, biometrics & session lock'
                        : activeSettingsSection === 'devices'
                        ? 'Synced hardware & multi-device mesh'
                        : activeSettingsSection === 'vault'
                        ? 'Encrypted offline cache & connectivity'
                        : activeSettingsSection === 'notifications'
                        ? 'Push alerts, channels & audio preferences'
                        : 'Light & dark workspace display theme'}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowSettingsMenu(false);
                  setActiveSettingsSection(null);
                }}
                className="p-1.5 -mr-1 rounded-full text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close settings menu"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-4 pt-1.5 pb-[max(1.25rem,env(safe-area-inset-bottom))] overflow-y-auto space-y-4">
              {activeSettingsSection === null ? (
                <>
                  {/* User Profile Summary Card */}
                  <div className="rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 px-3.5 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={CURRENT_USER.avatar}
                          alt={userName}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200/80 dark:border-slate-700"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[14px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                            {userName}
                          </span>
                          {(() => {
                            const badge = getProfileBadgeStyle(userName, {
                              isCurrentUser: true,
                              userPlan,
                            });
                            return (
                              <span
                                className={`inline-flex items-center justify-center w-4 h-4 rounded-full shrink-0 text-white ${badge.bgClass}`}
                                title={badge.title}
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3.2]" />
                              </span>
                            );
                          })()}
                        </div>
                        <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                          @jennies ·{' '}
                          {userPlan === 'pro'
                            ? 'Pro Executive Plan'
                            : userPlan === 'plus'
                            ? 'Plus Executive Plan'
                            : 'Executive Plan'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#EEF0FF] dark:bg-indigo-950/70 text-[#5B4CE6] dark:text-indigo-300 text-[11px] font-semibold shrink-0">
                      Verified
                    </span>
                  </div>

                  {/* Section 1: Account & Mesh Security */}
                  <div>
                    <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 px-1 mb-2">
                      Account &amp; Mesh Security
                    </p>
                    <div className="rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                      {/* 1. Security & Authentication */}
                      <button
                        type="button"
                        onClick={() => setActiveSettingsSection('security')}
                        className="w-full px-3.5 py-3 hover:bg-slate-100/70 dark:hover:bg-slate-800 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-[18px] h-[18px] stroke-[2]" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white leading-snug block truncate">
                              Security &amp; Authentication
                            </span>
                            <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                              {biometricsEnabled
                                ? 'Biometric Passkey · Enclave active'
                                : 'Passkey disabled · PIN unlock available'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>

                      {/* 2. Connected Devices */}
                      <button
                        type="button"
                        onClick={() => setActiveSettingsSection('devices')}
                        className="w-full px-3.5 py-3 hover:bg-slate-100/70 dark:hover:bg-slate-800 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] dark:bg-indigo-950/60 text-[#635BFF] dark:text-indigo-400 flex items-center justify-center shrink-0">
                            <Laptop className="w-[18px] h-[18px] stroke-[2]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white leading-snug block truncate">
                              Connected Devices
                            </span>
                            <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                              MacBook Pro, iPhone 17 Pro, iPad Pro
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold whitespace-nowrap">
                            3 Synced
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      </button>

                      {/* 3. Offline Mesh Vault */}
                      <button
                        type="button"
                        onClick={() => setActiveSettingsSection('vault')}
                        className="w-full px-3.5 py-3 hover:bg-slate-100/70 dark:hover:bg-slate-800 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                            <Database className="w-[18px] h-[18px] stroke-[2]" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white leading-snug block truncate">
                              Offline Mesh Vault
                            </span>
                            <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                              {isOfflineMode ? 'Offline Mode' : 'Online Mode'} · 32.4 MB cache
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Preferences */}
                  <div>
                    <p className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 px-1 mb-2">
                      Preferences
                    </p>
                    <div className="rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                      {/* 4. Notifications */}
                      <button
                        type="button"
                        onClick={() => setActiveSettingsSection('notifications')}
                        className="w-full px-3.5 py-3 hover:bg-slate-100/70 dark:hover:bg-slate-800 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                            <Bell className="w-[18px] h-[18px] stroke-[2]" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white leading-snug block truncate">
                              Notifications
                            </span>
                            <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                              {soundEnabled
                                ? 'Push alerts & audio active'
                                : 'Push alerts active · Audio muted'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>

                      {/* 5. Interface Appearance */}
                      <button
                        type="button"
                        onClick={() => setActiveSettingsSection('appearance')}
                        className="w-full px-3.5 py-3 hover:bg-slate-100/70 dark:hover:bg-slate-800 flex items-center justify-between gap-3 transition-colors cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
                            {darkMode ? (
                              <Moon className="w-[18px] h-[18px] stroke-[2]" />
                            ) : (
                              <Sun className="w-[18px] h-[18px] stroke-[2]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[13.5px] font-semibold text-slate-900 dark:text-white leading-snug block truncate">
                              Interface Appearance
                            </span>
                            <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                              {darkMode ? 'Dark Obsidian Theme' : 'Light Executive Theme'}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Sign Out & Version Footer */}
                  <div className="pt-2 pb-1 flex flex-col items-center justify-center text-center space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setActiveSettingsSection(null);
                        onLockApp();
                      }}
                      className="px-4 py-1.5 rounded-xl text-[13.5px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Cronium v2.4 · End-to-End Encrypted
                    </p>
                  </div>
                </>
              ) : activeSettingsSection === 'security' ? (
                <div className="space-y-3">
                  {/* Biometric Login */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Fingerprint className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            Biometric Passkey Auth
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            Touch ID &amp; Face ID secure enclave
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleBiometrics}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                          biometricsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label="Toggle Biometric Passkey Auth"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                            biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200/70 dark:border-slate-700/70 pt-3">
                      <div className="text-xs text-slate-600 dark:text-slate-300 min-w-0">
                        <span className="font-semibold block text-slate-900 dark:text-white">
                          Lock Session Immediately
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Requires Face ID or PIN to unlock
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowSettingsMenu(false);
                          setActiveSettingsSection(null);
                          onLockApp();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Lock Now</span>
                      </button>
                    </div>
                  </div>

                  {/* Cryptographic Enclave Details */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Hardware Enclave Protection</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Passkey Status</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {biometricsEnabled ? 'Verified & Active' : 'Standby'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Cipher Suite</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        X25519 · AES-256-GCM
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Session Policy</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Zero-Log Forward Secrecy
                      </span>
                    </div>
                  </div>
                </div>
              ) : activeSettingsSection === 'devices' ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Active Mesh Hardware
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        3 Synced
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Laptop className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                              MacBook Pro 16&quot; (M3 Max)
                            </span>
                            <span className="text-[10.5px] text-slate-400 block truncate">
                              Verified Mesh Key · Desktop Relay
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-emerald-600 font-semibold shrink-0">
                          Active Now
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                              iPhone 17 Pro
                            </span>
                            <span className="text-[10.5px] text-slate-400 block truncate">
                              Primary Hardware Enclave · Biometrics Linked
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0">
                          This Device
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Tablet className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                              iPad Pro 13&quot;
                            </span>
                            <span className="text-[10.5px] text-slate-400 block truncate">
                              Encrypted Companion · Auto-Sync Enabled
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          Synced 10m ago
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setActiveSettingsSection(null);
                        onOpenDeviceSync();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Manage Device Sync &amp; Passkeys</span>
                    </button>
                  </div>
                </div>
              ) : activeSettingsSection === 'vault' ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Mesh Connection Mode
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          {isOfflineMode
                            ? 'Simulating offline local encrypted queue'
                            : 'Live peer relay synchronized in real time'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={onToggleOfflineMode}
                        className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                          isOfflineMode
                            ? 'bg-amber-500 text-white'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {isOfflineMode ? (
                          <WifiOff className="w-3.5 h-3.5" />
                        ) : (
                          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        <span>{isOfflineMode ? 'Simulate Offline' : 'Online Mode'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200/70 dark:border-slate-700/70 pt-3">
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Local Encrypted Cache
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          {cacheCleared
                            ? '0.0 MB cached · Local vault refreshed'
                            : '32.4 MB encrypted messages in secure storage'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearCache}
                        className="px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-rose-200 dark:border-rose-900 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{cacheCleared ? 'Cleared!' : 'Clear Cache'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Storage Breakdown */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider text-[11px]">
                      <Database className="w-4 h-4" />
                      <span>Vault Storage Breakdown</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Encrypted Messages</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {cacheCleared ? '0.0 MB' : '18.6 MB'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Cached Media Previews</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {cacheCleared ? '0.0 MB' : '11.2 MB'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">Mesh Routing Keys</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {cacheCleared ? '0.0 MB' : '2.6 MB'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : activeSettingsSection === 'notifications' ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {soundEnabled ? (
                          <Volume2 className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                        ) : (
                          <VolumeX className="w-5 h-5 text-slate-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            Notification Audio
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {soundEnabled
                              ? 'Play audio tone on incoming alerts'
                              : 'Audio alerts currently muted'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleSound}
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                          soundEnabled ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label="Toggle notification audio"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                            soundEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={onTriggerTestPush}
                      className="w-full py-2.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Simulate Incoming Push Notification</span>
                    </button>
                  </div>

                  {/* Notification Channels */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Alert Categories
                    </span>

                    <div className="flex items-center justify-between py-1.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                          Direct Messages
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Encrypted 1-on-1 message alerts
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDmAlertsEnabled((v) => !v)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                          dmAlertsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label="Toggle Direct Messages notifications"
                      >
                        <div
                          className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform ${
                            dmAlertsEnabled ? 'translate-x-4.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                          Community Mentions
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Replies &amp; highlights in joined servers
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCommunityAlertsEnabled((v) => !v)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                          communityAlertsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label="Toggle Community Mentions notifications"
                      >
                        <div
                          className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform ${
                            communityAlertsEnabled ? 'translate-x-4.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-t border-slate-100 dark:border-slate-800">
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                          Network Connections
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          New verified connection requests
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setConnectionAlertsEnabled((v) => !v)}
                        className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 cursor-pointer shrink-0 ${
                          connectionAlertsEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        aria-label="Toggle Network Connections notifications"
                      >
                        <div
                          className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform ${
                            connectionAlertsEnabled ? 'translate-x-4.5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Visual Theme Picker */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (darkMode) onToggleDarkMode();
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer space-y-2 ${
                        !darkMode
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Sun className="w-4 h-4" />
                        </div>
                        {!darkMode && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Light Executive
                        </span>
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block">
                          Crisp high-contrast default
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!darkMode) onToggleDarkMode();
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer space-y-2 ${
                        darkMode
                          ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center">
                          <Moon className="w-4 h-4" />
                        </div>
                        {darkMode && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          Dark Obsidian
                        </span>
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block">
                          Low-glare night mode
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Quick Switch Bar */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Active Workspace Theme
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                        {darkMode ? 'Dark Obsidian Theme' : 'Light Executive Theme (Default)'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onToggleDarkMode}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      {darkMode ? 'Switch to Light' : 'Switch to Dark'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Public Mesh QR Pass Modal */}
      <ProfileQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        name={userName}
        username="@jennies"
        avatar={CURRENT_USER.avatar}
        title={userTitle}
        status="online"
        meshKey="0x7F9B · 48C2 · E390 · 812F"
        isCurrentUser={true}
        userPlan={userPlan}
      />

      {/* Premium & Quota Tier Modal */}
      <PremiumUnlockModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onUnlock={(plan) => {
          onUnlockPlan?.(plan || 'pro');
          setShowPlanModal(false);
        }}
        currentPlan={userPlan}
        initialPlanTab={planModalTargetTab}
      />

      {/* Professional Cover Background Selector Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[28px] p-5 shadow-2xl border border-slate-200/80 dark:border-slate-800 text-left relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    Profile Cover Background
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Select a verified professional executive backdrop
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCoverModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 max-h-[60vh] overflow-y-auto">
              {CURATED_COVER_BACKGROUNDS.map((bg) => {
                const isSelected = coverUrl === bg.url;
                return (
                  <div
                    key={bg.id}
                    onClick={() => handleSelectCover(bg.url)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-xs'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <img
                      src={bg.url}
                      alt={bg.name}
                      className="w-16 h-12 rounded-xl object-cover shrink-0 shadow-2xs"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {bg.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {bg.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowCoverModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Bottom-Sheet Modal (Matching attached design + Institutions) */}
      {isEditing && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Header */}
            <div className="px-5 pt-1 pb-3.5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-bold text-slate-950 dark:text-white tracking-tight leading-tight">
                  Edit Profile
                </h3>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Updates apply immediately to your card
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Close Edit Profile"
              >
                <X className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Form Body */}
            <div className="px-5 py-4 space-y-3.5 max-h-[68vh] overflow-y-auto">
              <div>
                <label className="block text-[12.5px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="Jennies Vance"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-[13.5px] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C2CF6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Role &amp; Focus
                </label>
                <input
                  type="text"
                  value={editRoleTitle}
                  onChange={(e) => setEditRoleTitle(e.target.value)}
                  placeholder="Head of AI Product & Systems Architecture"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-[13.5px] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C2CF6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBioText}
                  onChange={(e) => setEditBioText(e.target.value)}
                  placeholder="Write a short bio..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-[13.5px] text-slate-900 dark:text-white leading-relaxed focus:outline-none focus:border-[#6C2CF6] transition-colors resize-none"
                />
              </div>

              {/* Institutions (Cronium Infrastructure Core & Stanford AI Lab Alum) */}
              <div>
                <label className="block text-[12.5px] font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Institutions
                </label>
                <div className="space-y-2">
                  <div className="relative flex items-center">
                    <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={editInstitutionPrimary}
                      onChange={(e) => setEditInstitutionPrimary(e.target.value)}
                      placeholder="Cronium Infrastructure Core"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-[13.5px] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C2CF6] transition-colors"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={editInstitutionSecondary}
                      onChange={(e) => setEditInstitutionSecondary(e.target.value)}
                      placeholder="Stanford AI Lab Alum"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-[13.5px] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C2CF6] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 pt-2 pb-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[13.5px] font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveInlineProfile}
                className="px-6 py-2.5 rounded-full bg-[#6C2CF6] hover:bg-[#5A1EE0] active:scale-[0.98] text-white text-[13.5px] font-semibold shadow-sm transition-all cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boost & Viewer Insights Bottom-Sheet Modal (Matching attached design with Blurred Profiles & Subscribe Bar) */}
      {showImpressionsModal && (() => {
        const multiplierOptions: Array<{
          id: '1x' | '3.4x' | '5x';
          title: string;
          reach: string;
          factor: number;
        }> = [
          { id: '1x', title: 'Standard', reach: '1.1K – 1.5K/wk', factor: 1 },
          { id: '3.4x', title: 'Pro Boost', reach: '4.5K – 5.2K/wk', factor: 3.4 },
          { id: '5x', title: 'Spotlight', reach: '6.8K – 7.9K/wk', factor: 5 },
        ];
        const activeOption =
          multiplierOptions.find((m) => m.id === visibilityMultiplier) || multiplierOptions[0];
        const baseViews = visibilityRange === '30d' ? 1420 : 385;
        const projectedViews = Math.round(baseViews * activeOption.factor);
        const isFreePlan = userPlan === 'free';

        const recentViewers = [
          {
            id: 'viewer_marcus',
            name: 'Dr. Marcus Vance',
            role: 'Distributed Systems Fellow',
            time: '18m ago',
            avatar: portraitMarcusVance,
            action: 'message' as const,
          },
          {
            id: 'viewer_anna',
            name: 'Anna San',
            role: 'Cerebras AI',
            time: '1h ago',
            avatar: portraitAnnaSan,
            action: 'connect' as const,
          },
          {
            id: 'viewer_alexander',
            name: 'Alexander Patrick',
            role: 'Founder @ NeuralMesh',
            time: '3h ago',
            avatar: portraitAlexanderPatrick,
            action: 'connect' as const,
          },
        ];

        const discoverySources = [
          { label: '#High-Throughput Systems', pct: 48, barColor: 'bg-[#7C3AED]' },
          { label: '#a16z Feed', pct: 32, barColor: 'bg-[#6366F1]' },
          { label: 'Direct Search', pct: 20, barColor: 'bg-[#10B981]' },
        ];

        return (
          <div
            className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-[2px] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
            onClick={() => setShowImpressionsModal(false)}
          >
            <div
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden text-left flex flex-col max-h-[88vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-2.5 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Header */}
              <div className="px-5 pt-1 pb-3.5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[18px] font-bold text-slate-950 dark:text-white tracking-tight leading-tight">
                      Boost &amp; Viewer Insights
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#F2ECFF] dark:bg-violet-950/70 text-[#6C2CF6] dark:text-violet-300 text-[11px] font-bold">
                      {activeOption.id}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Projected weekly reach:{' '}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {activeOption.reach.replace('/wk', '')}
                    </span>{' '}
                    · Current ({visibilityRange}):{' '}
                    <span className="font-bold text-[#6C2CF6] dark:text-violet-400">
                      {projectedViews.toLocaleString()} views
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowImpressionsModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  aria-label="Close Boost & Viewer Insights"
                >
                  <X className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="px-5 py-4 space-y-5 overflow-y-auto">
                {/* Visibility Multiplier */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                      Visibility Multiplier
                    </span>
                    <span className="text-[11.5px] font-semibold text-[#059669] dark:text-emerald-400">
                      Updates live
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {multiplierOptions.map((opt) => {
                      const isSelected = visibilityMultiplier === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setVisibilityMultiplier(opt.id)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-[#6C2CF6] bg-[#FAF7FF] dark:bg-violet-950/30 shadow-[0_2px_10px_rgba(108,44,246,0.08)]'
                              : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[14px] font-extrabold ${
                                isSelected
                                  ? 'text-[#6C2CF6] dark:text-violet-400'
                                  : 'text-slate-950 dark:text-white'
                              }`}
                            >
                              {opt.id}
                            </span>
                            {isSelected && (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#6C2CF6]" />
                            )}
                          </div>
                          <span className="block text-[12px] font-bold text-slate-900 dark:text-white mt-1.5">
                            {opt.title}
                          </span>
                          <span className="block text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                            {opt.reach}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Profile Viewers */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                      Recent Profile Viewers
                    </span>
                    <span className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                      17 total this week
                    </span>
                  </div>

                  {/* Subscribe Bar appears BEFORE blurred viewer profiles for Free users */}
                  {isFreePlan && (
                    <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#6C2CF6] via-[#7C3AED] to-[#5B21E0] text-white shadow-md shadow-violet-500/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
                          <Crown className="w-4 h-4 text-amber-300" />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[12.5px] font-bold leading-tight truncate">
                            Subscribe to view profiles
                          </span>
                          <span className="block text-[11px] text-violet-100 leading-tight mt-0.5 truncate">
                            Reveal all 17 viewers &amp; unlock Pro Boost
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowImpressionsModal(false);
                          setPlanModalTargetTab('plus');
                          setShowPlanModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white hover:bg-violet-50 text-[#6C2CF6] text-[12px] font-bold shadow-xs transition-colors active:scale-95 cursor-pointer shrink-0"
                      >
                        Subscribe
                      </button>
                    </div>
                  )}

                  {/* Viewer List (Blurred until subscribed) */}
                  <div
                    className={`divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800 ${
                      isFreePlan ? 'blur-[6px] select-none pointer-events-none opacity-80' : ''
                    }`}
                  >
                    {recentViewers.map((viewer) => {
                      const isConnected = connectedViewerIds.has(viewer.id);
                      return (
                        <div
                          key={viewer.id}
                          className="py-3 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={viewer.avatar}
                              alt={isFreePlan ? 'Blurred profile viewer' : viewer.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200/80 dark:border-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="block text-[13.5px] font-bold text-slate-950 dark:text-white leading-tight truncate">
                                {viewer.name}
                              </span>
                              <span className="block text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                {viewer.role} · {viewer.time}
                              </span>
                            </div>
                          </div>

                          {viewer.action === 'message' ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (isFreePlan) return;
                                setShowImpressionsModal(false);
                                onStartDirectChatWithUser?.({
                                  id: viewer.id,
                                  name: viewer.name,
                                  avatar: viewer.avatar,
                                  status: 'online',
                                  customStatus: viewer.role,
                                });
                              }}
                              className="px-4 py-1.5 rounded-full bg-[#6C2CF6] hover:bg-[#5B21E0] text-white text-[12px] font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                            >
                              Message
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (isFreePlan) return;
                                setConnectedViewerIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(viewer.id)) {
                                    next.delete(viewer.id);
                                  } else {
                                    next.add(viewer.id);
                                  }
                                  return next;
                                });
                              }}
                              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer shrink-0 ${
                                isConnected
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : 'bg-[#F2ECFF] hover:bg-[#E7DCFF] dark:bg-violet-950/60 dark:hover:bg-violet-900/60 text-[#6C2CF6] dark:text-violet-300'
                              }`}
                            >
                              {isConnected ? 'Connected' : 'Connect'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Top Discovery Sources */}
                <div className="pb-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                      Top Discovery Sources
                    </span>
                    <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
                      Share of views
                    </span>
                  </div>

                  <div className="space-y-3">
                    {discoverySources.map((src) => (
                      <div key={src.label}>
                        <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {src.label}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                            {src.pct}%
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${src.barColor}`}
                            style={{ width: `${src.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200/80 dark:border-slate-800 text-left space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  {selectedAchievement.icon}
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[10px] font-bold mb-1">
                    {selectedAchievement.badge}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                    {selectedAchievement.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Issuing Organization</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-right max-w-[190px]">
                  {selectedAchievement.organization}
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Year &amp; Verification</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>{selectedAchievement.year}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedAchievement.description}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const targetId = selectedAchievement.id;
                  setSelectedAchievement(null);
                  setEditingAchievementId(targetId);
                  setShowEditAchievementsModal(true);
                }}
                className="flex-1 py-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/70 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PencilLine className="w-3.5 h-3.5 stroke-[2]" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Identity & Social Links Modal */}
      <EditIdentityModal
        isOpen={showEditIdentityModal}
        onClose={() => setShowEditIdentityModal(false)}
        workEmail={workEmail}
        linkedinUrl={linkedinUrl}
        githubUrl={githubUrl}
        socialLinks={socialLinks}
        onSave={(data, options) => {
          persistIdentity(data);
          const unlockedProfileMission = gamificationService.recordProfileUpdate({
            bio: userBio,
            title: userTitle,
            organization: userOrganization,
            email: data.workEmail,
            socialLinksCount: countProfileSocialLinks(
              data.linkedinUrl,
              data.githubUrl,
              data.socialLinks
            ),
          });
          if (unlockedProfileMission) {
            setMetricToast('Profile completed · Tap Claim +1 Slot in Earn Servers!');
            notificationService.playSentChime();
            notificationService.notify(
              'Mission Ready to Claim!',
              'You completed "Complete Your Profile". Tap Claim +1 Slot in Earn Servers!'
            );
          } else if (!options?.silent) {
            setMetricToast('Identity & links updated');
            notificationService.playSentChime();
          }
        }}
      />

      {/* Edit Key Achievements Modal */}
      <EditAchievementsModal
        isOpen={showEditAchievementsModal}
        onClose={() => {
          setShowEditAchievementsModal(false);
          setEditingAchievementId(null);
        }}
        achievements={achievements}
        metrics={achievementMetrics}
        initialEditId={editingAchievementId}
        onSave={handleSaveAchievements}
      />

      {/* Dedicated All Posts Screen for Author */}
      {showAllPostsScreen && (
        <UserPostsScreen
          user={{
            id: CURRENT_USER.id,
            name: CURRENT_USER.name,
            avatar: CURRENT_USER.avatar,
            headline: CURRENT_USER.customStatus,
            username: '@jennies',
            organization: userOrganization,
          }}
          posts={jenniesPosts}
          isOpen={showAllPostsScreen}
          onClose={() => {
            setShowAllPostsScreen(false);
            setTargetPostId(null);
          }}
          targetPostId={targetPostId}
          onDeletePost={handleDeleteJenniesPost}
          onRepostPost={handleRepostJenniesPost}
        />
      )}
      {/* Communities & Connections Viewer for Jennies Vance */}
      {networkSheetTab && (
        <ProfileNetworkSheet
          isOpen={!!networkSheetTab}
          onClose={() => setNetworkSheetTab(null)}
          initialTab={networkSheetTab}
          profileName={userName}
          profileId={CURRENT_USER.id}
          communitiesCount={displayedCommunitiesCount}
          connectionsCount={displayedConnectionsCount}
          userPlan={userPlan}
          onUnlockPlan={onUnlockPlan}
          isOwnProfile
          ownCommunities={communities}
          onMessageUser={onStartDirectChatWithUser}
        />
      )}
    </div>
  );
};
