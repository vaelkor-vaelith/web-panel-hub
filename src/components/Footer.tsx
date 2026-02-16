const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display text-sm text-foreground tracking-[0.15em]">THE SHATTERED DOMINION</span>
            <p className="text-xs text-muted-foreground mt-1">
              54 warriors. 4 tribes. 1 shattered world.
            </p>
          </div>

          <div className="flex items-center gap-6 font-body text-xs text-muted-foreground uppercase tracking-wide">
            <a href="#tribes" className="hover:text-foreground transition-colors">Tribes</a>
            <a href="#champions" className="hover:text-foreground transition-colors">Champions</a>
            <a href="#lore" className="hover:text-foreground transition-colors">Lore</a>
            <a href="#mechanics" className="hover:text-foreground transition-colors">Mechanics</a>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 The Shattered Dominion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
