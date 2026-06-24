export function Footer() {
  return (
    <footer className="relative z-50 border-t border-white/[0.08] bg-[#050506]">
      <div className="mx-auto flex max-w-wrap items-center justify-center px-[clamp(20px,5vw,64px)] pb-10 pt-6 text-sm text-zinc-600">
        <span>© {new Date().getFullYear()} Zach Krivis</span>
      </div>
    </footer>
  );
}
