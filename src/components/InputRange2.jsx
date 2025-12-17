const InputRangeNew = ({
  labelEnd,
  labelStart,
  min,
  max,
  step,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col w-[180px] sm:w-[200px] justify-center">
      <label className="flex justify-between items-baseline font-UthmanicScript font-bold -mt-2">
        <span className="text-[15px] font-amiri">{labelStart}</span>
        <span className="text-[34px] font-amiri">{labelEnd}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full form-range accent-black cursor-pointer"
      />
    </div>
  );
};

export default InputRangeNew;
