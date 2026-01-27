export default function Input({ label, ...props }) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-600">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-500"
      />
    </div>
  );
}
