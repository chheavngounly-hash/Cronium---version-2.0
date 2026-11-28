/**
 * Cross-Platform Sync and Real-Time Event Bus
 * Uses BroadcastChannel for real-time cross-tab/cross-window syncing
 * and localStorage for offline caching.
 */

import { Message, SyncDevice, DirectChat } from '../types';
import { CURRENT_USER, resolveGenderMatchedAvatar } from '../data/mockData';

export type SyncEventType =
  | 'MESSAGE_SENT'
  | 'MESSAGE_EDITED'
  | 'MESSAGE_READ'
  | 'REACTION_ADDED'
  | 'TYPING_STATUS'
  | 'DEVICE_PING'
  | 'COMMUNITY_JOINED'
  | 'COMMUNITY_LEFT';

export interface SyncPayload {
  type: SyncEventType;
  deviceId: string;
  timestamp: number;
  data: unknown;
}

const SYNC_CHANNEL_NAME = 'cronium_cross_platform_sync_v1';
const CACHE_KEY_MESSAGES = 'cronium_cached_messages';
const CACHE_KEY_DIRECT_CHATS = 'cronium_cached_direct_chats';
const CACHE_KEY_DEVICES = 'cronium_sync_devices';

class CrossPlatformSyncService {
  private channel: BroadcastChannel | null = null;
  private currentDeviceId: string;
  private listeners: ((payload: SyncPayload) => void)[] = [];
  // Session-only in-memory caches: live during a session, always revert to original form on reload
  private memoryMessagesMap: Record<string, Message[]> = {};
  private memoryDirectChats: DirectChat[] | null = null;

  constructor() {
    this.currentDeviceId = this.getOrCreateDeviceId();
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent<SyncPayload>) => {
          this.handleIncomingSync(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported', e);
      }
    }
    this.clearPersistedChatCaches();
  }

  private clearPersistedChatCaches() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(CACHE_KEY_MESSAGES);
      localStorage.removeItem(CACHE_KEY_DIRECT_CHATS);
      localStorage.removeItem(CACHE_KEY_DEVICES);
      localStorage.removeItem('cronium_clean_chats_reset_v1');
      localStorage.removeItem('cronium_unique_timestamps_v2');
    } catch {
      // ignore storage reset errors
    }
  }

  private getOrCreateDeviceId(): string {
    return 'dev_' + Math.random().toString(36).substring(2, 9);
  }

  public getDeviceId(): string {
    return this.currentDeviceId;
  }

  public subscribe(cb: (payload: SyncPayload) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public broadcast(type: SyncEventType, data: unknown) {
    const payload: SyncPayload = {
      type,
      deviceId: this.currentDeviceId,
      timestamp: Date.now(),
      data,
    };

    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (err) {
        console.warn('Sync broadcast error:', err);
      }
    }

    // Also notify local listeners
    this.listeners.forEach((l) => l(payload));
  }

  private handleIncomingSync(payload: SyncPayload) {
    if (payload.deviceId === this.currentDeviceId) return; // ignore self
    this.listeners.forEach((l) => l(payload));
  }

  // Session-only in-memory caching helpers
  public saveMessagesToCache(chatId: string, messages: Message[]) {
    this.memoryMessagesMap[chatId] = messages;
  }

  public getCachedMessages(chatId: string): Message[] | null {
    const msgs = this.memoryMessagesMap[chatId];
    return msgs ? msgs : null;
  }

  public getCachedMessagesMap(): Record<string, Message[]> {
    const sanitized: Record<string, Message[]> = {};
    for (const [chatId, msgs] of Object.entries(this.memoryMessagesMap)) {
      if (!Array.isArray(msgs)) continue;
      sanitized[chatId] = msgs.map((m) => ({
        ...m,
        senderAvatar:
          m.senderId === CURRENT_USER.id || m.senderId === 'current_user' || m.senderName === CURRENT_USER.name
            ? CURRENT_USER.avatar
            : resolveGenderMatchedAvatar(m.senderName, m.senderAvatar),
      }));
    }
    return sanitized;
  }

  // Session-only Direct Chats cache
  public saveDirectChats(chats: DirectChat[]) {
    this.memoryDirectChats = chats;
  }

  public getCachedDirectChats(): DirectChat[] | null {
    if (Array.isArray(this.memoryDirectChats) && this.memoryDirectChats.length > 0) {
      return this.memoryDirectChats.map((chat: DirectChat) => ({
        ...chat,
        user: {
          ...chat.user,
          avatar: resolveGenderMatchedAvatar(chat.user.name, chat.user.avatar),
        },
      }));
    }
    return null;
  }

  // Pre-seed initial messages map into session memory if empty
  public seedInitialMessagesIfEmpty(initialMap: Record<string, Message[]>) {
    for (const [chatId, msgs] of Object.entries(initialMap)) {
      if (!this.memoryMessagesMap[chatId] || this.memoryMessagesMap[chatId].length === 0) {
        this.memoryMessagesMap[chatId] = msgs;
      }
    }
  }

  public getConnectedDevices(): SyncDevice[] {
    const defaultDevices: SyncDevice[] = [
      {
        id: this.currentDeviceId,
        name: 'iPhone 16 Pro',
        type: 'phone',
        os: 'iOS 18.2 · Active Client',
        lastSync: 'Live sync active',
        isCurrent: true,
        status: 'synced',
      },
      {
        id: 'mac_01',
        name: 'MacBook Pro M3 Max',
        type: 'desktop',
        os: 'macOS Sequoia 15.1',
        lastSync: 'Synced 1m ago',
        isCurrent: false,
        status: 'synced',
      },
      {
        id: 'ipad_02',
        name: 'iPad Pro 13"',
        type: 'tablet',
        os: 'iPadOS 18.1',
        lastSync: 'Synced 14m ago',
        isCurrent: false,
        status: 'synced',
      },
    ];

    return defaultDevices;
  }
}

export const syncService = new CrossPlatformSyncService();
