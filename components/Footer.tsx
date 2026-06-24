export function Footer() {
  return (
    <footer className="relative z-50 border-t border-white/[0.09] bg-black">
      <div className="mx-auto flex max-w-wrap items-center justify-between px-[clamp(20px,5vw,64px)] pb-10 pt-6 font-mono text-xs text-faint">
        <span>Cleveland, Ohio</span>
        <span>© {new Date().getFullYear()} Zach Krivis</span>
      </div>
    </footer>
  );
}
