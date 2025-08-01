export const AuthBackground: React.FC = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    {/* Gradient mesh */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

    {/* Floating orbs */}
    <div className="floating-orbs pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="floating-orb bg-primary/10 rounded-full blur-3xl opacity-70 animate-float"
          style={{
            width: `${200 + i * 40}px`,
            height: `${200 + i * 40}px`,
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>
  </div>
);