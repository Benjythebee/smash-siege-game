import { PropsWithChildren } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

const ButtonVariants = tv({
  base: 'rounded-md  text-center font-bold uppercase cursor-pointer ',
  variants: {
    theme: {
      green: 'bg-green-600 hover:bg-green-700 text-white ',
      white: 'bg-white hover:bg-slate-200 text-black'
    },
    size: {
      xsmall: 'text-sm py-1 px-2',
      small: 'text-lg py-1 px-2',
      big: 'text-2xl py-2 px-4'
    }
  },
  defaultVariants: {
    theme: 'white',
    size: 'big'
  }
});

type ButtonProps = React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof ButtonVariants> & {
    /**
     * Button Label
     */
    text?: string;
  };

export const Button = (props: PropsWithChildren<ButtonProps>) => {
  const { theme, onClick, size, text, className, ...rest } = props;
  const classN = ButtonVariants({ theme, size, className });
  return (
    <button className={classN} onClick={onClick} {...rest}>
      {text || props.children || ''}
    </button>
  );
};
