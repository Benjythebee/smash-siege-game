import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useSlingShotStore } from '../../../store.js';
import { TokenAnimatable } from 'mona-js-sdk';
import React from 'react';
import { tv, VariantProps } from 'tailwind-variants';
import { useLibraryMobileState } from './library.mobile.store.js';

const CardAnimationVariants: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
  jump: { y: 0, opacity: [1, 0.5, 1], transition: { duration: 0.5, repeat: Infinity } }
};

const cardVariants = tv({
  slots: {
    container: 'card flex flex-col gap-2 h-full bg-white/90 origin-[bottom_right] p-2 rounded-md  shadow-black cursor-pointer transition-all duration-150 hover:z-50 hover:-mt-4',
    image: 'Image min-w-32 grow',
    text: 'Name font-bold text-xl'
  },
  variants: {
    size: {
      large: {
        container: 'shadow-lg'
      },
      small: {
        container: 'shadow-sm',
        image: 'min-w-14',
        text: 'font-bold text-base'
      }
    }
  },
  defaultVariants: {
    size: 'large'
  }
});

type CardProps = VariantProps<typeof cardVariants> & {
  item: TokenAnimatable;
  computedStyle: { margin: number; angle: number };
};

export const Card = ({ item, computedStyle, size }: CardProps) => {
  const [isSelected, setSelected] = React.useState(false);
  const toggleLibraryOnMobile = useLibraryMobileState((state) => state.setIsOpen);

  const selectAssetToImport = (selected: TokenAnimatable) => {
    useSlingShotStore.getState().selectImportedAsset(selected.animation);
    toggleLibraryOnMobile(false);
  };

  const onCardClick = () => {
    setSelected(true);
    setTimeout(() => setSelected(false), 1000);
    selectAssetToImport(item);
  };

  const { image, text, container } = cardVariants({ size });

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
        <div style={{ transform: `rotate(${computedStyle.angle}deg)`, marginLeft: `${computedStyle.margin}px` }} className={container()}>
          <div className={image()}>
            <img src={item.image} alt={item.name} />
          </div>
          <div className={text()}>{item.name}</div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
