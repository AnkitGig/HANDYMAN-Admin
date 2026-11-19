export const Input = ({ label, className = '', ...props }) =>
  label ? (
    <label className="block text-sm font-semibold">{label}
      <input className={`field mt-1.5 font-normal ${className}`} {...props} />
    </label>
  ) : <input className={`field ${className}`} {...props} />;
