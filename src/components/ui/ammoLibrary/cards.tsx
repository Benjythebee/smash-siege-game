import React from 'react';
import { TokenAnimatable } from 'mona-js-sdk';
import { RightArrowSVG } from '../icons/rightArrow';
import { Card } from './card';

const TOTALCARDS = 4;

export const AmmoLibraryCards = ({ items }: { items: TokenAnimatable[] }) => {
  const container = React.useRef<HTMLDivElement>(null);
  const [viewPage, setViewingPage] = React.useState<number>(0);
  const computedStyle = (index: number) => {
    if (!container.current) return { margin: 0, angle: 0 };
    const maxSpacing = -20;
    const numcards = TOTALCARDS;
    const angle = (index - (numcards - 1) / 2) * (Math.PI / numcards);

    const margin = (index + 1 - numcards / 2) * (maxSpacing / numcards);

    return { margin, angle };
  };

  const hasNextPage = items.length > (viewPage + 1) * TOTALCARDS;
  const hasPrevPage = viewPage > 0;

  return (
    <div className={'hand flex h-full w-full relative select-none pointer-events-none'}>
      <div className="ViewBack absolute top-1/2 -translate-y-1/2 left-1 z-[20]">
        {hasPrevPage && (
          <div className=" pointer-events-auto flex items-center rounded-full p-3 bg-slate-500/50 " onClick={() => setViewingPage((s) => s - 1)}>
            <div className="font-bold text-xl fill-black grow">
              <RightArrowSVG className="-scale-x-100" width={30} height={30} />{' '}
            </div>
            <button className="circle-button whitespace-break-spaces font-semibold shrink">
              <span className="block">Back</span>
            </button>
          </div>
        )}
      </div>

      <div className={`card-container w-full flex flex-auto scale-75 ${hasPrevPage ? '-ml-12' : '-ml-16'}`} ref={container}>
        {items.slice(viewPage * TOTALCARDS, viewPage * TOTALCARDS + TOTALCARDS).map((item: TokenAnimatable, index: number) => (
          <Card item={item} key={item.tokenId + item.name} computedStyle={computedStyle(index)} />
        ))}
      </div>
      <div className="ViewMore absolute top-1/2 -translate-y-1/2 right-1 ">
        {hasNextPage && (
          <div className="flex pointer-events-auto items-center rounded-full p-3 bg-slate-500/50 " onClick={() => setViewingPage((s) => s + 1)}>
            <button className="circle-button whitespace-break-spaces font-semibold shrink">
              <span className="block">Next</span>
            </button>
            <div className="font-bold text-xl fill-black grow">
              <RightArrowSVG width={30} height={30} />{' '}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
