import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Gift,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  ArrowRight,
  User,
  FileText,
  MessageCircle,
  Handshake,
  Trophy,
  CalendarCheck,
  Users,
  Lock,
  Sparkles,
  Send,
  Crown,
} from 'lucide-react';
import {
  gamificationService,
  INITIAL_GAMIFICATION_TASKS,
  MAX_FREE_EARNED_SERVER_SLOTS,
  GamificationTask,
  MissionTier,
} from '../utils/gamificationService';
import { notificationService } from '../services/notifications';
import { UserPlan } from '../types';

interface GamificationDashboardProps {
  onServerSlotsUpdated?: (newTotalBonus: number) => void;
  onFeedViewsUnlocked?: (bonusViews: number) => void;
  onNavigateToProfile?: () => void;
  onNavigateToFeed?: () => void;
  onNavigateToServers?: () => void;
  onOpenSubscription?: () => void;
  userPlan?: UserPlan;
  mode?: 'servers' | 'feed';
  isModal?: boolean;
  defaultExpanded?: boolean;
  onClose?: () => void;
  className?: string;
}

interface MissionSectionConfig {
  tier: MissionTier;
  title: string;
  subtitle: string;
}

const MISSION_SECTIONS: MissionSectionConfig[] = [
  {
    tier: 'starter',
    title: 'Starter Missions',
    subtitle: 'Build your foundation',
  },
  {
    tier: 'community',
    title: 'Community Missions',
    subtitle: 'Be an active member',
  },
  {
    tier: 'advanced',
    title: 'Advanced Missions',
    subtitle: 'Stand out in the community',
  },
];

/** Glossy 3D-styled hexagonal star shield with orbital ring for the hero progress card */
const MissionShieldBadge: React.FC = () => (
  <svg
    viewBox="0 0 88 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[68px] h-[58px] shrink-0 select-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="shieldOuter" x1="16" y1="8" x2="70" y2="68" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B89BFF" />
        <stop offset="50%" stopColor="#7C4DFF" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      <linearGradient id="shieldInner" x1="22" y1="14" x2="64" y2="62" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8F63FF" />
        <stop offset="100%" stopColor="#5E29E8" />
      </linearGradient>
      <linearGradient id="orbitGrad" x1="4" y1="54" x2="84" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.9" />
      </linearGradient>
      <filter id="starShadow" x="24" y="20" width="40" height="40" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#3B0764" floodOpacity="0.32" />
      </filter>
    </defs>

    <ellipse cx="44" cy="68" rx="22" ry="5" fill="#7C3AED" fillOpacity="0.16" />

    <path
      d="M 10 47 C 6 35, 25 22, 48 20 C 68 18, 82 24, 80 34"
      stroke="url(#orbitGrad)"
      strokeWidth="2.4"
      strokeLinecap="round"
      fill="none"
    />

    <path
      d="M44 10 L65 21.5 C67 22.6 68.2 24.7 68.2 27 V49 C68.2 51.3 67 53.4 65 54.5 L44 66 L23 54.5 C21 53.4 19.8 51.3 19.8 49 V27 C19.8 24.7 21 22.6 23 21.5 L44 10Z"
      fill="url(#shieldOuter)"
    />

    <path
      d="M44 14.5 L61.5 24.2 C63 25 64 26.6 64 28.4 V47.6 C64 49.4 63 51 61.5 51.8 L44 61.5 L26.5 51.8 C25 51 24 49.4 24 47.6 V28.4 C24 26.6 25 25 26.5 24.2 L44 14.5Z"
      fill="url(#shieldInner)"
      stroke="#D8C7FF"
      strokeOpacity="0.55"
      strokeWidth="1.2"
    />

    <g filter="url(#starShadow)">
      <path
        d="M44 23.5 L47.7 31.1 L56.1 32.3 C57.2 32.5 57.6 33.8 56.8 34.6 L50.7 40.5 L52.2 48.8 C52.4 49.9 51.2 50.8 50.2 50.2 L44 46.9 L37.8 50.2 C36.8 50.8 35.6 49.9 35.8 48.8 L37.3 40.5 L31.2 34.6 C30.4 33.8 30.8 32.5 31.9 32.3 L40.3 31.1 L44 23.5Z"
        fill="#FFFFFF"
      />
    </g>

    <path
      d="M 80 34 C 78 46, 58 55, 36 56 C 18 57, 8 53, 10 47"
      stroke="url(#orbitGrad)"
      strokeWidth="2.6"
      strokeLinecap="round"
      fill="none"
    />

    <path d="M16 19 L17.3 22 L20.2 23.2 L17.3 24.4 L16 27.4 L14.8 24.4 L11.8 23.2 L14.8 22 Z" fill="#8B5CF6" />
    <path d="M74 52 L75 54.4 L77.4 55.4 L75 56.4 L74 58.8 L73 56.4 L70.6 55.4 L73 54.4 Z" fill="#A78BFA" />
    <circle cx="71" cy="17" r="2" fill="#C4B5FD" />
  </svg>
);

/** Glossy 3D-styled purple gift box with golden ribbon & bow for the bottom banner */
const RewardsGiftIllustration: React.FC = () => (
  <svg
    viewBox="0 0 76 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-[60px] h-[54px] shrink-0 select-none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="boxLeft" x1="14" y1="28" x2="36" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9B72FF" />
        <stop offset="100%" stopColor="#6C3BF5" />
      </linearGradient>
      <linearGradient id="boxRight" x1="36" y1="28" x2="62" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#7C4DFF" />
        <stop offset="100%" stopColor="#4C1D95" />
      </linearGradient>
      <linearGradient id="lidTop" x1="12" y1="18" x2="64" y2="34" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="goldRibbon" x1="20" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>

    <ellipse cx="38" cy="61" rx="22" ry="4.5" fill="#7C3AED" fillOpacity="0.16" />

    <path d="M16 31 L36 39 L36 59 L18 51 C16.8 50.4 16 49.2 16 47.9 V31Z" fill="url(#boxLeft)" />
    <path d="M36 39 L60 31 V47.9 C60 49.2 59.2 50.4 58 51 L36 59 V39Z" fill="url(#boxRight)" />

    <path d="M23.5 34 L29 36.2 V56 L23.5 53.5 V34Z" fill="url(#goldRibbon)" />
    <path d="M45 36 L51 34 V53.5 L45 55.8 V36Z" fill="url(#goldRibbon)" />

    <path d="M13 24.5 L36 16 L63 24.5 L36 34.5 L13 24.5Z" fill="url(#lidTop)" />
    <path d="M13 24.5 L36 34.5 V40.5 L13 30.5 V24.5Z" fill="#7C4DFF" />
    <path d="M36 34.5 L63 24.5 V30.5 L36 40.5 V34.5Z" fill="#5B21B6" />

    <path d="M22.5 28.6 L48 19.8 L53 21.4 L28 31 L22.5 28.6Z" fill="url(#goldRibbon)" />
    <path d="M23 20.5 L51 29.8 L45.5 31.8 L18.5 22.3 L23 20.5Z" fill="url(#goldRibbon)" />

    <path
      d="M36 22 C31 15 22 14 23 20 C24 24.5 31 24.5 36 22Z"
      fill="url(#goldRibbon)"
      stroke="#F59E0B"
      strokeWidth="0.8"
    />
    <path
      d="M36 22 C41 13 51 12 50 18.5 C49 23.5 41 24 36 22Z"
      fill="url(#goldRibbon)"
      stroke="#F59E0B"
      strokeWidth="0.8"
    />
    <circle cx="36" cy="22" r="3.4" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />

    <path d="M67 16 L68 18.5 L70.5 19.5 L68 20.5 L67 23 L66 20.5 L63.5 19.5 L66 18.5 Z" fill="#8B5CF6" />
    <circle cx="10" cy="40" r="2" fill="#A78BFA" />
  </svg>
);

const renderMissionIcon = (iconName: GamificationTask['iconName'], isClaimed: boolean) => {
  if (isClaimed) {
    return <CheckCircle2 className="w-[18px] h-[18px]" />;
  }
  switch (iconName) {
    case 'User':
      return <User className="w-[18px] h-[18px]" />;
    case 'FileText':
      return <FileText className="w-[18px] h-[18px]" />;
    case 'MessageCircle':
      return <MessageCircle className="w-[18px] h-[18px]" />;
    case 'Handshake':
      return <Handshake className="w-[18px] h-[18px]" />;
    case 'Trophy':
      return <Trophy className="w-[18px] h-[18px]" />;
    case 'CalendarCheck':
      return <CalendarCheck className="w-[18px] h-[18px]" />;
    default:
      return <Sparkles className="w-[18px] h-[18px]" />;
  }
};

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  onServerSlotsUpdated,
  onFeedViewsUnlocked,
  onNavigateToProfile,
  onNavigateToFeed,
  onNavigateToServers,
  onOpenSubscription,
  userPlan = 'free',
  mode = 'servers',
  isModal = false,
  defaultExpanded,
  onClose,
  className = '',
}) => {
  const [bonusSlots, setBonusSlots] = useState(() => gamificationService.getBonusServerSlots());
  const [bonusFeedViews, setBonusFeedViews] = useState(() => gamificationService.getBonusFeedViews());
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() =>
    gamificationService.getCompletedTaskIds()
  );
  const [completedFeedTaskIds, setCompletedFeedTaskIds] = useState<string[]>(() =>
    gamificationService.getCompletedFeedTaskIds()
  );
  const [, setProgressTick] = useState(0);
  const [showExpanded, setShowExpanded] = useState(
    defaultExpanded ?? (mode === 'feed' || isModal)
  );
  const [showRewardsDrawer, setShowRewardsDrawer] = useState(false);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  // Weekly Architecture Challenge real submission composer
  const [showChallengeComposer, setShowChallengeComposer] = useState(false);
  const [challengeApproach, setChallengeApproach] = useState('');
  const [challengeReasoning, setChallengeReasoning] = useState('');
  const [challengeError, setChallengeError] = useState<string | null>(null);

  useEffect(() => {
    const syncState = () => {
      const updatedBonus = gamificationService.getBonusServerSlots();
      const updatedFeedBonus = gamificationService.getBonusFeedViews();
      setBonusSlots(updatedBonus);
      setBonusFeedViews(updatedFeedBonus);
      setCompletedTaskIds(gamificationService.getCompletedTaskIds());
      setCompletedFeedTaskIds(gamificationService.getCompletedFeedTaskIds());
      setProgressTick((t) => t + 1);
      onServerSlotsUpdated?.(updatedBonus);
      onFeedViewsUnlocked?.(updatedFeedBonus);
    };
    syncState();
    return gamificationService.subscribe(syncState);
  }, [onServerSlotsUpdated, onFeedViewsUnlocked]);

  const showTempNotice = (message: string) => {
    setInfoNotice(message);
    window.setTimeout(() => {
      setInfoNotice((curr) => (curr === message ? null : curr));
    }, 3400);
  };

  const activeCompletedIds = mode === 'feed' ? completedFeedTaskIds : completedTaskIds;
  const completedCount = activeCompletedIds.length;
  const totalTasks = INITIAL_GAMIFICATION_TASKS.length;
  const totalPossibleSlots = INITIAL_GAMIFICATION_TASKS.reduce(
    (sum, task) => sum + task.rewardSlots,
    0
  );
  const isFreePlan = userPlan === 'free';
  const displayedBonusSlots =
    mode === 'servers' && isFreePlan
      ? Math.min(MAX_FREE_EARNED_SERVER_SLOTS, bonusSlots)
      : bonusSlots;
  const hasReachedFreeSlotCap =
    mode === 'servers' && isFreePlan && displayedBonusSlots >= MAX_FREE_EARNED_SERVER_SLOTS;

  // Advanced missions unlock only after completing Starter & Community missions above
  const prerequisiteIds = useMemo(
    () =>
      INITIAL_GAMIFICATION_TASKS.filter(
        (task) => task.tier === 'starter' || task.tier === 'community'
      ).map((t) => t.id),
    []
  );

  const areAdvancedUnlocked = useMemo(
    () => prerequisiteIds.every((id) => activeCompletedIds.includes(id)),
    [prerequisiteIds, activeCompletedIds]
  );

  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  /**
   * Clicking Start or Continue NEVER grants a reward directly.
   * Instead it sends the user to perform the real activity in the app.
   */
  const handleStartOrContinueMission = (task: GamificationTask, isTierLocked: boolean) => {
    if (isTierLocked) {
      showTempNotice(
        'Complete Starter Missions and Community Missions above to unlock Advanced Missions.'
      );
      return;
    }

    const status = gamificationService.getMissionStatus(task.id);

    switch (task.targetDestination) {
      case 'profile': {
        onClose?.();
        onNavigateToProfile?.();
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('cronium:mission-action', {
              detail: { missionId: task.id },
            })
          );
        }, 120);
        notificationService.notify(
          'Mission: Complete Your Profile',
          `Add a bio, Title, organization, 1 email, 2 social media links, and 1 achievement (${status.progressText}).`
        );
        break;
      }

      case 'feed-post': {
        onClose?.();
        onNavigateToFeed?.();
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('cronium:mission-action', {
              detail: { missionId: task.id },
            })
          );
        }, 120);
        notificationService.notify(
          'Mission: Publish a Technical Insight',
          'Share an original post with an explanation and reference in the Feed.'
        );
        break;
      }

      case 'feed-discussions': {
        onClose?.();
        onNavigateToFeed?.();
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('cronium:mission-action', {
              detail: { missionId: task.id },
            })
          );
        }, 120);
        notificationService.notify(
          'Mission: Contribute to Peer Discussions',
          `Write 10 comments and replies across 5 discussions (${status.progressText}).`
        );
        break;
      }

      case 'servers-dm': {
        onClose?.();
        onNavigateToServers?.();
        window.setTimeout(() => {
          window.dispatchEvent(
            new CustomEvent('cronium:mission-action', {
              detail: { missionId: task.id },
            })
          );
        }, 120);
        notificationService.notify(
          'Mission: Build Meaningful Connections',
          `Message 5 members who share your interests (${status.progressText}).`
        );
        break;
      }

      case 'challenge-modal': {
        setChallengeError(null);
        setShowChallengeComposer(true);
        break;
      }

      case 'feed-engage': {
        onClose?.();
        onNavigateToFeed?.();
        notificationService.notify(
          'Mission: Maintain Community Engagement',
          `Make meaningful contributions on 3 separate days this week (${status.progressText}).`
        );
        break;
      }
    }
  };

  /**
   * Only reachable after real activity verification passes (`status.isReady === true`)
   */
  const handleClaimVerifiedReward = (task: GamificationTask) => {
    if (activeCompletedIds.includes(task.id)) return;
    if (!gamificationService.isMissionReady(task.id)) {
      showTempNotice('Complete the real activity for this mission first to unlock its reward.');
      return;
    }

    if (mode === 'feed') {
      const res = gamificationService.completeFeedTask(task.id);
      if (res.success) {
        notificationService.playSentChime();
        notificationService.notify(
          `+${res.earnedViews} Feed Views Unlocked!`,
          `You completed "${task.title}" and unlocked +${res.earnedViews} extra daily post views!`
        );
      }
      return;
    }

    const res = gamificationService.completeTask(task.id, userPlan);
    if (res.requiresSubscription) {
      showTempNotice(
        `Free accounts can earn up to ${MAX_FREE_EARNED_SERVER_SLOTS} server slots. Unlock Cronium Subscription to claim more slots!`
      );
      onOpenSubscription?.();
      return;
    }
    if (res.success) {
      const baseSlots = userPlan === 'pro' ? 10 : userPlan === 'plus' ? 5 : 2;
      notificationService.playSentChime();
      notificationService.notify(
        `Server Slot Unlocked!`,
        `You completed "${task.title}" and earned +${task.rewardSlots} extra server ${
          task.rewardSlots > 1 ? 'slots' : 'slot'
        }! Total capacity: ${baseSlots + res.totalSlots} servers.`
      );
    }
  };

  const handleSubmitArchitectureChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (challengeApproach.trim().length < 10) {
      setChallengeError('Please describe your architecture approach (at least 10 characters).');
      return;
    }
    if (challengeReasoning.trim().length < 10) {
      setChallengeError('Please explain your reasoning and trade-offs (at least 10 characters).');
      return;
    }

    const unlocked = gamificationService.recordArchitectureChallenge(
      challengeApproach,
      challengeReasoning
    );
    setChallengeError(null);
    setShowChallengeComposer(false);
    notificationService.playSentChime();
    if (unlocked) {
      showTempNotice('Solution verified! Tap Claim +2 on Weekly Architecture Challenge to unlock your slots.');
    }
  };

  const content = (
    <div id="gamification-dashboard" className={`w-full @container ${className}`}>
      {/* Pure White Outer Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 shadow-[0_8px_30px_rgba(15,23,42,0.06)] overflow-hidden transition-all">
        {/* Header Bar */}
        <div
          onClick={!isModal ? () => setShowExpanded((prev) => !prev) : undefined}
          className={`px-4 py-3.5 bg-white dark:bg-slate-900 flex items-center justify-between gap-2.5 select-none group ${
            !isModal
              ? 'cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors'
              : ''
          }`}
          title={!isModal ? (showExpanded ? 'Collapse missions' : 'Expand missions') : undefined}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#F3EFFF] dark:bg-violet-950/70 text-[#6C3BF5] dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[16px] @[440px]:text-[18px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug truncate">
                {mode === 'feed' ? 'Earn Servers' : 'Earn Servers'}
              </h3>
              <p className="text-[11.5px] @[440px]:text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                Complete missions, unlock rewards ✨
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-[#E6F8EE] dark:bg-emerald-950/70 text-[#15803D] dark:text-emerald-300 text-xs font-bold tabular-nums whitespace-nowrap">
              {mode === 'feed'
                ? `+${bonusFeedViews} views`
                : isFreePlan
                ? `+${displayedBonusSlots}/${MAX_FREE_EARNED_SERVER_SLOTS} slots`
                : `+${displayedBonusSlots} slots`}
            </span>
            {!isModal && !showExpanded && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExpanded(true);
                }}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Expand missions"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            {isModal && onClose && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
                aria-label="Close Earn Servers"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expanded Missions Workspace — Pure Crisp White Background */}
        {showExpanded && (
          <>
          <div className="px-3.5 @[440px]:px-5 pb-4 pt-1 bg-white dark:bg-slate-900 space-y-3.5 animate-in fade-in duration-200">
            {/* Hero Progress Banner Card */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E8E2FC] dark:border-violet-900/50 shadow-[0_4px_20px_rgba(108,59,245,0.06)] p-3.5 @[440px]:p-4 flex items-center gap-3 @[440px]:gap-4">
              <div className="hidden @[340px]:block">
                <MissionShieldBadge />
              </div>

              <div className="min-w-0 flex-1 text-left">
                <div className="text-[15px] @[440px]:text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums leading-snug">
                  {completedCount} / {totalTasks} Missions Completed
                </div>
                <p className="text-[11.5px] @[440px]:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {mode === 'servers' && isFreePlan
                    ? `Earn up to ${MAX_FREE_EARNED_SERVER_SLOTS} free server slots · Unlock Cronium for more!`
                    : 'Complete missions to unlock more server slots!'}
                </p>
                {/* Progress Track */}
                <div className="mt-2.5 h-2 w-full rounded-full bg-[#EFEBF9] dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6366F1] transition-all duration-500"
                    style={{ width: `${Math.max(progressPercent, completedCount > 0 ? 8 : 0)}%` }}
                  />
                </div>
              </div>

              {/* Right Earned Slots Stat Box */}
              <div className="rounded-2xl bg-[#F5F2FF] dark:bg-violet-950/50 border border-[#EAE4FF] dark:border-violet-900/60 px-3 py-2.5 flex flex-col items-center justify-center min-w-[74px] @[440px]:min-w-[84px] shrink-0">
                <Users className="w-4 h-4 text-[#6C3BF5] dark:text-violet-400" />
                <div className="text-[15px] @[440px]:text-[17px] font-extrabold text-slate-900 dark:text-white tabular-nums leading-none mt-1">
                  {mode === 'feed' ? `+${bonusFeedViews}` : `+${displayedBonusSlots}`}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1 whitespace-nowrap">
                  {mode === 'feed'
                    ? 'Feed Views'
                    : isFreePlan
                    ? `Max ${MAX_FREE_EARNED_SERVER_SLOTS} Free`
                    : 'Server Slots'}
                </div>
              </div>
            </div>

            {/* Free 3-Slot Cap Reached Upgrade Banner */}
            {hasReachedFreeSlotCap && (
              <div className="p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/70 flex flex-col @[420px]:flex-row @[420px]:items-center justify-between gap-2.5 text-left animate-in fade-in duration-150">
                <div className="flex items-start @[420px]:items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-amber-950 dark:text-amber-200 leading-snug">
                      Free Limit Reached ({MAX_FREE_EARNED_SERVER_SLOTS}/{MAX_FREE_EARNED_SERVER_SLOTS} Slots Claimed)
                    </div>
                    <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-snug mt-0.5">
                      Unlock the Cronium Subscription to claim additional server slots.
                    </p>
                  </div>
                </div>
                {onOpenSubscription && (
                  <button
                    type="button"
                    onClick={onOpenSubscription}
                    className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer shadow-xs transition-all"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Unlock Cronium</span>
                  </button>
                )}
              </div>
            )}

            {/* Ready-to-Claim Highlight Banner when user finishes a real activity */}
            {!hasReachedFreeSlotCap &&
              INITIAL_GAMIFICATION_TASKS.some(
                (t) =>
                  !activeCompletedIds.includes(t.id) &&
                  !(t.tier === 'advanced' && !areAdvancedUnlocked) &&
                  gamificationService.isMissionReady(t.id) &&
                  (mode === 'feed' || gamificationService.canClaimServerSlots(t.rewardSlots, userPlan))
              ) && (
              <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/70 text-[11.5px] font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in duration-150 text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Mission activity completed! Tap the green Claim button below to unlock your server slots.
                </span>
              </div>
            )}

            {/* Subtle Info / Locked Feedback Banner */}
            {infoNotice && (
              <div className="px-3.5 py-2.5 rounded-xl bg-[#F5F2FF] dark:bg-violet-950/60 border border-[#E5DCFF] dark:border-violet-800/70 text-[11.5px] font-medium text-[#5B21B6] dark:text-violet-300 flex items-center gap-2 animate-in fade-in duration-150 text-left">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>{infoNotice}</span>
              </div>
            )}

            {/* Inline Weekly Architecture Challenge Submission Card (only when launched) */}
            {showChallengeComposer && (
              <form
                onSubmit={handleSubmitArchitectureChallenge}
                className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#6C3BF5]/40 p-4 space-y-3 text-left shadow-md animate-in fade-in duration-150"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-extrabold text-[#6C3BF5] uppercase tracking-wider">
                      Weekly Architecture Challenge
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Design a fault-tolerant, low-latency message fan-out queue for 100k concurrent AI agents.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowChallengeComposer(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Approach (min 10 characters)
                  </label>
                  <textarea
                    rows={2}
                    value={challengeApproach}
                    onChange={(e) => setChallengeApproach(e.target.value)}
                    placeholder="Outline your partitioning, replication, and backpressure strategy..."
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3BF5] resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Reasoning &amp; Trade-offs (min 10 characters)
                  </label>
                  <textarea
                    rows={2}
                    value={challengeReasoning}
                    onChange={(e) => setChallengeReasoning(e.target.value)}
                    placeholder="Explain latency vs consistency trade-offs and failure recovery..."
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#6C3BF5] resize-none"
                  />
                </div>

                {challengeError && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    {challengeError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowChallengeComposer(false)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-[#6C3BF5] hover:bg-[#5B2DE0] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit Solution</span>
                  </button>
                </div>
              </form>
            )}

            {/* 3 Grouped Mission Section Cards (Pure White Surfaces) */}
            <div className="space-y-3">
              {MISSION_SECTIONS.map((section) => {
                const sectionTasks = INITIAL_GAMIFICATION_TASKS.filter(
                  (task) => task.tier === section.tier
                );
                const sectionSlotSum = sectionTasks.reduce((sum, t) => sum + t.rewardSlots, 0);
                const isTierLocked = section.tier === 'advanced' && !areAdvancedUnlocked;

                return (
                  <div
                    key={section.tier}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] overflow-hidden"
                  >
                    {/* Section Header */}
                    <div className="px-3.5 @[440px]:px-4 py-2.5 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
                      <div className="flex items-center gap-2 min-w-0 flex-1 flex-wrap">
                        <span className="w-2 h-2 rounded-full bg-[#6C3BF5] shrink-0" />
                        <span className="text-[12.5px] @[440px]:text-[13.5px] font-bold text-[#6C3BF5] dark:text-violet-400 whitespace-nowrap">
                          {section.title}
                        </span>
                        <span className="text-[11px] @[440px]:text-xs text-slate-400 dark:text-slate-500 truncate">
                          {section.subtitle}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F3EFFF] dark:bg-violet-950/70 text-[#6C3BF5] dark:text-violet-300 text-[11px] font-bold tabular-nums whitespace-nowrap shrink-0">
                        {mode === 'feed'
                          ? `+${sectionSlotSum * 10} views`
                          : `${sectionSlotSum} ${sectionSlotSum === 1 ? 'slot' : 'slots'}`}
                      </span>
                    </div>

                    {/* Mission Rows */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {sectionTasks.map((task) => {
                        const isClaimed = activeCompletedIds.includes(task.id);
                        const status = gamificationService.getMissionStatus(task.id);
                        const rewardBadgeText =
                          mode === 'feed' ? `+${task.rewardSlots * 10}` : `+${task.rewardSlots}`;
                        const actionLabel = status.isStarted ? 'Continue' : task.actionText;

                        return (
                          <div
                            key={task.id}
                            className="px-3.5 @[440px]:px-4 py-3 bg-white dark:bg-slate-900 flex flex-col @[460px]:flex-row @[460px]:items-center justify-between gap-2.5 @[460px]:gap-3 text-left transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                          >
                            {/* Icon + Title & Description */}
                            <div className="flex items-start @[460px]:items-center gap-3 min-w-0 flex-1">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  isClaimed || status.isReady
                                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-[#F4F1FF] dark:bg-violet-950/60 text-[#6C3BF5] dark:text-violet-400'
                                }`}
                              >
                                {renderMissionIcon(task.iconName, isClaimed)}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4 className="text-[13.5px] @[440px]:text-[14px] font-bold text-slate-900 dark:text-white leading-snug">
                                  {task.title}
                                </h4>
                                <p className="text-[11.5px] @[440px]:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                  {task.description}
                                </p>
                                {/* Real activity progress readout once started or ready */}
                                {!isClaimed && !isTierLocked && (status.isStarted || status.isReady) && (
                                  <div
                                    className={`text-[10.5px] font-semibold mt-1 tabular-nums ${
                                      status.isReady
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-[#6C3BF5] dark:text-violet-400'
                                    }`}
                                  >
                                    {status.progressText}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Reward Pill + Verified Action Button */}
                            <div className="flex items-center justify-end gap-2 shrink-0 pl-[52px] @[460px]:pl-0">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-extrabold tabular-nums flex items-center gap-1 whitespace-nowrap ${
                                  isClaimed || status.isReady
                                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-[#F6F3FF] dark:bg-violet-950/60 text-[#6C3BF5] dark:text-violet-300'
                                }`}
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                <span>{rewardBadgeText}</span>
                              </span>

                              {isClaimed ? (
                                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800 text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Claimed</span>
                                </span>
                              ) : isTierLocked ? (
                                <button
                                  type="button"
                                  onClick={() => handleStartOrContinueMission(task, true)}
                                  className="px-3 py-1.5 rounded-full bg-[#F3F0FA] dark:bg-slate-800 text-[#8B83A8] dark:text-slate-400 text-[10px] font-semibold leading-tight text-center max-w-[116px] cursor-pointer hover:bg-[#ECE7F8] dark:hover:bg-slate-700/80 transition-colors"
                                  title="Unlocks after completing above"
                                >
                                  Unlocks after completing above
                                </button>
                                ) : status.isReady ? (
                                mode === 'servers' &&
                                !gamificationService.canClaimServerSlots(task.rewardSlots, userPlan) ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      showTempNotice(
                                        `Free accounts can earn up to ${MAX_FREE_EARNED_SERVER_SLOTS} server slots. Unlock Cronium Subscription to claim more slots!`
                                      );
                                      onOpenSubscription?.();
                                    }}
                                    className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold shadow-[0_4px_14px_rgba(245,158,11,0.3)] flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer"
                                    title="Unlock Cronium Subscription to claim more than 3 server slots"
                                  >
                                    <Crown className="w-3.5 h-3.5" />
                                    <span>Unlock to Claim</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleClaimVerifiedReward(task)}
                                    className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-[0_4px_14px_rgba(5,150,105,0.3)] flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>
                                      {mode === 'feed'
                                        ? `Claim +${task.rewardSlots * 10}`
                                        : `Claim +${task.rewardSlots} ${
                                            task.rewardSlots > 1 ? 'Slots' : 'Slot'
                                          }`}
                                    </span>
                                  </button>
                                )
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleStartOrContinueMission(task, false)}
                                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#7C3AED] via-[#6C3BF5] to-[#5B21B6] hover:from-[#6D28D9] hover:to-[#4C1D95] active:scale-95 text-white text-xs font-bold shadow-[0_4px_14px_rgba(108,59,245,0.32)] flex items-center gap-1 whitespace-nowrap transition-all cursor-pointer"
                                >
                                  <span>{actionLabel}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Rewards CTA Banner — Clean White Surface */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#E8E2FC] dark:border-violet-900/50 shadow-[0_4px_18px_rgba(108,59,245,0.05)] overflow-hidden">
              <div className="p-3.5 @[440px]:p-4 flex flex-col @[420px]:flex-row @[420px]:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
                  <RewardsGiftIllustration />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13.5px] @[440px]:text-[14.5px] font-extrabold text-slate-900 dark:text-white leading-snug">
                      Complete missions. Unlock more possibilities.
                    </h4>
                    <p className="text-[11.5px] @[440px]:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Grow your presence and access more communities!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRewardsDrawer((prev) => !prev)}
                  className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 hover:bg-[#F7F4FF] dark:hover:bg-slate-700 text-[#6C3BF5] dark:text-violet-300 border border-[#E2DAFC] dark:border-violet-800 shadow-[0_2px_8px_rgba(108,59,245,0.08)] text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer active:scale-95 transition-all"
                >
                  <span>{showRewardsDrawer ? 'Hide Rewards' : 'View Rewards'}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showRewardsDrawer ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Expandable Rewards Breakdown Panel */}
              {showRewardsDrawer && (
                <div className="px-4 pb-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 animate-in fade-in duration-150 text-left">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        {mode === 'feed' ? 'Unlocked' : isFreePlan ? 'Base Free' : userPlan === 'pro' ? 'Cronium Pro' : 'Cronium Plus'}
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums mt-0.5">
                        {mode === 'feed'
                          ? `+${bonusFeedViews} views`
                          : userPlan === 'pro'
                          ? '10 slots'
                          : userPlan === 'plus'
                          ? '5 slots'
                          : '2 slots'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        Earned
                      </div>
                      <div className="text-sm font-extrabold text-[#6C3BF5] dark:text-violet-400 tabular-nums mt-0.5">
                        {mode === 'feed'
                          ? `${completedCount}/${totalTasks} done`
                          : isFreePlan
                          ? `+${displayedBonusSlots} / ${MAX_FREE_EARNED_SERVER_SLOTS} free`
                          : `+${displayedBonusSlots} / ${totalPossibleSlots}`}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                        Total Capacity
                      </div>
                      <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                        {mode === 'feed'
                          ? `${totalPossibleSlots * 10} max`
                          : `${
                              (userPlan === 'pro' ? 10 : userPlan === 'plus' ? 5 : 2) +
                              displayedBonusSlots
                            } servers`}
                      </div>
                    </div>
                  </div>

                  {mode === 'servers' && isFreePlan && onOpenSubscription && (
                    <button
                      type="button"
                      onClick={onOpenSubscription}
                      className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>Unlock Cronium Subscription for More Slots</span>
                    </button>
                  )}

                  {onNavigateToServers && mode === 'servers' && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose?.();
                        onNavigateToServers();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#6C3BF5] hover:bg-[#5B2DE0] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Go to Servers &amp; DMs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Full-width See less collapse bar at bottom of Earn Servers */}
          <button
            type="button"
            onClick={() => {
              if (isModal && onClose) {
                onClose();
                return;
              }
              setShowExpanded(false);
              window.setTimeout(() => {
                document.getElementById('gamification-dashboard')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest',
                });
              }, 40);
            }}
            className="w-full py-3.5 px-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-[#F7F4FF]/70 dark:hover:bg-violet-950/30 text-xs font-semibold text-[#6C3BF5] dark:text-violet-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>See less</span>
            <ChevronUp className="w-4 h-4" />
          </button>
          </>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[540px] max-h-[92vh] overflow-y-auto rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return content;
};
