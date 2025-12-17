const InputRange = ({
  labelEnd,
  labelStart,
  min,
  max,
  step,
  value,
  onChange,
}) => {
  return (
    <div className="form-group">
      <label
        className="form-label font-UthmanicScript fw-bold d-flex justify-content-between align-items-baseline"
        style={{ marginTop: "-10px" }}
      >
        <span className="h4" style={{ fontSize: "15px" }}>
          {labelStart}
        </span>
        <span className="h4" style={{ fontSize: "55px" }}>
          {labelEnd}
        </span>
      </label>
      <input
        type="range"
        className="form-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputRange;
