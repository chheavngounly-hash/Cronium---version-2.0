import React, { useState, useEffect, useMemo } from 'react';
import { getUserPosts } from '../data/userPostsData';
import { MemberProfileDetail } from '../data/mockMemberProfiles';
import { CURRENT_USER } from '../data/mockData';
import { UserPlan } from '../types';
import { UnifiedProfileView, UnifiedProfileData } from './UnifiedProfileView';

interface UserProfileModalProps {
  profile: MemberProfileDetail | null;
  isOpen: boolean;
  onClose: () => void;
  isFollowing?: boolean;
  onToggleFollow?: (authorId: string, authorName: string) => void;
  onStartDirectMessage?: (member: { id: string; name: string; avatar: string; role?: string }) => void;
  userPlan?: UserPlan;
  onUnlockPlan?: (plan: UserPlan) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  isFollowing: initialIsFollowing = false,
  onToggleFollow,
  onStartDirectMessage,
  userPlan = 'free',
  onUnlockPlan,
}) => {
  const [localIsFollowing, setLocalIsFollowing] = useState(initialIsFollowing);

  useEffect(() => {
    setLocalIsFollowing(initialIsFollowing);
  }, [initialIsFollowing, profile?.id]);

  const handleToggleFollow = () => {
    setLocalIsFollowing((prev) => !prev);
    if (onToggleFollow && profile) {
      onToggleFollow(profile.id, profile.name);
    }
  };

  const authorPosts = useMemo(() => {
    if (!profile) return [];
    return getUserPosts(profile.id, profile.name, profile.avatar, profile.title);
  }, [profile?.id, profile?.name, profile?.avatar, profile?.title]);

  if (!isOpen || !profile) return null;

  const isMe = profile.id === CURRENT_USER.id || profile.id === 'user_jennies';

  const linkedinHandle =
    profile.linkedinUrl || `linkedin.com/in/${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const githubHandle = profile.githubUrl || `github.com/${profile.username.replace('@', '')}`;

  const unifiedData: UnifiedProfileData = {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    avatar: profile.avatar,
    coverUrl: profile.coverUrl,
    title: profile.title,
    bio: profile.bio,
    organization: profile.organization,
    email: profile.email,
    linkedinUrl: linkedinHandle,
    githubUrl: githubHandle,
    status: 'online',
    communitiesCount: profile.communitiesCount,
    connectionsCount: profile.connectionsCount,
    achievementsCount: profile.achievements?.length || 4,
    metrics: {
      honors: profile.metrics?.honors || '1st',
      patentsCount: profile.metrics?.patentsCount ?? (profile.achievements?.length || 4) * 3 + 2,
      contributorRank: profile.metrics?.contributorRank || 'Top 1%',
    },
    achievements: (profile.achievements || []).map((item, idx) => ({
      id: `${profile.id}_ach_${idx}`,
      icon: item.icon,
      title: item.title,
      organization: item.org,
      year: item.year,
      description: item.description,
    })),
    safetyNumber: profile.safetyNumber,
  };

  return (
    <UnifiedProfileView
      profile={unifiedData}
      posts={authorPosts}
      onClose={onClose}
      isFollowing={localIsFollowing}
      onToggleFollow={handleToggleFollow}
      showFollowButton={!isMe}
      showMessageButton={!isMe && !!onStartDirectMessage}
      onMessage={
        !isMe && onStartDirectMessage
          ? () => {
              onStartDirectMessage({
                id: profile.id,
                name: profile.name,
                avatar: profile.avatar,
                role: profile.title,
              });
              onClose();
            }
          : undefined
      }
      userPlan={userPlan}
      onUnlockPlan={onUnlockPlan}
    />
  );
};
