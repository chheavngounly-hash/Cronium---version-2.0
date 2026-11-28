import React, { useState, useMemo } from 'react';
import { UserProfile, UserPlan } from '../types';
import { getUserPosts } from '../data/userPostsData';
import { getUniqueCoverUrl } from '../data/mockMemberProfiles';
import { UnifiedProfileView, UnifiedProfileData } from './UnifiedProfileView';

interface ProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDirectMessage?: (user: UserProfile) => void;
  userPlan?: UserPlan;
  onUnlockPlan?: (plan: UserPlan) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onOpenDirectMessage,
  userPlan = 'free',
  onUnlockPlan,
}) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const authorPosts = useMemo(() => {
    if (!user) return [];
    return getUserPosts(user.id, user.name, user.avatar, user.specialization);
  }, [user?.id, user?.name, user?.avatar, user?.specialization]);

  if (!isOpen || !user) return null;

  const achievements = user.achievements || [];
  const handle = (user.username || user.name.toLowerCase().replace(/[^a-z0-9]/g, '')).replace(/^@/, '');

  const unifiedData: UnifiedProfileData = {
    id: user.id,
    name: user.name,
    username: `@${handle}`,
    avatar: user.avatar,
    coverUrl: getUniqueCoverUrl(user.name),
    title: user.specialization || user.role || 'Verified Member',
    bio: user.bio || '',
    organization: user.company,
    email: user.workEmail || `${handle}@cronium.network`,
    linkedinUrl: user.linkedin || `linkedin.com/in/${user.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    githubUrl: user.github || `github.com/${handle}`,
    status: 'online',
    communitiesCount: user.stats.communitiesCount ?? 8,
    connectionsCount: user.stats.connectionsCount,
    achievementsCount: user.stats.achievementsCount || achievements.length || 5,
    metrics: {
      honors: String(user.stats.honors ?? '1st'),
      patentsCount: user.stats.patentsAndPapers ?? achievements.length * 3 + 2,
      contributorRank: String(user.stats.contributorRank ?? 'Top 1%'),
    },
    achievements: achievements.map((item, idx) => ({
      id: item.id || `${user.id}_ach_${idx}`,
      icon: item.icon,
      title: item.title,
      organization: item.organization,
      year: String(item.year || ''),
      description: item.description,
    })),
  };

  return (
    <UnifiedProfileView
      profile={unifiedData}
      posts={authorPosts}
      onClose={onClose}
      isFollowing={isFollowing}
      onToggleFollow={() => setIsFollowing((prev) => !prev)}
      onMessage={() => {
        if (onOpenDirectMessage) {
          onOpenDirectMessage(user);
        }
        onClose();
      }}
      userPlan={userPlan}
      onUnlockPlan={onUnlockPlan}
    />
  );
};
