"use client";

import { useState } from 'react';

type CollapsibleTextProps = {
  text: string;
  maxWords: number; // Prop is now maxWords
} & React.HTMLAttributes<HTMLParagraphElement>

const CollapsibleText = ({ text, maxWords, ...rest }: CollapsibleTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split the text into an array of words
  const words = text.split(' ');

  // If the text is short enough, no need for truncation
  if (words.length <= maxWords) {
    return (
      <p className="text-ink" dir="rtl" {...rest}>
        {text}
      </p>
    );
  }

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  // Create the truncated text by joining the first `maxWords` words
  const truncatedText = words.slice(0, maxWords).join(' ');

  return (
    <p className="text-ink leading-relaxed" dir="rtl" {...rest}>
      {isExpanded ? (
        <>
          {text}{' '}
          <button
            onClick={toggleText}
            className="inline bg-transparent border-none p-0 text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            بستن
          </button>
        </>
      ) : (
        <>
          {`${truncatedText} ...`}{' '}
          <button
            onClick={toggleText}
            className="inline bg-transparent border-none p-0 text-blue-600 hover:underline font-semibold cursor-pointer"
          >
            بیشتر بخوانید
          </button>
        </>
      )}
    </p>
  );
};

export default CollapsibleText;
