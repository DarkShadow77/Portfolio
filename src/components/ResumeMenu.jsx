import React, { useEffect, useRef, useState } from "react";

// import.meta.env.BASE_URL already carries a trailing slash (e.g. "/Portfolio/"
// on GitHub Pages), so plain "/David_…" root paths 404 once deployed under a sub-path.
const RESUME_LIGHT = `${import.meta.env.BASE_URL}David_Adeshina_Flutter_Resume_Light.pdf`;
const RESUME_DARK = `${import.meta.env.BASE_URL}David_Adeshina_Flutter_Resume_Dark.pdf`;

// Hover opens the menu on devices with a real pointer; everywhere else
// (touch, keyboard) it's click-to-toggle instead.
const canHover =
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

export default function ResumeMenu({ className = "", style, label = "Résumé", align = "right", block = false, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const select = () => {
    setOpen(false);
    onSelect?.();
  };

  return (
    <div
      ref={rootRef}
      data-resume-menu=""
      style={{ position: "relative", display: block ? "block" : "inline-block" }}
      {...(canHover
        ? { onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false) }
        : {})}
    >
      <button
        type="button"
        className={`btn btn-primary ${className}`.trim()}
        data-magnet=""
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{ width: block ? "100%" : undefined, ...style }}
      >
        <i className="ph ph-download-simple" style={{ fontSize: "inherit" }}></i>
        {label}
      </button>
      <div
        role="menu"
        data-resume-panel=""
        style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          [align]: 0,
          minWidth: "180px",
          padding: "6px",
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface)",
          boxShadow: "var(--shadow-lg)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-6px)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .2s ease, transform .2s ease",
          zIndex: 20,
        }}
      >
        <a role="menuitem" className="resume-menu-item" href={RESUME_LIGHT} download onClick={select}>
          <i className="ph ph-sun" style={{ fontSize: "16px", color: "var(--color-accent)" }}></i>
          Light version
        </a>
        <a role="menuitem" className="resume-menu-item" href={RESUME_DARK} download onClick={select}>
          <i className="ph ph-moon" style={{ fontSize: "16px", color: "var(--color-accent)" }}></i>
          Dark version
        </a>
      </div>
    </div>
  );
}
