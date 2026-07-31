import React from "react";

const pill = {
  position: "absolute", right: "10px", top: "10px", zIndex: 3, display: "inline-flex",
  alignItems: "center", gap: "5px", padding: "4px 9px", borderRadius: "999px",
  background: "color-mix(in srgb, var(--color-bg) 74%, transparent)",
  border: "1px solid var(--color-divider)", fontSize: "10px", letterSpacing: ".1em",
  textTransform: "uppercase", color: "var(--color-neutral-400)", backdropFilter: "blur(6px)",
};

export default function AppCard({ app, delay, onOpen }) {
  const keyOpen = (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); }
  };

  return (
    <article
      data-reveal=""
      data-delay={delay}
      data-tilt="7"
      data-app={"app-" + app.slug}
      role="button"
      tabIndex={0}
      aria-label={"View details for " + app.name}
      onClick={onOpen}
      onKeyDown={keyOpen}
      style={{
        position: "relative", borderRadius: "var(--radius-lg)", background: "var(--color-surface)",
        boxShadow: "var(--shadow-sm)", overflow: "hidden", cursor: "pointer",
      }}
    >
      <span data-glow="" style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity .3s ease", pointerEvents: "none", zIndex: 2 }} />

      <div style={{ position: "relative", aspectRatio: "16/10", background: "var(--color-bg)", overflow: "hidden" }}>
        <span style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, var(--color-accent) 15%, transparent), transparent 70%)", pointerEvents: "none" }} />
        <span data-details="" style={pill}>
          <i className="ph ph-arrows-out-simple" style={{ fontSize: "11px" }} />
          Details
        </span>
        <div style={{ position: "absolute", inset: "16px 16px 14px" }}>
          <img
            src={app.shot}
            alt={app.name + " app screens"}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      </div>

      <div style={{ position: "relative", zIndex: 3, padding: "16px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "13px" }}>
          <div style={{ flex: "0 0 auto", width: "46px", height: "46px", borderRadius: "13px", overflow: "hidden", background: "var(--color-bg)", boxShadow: "inset 0 0 0 1px var(--color-neutral-800)" }}>
            <img src={app.logo} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: "17px", letterSpacing: "-0.01em" }}>{app.name}</div>
            <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: 1.55, color: "var(--color-neutral-500)", textWrap: "pretty" }}>{app.short}</p>
          </div>
        </div>

        {app.links.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
            {app.links.map((l) => (
              <a
                key={l.href}
                className="tag tag-outline"
                data-storelink=""
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px" }}
              >
                <i className={"ph " + l.icon} style={{ fontSize: "12px" }} />
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
