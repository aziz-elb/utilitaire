export const particles = Array.from({ length: 30 }).map((_, i) => {
  const size = Math.random() * 4 + 2;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  const opacity = Math.random() * 0.5 + 0.3;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * 5;

  return (
    <span
      key={i}
      className="absolute block bg-white/50 rounded-full pointer-events-none"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${posX}%`,
        top: `${posY}%`,
        opacity: opacity,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
});


