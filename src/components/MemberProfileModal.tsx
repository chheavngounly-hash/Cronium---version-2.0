import React, { useState, useEffect, useMemo } from 'react';
import { getUserPosts } from '../data/userPostsData';
import { ServerMember, UserPlan } from '../types';
import { getMemberProfile } from '../data/mockMemberProfiles';
import { UnifiedProfileView, UnifiedProfileData } from './UnifiedProfileView';

interface MemberProfileModalProps {
  member: ServerMember | null;
  serverName: string;
  onClose: () => void;
  onDirectMessage: (member: ServerMember) => void;
  isConnected?: boolean;
  onConnect?: (member: ServerMember) => void;
  userPlan?: UserPlan;
  onUnlockPlan?: (plan: UserPlan) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  member,
  onClose,
  onDirectMessage,
  isConnected = false,
  onConnect,
  userPlan = 'free',
  onUnlockPlan,
}) => {
  const [isFollowing, setIsFollowing] = useState(isConnected);

  useEffect(() => {
    setIsFollowing(isConnected);
  }, [isConnected, member?.id]);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
    if (onConnect && member) {
      onConnect(member);
    }
  };

  const authorPosts = useMemo(() => {
    if (!member) return [];
    return getUserPosts(member.id, member.name, member.avatar, member.headline);
  }, [member?.id, member?.name, member?.avatar, member?.headline]);

  if (!member) return null;

  const profile = getMemberProfile(member.id, member.name, member.avatar, member.headline, {
    role: member.role,
    company: member.company,
    bio: member.bio,
    location: member.location,
    linkedinUrl: member.linkedinUrl,
    githubUrl: member.githubUrl,
    skills: member.skills,
    preserveExactAvatar: true,
  });

  const linkedinHandle =
    profile.linkedinUrl || `linkedin.com/in/${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const githubHandle = profile.githubUrl || `github.com/${profile.username.replace('@', '')}`;

  const unifiedData: UnifiedProfileData = {
    id: member.id,
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
    status: member.status || 'online',
    communitiesCount: profile.communitiesCount,
    connectionsCount: profile.connectionsCount,
    achievementsCount: profile.achievements?.length || 4,
    metrics: {
      honors: profile.metrics?.honors || '1st',
      patentsCount: profile.metrics?.patentsCount ?? (profile.achievements?.length || 4) * 3 + 2,
      contributorRank: profile.metrics?.contributorRank || 'Top 1%',
    },
    achievements: (profile.achievements || []).map((item, idx) => ({
      id: `${member.id}_ach_${idx}`,
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
      isFollowing={isFollowing}
      onToggleFollow={handleToggleFollow}
      onMessage={() => {
        onClose();
        onDirectMessage(member);
      }}
      userPlan={userPlan}
      onUnlockPlan={onUnlockPlan}
    />
  );
};
