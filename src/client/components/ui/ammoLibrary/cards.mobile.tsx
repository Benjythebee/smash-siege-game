import { TokenAnimatable } from 'mona-js-sdk';
import { Card } from './card.js';

export const CardsMobile = ({ items }: { items: TokenAnimatable[] }) => {
  return (
    <div className="h-full overflow-hidden overflow-y-auto overflow-x-hidden p-2">
      <div className="h-full grid grid-cols-3 gap-2">
        {items.map((item: TokenAnimatable, index: number) => (
          <Card size="small" item={item} key={item.tokenId + item.name} computedStyle={{ margin: 0, angle: 0 }} />
        ))}
      </div>
    </div>
  );
};
