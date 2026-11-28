import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Send,
  Smile,
  CornerUpLeft,
  X,
  Phone,
  Video,
  Clock,
  WifiOff,
  Sparkles,
  Lock,
  Mic,
  Trash2,
  Pencil,
  Image as ImageIcon,
  FileText,
  Code2,
  Download,
  Copy,
  Maximize2,
  MoreVertical,
  ChevronLeft,
  Plus,
  ArrowDown,
  Briefcase,
  GraduationCap,
  Users,
} from 'lucide-react';
import { Message, MessageReference, MessageAttachment, User, Community, CommunityChannel, ServerMember, UserPlan } from '../types';
import { CURRENT_USER, resolveGenderMatchedAvatar } from '../data/mockData';
import { getMemberProfile } from '../data/mockMemberProfiles';
import { encryptText } from '../services/encryption';
import { notificationService } from '../services/notifications';
import { syncService } from '../services/sync';
import { audioRecorderService } from '../services/audioRecorder';
import { gamificationService } from '../utils/gamificationService';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { E2EEVerificationModal } from './E2EEVerificationModal';
import { CallModal } from './CallModal';
import { MemberProfileModal } from './MemberProfileModal';
import {
  getMemberDirectMessageResponse,
  getChannelDynamicResponse,
  extractContextTopic,
  pickUniqueReply,
  findKnownServerMemberByName,
} from '../utils/serverDomainData';

interface ChatViewProps {
  chatId: string;
  chatTitle: string;
  chatAvatar: string;
  isServerChannel?: boolean;
  hideHeader?: boolean;
  channelTopic?: string;
  contactUser?: User;
  initialMessages: Message[];
  onBack: () => void;
  isOfflineMode?: boolean;
  serverCommunity?: Community;
  serverMembers?: ServerMember[];
  selectedChannel?: CommunityChannel;
  onOpenDirectChat?: (user: User, initialGreeting?: string) => void;
  onLeaveChat?: () => void;
  userPlan?: UserPlan;
  onUnlockPlan?: (plan: UserPlan) => void;
}

const EMOJI_PALETTE = ['🔥', '🚀', '⚡', '❤️', '👍', '😂', '✨', '💯', '👏'];
const CHAT_INPUT_EMOJIS = [
  '😊', '😂', '🔥', '🚀', '❤️', '👍', '✨', '🎉',
  '🙌', '💯', '😎', '😍', '💡', '🎮', '⭐', '🍕',
  '👏', '🤖', '👀', '🥳', '💪', '☕', '🌟', '🎯'
];

const MAX_SERVER_ICEBREAKER_USES = 2;
const sessionServerIcebreakerUses: Record<string, number> = {};
const sessionUsedServerIcebreakers: Record<string, string[]> = {};

const PERSONA_DOMAINS: Array<{ match: string[]; focus: string; opener: string }> = [
  { match: ['hiroshi', 'tanaka'], focus: 'quantum ML & topological manifolds', opener: 'Greetings Jennies!' },
  { match: ['anna', 'san'], focus: 'multimodal agents & neural audio', opener: 'Hey Jennies!' },
  { match: ['marcus'], focus: 'propulsion telemetry & flight simulations', opener: 'Hey Jennies!' },
  { match: ['priya'], focus: 'clean microgrids & resilient networks', opener: 'Hello Jennies!' },
  { match: ['liam', 'chen'], focus: 'Vulkan raytracing & real-time shaders', opener: 'Hey Jennies!' },
  { match: ['alexander', 'patrick'], focus: 'autonomous robotics & trajectory planning', opener: 'Hi Jennies!' },
  { match: ['elena', 'rostova'], focus: 'neuromorphic silicon & spiking networks', opener: 'Hello Jennies!' },
  { match: ['classie', 'willey'], focus: 'safe generative systems & alignment', opener: 'Hey Jennies!' },
  { match: ['george', 'allan'], focus: 'GPU fabrics & low-latency networking', opener: 'Hey Jennies!' },
  { match: ['mac', 'roseville'], focus: 'WebAssembly crypto & peer meshes', opener: 'Hi Jennies!' },
];

const getPersonaResponse = (user: User, userMessage: string): string => {
  const name = user.name.toLowerCase();
  const matchedPersona = PERSONA_DOMAINS.find((p) => p.match.some((m) => name.includes(m)));

  if (!matchedPersona) {
    return getMemberDirectMessageResponse(user, userMessage);
  }

  const chatKey = `dm_persona::${user.id || name}`;
  const msgLower = userMessage.toLowerCase().trim();
  const topic = extractContextTopic(userMessage);
  const { focus, opener } = matchedPersona;

  // Voice Note context
  const voiceMatch = userMessage.match(/(\d+)\s*s/i);
  if (msgLower.includes('voice note') || msgLower.includes('voice snippet') || msgLower.includes('🎙️')) {
    const secs = voiceMatch ? `${voiceMatch[1]}s` : 'quick';
    return pickUniqueReply(
      chatKey,
      userMessage,
      [
        `${opener} Just listened to your ${secs} voice note—crystal clear! That connects right into what I'm exploring in ${focus}.`,
        `${opener} Appreciate the ${secs} audio update—much easier to catch the nuance by voice. Want to compare notes on ${focus} next?`,
        `${opener} Played your voice message right away! Solid direction—I'll run a quick check on my side and send back my thoughts.`,
        `${opener} Loud and clear on your ${secs} voice clip! Let's build on that idea when we sync up.`,
      ],
      (t) => `${opener} Caught voice note #${t}—super clear! Happy to keep riffing on this.`
    );
  }

  // Attachment context
  if (
    msgLower.startsWith('[image:') ||
    msgLower.startsWith('[code:') ||
    msgLower.startsWith('[file:') ||
    msgLower.includes('[attachment:')
  ) {
    const itemName = userMessage.match(/:\s*([^\]]+)\]/)?.[1]?.trim() || 'your attachment';
    return pickUniqueReply(
      chatKey,
      userMessage,
      [
        `${opener} Just opened ${itemName}—looks super clean! Which part do you want feedback on first?`,
        `${opener} Thanks for sharing ${itemName}! I'm comparing it against our ${focus} notes right now.`,
        `${opener} Got ${itemName}—really clear layout. Give me a moment and I'll send over a few specific suggestions.`,
      ],
      (t) => `${opener} Received ${itemName} (#${t})! Reviewing the details now.`
    );
  }

  // Greeting / Icebreaker context
  if (
    /\b(hi|hey|hello|greetings|great to connect|nice to meet|happy to chat)\b/i.test(msgLower) &&
    msgLower.length < 80
  ) {
    return pickUniqueReply(
      chatKey,
      userMessage,
      [
        `${opener} Wonderful connecting directly—I've been deep into ${focus} today. What's been keeping you excited lately?`,
        `${opener} So glad we connected! Happy to swap notes on ${focus} or whatever you're exploring right now.`,
        `${opener} Great hearing from you! Anything new on your roadmap this week?`,
      ],
      (t) => `${opener} Good catching up (#${t})—what are you diving into next?`
    );
  }

  // Question context
  if (msgLower.includes('?') || /\b(tell me more|how|why|what|thoughts|opinion|recommend|help)\b/i.test(msgLower)) {
    const subject = topic || focus;
    return pickUniqueReply(
      chatKey,
      userMessage,
      [
        `${opener} Great question about ${subject}. From my work in ${focus}, isolating the core bottleneck early makes the biggest difference.`,
        `${opener} Happy to dig into ${subject}—are you optimizing more for speed, simplicity, or scale right now?`,
        `${opener} That's a sharp question on ${subject}! We just tested two approaches around that in ${focus}; happy to share what worked best.`,
        `${opener} On ${subject}, I usually start with a minimal benchmark before adding complexity. What trade-offs are you weighing?`,
      ],
      (t) => `${opener} Thoughtful question on ${subject} (#${t})—let's unpack it together!`
    );
  }

  // Agreement / short positive message
  if (
    /\b(sounds good|makes sense|agreed|awesome|great|thanks|thank you|cool|perfect|got it)\b/i.test(msgLower) &&
    msgLower.length < 55
  ) {
    return pickUniqueReply(
      chatKey,
      userMessage,
      [
        `${opener} Awesome—glad we're on the same page! Ping me anytime you want to review the next step.`,
        `${opener} Sounds like a plan! I'll keep you posted once our next ${focus} run wraps up.`,
        `${opener} Perfect! Really enjoying trading ideas with you here.`,
      ],
      (t) => `${opener} All set (#${t})—talk soon whenever you're ready!`
    );
  }

  // Custom topic context
  if (topic) {
    return pickUniqueReply(
      chatKey,
      userMessage,
      [
        `${opener} Really interesting take on ${topic}—it overlaps nicely with what I've been testing in ${focus}.`,
        `${opener} Sharp observation about ${topic}! Have you noticed any unexpected edge cases with it yet?`,
        `${opener} Love that angle on ${topic}. Let's definitely explore how it holds up in a real test run!`,
        `${opener} Glad you brought up ${topic}—I hadn't approached it from that direction in ${focus} before.`,
      ],
      (t) => `${opener} Appreciate your note on ${topic} (#${t})—curious where you take it next!`
    );
  }

  return pickUniqueReply(
    chatKey,
    userMessage,
    [
      `${opener} Thanks for reaching out! I'm wrapping up a sprint on ${focus}—what's top of mind for you today?`,
      `${opener} Always great hearing from you. Let me know if you want to brainstorm or compare benchmarks!`,
      `${opener} Got your message—let's keep the conversation rolling whenever you have a minute.`,
    ],
    (t) => `${opener} Message received (#${t})—happy to jump into whatever's next!`
  );
};

export const ChatView: React.FC<ChatViewProps> = ({
  chatId,
  chatTitle,
  chatAvatar,
  isServerChannel = false,
  hideHeader = false,
  channelTopic,
  contactUser,
  initialMessages,
  onBack,
  isOfflineMode = false,
  serverCommunity,
  serverMembers,
  selectedChannel,
  onOpenDirectChat,
  onLeaveChat,
  userPlan = 'free',
  onUnlockPlan,
}) => {
  const [showDmMenu, setShowDmMenu] = useState(false);
  const safeChatAvatar = !isServerChannel
    ? resolveGenderMatchedAvatar(contactUser?.name || chatTitle, contactUser?.avatar || chatAvatar)
    : chatAvatar;

  const dmContactIntro = useMemo(() => {
    if (isServerChannel) return null;
    const peerName = contactUser?.name || chatTitle;
    const peerId = contactUser?.id || chatId;
    const knownMember =
      serverMembers?.find(
        (m) => m.id === peerId || m.name.toLowerCase() === peerName.toLowerCase()
      ) || findKnownServerMemberByName(peerName);

    const profile = getMemberProfile(
      peerId,
      peerName,
      safeChatAvatar,
      contactUser?.customStatus || contactUser?.bio || knownMember?.role || '',
      knownMember
        ? {
            role: knownMember.role,
            company: knownMember.company,
            bio: knownMember.bio,
            skills: knownMember.skills,
          }
        : undefined
    );

    const primaryInstitution =
      knownMember?.company?.trim() ||
      (profile.organization ? profile.organization.split('•')[0].trim() : '');

    const isAcademicOnly =
      /university|college|school|academy/i.test(primaryInstitution) &&
      !/lab|institute|center|core|systems|research/i.test(primaryInstitution);

    const canonicalName = peerName
      .trim()
      .toLowerCase()
      .replace(/^(dr\.?|prof\.?|chef|grandmaster|mr\.?|ms\.?|mrs\.?)\s+/i, '');
    let hash = 2166136261;
    for (let i = 0; i < canonicalName.length; i++) {
      hash ^= canonicalName.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const mutualConnections = 2 + (Math.abs(hash) % 15);

    return {
      institution: primaryInstitution,
      isAcademicOnly,
      mutualConnections,
    };
  }, [isServerChannel, contactUser, chatTitle, chatId, serverMembers, safeChatAvatar]);

  const normalizeMessagesAvatars = (list: Message[]): Message[] =>
    list.map((m) => {
      if (m.senderId === CURRENT_USER.id) {
        return { ...m, senderAvatar: CURRENT_USER.avatar };
      }
      if (!isServerChannel && contactUser) {
        return {
          ...m,
          senderAvatar: safeChatAvatar,
          senderName: contactUser.name,
        };
      }
      return {
        ...m,
        senderAvatar: resolveGenderMatchedAvatar(m.senderName, m.senderAvatar),
      };
    });

  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to restore from offline cache, but if cache has fewer messages than initialMessages, prefer initialMessages
    const cached = syncService.getCachedMessages(chatId);
    const rawMsgs = cached && cached.length >= initialMessages.length ? cached : initialMessages;
    const msgs = normalizeMessagesAvatars(rawMsgs);
    syncService.saveMessagesToCache(chatId, msgs);
    return msgs;
  });

  // Keep messages in sync when channel or initialMessages updates
  useEffect(() => {
    const cached = syncService.getCachedMessages(chatId);
    const rawMsgs = cached && cached.length >= initialMessages.length ? cached : initialMessages;
    setMessages(normalizeMessagesAvatars(rawMsgs));
  }, [chatId, initialMessages, isServerChannel, contactUser, safeChatAvatar]);

  const [inputText, setInputText] = useState('');
  const [activeReference, setActiveReference] = useState<MessageReference | null>(null);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [showEmojiPickerFor, setShowEmojiPickerFor] = useState<string | null>(null);
  const [activeMobileActionsMsgId, setActiveMobileActionsMsgId] = useState<string | null>(null);
  const [showInputEmojiPicker, setShowInputEmojiPicker] = useState(false);
  const [showE2EEModal, setShowE2EEModal] = useState(false);
  const [selectedCipher, setSelectedCipher] = useState<{ ciphertext: string; iv: string; algorithm: string } | undefined>(undefined);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollToBottom(distanceFromBottom > 110);
  };

  const scrollToLatestMessages = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const serverIcebreakerKey = isServerChannel ? (serverCommunity?.id || chatId) : '';
  const [serverIcebreakerUses, setServerIcebreakerUses] = useState<number>(
    () => (serverIcebreakerKey ? sessionServerIcebreakerUses[serverIcebreakerKey] || 0 : 0)
  );
  const [usedServerIcebreakers, setUsedServerIcebreakers] = useState<string[]>(
    () => (serverIcebreakerKey ? sessionUsedServerIcebreakers[serverIcebreakerKey] || [] : [])
  );

  useEffect(() => {
    if (!serverIcebreakerKey) {
      setServerIcebreakerUses(0);
      setUsedServerIcebreakers([]);
      return;
    }
    setServerIcebreakerUses(sessionServerIcebreakerUses[serverIcebreakerKey] || 0);
    setUsedServerIcebreakers(sessionUsedServerIcebreakers[serverIcebreakerKey] || []);
  }, [serverIcebreakerKey]);

  const handleUseServerIcebreaker = (prompt: string) => {
    if (!serverIcebreakerKey) return;
    const currentUses = sessionServerIcebreakerUses[serverIcebreakerKey] || 0;
    if (currentUses >= MAX_SERVER_ICEBREAKER_USES) return;

    const nextUses = currentUses + 1;
    const prevUsed = sessionUsedServerIcebreakers[serverIcebreakerKey] || [];
    const nextUsed = prevUsed.includes(prompt) ? prevUsed : [...prevUsed, prompt];

    sessionServerIcebreakerUses[serverIcebreakerKey] = nextUses;
    sessionUsedServerIcebreakers[serverIcebreakerKey] = nextUsed;
    setServerIcebreakerUses(nextUses);
    setUsedServerIcebreakers(nextUsed);

    handleSendMessage(undefined, prompt);
  };

  const aiIcebreakers = useMemo(() => {
    if (isServerChannel) {
      if (serverIcebreakerUses >= MAX_SERVER_ICEBREAKER_USES) {
        return [];
      }
      const channelLabel = chatTitle.replace(/^#/, '').trim() || 'general';
      const communityName = serverCommunity?.name?.trim();
      const topicHint = channelTopic?.trim();
      const serverPrompts = [
        `Hey everyone! Excited to join #${channelLabel} 👋`,
        communityName
          ? `What's everyone working on in ${communityName} right now?`
          : `What's everyone working on in #${channelLabel} right now?`,
        topicHint
          ? `Would love to swap ideas on ${
              topicHint.length > 42 ? `${topicHint.slice(0, 42).trim()}…` : topicHint
            }`
          : `Anyone have favorite resources or tips to share here?`,
        `Happy to collaborate — drop what you're building!`,
      ];
      return serverPrompts.filter((p) => !usedServerIcebreakers.includes(p));
    }

    const firstName = chatTitle.split(' ')[0];
    return [
      `Hi ${firstName}, great to connect!`,
      `Sounds good!`,
      `Happy to chat`,
      `Tell me more`,
    ];
  }, [
    isServerChannel,
    chatTitle,
    serverCommunity?.name,
    channelTopic,
    serverIcebreakerUses,
    usedServerIcebreakers,
  ]);

  useEffect(() => {
    setShowEmojiPickerFor(null);
    setActiveMobileActionsMsgId(null);
    setShowInputEmojiPicker(false);
    setShowAttachmentMenu(false);
    setActiveReference(null);
    setEditingMessageId(null);
    setEditingText('');
    setShowScrollToBottom(false);
  }, [chatId]);
  const [activeCall, setActiveCall] = useState<{
    type: 'voice' | 'video';
    calleeName: string;
    calleeAvatar: string;
    subtitle?: string;
  } | null>(null);
  const [selectedProfileMember, setSelectedProfileMember] = useState<ServerMember | null>(null);

  const handleOpenProfile = (
    memberId: string,
    memberName: string,
    memberAvatar: string,
    memberHeadline?: string
  ) => {
    // 1. Try finding in serverMembers or known directory members
    const match =
      serverMembers?.find(
        (m) =>
          m.id === memberId ||
          m.name.toLowerCase() === memberName.toLowerCase()
      ) || findKnownServerMemberByName(memberName);
    if (match) {
      setSelectedProfileMember({
        ...match,
        avatar: memberAvatar || match.avatar,
        name: memberName || match.name,
      });
      return;
    }
    // 2. Build ServerMember representation backed by canonical member profile
    const canonicalProfile = getMemberProfile(
      memberId,
      memberName,
      memberAvatar,
      memberHeadline || contactUser?.customStatus || contactUser?.bio || ''
    );
    const primaryOrg = canonicalProfile.organization.split('•')[0].trim();
    const fallbackMember: ServerMember = {
      id: memberId || `user_${memberName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      name: memberName,
      avatar: memberAvatar,
      status: contactUser?.status === 'typing' ? 'online' : (contactUser?.status || 'online'),
      role: memberHeadline || contactUser?.customStatus || canonicalProfile.title,
      company: primaryOrg,
      headline: memberHeadline || contactUser?.customStatus || canonicalProfile.title,
      bio: contactUser?.bio || canonicalProfile.bio,
      location: 'San Francisco, CA',
      skills: canonicalProfile.recentTopics || ['Systems Architecture', 'Distributed Protocols'],
      contributionsCount: 142,
      joinedDate: 'Joined Oct 2024',
    };
    setSelectedProfileMember(fallbackMember);
  };

  // Attachment state for images, documents, and code items
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachmentActiveTab, setAttachmentActiveTab] = useState<'image' | 'file'>('image');
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated presets for rapid testing and realistic mesh sharing
  const PRESET_ATTACHMENTS: {
    images: MessageAttachment[];
    files: MessageAttachment[];
    code: MessageAttachment[];
  } = {
    images: [
      {
        id: 'img_cluster_h100',
        type: 'image',
        name: 'H100_Cluster_Topology.png',
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        size: '840 KB',
        fileExtension: 'PNG',
      },
      {
        id: 'img_mesh_arch',
        type: 'image',
        name: 'Zero_Knowledge_Mesh_Architecture.png',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        size: '620 KB',
        fileExtension: 'PNG',
      },
      {
        id: 'img_quantum_phase',
        type: 'image',
        name: 'Cryogenic_Quantum_Telemetry.png',
        url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
        size: '1.1 MB',
        fileExtension: 'PNG',
      },
    ],
    files: [
      {
        id: 'file_triton',
        type: 'file',
        name: 'triton_flash_attention3.py',
        url: '#',
        size: '18.4 KB',
        fileExtension: 'PY',
      },
      {
        id: 'file_benchmarks',
        type: 'file',
        name: 'scaling_benchmarks_256node.csv',
        url: '#',
        size: '74.2 KB',
        fileExtension: 'CSV',
      },
      {
        id: 'file_spec',
        type: 'file',
        name: 'e2ee_quantum_resilient_spec.pdf',
        url: '#',
        size: '1.2 MB',
        fileExtension: 'PDF',
      },
      {
        id: 'file_yaml',
        type: 'file',
        name: 'cluster_slurm_orchestrator.yaml',
        url: '#',
        size: '8.6 KB',
        fileExtension: 'YAML',
      },
    ],
    code: [
      {
        id: 'code_triton',
        type: 'code',
        name: 'triton_flash_fwd.py',
        fileExtension: 'PY',
        codeSnippet: `@triton.jit\ndef _fwd_kernel(\n    Q, K, V, sm_scale,\n    L, M, Out,\n    stride_qz, stride_qh, stride_qm, stride_qk,\n    BLOCK_M: tl.constexpr = 128, BLOCK_N: tl.constexpr = 64\n):\n    start_m = tl.program_id(0)\n    # Online softmax fused compute block\n    acc = tl.zeros([BLOCK_M, BLOCK_N], dtype=tl.float32)\n    return acc`,
      },
      {
        id: 'code_fsdp',
        type: 'code',
        name: 'fsdp2_hybrid_sharding.py',
        fileExtension: 'PY',
        codeSnippet: `from torch.distributed.fsdp import FullyShardedDataParallel as FSDP\nmodel = FSDP(\n    base_model,\n    sharding_strategy=ShardingStrategy.HYBRID_SHARD,\n    device_id=torch.cuda.current_device(),\n    backward_prefetch=BackwardPrefetch.BACKWARD_PRE\n)`,
      },
      {
        id: 'code_quantum',
        type: 'code',
        name: 'phase_estimator.py',
        fileExtension: 'PY',
        codeSnippet: `qc = QuantumCircuit(n_qubits, n_ancilla)\nfor q in range(n_ancilla):\n    qc.h(q)\nqc.append(QFT(n_ancilla).inverse(), range(n_ancilla))\nstatevector = execute(qc, backend).result()`,
      },
    ],
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      const sizeStr = (file.size / 1024).toFixed(1) + ' KB';
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PNG';
      setPendingAttachment({
        id: 'att_' + Date.now(),
        type: 'image',
        name: file.name,
        url: result,
        size: sizeStr,
        fileExtension: ext,
      });
      setShowAttachmentMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDocumentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeStr =
      file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
        : (file.size / 1024).toFixed(1) + ' KB';
    const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      setPendingAttachment({
        id: 'att_' + Date.now(),
        type: 'file',
        name: file.name,
        url: result,
        size: sizeStr,
        fileExtension: ext,
      });
      setShowAttachmentMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSelectPresetAttachment = (attachment: MessageAttachment) => {
    setPendingAttachment(attachment);
    setShowAttachmentMenu(false);
  };

  // Voice Recording Studio State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const waveformAnimRef = useRef<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const inputFieldRef = useRef<HTMLInputElement>(null);

  // Cleanup active recording on unmount or chat switch
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (waveformAnimRef.current) clearInterval(waveformAnimRef.current);
      audioRecorderService.cancelRecording();
    };
  }, [chatId]);

  const handleStartRecording = async () => {
    setShowInputEmojiPicker(false);
    setIsRecording(true);
    setRecordingDuration(0);
    setLiveWaveform(Array.from({ length: 24 }, () => 0.2 + Math.random() * 0.15));

    await audioRecorderService.startRecording();

    const startTime = Date.now();
    recordingTimerRef.current = window.setInterval(() => {
      const sec = Math.floor((Date.now() - startTime) / 1000);
      setRecordingDuration(sec);
    }, 500);

    waveformAnimRef.current = window.setInterval(() => {
      const newWave = audioRecorderService.getLiveWaveform(24);
      setLiveWaveform(newWave);
    }, 75);
  };

  const handleCancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (waveformAnimRef.current) clearInterval(waveformAnimRef.current);
    audioRecorderService.cancelRecording();
    setIsRecording(false);
    setRecordingDuration(0);
    setLiveWaveform([]);
  };

  const handleSendVoiceRecording = async () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (waveformAnimRef.current) clearInterval(waveformAnimRef.current);

    const result = await audioRecorderService.stopRecording();
    setIsRecording(false);

    const duration = Math.max(1, result.duration || recordingDuration);
    const voiceMsgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const encrypted = await encryptText(`[Voice Snippet ${duration}s]`);

    const newMsg: Message = {
      id: voiceMsgId,
      chatId,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderAvatar: CURRENT_USER.avatar,
      text: `🎙️ Voice Note (${duration}s)`,
      timestamp: nowTime,
      createdAt: Date.now(),
      status: isOfflineMode ? 'queued' : 'sent',
      reactions: [],
      encryptedPayload: encrypted,
      isVoiceNote: true,
      audioUrl: result.audioUrl,
      audioDuration: duration,
      audioWaveform: result.waveform,
    };

    notificationService.playSentChime();
    setMessages((prev) => [...prev, newMsg]);
    syncService.broadcast('MESSAGE_SENT', newMsg);

    if (isServerChannel) {
      const unlockedDiscussions = gamificationService.recordPeerReply(chatId, newMsg.text);
      if (unlockedDiscussions) {
        notificationService.notify(
          'Mission Ready to Claim!',
          'You completed "Contribute to Peer Discussions". Open Earn Servers to claim +1 slot!'
        );
      }
    } else if (contactUser || chatId) {
      const targetId = contactUser?.id || chatId;
      const unlockedConnections = gamificationService.recordMemberMessaged(targetId, newMsg.text);
      if (unlockedConnections) {
        notificationService.notify(
          'Mission Ready to Claim!',
          'You completed "Build Meaningful Connections". Open Earn Servers to claim +1 slot!'
        );
      }
    }

    // Simulated peer reply when online (no read receipts)
    if (!isOfflineMode) {

      if (!isServerChannel && contactUser) {
        setTimeout(() => {
          setIsPeerTyping(true);
          setTimeout(async () => {
            setIsPeerTyping(false);
            const chosen = getPersonaResponse(contactUser, `🎙️ Voice Note (${duration}s)`);
            const peerEncrypted = await encryptText(chosen);
            const peerMsgId = 'peer_' + Date.now();
            const peerTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const peerMsg: Message = {
              id: peerMsgId,
              chatId,
              senderId: contactUser.id,
              senderName: contactUser.name,
              senderAvatar: contactUser.avatar,
              text: chosen,
              timestamp: peerTime,
              createdAt: Date.now(),
              status: 'read',
              reactions: [{ emoji: '🎧', count: 1, users: [contactUser.id] }],
              encryptedPayload: peerEncrypted,
            };

            setMessages((prev) => [...prev, peerMsg]);
            syncService.broadcast('MESSAGE_SENT', peerMsg);
            notificationService.notify({
              title: contactUser.name,
              body: chosen,
              avatar: contactUser.avatar,
              chatId,
            });
          }, 2400);
        }, 1500);
      } else if (isServerChannel && serverCommunity && selectedChannel && serverMembers && serverMembers.length > 0) {
        setTimeout(() => {
          setIsPeerTyping(true);
          setTimeout(async () => {
            setIsPeerTyping(false);
            const { responder, text } = getChannelDynamicResponse(
              serverCommunity,
              selectedChannel,
              `Shared a ${duration}s voice note in #${selectedChannel.name}`,
              serverMembers
            );
            const channelMsgId = 'chan_voice_resp_' + Date.now();
            const channelTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const channelEncrypted = await encryptText(text);

            const channelReplyMsg: Message = {
              id: channelMsgId,
              chatId,
              senderId: responder.id,
              senderName: responder.name,
              senderAvatar: responder.avatar,
              text,
              timestamp: channelTime,
              createdAt: Date.now(),
              status: 'read',
              reactions: [{ emoji: '🎧', count: 1, users: [responder.id] }],
              encryptedPayload: channelEncrypted,
            };

            setMessages((prev) => [...prev, channelReplyMsg]);
            syncService.broadcast('MESSAGE_SENT', channelReplyMsg);
            notificationService.notify({
              title: `${responder.name} in #${selectedChannel.name}`,
              body: text,
              avatar: responder.avatar,
              chatId,
            });
          }, 1600);
        }, 900);
      }
    }
  };

  const handleAddEmojiToInput = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    inputFieldRef.current?.focus();
  };

  // Auto scroll to bottom only when message count grows or chat switches
  const prevMsgCountRef = useRef(messages.length);
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    prevMsgCountRef.current = messages.length;
    scrollToBottom('auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    // Cache messages whenever they update (including emoji reactions)
    syncService.saveMessagesToCache(chatId, messages);
    if (messages.length > prevMsgCountRef.current) {
      scrollToBottom('smooth');
    }
    prevMsgCountRef.current = messages.length;
  }, [messages, chatId]);

  // Listen to cross-platform sync bus for real-time reactions and messages
  useEffect(() => {
    const unsubscribe = syncService.subscribe((payload) => {
      if (payload.type === 'MESSAGE_SENT') {
        const newMsg = payload.data as Message;
        if (newMsg.chatId === chatId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      } else if (payload.type === 'REACTION_ADDED') {
        // Ignore events from own device to avoid double-toggling
        if (payload.deviceId === syncService.getDeviceId()) return;

        const { msgId, emoji, userId } = payload.data as { msgId: string; emoji: string; userId: string };
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id !== msgId) return msg;
            return { ...msg, reactions: applySingleUserMessageReaction(msg.reactions, emoji, userId) };
          })
        );
      } else if (payload.type === 'MESSAGE_EDITED') {
        const edited = payload.data as { msgId: string; chatId: string; text: string };
        if (edited.chatId === chatId) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === edited.msgId ? { ...m, text: edited.text, isEdited: true } : m
            )
          );
        }
      } else if (payload.type === 'MESSAGE_READ') {
        const { msgId, status } = payload.data as { msgId: string; status: 'read' | 'delivered' };
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, status } : m))
        );
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  // Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const candidateText = overrideText !== undefined ? overrideText : inputText;
    if (!candidateText.trim() && !pendingAttachment) return;

    const messageText = candidateText.trim();
    const attachmentToSend = overrideText !== undefined ? null : pendingAttachment;
    if (overrideText === undefined) {
      setInputText('');
      setPendingAttachment(null);
    }
    setShowInputEmojiPicker(false);
    setShowAttachmentMenu(false);
    const refToAttach = activeReference;
    setActiveReference(null);

    // Encrypt payload with WebCrypto AES-GCM
    const encryptedContent = messageText || (attachmentToSend ? `[Attachment: ${attachmentToSend.name}]` : '');
    const encrypted = await encryptText(encryptedContent);

    const newMsgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: newMsgId,
      chatId,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderAvatar: CURRENT_USER.avatar,
      text: messageText,
      timestamp: nowTime,
      createdAt: Date.now(),
      status: isOfflineMode ? 'queued' : 'sent',
      reference: refToAttach || undefined,
      attachment: attachmentToSend || undefined,
      reactions: [],
      encryptedPayload: encrypted,
    };

    notificationService.playSentChime();
    setMessages((prev) => [...prev, newMsg]);

    // Track real activity progress for Earn Servers missions
    const activityPayload = messageText || (attachmentToSend ? `[Attachment: ${attachmentToSend.name}]` : '');
    if (activityPayload) {
      if (isServerChannel) {
        const unlockedDiscussions = gamificationService.recordPeerReply(chatId, activityPayload);
        if (unlockedDiscussions) {
          notificationService.notify(
            'Mission Ready to Claim!',
            'You completed "Contribute to Peer Discussions". Open Earn Servers to claim +1 slot!'
          );
        }
      } else {
        const targetId = contactUser?.id || chatId;
        const unlockedConnections = gamificationService.recordMemberMessaged(targetId, activityPayload);
        if (unlockedConnections) {
          notificationService.notify(
            'Mission Ready to Claim!',
            'You completed "Build Meaningful Connections". Open Earn Servers to claim +1 slot!'
          );
        }
      }
    }

    // Broadcast across devices
    syncService.broadcast('MESSAGE_SENT', newMsg);

    // If online, trigger peer reply without read-receipt status updates
    if (!isOfflineMode) {
      const replyContext =
        messageText ||
        (attachmentToSend
          ? `[${attachmentToSend.type === 'image' ? 'Image' : attachmentToSend.type === 'code' ? 'Code' : 'File'}: ${attachmentToSend.name}]`
          : '');

      // Immediate personalized peer response for direct messages
      if (!isServerChannel && contactUser) {
        setTimeout(() => {
          setIsPeerTyping(true);
          // Peer types briefly then immediately replies with distinct persona response
          setTimeout(async () => {
            setIsPeerTyping(false);
            const chosenReply = getPersonaResponse(contactUser, replyContext);
            const peerEncrypted = await encryptText(chosenReply);
            const peerMsgId = 'peer_' + Date.now();
            const peerTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const peerMsg: Message = {
              id: peerMsgId,
              chatId,
              senderId: contactUser.id,
              senderName: contactUser.name,
              senderAvatar: contactUser.avatar,
              text: chosenReply,
              timestamp: peerTime,
              createdAt: Date.now(),
              status: 'read',
              reactions: [],
              encryptedPayload: peerEncrypted,
            };

            notificationService.playSentChime();
            setMessages((prev) => [...prev, peerMsg]);
            syncService.broadcast('MESSAGE_SENT', peerMsg);

            // Push notification
            notificationService.notify({
              title: contactUser.name,
              body: chosenReply,
              avatar: contactUser.avatar,
              chatId,
            });
          }, 800);
        }, 300);
      }

      // Dynamic unique response in server channels from a verified member
      if (isServerChannel && serverCommunity && selectedChannel && serverMembers && serverMembers.length > 0) {
        setTimeout(() => {
          setIsPeerTyping(true);
          setTimeout(async () => {
            setIsPeerTyping(false);
            const { responder, text } = getChannelDynamicResponse(
              serverCommunity,
              selectedChannel,
              replyContext,
              serverMembers
            );
            const channelMsgId = 'chan_resp_' + Date.now();
            const channelTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const channelEncrypted = await encryptText(text);

            const channelReplyMsg: Message = {
              id: channelMsgId,
              chatId,
              senderId: responder.id,
              senderName: responder.name,
              senderAvatar: responder.avatar,
              text,
              timestamp: channelTime,
              createdAt: Date.now(),
              status: 'read',
              reactions: [{ emoji: '✨', count: 1, users: [responder.id] }],
              encryptedPayload: channelEncrypted,
            };

            notificationService.playSentChime();
            setMessages((prev) => [...prev, channelReplyMsg]);
            syncService.broadcast('MESSAGE_SENT', channelReplyMsg);

            notificationService.notify({
              title: `${responder.name} in #${selectedChannel.name}`,
              body: text,
              avatar: responder.avatar,
              chatId,
            });
          }, 850);
        }, 350);
      }
    }
  };

  // Enforce strictly 1 emoji reaction per user per message (Servers & DMs).
  // Clicking the same emoji toggles it off; clicking a different emoji replaces the previous one.
  const applySingleUserMessageReaction = (
    reactions: Message['reactions'],
    emoji: string,
    userId: string
  ): NonNullable<Message['reactions']> => {
    const currentReactions = Array.isArray(reactions) ? reactions : [];
    const hadSameEmoji = currentReactions.some(
      (r) => r.emoji === emoji && Array.isArray(r.users) && r.users.includes(userId)
    );

    // First remove userId from every existing reaction on this message
    const strippedReactions: NonNullable<Message['reactions']> = [];
    for (const r of currentReactions) {
      const users = Array.isArray(r.users) ? r.users : [];
      if (users.includes(userId)) {
        const remainingUsers = users.filter((u) => u !== userId);
        const nextCount = Math.max(0, (r.count || users.length) - 1);
        if (nextCount > 0 || remainingUsers.length > 0) {
          strippedReactions.push({
            ...r,
            count: Math.max(remainingUsers.length, nextCount),
            users: remainingUsers,
          });
        }
      } else {
        strippedReactions.push(r);
      }
    }

    // If user clicked their currently active emoji, we just toggled it off
    if (hadSameEmoji) {
      return strippedReactions;
    }

    // Otherwise add userId to the target emoji (creating it if needed)
    const targetIdx = strippedReactions.findIndex((r) => r.emoji === emoji);
    if (targetIdx >= 0) {
      const target = strippedReactions[targetIdx];
      const nextUsers = [...(Array.isArray(target.users) ? target.users : []), userId];
      return strippedReactions.map((r, idx) =>
        idx === targetIdx
          ? { ...r, count: (target.count || 0) + 1, users: nextUsers }
          : r
      );
    }

    return [...strippedReactions, { emoji, count: 1, users: [userId] }];
  };

  // Toggle emoji reaction (max 1 emoji per user per message)
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setShowEmojiPickerFor(null);
    const userId = CURRENT_USER.id;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        return {
          ...msg,
          reactions: applySingleUserMessageReaction(msg.reactions, emoji, userId),
        };
      })
    );

    // Broadcast reaction across devices
    syncService.broadcast('REACTION_ADDED', { msgId, emoji, userId });
  };

  // Delete message handler: replaces message with a subtle deleted-message line indicator
  const handleDeleteMessage = (messageId: string) => {
    setActiveMobileActionsMsgId(null);
    setShowEmojiPickerFor(null);
    if (editingMessageId === messageId) {
      setEditingMessageId(null);
      setEditingText('');
    }
    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              isDeleted: true,
              text: 'This message was deleted',
              attachment: undefined,
              isVoiceNote: false,
              reactions: [],
            }
          : m
      );
      syncService.saveMessagesToCache(chatId, updated);
      return updated;
    });
  };

  // Edit message handlers
  const handleStartEditMessage = (msg: Message) => {
    setActiveMobileActionsMsgId(null);
    setShowEmojiPickerFor(null);
    setEditingMessageId(msg.id);
    setEditingText(msg.text);
  };

  const handleCancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingText('');
  };

  const handleSaveEditMessage = async (messageId: string) => {
    const trimmed = editingText.trim();
    if (!trimmed) return;
    const encrypted = await encryptText(trimmed);
    setMessages((prev) => {
      const updated = prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              text: trimmed,
              isEdited: true,
              encryptedPayload: encrypted,
            }
          : m
      );
      syncService.saveMessagesToCache(chatId, updated);
      return updated;
    });
    syncService.broadcast('MESSAGE_EDITED', { msgId: messageId, chatId, text: trimmed });
    setEditingMessageId(null);
    setEditingText('');
  };

  // Jump to referenced message
  const handleScrollToReference = (refId: string) => {
    const el = messageRefs.current[refId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-indigo-400', 'bg-indigo-50/50', 'dark:bg-indigo-950/40');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-indigo-400', 'bg-indigo-50/50', 'dark:bg-indigo-950/40');
      }, 1500);
    }
  };

  return (
    <div
      className={`flex flex-col flex-1 h-full min-h-0 ${
        isServerChannel ? 'bg-white dark:bg-slate-950' : 'bg-[#F8FAFC] dark:bg-slate-950'
      } text-slate-900 dark:text-slate-100 relative`}
    >
      {/* Offline banner */}
      {isOfflineMode && (
        <div className="bg-amber-500 text-amber-950 px-3 py-1.5 text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode — Messages are cached locally and will sync when reconnected</span>
          </div>
          <span className="text-[10px] bg-amber-600/30 px-2 py-0.5 rounded font-mono">
            Local Cache Active
          </span>
        </div>
      )}

      {/* Header (shown for DMs or standalone ChatView; ServerView renders unified header + channel pills) */}
      {!hideHeader && (
        <div className="sticky top-0 z-20 px-3 pt-11 pb-2.5 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Back to conversation list"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Avatar (Clickable in DMs to view full profile) */}
            <div
              onClick={() => {
                if (!isServerChannel) {
                  handleOpenProfile(
                    contactUser?.id || chatId,
                    contactUser?.name || chatTitle,
                    safeChatAvatar,
                    contactUser?.customStatus
                  );
                }
              }}
              className={`relative shrink-0 ${!isServerChannel ? 'cursor-pointer group' : ''}`}
              title={!isServerChannel ? `View ${contactUser?.name || chatTitle}'s profile` : undefined}
            >
              <img
                src={safeChatAvatar}
                alt={chatTitle}
                className={`w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 ${
                  !isServerChannel ? 'group-hover:ring-2 group-hover:ring-indigo-500 transition-all' : ''
                }`}
              />
              {!isServerChannel && (
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                    contactUser?.status === 'online'
                      ? 'bg-emerald-500'
                      : contactUser?.status === 'away'
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                />
              )}
            </div>

            {/* Name & status (Individual name is non-clickable; dark status font below) */}
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate font-display leading-tight select-text">
                  {isServerChannel ? `#${chatTitle}` : chatTitle}
                </h2>
              </div>

              <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate leading-tight mt-0.5">
                {isPeerTyping ? (
                  <span className="text-slate-900 dark:text-slate-100 font-semibold flex items-center gap-1">
                    <span className="animate-pulse">typing...</span>
                  </span>
                ) : isServerChannel ? (
                  channelTopic || 'Community discussion'
                ) : contactUser?.customStatus ? (
                  <>
                    {contactUser.status === 'online' ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        Online
                      </span>
                    ) : (
                      <span>Active</span>
                    )}
                    <span>{` • ${contactUser.customStatus}`}</span>
                  </>
                ) : contactUser?.status === 'online' ? (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Online
                    </span>
                    <span> • End-to-End Encrypted</span>
                  </>
                ) : (
                  'End-to-End Encrypted'
                )}
              </p>
            </div>
          </div>

          {/* Original Action icons */}
          <div className="flex items-center gap-1 shrink-0 text-slate-600 dark:text-slate-300">
            {/* Call and video call icons are enabled only in direct chats, not in server features */}
            {!isServerChannel && (
              <>
                <button
                  onClick={() =>
                    setActiveCall({
                      type: 'voice',
                      calleeName: chatTitle,
                      calleeAvatar: chatAvatar,
                      subtitle: 'Direct Encrypted Voice Call',
                    })
                  }
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95"
                  title="Make encrypted voice call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setActiveCall({
                      type: 'video',
                      calleeName: chatTitle,
                      calleeAvatar: chatAvatar,
                      subtitle: 'Direct Encrypted Video Call',
                    })
                  }
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95"
                  title="Make encrypted video call"
                >
                  <Video className="w-4 h-4" />
                </button>

                {/* Three-dot menu inside Message to enable users to leave the message */}
                <div className="relative dm-menu-container">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDmMenu((prev) => !prev);
                    }}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 text-slate-500 dark:text-slate-400"
                    title="Message options"
                    aria-label="Message options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showDmMenu && (
                    <>
                      {/* Backdrop to close menu on click outside */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDmMenu(false)}
                      />
                      <div
                        className="absolute right-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setShowDmMenu(false);
                            if (onLeaveChat) {
                              onLeaveChat();
                            } else {
                              onBack();
                            }
                            notificationService.notify({
                              id: `leave_chat_${chatId}`,
                              title: 'Left Message',
                              body: `You left the conversation with ${chatTitle}.`,
                              avatar: chatAvatar,
                              type: 'system',
                            });
                          }}
                          className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                          <span>Leave Message</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Messages Scroll Feed */}
      <div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        data-subview-scroller="chat"
        className={`flex-1 overflow-y-auto px-3.5 py-3.5 space-y-4 ${
          isServerChannel ? 'bg-white dark:bg-slate-950' : ''
        }`}
      >
        {/* AI Context Synced statement + individual workplace/institution & mutual connections (shown in DMs) */}
        {!isServerChannel && (
          <div className="flex flex-col items-center justify-center text-center pt-1 pb-2 px-2 space-y-1 text-xs sm:text-[13.5px] leading-relaxed">
            <button
              type="button"
              onClick={() => setShowE2EEModal(true)}
              className="inline-flex items-center justify-center gap-1.5 font-semibold text-slate-800 dark:text-slate-100 hover:text-[#4F46E5] dark:hover:text-[#818CF8] transition-colors cursor-pointer"
              title="Tap to verify WebCrypto E2EE safety number"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4F46E5] dark:text-[#818CF8] shrink-0 stroke-[2.1]" />
              <span>AI Context Synced • End-to-End Encrypted</span>
            </button>

            {dmContactIntro && (
              <div className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400">
                {dmContactIntro.institution && (
                  <div className="inline-flex items-center justify-center gap-1.5 max-w-full px-2">
                    {dmContactIntro.isAcademicOnly ? (
                      <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500 shrink-0 stroke-[1.8]" />
                    ) : (
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500 shrink-0 stroke-[1.8]" />
                    )}
                    <span className="truncate">
                      {dmContactIntro.isAcademicOnly ? 'At ' : 'Works at '}
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {dmContactIntro.institution}
                      </span>
                    </span>
                  </div>
                )}
                <div className="inline-flex items-center justify-center gap-1.5">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500 shrink-0 stroke-[1.8]" />
                  <span>{dmContactIntro.mutualConnections} mutual connections</span>
                </div>
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === CURRENT_USER.id;
          const peerId = !isServerChannel ? (contactUser?.id || chatId) : msg.senderId;
          const peerName = !isServerChannel ? (contactUser?.name || chatTitle) : msg.senderName;
          const peerAvatar = !isServerChannel
            ? safeChatAvatar
            : resolveGenderMatchedAvatar(peerName, msg.senderAvatar);

          if (msg.isDeleted) {
            return (
              <div
                key={msg.id}
                ref={(el) => {
                  messageRefs.current[msg.id] = el;
                }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} py-0.5`}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-slate-800/70 border border-dashed border-slate-300 dark:border-slate-700 text-[11px] italic text-slate-500 dark:text-slate-400 select-none">
                  <Trash2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>This message was deleted</span>
                  <span className="text-[10px] not-italic text-slate-400 dark:text-slate-500 ml-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              ref={(el) => {
                messageRefs.current[msg.id] = el;
              }}
              className={`flex flex-col group relative transition-colors rounded-2xl ${
                isMe ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Container matching attached image: Avatar + Name/Time header above white rounded bubble */}
              <div
                className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] ${
                  isMe ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Peer Avatar (Clickable in Servers & DMs to view full profile) */}
                {!isMe && (
                  <button
                    type="button"
                    onClick={() => handleOpenProfile(peerId, peerName, peerAvatar)}
                    className="shrink-0 mt-0.5 rounded-full cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-transform duration-150 active:scale-95 focus:outline-hidden"
                    title={`View ${peerName}'s profile`}
                  >
                    <img
                      src={peerAvatar}
                      alt={peerName}
                      decoding="async"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200/80 dark:border-slate-700 shadow-2xs"
                    />
                  </button>
                )}

                <div className={`flex flex-col relative min-w-0 ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name & Timestamp above bubble (individual name is non-clickable) */}
                  {!isMe && (
                    <div className="flex items-baseline gap-2 mb-1 px-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white text-left truncate max-w-[180px]">
                        {peerName}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  {/* Quoted / Reference Preview */}
                  {msg.reference && (
                    <button
                      type="button"
                      onClick={() => handleScrollToReference(msg.reference!.id)}
                      className={`text-left p-2 mb-1.5 rounded-xl text-xs border transition-all opacity-90 hover:opacity-100 ${
                        isMe
                          ? 'bg-indigo-700/40 text-indigo-100 border-indigo-300/60'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                        <CornerUpLeft className="w-3 h-3" />
                        <span>{msg.reference.senderName}</span>
                      </div>
                      <p className="truncate text-[11px] mt-0.5 line-clamp-1">
                        {msg.reference.text}
                      </p>
                    </button>
                  )}

                  {/* Actual Message Text Bubble */}
                  <div
                    onClick={() => setActiveMobileActionsMsgId(activeMobileActionsMsgId === msg.id ? null : msg.id)}
                    className={`relative ${
                      msg.isVoiceNote ? 'px-3 py-1.5' : 'px-4 py-2.5'
                    } rounded-2xl text-xs sm:text-[13.5px] leading-relaxed transition-all cursor-pointer text-left ${
                      isMe
                        ? 'bg-[#4F46E5] text-white rounded-tr-md shadow-xs'
                        : isServerChannel
                        ? 'bg-[#F8FAFC] dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/75 dark:border-slate-800 rounded-tl-md'
                        : 'bg-white dark:bg-slate-800/95 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-sm shadow-2xs'
                    }`}
                  >
                    {/* Attached Item (Image, Document File, or Code Gist) */}
                    {msg.attachment && (
                      <div className="mb-2">
                        {msg.attachment.type === 'image' && (
                          <div
                            className="relative group cursor-pointer overflow-hidden rounded-xl border border-black/10 dark:border-white/10 shadow-xs max-w-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (msg.attachment?.url) setFullscreenImage(msg.attachment.url);
                            }}
                          >
                            <img
                              src={msg.attachment.url}
                              alt={msg.attachment.name}
                              className="w-full max-h-56 object-cover rounded-xl transition-transform group-hover:scale-102"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                              <Maximize2 className="w-4 h-4" />
                              <span>View Full Size</span>
                            </div>
                            {msg.attachment.name && (
                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-2 text-[11px] text-white truncate flex items-center justify-between">
                                <span className="truncate">{msg.attachment.name}</span>
                                {msg.attachment.size && <span className="text-[10px] opacity-80 shrink-0 ml-2">{msg.attachment.size}</span>}
                              </div>
                            )}
                          </div>
                        )}

                        {msg.attachment.type === 'file' && (
                          <div
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${
                              isMe
                                ? 'bg-indigo-700/50 border-indigo-400/40 text-white'
                                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100'
                            } max-w-xs shadow-2xs`}
                          >
                            <div
                              className={`p-2 rounded-lg ${
                                isMe
                                  ? 'bg-indigo-800/80 text-white'
                                  : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                              }`}
                            >
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{msg.attachment.name}</p>
                              <div className="flex items-center gap-2 text-[10px] opacity-75">
                                <span className="uppercase font-semibold tracking-wider">
                                  {msg.attachment.fileExtension || 'FILE'}
                                </span>
                                {msg.attachment.size && <span>• {msg.attachment.size}</span>}
                              </div>
                            </div>
                            <a
                              href={msg.attachment.url && msg.attachment.url !== '#' ? msg.attachment.url : undefined}
                              download={msg.attachment.name}
                              onClick={(e) => {
                                if (!msg.attachment?.url || msg.attachment.url === '#') {
                                  e.preventDefault();
                                  alert(`Encrypted file verified: ${msg.attachment?.name}`);
                                }
                              }}
                              className={`p-1.5 rounded-lg transition-transform active:scale-95 ${
                                isMe
                                  ? 'hover:bg-indigo-600 text-white'
                                  : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                              }`}
                              title="Download attachment"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        )}

                        {msg.attachment.type === 'code' && (
                          <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-200 max-w-sm text-xs font-mono shadow-sm">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1.5 font-sans font-semibold text-indigo-400 truncate">
                                <Code2 className="w-3.5 h-3.5 shrink-0" />
                                {msg.attachment.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (msg.attachment?.codeSnippet) {
                                    const codeText =
                                      typeof msg.attachment.codeSnippet === 'string'
                                        ? msg.attachment.codeSnippet
                                        : msg.attachment.codeSnippet.code;
                                    navigator.clipboard.writeText(codeText);
                                  }
                                }}
                                className="p-1 hover:text-white rounded transition-colors"
                                title="Copy code"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <pre className="p-2.5 text-[11px] leading-relaxed overflow-x-auto max-h-48 scrollbar-thin">
                              <code>
                                {typeof msg.attachment.codeSnippet === 'string'
                                  ? msg.attachment.codeSnippet
                                  : msg.attachment.codeSnippet?.code || msg.attachment.name}
                              </code>
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {msg.isVoiceNote ? (
                      <VoiceNotePlayer
                        audioUrl={msg.audioUrl}
                        duration={msg.audioDuration}
                        waveform={msg.audioWaveform}
                        isMe={isMe}
                      />
                    ) : editingMessageId === msg.id ? (
                      <div
                        className="min-w-[210px] sm:min-w-[260px] space-y-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSaveEditMessage(msg.id);
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              handleCancelEditMessage();
                            }
                          }}
                          rows={2}
                          autoFocus
                          className="w-full rounded-xl bg-indigo-700/70 text-white placeholder-indigo-200 border border-indigo-300/60 px-2.5 py-1.5 text-xs sm:text-[13px] focus:outline-none focus:border-white resize-none"
                          placeholder="Edit your message..."
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={handleCancelEditMessage}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-700/60 hover:bg-indigo-700 text-indigo-100 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEditMessage(msg.id)}
                            disabled={!editingText.trim()}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 transition-colors cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    )}

                    {/* Metadata (Shown cleanly for outgoing messages without read receipts) */}
                    {isMe && editingMessageId !== msg.id && (
                      <div className="flex items-center gap-1.5 mt-1 justify-end text-[10px] text-indigo-200">
                        {msg.isEdited && <span className="italic opacity-80">(edited)</span>}
                        <span>{msg.timestamp}</span>

                        {(msg.status === 'queued' || msg.status === 'sending') && (
                          <span
                            className="inline-flex items-center"
                            title={msg.status === 'queued' ? 'Queued offline' : 'Sending'}
                          >
                            {msg.status === 'queued' && (
                              <Clock className="w-3 h-3 text-amber-300 animate-pulse" />
                            )}
                            {msg.status === 'sending' && (
                              <Clock className="w-3 h-3 animate-spin" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reactions Display + Direct Add Emoji Pill (visible & working cleanly) */}
                  <div className={`flex flex-wrap items-center gap-1.5 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {msg.reactions &&
                      msg.reactions.map((r, i) => {
                        const hasReacted = Array.isArray(r.users) && r.users.includes(CURRENT_USER.id);
                        return (
                          <button
                            key={`${r.emoji}_${i}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReaction(msg.id, r.emoji);
                            }}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all active:scale-90 cursor-pointer shadow-2xs ${
                              hasReacted
                                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-semibold'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:border-indigo-300'
                            }`}
                          >
                            <span>{r.emoji}</span>
                            <span className="text-[11px] font-semibold tabular-nums">{r.count}</span>
                          </button>
                        );
                      })}

                    {/* Direct React / Emoji Trigger Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEmojiPickerFor(showEmojiPickerFor === msg.id ? null : msg.id);
                      }}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 transition-all cursor-pointer ${
                        showEmojiPickerFor === msg.id
                          ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 border-indigo-300 opacity-100'
                          : 'bg-white/90 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                      title="Add emoji reaction"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick Actions Bar (Responsive on hover or tap) */}
                  {editingMessageId !== msg.id && (
                    <div
                      className={`absolute -top-7 ${
                        isMe ? 'right-0' : 'left-0'
                      } ${
                        activeMobileActionsMsgId === msg.id ? 'flex' : 'hidden group-hover:flex'
                      } items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-1 shadow-md z-20 animate-in fade-in duration-150`}
                    >
                      {/* Emoji Reaction Triggers (max 1 per user per message) */}
                      {['🔥', '🚀', '⚡', '❤️', '👍'].map((em) => {
                        const isSelected = Boolean(
                          msg.reactions?.some(
                            (r) =>
                              r.emoji === em &&
                              Array.isArray(r.users) &&
                              r.users.includes(CURRENT_USER.id)
                          )
                        );
                        return (
                          <button
                            key={em}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReaction(msg.id, em);
                              setActiveMobileActionsMsgId(null);
                            }}
                            className={`hover:scale-125 transition-transform text-xs p-0.5 rounded-full cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-100 dark:bg-indigo-900/80 ring-1 ring-indigo-400 scale-110'
                                : ''
                            }`}
                            title={isSelected ? `Remove ${em} reaction` : `React with ${em}`}
                          >
                            {em}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEmojiPickerFor(showEmojiPickerFor === msg.id ? null : msg.id);
                        }}
                        className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                        title="More reactions"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      {/* Reply / Quote Trigger */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReference({
                            id: msg.id,
                            senderName: msg.senderName,
                            text: msg.text,
                          });
                          setActiveMobileActionsMsgId(null);
                        }}
                        className="p-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                        title="Reply with quote reference"
                      >
                        <CornerUpLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Inspect Cipher */}
                      {msg.encryptedPayload && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCipher(msg.encryptedPayload);
                            setShowE2EEModal(true);
                          }}
                          className="p-0.5 text-slate-400 hover:text-emerald-500 cursor-pointer"
                          title="Inspect WebCrypto AES-GCM Cipher"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Edit Message button for user's own text messages */}
                      {isMe && !msg.isVoiceNote && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditMessage(msg);
                          }}
                          className="p-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                          title="Edit message"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Delete Message button inside emoji quick actions bar */}
                      {isMe && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(msg.id);
                          }}
                          className="p-0.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expanded Emoji Picker popup with Dismiss Backdrop */}
                  {showEmojiPickerFor === msg.id && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEmojiPickerFor(null);
                        }}
                      />
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute top-full mt-1 ${
                          isMe ? 'right-0' : 'left-0'
                        } z-50 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-wrap max-w-[260px] gap-1 animate-in zoom-in-95 duration-150`}
                      >
                        {EMOJI_PALETTE.map((em) => {
                          const isSelected = Boolean(
                            msg.reactions?.some(
                              (r) =>
                                r.emoji === em &&
                                Array.isArray(r.users) &&
                                r.users.includes(CURRENT_USER.id)
                            )
                          );
                          return (
                            <button
                              key={em}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleReaction(msg.id, em);
                                setShowEmojiPickerFor(null);
                                setActiveMobileActionsMsgId(null);
                              }}
                              className={`w-8 h-8 rounded-xl text-base flex items-center justify-center hover:scale-125 transition-transform cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-100 dark:bg-indigo-900/80 ring-1 ring-indigo-400'
                                  : 'hover:bg-indigo-50 dark:hover:bg-slate-800'
                              }`}
                              title={isSelected ? `Remove ${em} reaction` : `React with ${em}`}
                            >
                              {em}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Continuous Typing Indicator */}
        {isPeerTyping && (
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 animate-in fade-in duration-200 ml-1">
            <img
              src={chatAvatar}
              alt="Typing"
              className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <div className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll-to-Bottom Button (when scrolled above latest messages) */}
      {showScrollToBottom && (
        <button
          type="button"
          onClick={scrollToLatestMessages}
          className="absolute bottom-[108px] left-1/2 -translate-x-1/2 z-30 w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center justify-center transition-all active:scale-90 cursor-pointer animate-in fade-in zoom-in-90 duration-150"
          title="Scroll to latest messages"
          aria-label="Scroll to latest messages"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}

      {/* Active Reference / Quote Bar */}
      {activeReference && (
        <div className="px-4 py-2 bg-indigo-50 dark:bg-slate-900 border-t border-indigo-100 dark:border-slate-800 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-2 overflow-hidden">
            <CornerUpLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="text-left text-xs truncate">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">
                Replying to {activeReference.senderName}:{' '}
              </span>
              <span className="text-slate-600 dark:text-slate-400 truncate">
                {activeReference.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveReference(null)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Bar (Quick Reply Chips + Circular Plus / Message Pill with inline Emoji / Mic-or-Send) */}
      <div className="sticky bottom-0 z-20 px-3 pt-2.5 pb-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        {isServerChannel &&
          !isRecording &&
          aiIcebreakers.length > 0 &&
          serverIcebreakerUses < MAX_SERVER_ICEBREAKER_USES && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2.5">
              {aiIcebreakers.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUseServerIcebreaker(prompt)}
                  className="shrink-0 px-3.5 py-1.5 rounded-full bg-white hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 border border-slate-200/90 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all active:scale-95 cursor-pointer"
                  title={`Send "${prompt}"`}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

        {!isServerChannel && !isRecording && aiIcebreakers.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2.5">
            {aiIcebreakers.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(undefined, prompt)}
                className="shrink-0 px-3.5 py-1.5 rounded-full bg-white hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 border border-slate-200/90 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-700 dark:hover:text-indigo-300 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all active:scale-95 cursor-pointer"
                title={`Send "${prompt}"`}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Interactive Emoji Drawer / Picker */}
        {showInputEmojiPicker && !isRecording && (
          <div className="mb-2 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select emoji to send with text
              </span>
              <button
                type="button"
                onClick={() => setShowInputEmojiPicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Close emoji picker"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-1 text-xl sm:text-2xl p-1 max-h-36 overflow-y-auto">
              {CHAT_INPUT_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleAddEmojiToInput(emoji)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-transform active:scale-125 flex items-center justify-center hover:scale-110 cursor-pointer"
                  title={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pending Attachment Preview Staging Area */}
        {pendingAttachment && !isRecording && (
          <div className="mb-2 p-2 px-3 bg-indigo-50/95 dark:bg-slate-800/95 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl flex items-center justify-between gap-3 shadow-xs animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center gap-2.5 min-w-0">
              {pendingAttachment.type === 'image' && pendingAttachment.url && (
                <img
                  src={pendingAttachment.url}
                  alt="preview"
                  className="w-9 h-9 object-cover rounded-lg border border-indigo-200 dark:border-slate-700 shrink-0"
                />
              )}
              {pendingAttachment.type === 'file' && (
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0 shadow-2xs">
                  {pendingAttachment.fileExtension || 'FILE'}
                </div>
              )}
              {pendingAttachment.type === 'code' && (
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-indigo-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <Code2 className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/70 px-1.5 py-0.5 rounded">
                    {pendingAttachment.type}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                    {pendingAttachment.name}
                  </p>
                </div>
                {pendingAttachment.size && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{pendingAttachment.size}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPendingAttachment(null)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Remove attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Attachment Menu Drawer (Photos & Files segmented pill tray matching reference design) */}
        {showAttachmentMenu && !isRecording && (
          <div className="mb-2.5 p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[24px] shadow-[0_8px_28px_rgba(15,23,42,0.08)] animate-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between mb-3.5">
              <div className="inline-flex items-center p-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 gap-1">
                <button
                  type="button"
                  onClick={() => setAttachmentActiveTab('image')}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    attachmentActiveTab === 'image'
                      ? 'bg-[#F1ECFF] dark:bg-violet-950/80 text-[#6D28D9] dark:text-violet-300 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 stroke-[2]" />
                  <span>Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttachmentActiveTab('file')}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    attachmentActiveTab === 'file'
                      ? 'bg-[#F1ECFF] dark:bg-violet-950/80 text-[#6D28D9] dark:text-violet-300 shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4 stroke-[2]" />
                  <span>Files</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowAttachmentMenu(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close attachment menu"
                aria-label="Close attachment menu"
              >
                <X className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

            {/* Hidden native file inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileUpload}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.csv,.json,.py,.ts,.zip,.yaml"
              onChange={handleDocumentFileUpload}
              className="hidden"
            />

            {/* Tab: Photos */}
            {attachmentActiveTab === 'image' && (
              <div className="grid grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="aspect-square rounded-[18px] bg-[#F5F2FF] dark:bg-violet-950/50 hover:bg-[#ECE6FF] dark:hover:bg-violet-950/80 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title="Browse photos from device"
                >
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-center text-[#6D28D9] dark:text-violet-300">
                    <Plus className="w-4 h-4 stroke-[2.4]" />
                  </span>
                  <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#6D28D9] dark:text-violet-300 leading-none">
                    Browse
                  </span>
                </button>

                {PRESET_ATTACHMENTS.images.map((img) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => handleSelectPresetAttachment(img)}
                    className="group relative aspect-square rounded-[18px] overflow-hidden border border-slate-200/70 dark:border-slate-700/80 hover:ring-2 hover:ring-[#7C2DF8] transition-all cursor-pointer active:scale-95"
                    title={`${img.name} (${img.size})`}
                  >
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Tab: Files */}
            {attachmentActiveTab === 'file' && (
              <div className="grid grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-[18px] bg-[#F5F2FF] dark:bg-violet-950/50 hover:bg-[#ECE6FF] dark:hover:bg-violet-950/80 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  title="Browse files from device"
                >
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-center text-[#6D28D9] dark:text-violet-300">
                    <Plus className="w-4 h-4 stroke-[2.4]" />
                  </span>
                  <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#6D28D9] dark:text-violet-300 leading-none">
                    Browse
                  </span>
                </button>

                {PRESET_ATTACHMENTS.files.slice(0, 3).map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={() => handleSelectPresetAttachment(file)}
                    className="aspect-square rounded-[18px] p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-[#F5F2FF] dark:hover:bg-violet-950/40 border border-slate-200/80 dark:border-slate-700 hover:border-[#7C2DF8]/50 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer active:scale-95"
                    title={`${file.name} (${file.size})`}
                  >
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1ECFF] dark:bg-violet-950/80 text-[#6D28D9] dark:text-violet-300 uppercase">
                      {file.fileExtension}
                    </span>
                    <span className="text-[10.5px] font-semibold text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight w-full break-all">
                      {file.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {isRecording ? (
          /* Live Voice Recording Studio with Visual Waveform Animation */
          <div className="flex items-center gap-2 w-full animate-in fade-in duration-200">
            {/* Cancel & Discard Button */}
            <button
              type="button"
              onClick={handleCancelRecording}
              className="p-2.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 shrink-0 transition-transform active:scale-90 cursor-pointer shadow-2xs"
              title="Cancel and discard voice recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Recording Audio Waveform Bar */}
            <div className="flex-1 flex items-center justify-between px-3 py-1.5 bg-indigo-50/80 dark:bg-slate-800 rounded-full border border-indigo-200/90 dark:border-slate-700 min-w-0 shadow-xs">
              {/* Blinking Live Recording Dot & Time */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                  {Math.floor(recordingDuration / 60)}:{recordingDuration % 60 < 10 ? '0' : ''}{recordingDuration % 60}
                </span>
              </div>

              {/* Dynamic Live Waveform Animation */}
              <div className="flex-1 flex items-center justify-center gap-[2.5px] h-5 mx-2 sm:mx-3 overflow-hidden">
                {liveWaveform.map((amp, idx) => {
                  const heightPct = Math.max(16, Math.min(100, Math.round(amp * 100)));
                  return (
                    <div
                      key={idx}
                      style={{
                        height: `${heightPct}%`,
                        transition: 'height 75ms ease-out',
                      }}
                      className="w-[3px] rounded-full bg-gradient-to-t from-indigo-600 to-violet-500 shadow-2xs"
                    />
                  );
                })}
              </div>
            </div>

            {/* Send Voice Note Button */}
            <button
              type="button"
              onClick={handleSendVoiceRecording}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm active:scale-95 shrink-0 cursor-pointer flex items-center justify-center transition-all"
              title="Send voice note"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* Circular Plus / Active Purple Close Attachment Button */}
            <button
              type="button"
              onClick={() => {
                setShowAttachmentMenu((prev) => !prev);
                setShowInputEmojiPicker(false);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer active:scale-95 ${
                showAttachmentMenu
                  ? 'bg-[#7C2DF8] hover:bg-[#6D28D9] border-transparent text-white shadow-[0_4px_14px_rgba(124,45,248,0.38)]'
                  : pendingAttachment
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              title={showAttachmentMenu ? 'Close attachments' : 'Attach photos or files'}
              aria-label={showAttachmentMenu ? 'Close attachments' : 'Attach photos or files'}
            >
              {showAttachmentMenu ? (
                <X className="w-5 h-5 stroke-[2.2]" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>

            {/* Rounded Pill Text Input with Inline Emoji Trigger */}
            <div className="flex-1 relative flex items-center bg-[#F8FAFC] dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900 rounded-full transition-all">
              <input
                ref={inputFieldRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  pendingAttachment
                    ? `Add a message with ${pendingAttachment.name}...`
                    : isServerChannel
                    ? `Message #${chatTitle}...`
                    : `Message ${chatTitle}...`
                }
                className="w-full py-2.5 pl-4 pr-10 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setShowInputEmojiPicker((prev) => !prev);
                  setShowAttachmentMenu(false);
                }}
                className={`absolute right-2 p-1.5 rounded-full transition-colors cursor-pointer ${
                  showInputEmojiPicker
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950'
                    : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
                title={showInputEmojiPicker ? 'Close emoji picker' : 'Add emoji to message'}
                aria-label="Add emoji"
              >
                <Smile className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Right Action: Solid Send button when composing, circular Mic button when idle */}
            {inputText.trim() || pendingAttachment ? (
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#4F46E5] hover:bg-indigo-700 text-white shadow-sm active:scale-95 shrink-0 cursor-pointer flex items-center justify-center transition-all"
                title="Send encrypted message"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRecording}
                className="w-10 h-10 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 shrink-0 cursor-pointer flex items-center justify-center"
                title="Record voice note"
                aria-label="Record voice note"
              >
                <Mic className="w-[18px] h-[18px]" />
              </button>
            )}
          </form>
        )}
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all cursor-pointer"
              title="Close image"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={fullscreenImage}
              alt="Enlarged attachment"
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl object-contain border border-white/15"
            />
          </div>
        </div>
      )}

      {/* E2EE Verification Modal (Works for both DMs and Server Channels) */}
      <E2EEVerificationModal
        isOpen={showE2EEModal}
        onClose={() => setShowE2EEModal(false)}
        contactUser={
          contactUser || {
            id: serverCommunity?.id || chatId,
            name: serverCommunity?.name ? `${serverCommunity.name} (#${chatTitle})` : `#${chatTitle}`,
            avatar: chatAvatar,
            status: 'online',
            safetyNumber: '48192 - 38102 - 19823 - 90182 - 44182 - 77192',
          }
        }
        sampleCiphertext={selectedCipher}
      />

      {/* Voice & Video Call Modal with Messenger Call Information & In-Chat Call Summary */}
      {activeCall && (
        <CallModal
          callType={activeCall.type}
          calleeName={activeCall.calleeName}
          calleeAvatar={activeCall.calleeAvatar}
          calleeSubtitle={activeCall.subtitle}
          isServerHuddle={isServerChannel}
          onClose={(dur?: number) => {
            if (dur && dur > 0) {
              const mins = Math.floor(dur / 60);
              const secs = dur % 60;
              const durText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
              const callNotice: Message = {
                id: `call_${Date.now()}`,
                chatId,
                senderId: CURRENT_USER.id,
                senderName: CURRENT_USER.name,
                senderAvatar: CURRENT_USER.avatar,
                text: `${activeCall.type === 'video' ? '📹 Encrypted Video Call' : '📞 Encrypted Voice Call'} · ${durText}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                createdAt: Date.now(),
                status: 'read',
                reactions: [],
              };
              setMessages((prev) => [...prev, callNotice]);
            }
            setActiveCall(null);
          }}
        />
      )}

      {/* Member Profile Modal from clicking peer avatars or names in Servers & DMs */}
      {selectedProfileMember && (
        <MemberProfileModal
          member={selectedProfileMember}
          serverName={serverCommunity?.name || (isServerChannel ? chatTitle : 'Direct Message')}
          onClose={() => setSelectedProfileMember(null)}
          onDirectMessage={(m) => {
            setSelectedProfileMember(null);
            const userObj: User = {
              id: m.id,
              name: m.name,
              avatar: m.avatar,
              status: m.status,
              customStatus: m.role || m.headline,
              bio: m.bio,
              safetyNumber: m.safetyNumber,
            };
            if (onOpenDirectChat) {
              onOpenDirectChat(userObj);
            }
          }}
          userPlan={userPlan}
          onUnlockPlan={onUnlockPlan}
        />
      )}
    </div>
  );
};
