import { AnimatePresence, motion } from 'framer-motion';
import { Credits, type CreditContent } from './constants.js';
import { useState } from 'react';

const Accordion = ({ content, expanded, index, setExpanded }: { content: CreditContent; index: number; expanded: boolean; setExpanded: (b: number) => void }) => {
  const isOpen = expanded;

  // By using `AnimatePresence` to mount and unmount the contents, we can animate
  // them in and out while also only rendering the contents of open accordions
  return (
    <>
      <motion.header
        className="rounded-md text-lg pl-2 py-1 text-black cursor-pointer text-ellipsis overflow-hidden whitespace-pre "
        initial={false}
        animate={{ backgroundColor: isOpen ? '#FFFFFF' : '#0055FF' }}
        onClick={() => setExpanded(isOpen ? -1 : index)}
      >
        {content.item}
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="grid grid-cols-2 justify-between grow p-2 pt-0 gap-2">
              <span className="font-bold">Author</span>
              <span>{content.author}</span>
              {content.modified && (
                <>
                  <span className="font-bold">Modified by</span>
                  <span>{content.modified}</span>
                </>
              )}
              <span className="font-bold">Link</span>
              <a className="" href={content.link} target="_blank" rel="noreferrer">
                Click me!
              </a>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export const CreditAccordion = () => {
  const [expandedContentNum, setExpandedContentNum] = useState<number>(-1);
  const [expandedMusicNum, setExpandedMusicNum] = useState<number>(-1);

  return (
    <div className="grid grid-cols-2 gap-1 max-h-96 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-2">
        <span className="font-bold">Assets:</span>
        {Credits.content.map((item, index) => (
          <Accordion key={item.link + item.item} content={item} index={index} expanded={index == expandedContentNum} setExpanded={setExpandedContentNum} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-bold">Music & Audio:</span>
        {Credits.musicAudio.map((item, index) => (
          <Accordion key={item.link + item.item} content={item} index={index} expanded={index == expandedMusicNum} setExpanded={setExpandedMusicNum} />
        ))}
      </div>
    </div>
  );
};
