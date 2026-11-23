export const Input = ({ label, className = '', ...props }) =>
  label ? (
    <label className="block text-[13px] font-semibold">{label}
      <input className={`field mt-1 font-normal ${className}`} {...props} />
    </label>
  ) : <input className={`field ${className}`} {...props} />;
