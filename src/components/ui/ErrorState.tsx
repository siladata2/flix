export function ErrorState({ message = "Something didn't load correctly." }: { message?: string }) {
  return (
    <div className="text-center py-16 px-6">
      <h3 className="font-display text-xl mb-2">We hit a snag</h3>
      <p className="text-ink-faint text-sm max-w-sm mx-auto">{message}</p>
    </div>
  );
}
