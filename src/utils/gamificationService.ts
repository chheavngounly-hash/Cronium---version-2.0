export type MissionTier = 'starter' | 'community' | 'advanced';

export interface GamificationTask {
  id: string;
  title: string;
  description: string;
  rewardSlots: number;
  xpReward: number;
  tier: MissionTier;
  category: 'profile' | 'social' | 'community' | 'daily';
  iconName: 'User' | 'FileText' | 'MessageCircle' | 'Handshake' | 'Trophy' | 'CalendarCheck';
  actionText: string;
  targetDestination: 'profile' | 'feed-post' | 'feed-discussions' | 'servers-dm' | 'challenge-modal' | 'feed-engage';
}

export interface MissionActivityProgress {
  profileBioSaved: boolean;
  profileTitleSaved: boolean;
  profileOrgSaved: boolean;
  profileEmailSaved: boolean;
  profileSocialLinksCount: number;
  profileAchievementSaved: boolean;
  publishedTechnicalPosts: number;
  discussionReplyCount: number;
  discussionIds: string[];
  messagedMemberIds: string[];
  architectureSolutionSubmitted: boolean;
  architectureApproach: string;
  architectureReasoning: string;
  contributionDates: string[];
}

export interface MissionStatusInfo {
  isReady: boolean;
  isStarted: boolean;
  current: number;
  target: number;
  progressText: string;
}

export const INITIAL_GAMIFICATION_TASKS: GamificationTask[] = [
  {
    id: 'task_profile_complete',
    title: 'Complete Your Profile',
    description: 'Add a bio, Title, organization, 1 email, 2 social media links, and 1 achievement.',
    rewardSlots: 1,
    xpReward: 150,
    tier: 'starter',
    category: 'profile',
    iconName: 'User',
    actionText: 'Start',
    targetDestination: 'profile',
  },
  {
    id: 'task_publish_feed',
    title: 'Publish a Technical Insight',
    description: 'Share an original post with an explanation and reference.',
    rewardSlots: 1,
    xpReward: 200,
    tier: 'starter',
    category: 'social',
    iconName: 'FileText',
    actionText: 'Start',
    targetDestination: 'feed-post',
  },
  {
    id: 'task_engage_discussions',
    title: 'Contribute to Peer Discussions',
    description: 'Write 10 comments and replies across 5 discussions.',
    rewardSlots: 1,
    xpReward: 120,
    tier: 'community',
    category: 'social',
    iconName: 'MessageCircle',
    actionText: 'Continue',
    targetDestination: 'feed-discussions',
  },
  {
    id: 'task_connect_peers',
    title: 'Build Meaningful Connections',
    description: 'Message 5 members who share your interests.',
    rewardSlots: 1,
    xpReward: 180,
    tier: 'community',
    category: 'community',
    iconName: 'Handshake',
    actionText: 'Start',
    targetDestination: 'servers-dm',
  },
  {
    id: 'task_weekly_challenge',
    title: 'Weekly Architecture Challenge',
    description: 'Submit a solution with your approach and reasoning.',
    rewardSlots: 2,
    xpReward: 350,
    tier: 'advanced',
    category: 'community',
    iconName: 'Trophy',
    actionText: 'Start',
    targetDestination: 'challenge-modal',
  },
  {
    id: 'task_daily_streak',
    title: 'Maintain Community Engagement',
    description: 'Make meaningful contributions on 3 separate days this week.',
    rewardSlots: 1,
    xpReward: 100,
    tier: 'advanced',
    category: 'daily',
    iconName: 'CalendarCheck',
    actionText: 'Start',
    targetDestination: 'feed-engage',
  },
];

const DEFAULT_ACTIVITY_PROGRESS: MissionActivityProgress = {
  profileBioSaved: false,
  profileTitleSaved: false,
  profileOrgSaved: false,
  profileEmailSaved: false,
  profileSocialLinksCount: 0,
  profileAchievementSaved: false,
  publishedTechnicalPosts: 0,
  discussionReplyCount: 0,
  discussionIds: [],
  messagedMemberIds: [],
  architectureSolutionSubmitted: false,
  architectureApproach: '',
  architectureReasoning: '',
  contributionDates: [],
};

function getTodayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const MAX_FREE_EARNED_SERVER_SLOTS = 3;

type Listener = () => void;

class GamificationService {
  private bonusSlotsKey = 'cronium_bonus_server_slots_clean';
  private completedTasksKey = 'cronium_completed_gamification_tasks_clean';
  private bonusFeedViewsKey = 'cronium_bonus_feed_views_clean';
  private completedFeedTasksKey = 'cronium_completed_feed_tasks_clean';
  private activityProgressKey = 'cronium_mission_activity_progress_v1';
  private listeners: Set<Listener> = new Set();

  // Authoritative in-memory state (never silently lost if iframe localStorage is restricted)
  private activityProgress: MissionActivityProgress = {
    ...DEFAULT_ACTIVITY_PROGRESS,
    discussionIds: [],
    messagedMemberIds: [],
    contributionDates: [],
  };
  private bonusSlots = 0;
  private completedTaskIds: string[] = [];
  private bonusFeedViews = 0;
  private completedFeedTaskIds: string[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cronium_bonus_server_slots');
        localStorage.removeItem('cronium_completed_gamification_tasks');
        localStorage.removeItem(this.bonusSlotsKey);
        localStorage.removeItem(this.completedTasksKey);
        localStorage.removeItem(this.bonusFeedViewsKey);
        localStorage.removeItem(this.completedFeedTasksKey);
        localStorage.removeItem(this.activityProgressKey);
      } catch {
        // ignore storage errors
      }
    }
  }

  public getActivityProgress(): MissionActivityProgress {
    return {
      ...this.activityProgress,
      discussionIds: [...this.activityProgress.discussionIds],
      messagedMemberIds: [...this.activityProgress.messagedMemberIds],
      contributionDates: [...this.activityProgress.contributionDates],
    };
  }

  private saveActivityProgress(next: MissionActivityProgress): void {
    this.activityProgress = {
      ...DEFAULT_ACTIVITY_PROGRESS,
      ...next,
      discussionIds: Array.isArray(next.discussionIds) ? [...next.discussionIds] : [],
      messagedMemberIds: Array.isArray(next.messagedMemberIds) ? [...next.messagedMemberIds] : [],
      contributionDates: Array.isArray(next.contributionDates) ? [...next.contributionDates] : [],
    };
  }

  private addTodayContribution(progress: MissionActivityProgress): MissionActivityProgress {
    const today = getTodayDateKey();
    if (progress.contributionDates.includes(today)) return progress;
    return {
      ...progress,
      contributionDates: [...progress.contributionDates, today],
    };
  }

  public getMissionStatus(taskId: string): MissionStatusInfo {
    const p = this.getActivityProgress();

    switch (taskId) {
      case 'task_profile_complete': {
        const stepsDone =
          (p.profileBioSaved ? 1 : 0) +
          (p.profileTitleSaved ? 1 : 0) +
          (p.profileOrgSaved ? 1 : 0) +
          (p.profileEmailSaved ? 1 : 0) +
          (p.profileSocialLinksCount >= 2 ? 1 : 0) +
          (p.profileAchievementSaved ? 1 : 0);
        const missing: string[] = [];
        if (!p.profileBioSaved) missing.push('bio');
        if (!p.profileTitleSaved) missing.push('Title');
        if (!p.profileOrgSaved) missing.push('organization');
        if (!p.profileEmailSaved) missing.push('1 email');
        if (p.profileSocialLinksCount < 2) {
          const need = 2 - p.profileSocialLinksCount;
          missing.push(`${need} social ${need === 1 ? 'link' : 'links'}`);
        }
        if (!p.profileAchievementSaved) missing.push('1 achievement');
        return {
          isReady: stepsDone >= 6,
          isStarted: stepsDone > 0 || p.profileSocialLinksCount > 0,
          current: stepsDone,
          target: 6,
          progressText:
            stepsDone >= 6
              ? 'Profile completed · Ready to claim'
              : `${stepsDone}/6 done · Need ${missing.join(', ')}`,
        };
      }

      case 'task_publish_feed': {
        const count = Math.min(1, p.publishedTechnicalPosts);
        return {
          isReady: count >= 1,
          isStarted: count > 0,
          current: count,
          target: 1,
          progressText:
            count >= 1
              ? 'Technical insight published · Ready to claim'
              : '0/1 post published in Feed',
        };
      }

      case 'task_engage_discussions': {
        const replies = p.discussionReplyCount;
        const uniqueDiscussions = p.discussionIds.length;
        const isReady = replies >= 10 && uniqueDiscussions >= 5;
        return {
          isReady,
          isStarted: replies > 0,
          current: Math.min(10, replies),
          target: 10,
          progressText: isReady
            ? `${replies} comments & replies across ${uniqueDiscussions} discussions · Ready to claim`
            : `${Math.min(10, replies)}/10 comments & replies · ${Math.min(5, uniqueDiscussions)}/5 discussions`,
        };
      }

      case 'task_connect_peers': {
        const count = p.messagedMemberIds.length;
        return {
          isReady: count >= 5,
          isStarted: count > 0,
          current: Math.min(5, count),
          target: 5,
          progressText:
            count >= 5
              ? `${count} members messaged · Ready to claim`
              : `${count}/5 members messaged`,
        };
      }

      case 'task_weekly_challenge': {
        const done = p.architectureSolutionSubmitted ? 1 : 0;
        return {
          isReady: done >= 1,
          isStarted: done > 0,
          current: done,
          target: 1,
          progressText:
            done >= 1
              ? 'Architecture solution submitted · Ready to claim'
              : '0/1 solution submitted',
        };
      }

      case 'task_daily_streak': {
        const days = p.contributionDates.length;
        return {
          isReady: days >= 3,
          isStarted: days > 0,
          current: Math.min(3, days),
          target: 3,
          progressText:
            days >= 3
              ? `${days}/3 active days · Ready to claim`
              : `${days}/3 separate days contributed this week`,
        };
      }

      default:
        return {
          isReady: false,
          isStarted: false,
          current: 0,
          target: 1,
          progressText: '0/1 completed',
        };
    }
  }

  public isMissionReady(taskId: string): boolean {
    return this.getMissionStatus(taskId).isReady;
  }

  /** Record real profile details (bio, Title, organization, email, social media links) from ProfileScreen */
  public recordProfileUpdate(params: {
    bio?: string;
    title?: string;
    organization?: string;
    email?: string;
    socialLinksCount?: number;
  }): boolean {
    const prevReady = this.isMissionReady('task_profile_complete');
    const hasBio = typeof params.bio === 'string' && params.bio.trim().length >= 3;
    const hasTitle = typeof params.title === 'string' && params.title.trim().length >= 2;
    const hasOrg = typeof params.organization === 'string' && params.organization.trim().length >= 2;
    const hasEmail =
      typeof params.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.email.trim());
    const socialCount =
      typeof params.socialLinksCount === 'number' ? Math.max(0, params.socialLinksCount) : 0;

    let next = this.getActivityProgress();
    next = {
      ...next,
      profileBioSaved: next.profileBioSaved || hasBio,
      profileTitleSaved: next.profileTitleSaved || hasTitle,
      profileOrgSaved: next.profileOrgSaved || hasOrg,
      profileEmailSaved: next.profileEmailSaved || hasEmail,
      profileSocialLinksCount: Math.max(next.profileSocialLinksCount, socialCount),
    };
    if (hasBio || hasTitle || hasOrg || hasEmail || socialCount > 0) {
      next = this.addTodayContribution(next);
    }
    this.saveActivityProgress(next);
    this.notify();
    return !prevReady && this.isMissionReady('task_profile_complete');
  }

  /** Record real project/achievement saved from ProfileScreen */
  public recordAchievementSaved(): boolean {
    const prevReady = this.isMissionReady('task_profile_complete');
    let next = this.getActivityProgress();
    next = this.addTodayContribution({
      ...next,
      profileAchievementSaved: true,
    });
    this.saveActivityProgress(next);
    this.notify();
    return !prevReady && this.isMissionReady('task_profile_complete');
  }

  /** Record real technical post published in Feed or Topic page */
  public recordTechnicalPostPublished(content: string, hasMedia = false): boolean {
    const trimmed = content.trim();
    if (trimmed.length < 3 && !hasMedia) return false;
    const prevReady = this.isMissionReady('task_publish_feed');
    let next = this.getActivityProgress();
    next = this.addTodayContribution({
      ...next,
      publishedTechnicalPosts: next.publishedTechnicalPosts + 1,
    });
    this.saveActivityProgress(next);
    this.notify();
    return !prevReady && this.isMissionReady('task_publish_feed');
  }

  /** Record real reply/comment written on a Feed discussion or Server channel */
  public recordPeerReply(discussionId: string, text: string): boolean {
    const trimmed = text.trim();
    if (!discussionId || trimmed.length < 1) return false;
    const prevReady = this.isMissionReady('task_engage_discussions');
    let next = this.getActivityProgress();
    const updatedDiscussions = next.discussionIds.includes(discussionId)
      ? next.discussionIds
      : [...next.discussionIds, discussionId];
    next = this.addTodayContribution({
      ...next,
      discussionReplyCount: next.discussionReplyCount + 1,
      discussionIds: updatedDiscussions,
    });
    this.saveActivityProgress(next);
    this.notify();
    return !prevReady && this.isMissionReady('task_engage_discussions');
  }

  /** Record real direct message sent to a member */
  public recordMemberMessaged(memberId: string, text: string): boolean {
    const normalizedId = memberId.trim().toLowerCase().replace(/^chat_/, '');
    if (!normalizedId || text.trim().length < 1) return false;
    const prevReady = this.isMissionReady('task_connect_peers');
    let next = this.getActivityProgress();
    const updatedMembers = next.messagedMemberIds.includes(normalizedId)
      ? next.messagedMemberIds
      : [...next.messagedMemberIds, normalizedId];
    next = this.addTodayContribution({
      ...next,
      messagedMemberIds: updatedMembers,
    });
    this.saveActivityProgress(next);
    this.notify();
    return !prevReady && this.isMissionReady('task_connect_peers');
  }

  /** Record real Weekly Architecture Challenge solution submission */
  public recordArchitectureChallenge(approach: string, reasoning: string): boolean {
    if (approach.trim().length < 10 || reasoning.trim().length < 10) return false;
    const prevReady = this.isMissionReady('task_weekly_challenge');
    let next = this.getActivityProgress();
    next = this.addTodayContribution({
      ...next,
      architectureSolutionSubmitted: true,
      architectureApproach: approach.trim(),
      architectureReasoning: reasoning.trim(),
    });
    this.saveActivityProgress(next);
    this.notify();
    return !prevReady && this.isMissionReady('task_weekly_challenge');
  }

  public resetFeedGamification(): void {
    this.bonusFeedViews = 0;
    this.completedFeedTaskIds = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.bonusFeedViewsKey);
        localStorage.removeItem(this.completedFeedTasksKey);
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public resetToOriginalState(): void {
    this.bonusSlots = 0;
    this.completedTaskIds = [];
    this.bonusFeedViews = 0;
    this.completedFeedTaskIds = [];
    this.activityProgress = {
      ...DEFAULT_ACTIVITY_PROGRESS,
      discussionIds: [],
      messagedMemberIds: [],
      contributionDates: [],
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.bonusSlotsKey);
        localStorage.removeItem(this.completedTasksKey);
        localStorage.removeItem(this.bonusFeedViewsKey);
        localStorage.removeItem(this.completedFeedTasksKey);
        localStorage.removeItem(this.activityProgressKey);
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public getBonusServerSlots(): number {
    return this.bonusSlots;
  }

  public getBonusFeedViews(): number {
    return this.bonusFeedViews;
  }

  public getCompletedFeedTaskIds(): string[] {
    return [...this.completedFeedTaskIds];
  }

  public completeFeedTask(taskId: string): { success: boolean; earnedViews: number; totalViews: number } {
    // Strictly require real activity completion before granting reward
    if (!this.isMissionReady(taskId)) {
      return { success: false, earnedViews: 0, totalViews: this.bonusFeedViews };
    }

    const completed = new Set(this.completedFeedTaskIds);
    if (completed.has(taskId)) {
      return { success: false, earnedViews: 0, totalViews: this.bonusFeedViews };
    }

    const task = INITIAL_GAMIFICATION_TASKS.find((t) => t.id === taskId);
    const viewsToAdd = (task ? task.rewardSlots : 1) * 10;

    completed.add(taskId);
    this.completedFeedTaskIds = Array.from(completed);
    this.bonusFeedViews = this.bonusFeedViews + viewsToAdd;

    this.notify();
    return { success: true, earnedViews: viewsToAdd, totalViews: this.bonusFeedViews };
  }

  public getCompletedTaskIds(): string[] {
    return [...this.completedTaskIds];
  }

  public isTaskCompleted(taskId: string): boolean {
    return this.completedTaskIds.includes(taskId);
  }

  public canClaimServerSlots(
    rewardSlots: number,
    userPlan: 'free' | 'plus' | 'pro' = 'free'
  ): boolean {
    if (userPlan !== 'free') return true;
    return this.bonusSlots + rewardSlots <= MAX_FREE_EARNED_SERVER_SLOTS;
  }

  public getEffectiveBonusServerSlots(userPlan: 'free' | 'plus' | 'pro' = 'free'): number {
    return userPlan === 'free'
      ? Math.min(MAX_FREE_EARNED_SERVER_SLOTS, this.bonusSlots)
      : this.bonusSlots;
  }

  public completeTask(
    taskId: string,
    userPlan: 'free' | 'plus' | 'pro' = 'free'
  ): {
    success: boolean;
    earnedSlots: number;
    totalSlots: number;
    requiresSubscription?: boolean;
  } {
    // Strictly require real activity completion before granting server slots
    if (!this.isMissionReady(taskId)) {
      return { success: false, earnedSlots: 0, totalSlots: this.bonusSlots };
    }

    const completed = new Set(this.completedTaskIds);
    if (completed.has(taskId)) {
      return { success: false, earnedSlots: 0, totalSlots: this.bonusSlots };
    }

    const task = INITIAL_GAMIFICATION_TASKS.find((t) => t.id === taskId);
    const slotsToAdd = task ? task.rewardSlots : 1;

    // Free tier cannot surpass 3 received server slots; requires Cronium Subscription for more
    if (
      userPlan === 'free' &&
      (this.bonusSlots >= MAX_FREE_EARNED_SERVER_SLOTS ||
        this.bonusSlots + slotsToAdd > MAX_FREE_EARNED_SERVER_SLOTS)
    ) {
      return {
        success: false,
        earnedSlots: 0,
        totalSlots: this.bonusSlots,
        requiresSubscription: true,
      };
    }

    completed.add(taskId);
    this.completedTaskIds = Array.from(completed);
    this.bonusSlots = this.bonusSlots + slotsToAdd;

    this.notify();
    return { success: true, earnedSlots: slotsToAdd, totalSlots: this.bonusSlots };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const gamificationService = new GamificationService();
