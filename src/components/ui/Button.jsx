export const Button = ({ variant = 'primary', className = '', ...props }) => (
  <button className={`btn-${variant} ${className}`} {...props} />
);
