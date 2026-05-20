"use client";

export default function ParticleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial glow top-left */}
      <div
        className="absolute -left-64 -top-64 h-[600px] w-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Radial glow bottom-right */}
      <div
        className="absolute -bottom-64 -right-64 h-[600px] w-[600px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Center blue glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(77,159,255,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Animated dot particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-cyan-400/30"
          style={{
            left: `${(i * 8.3) % 100}%`,
            top: `${(i * 13.7 + 10) % 100}%`,
            animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}
