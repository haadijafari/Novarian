import { review } from '@/lib/schemas/schemas';
import Image from 'next/image';
import React from 'react';
import { Quote } from 'lucide-react';

// Your custom components (adjust paths as needed)
import Rating from '../rating-stars';
import CollapsibleText from '@/components/ui/CollapsibleText';
import { Separator } from '@/components/ui/separator';


// The component props are correctly typed for a <div> and accept extra props.
type ReviewCardProps = {
  review: review;
} & React.HTMLAttributes<HTMLDivElement>

const ReviewCard = ({ review, className, ...rest }: ReviewCardProps) => {
  return (
    <div
      className={`flex flex-col bg-surface-sharp rounded-xl w-full overflow-y-hidden shadow-md ${className || ''}`}
      {...rest}
    >

      {/* --- Product Image Section --- */}
      {review.pictureURL ? (
        <div className="flex-1 aspect-square relative">
          <Image
            alt={`Photo for review by ${review.user}`}
            src={review.pictureURL}
            fill={true}
            className='rounded-t-xl object-cover'
          />

          <div
            className="
              absolute
              bottom-0
              start-4
              translate-y-1/2
              h-12 w-12
              rounded-full
              border-2
              border-surface
              overflow-hidden
            "
          >
            <Image
              className='rounded-full'
              alt={`Avatar of ${review.user}`}
              src={review.userIcon}
              width={48}
              height={48}
            />
          </div>
        </div>
      ) : <div className='
              -mb-6
              mr-4
              mt-2
              start-4
              h-12 w-12
              rounded-full
              border-2
              border-surface
              overflow-hidden'>
        <Image
          className='rounded-full'
          alt={`Avatar of ${review.user}`}
          src={review.userIcon}
          width={48}
          height={48}
        />
      </div>}
      {/* --- User Info & Rating Row --- */}
      <div className="flex items-center justify-between px-4 pt-8">
        <div className='flex-1 min-w-0'>
          <h3 className='font-semibold text-foreground truncate'>{review.user}</h3>
          {review.purchased && (
            <p className='text-xs text-muted-foreground'>خریداری شده</p>
          )}
        </div>

        <Rating scale={.75} value={review.rating} />
      </div>
      {/* --- Description Section --- */}
      <div className="grow rounded-b-xl p-4 pt-3">
        <div className='pb-4'>
          <h3 className='text-xl mb-4 font-bold text-foreground'>
            {review.title}
          </h3>
          <Separator className='mt-3 bg-surface-muted' />
        </div>

        {/* 'flow-root' contains the floated quote icon */}
        <div className="flow-root">
          <Quote
            // 'float-right' and 'ms-3' for classic text wrapping
            className="float-right ms-3 flex-shrink-0 text-surface-muted w-6 h-6"
            fill="currentColor"
            stroke="1"
          />
          <CollapsibleText
            text={review.discription}
            maxWords={38}
            className="text-lg indent-3 text-ink leading-relaxed text-start"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
