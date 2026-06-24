/**
 * A single, slow-moving, deeply desaturated radial spotlight behind a card —
 * a soft ambient light, not a colored mesh. `color` should be a dark, muted
 * obsidian/slate/midnight (low saturation, low alpha). No neon.
 */
export function AmbientBackground({ color }: { color: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="ambient-glow"
        style={{
          backgroundImage: `radial-gradient(50% 45% at 50% 16%, ${color}, transparent 72%)`,
        }}
      />
    </div>
  );
}
