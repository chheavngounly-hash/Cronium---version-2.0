import React, { useState, useMemo } from 'react';
import { Sun, X, Check, Copy, Share } from 'lucide-react';
import { UserPlan } from '../types';
import { getProfileBadgeStyle } from '../utils/profileBadge';
import { notificationService } from '../services/notifications';

interface ProfileQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  username: string;
  avatar: string;
  title?: string;
  status?: 'online' | 'away' | 'offline';
  meshKey: string;
  isCurrentUser?: boolean;
  userPlan?: UserPlan;
}

const QR_SIZE = 21;

function isFinderZone(r: number, c: number): boolean {
  const topLeft = r <= 7 && c <= 7;
  const topRight = r <= 7 && c >= QR_SIZE - 8;
  const bottomLeft = r >= QR_SIZE - 8 && c <= 7;
  const centerLogo = r >= 8 && r <= 12 && c >= 8 && c <= 12;
  return topLeft || topRight || bottomLeft || centerLogo;
}

function generateQrCells(seed: string): Array<{ r: number; c: number }> {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const cells: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      if (isFinderZone(r, c)) continue;
      // Timing patterns along row 6 and col 6 for authentic QR geometry
      if (r === 6 || c === 6) {
        if ((r + c) % 2 === 0) cells.push({ r, c });
        continue;
      }
      h = Math.imul(h ^ (r * 31 + c * 17 + 7), 1664525) + 1013904223;
      if (((h >>> 16) & 100) < 54) {
        cells.push({ r, c });
      }
    }
  }
  return cells;
}

function deriveHandshakeKey(meshKey: string): string {
  const hexChars = meshKey.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  const base = (hexChars || '7F9B48C2E390812F').padEnd(16, 'A');
  const reversed = base.split('').reverse().join('');
  return `0x${reversed.slice(0, 4)} · ${reversed.slice(4, 8)} · ${reversed.slice(8, 12)} · ${reversed.slice(12, 16)}`;
}

export const ProfileQrModal: React.FC<ProfileQrModalProps> = ({
  isOpen,
  onClose,
  name,
  username,
  avatar,
  title,
  status = 'online',
  meshKey,
  isCurrentUser = false,
  userPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'connect' | 'handshake'>('connect');
  const [maxBrightness, setMaxBrightness] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState<'inline' | 'button' | 'share' | null>(null);

  const normalizedHandle = username.startsWith('@') ? username : `@${username}`;
  const handshakeKey = useMemo(() => deriveHandshakeKey(meshKey), [meshKey]);
  const displayedKey = activeTab === 'connect' ? meshKey : handshakeKey;

  const qrCells = useMemo(
    () => generateQrCells(`${name}::${displayedKey}::${activeTab}`),
    [name, displayedKey, activeTab]
  );

  if (!isOpen) return null;

  const badgeStyle = getProfileBadgeStyle(name, { isCurrentUser, userPlan });
  const statusDotClass =
    status === 'online' ? 'bg-[#10B981]' : status === 'away' ? 'bg-amber-500' : 'bg-slate-400';

  const shortTitle = title
    ? title.split('•')[0].split('&')[0].trim()
    : 'Verified Member';

  const handleCopyValue = (value: string, target: 'inline' | 'button' | 'share') => {
    try {
      navigator.clipboard?.writeText(value);
      notificationService.playSentChime();
    } catch {
      // ignore clipboard errors
    }
    setCopiedTarget(target);
    setTimeout(() => setCopiedTarget(null), 2000);
  };

  const handleSharePass = () => {
    const cleanHandle = normalizedHandle.replace(/^@/, '');
    const shareUrl = `https://cronium.network/pass/@${cleanHandle}?key=${displayedKey.replace(/\s*·\s*/g, '')}`;
    handleCopyValue(shareUrl, 'share');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} Public Mesh QR Pass`}
      className={`fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150 transition-colors ${
        maxBrightness ? 'bg-slate-950/80 backdrop-blur-sm' : 'bg-slate-950/55 backdrop-blur-[2px]'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className={`w-full max-w-[400px] rounded-t-[32px] sm:rounded-[32px] px-5 pt-2.5 pb-6 relative transition-all text-center ${
          maxBrightness
            ? 'bg-white text-slate-950 border border-white shadow-[0_0_55px_rgba(255,255,255,0.45)]'
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle */}
        <div
          className={`w-10 h-1 rounded-full mx-auto mb-3 ${
            maxBrightness ? 'bg-slate-200' : 'bg-slate-200 dark:bg-slate-700'
          }`}
        />

        {/* Top Bar: Max Brightness Pill + Circular Close Button */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMaxBrightness((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[12px] font-medium transition-all cursor-pointer active:scale-95 ${
              maxBrightness
                ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-2xs'
                : 'bg-[#F8FAFC] dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-pressed={maxBrightness}
          >
            <Sun className={`w-3.5 h-3.5 ${maxBrightness ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>Max Brightness</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
              maxBrightness
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                : 'bg-[#F3F5F8] dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            aria-label="Close QR card"
          >
            <X className="w-4 h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Centered Profile Identity */}
        <div className="mt-1 flex flex-col items-center">
          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className={`w-[72px] h-[72px] rounded-full object-cover object-top shadow-md bg-slate-100 ${
                maxBrightness
                  ? 'ring-[3px] ring-white'
                  : 'ring-[3px] ring-white dark:ring-slate-900'
              }`}
            />
            <span
              className={`absolute bottom-0 right-0 w-[18px] h-[18px] ${statusDotClass} rounded-full border-[3px] ${
                maxBrightness ? 'border-white' : 'border-white dark:border-slate-900'
              }`}
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 max-w-full px-2">
            <h3
              className={`text-[20px] font-bold tracking-[-0.02em] leading-tight truncate ${
                maxBrightness ? 'text-slate-950' : 'text-slate-950 dark:text-white'
              }`}
            >
              {name}
            </h3>
            <span
              title={badgeStyle.title}
              className={`w-[19px] h-[19px] rounded-full inline-flex items-center justify-center shrink-0 text-white ${badgeStyle.bgClass}`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          </div>

          <p
            className={`mt-1 text-[12.5px] font-normal truncate max-w-[300px] ${
              maxBrightness ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {normalizedHandle} · {shortTitle}
          </p>
        </div>

        {/* Main Framed QR Pass Container */}
        <div
          className={`mt-4 p-4 rounded-[26px] border ${
            maxBrightness
              ? 'bg-[#FAFBFD] border-slate-200/80'
              : 'bg-[#FAFBFD] dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
          }`}
        >
          {/* Segmented Tab Switcher */}
          <div
            className={`grid grid-cols-2 p-1 rounded-full ${
              maxBrightness ? 'bg-[#EEF1F6]' : 'bg-[#EEF1F6] dark:bg-slate-800/90'
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveTab('connect')}
              className={`py-2 px-3 rounded-full text-[12.5px] transition-all cursor-pointer ${
                activeTab === 'connect'
                  ? maxBrightness
                    ? 'bg-white text-slate-950 font-semibold shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold shadow-2xs'
                  : maxBrightness
                  ? 'text-slate-500 font-medium hover:text-slate-700'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Connect &amp; Verify
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('handshake')}
              className={`py-2 px-3 rounded-full text-[12.5px] transition-all cursor-pointer ${
                activeTab === 'handshake'
                  ? maxBrightness
                    ? 'bg-white text-slate-950 font-semibold shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold shadow-2xs'
                  : maxBrightness
                  ? 'text-slate-500 font-medium hover:text-slate-700'
                  : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Direct Handshake
            </button>
          </div>

          {/* Elevated Pure White Square QR Card */}
          <div className="mt-4 mx-auto w-[224px] h-[224px] sm:w-[234px] sm:h-[234px] rounded-[24px] bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.07)] border border-slate-100/90 flex items-center justify-center relative">
            <svg
              viewBox={`0 0 ${QR_SIZE * 10} ${QR_SIZE * 10}`}
              className="w-full h-full"
              role="img"
              aria-label={`QR code for ${name}`}
            >
              {/* Top-Left Finder Pattern */}
              <rect x="0" y="0" width="70" height="70" rx="14" fill="#0F172A" />
              <rect x="10" y="10" width="50" height="50" rx="8" fill="#FFFFFF" />
              <rect x="20" y="20" width="30" height="30" rx="5" fill="#0F172A" />

              {/* Top-Right Finder Pattern */}
              <rect x="140" y="0" width="70" height="70" rx="14" fill="#0F172A" />
              <rect x="150" y="10" width="50" height="50" rx="8" fill="#FFFFFF" />
              <rect x="160" y="20" width="30" height="30" rx="5" fill="#0F172A" />

              {/* Bottom-Left Finder Pattern */}
              <rect x="0" y="140" width="70" height="70" rx="14" fill="#0F172A" />
              <rect x="10" y="150" width="50" height="50" rx="8" fill="#FFFFFF" />
              <rect x="20" y="160" width="30" height="30" rx="5" fill="#0F172A" />

              {/* Deterministic Matrix Modules */}
              {qrCells.map((cell) => (
                <rect
                  key={`${cell.r}-${cell.c}`}
                  x={cell.c * 10 + 0.8}
                  y={cell.r * 10 + 0.8}
                  width="8.4"
                  height="8.4"
                  rx="2.2"
                  fill="#0F172A"
                />
              ))}
            </svg>

            {/* Centered Soft Lavender Cronium Emblem */}
            <div className="absolute w-10 h-10 rounded-xl bg-[#F4F0FF] border-[3px] border-white flex items-center justify-center shadow-2xs">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4.5 5.2L19.8 11.1L12.9 13.4L10.6 20.3L4.5 5.2Z"
                  fill="#6D28D9"
                />
              </svg>
            </div>
          </div>

          {/* Caption Line */}
          <div
            className={`mt-4 flex items-center justify-center gap-1.5 text-[11.5px] ${
              maxBrightness ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9] shrink-0" />
            <span className="truncate">
              {activeTab === 'connect'
                ? 'Public Mesh Key · Instant profile & credential verification'
                : 'Direct Handshake · Encrypted peer-to-peer session key'}
            </span>
          </div>

          {/* Monospace Key Bar with Inline Copy */}
          <div
            className={`mt-3 flex items-center justify-between gap-2 px-4 py-2.5 rounded-full border ${
              maxBrightness
                ? 'bg-white border-slate-200/80'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-700/80'
            }`}
          >
            <span
              className={`text-[12px] font-mono font-semibold tracking-wide truncate ${
                maxBrightness ? 'text-slate-900' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {displayedKey}
            </span>
            <button
              type="button"
              onClick={() => handleCopyValue(displayedKey.replace(/\s*·\s*/g, ''), 'inline')}
              className="inline-flex items-center gap-1 text-[12px] font-medium text-slate-500 hover:text-[#6D28D9] dark:text-slate-400 dark:hover:text-violet-400 transition-colors cursor-pointer shrink-0"
            >
              {copiedTarget === 'inline' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.4]" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Dual Action Pills */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleSharePass}
            className="py-3 px-4 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white text-[13.5px] font-semibold flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(124,58,237,0.32)] transition-all cursor-pointer active:scale-[0.98]"
          >
            {copiedTarget === 'share' ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 stroke-[2.4]" />
                <span>Pass Copied</span>
              </>
            ) : (
              <>
                <Share className="w-4 h-4 stroke-[2.1]" />
                <span>Share Pass</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleCopyValue(displayedKey.replace(/\s*·\s*/g, ''), 'button')}
            className={`py-3 px-4 rounded-full border text-[13.5px] font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] ${
              maxBrightness
                ? 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border-slate-200/90 dark:border-slate-700 text-slate-900 dark:text-white'
            }`}
          >
            {copiedTarget === 'button' ? (
              <>
                <Check className="w-4 h-4 text-emerald-500 stroke-[2.4]" />
                <span>Key Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500 dark:text-slate-400 stroke-[2]" />
                <span>Copy Key</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
