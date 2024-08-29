import { tv, VariantProps } from 'tailwind-variants';

const ButtonVariants = tv({
  base: 'rounded-md  text-center font-bold uppercase cursor-pointer ',
  variants: {
    theme: {
      green: 'bg-green-600 hover:bg-green-700 text-white ',
      blue: 'bg-blue-800 hover:bg-blue-900 text-white ',
      purple: 'bg-purple-800 hover:bg-purple-900 text-white ',
      white: 'bg-white hover:bg-gray-200 text-black',
      red: 'bg-red-800 hover:bg-red-900 text-white'
    },
    size: {
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
    text: string;
  };

export const Button = (props: ButtonProps) => {
  const { theme, onClick, size, text, className, ...rest } = props;
  const classN = ButtonVariants({ theme, size, className });
  return (
    <button className={classN} onClick={onClick} {...rest}>
      {text}
    </button>
  );
};
