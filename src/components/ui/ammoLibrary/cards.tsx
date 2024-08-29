import React from 'react';
import { TokenAnimatable } from '../../../libs/mona';
import { RightArrowSVG } from '../icons/rightArrow';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useSlingShotStore } from '../../../store';

const CardAnimationVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  jump: { y: 0, opacity: [1, 0.5, 1], transition: { duration: 0.5, repeat: Infinity } }
};

const Card = ({ item, computedStyle }: { item: TokenAnimatable; computedStyle: { margin: number; angle: number } }) => {
  const [isSelected, setSelected] = React.useState(false);

  const selectAssetToImport = (selected: TokenAnimatable) => {
    useSlingShotStore.getState().selectImportedAsset(selected.animation);
  };

  const onCardClick = () => {
    setSelected(true);
    setTimeout(() => setSelected(false), 1000);
    selectAssetToImport(item);
  };
  return (
    <AnimatePresence>
      <motion.div
        variants={CardAnimationVariants}
        initial={'hidden'}
        animate={isSelected ? 'jump' : 'visible'}
        key={item.tokenId + item.name}
        className="pointer-events-auto"
        onClick={onCardClick}
      >
        <div
          style={{ transform: `rotate(${computedStyle.angle}deg)`, marginLeft: `${computedStyle.margin}px` }}
          className="card flex flex-col gap-2 h-full bg-white/90 origin-[bottom_right] p-2 rounded-md shadow-lg shadow-black cursor-pointer transition-all duration-150 hover:z-50 hover:-mt-4"
        >
          <div className="Image min-w-32 grow">
            <img src={item.image} alt={item.name} />
          </div>
          <div className="Name font-bold text-xl">{item.name}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const TOTALCARDS = 4;

export const AmmoLibraryCards = ({ items }: { items: TokenAnimatable[] }) => {
  const container = React.useRef<HTMLDivElement>(null);
  const [viewPage, setViewingPage] = React.useState<number>(0);
  const computedStyle = (index: number) => {
    if (!container.current) return { margin: 0, angle: 0 };
    const w = container.current!.offsetWidth;
    const totalarc = 60;
    const maxSpacing = -20;
    const numcards = TOTALCARDS;
    // const angle = (totalarc / numcards) * (index + 1) - (totalarc / 2 + totalarc / numcards / 2);
    // const margin = (w / numcards) * (index + 1);
    // const angle = (index + 1 - numcards / 2) * (totalarc / numcards);
    const angle = (index - (numcards - 1) / 2) * (Math.PI / numcards);
    // const margin = (index + 1 - numcards / 2) * (totalarc / numcards);
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
