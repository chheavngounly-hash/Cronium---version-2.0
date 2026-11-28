import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  Check,
  UserPlus,
  MessageSquare,
  Landmark,
  GraduationCap,
  Building2,
  Mail,
  Linkedin,
  Github,
  Copy,
  ExternalLink,
  Trophy,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  QrCode,
  Share2,
} from 'lucide-react';
import { Post } from '../types/social';
import { UserPlan } from '../types';
import { UserPostsSection } from './UserPostsSection';
import { UserPostsScreen } from './UserPostsScreen';
import { ProfileNetworkSheet } from './ProfileNetworkSheet';
import { notificationService } from '../services/notifications';
import { CURRENT_USER } from '../data/mockData';
import { getProfileBadgeStyle } from '../utils/profileBadge';
import { ProfileQrModal } from './ProfileQrModal';

export interface UnifiedProfileAchievement {
  id?: string;
  icon: string;
  title: string;
  organization: string;
  year: string;
  description?: string;
}

export interface UnifiedProfileData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverUrl: string;
  title: string;
  bio: string;
  organization?: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  status?: 'online' | 'away' | 'offline';
  communitiesCount: number;
  connectionsCount: number;
  achievementsCount?: number;
  metrics: {
    honors: string;
    patentsCount: number | string;
    contributorRank: string;
  };
  achievements: UnifiedProfileAchievement[];
  safetyNumber?: string;
}

interface UnifiedProfileViewProps {
  profile: UnifiedProfileData;
  posts: Post[];
  onClose: () => void;
  isFollowing: boolean;
  onToggleFollow?: () => void;
  onMessage?: () => void;
  showMessageButton?: boolean;
  showFollowButton?: boolean;
  userPlan?: UserPlan;
  onUnlockPlan?: (plan: UserPlan) => void;
}

function formatExternalDisplay(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

function normalizeExternalUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function deriveMeshFingerprint(seed: string): string {
  let h1 = 0x7f9b;
  let h2 = 0x48c2;
  let h3 = 0xe390;
  let h4 = 0x812f;
  for (let i = 0; i < seed.length; i++) {
    const ch = seed.charCodeAt(i);
    h1 = (h1 * 31 + ch) & 0xffff;
    h2 = (h2 * 37 + ch * 3) & 0xffff;
    h3 = (h3 * 41 + ch * 7) & 0xffff;
    h4 = (h4 * 43 + ch * 11) & 0xffff;
  }
  const hex = (n: number) => n.toString(16).toUpperCase().padStart(4, '0');
  return `0x${hex(h1)} · ${hex(h2)} · ${hex(h3)} · ${hex(h4)}`;
}

export const UnifiedProfileView: React.FC<UnifiedProfileViewProps> = ({
  profile,
  posts,
  onClose,
  isFollowing,
  onToggleFollow,
  onMessage,
  showMessageButton = true,
  showFollowButton = true,
  userPlan = 'free',
  onUnlockPlan,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [networkSheetTab, setNetworkSheetTab] = useState<'communities' | 'connections' | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<UnifiedProfileAchievement | null>(null);
  const [showAllPostsScreen, setShowAllPostsScreen] = useState(false);
  const [targetPostId, setTargetPostId] = useState<string | null>(null);
  const achievementsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowAllAchievements(false);
    setSelectedAchievement(null);
    setShowAllPostsScreen(false);
    setTargetPostId(null);
    setNetworkSheetTab(null);
    setShowQrModal(false);
    setCopiedField(null);
  }, [profile.id]);

  const handleCopy = (text: string, field: string) => {
    try {
      navigator.clipboard?.writeText(text);
      setCopiedField(field);
      notificationService.playSentChime();
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleShareProfile = () => {
    const cleanHandle = profile.username.replace(/^@/, '');
    try {
      navigator.clipboard?.writeText(`https://cronium.network/@${cleanHandle}`);
      notificationService.playSentChime();
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    } catch {
      // ignore
    }
  };

  const normalizedHandle = profile.username.startsWith('@')
    ? profile.username
    : `@${profile.username}`;
  const statusValue = profile.status || 'online';
  const statusLabel =
    statusValue === 'online' ? 'Online' : statusValue === 'away' ? 'Away' : 'Offline';
  const statusDotClass =
    statusValue === 'online'
      ? 'bg-[#10B981]'
      : statusValue === 'away'
      ? 'bg-amber-500'
      : 'bg-slate-400';

  const displayedAchievementsCount =
    profile.achievementsCount ?? (profile.achievements.length || 4);
  const linkedinDisplay = formatExternalDisplay(profile.linkedinUrl);
  const githubDisplay = formatExternalDisplay(profile.githubUrl);
  const meshKey = deriveMeshFingerprint(`${profile.id}::${profile.name}`);
  const isCurrentUserProfile =
    profile.id === CURRENT_USER.id ||
    profile.id === 'user_jennies' ||
    profile.name.trim().toLowerCase() === CURRENT_USER.name.trim().toLowerCase();
  const badgeStyle = getProfileBadgeStyle(profile.name, {
    isCurrentUser: isCurrentUserProfile,
    userPlan,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[468px] sm:max-w-[480px] h-full max-h-[92vh] sm:h-[804px] sm:max-h-[804px] bg-[#F8FAFC] dark:bg-slate-950 rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 flex flex-col text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable Profile Container matching Jennies Vance ProfileScreen structure */}
        <div className="overflow-y-auto flex-1 min-h-0">
          {/* Full-Bleed Architectural Cover Banner */}
          <div className="relative w-full h-[176px] sm:h-[186px] bg-slate-900 overflow-hidden shrink-0 group">
            <img
              src={profile.coverUrl}
              alt={`${profile.name} Cover Background`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* Subtle depth gradient for floating button legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-slate-950/25 pointer-events-none" />

            {/* Floating Top-Left Frosted White Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute left-4 top-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white dark:bg-slate-900/75 dark:hover:bg-slate-900 backdrop-blur-md text-slate-900 dark:text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Back"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2] -ml-0.5" />
            </button>

            {/* Floating Top-Right Frosted Circular Share & Close Controls */}
            <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareProfile}
                className="w-9 h-9 rounded-full bg-slate-700/65 hover:bg-slate-800/85 backdrop-blur-md text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Copy profile link"
                aria-label="Copy profile link"
              >
                {shareToast ? (
                  <Check className="w-[17px] h-[17px] text-emerald-300 stroke-[2.2]" />
                ) : (
                  <Share2 className="w-[17px] h-[17px] stroke-[2]" />
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-700/65 hover:bg-slate-800/85 backdrop-blur-md text-white flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Close profile"
                aria-label="Close profile"
              >
                <X className="w-[18px] h-[18px] stroke-[2.1]" />
              </button>
            </div>
          </div>

          {/* Overlapping Curved White Hero Surface */}
          <div className="relative z-10 -mt-5 rounded-t-[24px] bg-white dark:bg-slate-900 border-b border-slate-100/90 dark:border-slate-800/80 shrink-0">
            <div className="px-5 pt-0 pb-5 text-left">
              {/* Avatar + Right Action Pills */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="relative -mt-[46px] z-20 shrink-0">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-[92px] h-[92px] rounded-full object-cover object-top border-[4px] border-white dark:border-slate-900 shadow-md bg-slate-100 dark:bg-slate-800"
                  />
                  <span
                    className={`absolute bottom-0.5 right-0.5 w-[18px] h-[18px] ${statusDotClass} rounded-full border-[3px] border-white dark:border-slate-900 shadow-2xs`}
                    title={`Status: ${statusLabel}`}
                  />
                </div>

                {/* Action Pills matching Jennies ProfileScreen pill geometry */}
                <div className="flex items-center gap-1.5 sm:gap-2 pt-3 flex-wrap justify-end">
                  {showFollowButton && onToggleFollow && (
                    <button
                      type="button"
                      onClick={onToggleFollow}
                      className={`px-3.5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors cursor-pointer active:scale-95 ${
                        isFollowing
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.4]" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[2]" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}

                  {showMessageButton && onMessage && (
                    <button
                      type="button"
                      onClick={onMessage}
                      className="px-3.5 py-2 rounded-full bg-gradient-to-r from-[#5B4DF7] to-[#7C3AED] hover:from-[#4F46E5] hover:to-[#6D28D9] text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                      title={`Message ${profile.name}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 stroke-[2]" />
                      <span>Message</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors cursor-pointer active:scale-95 shrink-0"
                    title="View Public QR Card"
                    aria-label="View Public QR Card"
                  >
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
                {/* Name, Verified Checkmark, Handle & Status Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[23px] sm:text-[25px] font-bold text-slate-950 dark:text-white tracking-[-0.025em] leading-tight truncate">
                        {profile.name}
                      </h2>
                      <span
                        title={badgeStyle.title}
                        className={`w-[20px] h-[20px] rounded-full inline-flex items-center justify-center shrink-0 text-white ${badgeStyle.bgClass}`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    </div>
                    <span className="text-[13.5px] text-slate-500 dark:text-slate-400 font-normal block mt-0.5">
                      {normalizedHandle}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F5F8] dark:bg-slate-800 text-[12px] font-medium text-slate-700 dark:text-slate-200 shrink-0 mt-1">
                    <span className={`w-2 h-2 rounded-full ${statusDotClass} shrink-0`} />
                    <span>{statusLabel}</span>
                  </div>
                </div>

                {/* Role Title & Bio Description */}
                {profile.title && (
                  <p className="text-[14px] sm:text-[14.5px] font-semibold text-slate-900 dark:text-white leading-snug mt-4">
                    {profile.title}
                  </p>
                )}
                {profile.bio && (
                  <p className="text-[13.5px] sm:text-[14px] text-[#5B6472] dark:text-slate-300 leading-[1.55] mt-1.5 font-normal">
                    {profile.bio}
                  </p>
                )}

                {/* Organization & Alma Mater Row */}
                {profile.organization && (() => {
                  const orgParts = profile.organization
                    .split('•')
                    .map((p) => p.trim())
                    .filter(Boolean);
                  const primaryOrg = orgParts[0] || profile.organization;
                  const secondaryOrg = orgParts.slice(1).join(' • ');
                  const primaryLooksAcademic =
                    !secondaryOrg &&
                    /university|mit|stanford|harvard|berkeley|caltech|oxford|cambridge|eth|alum|institute|csail|college|school/i.test(
                      primaryOrg
                    );
                  return (
                    <div className="flex items-center flex-wrap gap-2 mt-3.5 text-[12px] sm:text-[12.5px] text-[#4E5969] dark:text-slate-400 font-normal">
                      <span className="inline-flex items-center gap-1.5 shrink-0">
                        {primaryLooksAcademic ? (
                          <GraduationCap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 stroke-[1.9]" />
                        ) : (
                          <Landmark className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0 stroke-[1.9]" />
                        )}
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
                    title={`View ${profile.name}'s communities`}
                  >
                    <span className="block text-[18px] sm:text-[19px] font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                      {profile.communitiesCount}
                    </span>
                    <span className="block text-[11.5px] text-slate-500 dark:text-slate-400 font-normal mt-1">
                      Communities
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNetworkSheetTab('connections')}
                    className="group py-1 px-1 hover:bg-slate-100/70 dark:hover:bg-slate-700/40 rounded-lg active:scale-[0.98] transition-all cursor-pointer text-center"
                    title={`View ${profile.name}'s connections`}
                  >
                    <span className="block text-[18px] sm:text-[19px] font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                      {(profile.connectionsCount ?? 0).toLocaleString()}
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
                    title={`Jump to ${profile.name}'s achievements below`}
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
            </div>
          </div>

          {/* Lower Card Stack with Vertically Aligned Left-Column Icons */}
          <div className="px-3.5 sm:px-4 pt-4 pb-6 space-y-4 text-left">
            {/* Section 1: Identity & Credentials */}
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
                        {profile.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
                    Verified
                  </span>
                </div>

                {/* LinkedIn Profile */}
                {linkedinDisplay && (
                  <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center shrink-0">
                        <Linkedin className="w-[18px] h-[18px] text-[#0A66C2]" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 block">LinkedIn Profile</span>
                        <a
                          href={normalizeExternalUrl(linkedinDisplay)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block transition-colors"
                        >
                          {linkedinDisplay}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(normalizeExternalUrl(linkedinDisplay), 'linkedin')}
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
                        href={normalizeExternalUrl(linkedinDisplay)}
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
                {githubDisplay && (
                  <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-900/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                        <Github className="w-[18px] h-[18px] text-slate-900 dark:text-slate-100" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] text-slate-400 block">GitHub Profile</span>
                        <a
                          href={normalizeExternalUrl(githubDisplay)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 truncate block transition-colors"
                        >
                          {githubDisplay}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(normalizeExternalUrl(githubDisplay), 'github')}
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
                        href={normalizeExternalUrl(githubDisplay)}
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
              </div>
            </div>

            {/* Section 2: Key Achievements (Exact Jennies Vance card style & aligned left icons) */}
            {profile.achievements.length > 0 && (
              <div
                ref={achievementsSectionRef}
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
                </div>

                {/* 3-Column Summary Metrics Strip */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 py-4 px-2 border-b border-slate-100 dark:border-slate-800 text-center">
                  <div className="px-1">
                    <span className="block text-[15px] font-bold text-amber-600 dark:text-amber-400 leading-tight">
                      {profile.metrics.honors}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Honors
                    </span>
                  </div>
                  <div className="px-1">
                    <span className="block text-[15px] font-bold text-slate-900 dark:text-white leading-tight tabular-nums">
                      {profile.metrics.patentsCount}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Patents &amp; Papers
                    </span>
                  </div>
                  <div className="px-1">
                    <span className="block text-[15px] font-bold text-[#4F46E5] dark:text-indigo-400 leading-tight">
                      {profile.metrics.contributorRank}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Contributor
                    </span>
                  </div>
                </div>

                {/* Clean Hairline-Separated Honors List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800 px-4">
                  {(showAllAchievements
                    ? profile.achievements
                    : profile.achievements.slice(0, 2)
                  ).map((item, idx) => (
                    <button
                      key={item.id || idx}
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
                            {String(item.year || '').replace(/\s*–\s*/g, '–')}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#4F46E5] dark:text-indigo-400 truncate mt-0.5">
                          {item.organization}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mt-1.5">
                          {item.description ||
                            `Recognized by ${item.organization} (${item.year}) for verified contributions to ${item.title}.`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Expand / Collapse Footer */}
                {profile.achievements.length > 2 && (
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
                          <span>View all {profile.achievements.length} honors</span>
                          <ChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Section 3: Posts below Key Achievements */}
            {posts.length > 0 && (
              <UserPostsSection
                authorName={profile.name}
                posts={posts}
                onOpenAllPosts={(postId) => {
                  setTargetPostId(postId || null);
                  setShowAllPostsScreen(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Public Mesh QR Pass Modal */}
      <ProfileQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        name={profile.name}
        username={normalizedHandle}
        avatar={profile.avatar}
        title={profile.title}
        status={statusValue}
        meshKey={meshKey}
        isCurrentUser={isCurrentUserProfile}
        userPlan={userPlan}
      />

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAchievement(null);
          }}
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
                    Verified Honor
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
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Issuing Organization
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-right max-w-[190px]">
                  {selectedAchievement.organization}
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Year &amp; Verification
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>{selectedAchievement.year}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAchievement(null)}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Dedicated All Posts Screen */}
      {showAllPostsScreen && (
        <UserPostsScreen
          user={{
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar,
            headline: profile.title,
            username: normalizedHandle,
            organization: profile.organization,
          }}
          posts={posts}
          isOpen={showAllPostsScreen}
          onClose={() => {
            setShowAllPostsScreen(false);
            setTargetPostId(null);
          }}
          targetPostId={targetPostId}
        />
      )}

      {/* Communities & Connections Network Sheet */}
      {networkSheetTab && (
        <ProfileNetworkSheet
          isOpen={!!networkSheetTab}
          onClose={() => setNetworkSheetTab(null)}
          initialTab={networkSheetTab}
          profileName={profile.name}
          profileId={profile.id}
          communitiesCount={profile.communitiesCount}
          connectionsCount={profile.connectionsCount}
          userPlan={userPlan}
          onUnlockPlan={onUnlockPlan}
        />
      )}
    </div>
  );
};
