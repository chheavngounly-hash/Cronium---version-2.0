import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Layers,
  GitBranch,
  Sliders,
  Eye,
  EyeOff,
  PanelLeft,
  X,
  FileCode2,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  Calendar,
  Hash,
  Phone,
  Lock,
  Sparkles,
  Users,
  Send,
  Plus,
} from 'lucide-react';
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  FLOW_LANES,
  PROTOTYPE_SCREENS,
  PROTOTYPE_EDGES,
  DESIGN_TOKENS_PREVIEW,
  PrototypeFlowGroup,
  PrototypeScreenNode,
  PrototypeEdge,
  ScreenKind,
} from '../data/prototypeFlowData';

interface PrototypeFlowBoardProps {
  onOpenLiveScreen: (tab: 'home' | 'servers' | 'feed' | 'profile') => void;
}

const CANVAS_WIDTH = 1900;
const CANVAS_HEIGHT = 1840;

const KIND_LABEL: Record<ScreenKind, string> = {
  'primary-tab': 'Primary Tab',
  'sub-screen': 'Sub-Screen',
  'modal-sheet': 'Modal Sheet',
  overlay: 'Full Overlay',
};

function getEdgePath(
  from: PrototypeScreenNode,
  to: PrototypeScreenNode,
  indexOffset: number
): { path: string; labelX: number; labelY: number } {
  const sameRow = Math.abs(from.y - to.y) < 20;
  const dx = to.x - from.x;

  // Adjacent left-to-right on same swimlane
  if (sameRow && dx > 0 && dx <= 340) {
    const x1 = from.x + CARD_WIDTH;
    const y1 = from.y + CARD_HEIGHT * 0.5;
    const x2 = to.x;
    const y2 = to.y + CARD_HEIGHT * 0.5;
    const cx = (x1 + x2) / 2;
    return {
      path: `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
      labelX: cx,
      labelY: y1 - 12,
    };
  }

  // Non-adjacent forward jump on same swimlane -> arc above artboards
  if (sameRow && dx > 340) {
    const x1 = from.x + CARD_WIDTH * 0.52;
    const y1 = from.y;
    const x2 = to.x + CARD_WIDTH * 0.48;
    const y2 = to.y;
    const spanLevel = Math.min(4, Math.round(dx / 304));
    const lift = 34 + spanLevel * 12 + (indexOffset % 2) * 8;
    const cy = Math.min(y1, y2) - lift;
    return {
      path: `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`,
      labelX: (x1 + x2) / 2,
      labelY: cy + 8,
    };
  }

  // Reverse edge on same swimlane -> arc below artboards
  if (sameRow && dx < 0) {
    const x1 = from.x + CARD_WIDTH * 0.45;
    const y1 = from.y + CARD_HEIGHT;
    const x2 = to.x + CARD_WIDTH * 0.55;
    const y2 = to.y + CARD_HEIGHT;
    const drop = 42 + (indexOffset % 2) * 14;
    const cy = Math.max(y1, y2) + drop;
    return {
      path: `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`,
      labelX: (x1 + x2) / 2,
      labelY: cy - 8,
    };
  }

  // Cross-lane downward
  if (to.y > from.y) {
    const x1 = from.x + CARD_WIDTH * 0.5;
    const y1 = from.y + CARD_HEIGHT;
    const x2 = to.x + CARD_WIDTH * 0.5;
    const y2 = to.y;
    const midY = y1 + (y2 - y1) * 0.5;
    return {
      path: `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`,
      labelX: (x1 + x2) / 2,
      labelY: midY - 6,
    };
  }

  // Cross-lane upward
  const x1 = from.x + CARD_WIDTH * 0.72;
  const y1 = from.y;
  const x2 = to.x + CARD_WIDTH * 0.28;
  const y2 = to.y + CARD_HEIGHT;
  const midY = y1 + (y2 - y1) * 0.5;
  return {
    path: `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`,
    labelX: (x1 + x2) / 2,
    labelY: midY - 6,
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildExportableFlowSvg(): string {
  const screenMap = new Map(PROTOTYPE_SCREENS.map((s) => [s.id, s]));

  const lanesSvg = FLOW_LANES.map(
    (lane) => `
    <g>
      <text x="56" y="${lane.yStart + 20}" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="700" fill="${lane.accentHex}">${escapeXml(lane.index)}.</text>
      <text x="84" y="${lane.yStart + 20}" font-family="Inter, system-ui, sans-serif" font-size="15" font-weight="700" fill="#0F172A">${escapeXml(lane.title)}</text>
      <text x="84" y="${lane.yStart + 38}" font-family="Inter, system-ui, sans-serif" font-size="11" fill="#64748B">${escapeXml(lane.subtitle)}</text>
      <line x1="56" y1="${lane.yStart + 46}" x2="${CANVAS_WIDTH - 56}" y2="${lane.yStart + 46}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4 4" />
    </g>`
  ).join('');

  const edgesSvg = PROTOTYPE_EDGES.map((edge, idx) => {
    const from = screenMap.get(edge.from);
    const to = screenMap.get(edge.to);
    if (!from || !to) return '';
    const { path, labelX, labelY } = getEdgePath(from, to, idx);
    return `
    <g>
      <path d="${path}" fill="none" stroke="#6C3BF5" stroke-opacity="0.55" stroke-width="1.6" marker-end="url(#arrow-violet)" />
      <rect x="${labelX - 52}" y="${labelY - 9}" width="104" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
      <text x="${labelX}" y="${labelY + 3}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="8.5" font-weight="600" fill="#334155">${escapeXml(edge.trigger.slice(0, 22))}</text>
    </g>`;
  }).join('');

  const cardsSvg = PROTOTYPE_SCREENS.map((screen) => {
    const lane = FLOW_LANES.find((l) => l.id === screen.flow);
    const accent = lane?.accentHex ?? '#6C3BF5';
    return `
    <g transform="translate(${screen.x}, ${screen.y})">
      <text x="2" y="-10" font-family="ui-monospace, monospace" font-size="10" font-weight="700" fill="${accent}">${escapeXml(screen.code)}</text>
      <text x="36" y="-10" font-family="Inter, system-ui, sans-serif" font-size="10.5" font-weight="600" fill="#0F172A">${escapeXml(screen.title.slice(0, 26))}</text>
      <rect x="0" y="0" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="22" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" />
      <rect x="82" y="8" width="60" height="10" rx="5" fill="#0F172A" />
      <rect x="14" y="32" width="${CARD_WIDTH - 28}" height="28" rx="8" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="22" y="50" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="700" fill="#0F172A">${escapeXml(screen.title.slice(0, 24))}</text>
      <text x="14" y="78" font-family="ui-monospace, monospace" font-size="9" fill="#64748B">${escapeXml(screen.componentName)}</text>
      <text x="14" y="96" font-family="ui-monospace, monospace" font-size="9" fill="#475569">${escapeXml(screen.dimensions)} · ${escapeXml(screen.zIndex)}</text>
      <rect x="14" y="114" width="${CARD_WIDTH - 28}" height="154" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1" />
      <text x="22" y="136" font-family="Inter, system-ui, sans-serif" font-size="9.5" font-weight="600" fill="${accent}">${escapeXml(KIND_LABEL[screen.kind])}</text>
      <text x="22" y="156" font-family="Inter, system-ui, sans-serif" font-size="8.5" fill="#475569">${escapeXml(screen.summary.slice(0, 34))}</text>
      <text x="22" y="170" font-family="Inter, system-ui, sans-serif" font-size="8.5" fill="#475569">${escapeXml(screen.summary.slice(34, 68))}</text>
      <text x="22" y="184" font-family="Inter, system-ui, sans-serif" font-size="8.5" fill="#475569">${escapeXml(screen.summary.slice(68, 102))}...</text>
      <rect x="14" y="${CARD_HEIGHT - 44}" width="${CARD_WIDTH - 28}" height="28" rx="8" fill="${accent}" fill-opacity="0.1" />
      <text x="${CARD_WIDTH / 2}" y="${CARD_HEIGHT - 26}" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="9" font-weight="600" fill="${accent}">Corner Radius: ${escapeXml(screen.cornerRadius)}</text>
    </g>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}">
  <defs>
    <marker id="arrow-violet" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#6C3BF5" />
    </marker>
  </defs>
  <rect width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="#F8FAFC" />
  <text x="56" y="38" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="800" fill="#0F172A">Cronium — All-Screen Prototype Flow (iPhone 15 · 432×804)</text>
  ${lanesSvg}
  ${edgesSvg}
  ${cardsSvg}
</svg>`;
}

/** Miniature authentic UI thumbnail inside each 224×336 iPhone 15 artboard */
const MiniScreenPreview: React.FC<{ screen: PrototypeScreenNode }> = ({ screen }) => {
  const isPrimaryTab = screen.kind === 'primary-tab';
  const showMiniNav = isPrimaryTab;

  const renderBody = () => {
    switch (screen.previewVariant) {
      case 'home-onboarding':
        return (
          <div className="p-2.5 flex flex-col gap-2 h-full bg-[#F7F9FC] dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded bg-[#6C3BF5]" />
                <span className="text-[8px] font-bold text-slate-800 dark:text-slate-100">Cronium</span>
              </div>
              <span className="text-[7px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                0/2 Slots +
              </span>
            </div>
            <div className="mt-1">
              <div className="text-[6.5px] uppercase tracking-[0.09em] font-semibold text-slate-400">
                AI COMMUNITY MATCHMAKER
              </div>
              <div className="text-[11px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mt-0.5">
                Welcome <span className="text-[#6C3BF5]">jennies</span>, to Cronium
              </div>
            </div>
            {/* Curved Step Progress */}
            <div className="flex items-center justify-between px-2 py-1">
              <span className="w-3.5 h-3.5 rounded-full bg-[#6C3BF5] text-white text-[7px] flex items-center justify-center font-bold">1</span>
              <span className="flex-1 h-0.5 bg-indigo-200 dark:bg-indigo-900 mx-1" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 text-[7px] flex items-center justify-center font-bold">2</span>
              <span className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 mx-1" />
              <span className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 text-[7px] flex items-center justify-center font-bold">3</span>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[8px] font-bold text-slate-800 dark:text-slate-100">
                  Step 1 · What topics excite you?
                </div>
                <div className="mt-1.5 h-10 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-1.5 text-[7px] text-slate-400">
                  ZK proofs, autonomous AI agents, robotics...
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">AI Agents</span>
                  <span className="text-[6.5px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">DeepTech</span>
                </div>
              </div>
              <div className="h-5 rounded-lg bg-gradient-to-r from-[#6C3BF5] to-[#0EA5E9] text-white text-[7.5px] font-bold flex items-center justify-center">
                Continue to Step 2
              </div>
            </div>
          </div>
        );

      case 'home-loop':
        return (
          <div className="p-2.5 flex flex-col gap-2 h-full bg-[#F7F9FC] dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-slate-800 dark:text-slate-100">Cronium</span>
              <span className="text-[7px] font-semibold text-indigo-600 dark:text-indigo-400">History</span>
            </div>
            <div>
              <div className="text-[6.5px] uppercase tracking-[0.09em] font-semibold text-slate-400">
                AI COMMUNITY MATCHMAKER
              </div>
              <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5">
                Welcome <span className="text-[#6C3BF5]">jennies</span>, to Cronium
              </div>
            </div>
            {/* 3-Stage Segmented Pill */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[6px] font-semibold">
              <span className="flex-1 text-center py-1 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs truncate px-1">
                1·Topics ✓
              </span>
              <span className="flex-1 text-center py-1 text-slate-500 truncate px-0.5">2·Offline</span>
              <span className="flex-1 text-center py-1 text-slate-500 truncate px-0.5">3·Now</span>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="text-[7.5px] font-semibold text-slate-700 dark:text-slate-200">
                  Prompt all 3 stages to unlock servers
                </div>
                <div className="h-14 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 text-[7px] text-slate-400">
                  Refine interests, hobbies, or active goal...
                </div>
              </div>
              <div className="h-5 rounded-lg bg-[#6C3BF5] text-white text-[7px] font-bold flex items-center justify-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Match Communities (3/3)
              </div>
            </div>
          </div>
        );

      case 'matched-servers':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-[#F7F9FC] dark:bg-slate-950">
            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-800 dark:text-white">
              <ArrowLeft className="w-2.5 h-2.5" /> AI Matched Servers
            </div>
            {[
              { name: 'AI Systems Architects', match: '98%', members: '1.4k' },
              { name: 'Stanford DeepTech Hub', match: '95%', members: '920' },
              { name: 'ZK Cryptography Guild', match: '92%', members: '680' },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-bold text-slate-900 dark:text-white truncate">{item.name}</span>
                  <span className="text-[7px] font-bold text-emerald-600 dark:text-emerald-400">{item.match}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[6.5px] text-slate-500">{item.members} verified</span>
                  <span className="text-[6.5px] font-bold px-2 py-0.5 rounded-full bg-[#6C3BF5] text-white">Join</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'home-slots':
        return (
          <div className="p-2.5 flex flex-col gap-2 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-bold text-slate-900 dark:text-white">Community Slots</span>
              <span className="text-[7px] font-mono text-indigo-600 dark:text-indigo-400">0 / 2 Free</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="w-1/2 h-full bg-[#6C3BF5] rounded-full" />
            </div>
            <div className="space-y-1.5 flex-1">
              {['Verify work email (+1 Slot)', 'Post first showcase (+1 Slot)', 'Invite 2 peers (+1 Slot)'].map((q) => (
                <div key={q} className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[7px] font-medium text-slate-700 dark:text-slate-200">{q}</span>
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
            <div className="h-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[7px] font-bold flex items-center justify-center">
              Upgrade to Plus · 5 Slots
            </div>
          </div>
        );

      case 'home-history':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="text-[8.5px] font-bold text-slate-900 dark:text-white">Prompt History</div>
            {['Today · AI Agents & Robotics', 'Yesterday · Venture & Seed', 'Nov 19 · Spatial Compute'].map((entry) => (
              <div key={entry} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="text-[7.5px] font-bold text-slate-800 dark:text-slate-100">{entry}</div>
                <div className="text-[6.5px] text-slate-500 mt-0.5">3 stages saved · 4 servers matched</div>
              </div>
            ))}
          </div>
        );

      case 'servers-hub':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-[#F7F9FC] dark:bg-slate-950">
            <div className="text-[9px] font-extrabold text-slate-900 dark:text-white">Servers & DMs</div>
            <div className="text-[6.5px] font-bold uppercase text-slate-400">Joined Servers</div>
            {['AI Systems Core', 'Founder Builders'].map((s, idx) => (
              <div key={s} className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-[7px] font-bold flex items-center justify-center">
                    {s[0]}
                  </span>
                  <span className="text-[7.5px] font-bold text-slate-800 dark:text-slate-100">{s}</span>
                </div>
                <span className="text-[6.5px] font-mono font-bold text-[#6C3BF5]">{idx === 0 ? '4' : '1'}</span>
              </div>
            ))}
            <div className="text-[6.5px] font-bold uppercase text-slate-400 mt-1">Direct Messages</div>
            {['Anna San', 'Marcus Vance'].map((u) => (
              <div key={u} className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[6.5px] font-bold flex items-center justify-center">
                  {u[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[7.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">{u}</div>
                  <div className="text-[6px] text-slate-400 truncate">Sent an encrypted note</div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'server-chat':
        return (
          <div className="p-2 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="text-[8px] font-bold text-slate-900 dark:text-white"># general</span>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-0.5 text-[6px] font-bold">
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-indigo-600">Chat</span>
                <span className="px-1.5 py-0.5 text-slate-500">Members</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-1.5">
                <div className="text-[7px] font-bold text-slate-800 dark:text-slate-100">Anna San</div>
                <div className="text-[6.5px] text-slate-600 dark:text-slate-300 mt-0.5">Benchmarks for edge inference are live.</div>
                <span className="inline-block mt-1 text-[6px] px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  🔥 1 (max 1/user)
                </span>
              </div>
              <div className="bg-[#6C3BF5] text-white rounded-lg p-1.5 ml-6">
                <div className="text-[6.5px]">Reviewing the latency chart now!</div>
              </div>
            </div>
            <div className="h-5 rounded-full bg-slate-100 dark:bg-slate-800 px-2 flex items-center justify-between text-[6.5px] text-slate-400">
              <span>Message #general...</span>
              <Send className="w-2.5 h-2.5 text-[#6C3BF5]" />
            </div>
          </div>
        );

      case 'server-members':
        return (
          <div className="p-2 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="text-[8px] font-bold text-slate-900 dark:text-white">Members (18)</span>
              <Users className="w-3 h-3 text-indigo-500" />
            </div>
            {[
              { name: 'Anna San', role: 'Lead Architect · Cerebras' },
              { name: 'Devon Park', role: 'Robotics Lead · Figure' },
              { name: 'Priya Nair', role: 'Partner · Sequoia' },
            ].map((m) => (
              <div key={m.name} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <div className="text-[7.5px] font-bold text-slate-900 dark:text-white truncate">{m.name}</div>
                  <div className="text-[6px] text-slate-500 truncate">{m.role}</div>
                </div>
                <span className="text-[6px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 shrink-0">
                  Message
                </span>
              </div>
            ))}
          </div>
        );

      case 'quick-dm':
        return (
          <div className="flex flex-col justify-end h-full bg-slate-900/40 dark:bg-slate-950/80 p-2">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 space-y-2">
              <div className="text-[8px] font-bold text-slate-900 dark:text-white">Message Anna San</div>
              <div className="text-[6.5px] px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 truncate">
                Icebreaker: Ask about Wafer-Scale AI
              </div>
              <div className="h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 text-[6.5px] text-slate-400">
                Write an encrypted direct message...
              </div>
              <div className="h-5 rounded-lg bg-[#6C3BF5] text-white text-[7px] font-bold flex items-center justify-center">
                Send Direct Message
              </div>
            </div>
          </div>
        );

      case 'dm-chat':
        return (
          <div className="p-2 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[6.5px] font-bold flex items-center justify-center">A</span>
                <span className="text-[8px] font-bold text-slate-900 dark:text-white">Anna San</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <Phone className="w-2.5 h-2.5" />
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
              </div>
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1.5 mr-6 text-[6.5px] text-slate-700 dark:text-slate-200">
                Let’s sync after the Stanford AI keynote.
              </div>
              <div className="bg-[#6C3BF5] text-white rounded-lg p-1.5 ml-6 text-[6.5px]">
                Sounds great — sending calendar invite!
              </div>
            </div>
            <div className="h-5 rounded-full bg-slate-100 dark:bg-slate-800 px-2 flex items-center text-[6.5px] text-slate-400">
              E2EE message...
            </div>
          </div>
        );

      case 'call-e2ee':
        return (
          <div className="p-3 flex flex-col items-center justify-between h-full bg-slate-950 text-white">
            <div className="flex items-center gap-1 text-[7px] text-emerald-400 font-semibold">
              <Lock className="w-2.5 h-2.5" /> End-to-End Encrypted
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-11 h-11 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-xs font-bold">
                AS
              </div>
              <div className="text-[8.5px] font-bold">Anna San</div>
              <div className="text-[6.5px] font-mono text-slate-400">02:14 · Verified</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[7px]">Mic</span>
              <span className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-[7px]">End</span>
              <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[7px]">QR</span>
            </div>
          </div>
        );

      case 'feed-stream':
        return (
          <div className="p-2 flex flex-col gap-1.5 h-full bg-[#F7F9FC] dark:bg-slate-950">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-extrabold text-slate-900 dark:text-white">Feed</span>
              <div className="flex items-center gap-1">
                <span className="text-[6.5px] font-semibold px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-0.5">
                  <Calendar className="w-2 h-2" /> Events
                </span>
                <span className="w-4 h-4 rounded-full bg-[#6C3BF5] text-white flex items-center justify-center">
                  <Plus className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 space-y-1.5 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-[6.5px] font-bold flex items-center justify-center">E</span>
                <div>
                  <div className="text-[7.5px] font-bold text-slate-900 dark:text-white">Elena Rostova</div>
                  <div className="text-[6px] text-slate-400">2h · AI Systems</div>
                </div>
              </div>
              <div className="text-[6.5px] text-slate-600 dark:text-slate-300 leading-snug">
                New open-weights release with <span className="text-[#6C3BF5] font-semibold">#a16z</span> and{' '}
                <span className="text-[#6C3BF5] font-semibold">#VentureCapital</span>
              </div>
              <div className="h-14 rounded-lg bg-gradient-to-br from-slate-800 to-indigo-900 flex items-center justify-center text-[6.5px] text-indigo-200 font-medium">
                Distinct Media Preview
              </div>
              <div className="flex items-center justify-between pt-0.5 text-[6.5px] text-slate-500">
                <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5 text-rose-500" /> 142</span>
                <span className="flex items-center gap-0.5"><MessageCircle className="w-2.5 h-2.5 text-indigo-500" /> 28</span>
                <span>Repost</span>
              </div>
            </div>
          </div>
        );

      case 'create-post':
        return (
          <div className="p-2.5 flex flex-col gap-2 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-slate-900 dark:text-white">Create Post</span>
              <span className="text-[6.5px] font-bold px-2 py-0.5 rounded-full bg-[#6C3BF5] text-white">Publish</span>
            </div>
            <div className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 text-[7px] text-slate-500">
              Share research updates, attach video or image, tag <span className="text-[#6C3BF5]">#YCombinator</span>...
            </div>
            <div className="flex items-center justify-between text-[6.5px] text-slate-500">
              <span>+ Image / Video</span>
              <span># Topic Tag</span>
            </div>
          </div>
        );

      case 'post-comments':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1">
              <span className="text-[8px] font-bold text-slate-900 dark:text-white">Comments (28)</span>
              <span className="text-[6.5px] font-mono text-sky-600 dark:text-sky-400">z-[70]</span>
            </div>
            {[
              { name: 'Liam Chen', text: 'Great latency breakdown!', emoji: '👏 1' },
              { name: 'Sofia Patel', text: 'Tested on M4 Max — super fast.', emoji: '🔥 1' },
            ].map((c) => (
              <div key={c.name} className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="text-[7px] font-bold text-slate-900 dark:text-white">{c.name}</div>
                <div className="text-[6.5px] text-slate-600 dark:text-slate-300">{c.text}</div>
                <span className="inline-block mt-1 text-[6px] px-1.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  {c.emoji}
                </span>
              </div>
            ))}
            <div className="mt-auto h-5 rounded-full bg-slate-100 dark:bg-slate-800 px-2 flex items-center text-[6.5px] text-slate-400">
              Add a comment...
            </div>
          </div>
        );

      case 'hashtag-brand':
        return (
          <div className="p-2.5 flex flex-col gap-2 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <ArrowLeft className="w-3 h-3 text-slate-600 dark:text-slate-300" />
              <span className="text-[6.5px] font-mono text-slate-400">z-[60]</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#0F1117] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                a16z
              </div>
              <div className="min-w-0">
                <div className="text-[8.5px] font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1">
                  Andreessen Horowitz
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C3BF5] inline-block shrink-0" />
                </div>
                <div className="text-[6px] text-slate-500">Venture Capital · Menlo Park</div>
              </div>
            </div>
            <div className="text-[6.5px] text-slate-500">142,800 followers · 48 updates</div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="h-5 rounded-full bg-[#6C3BF5] text-white text-[7px] font-bold flex items-center justify-center">
                + Follow
              </div>
              <div className="h-5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-[7px] font-semibold flex items-center justify-center">
                Start a post
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-1.5 text-[6.5px] text-slate-500">
              Top / Recent Brand Feed...
            </div>
          </div>
        );

      case 'hashtag-broad':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1 text-[8px] font-extrabold text-slate-900 dark:text-white">
              <Hash className="w-2.5 h-2.5 text-[#6C3BF5]" /> VentureCapital
            </div>
            <div className="text-[6.5px] font-bold uppercase text-slate-400">Relevant Pages</div>
            <div className="grid grid-cols-2 gap-1">
              <div className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-[#0F1117] text-white text-[5.5px] font-bold flex items-center justify-center">a16z</span>
                <span className="text-[6.5px] font-bold text-slate-800 dark:text-slate-100 truncate">a16z</span>
              </div>
              <div className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-[#F26522] text-white text-[6px] font-bold flex items-center justify-center">Y</span>
                <span className="text-[6.5px] font-bold text-slate-800 dark:text-slate-100 truncate">YC</span>
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-1.5 text-[6.5px] text-slate-500">
              Filtered #VentureCapital posts
            </div>
          </div>
        );

      case 'events-list':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-bold text-slate-900 dark:text-white">Community Events</span>
              <Calendar className="w-3 h-3 text-[#6C3BF5]" />
            </div>
            {['AI Systems Summit · Live', 'SF Robotics Demo Night', 'ZK Founder Roundtable'].map((ev) => (
              <div key={ev} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[7px] font-semibold text-slate-800 dark:text-slate-100 truncate">{ev}</span>
                <span className="text-[6px] font-bold text-[#6C3BF5]">RSVP</span>
              </div>
            ))}
          </div>
        );

      case 'profile-own':
        return (
          <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            <div className="px-2 py-1 flex items-center justify-between text-[6.5px]">
              <ArrowLeft className="w-2.5 h-2.5 text-slate-600" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Profile</span>
              <span className="text-slate-400">···</span>
            </div>
            <div className="mx-2 h-11 rounded-t-xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900" />
            <div className="px-2.5 -mt-4 flex items-end justify-between">
              <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-indigo-700">
                JV
              </div>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[6px] font-semibold px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">Edit</span>
                <span className="text-[6px] font-semibold px-1 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">QR</span>
              </div>
            </div>
            <div className="px-2.5 mt-1 space-y-1">
              <div className="text-[8.5px] font-extrabold text-slate-900 dark:text-white">Jennies Vance</div>
              <div className="text-[6px] font-semibold text-[#6C3BF5]">Head of AI Product & Systems</div>
              <div className="flex items-center gap-1 text-[5.5px] text-slate-500 whitespace-nowrap overflow-hidden">
                <Briefcase className="w-2 h-2 shrink-0" />
                <span>Cronium Infrastructure Core</span>
                <span>•</span>
                <GraduationCap className="w-2 h-2 shrink-0" />
                <span>Stanford AI Lab Alum</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-center">
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-800">
                  <div className="text-[7px] font-bold text-[#6C3BF5]">1</div>
                  <div className="text-[5px] text-slate-400">COMMUNITIES</div>
                </div>
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-800">
                  <div className="text-[7px] font-bold text-emerald-600">1,480</div>
                  <div className="text-[5px] text-slate-400">CONNECTIONS</div>
                </div>
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-800">
                  <div className="text-[7px] font-bold text-amber-500">5</div>
                  <div className="text-[5px] text-slate-400">ACHIEVEMENTS</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'profile-edit':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold text-slate-900 dark:text-white">Edit Profile & Links</span>
              <span className="text-[6.5px] font-bold text-[#6C3BF5]">Save</span>
            </div>
            {['Display Name', 'Headline & Bio', 'LinkedIn & GitHub', 'Key Achievements'].map((f) => (
              <div key={f} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[6.5px] text-slate-600 dark:text-slate-300">
                {f}
              </div>
            ))}
          </div>
        );

      case 'profile-network':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="text-[8px] font-bold text-slate-900 dark:text-white">Network Directory</div>
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[6.5px] font-semibold text-center">
              <span className="py-0.5 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Connections</span>
              <span className="py-0.5 text-slate-500">Communities</span>
            </div>
            {['Anna San · Cerebras', 'Devon Park · Figure', 'Elena Rostova · AI Lab'].map((p) => (
              <div key={p} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[6.5px]">
                <span className="text-slate-800 dark:text-slate-100 truncate">{p}</span>
                <span className="text-[#6C3BF5] font-semibold">Chat</span>
              </div>
            ))}
          </div>
        );

      case 'profile-member':
        return (
          <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            {/* 2/3-height cover banner with back-only arrow (no top-right X) */}
            <div className="mx-2 mt-1.5 h-8 rounded-xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 relative p-1.5 flex items-start justify-between">
              <span className="w-4 h-4 rounded-full bg-black/40 text-white flex items-center justify-center">
                <ArrowLeft className="w-2.5 h-2.5" />
              </span>
            </div>
            <div className="px-2.5 -mt-3.5 flex items-end justify-between">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[7.5px] font-bold text-emerald-800">
                AS
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[6px] font-semibold px-1.5 py-0.5 rounded-full border border-indigo-200 text-indigo-600">Follow</span>
                <span className="text-[6px] font-semibold px-1.5 py-0.5 rounded-full bg-[#6C3BF5] text-white">Message</span>
              </div>
            </div>
            <div className="px-2.5 mt-1 space-y-1">
              <div className="text-[8.5px] font-extrabold text-slate-900 dark:text-white">Anna San</div>
              <div className="text-[6px] font-semibold text-[#6C3BF5]">Lead Architect @ Cerebras</div>
              <div className="text-[5.5px] text-slate-500">Cerebras Systems Core • MIT CSAIL Alum</div>
              <div className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 mt-1 text-[6px] text-slate-500">
                Identity & Credentials · Verified
              </div>
              <div className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[6px] text-slate-500">
                Key Achievements · Top 0.5%
              </div>
            </div>
          </div>
        );

      case 'profile-settings':
        return (
          <div className="p-2.5 flex flex-col gap-1.5 h-full bg-white dark:bg-slate-900">
            <div className="text-[8px] font-bold text-slate-900 dark:text-white">Security & Sync</div>
            {['Face ID / Biometric Lock', 'Cross-Device E2EE Sync', 'Notification Sounds', 'Dark / Light Theme'].map((s) => (
              <div key={s} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[6.5px]">
                <span className="text-slate-700 dark:text-slate-200">{s}</span>
                <span className="w-5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-950 select-none overflow-hidden">
      {/* Mini iPhone 15 Status Bar */}
      <div className="h-5 px-3 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-950/95">
        <span className="text-[7px] font-bold font-mono tabular-nums text-slate-800 dark:text-slate-200">9:41</span>
        <span className="w-11 h-2.5 rounded-full bg-slate-900 dark:bg-black" />
        <div className="flex items-center gap-0.5">
          <span className="w-2.5 h-1.5 rounded-xs border border-slate-700 dark:border-slate-300" />
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 min-h-0 overflow-hidden">{renderBody()}</div>

      {/* Mini Bottom Tab Bar on Primary Tabs */}
      {showMiniNav && (
        <div className="h-7 px-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-around shrink-0 text-[6px] font-semibold">
          {(['home', 'servers', 'feed', 'profile'] as const).map((tab) => {
            const active = screen.targetTab === tab;
            return (
              <span
                key={tab}
                className={
                  active
                    ? 'text-[#6C3BF5] font-bold capitalize'
                    : 'text-slate-400 dark:text-slate-500 capitalize'
                }
              >
                {tab === 'servers' ? 'Servers' : tab}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const PrototypeFlowBoard: React.FC<PrototypeFlowBoardProps> = ({ onOpenLiveScreen }) => {
  const [selectedScreenId, setSelectedScreenId] = useState<string>(PROTOTYPE_SCREENS[0].id);
  const [activeFlowFilter, setActiveFlowFilter] = useState<PrototypeFlowGroup | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showEdges, setShowEdges] = useState<boolean>(true);
  const [inspectorTab, setInspectorTab] = useState<'inspect' | 'tokens'>('inspect');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  // Canvas viewport pan & zoom
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(0.62);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 28, y: 18 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  // Feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const screenMap = useMemo(
    () => new Map<string, PrototypeScreenNode>(PROTOTYPE_SCREENS.map((s) => [s.id, s])),
    []
  );

  const selectedScreen = useMemo(
    () => screenMap.get(selectedScreenId) || PROTOTYPE_SCREENS[0],
    [screenMap, selectedScreenId]
  );

  const filteredScreens = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PROTOTYPE_SCREENS.filter((screen) => {
      if (activeFlowFilter !== 'all' && screen.flow !== activeFlowFilter) return false;
      if (!q) return true;
      return (
        screen.title.toLowerCase().includes(q) ||
        screen.code.toLowerCase().includes(q) ||
        screen.componentName.toLowerCase().includes(q) ||
        screen.summary.toLowerCase().includes(q)
      );
    });
  }, [activeFlowFilter, searchQuery]);

  const filteredIds = useMemo(() => new Set(filteredScreens.map((s) => s.id)), [filteredScreens]);

  const outgoingEdges = useMemo(
    () => PROTOTYPE_EDGES.filter((e) => e.from === selectedScreen.id),
    [selectedScreen.id]
  );

  const incomingEdges = useMemo(
    () => PROTOTYPE_EDGES.filter((e) => e.to === selectedScreen.id),
    [selectedScreen.id]
  );

  const triggerCopied = (key: string) => {
    setCopiedId(key);
    window.setTimeout(() => {
      setCopiedId((prev) => (prev === key ? null : prev));
    }, 1800);
  };

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      triggerCopied(key);
    } catch {
      // Fallback copy
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      triggerCopied(key);
    }
  };

  const handleFitCanvas = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const padding = 40;
    const fitScale = Math.min(
      (rect.width - padding) / CANVAS_WIDTH,
      (rect.height - padding) / CANVAS_HEIGHT,
      0.95
    );
    const clamped = Math.max(0.28, Number(fitScale.toFixed(2)));
    const offsetX = Math.max(20, (rect.width - CANVAS_WIDTH * clamped) / 2);
    const offsetY = Math.max(16, (rect.height - CANVAS_HEIGHT * clamped) / 2);
    setZoom(clamped);
    setPan({ x: offsetX, y: offsetY });
  }, []);

  const focusScreenOnCanvas = useCallback(
    (screen: PrototypeScreenNode) => {
      setSelectedScreenId(screen.id);
      setMobileNavOpen(false);
      const el = viewportRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const targetZoom = Math.max(zoom, 0.72);
      const cx = screen.x + CARD_WIDTH / 2;
      const cy = screen.y + CARD_HEIGHT / 2;
      setZoom(targetZoom);
      setPan({
        x: rect.width / 2 - cx * targetZoom,
        y: rect.height / 2 - cy * targetZoom,
      });
    },
    [zoom]
  );

  // Initial comfortable view showing Lane 01 + Lane 02 cleanly on mount
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 900) {
      handleFitCanvas();
    }
  }, [handleFitCanvas]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only pan when dragging canvas background (not buttons/cards)
    if ((e.target as HTMLElement).closest('[data-artboard-card="true"]')) return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if capture already released
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setZoom((z) => Math.min(1.45, Math.max(0.28, Number((z + delta).toFixed(2)))));
    } else {
      // Natural trackpad panning
      setPan((p) => ({
        x: p.x - e.deltaX * 0.85,
        y: p.y - e.deltaY * 0.85,
      }));
    }
  };

  const handleDownloadTokensJson = () => {
    const link = document.createElement('a');
    link.href = '/design-tokens.json';
    link.download = 'cronium-design-tokens.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerCopied('tokens-download');
  };

  const handleExportFlowSvg = () => {
    const svgContent = buildExportableFlowSvg();
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cronium-prototype-flow.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerCopied('svg-export');
  };

  const handleCopyHandoffLink = () => {
    const publicOrigin = window.location.origin.replace('://ais-dev-', '://ais-pre-');
    const url = `${publicOrigin}${window.location.pathname}?view=prototype-flow`;
    copyText(url, 'handoff-link');
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Sidebar Header */}
      <div className="px-3.5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#6C3BF5]" />
          <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
            Flow Navigator
          </span>
        </div>
        <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
          {filteredScreens.length}/{PROTOTYPE_SCREENS.length}
        </span>
      </div>

      {/* Search & Flow Filter */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search screens or TSX..."
            className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#6C3BF5]"
          />
        </div>
        <div className="grid grid-cols-5 gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'home', label: '01' },
              { id: 'servers', label: '02' },
              { id: 'feed', label: '03' },
              { id: 'profile', label: '04' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFlowFilter(tab.id)}
              className={`py-1 rounded-md transition-colors tabular-nums ${
                activeFlowFilter === tab.id
                  ? 'bg-white dark:bg-slate-900 text-[#6C3BF5] dark:text-indigo-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Screen List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3 min-h-0">
        {FLOW_LANES.map((lane) => {
          const laneScreens = filteredScreens.filter((s) => s.flow === lane.id);
          if (laneScreens.length === 0) return null;
          return (
            <div key={lane.id}>
              <div className="px-2 py-1 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-tight truncate">
                  {lane.index}. {lane.title}
                </span>
              </div>
              <div className="space-y-0.5 mt-0.5">
                {laneScreens.map((screen) => {
                  const isSelected = screen.id === selectedScreen.id;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => focusScreenOnCanvas(screen)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-start gap-2 ${
                        isSelected
                          ? 'bg-indigo-50/90 dark:bg-indigo-950/60 text-slate-900 dark:text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <span
                        className={`text-[11px] font-mono font-bold tabular-nums shrink-0 mt-0.5 ${
                          isSelected
                            ? 'text-[#6C3BF5] dark:text-indigo-400'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {screen.code}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate">{screen.title}</div>
                        <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {KIND_LABEL[screen.kind]} · {screen.zIndex}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden bg-slate-50 dark:bg-slate-950 relative">
      {/* Desktop Left Flow Navigator */}
      <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col min-h-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile/Tablet Drawer Navigator */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full border-r border-slate-200 dark:border-slate-800 flex flex-col z-10">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close navigator"
            >
              <X className="w-4 h-4" />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Center Prototype Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
        {/* Compact Canvas Toolbar */}
        <div className="h-11 px-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Open screen navigator"
            >
              <PanelLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <GitBranch className="w-3.5 h-3.5 text-[#6C3BF5]" />
              <span className="font-bold text-slate-900 dark:text-white">All-Screen Prototype</span>
              <span className="hidden xl:inline text-slate-400">·</span>
              <span className="hidden xl:inline text-[11px] font-mono tabular-nums text-slate-500">
                22 frames · 23 flows · 432×804
              </span>
            </div>
            <button
              onClick={() => setShowEdges((v) => !v)}
              className={`ml-1 px-2 py-1 rounded-md text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                showEdges
                  ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="Toggle prototype flow connectors"
            >
              {showEdges ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>Noodles</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setZoom((z) => Math.max(0.28, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="px-2 py-1 rounded-md text-[11px] font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 min-w-[46px]"
              title="Reset zoom to 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(1.45, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFitCanvas}
              className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
              title="Fit all 22 screens in view"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Fit All</span>
            </button>
          </div>

          {/* Handoff Export Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyHandoffLink}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              title="Copy direct dev handoff URL (?view=prototype-flow)"
            >
              {copiedId === 'handoff-link' ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3 text-slate-500" />
              )}
              <span className="hidden md:inline">
                {copiedId === 'handoff-link' ? 'Link Copied' : 'Share Link'}
              </span>
            </button>

            <button
              onClick={handleExportFlowSvg}
              className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              title="Download Figma-importable vector flow SVG"
            >
              {copiedId === 'svg-export' ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Download className="w-3 h-3 text-slate-500" />
              )}
              <span className="hidden md:inline">Flow SVG</span>
            </button>

            <button
              onClick={handleDownloadTokensJson}
              className="px-2.5 py-1 rounded-md bg-[#6C3BF5] hover:bg-[#5B2DE0] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
              title="Download W3C / Figma Variables design-tokens.json"
            >
              {copiedId === 'tokens-download' ? (
                <Check className="w-3 h-3" />
              ) : (
                <FileCode2 className="w-3 h-3" />
              )}
              <span>Tokens JSON</span>
            </button>
          </div>
        </div>

        {/* Interactive Infinite-Style Dot-Grid Canvas */}
        <div
          ref={viewportRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={(e) => {
            if (!(e.target as HTMLElement).closest('[data-artboard-card="true"]')) {
              handleFitCanvas();
            }
          }}
          className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing bg-slate-50 dark:bg-slate-950 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] touch-none"
        >
          {/* Transformed Artboard World */}
          <div
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
            className="relative will-change-transform"
          >
            {/* 4 Swimlane Headers */}
            {FLOW_LANES.map((lane) => {
              const laneDimmed = activeFlowFilter !== 'all' && activeFlowFilter !== lane.id;
              return (
                <div
                  key={lane.id}
                  style={{ left: 56, top: lane.yStart, width: CANVAS_WIDTH - 112 }}
                  className={`absolute pointer-events-none transition-opacity ${
                    laneDimmed ? 'opacity-25' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-baseline gap-2.5">
                    <span
                      className="text-sm font-mono font-bold tabular-nums"
                      style={{ color: lane.accentHex }}
                    >
                      {lane.index}.
                    </span>
                    <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {lane.title}
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {lane.subtitle}
                    </span>
                  </div>
                  <div className="mt-2 border-b border-dashed border-slate-300/80 dark:border-slate-800" />
                </div>
              );
            })}

            {/* SVG Prototype Noodles & Trigger Labels */}
            {showEdges && (
              <svg
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="absolute inset-0 pointer-events-none overflow-visible"
              >
                <defs>
                  <marker
                    id="proto-arrow-active"
                    viewBox="0 0 10 10"
                    refX="8.5"
                    refY="5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#6C3BF5" />
                  </marker>
                  <marker
                    id="proto-arrow-muted"
                    viewBox="0 0 10 10"
                    refX="8.5"
                    refY="5"
                    markerWidth="5.5"
                    markerHeight="5.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#94A3B8" />
                  </marker>
                </defs>

                {PROTOTYPE_EDGES.map((edge, idx) => {
                  const from = screenMap.get(edge.from);
                  const to = screenMap.get(edge.to);
                  if (!from || !to) return null;

                  const isConnected =
                    edge.from === selectedScreen.id || edge.to === selectedScreen.id;
                  const bothVisible = filteredIds.has(from.id) && filteredIds.has(to.id);
                  if (!bothVisible && !isConnected) return null;

                  const { path, labelX, labelY } = getEdgePath(from, to, idx);

                  return (
                    <g key={edge.id}>
                      <path
                        d={path}
                        fill="none"
                        stroke={isConnected ? '#6C3BF5' : '#94A3B8'}
                        strokeOpacity={isConnected ? 0.95 : 0.4}
                        strokeWidth={isConnected ? 2.2 : 1.35}
                        markerEnd={
                          isConnected ? 'url(#proto-arrow-active)' : 'url(#proto-arrow-muted)'
                        }
                      />
                      {isConnected && (
                        <g transform={`translate(${labelX}, ${labelY})`}>
                          <rect
                            x={-66}
                            y={-10}
                            width={132}
                            height={20}
                            rx={6}
                            className="fill-white dark:fill-slate-900 stroke-[#6C3BF5]"
                            strokeWidth={1}
                          />
                          <text
                            x={0}
                            y={3.5}
                            textAnchor="middle"
                            className="fill-slate-900 dark:fill-white text-[9.5px] font-semibold"
                          >
                            {edge.trigger}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* 22 Artboard Screen Cards */}
            {PROTOTYPE_SCREENS.map((screen) => {
              const isSelected = screen.id === selectedScreen.id;
              const isMatch = filteredIds.has(screen.id);
              const isConnectedNeighbor =
                outgoingEdges.some((e) => e.to === screen.id) ||
                incomingEdges.some((e) => e.from === screen.id);
              const lane = FLOW_LANES.find((l) => l.id === screen.flow);

              return (
                <div
                  key={screen.id}
                  data-artboard-card="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedScreenId(screen.id);
                  }}
                  style={{
                    left: screen.x,
                    top: screen.y,
                    width: CARD_WIDTH,
                  }}
                  className={`absolute group cursor-pointer transition-opacity ${
                    isMatch || isSelected ? 'opacity-100' : 'opacity-25'
                  }`}
                >
                  {/* Figma-Style Artboard Title Bar Above Frame */}
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="text-[11px] font-mono font-bold tabular-nums shrink-0"
                        style={{ color: isSelected ? '#6C3BF5' : lane?.accentHex }}
                      >
                        {screen.code}
                      </span>
                      <span
                        className={`text-[11.5px] font-bold truncate ${
                          isSelected
                            ? 'text-[#6C3BF5] dark:text-indigo-400'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {screen.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-slate-500 shrink-0 ml-1">
                      {screen.zIndex}
                    </span>
                  </div>

                  {/* Miniature iPhone 15 Screen Artboard */}
                  <div
                    style={{ height: CARD_HEIGHT }}
                    className={`w-full rounded-[24px] overflow-hidden border transition-all bg-white dark:bg-slate-900 ${
                      isSelected
                        ? 'border-[#6C3BF5] ring-2 ring-[#6C3BF5] ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950 shadow-lg'
                        : isConnectedNeighbor
                          ? 'border-indigo-300 dark:border-indigo-700 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 group-hover:border-slate-400 dark:group-hover:border-slate-600 shadow-xs'
                    }`}
                  >
                    <MiniScreenPreview screen={screen} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtle Bottom-Left Canvas Hint */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 pointer-events-none hidden sm:block">
            Drag to pan · Pinch / Ctrl+Scroll to zoom · Double-click background to fit
          </div>
        </div>
      </div>

      {/* Right Dev Mode Inspector & Tokens Sidebar */}
      <aside className="w-80 xl:w-[344px] shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hidden md:flex flex-col min-h-0">
        {/* Inspector Mode Tabs */}
        <div className="px-3.5 pt-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setInspectorTab('inspect')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              inspectorTab === 'inspect'
                ? 'border-[#6C3BF5] text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Dev Inspect
          </button>
          <button
            onClick={() => setInspectorTab('tokens')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              inspectorTab === 'tokens'
                ? 'border-[#6C3BF5] text-slate-900 dark:text-white'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Design Tokens
          </button>
        </div>

        {/* Inspector Body */}
        {inspectorTab === 'inspect' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0">
            {/* Screen Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold tabular-nums text-[#6C3BF5] dark:text-indigo-400">
                  {selectedScreen.code} · {KIND_LABEL[selectedScreen.kind]}
                </span>
                <button
                  onClick={() =>
                    copyText(selectedScreen.componentName, `comp-${selectedScreen.id}`)
                  }
                  className="text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                  title="Copy component filename"
                >
                  {copiedId === `comp-${selectedScreen.id}` ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span className="truncate max-w-[140px]">{selectedScreen.componentName}</span>
                </button>
              </div>
              <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                {selectedScreen.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedScreen.summary}
              </p>

              <button
                onClick={() => onOpenLiveScreen(selectedScreen.targetTab)}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-[#6C3BF5] hover:bg-[#5B2DE0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Live Screen ({selectedScreen.targetTab})
              </button>
            </div>

            {/* Frame & Layout Spec Table */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Layout Specification
              </div>
              <div className="grid grid-cols-2 border border-slate-200 dark:border-slate-800 rounded-lg divide-x divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                <div className="p-2.5">
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400">Frame Size</div>
                  <div className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {selectedScreen.dimensions}
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400">Corner Radius</div>
                  <div className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {selectedScreen.cornerRadius}
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400">Z-Index Layer</div>
                  <div className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white mt-0.5">
                    {selectedScreen.zIndex}
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-[10.5px] text-slate-500 dark:text-slate-400">Target Tab</div>
                  <div className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5 capitalize">
                    {selectedScreen.targetTab}
                  </div>
                </div>
              </div>
            </div>

            {/* Prototype Transitions (Outgoing & Incoming) */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Prototype Transitions ({outgoingEdges.length + incomingEdges.length})
              </div>

              {outgoingEdges.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Outgoing
                  </div>
                  {outgoingEdges.map((edge: PrototypeEdge) => {
                    const target = screenMap.get(edge.to);
                    if (!target) return null;
                    return (
                      <button
                        key={edge.id}
                        onClick={() => focusScreenOnCanvas(target)}
                        className="w-full text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-[#6C3BF5] dark:hover:border-indigo-500 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {edge.trigger}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#6C3BF5] shrink-0" />
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-between gap-1">
                          <span className="truncate">
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                              {target.code}
                            </span>{' '}
                            {target.title}
                          </span>
                        </div>
                        <div className="text-[10.5px] font-mono text-slate-400 mt-1">
                          {edge.transition}
                        </div>
                        {edge.condition && (
                          <div className="text-[10.5px] text-indigo-600 dark:text-indigo-400 mt-1">
                            {edge.condition}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {incomingEdges.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Incoming
                  </div>
                  {incomingEdges.map((edge: PrototypeEdge) => {
                    const source = screenMap.get(edge.from);
                    if (!source) return null;
                    return (
                      <button
                        key={edge.id}
                        onClick={() => focusScreenOnCanvas(source)}
                        className="w-full text-left p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-colors flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] text-slate-700 dark:text-slate-200 font-semibold truncate">
                            <span className="font-mono font-bold text-slate-500">{source.code}</span>{' '}
                            {source.title}
                          </div>
                          <div className="text-[10.5px] text-slate-500 truncate">{edge.trigger}</div>
                        </div>
                        <ArrowLeft className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Interaction Notes */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Engineering Notes
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedScreen.interactionNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#6C3BF5] font-mono text-[11px] mt-0.5">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* QA Acceptance Criteria */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Acceptance Criteria
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {selectedScreen.acceptanceCriteria.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* Design Tokens Inspector Tab */
          <div className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0">
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Cronium Design Tokens (W3C / Figma Variables)
              </div>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Import <span className="font-mono text-slate-700 dark:text-slate-200">design-tokens.json</span> directly into Figma Variables or Tokens Studio, or share with frontend engineers.
              </p>
              <button
                onClick={handleDownloadTokensJson}
                className="w-full py-2 px-3 rounded-lg bg-[#6C3BF5] hover:bg-[#5B2DE0] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download design-tokens.json
              </button>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Color Palette
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
                {DESIGN_TOKENS_PREVIEW.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => copyText(c.hex, `hex-${c.name}`)}
                    className="w-full px-2.5 py-2 flex items-center justify-between gap-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-5 h-5 rounded-md border border-slate-200 dark:border-slate-700 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="min-w-0">
                        <div className="text-[11.5px] font-mono font-semibold text-slate-900 dark:text-white truncate">
                          {c.name}
                        </div>
                        <div className="text-[10.5px] text-slate-500 truncate">{c.usage}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-500 shrink-0">
                      {copiedId === `hex-${c.name}` ? 'Copied' : c.hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Scale */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Typography · Plus Jakarta Sans
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px]">
                {DESIGN_TOKENS_PREVIEW.typography.map((t) => (
                  <div key={t.token} className="px-2.5 py-2 flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
                      {t.token}
                    </span>
                    <span className="font-mono tabular-nums text-slate-500">
                      {t.size} / {t.weight} · {t.tracking}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radii & Z-Index */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Radii
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {DESIGN_TOKENS_PREVIEW.radii.map((r) => (
                    <div key={r.token} className="px-2 py-1.5 flex items-center justify-between">
                      <span className="font-mono text-slate-600 dark:text-slate-300 truncate">
                        {r.token}
                      </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Z-Index
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {DESIGN_TOKENS_PREVIEW.zIndex.map((z) => (
                    <div key={z.token} className="px-2 py-1.5 flex items-center justify-between gap-1">
                      <span className="font-mono text-slate-600 dark:text-slate-300 truncate">
                        {z.token}
                      </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                        {z.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
