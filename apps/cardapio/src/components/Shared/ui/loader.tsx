// components/shared/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <span className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-stone-400" />
    </div>
  );
}
