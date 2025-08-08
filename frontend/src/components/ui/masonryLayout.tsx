'use client'

import { motion } from "framer-motion";
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";

type Position = {
  top: number;
  // This value represents the offset from the 'start' (right) edge, making it suitable for RTL layouts.
  right: number;
  width: number;
};

type Props = {
  children: ReactNode,
  columnCount?: number,
  gap?: number,
  className?: string,
}

/**
 * A responsive, animated, and reactive masonry layout component optimized for RTL (Right-to-Left) languages.
 * It arranges child components of varying heights into a grid.
 *
 * How it works:
 * 1. It measures its own width to determine the width of each column.
 * 2. It wraps each child in a `MasonryItemWrapper` component.
 * 3. The `MasonryItemWrapper` uses a `ResizeObserver` to measure the child's height and reports it back to this parent component.
 * 4. This component stores all child heights in a state object (`itemHeights`).
 * 5. A `useMemo` hook calculates the `top` and `right` position for each item whenever the container width, children, or any item's height changes.
 * 6. Items are rendered using `framer-motion` to animate them smoothly into their calculated positions.
 */
const MasonryLayout = ({
  children,
  columnCount = 3,
  gap = 16,
  className,
}: Props) => {
  // A ref to get the DOM node of the main container, used for measuring its width.
  const containerRef = useRef<HTMLDivElement>(null);

  const [containerWidth, setContainerWidth] = useState(0);

  // State to store the measured height of each individual item, keyed by the item's unique `key` prop.
  // This is the core of the component's reactivity. When a height changes, the layout is recalculated.
  const [itemHeights, setItemHeights] = useState<Record<string, number>>({});


  // Effect to observe the main container's width.
  useEffect(() => {
    // A ResizeObserver is more performant than listening to the window's resize event.
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // When the container's size changes, update the containerWidth state.
        setContainerWidth(entry.contentRect.width);
      }
    });

    // Start observing the container element if it exists.
    if (containerRef.current) observer.observe(containerRef.current);

    // Cleanup: Disconnect the observer when the component unmounts to prevent memory leaks.
    return () => observer.disconnect();
  }, []);

  // A memoized callback function to update an item's height.
  // It's passed down to each `MasonryItemWrapper`.
  const updateItemHeight = useCallback((key: string, height: number) => {
    setItemHeights(prevHeights => {
      // Optimization: Only update the state if the height has actually changed.
      // This prevents unnecessary re-renders if the observer fires with the same height.
      if (prevHeights[key] !== height) {
        return { ...prevHeights, [key]: height };
      }
      return prevHeights;
    });
  }, []);

  // This is the main calculation logic, memoized for performance.
  // It only re-runs if its dependencies change (e.g., container width, children, or any item's height).
  const { positions, containerHeight } = useMemo(() => {
    // Exit early if we don't have enough information to calculate the layout.
    if (containerWidth === 0 || React.Children.count(children) === 0) {
      return { positions: {}, containerHeight: 0 };
    }

    // Calculate the width of each column based on container width, column count, and gap.
    const columnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;

    // Create an array to track the current height of each column, initialized to 0.
    const columnHeights = new Array(columnCount).fill(0);

    // An object to store the calculated position for each item.
    const calculatedPositions: Record<string, Position> = {};

    // Iterate over each child to calculate its position.
    React.Children.forEach(children, (child) => {
      // Ensure the child is a valid React element with a key.
      if (!React.isValidElement(child) || !child.key) return;

      const key = String(child.key);
      const itemHeight = itemHeights[key];

      // Skip items that haven't been measured yet. They will be processed once their height is reported.
      if (typeof itemHeight !== 'number') return;

      // --- Core Masonry Logic ---
      // 1. Find the column with the minimum current height.
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      // 2. The `top` position is the current height of that shortest column.
      const top = columnHeights[shortestColumnIndex];
      // 3. The `right` position is based on the column index (for RTL).
      const right = shortestColumnIndex * (columnWidth + gap);

      // Store the calculated position.
      calculatedPositions[key] = { top, right, width: columnWidth };

      // 4. Update the height of the column that the item was just added to.
      columnHeights[shortestColumnIndex] += itemHeight + gap;
    });

    // The total container height is the height of the tallest column.
    const tallestColumnHeight = Math.max(...columnHeights, 0);

    return {
      positions: calculatedPositions,
      // Subtract the final gap to prevent extra space at the bottom.
      containerHeight: tallestColumnHeight > 0 ? tallestColumnHeight - gap : 0,
    };
  }, [children, containerWidth, columnCount, gap, itemHeights]); // Dependencies for the useMemo hook.

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className || ''}`}
      // This tells Framer Motion to animate the height property whenever it changes.
      animate={{ height: containerHeight || 'auto' }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || !child.key) return null;

        const key = String(child.key);
        const position = positions[key];
        // An item is considered "visible" once its position has been calculated.
        const isVisible = position !== undefined;
        const columnWidth = (containerWidth - (columnCount - 1) * gap) / columnCount;

        return (
          <motion.div
            key={key}
            // Initial state before animation.
            initial={{ opacity: 0, right: 0 }}
            // Animate to the final calculated position.
            animate={{
              opacity: isVisible ? 1 : 0,
              top: position?.top ?? 0,
              right: position?.right ?? 0,
              width: position?.width,
            }}
            // Spring animation for a smooth, natural feel.
            transition={{ type: 'spring', stiffness: 250, damping: 40 }}
            style={{
              position: 'absolute',
              // Keep the item hidden until it's ready to be animated into place.
              // This prevents a "flash" of un-positioned content.
              visibility: isVisible ? 'visible' : 'hidden',
            }}
          >
            {/* Wrap the child in the helper component that handles measuring. */}
            <MasonryItemWrapper
              onHeightChange={updateItemHeight}
              itemKey={key}
              width={columnWidth}
            >
              {child}
            </MasonryItemWrapper>
          </motion.div>
        );
      })}
    </motion.div>
  );
};


/**
 * A helper component that wraps each masonry item.
 * Its sole purpose is to observe its own height and report it to the parent `MasonryLayout`.
 */
const MasonryItemWrapper = ({ children, itemKey, onHeightChange, width }: {
  children: ReactNode;
  itemKey: string;
  onHeightChange: (key: string, height: number) => void;
  width: number;
}) => {
  // A ref to get the DOM node of this wrapper.
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    // Create a ResizeObserver to watch this specific item.
    const observer = new ResizeObserver(() => {
      // When this item's height changes (e.g., an image loads, text expands),
      // call the `onHeightChange` callback with its key and new height.
      onHeightChange(itemKey, item.getBoundingClientRect().height);
    });

    // Start observing the item.
    observer.observe(item);

    // Cleanup: Disconnect the observer when the component unmounts.
    return () => observer.disconnect();
  }, [itemKey, onHeightChange]);

  return (
    // The div that gets measured. Its width is set explicitly so that the
    // browser can correctly calculate its height based on its content.
    <div ref={itemRef} style={{ width: width > 0 ? width : undefined }}>
      {children}
    </div>
  );
};

export default MasonryLayout;
