export default function Button({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition hover:scale-105 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}