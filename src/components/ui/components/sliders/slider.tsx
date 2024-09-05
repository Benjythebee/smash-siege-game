export type SliderProps = {
  value: number;
  onChange: (num: number) => void;
  label: string;
};

export const Slider = ({ value, onChange, label }: SliderProps) => {
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    onChange(newVolume);
  };

  return (
    <div className="flex items-center">
      <label htmlFor="volume" className="text-sm max-sm:text-xs font-semibold ">
        {label}
      </label>
      <input type="range" min={0} step={0.01} max={1} value={value} onChange={handleVolumeChange} className="w-full" />
    </div>
  );
};
