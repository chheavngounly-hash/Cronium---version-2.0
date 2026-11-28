import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  Heart,
  Target,
  ArrowRight,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PromptHistoryItem } from '../types';
import { ServerAvatar } from './ServerAvatar';

interface PromptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: PromptHistoryItem[];
  onSelectPrompt: (item: PromptHistoryItem) => void;
  onDeletePrompt?: (id: string) => void;
  onClearHistory?: () => void;
  activeHistoryId?: string | null;
}

export const PromptHistoryModal: React.FC<PromptHistoryModalProps> = ({
  isOpen,
  onClose,
  historyItems,
  onSelectPrompt,
  onDeletePrompt,
  onClearHistory,
  activeHistoryId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedServerRecordIds, setExpandedServerRecordIds] = useState<Set<string>>(
    () => new Set()
  );

  if (!isOpen) return null;

  const toggleExpandServers = (recordId: string) => {
    setExpandedServerRecordIds((prev) => {
      const next = new Set(prev);
      if (next.has(recordId)) {
        next.delete(recordId);
      } else {
        next.add(recordId);
      }
      return next;
    });
  };

  const filteredItems = historyItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const inTitle = item.title.toLowerCase().includes(q);
    const inRaw = item.rawInput?.toLowerCase().includes(q);
    const inInterests = item.interests.some((i) => i.toLowerCase().includes(q));
    const inHobbies = item.hobbies.some((h) => h.toLowerCase().includes(q));
    const inGoals = item.goals.some((g) => g.toLowerCase().includes(q));
    const inServers = item.matchedServers.some((s) => s.name.toLowerCase().includes(q));
    return inTitle || inRaw || inInterests || inHobbies || inGoals || inServers;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Prompt History"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-[2px] animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 text-left relative overflow-hidden flex flex-col max-h-[88dvh]"
      >
        {/* Top Grab Handle */}
        <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mt-2.5 shrink-0" />

        {/* Header */}
        <div className="px-5 pt-3 pb-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <h3 className="text-[18px] font-extrabold text-slate-900 dark:text-white font-display tracking-[-0.02em] leading-tight truncate">
              Prompt History
            </h3>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 tabular-nums shrink-0">
              {historyItems.length} {historyItems.length === 1 ? 'record' : 'records'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Close"
            aria-label="Close prompt history"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Search & Clear All Bar */}
        <div className="px-5 pb-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 shrink-0">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous prompts or servers..."
              className="w-full pl-9 pr-8 py-2 rounded-full bg-[#F8FAFC] dark:bg-slate-800/80 border border-slate-200/75 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#4F46E5]/25 focus:border-[#4F46E5]/45 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {historyItems.length > 0 && onClearHistory && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-1 py-1 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              title="Clear all history"
            >
              Clear all
            </button>
          )}
        </div>

        {/* History Records List */}
        <div className="overflow-y-auto flex-1 bg-white dark:bg-slate-900 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {filteredItems.length === 0 ? (
            <div className="m-4 py-12 text-center space-y-3 bg-[#F8FAFC] dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div className="space-y-1 px-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {searchQuery ? 'No matching prompts found' : 'No prompt history yet'}
                </h4>
                <p className="text-[11.5px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {searchQuery
                    ? 'Try searching for different keywords or clear the search query.'
                    : 'Submit prompts for your interests, hobbies, and goals to track your community discovery history here.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/90">
              {filteredItems.map((item, idx) => {
                const isActive = activeHistoryId === item.id;
                const isHighlighted = isActive || (!activeHistoryId && idx === 0);
                const isExpanded = expandedServerRecordIds.has(item.id);
                const visibleServers = isExpanded
                  ? item.matchedServers
                  : item.matchedServers.slice(0, 3);
                const remainingCount = item.matchedServers.length - 3;

                return (
                  <div
                    key={item.id}
                    className={`px-5 py-4.5 transition-colors text-left ${
                      isHighlighted
                        ? 'bg-[#F8FAFF] dark:bg-indigo-950/20'
                        : 'bg-white dark:bg-slate-900'
                    }`}
                  >
                    {/* Top Metadata Row: Stage Pill + Timestamp */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full bg-[#4F46E5]/[0.10] dark:bg-[#4F46E5]/25 text-[#4F46E5] dark:text-indigo-300 shrink-0">
                          {item.stage === 'interests'
                            ? '1 · Interests'
                            : item.stage === 'hobbies'
                            ? '2 · Hobbies'
                            : item.stage === 'goals'
                            ? '3 · Goals'
                            : 'Full Match'}
                        </span>
                        <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 truncate">
                          {item.timestamp}
                        </span>
                      </div>

                      {isActive && (
                        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Prompt Title */}
                    <h4
                      className={`mt-2.5 text-[15px] font-extrabold leading-snug tracking-[-0.015em] ${
                        isHighlighted
                          ? 'text-[#4F46E5] dark:text-indigo-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </h4>

                    {/* Stacked Signal Rows (Interests / Hobbies / Goals) */}
                    {(item.interests.length > 0 ||
                      item.hobbies.length > 0 ||
                      item.goals.length > 0) && (
                      <div className="mt-3 space-y-1.5">
                        {item.interests.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5] dark:text-indigo-400 shrink-0 mr-0.5" />
                            {item.interests.map((interest, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.hobbies.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mr-0.5" />
                            {item.hobbies.map((hobby, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium"
                              >
                                {hobby}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.goals.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Target className="w-3.5 h-3.5 text-emerald-500 shrink-0 mr-0.5" />
                            {item.goals.map((goal, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium"
                              >
                                {goal}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Past Servers Received List with Real Server Images */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-500 mb-2">
                        Past Servers Received · {item.matchedServers.length}
                      </p>

                      <div className="divide-y divide-slate-100/90 dark:divide-slate-800/80">
                        {visibleServers.map((server, sIdx) => (
                          <div
                            key={`${server.id || server.name}_${sIdx}`}
                            className="flex items-center justify-between gap-2.5 py-2 first:pt-1"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <ServerAvatar
                                community={server}
                                size="xs"
                                shape="rounded"
                                className="w-7 h-7 rounded-lg ring-1 ring-slate-200/70 dark:ring-slate-700/70"
                              />
                              <span className="text-[12.5px] font-medium text-slate-800 dark:text-slate-100 truncate">
                                {server.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="text-[11.5px] text-slate-500 dark:text-slate-400 tabular-nums">
                                {server.activeMembers} online
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {remainingCount > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleExpandServers(item.id)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-500 dark:text-slate-400 hover:text-[#4F46E5] dark:hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          <span>
                            {isExpanded
                              ? 'Show fewer servers'
                              : `+ ${remainingCount} more ${
                                  remainingCount === 1 ? 'server' : 'servers'
                                }`}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Footer Action Row: Delete Trash Icon Left + Indigo Pill CTA Right */}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      {onDeletePrompt ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePrompt(item.id);
                          }}
                          className="p-2 -ml-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete this prompt record"
                          aria-label="Delete this prompt record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <div />
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectPrompt(item)}
                        className="relative overflow-hidden group px-5 py-2.5 rounded-full bg-[#4F46E5] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_8px_22px_rgba(79,70,229,0.28)] hover:shadow-[0_10px_26px_rgba(6,182,212,0.32)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-[#5549F6] via-[#2B8EF4] to-[#08B6DF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <span className="relative z-10">Show Past Servers on Home</span>
                        <ArrowRight className="relative z-10 w-3.5 h-3.5 stroke-[2.2]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
