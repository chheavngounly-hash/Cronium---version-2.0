import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Hash,
  Check,
  Plus,
  Share2,
  X,
  PenSquare,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Building2,
  Send,
} from 'lucide-react';
import { Post } from '../types/social';
import {
  BrandLogoVariant,
  cleanHashtag,
  formatCompactCount,
  getHashtagMetadata,
  getPostsForHashtag,
  hashtagFollowService,
  normalizeHashtagKey,
} from '../utils/hashtagDirectory';
import { FeedPostCard } from './FeedPostCard';
import { MediaViewerModal } from './MediaViewerModal';
import { PostCommentsModal } from './PostCommentsModal';
import {
  addCommentOrReplyInPost,
  toggleCommentReactionInPost,
  toggleReplyReactionInPost,
} from '../utils/commentsManager';
import { SharePostModal } from './SharePostModal';
import { gamificationService } from '../utils/gamificationService';
import { UserProfileModal } from './UserProfileModal';
import { getProfileBadgeStyle } from '../utils/profileBadge';
import { MemberProfileDetail, getMemberProfile } from '../data/mockMemberProfiles';
import { CURRENT_USER } from '../data/mockData';
import { followService } from '../utils/followService';
import { User, UserPlan } from '../types';

interface HashtagPageViewProps {
  initialHashtag: string | null;
  allPosts?: Post[];
  onClose: () => void;
  onStartPostWithTag?: (tag: string) => void;
  onRepostPost?: (post: Post, thoughts: string) => void;
  onStartDirectChatWithUser?: (user: User) => void;
  userPlan?: UserPlan;
  onUnlockPlan?: (plan: UserPlan) => void;
}

/**
 * Renders the branded square logo badge for specific organization/brand pages
 * (e.g. a16z dark tile with violet accent line, Y Combinator orange Y tile, etc.).
 */
const BrandLogoBadge: React.FC<{ variant: BrandLogoVariant; size?: 'md' | 'lg' }> = ({
  variant,
  size = 'lg',
}) => {
  const dim = size === 'lg' ? 'w-14 h-14 rounded-2xl' : 'w-11 h-11 rounded-xl';

  switch (variant) {
    case 'a16z':
      return (
        <div
          className={`${dim} bg-[#0F1117] border border-slate-800 shadow-[0_6px_18px_-6px_rgba(15,17,23,0.55)] flex flex-col items-center justify-center shrink-0 select-none relative overflow-hidden`}
        >
          <span
            className={`font-extrabold tracking-tight text-white leading-none font-display ${
              size === 'lg' ? 'text-[17px]' : 'text-[13px]'
            }`}
          >
            a16z
          </span>
          <span
            className={`mt-1 rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 ${
              size === 'lg' ? 'w-7 h-[2px]' : 'w-5 h-[1.5px]'
            }`}
          />
        </div>
      );
    case 'ycombinator':
      return (
        <div
          className={`${dim} bg-[#F26522] border border-orange-500/40 shadow-[0_6px_18px_-6px_rgba(242,101,34,0.55)] flex items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold text-white leading-none font-display ${
              size === 'lg' ? 'text-[28px]' : 'text-[22px]'
            }`}
          >
            Y
          </span>
        </div>
      );
    case 'stanford':
      return (
        <div
          className={`${dim} bg-[#8C1515] border border-red-900/40 shadow-[0_6px_18px_-6px_rgba(140,21,21,0.45)] flex flex-col items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-serif font-extrabold text-white leading-none ${
              size === 'lg' ? 'text-[22px]' : 'text-[17px]'
            }`}
          >
            S
          </span>
          <span
            className={`font-bold tracking-widest text-rose-200 uppercase leading-none mt-0.5 ${
              size === 'lg' ? 'text-[8px]' : 'text-[7px]'
            }`}
          >
            AI LAB
          </span>
        </div>
      );
    case 'jaxa':
      return (
        <div
          className={`${dim} bg-gradient-to-br from-[#0B2C6B] to-[#12459E] border border-blue-800/60 shadow-sm flex flex-col items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold tracking-tight text-white leading-none font-display ${
              size === 'lg' ? 'text-[14px]' : 'text-[11px]'
            }`}
          >
            JAXA
          </span>
          <span
            className={`mt-1 rounded-full bg-sky-300/90 ${
              size === 'lg' ? 'w-6 h-[2px]' : 'w-4 h-[1.5px]'
            }`}
          />
        </div>
      );
    case 'neuralmesh':
      return (
        <div
          className={`${dim} bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 border border-indigo-400/30 shadow-sm flex items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold tracking-tight text-white leading-none font-display ${
              size === 'lg' ? 'text-[18px]' : 'text-[14px]'
            }`}
          >
            NM
          </span>
        </div>
      );
    case 'cerebras':
      return (
        <div
          className={`${dim} bg-[#111827] border border-slate-700 shadow-sm flex flex-col items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold tracking-tight text-white leading-none font-display ${
              size === 'lg' ? 'text-[16px]' : 'text-[13px]'
            }`}
          >
            WSE
          </span>
          <span
            className={`mt-1 rounded-full bg-cyan-400 ${
              size === 'lg' ? 'w-6 h-[2px]' : 'w-4 h-[1.5px]'
            }`}
          />
        </div>
      );
    case 'nvidia':
      return (
        <div
          className={`${dim} bg-[#101412] border border-emerald-900/60 shadow-sm flex flex-col items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold tracking-tight text-white leading-none font-display ${
              size === 'lg' ? 'text-[13px]' : 'text-[10px]'
            }`}
          >
            CUDA
          </span>
          <span
            className={`mt-1 rounded-full bg-[#76B900] ${
              size === 'lg' ? 'w-7 h-[2px]' : 'w-5 h-[1.5px]'
            }`}
          />
        </div>
      );
    case 'mlir':
      return (
        <div
          className={`${dim} bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-700/50 shadow-sm flex flex-col items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold tracking-tight text-white leading-none font-mono ${
              size === 'lg' ? 'text-[13px]' : 'text-[10px]'
            }`}
          >
            MLIR
          </span>
          <span
            className={`mt-1 rounded-full bg-sky-400 ${
              size === 'lg' ? 'w-6 h-[2px]' : 'w-4 h-[1.5px]'
            }`}
          />
        </div>
      );
    case 'riscv':
      return (
        <div
          className={`${dim} bg-[#1E2B58] border border-blue-900/60 shadow-sm flex flex-col items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold tracking-tight text-white leading-none font-display ${
              size === 'lg' ? 'text-[16px]' : 'text-[12px]'
            }`}
          >
            RV
          </span>
          <span
            className={`mt-1 rounded-full bg-amber-400 ${
              size === 'lg' ? 'w-5 h-[2px]' : 'w-4 h-[1.5px]'
            }`}
          />
        </div>
      );
    case 'rwc':
      return (
        <div
          className={`${dim} bg-[#0D1318] border border-emerald-800/50 shadow-sm flex flex-col items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold tracking-tight text-white leading-none font-mono ${
              size === 'lg' ? 'text-[14px]' : 'text-[11px]'
            }`}
          >
            RWC
          </span>
          <span
            className={`mt-1 rounded-full bg-emerald-400 ${
              size === 'lg' ? 'w-6 h-[2px]' : 'w-4 h-[1.5px]'
            }`}
          />
        </div>
      );
    case 'cronium':
    default:
      return (
        <div
          className={`${dim} bg-gradient-to-br from-[#6C3BF5] to-indigo-700 border border-violet-400/40 shadow-sm flex items-center justify-center shrink-0 select-none`}
        >
          <span
            className={`font-extrabold text-white leading-none font-display ${
              size === 'lg' ? 'text-[24px]' : 'text-[18px]'
            }`}
          >
            C
          </span>
        </div>
      );
  }
};

export const HashtagPageView: React.FC<HashtagPageViewProps> = ({
  initialHashtag,
  allPosts = [],
  onClose,
  onStartPostWithTag,
  onRepostPost,
  onStartDirectChatWithUser,
  userPlan = 'free',
  onUnlockPlan,
}) => {
  const [tagHistory, setTagHistory] = useState<string[]>(() =>
    initialHashtag ? [cleanHashtag(initialHashtag)] : []
  );
  const [sortBy, setSortBy] = useState<'top' | 'recent'>('top');
  const [isFollowingTag, setIsFollowingTag] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inline quick composer fallback when HashtagPageView is opened outside SocialFeedScreen
  const [showInlineComposer, setShowInlineComposer] = useState(false);
  const [inlinePostText, setInlinePostText] = useState('');
  const [sessionPublishedPosts, setSessionPublishedPosts] = useState<Post[]>([]);

  const [selectedMediaPost, setSelectedMediaPost] = useState<Post | null>(null);
  const [selectedCommentsPost, setSelectedCommentsPost] = useState<Post | null>(null);
  const [shareModalPost, setShareModalPost] = useState<Post | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<MemberProfileDetail | null>(null);
  const [followingAuthorIds, setFollowingAuthorIds] = useState<Set<string>>(() =>
    followService.getFollowingIds()
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialHashtag) {
      setTagHistory([cleanHashtag(initialHashtag)]);
      setSortBy('top');
      setShowInlineComposer(false);
      setInlinePostText('');
    } else {
      setTagHistory([]);
    }
  }, [initialHashtag]);

  const currentTag = tagHistory.length > 0 ? tagHistory[tagHistory.length - 1] : null;

  useEffect(() => {
    if (!currentTag) return;
    setIsFollowingTag(hashtagFollowService.isFollowing(currentTag));
    setShowInlineComposer(false);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTag]);

  useEffect(() => {
    if (!initialHashtag) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !selectedCommentsPost && !selectedMediaPost && !selectedProfile) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [initialHashtag, selectedCommentsPost, selectedMediaPost, selectedProfile, onClose]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const meta = useMemo(() => {
    if (!currentTag) return null;
    return getHashtagMetadata(currentTag);
  }, [currentTag]);

  const matchedPosts = useMemo(() => {
    if (!currentTag) return [];
    const list = getPostsForHashtag(currentTag, [...sessionPublishedPosts, ...allPosts]);
    if (sortBy === 'recent') return list;

    const getScore = (post: Post) => {
      const reactionsSum = Object.values(post.reactions || {}).reduce<number>(
        (acc, val) => acc + (typeof val === 'number' ? val : 0),
        0
      );
      return (
        reactionsSum +
        (post.totalCommentsCount || post.comments?.length || 0) * 1.5 +
        (post.sharesCount || 0) * 2
      );
    };
    return [...list].sort((a, b) => getScore(b) - getScore(a));
  }, [currentTag, allPosts, sessionPublishedPosts, sortBy]);

  if (!initialHashtag || !currentTag || !meta) return null;

  const displayedFollowers = meta.baseFollowers + (isFollowingTag ? 1 : 0);
  const pageTitle = meta.isSpecificBrand && meta.brand ? meta.brand.name : meta.displayTag;

  const handleNavigateToTag = (nextRawTag: string) => {
    const cleaned = cleanHashtag(nextRawTag);
    if (!cleaned) return;
    if (normalizeHashtagKey(cleaned) === normalizeHashtagKey(currentTag)) {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setTagHistory((prev) => [...prev, cleaned]);
  };

  const handleBack = () => {
    if (tagHistory.length > 1) {
      setTagHistory((prev) => prev.slice(0, -1));
    } else {
      onClose();
    }
  };

  const handleToggleFollowTag = () => {
    const next = hashtagFollowService.toggleFollow(currentTag);
    setIsFollowingTag(next);
    showToast(
      next
        ? `Following ${pageTitle} — updates will appear in your feed`
        : `Unfollowed ${pageTitle}`
    );
  };

  const handleStartPostClick = () => {
    if (onStartPostWithTag) {
      const tagToPass = currentTag;
      onClose();
      onStartPostWithTag(tagToPass);
    } else {
      setShowInlineComposer((prev) => !prev);
    }
  };

  const handlePublishInlinePost = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inlinePostText.trim();
    if (!trimmed) return;
    const newPost: Post = {
      id: `tag_post_${Date.now()}`,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      authorHeadline: CURRENT_USER.customStatus || 'Head of AI Product & Systems Architecture',
      communityId: 'machine-learning',
      communityName: pageTitle,
      communityColor: 'indigo',
      timestamp: 'Just now',
      content: trimmed,
      tags: [currentTag],
      reactions: { like: 1 },
      userReaction: 'like',
      totalCommentsCount: 0,
      sharesCount: 0,
      comments: [],
    };
    setSessionPublishedPosts((prev) => [newPost, ...prev]);
    setInlinePostText('');
    setShowInlineComposer(false);
    setSortBy('recent');
    const unlockedPost = gamificationService.recordTechnicalPostPublished(trimmed);
    showToast(
      unlockedPost
        ? `Published to ${pageTitle} · Mission Ready to Claim in Earn Servers!`
        : `Published to ${pageTitle}`
    );
  };

  const handleCopyTagLink = () => {
    try {
      navigator.clipboard.writeText(
        `${window.location.origin}/topic/${encodeURIComponent(currentTag)}`
      );
      setCopiedLink(true);
      showToast(`Copied link to ${pageTitle}`);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      showToast(`Link ready for ${pageTitle}`);
    }
  };

  const handleOpenProfile = (
    authorId: string,
    authorName: string,
    authorAvatar: string,
    authorHeadline: string
  ) => {
    const profile = getMemberProfile(authorId, authorName, authorAvatar, authorHeadline);
    setSelectedProfile(profile);
  };

  const handleToggleFollowAuthor = (authorId: string) => {
    const next = followService.toggleFollow(authorId);
    setFollowingAuthorIds((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(authorId);
      else copy.delete(authorId);
      return copy;
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${pageTitle} page`}
      className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-150"
    >
      {/* Dedicated Backdrop so nested child modals never bubble clicks to close this page */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
      />

      {/* iPhone 15 Screen-Sized Container (exact same size as Events modal) */}
      <div className="relative z-10 w-full max-w-[440px] sm:max-w-[465px] h-[92vh] sm:max-h-[820px] bg-[#F5F8FF] dark:bg-slate-950 rounded-[28px] sm:rounded-[32px] shadow-[0_24px_64px_-16px_rgba(15,23,42,0.4)] border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col font-sans animate-in zoom-in-95 duration-200">
        {/* Top Navigation Bar */}
        <header className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-3.5 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={handleBack}
              className="w-8 h-8 -ml-0.5 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 cursor-pointer shrink-0"
              aria-label="Go back"
              title={tagHistory.length > 1 ? 'Previous page' : 'Back to feed'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate font-display">
                  {pageTitle}
                </h1>
                {meta.isSpecificBrand && meta.brand?.verified && (() => {
                  const badge = getProfileBadgeStyle(meta.brand.name);
                  return (
                    <span
                      className={`w-3.5 h-3.5 rounded-full text-white inline-flex items-center justify-center shrink-0 ${badge.bgClass}`}
                      title={badge.title}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  );
                })()}
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {formatCompactCount(displayedFollowers)} followers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleCopyTagLink}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={`Share ${pageTitle}`}
              aria-label={`Share ${pageTitle}`}
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close page"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Feed Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3.5"
        >
          {/* Overview Card — Branded Organization Layout vs. Broad Topic Layout */}
          <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden text-left">
            <div className="p-4 space-y-3.5">
              {meta.isSpecificBrand && meta.brand ? (
                <>
                  {/* Specific Organization Header matching attached design */}
                  <div className="flex items-center gap-3.5">
                    <BrandLogoBadge variant={meta.brand.logoVariant} size="lg" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-[17px] sm:text-[18px] font-extrabold text-slate-900 dark:text-white tracking-tight font-display leading-snug truncate">
                          {meta.brand.name}
                        </h2>
                        {meta.brand.verified && (() => {
                          const badge = getProfileBadgeStyle(meta.brand.name);
                          return (
                            <span
                              className={`w-[18px] h-[18px] rounded-full text-white inline-flex items-center justify-center shrink-0 shadow-2xs ${badge.bgClass}`}
                              title={badge.title}
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3.2]" />
                            </span>
                          );
                        })()}
                      </div>

                      <span className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {meta.brand.pillText}
                      </span>
                    </div>
                  </div>

                  <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                    {displayedFollowers.toLocaleString()} followers ·{' '}
                    {meta.weeklyPosts.toLocaleString()} {meta.activityUnit}
                  </p>

                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-[1.55]">
                    {meta.description}
                  </p>
                </>
              ) : (
                <>
                  {/* Broad Topic Header */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-[#6C3BF5] dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
                      <Hash className="w-7 h-7 stroke-[2.3]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="text-[17px] sm:text-[18px] font-extrabold text-slate-900 dark:text-white tracking-tight font-display leading-snug truncate">
                        {meta.displayTag}
                      </h2>
                      <span className="inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {meta.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                    {displayedFollowers.toLocaleString()} followers ·{' '}
                    {meta.weeklyPosts.toLocaleString()} {meta.activityUnit}
                  </p>

                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-[1.55]">
                    {meta.description}
                  </p>
                </>
              )}

              {/* Full-Width 2-Button Action Row matching attached screenshot */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleToggleFollowTag}
                  className={`w-full py-2.5 px-4 rounded-full text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] ${
                    isFollowingTag
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-[#6C3BF5] hover:bg-[#5B2DE0] text-white shadow-sm shadow-indigo-600/25'
                  }`}
                >
                  {isFollowingTag ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStartPostClick}
                  className="w-full py-2.5 px-4 rounded-full text-[13px] font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <PenSquare className="w-4 h-4 text-[#6C3BF5] dark:text-indigo-400 stroke-[2.2]" />
                  <span>Start a post</span>
                </button>
              </div>

              {/* Inline quick composer when triggered outside main Feed */}
              {showInlineComposer && (
                <form
                  onSubmit={handlePublishInlinePost}
                  className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-in fade-in duration-150"
                >
                  <textarea
                    rows={2}
                    value={inlinePostText}
                    onChange={(e) => setInlinePostText(e.target.value)}
                    placeholder={`Share an update with ${pageTitle}...`}
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      {meta.displayTag}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowInlineComposer(false)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!inlinePostText.trim()}
                        className="px-3.5 py-1.5 rounded-full bg-[#6C3BF5] hover:bg-[#5B2DE0] disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Related Hashtags */}
              {meta.relatedTags.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>Related topics</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {meta.relatedTags.map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => handleNavigateToTag(rel)}
                        className="px-2.5 py-1 rounded-full text-[11.5px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/70 dark:border-indigo-800/70 transition-colors cursor-pointer active:scale-95"
                      >
                        #{rel}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Broad Topics: Relevant Organization / Brand Pages Section */}
          {!meta.isSpecificBrand && meta.relatedPages.length > 0 && (
            <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs p-4 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#6C3BF5] dark:text-indigo-400" />
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                    Relevant Pages
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {meta.relatedPages.length} featured
                </span>
              </div>

              <div className="space-y-2">
                {meta.relatedPages.map((page) => (
                  <button
                    key={page.tag}
                    type="button"
                    onClick={() => handleNavigateToTag(page.tag)}
                    className="w-full p-2.5 rounded-2xl bg-slate-50/90 hover:bg-indigo-50/60 dark:bg-slate-800/60 dark:hover:bg-indigo-950/40 border border-slate-200/70 dark:border-slate-700/70 flex items-center gap-3 text-left transition-all cursor-pointer active:scale-[0.99] group"
                  >
                    <BrandLogoBadge variant={page.logoVariant} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                          {page.name}
                        </span>
                        {page.verified && (() => {
                          const badge = getProfileBadgeStyle(page.name);
                          return (
                            <span
                              title={badge.title}
                              className={`w-3.5 h-3.5 rounded-full text-white inline-flex items-center justify-center shrink-0 ${badge.bgClass}`}
                            >
                              <Check className="w-2 h-2 stroke-[3.2]" />
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {page.pillText}
                      </p>
                      <p className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500">
                        {formatCompactCount(page.followers)} followers
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#6C3BF5] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Bar (Top / Recent) */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {matchedPosts.length} {matchedPosts.length === 1 ? 'post' : 'posts'} in{' '}
              <span className="text-[#6C3BF5] dark:text-indigo-400">{pageTitle}</span>
            </span>

            <div className="flex items-center p-0.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full shadow-2xs">
              <button
                type="button"
                onClick={() => setSortBy('top')}
                className={`px-2.5 py-1 rounded-full text-[11.5px] flex items-center gap-1 transition-all cursor-pointer ${
                  sortBy === 'top'
                    ? 'bg-[#6C3BF5] text-white font-semibold shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
                <span>Top</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy('recent')}
                className={`px-2.5 py-1 rounded-full text-[11.5px] flex items-center gap-1 transition-all cursor-pointer ${
                  sortBy === 'recent'
                    ? 'bg-[#6C3BF5] text-white font-semibold shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>Recent</span>
              </button>
            </div>
          </div>

          {/* Topic / Brand Posts Stream */}
          <div className="space-y-3.5 pb-6">
            {matchedPosts.map((post) => (
              <FeedPostCard
                key={post.id}
                post={post}
                onOpenMedia={(p) => setSelectedMediaPost(p)}
                onOpenComments={(p) => setSelectedCommentsPost(p)}
                onOpenProfile={handleOpenProfile}
                onOpenHashtag={handleNavigateToTag}
                onShare={(p) => setShareModalPost(p)}
              />
            ))}
          </div>
        </div>

        {/* Toast Feedback pinned inside iPhone 15 container */}
        {toastMessage && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* Interactive Modals launched from inside Hashtag Page */}
      {selectedMediaPost && (
        <MediaViewerModal
          post={selectedMediaPost}
          isOpen={!!selectedMediaPost}
          onClose={() => setSelectedMediaPost(null)}
        />
      )}

      {selectedCommentsPost && (
        <PostCommentsModal
          post={selectedCommentsPost}
          isOpen={!!selectedCommentsPost}
          onClose={() => setSelectedCommentsPost(null)}
          onAddComment={(_postId, text, replyToCommentId, replyToAuthorName) => {
            if (selectedCommentsPost) {
              const unlockedDiscussions = gamificationService.recordPeerReply(
                selectedCommentsPost.id,
                text
              );
              if (unlockedDiscussions) {
                showToast('Mission Ready to Claim: Contribute to Peer Discussions!');
              }
            }
            setSelectedCommentsPost((curr) =>
              curr
                ? addCommentOrReplyInPost(
                    curr,
                    {
                      id: CURRENT_USER.id,
                      name: CURRENT_USER.name,
                      avatar: CURRENT_USER.avatar,
                      headline:
                        CURRENT_USER.customStatus || 'Head of AI Product & Systems Architecture',
                    },
                    text,
                    replyToCommentId,
                    replyToAuthorName
                  )
                : curr
            );
          }}
          onToggleCommentLike={() => {}}
          onToggleCommentReaction={(_postId, commentId, emoji) => {
            setSelectedCommentsPost((curr) =>
              curr ? toggleCommentReactionInPost(curr, commentId, emoji) : curr
            );
          }}
          onToggleReplyLike={() => {}}
          onToggleReplyReaction={(_postId, commentId, replyId, emoji) => {
            setSelectedCommentsPost((curr) =>
              curr ? toggleReplyReactionInPost(curr, commentId, replyId, emoji) : curr
            );
          }}
          onViewProfile={handleOpenProfile}
        />
      )}

      <SharePostModal
        post={shareModalPost}
        onClose={() => setShareModalPost(null)}
        onRepost={(post, thoughts) => {
          onRepostPost?.(post, thoughts);
          showToast('Reposted to your network!');
        }}
        onCopyLink={() => showToast('Post link copied to clipboard!')}
      />

      {selectedProfile && (
        <UserProfileModal
          profile={selectedProfile}
          isOpen={!!selectedProfile}
          onClose={() => setSelectedProfile(null)}
          isFollowing={followingAuthorIds.has(selectedProfile.id)}
          onToggleFollow={handleToggleFollowAuthor}
          onStartDirectMessage={(member) => {
            const headline = member.role || selectedProfile.title;
            setSelectedProfile(null);
            onClose();
            onStartDirectChatWithUser?.({
              id: member.id,
              name: member.name,
              avatar: member.avatar,
              status: 'online',
              customStatus: headline,
            });
          }}
          userPlan={userPlan}
          onUnlockPlan={onUnlockPlan}
        />
      )}
    </div>
  );
};
