import { useGameStore } from '../../../store';

import { Button } from './button/button';
import { CreditAccordion } from './credits/credits';

export const MenuCredits = () => {
  const goBack = () => {
    useGameStore.setState({ menuState: useGameStore.getState().prevMenuState });
  };

  return (
    <div className="h-full ">
      <Button text="Back" theme="white" size="small" onClick={goBack} />
      <div className="text-4xl font-bold mb-2 pb-2 border-b-2 border-solid border-white ">Credits</div>
      <CreditAccordion />
    </div>
  );
};
