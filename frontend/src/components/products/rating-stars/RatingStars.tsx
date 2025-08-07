'use client'

import React, { useState, useRef, useLayoutEffect } from 'react'
import { type rating } from '@/lib/schemas/schemas'
import { getStarClassName } from '@/lib/utils'
import "./style.css"

type RatingProps = {
  scale?: number;
  value: rating;
  className?: string,
  // If provided, the component becomes interactive and calls this function on change.
  setValue?: (newValue: rating) => void;
}

const Rating = ({ value, setValue, scale = 1, className }: RatingProps) => {
  const isInteractive = !!setValue;
  const [prevValue, setPrevValue] = useState<rating | null>(null);
  const [animate, setAnimate] = useState<'animate-right' | 'animate-left' | 'none'>('none');
  const starRefs = useRef<(HTMLLIElement | null)[]>([]);
  const animationRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!isInteractive || !animationRef.current) return;
    const currentStarEl = starRefs.current[value - 1];
    if (currentStarEl) {
      const xPosition = currentStarEl.offsetLeft;
      animationRef.current.style.setProperty('--x', `${xPosition}px`);
    }
  }, [value, isInteractive]);

  const handleClick = (newRating: rating) => {
    if (!isInteractive || animate !== 'none') return;
    const direction = newRating > value ? 'animate-right' : 'animate-left';
    setAnimate(direction);
    setPrevValue(value);
    setValue(newRating);
    setTimeout(() => setAnimate('none'), 800);
  };

  return (
    <div
      dir="ltr"
      className={`rating ${isInteractive ? 'rating-interactive' : ''} ${animate} ${className}`}
      style={{
        '--active': '#FFED76',
        '--active-pale': 'rgba(255, 237, 118, .36)',
        '--inactive': '#121621',
        '--face-active': '#121621',
        '--face-inactive': '#1C212E',
        '--rating-scale': scale,
      } as React.CSSProperties}
    >
      <ul>
        {[...Array(5)].map((_, i) => {
          const ratingValue = (i + 1) as rating;
          const starClassName = getStarClassName(isInteractive, animate, ratingValue, value, prevValue);

          return (
            <li
              key={i}
              ref={(el) => {
                if (isInteractive) starRefs.current[i] = el;
              }}
              className={starClassName}
              onClick={() => handleClick(ratingValue)}
            >
              <svg viewBox="0 0 36 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M19.6859343,0.861782958 L24.8136328,8.05088572 C25.0669318,8.40601432 25.4299179,8.6717536 25.8489524,8.80883508 L34.592052,11.6690221 C35.6704701,12.021812 36.2532905,13.1657829 35.8938178,14.2241526 C35.8056709,14.4836775 35.6647294,14.7229267 35.4795411,14.9273903 L29.901129,21.0864353 C29.5299163,21.4962859 29.3444371,22.0366367 29.3872912,22.5833831 L30.1116131,31.8245163 C30.1987981,32.9368499 29.3506698,33.9079379 28.2172657,33.993502 C27.9437428,34.0141511 27.6687736,33.9809301 27.4085205,33.8957918 L18.6506147,31.0307612 C18.2281197,30.8925477 17.7713439,30.8925477 17.3488489,31.0307612 L8.59094317,33.8957918 C7.51252508,34.2485817 6.34688429,33.6765963 5.98741159,32.6182265 C5.90066055,32.3628116 5.86681029,32.0929542 5.88785051,31.8245163 L6.61217242,22.5833831 C6.65502653,22.0366367 6.46954737,21.4962859 6.09833466,21.0864353 L0.519922484,14.9273903 C-0.235294755,14.0935658 -0.158766688,12.8167745 0.690852706,12.0755971 C0.899189467,11.8938516 1.14297067,11.7555303 1.40741159,11.6690221 L10.1505113,8.80883508 C10.5695458,8.6717536 10.9325319,8.40601432 11.1858308,8.05088572 L16.3135293,0.861782958 C16.9654141,-0.0521682813 18.2488096,-0.274439442 19.1800736,0.365326425 C19.3769294,0.500563797 19.5481352,0.668586713 19.6859343,0.861782958 Z"
                />
              </svg>
            </li>
          );
        })}
      </ul>

      {isInteractive && (
        <div ref={animationRef}>
          <span>
            <svg viewBox="0 0 36 34" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                fill="currentColor"
                d="M19.6859343,0.861782958 L24.8136328,8.05088572 C25.0669318,8.40601432 25.4299179,8.6717536 25.8489524,8.80883508 L34.592052,11.6690221 C35.6704701,12.021812 36.2532905,13.1657829 35.8938178,14.2241526 C35.8056709,14.4836775 35.6647294,14.7229267 35.4795411,14.9273903 L29.901129,21.0864353 C29.5299163,21.4962859 29.3444371,22.0366367 29.3872912,22.5833831 L30.1116131,31.8245163 C30.1987981,32.9368499 29.3506698,33.9079379 28.2172657,33.993502 C27.9437428,34.0141511 27.6687736,33.9809301 27.4085205,33.8957918 L18.6506147,31.0307612 C18.2281197,30.8925477 17.7713439,30.8925477 17.3488489,31.0307612 L8.59094317,33.8957918 C7.51252508,34.2485817 6.34688429,33.6765963 5.98741159,32.6182265 C5.90066055,32.3628116 5.86681029,32.0929542 5.88785051,31.8245163 L6.61217242,22.5833831 C6.65502653,22.0366367 6.46954737,21.4962859 6.09833466,21.0864353 L0.519922484,14.9273903 C-0.235294755,14.0935658 -0.158766688,12.8167745 0.690852706,12.0755971 C0.899189467,11.8938516 1.14297067,11.7555303 1.40741159,11.6690221 L10.1505113,8.80883508 C10.5695458,8.6717536 10.9325319,8.40601432 11.1858308,8.05088572 L16.3135293,0.861782958 C16.9654141,-0.0521682813 18.2488096,-0.274439442 19.1800736,0.365326425 C19.3769294,0.500563797 19.5481352,0.668586713 19.6859343,0.861782958 Z"
              />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
};

export default Rating;
