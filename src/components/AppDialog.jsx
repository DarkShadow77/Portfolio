import React, { useEffect, useState } from "react";

export default function AppDialog({ app, onClose }) {
  // `shown` lags `app` on close so the exit transition can play out.
  const [shown, setShown] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (app) {
      setShown(app);
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
    }
    setOpen(false);
    const t = setTimeout(() => setShown(null), 420);
    return () => clearTimeout(t);
  }, [app]);

  useEffect(() => {
    if (!app) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [app, onClose]);

  if (!shown) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={shown.name}
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,44px)" }}
    >
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "color-mix(in srgb, #0a0b12 80%, transparent)", backdropFilter: "blur(12px)", opacity: open ? 1 : 0, transition: "opacity .35s ease" }}
      />

      <div
        data-dialog-panel=""
        style={{
          position: "relative", width: "min(980px, 100%)", maxHeight: "min(88svh, 780px)",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          borderRadius: "var(--radius-lg)", background: "var(--color-surface)", boxShadow: "var(--shadow-lg)",
          overflow: "hidden", opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(20px) scale(.97)",
          transition: "opacity .42s cubic-bezier(.16,.84,.28,1), transform .42s cubic-bezier(.16,.84,.28,1)",
        }}
      >
        <div data-dialog-shotpane="" style={{ position: "relative", background: "var(--color-bg)", minHeight: "360px", overflow: "hidden" }}>
          <span style={{ position: "absolute", inset: 0, background: "radial-gradient(110% 72% at 50% 0%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 72%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: "30px" }}>
            <img src={shown.shot} alt={shown.name + " app screens"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        </div>

        <div data-dialog-textpane="" style={{ position: "relative", padding: "30px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <button
            data-dialog-close=""
            aria-label="Close"
            onClick={onClose}
            style={{ position: "absolute", right: "18px", top: "18px", width: "32px", height: "32px", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "1px solid var(--color-divider)", background: "transparent", color: "var(--color-neutral-400)", cursor: "pointer", transition: "background .2s ease, color .2s ease" }}
          >
            <i className="ph ph-x" style={{ fontSize: "14px" }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "14px", paddingRight: "40px" }}>
            <div style={{ flex: "0 0 auto", width: "54px", height: "54px", borderRadius: "15px", overflow: "hidden", background: "var(--color-bg)", boxShadow: "inset 0 0 0 1px var(--color-neutral-800)" }}>
              <img src={shown.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--color-accent-300)" }}>Published app</div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(21px,2.4vw,26px)", letterSpacing: "-0.025em", marginTop: "5px" }}>{shown.name}</div>
            </div>
          </div>

          <p style={{ margin: "24px 0 0", fontSize: "15px", lineHeight: 1.72, color: "var(--color-neutral-400)", textWrap: "pretty" }}>{shown.long}</p>

          {shown.links.length > 0 && (
            <div style={{ marginTop: "auto", paddingTop: "28px" }}>
              <div style={{ fontSize: "11px", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--color-neutral-600)", marginBottom: "11px" }}>Available on</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {shown.links.map((l) => (
                  <a
                    key={l.href}
                    className="tag tag-outline"
                    data-storelink=""
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", fontSize: "13px" }}
                  >
                    <i className={"ph " + l.icon} style={{ fontSize: "13px" }} />
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
