import React, { Children } from 'react';
import { cn } from '@/lib/utils';

type Props = { incoming?: boolean; children: React.ReactNode };

export const MessageBubble = ({ incoming = false, children }: Props) => {
  const containerBG = 'bg-surface';

  const recevierBG = 'bg-slate-200 text-black';
  const senderBG = 'bg-sky-500 text-white';

  return (
    <div
      className={cn(
        'relative rounded-3xl px-5 py-2.5 text-lg break-words max-w-4/5',
        incoming ? 'self-start' : 'self-end',
        incoming ? recevierBG : senderBG
      )}
    >
      <div
        className={cn(
          'absolute bottom-0 h-6 w-5',
          incoming ? recevierBG : senderBG,
          incoming ? 'rounded-br-[80%_58%] -left-2' : 'rounded-bl-[80%_58%] -right-2'
        )}
      />
      <div
        className={cn(
          'absolute bottom-0 h-6 w-3 bg-current',
          incoming ? 'rounded-br-[70%_30%] -left-3' : 'rounded-bl-[70%_30%] -right-3',
          containerBG
        )}
      />
      {children}
    </div>
  );
};

export const ChatContainer = ({ children, containerBG }: { containerBG: string, children: React.ReactNode }) => {
  return (
    <div className={cn(
      'flex space-y-3 flex-col h-auto w-full p-3',
      containerBG
    )} dir='ltr'>
      {children}
    </div>
  )
}
