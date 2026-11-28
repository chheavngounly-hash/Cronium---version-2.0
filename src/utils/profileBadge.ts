import { UserPlan } from '../types';

export type ProfileBadgeTier = 'standard' | 'green' | 'gold';

export interface ProfileBadgeStyle {
  tier: ProfileBadgeTier;
  bgClass: string;
  iconClass: string;
  title: string;
}

const BADGE_STYLES: Record<ProfileBadgeTier, ProfileBadgeStyle> = {
  standard: {
    tier: 'standard',
    bgClass: 'bg-[#7C869B] dark:bg-slate-500',
    iconClass: 'text-[#7C869B] dark:text-slate-400',
    title: 'Cryptographically Verified Identity',
  },
  green: {
    tier: 'green',
    bgClass: 'bg-[#10B981]',
    iconClass: 'text-emerald-500 dark:text-emerald-400',
    title: 'Green badge verification active',
  },
  gold: {
    tier: 'gold',
    bgClass: 'bg-amber-500',
    iconClass: 'text-amber-500 dark:text-amber-400',
    title: 'Gold badge verification active',
  },
};

const TIER_CYCLE: ProfileBadgeTier[] = ['green', 'gold', 'standard'];

let activeCurrentUserPlan: UserPlan = 'free';

/**
 * Normalizes a person's display name (stripping honorifics like Dr./Prof. and punctuation)
 * so the same person always maps to a single canonical key everywhere on the platform.
 */
function canonicalPersonKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/^(dr|prof|professor|mr|mrs|ms|mx)\.?\s+/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Murmur3 avalanche finalizer for balanced distribution across all 3 tiers
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * Returns ONE permanent, deterministic badge colour (green, gold, or original slate)
 * for each person across the entire platform—never changing between screens or reloads.
 */
export function getProfileBadgeStyle(
  name: string,
  options?: { isCurrentUser?: boolean; userPlan?: UserPlan }
): ProfileBadgeStyle {
  if (options?.userPlan) {
    activeCurrentUserPlan = options.userPlan;
  }

  const canonical = canonicalPersonKey(name);
  const isJennies =
    options?.isCurrentUser || canonical === 'jennies vance' || canonical === 'jennies';

  if (isJennies) {
    const plan = options?.userPlan ?? activeCurrentUserPlan;
    if (plan === 'pro') return BADGE_STYLES.gold;
    if (plan === 'plus') return BADGE_STYLES.green;
    return BADGE_STYLES.standard;
  }

  const tier = TIER_CYCLE[hashSeed(`badge_s3:${canonical}`) % TIER_CYCLE.length];
  return BADGE_STYLES[tier];
}
