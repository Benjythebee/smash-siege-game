import { RightArrowSVG } from '../../icons/rightArrow';
import { onTouchXRotate } from '../../../../observables';
import { useSlingshot } from '../../hooks/use-slingshot';

export const TouchXControls = (props: React.HTMLProps<HTMLDivElement>) => {
  const { className } = props;
  const { loading } = useSlingshot();
  const onLeftPressed = () => {
    onTouchXRotate.notifyObservers('left');
  };

  const onRightPressed = () => {
    onTouchXRotate.notifyObservers('right');
  };

  const onCancel = () => {
    onTouchXRotate.notifyObservers(null);
  };

  return (
    <div className={`TouchXControls ${loading ? 'opacity-10' : ''} z-[21] w-full flex justify-between touch-none pointer-events-none select-none ${className}`}>
      <div
        className={`rounded-xl  bg-white/40 cursor-pointer p-2 text-black pointer-events-auto touch-auto active:bg-white/70`}
        onMouseDown={onLeftPressed}
        onTouchStart={onLeftPressed}
        onMouseUp={onCancel}
        onTouchEnd={onCancel}
      >
        <RightArrowSVG className="-scale-x-100 w-24 h-24" />
      </div>
      <div
        className={`rounded-xl bg-white/40 cursor-pointer p-2 text-black pointer-events-auto touch-auto active:bg-white/70`}
        onMouseDown={onRightPressed}
        onTouchStart={onRightPressed}
        onMouseUp={onCancel}
        onTouchEnd={onCancel}
      >
        <RightArrowSVG className="w-24 h-24" />
      </div>
    </div>
  );
};
