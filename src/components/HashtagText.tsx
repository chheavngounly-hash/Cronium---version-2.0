import React from 'react';

interface HashtagTextProps {
  text: string;
  onHashtagClick?: (tag: string) => void;
  className?: string;
}

const HASHTAG_REGEX = /(#[A-Za-z0-9_&-]+)/g;

export const HashtagText: React.FC<HashtagTextProps> = ({
  text,
  onHashtagClick,
  className = '',
}) => {
  if (!text) return null;
  const parts = text.split(HASHTAG_REGEX);

  return (
    <span className={className}>
      {parts.map((part, idx) => {
        if (/^#[A-Za-z0-9_&-]+$/.test(part) && part.length > 1) {
          const cleanTag = part.slice(1);
          return (
            <button
              key={`${idx}-${part}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onHashtagClick?.(cleanTag);
              }}
              className="inline font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline cursor-pointer"
            >
              {part}
            </button>
          );
        }
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      })}
    </span>
  );
};
