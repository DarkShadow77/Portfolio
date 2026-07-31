import React, { useEffect, useRef, useState } from "react";
import PortfolioFX from "./fx";
import { apps } from "./data/apps";
import AppCard from "./components/AppCard";
import AppDialog from "./components/AppDialog";
import ResumeMenu from "./components/ResumeMenu";

export default function App() {
  const [heroMode, setHeroMode] = useState("lattice");
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(null);
  const fx = useRef(null);

  // The effects engine owns canvases, scroll listeners and the cursor. It is
  // mounted once; prop changes are pushed in rather than remounting it.
  useEffect(() => {
    const engine = new PortfolioFX({ heroMode: "lattice", heroDensity: 150, motionLevel: "full" });
    fx.current = engine;
    engine.mount();
    return () => engine.unmount();
  }, []);

  useEffect(() => {
    if (fx.current) fx.current.setProps({ ...fx.current.props, heroMode });
  }, [heroMode]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  useEffect(() => {
    if (fx.current) fx.current.setProps({ ...fx.current.props, modalOpen: !!active });
  }, [active]);

  return (
    <>
      <div style={{ "position": "relative", "background": "var(--color-bg)", "color": "var(--color-text)", "fontFamily": "var(--font-body)", "minHeight": "100svh", "overflow": "hidden" }}>
      
      <div data-progress="" style={{ "position": "fixed", "top": "0", "left": "0", "height": "2px", "width": "0%", "background": "linear-gradient(to right,transparent,var(--color-accent))", "zIndex": "60", "pointerEvents": "none" }}></div>
      <canvas data-cursor-canvas="" style={{ "position": "fixed", "inset": "0", "width": "100%", "height": "100%", "pointerEvents": "none", "zIndex": "200" }}></canvas>
      
      <div data-cursor-ring="" style={{ "position": "fixed", "boxSizing": "border-box", "margin": "0", "left": "0px", "top": "0px", "width": "28px", "height": "28px", "borderRadius": "50%", "border": "1px solid color-mix(in srgb, var(--color-accent) 45%, transparent)", "pointerEvents": "none", "zIndex": "201", "opacity": "0", "transition": "opacity .3s ease,border-color .25s ease,background .25s ease", "willChange": "transform" }}></div>
      
      <header data-nav="" style={{ "position": "fixed", "top": "0", "left": "0", "right": "0", "height": "62px", "zIndex": "50", "display": "flex", "alignItems": "center", "borderBottom": "1px solid transparent", "transition": "background .35s ease,border-color .35s ease,backdrop-filter .35s ease" }}>
        <div data-pad="" style={{ "width": "100%", "maxWidth": "1180px", "margin": "0 auto", "padding": "0 32px", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "24px" }}>
          <a href="#top" style={{ "display": "flex", "alignItems": "center", "gap": "10px", "textDecoration": "none", "color": "var(--color-text)" }}>
            <span style={{ "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "width": "26px", "height": "26px", "border": "1px solid var(--color-accent)", "borderRadius": "var(--radius-sm)", "fontSize": "11px", "letterSpacing": ".04em", "color": "var(--color-accent)", "fontFamily": "var(--font-heading)" }}>DA</span>
            <span style={{ "fontFamily": "var(--font-heading)", "fontSize": "13px", "letterSpacing": ".14em", "textTransform": "uppercase" }}>David Adeshina</span>
          </a>
          <nav data-navwrap="" style={{ "display": "flex", "alignItems": "center", "gap": "26px" }}>
            <a data-navlink="" href="#approach" style={{ "fontSize": "12.5px", "letterSpacing": ".09em", "textTransform": "uppercase", "textDecoration": "none", "color": "var(--color-neutral-500)", "transition": "color .25s ease" }}>Approach</a>
            <a data-navlink="" href="#stack" style={{ "fontSize": "12.5px", "letterSpacing": ".09em", "textTransform": "uppercase", "textDecoration": "none", "color": "var(--color-neutral-500)", "transition": "color .25s ease" }}>Stack</a>
            <a data-navlink="" href="#experience" style={{ "fontSize": "12.5px", "letterSpacing": ".09em", "textTransform": "uppercase", "textDecoration": "none", "color": "var(--color-neutral-500)", "transition": "color .25s ease" }}>Experience</a>
            <a data-navlink="" href="#work" style={{ "fontSize": "12.5px", "letterSpacing": ".09em", "textTransform": "uppercase", "textDecoration": "none", "color": "var(--color-neutral-500)", "transition": "color .25s ease" }}>Work</a>
            <a data-navlink="" href="#contact" style={{ "fontSize": "12.5px", "letterSpacing": ".09em", "textTransform": "uppercase", "textDecoration": "none", "color": "var(--color-neutral-500)", "transition": "color .25s ease" }}>Contact</a>
            <ResumeMenu style={{ marginLeft: "4px" }} />
          </nav>
          <button
            data-menu-btn=""
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            style={{ display: "none", width: "44px", height: "44px", marginRight: "-10px", alignItems: "center", justifyContent: "center", border: 0, background: "transparent", color: "var(--color-text)", cursor: "pointer", padding: 0 }}
          >
            <span style={{ position: "relative", display: "block", width: "19px", height: "11px" }}>
              <span style={{ position: "absolute", left: 0, top: menuOpen ? "5px" : 0, width: "19px", height: "1.5px", borderRadius: "2px", background: "currentColor", transform: menuOpen ? "rotate(45deg)" : "none", transition: "transform .34s cubic-bezier(.16,.84,.28,1), top .28s ease" }} />
              <span style={{ position: "absolute", left: 0, top: menuOpen ? "5px" : "9.5px", width: menuOpen ? "19px" : "13px", height: "1.5px", borderRadius: "2px", background: "currentColor", transform: menuOpen ? "rotate(-45deg)" : "none", transition: "transform .34s cubic-bezier(.16,.84,.28,1), top .28s ease, width .28s ease" }} />
            </span>
          </button>
        </div>
        <div
          data-menu=""
          style={{ position: "absolute", left: 0, right: 0, top: "62px", display: "none", flexDirection: "column", padding: "8px 20px 18px", background: "color-mix(in srgb, var(--color-bg) 96%, transparent)", backdropFilter: "blur(18px)", borderBottom: "1px solid var(--color-divider)", opacity: menuOpen ? 1 : 0, transform: menuOpen ? "translateY(0)" : "translateY(-10px)", pointerEvents: menuOpen ? "auto" : "none", transition: "opacity .32s ease, transform .38s cubic-bezier(.16,.84,.28,1)" }}
          data-open={menuOpen ? "true" : "false"}
        >
          <a href="#approach" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", minHeight: "48px", fontSize: "15px", letterSpacing: ".02em", textDecoration: "none", color: "var(--color-neutral-300)", borderBottom: "1px solid var(--color-divider)" }}>Approach</a>
          <a href="#stack" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", minHeight: "48px", fontSize: "15px", letterSpacing: ".02em", textDecoration: "none", color: "var(--color-neutral-300)", borderBottom: "1px solid var(--color-divider)" }}>Stack</a>
          <a href="#experience" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", minHeight: "48px", fontSize: "15px", letterSpacing: ".02em", textDecoration: "none", color: "var(--color-neutral-300)", borderBottom: "1px solid var(--color-divider)" }}>Experience</a>
          <a href="#work" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", minHeight: "48px", fontSize: "15px", letterSpacing: ".02em", textDecoration: "none", color: "var(--color-neutral-300)", borderBottom: "1px solid var(--color-divider)" }}>Work</a>
          <a href="#education" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", minHeight: "48px", fontSize: "15px", letterSpacing: ".02em", textDecoration: "none", color: "var(--color-neutral-300)", borderBottom: "1px solid var(--color-divider)" }}>Education</a>
          <a href="#contact" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", minHeight: "48px", fontSize: "15px", letterSpacing: ".02em", textDecoration: "none", color: "var(--color-neutral-300)" }}>Contact</a>
          <ResumeMenu block align="left" onSelect={() => setMenuOpen(false)} style={{ marginTop: "14px", justifyContent: "center", minHeight: "48px", fontSize: "15px" }} />
        </div>
      </header>
      
      <section id="top" style={{ "position": "relative", "minHeight": "100svh", "display": "flex", "alignItems": "center", "scrollMarginTop": "80px" }}>
        <canvas data-hero-canvas="" style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "display": "block" }}></canvas>
        <div style={{ "position": "absolute", "inset": "0", "background": "radial-gradient(120% 90% at 78% 22%, transparent 20%, var(--color-bg) 78%)", "pointerEvents": "none" }}></div>
        <div style={{ "position": "absolute", "left": "0", "right": "0", "bottom": "0", "height": "220px", "background": "linear-gradient(to bottom, transparent, var(--color-bg))", "pointerEvents": "none" }}></div>
      
        <div data-pad="" style={{ "position": "relative", "width": "100%", "maxWidth": "1180px", "margin": "0 auto", "padding": "120px 32px 90px" }}>
          <div data-reveal="" style={{ "display": "flex", "alignItems": "center", "gap": "10px", "marginBottom": "26px" }}>
            <span style={{ "width": "6px", "height": "6px", "borderRadius": "50%", "background": "var(--color-accent)", "boxShadow": "0 0 12px var(--color-accent)", "animation": "noct-breathe 2.6s ease-in-out infinite" }}></span>
            <span style={{ "fontSize": "11.5px", "letterSpacing": ".16em", "textTransform": "uppercase", "color": "var(--color-neutral-500)" }}>Open to senior mobile roles</span>
          </div>
      
          <h1 data-reveal="" data-delay="0.06" style={{ "fontSize": "clamp(46px,7.4vw,104px)", "lineHeight": "0.94", "letterSpacing": "-0.035em", "margin": "0 0 26px", "maxWidth": "14ch" }}>David<br />Adeshina</h1>
      
          <p data-reveal="" data-delay="0.14" style={{ "fontSize": "clamp(17px,1.7vw,22px)", "lineHeight": "1.5", "maxWidth": "52ch", "margin": "0 0 14px", "color": "var(--color-neutral-300)", "textWrap": "pretty" }}>Flutter engineer with <span style={{ "color": "var(--color-text)" }}>4+ years shipping production apps</span> to the App&nbsp;Store and Play&nbsp;Store — fintech, social, and real-time betting.</p>
      
          <p data-reveal="" data-delay="0.2" style={{ "fontSize": "15.5px", "lineHeight": "1.65", "maxWidth": "50ch", "margin": "0 0 38px", "color": "var(--color-neutral-500)", "textWrap": "pretty" }}>Clean Architecture and BLoC at scale, native bridging when the platform demands it, and a postgraduate background in cybersecurity behind every auth flow I write.</p>
      
          <div data-reveal="" data-delay="0.26" style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "center", "gap": "12px", "marginBottom": "46px" }}>
            <a className="btn btn-primary" data-magnet="" href="#work" style={{ "padding": "10px 20px", "fontSize": "14.5px" }}>See the work<i className="ph ph-arrow-down" style={{ "fontSize": "15px" }}></i></a>
            <a className="btn btn-secondary" data-magnet="" href="#contact" style={{ "padding": "10px 20px", "fontSize": "14.5px" }}>Get in touch</a>
          </div>
      
          <div data-reveal="" data-delay="0.32" style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
            <span className="tag tag-outline">Flutter</span>
            <span className="tag tag-outline">Dart</span>
            <span className="tag tag-outline">BLoC / Riverpod</span>
            <span className="tag tag-outline">Clean Architecture</span>
            <span className="tag tag-outline">iOS + Android</span>
          </div>
        </div>
      
        <div data-herotoggle="" style={{ "position": "absolute", "right": "32px", "bottom": "34px", "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "14px", "zIndex": "2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid var(--color-divider)", borderRadius: "var(--radius-md)", overflow: "hidden", background: "color-mix(in srgb, var(--color-bg) 70%, transparent)", backdropFilter: "blur(8px)" }}>
            {["constellation", "lattice"].map((m, i) => (
              <React.Fragment key={m}>
                {i > 0 && <span style={{ width: "1px", alignSelf: "stretch", background: "var(--color-divider)" }} />}
                <button
                  onClick={() => setHeroMode(m)}
                  style={{ cursor: "pointer", border: 0, background: heroMode === m ? "color-mix(in srgb, var(--color-accent) 14%, transparent)" : "transparent", color: heroMode === m ? "var(--color-text)" : "var(--color-neutral-500)", font: "inherit", fontSize: "11px", letterSpacing: ".1em", textTransform: "uppercase", padding: "8px 14px", fontFamily: "var(--font-heading)", transition: "background .25s ease, color .25s ease" }}
                >
                  {m}
                </button>
              </React.Fragment>
            ))}
          </div>
          <div data-scrollcue="" style={{ "width": "1px", "height": "56px", "background": "linear-gradient(to bottom,transparent,var(--color-neutral-700))", "position": "relative", "overflow": "hidden" }}>
            <span style={{ "position": "absolute", "top": "0", "left": "0", "width": "1px", "height": "14px", "background": "var(--color-accent)", "animation": "noct-cue 2.4s cubic-bezier(.6,.05,.3,1) infinite" }}></span>
          </div>
        </div>
      </section>
      
      <section style={{ "position": "relative", "background": "var(--color-section)", "overflow": "hidden" }}>
        <div style={{ "position": "absolute", "left": "12%", "top": "-60%", "width": "520px", "height": "520px", "borderRadius": "50%", "background": "radial-gradient(circle, var(--color-section-glow), transparent 66%)", "pointerEvents": "none" }}></div>
        <div style={{ "position": "absolute", "right": "6%", "bottom": "-70%", "width": "420px", "height": "420px", "borderRadius": "50%", "background": "radial-gradient(circle, var(--color-section-ghost), transparent 68%)", "opacity": ".5", "pointerEvents": "none" }}></div>
        <div data-pad="" style={{ "position": "relative", "maxWidth": "1180px", "margin": "0 auto", "padding": "56px 32px", "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(min(100%,150px),1fr))", "gap": "clamp(20px,4vw,32px)" }}>
          <div data-reveal="">
            <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "clamp(38px,4.6vw,58px)", "lineHeight": "1", "letterSpacing": "-0.04em", "color": "var(--color-neutral-100)" }}>4+</div>
            <div style={{ "marginTop": "8px", "fontSize": "12.5px", "letterSpacing": ".1em", "textTransform": "uppercase", "color": "color-mix(in srgb, var(--color-neutral-100) 62%, transparent)" }}>Years of production Flutter</div>
          </div>
          <div data-reveal="" data-delay="0.07">
            <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "clamp(38px,4.6vw,58px)", "lineHeight": "1", "letterSpacing": "-0.04em", "color": "var(--color-neutral-100)" }}>11</div>
            <div style={{ "marginTop": "8px", "fontSize": "12.5px", "letterSpacing": ".1em", "textTransform": "uppercase", "color": "color-mix(in srgb, var(--color-neutral-100) 62%, transparent)" }}>Apps published to the stores</div>
          </div>
          <div data-reveal="" data-delay="0.14">
            <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "clamp(38px,4.6vw,58px)", "lineHeight": "1", "letterSpacing": "-0.04em", "color": "var(--color-neutral-100)" }}>2</div>
            <div style={{ "marginTop": "8px", "fontSize": "12.5px", "letterSpacing": ".1em", "textTransform": "uppercase", "color": "color-mix(in srgb, var(--color-neutral-100) 62%, transparent)" }}>Platforms from one codebase</div>
          </div>
          <div data-reveal="" data-delay="0.21">
            <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "clamp(38px,4.6vw,58px)", "lineHeight": "1", "letterSpacing": "-0.04em", "color": "var(--color-neutral-100)" }}>PG</div>
            <div style={{ "marginTop": "8px", "fontSize": "12.5px", "letterSpacing": ".1em", "textTransform": "uppercase", "color": "color-mix(in srgb, var(--color-neutral-100) 62%, transparent)" }}>Cybersecurity, UT Austin</div>
          </div>
        </div>
      </section>
      
      <section data-pad="" id="approach" style={{ "position": "relative", "maxWidth": "1180px", "margin": "0 auto", "padding": "120px 32px", "scrollMarginTop": "70px" }}>
        <div data-reveal="" style={{ "display": "flex", "alignItems": "center", "gap": "12px", "marginBottom": "18px" }}>
          <span style={{ "width": "28px", "height": "2px", "background": "var(--color-accent)" }}></span>
          <span style={{ "fontSize": "11.5px", "letterSpacing": ".16em", "textTransform": "uppercase", "color": "var(--color-accent-300)" }}>Approach</span>
        </div>
        <h2 data-reveal="" data-delay="0.06" style={{ "fontSize": "clamp(30px,3.7vw,48px)", "letterSpacing": "-0.03em", "maxWidth": "20ch", "margin": "0 0 60px", "textWrap": "pretty" }}>Architecture first. The screen is the last thing I write.</h2>
      
        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(min(100%,320px),1fr))", "gap": "clamp(34px,5vw,56px)", "alignItems": "center" }}>
          <div data-reveal="" style={{ "perspective": "1400px", "display": "flex", "justifyContent": "center", "padding": "20px 0" }}>
            <div data-phone="" style={{ "position": "relative", "width": "264px", "height": "540px", "transformStyle": "preserve-3d", "transform": "rotateY(-24deg) rotateX(6deg)", "willChange": "transform" }}>
              <div style={{ "position": "absolute", "inset": "0", "borderRadius": "36px", "background": "var(--color-neutral-900)", "transform": "translateZ(-7px)" }}></div>
              <div style={{ "position": "absolute", "inset": "0", "borderRadius": "36px", "background": "var(--color-neutral-900)", "transform": "translateZ(-5px)" }}></div>
              <div style={{ "position": "absolute", "inset": "0", "borderRadius": "36px", "background": "var(--color-neutral-800)", "transform": "translateZ(-3px)" }}></div>
              <div style={{ "position": "absolute", "inset": "0", "borderRadius": "36px", "background": "var(--color-neutral-800)", "transform": "translateZ(-1px)" }}></div>
              <div style={{ "position": "absolute", "inset": "0", "borderRadius": "36px", "background": "var(--color-neutral-800)", "transform": "translateZ(1px)" }}></div>
              <div style={{ "position": "absolute", "inset": "0", "borderRadius": "36px", "background": "var(--color-neutral-700)", "transform": "translateZ(3px)" }}></div>
              <div style={{ "position": "absolute", "inset": "0", "borderRadius": "36px", "background": "var(--color-neutral-700)", "transform": "translateZ(5px)" }}></div>
              <div style={{ "position": "absolute", "inset": "0", "borderRadius": "36px", "background": "linear-gradient(140deg, var(--color-neutral-600), var(--color-neutral-800))", "transform": "translateZ(6.5px)" }}></div>
      
              <div style={{ "position": "absolute", "inset": "5px", "borderRadius": "32px", "background": "#0f111c", "transform": "translateZ(8px)", "overflow": "hidden", "boxShadow": "inset 0 0 0 1px var(--color-neutral-800)" }}>
                <div style={{ "position": "absolute", "inset": "0", "background": "linear-gradient(160deg, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 46%)", "pointerEvents": "none" }}></div>
                <div style={{ "position": "absolute", "left": "0", "right": "0", "top": "0", "height": "34%", "background": "radial-gradient(120% 100% at 20% 0%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 70%)", "pointerEvents": "none" }}></div>
      
                <div style={{ "position": "relative", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "14px 18px 0", "fontSize": "9.5px", "letterSpacing": ".06em", "color": "var(--color-neutral-400)" }}>
                  <span>9:41</span>
                  <span style={{ "display": "flex", "gap": "5px", "alignItems": "center" }}><i className="ph ph-wifi-high" style={{ "fontSize": "11px" }}></i><i className="ph ph-battery-full" style={{ "fontSize": "11px" }}></i></span>
                </div>
      
                <div style={{ "position": "relative", "padding": "26px 18px 0" }}>
                  <div style={{ "fontSize": "10px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)" }}>Portfolio</div>
                  <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "26px", "letterSpacing": "-0.03em", "marginTop": "6px", "color": "var(--color-neutral-100)" }}>₦482,900</div>
                  <div style={{ "fontSize": "10px", "color": "var(--color-neutral-500)", "marginTop": "3px" }}>+ 12.4% this month</div>
                </div>
      
                <div style={{ "position": "relative", "display": "flex", "alignItems": "flex-end", "gap": "6px", "height": "78px", "padding": "18px 18px 0" }}>
                  <span style={{ "flex": "1", "height": "34%", "borderRadius": "3px", "background": "var(--color-accent-800)" }}></span>
                  <span style={{ "flex": "1", "height": "58%", "borderRadius": "3px", "background": "var(--color-accent-700)" }}></span>
                  <span style={{ "flex": "1", "height": "44%", "borderRadius": "3px", "background": "var(--color-accent-800)" }}></span>
                  <span style={{ "flex": "1", "height": "82%", "borderRadius": "3px", "background": "var(--color-accent-500)" }}></span>
                  <span style={{ "flex": "1", "height": "62%", "borderRadius": "3px", "background": "var(--color-accent-700)" }}></span>
                  <span style={{ "flex": "1", "height": "48%", "borderRadius": "3px", "background": "var(--color-accent-800)" }}></span>
                  <span style={{ "flex": "1", "height": "70%", "borderRadius": "3px", "background": "var(--color-accent-700)" }}></span>
                </div>
      
                <div style={{ "position": "relative", "padding": "22px 18px 0", "display": "flex", "flexDirection": "column", "gap": "9px" }}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "9px 11px", "borderRadius": "10px", "background": "var(--color-surface)", "boxShadow": "inset 0 0 0 1px var(--color-neutral-800)" }}>
                    <span style={{ "width": "22px", "height": "22px", "borderRadius": "7px", "background": "var(--color-accent-800)", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><i className="ph ph-arrow-up-right" style={{ "fontSize": "11px", "color": "var(--color-accent-300)" }}></i></span>
                    <span style={{ "flex": "1" }}><span style={{ "display": "block", "fontSize": "10.5px", "color": "var(--color-neutral-200)" }}>Transfer sent</span><span style={{ "display": "block", "fontSize": "9px", "color": "var(--color-neutral-600)" }}>Today · 14:02</span></span>
                    <span style={{ "fontSize": "10.5px", "color": "var(--color-neutral-300)" }}>−₦12,000</span>
                  </div>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "9px 11px", "borderRadius": "10px", "background": "var(--color-surface)", "boxShadow": "inset 0 0 0 1px var(--color-neutral-800)" }}>
                    <span style={{ "width": "22px", "height": "22px", "borderRadius": "7px", "background": "var(--color-accent-800)", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><i className="ph ph-arrow-down-left" style={{ "fontSize": "11px", "color": "var(--color-accent-300)" }}></i></span>
                    <span style={{ "flex": "1" }}><span style={{ "display": "block", "fontSize": "10.5px", "color": "var(--color-neutral-200)" }}>Payout received</span><span style={{ "display": "block", "fontSize": "9px", "color": "var(--color-neutral-600)" }}>Yesterday</span></span>
                    <span style={{ "fontSize": "10.5px", "color": "var(--color-accent-300)" }}>+₦96,500</span>
                  </div>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "9px 11px", "borderRadius": "10px", "background": "var(--color-surface)", "boxShadow": "inset 0 0 0 1px var(--color-neutral-800)" }}>
                    <span style={{ "width": "22px", "height": "22px", "borderRadius": "7px", "background": "var(--color-accent-800)", "display": "flex", "alignItems": "center", "justifyContent": "center" }}><i className="ph ph-shield-check" style={{ "fontSize": "11px", "color": "var(--color-accent-300)" }}></i></span>
                    <span style={{ "flex": "1" }}><span style={{ "display": "block", "fontSize": "10.5px", "color": "var(--color-neutral-200)" }}>Device verified</span><span style={{ "display": "block", "fontSize": "9px", "color": "var(--color-neutral-600)" }}>Biometric</span></span>
                  </div>
                </div>
      
                <div style={{ "position": "absolute", "left": "14px", "right": "14px", "bottom": "12px", "display": "flex", "justifyContent": "space-around", "padding": "10px 0", "borderRadius": "14px", "background": "color-mix(in srgb, var(--color-surface) 88%, transparent)", "boxShadow": "inset 0 0 0 1px var(--color-neutral-800)" }}>
                  <i className="ph ph-house" style={{ "fontSize": "15px", "color": "var(--color-accent)" }}></i>
                  <i className="ph ph-chart-line" style={{ "fontSize": "15px", "color": "var(--color-neutral-600)" }}></i>
                  <i className="ph ph-arrows-left-right" style={{ "fontSize": "15px", "color": "var(--color-neutral-600)" }}></i>
                  <i className="ph ph-user" style={{ "fontSize": "15px", "color": "var(--color-neutral-600)" }}></i>
                </div>
      
                <div style={{ "position": "absolute", "left": "0", "right": "0", "top": "0", "height": "44%", "background": "linear-gradient(to bottom, color-mix(in srgb, var(--color-accent) 9%, transparent), transparent)", "animation": "noct-sweep 6.5s linear infinite", "pointerEvents": "none" }}></div>
              </div>
      
              <div style={{ "position": "absolute", "left": "50%", "top": "12px", "transform": "translateX(-50%) translateZ(9px)", "width": "76px", "height": "19px", "borderRadius": "12px", "background": "#0b0d16" }}></div>
            </div>
          </div>
      
          <div>
            <div data-reveal="" data-delay="0.08" style={{ "borderRadius": "var(--radius-lg)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-md)", "overflow": "hidden" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "8px", "padding": "11px 14px", "borderBottom": "1px solid var(--color-divider)" }}>
                <span style={{ "width": "9px", "height": "9px", "borderRadius": "50%", "background": "var(--color-neutral-700)" }}></span>
                <span style={{ "width": "9px", "height": "9px", "borderRadius": "50%", "background": "var(--color-neutral-700)" }}></span>
                <span style={{ "width": "9px", "height": "9px", "borderRadius": "50%", "background": "var(--color-accent-700)" }}></span>
                <span style={{ "marginLeft": "8px", "fontSize": "11px", "letterSpacing": ".06em", "color": "var(--color-neutral-600)", "fontFamily": "ui-monospace,SFMono-Regular,Menlo,monospace" }}>checkout_bloc.dart</span>
              </div>
              <pre data-type="" style={{ "margin": "0", "padding": "20px 18px 24px", "fontFamily": "ui-monospace,SFMono-Regular,Menlo,monospace", "fontSize": "12.5px", "lineHeight": "1.75", "color": "var(--color-neutral-500)", "whiteSpace": "pre-wrap", "minHeight": "330px", "overflow": "hidden" }}></pre>
            </div>
      
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(min(100%,210px),1fr))", "gap": "14px", "marginTop": "22px" }}>
              <div data-reveal="" data-delay="0.12" data-tilt="5" style={{ "position": "relative", "padding": "18px", "borderRadius": "var(--radius-md)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
                <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
                <i className="ph ph-stack" style={{ "fontSize": "19px", "color": "var(--color-accent)" }}></i>
                <div style={{ "marginTop": "10px", "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>Feature-first modules</div>
                <p style={{ "margin": "6px 0 0", "fontSize": "13px", "lineHeight": "1.6", "color": "var(--color-neutral-500)" }}>Repository pattern, GetIt injection, Either for failures. Features stay replaceable.</p>
              </div>
              <div data-reveal="" data-delay="0.18" data-tilt="5" style={{ "position": "relative", "padding": "18px", "borderRadius": "var(--radius-md)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
                <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
                <i className="ph ph-gauge" style={{ "fontSize": "19px", "color": "var(--color-accent)" }}></i>
                <div style={{ "marginTop": "10px", "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>Rebuilds you can measure</div>
                <p style={{ "margin": "6px 0 0", "fontSize": "13px", "lineHeight": "1.6", "color": "var(--color-neutral-500)" }}>Memory profiling, lazy loading and selective rebuilds before anything ships.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section data-pad="" id="stack" style={{ "position": "relative", "maxWidth": "1180px", "margin": "0 auto", "padding": "20px 32px 120px", "scrollMarginTop": "70px" }}>
        <div data-reveal="" style={{ "display": "flex", "alignItems": "center", "gap": "12px", "marginBottom": "18px" }}>
          <span style={{ "width": "28px", "height": "2px", "background": "var(--color-accent)" }}></span>
          <span style={{ "fontSize": "11.5px", "letterSpacing": ".16em", "textTransform": "uppercase", "color": "var(--color-accent-300)" }}>Stack</span>
        </div>
        <h2 data-reveal="" data-delay="0.06" style={{ "fontSize": "clamp(30px,3.7vw,48px)", "letterSpacing": "-0.03em", "maxWidth": "18ch", "margin": "0 0 10px", "textWrap": "pretty" }}>Everything I reach for.</h2>
        <p data-reveal="" data-delay="0.1" style={{ "maxWidth": "54ch", "color": "var(--color-neutral-500)", "fontSize": "15.5px", "lineHeight": "1.65", "margin": "0 0 20px" }}>Hover the ring to hold it still.</p>
      
        <div data-orbit="" style={{ "position": "relative", "height": "220px", "margin": "0 0 56px", "perspective": "900px" }}>
          <div style={{ "position": "absolute", "left": "50%", "top": "50%", "transform": "translate(-50%,-50%)", "width": "74px", "height": "74px", "transformStyle": "preserve-3d", "animation": "noct-spin3d 14s linear infinite" }}>
            <span style={{ "position": "absolute", "inset": "0", "border": "1px solid color-mix(in srgb, var(--color-accent) 55%, transparent)", "borderRadius": "var(--radius-sm)", "transform": "translateZ(37px)" }}></span>
            <span style={{ "position": "absolute", "inset": "0", "border": "1px solid color-mix(in srgb, var(--color-accent) 28%, transparent)", "borderRadius": "var(--radius-sm)", "transform": "translateZ(-37px)" }}></span>
            <span style={{ "position": "absolute", "inset": "0", "border": "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)", "borderRadius": "var(--radius-sm)", "transform": "rotateY(90deg) translateZ(37px)" }}></span>
            <span style={{ "position": "absolute", "inset": "0", "border": "1px solid color-mix(in srgb, var(--color-accent) 40%, transparent)", "borderRadius": "var(--radius-sm)", "transform": "rotateY(-90deg) translateZ(37px)" }}></span>
            <span style={{ "position": "absolute", "inset": "0", "border": "1px solid color-mix(in srgb, var(--color-accent) 22%, transparent)", "borderRadius": "var(--radius-sm)", "transform": "rotateX(90deg) translateZ(37px)" }}></span>
            <span style={{ "position": "absolute", "inset": "0", "border": "1px solid color-mix(in srgb, var(--color-accent) 22%, transparent)", "borderRadius": "var(--radius-sm)", "transform": "rotateX(-90deg) translateZ(37px)" }}></span>
          </div>
          <div style={{ "position": "absolute", "left": "50%", "top": "50%", "transform": "translate(-50%,-50%)", "width": "260px", "height": "260px", "borderRadius": "50%", "background": "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 12%, transparent), transparent 62%)", "pointerEvents": "none" }}></div>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Flutter</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Dart</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>BLoC</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Riverpod</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Firebase</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Socket.io</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Supabase</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Dio</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Kotlin</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Swift</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Unity</span>
          <span data-orbit-item="" style={{ "position": "absolute", "left": "50%", "top": "50%", "whiteSpace": "nowrap", "fontSize": "13px", "fontFamily": "var(--font-heading)", "padding": "6px 13px", "borderRadius": "999px", "border": "1px solid var(--color-divider)", "background": "var(--color-surface)" }}>Codemagic</span>
        </div>
      
        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(min(100%,250px),1fr))", "gap": "14px" }}>
          <div data-reveal="" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>Architecture</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">Clean Architecture</span><span className="tag tag-neutral">Feature-first</span><span className="tag tag-neutral">Repository</span><span className="tag tag-neutral">GetIt</span><span className="tag tag-neutral">SOLID</span></div>
          </div>
          <div data-reveal="" data-delay="0.05" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>State management</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">BLoC / Cubit</span><span className="tag tag-neutral">Riverpod</span><span className="tag tag-neutral">GetX</span><span className="tag tag-neutral">Dartz</span><span className="tag tag-neutral">Equatable</span></div>
          </div>
          <div data-reveal="" data-delay="0.1" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>UI &amp; design systems</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">Pixel-perfect Figma</span><span className="tag tag-neutral">Widget libraries</span><span className="tag tag-neutral">flutter_screenutil</span><span className="tag tag-neutral">Custom animations</span></div>
          </div>
          <div data-reveal="" data-delay="0.15" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>Backend &amp; real-time</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">REST</span><span className="tag tag-neutral">Dio</span><span className="tag tag-neutral">Socket.io</span><span className="tag tag-neutral">Firebase FCM / Auth</span><span className="tag tag-neutral">Supabase</span><span className="tag tag-neutral">PostgreSQL RPC</span></div>
          </div>
          <div data-reveal="" data-delay="0.2" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>Native &amp; platform</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">MethodChannel</span><span className="tag tag-neutral">Kotlin / Swift bridging</span><span className="tag tag-neutral">Deep links</span><span className="tag tag-neutral">App Links</span><span className="tag tag-neutral">Unity</span></div>
          </div>
          <div data-reveal="" data-delay="0.25" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>Performance &amp; quality</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">Rebuild minimisation</span><span className="tag tag-neutral">Memory profiling</span><span className="tag tag-neutral">Unit &amp; integration tests</span><span className="tag tag-neutral">Error monitoring</span></div>
          </div>
          <div data-reveal="" data-delay="0.3" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>DevOps &amp; release</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">GitHub Actions</span><span className="tag tag-neutral">Codemagic</span><span className="tag tag-neutral">CI/CD</span><span className="tag tag-neutral">App Store submission</span><span className="tag tag-neutral">Play Console</span></div>
          </div>
          <div data-reveal="" data-delay="0.35" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>Security</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">Secure auth</span><span className="tag tag-neutral">Token / refresh</span><span className="tag tag-neutral">RBAC</span><span className="tag tag-neutral">Cybersecurity fundamentals</span></div>
          </div>
          <div data-reveal="" data-delay="0.4" data-tilt="6" style={{ "position": "relative", "padding": "20px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <div style={{ "fontSize": "11px", "letterSpacing": ".14em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "marginBottom": "12px" }}>AI-augmented workflow</div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}><span className="tag tag-neutral">Claude Code</span><span className="tag tag-neutral">Test generation</span><span className="tag tag-neutral">Code review</span><span className="tag tag-neutral">Debugging</span></div>
          </div>
        </div>
      </section>
      
      <section data-pad="" id="experience" style={{ "position": "relative", "maxWidth": "1180px", "margin": "0 auto", "padding": "0 32px 120px", "scrollMarginTop": "70px" }}>
        <div data-reveal="" style={{ "display": "flex", "alignItems": "center", "gap": "12px", "marginBottom": "18px" }}>
          <span style={{ "width": "28px", "height": "2px", "background": "var(--color-accent)" }}></span>
          <span style={{ "fontSize": "11.5px", "letterSpacing": ".16em", "textTransform": "uppercase", "color": "var(--color-accent-300)" }}>Experience</span>
        </div>
        <h2 data-reveal="" data-delay="0.06" style={{ "fontSize": "clamp(30px,3.7vw,48px)", "letterSpacing": "-0.03em", "maxWidth": "18ch", "margin": "0 0 56px", "textWrap": "pretty" }}>Where the work happened.</h2>
      
        <div style={{ "position": "relative", "paddingLeft": "34px" }}>
          <span style={{ "position": "absolute", "left": "5px", "top": "6px", "bottom": "6px", "width": "1px", "background": "linear-gradient(to bottom, transparent, var(--color-neutral-800) 8%, var(--color-neutral-800) 92%, transparent)" }}></span>
      
          <article data-reveal="" style={{ "position": "relative", "paddingBottom": "44px" }}>
            <span style={{ "position": "absolute", "left": "-34px", "top": "7px", "width": "11px", "height": "11px", "borderRadius": "50%", "background": "var(--color-bg)", "border": "1px solid var(--color-accent)", "boxShadow": "0 0 0 4px var(--color-bg), 0 0 14px color-mix(in srgb, var(--color-accent) 60%, transparent)" }}></span>
            <div style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px" }}>
              <h3 style={{ "margin": "0", "fontSize": "22px", "letterSpacing": "-0.02em" }}>Flutter Developer <span style={{ "color": "var(--color-neutral-500)" }}>· TechMadeEazy</span></h3>
              <span style={{ "fontSize": "12px", "letterSpacing": ".08em", "textTransform": "uppercase", "color": "var(--color-accent-300)", "whiteSpace": "nowrap" }}>Oct 2025 — Present</span>
            </div>
            <ul style={{ "margin": "14px 0 0", "padding": "0", "listStyle": "none", "display": "flex", "flexDirection": "column", "gap": "9px", "maxWidth": "74ch" }}>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Architect cross-platform Flutter applications on Clean Architecture and modular, feature-based design.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Lead implementation of scalable BLoC architecture across complex, high-traffic user flows.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Optimise performance through rebuild reduction, memory profiling, lazy loading and rendering work.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Partner with designers and backend engineers to turn design systems into production experiences.</li>
            </ul>
          </article>
      
          <article data-reveal="" style={{ "position": "relative", "paddingBottom": "44px" }}>
            <span style={{ "position": "absolute", "left": "-34px", "top": "7px", "width": "11px", "height": "11px", "borderRadius": "50%", "background": "var(--color-bg)", "border": "1px solid var(--color-neutral-700)", "boxShadow": "0 0 0 4px var(--color-bg)" }}></span>
            <div style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px" }}>
              <h3 style={{ "margin": "0", "fontSize": "22px", "letterSpacing": "-0.02em" }}>Lead Flutter Developer <span style={{ "color": "var(--color-neutral-500)" }}>· Tek Haven Solution</span></h3>
              <span style={{ "fontSize": "12px", "letterSpacing": ".08em", "textTransform": "uppercase", "color": "var(--color-neutral-500)", "whiteSpace": "nowrap" }}>May 2024 — Dec 2025</span>
            </div>
            <ul style={{ "margin": "14px 0 0", "padding": "0", "listStyle": "none", "display": "flex", "flexDirection": "column", "gap": "9px", "maxWidth": "74ch" }}>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Built enterprise mobile applications with scalable API layers and reusable business logic.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Integrated Unity modules into Flutter for advanced interactive features.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Managed Android and iOS release cycles, coordinating QA and store deployment.</li>
            </ul>
          </article>
      
          <article data-reveal="" style={{ "position": "relative", "paddingBottom": "44px" }}>
            <span style={{ "position": "absolute", "left": "-34px", "top": "7px", "width": "11px", "height": "11px", "borderRadius": "50%", "background": "var(--color-bg)", "border": "1px solid var(--color-neutral-700)", "boxShadow": "0 0 0 4px var(--color-bg)" }}></span>
            <div style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px" }}>
              <h3 style={{ "margin": "0", "fontSize": "22px", "letterSpacing": "-0.02em" }}>Flutter Developer <span style={{ "color": "var(--color-neutral-500)" }}>· SMARTROB Technologies</span></h3>
              <span style={{ "fontSize": "12px", "letterSpacing": ".08em", "textTransform": "uppercase", "color": "var(--color-neutral-500)", "whiteSpace": "nowrap" }}>Jul 2025 — Dec 2025</span>
            </div>
            <ul style={{ "margin": "14px 0 0", "padding": "0", "listStyle": "none", "display": "flex", "flexDirection": "column", "gap": "9px", "maxWidth": "74ch" }}>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Set technical direction for feature work on Clean Architecture foundations.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Implemented secure authentication and role-based authorisation across the app.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Built background processing, push notification and deep-linking capabilities.</li>
            </ul>
          </article>
      
          <article data-reveal="" style={{ "position": "relative", "paddingBottom": "8px" }}>
            <span style={{ "position": "absolute", "left": "-34px", "top": "7px", "width": "11px", "height": "11px", "borderRadius": "50%", "background": "var(--color-bg)", "border": "1px solid var(--color-neutral-700)", "boxShadow": "0 0 0 4px var(--color-bg)" }}></span>
            <div style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px" }}>
              <h3 style={{ "margin": "0", "fontSize": "22px", "letterSpacing": "-0.02em" }}>Flutter Developer, Contract <span style={{ "color": "var(--color-neutral-500)" }}>· BuzinessHours</span></h3>
              <span style={{ "fontSize": "12px", "letterSpacing": ".08em", "textTransform": "uppercase", "color": "var(--color-neutral-500)", "whiteSpace": "nowrap" }}>Jun 2024 — Feb 2026</span>
            </div>
            <ul style={{ "margin": "14px 0 0", "padding": "0", "listStyle": "none", "display": "flex", "flexDirection": "column", "gap": "9px", "maxWidth": "74ch" }}>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Owned production Flutter features end-to-end for Android and iOS.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Built real-time messaging on Socket.io with Firebase Cloud Messaging and deep linking.</li>
              <li style={{ "position": "relative", "paddingLeft": "18px", "fontSize": "14.5px", "lineHeight": "1.62", "color": "var(--color-neutral-400)" }}><span style={{ "position": "absolute", "left": "0", "top": "9px", "width": "5px", "height": "1px", "background": "var(--color-accent)" }}></span>Delivered multiple releases to Google Play and the Apple App Store.</li>
            </ul>
          </article>
        </div>
      
        <div data-reveal="" style={{ "marginTop": "52px", "paddingTop": "34px", "borderTop": "1px solid var(--color-divider)" }}>
          <div style={{ "fontSize": "11.5px", "letterSpacing": ".16em", "textTransform": "uppercase", "color": "var(--color-neutral-600)", "marginBottom": "20px" }}>Earlier</div>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(min(100%,250px),1fr))", "gap": "14px" }}>
            <div data-tilt="4" style={{ "position": "relative", "padding": "18px", "borderRadius": "var(--radius-md)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
              <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
              <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>Software Engineer Trainee</div>
              <div style={{ "fontSize": "13px", "color": "var(--color-neutral-500)", "marginTop": "2px" }}>SAIL Innovation Lab · Nov 2023 — Apr 2024</div>
              <p style={{ "margin": "10px 0 0", "fontSize": "13px", "lineHeight": "1.6", "color": "var(--color-neutral-500)" }}>React.js, TypeScript and third-party API integration inside Agile teams.</p>
            </div>
            <div data-tilt="4" style={{ "position": "relative", "padding": "18px", "borderRadius": "var(--radius-md)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
              <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
              <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>Flutter Developer</div>
              <div style={{ "fontSize": "13px", "color": "var(--color-neutral-500)", "marginTop": "2px" }}>BerryStamp · Oct 2023 — May 2024</div>
              <p style={{ "margin": "10px 0 0", "fontSize": "13px", "lineHeight": "1.6", "color": "var(--color-neutral-500)" }}>Design and development alongside the engineering team; led the team in the manager's absence.</p>
            </div>
            <div data-tilt="4" style={{ "position": "relative", "padding": "18px", "borderRadius": "var(--radius-md)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
              <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
              <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>Flutter Developer</div>
              <div style={{ "fontSize": "13px", "color": "var(--color-neutral-500)", "marginTop": "2px" }}>Eonace · Feb 2023 — Aug 2023</div>
              <p style={{ "margin": "10px 0 0", "fontSize": "13px", "lineHeight": "1.6", "color": "var(--color-neutral-500)" }}>Cross-platform UI, push notifications, data sync and RESTful APIs through to store release.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section data-pad="" id="work" style={{ "position": "relative", "maxWidth": "1180px", "margin": "0 auto", "padding": "0 32px 120px", "scrollMarginTop": "70px" }}>
        <div data-reveal="" style={{ "display": "flex", "alignItems": "center", "gap": "12px", "marginBottom": "18px" }}>
          <span style={{ "width": "28px", "height": "2px", "background": "var(--color-accent)" }}></span>
          <span style={{ "fontSize": "11.5px", "letterSpacing": ".16em", "textTransform": "uppercase", "color": "var(--color-accent-300)" }}>Published work</span>
        </div>
        <div data-reveal="" data-delay="0.06" style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "flex-end", "justifyContent": "space-between", "gap": "20px", "marginBottom": "48px" }}>
          <h2 style={{ "fontSize": "clamp(30px,3.7vw,48px)", "letterSpacing": "-0.03em", "maxWidth": "16ch", "margin": "0", "textWrap": "pretty" }}>Eleven apps, live.</h2>
          <p style={{ "margin": "0", "maxWidth": "40ch", "fontSize": "15px", "lineHeight": "1.65", "color": "var(--color-neutral-500)" }}>On the App Store and Google Play — remittance, crypto, commerce, learning and real-time sports.</p>
        </div><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "18px" }}>
            {apps.map((app, i) => (
              <AppCard key={app.slug} app={app} delay={i * 0.05} onOpen={() => setActive(app)} />
            ))}
          </div>
      
        
      </section>
      
      <section data-pad="" id="education" style={{ "position": "relative", "maxWidth": "1180px", "margin": "0 auto", "padding": "0 32px 120px", "scrollMarginTop": "70px" }}>
        <div data-reveal="" style={{ "display": "flex", "alignItems": "center", "gap": "12px", "marginBottom": "18px" }}>
          <span style={{ "width": "28px", "height": "2px", "background": "var(--color-accent)" }}></span>
          <span style={{ "fontSize": "11.5px", "letterSpacing": ".16em", "textTransform": "uppercase", "color": "var(--color-accent-300)" }}>Education &amp; certifications</span>
        </div>
        <h2 data-reveal="" data-delay="0.06" style={{ "fontSize": "clamp(30px,3.7vw,48px)", "letterSpacing": "-0.03em", "maxWidth": "18ch", "margin": "0 0 48px", "textWrap": "pretty" }}>Formally trained, twice over.</h2>
      
        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(min(100%,250px),1fr))", "gap": "14px", "marginBottom": "14px" }}>
          <div data-reveal="" data-tilt="5" style={{ "position": "relative", "padding": "22px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <i className="ph ph-shield-check" style={{ "fontSize": "20px", "color": "var(--color-accent)" }}></i>
            <div style={{ "marginTop": "14px", "fontSize": "11.5px", "letterSpacing": ".1em", "textTransform": "uppercase", "color": "var(--color-neutral-600)" }}>2023 — 2024</div>
            <div style={{ "marginTop": "6px", "fontFamily": "var(--font-heading)", "fontSize": "18px", "letterSpacing": "-0.015em" }}>The University of Texas at Austin</div>
            <div style={{ "marginTop": "4px", "fontSize": "14px", "color": "var(--color-neutral-500)" }}>Postgraduate Degree, Cybersecurity</div>
          </div>
          <div data-reveal="" data-delay="0.07" data-tilt="5" style={{ "position": "relative", "padding": "22px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <i className="ph ph-graduation-cap" style={{ "fontSize": "20px", "color": "var(--color-accent)" }}></i>
            <div style={{ "marginTop": "14px", "fontSize": "11.5px", "letterSpacing": ".1em", "textTransform": "uppercase", "color": "var(--color-neutral-600)" }}>2022 — 2023</div>
            <div style={{ "marginTop": "6px", "fontFamily": "var(--font-heading)", "fontSize": "18px", "letterSpacing": "-0.015em" }}>Middlesex University</div>
            <div style={{ "marginTop": "4px", "fontSize": "14px", "color": "var(--color-neutral-500)" }}>BSc, Information Technology</div>
          </div>
          <div data-reveal="" data-delay="0.14" data-tilt="5" style={{ "position": "relative", "padding": "22px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "overflow": "hidden" }}>
            <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
            <i className="ph ph-code" style={{ "fontSize": "20px", "color": "var(--color-accent)" }}></i>
            <div style={{ "marginTop": "14px", "fontSize": "11.5px", "letterSpacing": ".1em", "textTransform": "uppercase", "color": "var(--color-neutral-600)" }}>2019 — 2021</div>
            <div style={{ "marginTop": "6px", "fontFamily": "var(--font-heading)", "fontSize": "18px", "letterSpacing": "-0.015em" }}>Aptech Learning</div>
            <div style={{ "marginTop": "4px", "fontSize": "14px", "color": "var(--color-neutral-500)" }}>Diploma, Computer Software Engineering</div>
          </div>
        </div>
      
        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(min(100%,280px),1fr))", "gap": "14px" }}>
          <div data-reveal="" style={{ "display": "flex", "gap": "14px", "alignItems": "flex-start", "padding": "18px 20px", "borderRadius": "var(--radius-md)", "boxShadow": "var(--shadow-sm)" }}>
            <i className="ph ph-certificate" style={{ "fontSize": "19px", "color": "var(--color-accent)", "marginTop": "2px" }}></i>
            <div>
              <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>Flutter &amp; Dart — The Complete Guide</div>
              <div style={{ "fontSize": "12.5px", "color": "var(--color-neutral-600)", "marginTop": "3px", "fontFamily": "ui-monospace,SFMono-Regular,Menlo,monospace" }}>Udemy · UC-668ce235-eb4f-4bcb-b508-bb78d06200c4</div>
            </div>
          </div>
          <div data-reveal="" data-delay="0.07" style={{ "display": "flex", "gap": "14px", "alignItems": "flex-start", "padding": "18px 20px", "borderRadius": "var(--radius-md)", "boxShadow": "var(--shadow-sm)" }}>
            <i className="ph ph-certificate" style={{ "fontSize": "19px", "color": "var(--color-accent)", "marginTop": "2px" }}></i>
            <div>
              <div style={{ "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>Foundations of Cybersecurity</div>
              <div style={{ "fontSize": "12.5px", "color": "var(--color-neutral-600)", "marginTop": "3px", "fontFamily": "ui-monospace,SFMono-Regular,Menlo,monospace" }}>Coursera · 3QBCP5W3J2JG</div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="contact" style={{ "position": "relative", "overflow": "hidden", "scrollMarginTop": "70px" }}>
        <canvas data-contact-canvas="" style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "display": "block", "opacity": ".5" }}></canvas>
        <div style={{ "position": "absolute", "inset": "0", "background": "linear-gradient(to bottom, var(--color-bg), transparent 30%, transparent 70%, var(--color-bg))", "pointerEvents": "none" }}></div>
        <div data-pad="" style={{ "position": "relative", "maxWidth": "1180px", "margin": "0 auto", "padding": "110px 32px 120px" }}>
          <div data-reveal="" style={{ "display": "flex", "alignItems": "center", "gap": "12px", "marginBottom": "18px" }}>
            <span style={{ "width": "28px", "height": "2px", "background": "var(--color-accent)" }}></span>
            <span style={{ "fontSize": "11.5px", "letterSpacing": ".16em", "textTransform": "uppercase", "color": "var(--color-accent-300)" }}>Contact</span>
          </div>
          <h2 data-reveal="" data-delay="0.06" style={{ "fontSize": "clamp(34px,5vw,64px)", "letterSpacing": "-0.035em", "maxWidth": "16ch", "margin": "0 0 20px", "textWrap": "pretty" }}>Have something that needs shipping?</h2>
          <p data-reveal="" data-delay="0.1" style={{ "maxWidth": "48ch", "fontSize": "16px", "lineHeight": "1.65", "color": "var(--color-neutral-500)", "margin": "0 0 44px" }}>Open to senior Flutter roles, mobile leadership, and contract work. Fastest by email.</p>
      
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit,minmax(min(100%,230px),1fr))", "gap": "14px", "maxWidth": "960px" }}>
            <a data-reveal="" data-tilt="6" data-magnet="" href="mailto:dadeshina4@gmail.com" style={{ "position": "relative", "display": "block", "padding": "22px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "textDecoration": "none", "color": "var(--color-text)", "overflow": "hidden" }}>
              <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
              <i className="ph ph-envelope-simple" style={{ "fontSize": "21px", "color": "var(--color-accent)" }}></i>
              <div style={{ "marginTop": "14px", "fontSize": "11.5px", "letterSpacing": ".12em", "textTransform": "uppercase", "color": "var(--color-neutral-600)" }}>Email</div>
              <div style={{ "marginTop": "4px", "fontFamily": "var(--font-heading)", "fontSize": "15px", "wordBreak": "break-all" }}>dadeshina4@gmail.com</div>
            </a>
            <a data-reveal="" data-delay="0.06" data-tilt="6" data-magnet="" href="tel:+2348165168979" style={{ "position": "relative", "display": "none", "padding": "22px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "textDecoration": "none", "color": "var(--color-text)", "overflow": "hidden" }}>
              <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
              <i className="ph ph-phone" style={{ "fontSize": "21px", "color": "var(--color-accent)" }}></i>
              <div style={{ "marginTop": "14px", "fontSize": "11.5px", "letterSpacing": ".12em", "textTransform": "uppercase", "color": "var(--color-neutral-600)" }}>Phone</div>
              <div style={{ "marginTop": "4px", "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>+234 816 516 8979</div>
            </a>
            <a data-reveal="" data-delay="0.12" data-tilt="6" data-magnet="" href="https://linkedin.com/in/dadeshina4" target="_blank" rel="noopener noreferrer" style={{ "position": "relative", "display": "block", "padding": "22px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "textDecoration": "none", "color": "var(--color-text)", "overflow": "hidden" }}>
              <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
              <i className="ph ph-linkedin-logo" style={{ "fontSize": "21px", "color": "var(--color-accent)" }}></i>
              <div style={{ "marginTop": "14px", "fontSize": "11.5px", "letterSpacing": ".12em", "textTransform": "uppercase", "color": "var(--color-neutral-600)" }}>LinkedIn</div>
              <div style={{ "marginTop": "4px", "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>in/dadeshina4</div>
            </a>
            <a data-reveal="" data-delay="0.18" data-tilt="6" data-magnet="" href="https://github.com/DarkShadow77" target="_blank" rel="noopener noreferrer" style={{ "position": "relative", "display": "block", "padding": "22px", "borderRadius": "var(--radius-md)", "background": "var(--color-surface)", "boxShadow": "var(--shadow-sm)", "textDecoration": "none", "color": "var(--color-text)", "overflow": "hidden" }}>
              <span data-glow="" style={{ "position": "absolute", "inset": "0", "opacity": "0", "transition": "opacity .3s ease", "pointerEvents": "none" }}></span>
              <i className="ph ph-github-logo" style={{ "fontSize": "21px", "color": "var(--color-accent)" }}></i>
              <div style={{ "marginTop": "14px", "fontSize": "11.5px", "letterSpacing": ".12em", "textTransform": "uppercase", "color": "var(--color-neutral-600)" }}>GitHub</div>
              <div style={{ "marginTop": "4px", "fontFamily": "var(--font-heading)", "fontSize": "15px" }}>DarkShadow77</div>
            </a>
          </div>
      
          <div data-reveal="" style={{ "marginTop": "34px" }}>
            <ResumeMenu label="Download the résumé" align="left" style={{ padding: "11px 22px", fontSize: "14.5px" }} />
          </div>
        </div>
      </section>
      
      <footer style={{ "position": "relative", "borderTop": "1px solid var(--color-divider)" }}>
        <div data-pad="" style={{ "maxWidth": "1180px", "margin": "0 auto", "padding": "26px 32px", "display": "flex", "flexWrap": "wrap", "alignItems": "center", "justifyContent": "space-between", "gap": "14px" }}>
          <span style={{ "fontSize": "12.5px", "color": "var(--color-neutral-600)" }}>David Adeshina — Flutter / Dart</span>
          <a href="#top" style={{ "fontSize": "12.5px", "letterSpacing": ".08em", "textTransform": "uppercase", "textDecoration": "none", "color": "var(--color-neutral-500)", "display": "inline-flex", "alignItems": "center", "gap": "6px" }}>Back to top<i className="ph ph-arrow-up" style={{ "fontSize": "13px" }}></i></a>
        </div>
      </footer>
      
      
      
      </div>
      <AppDialog app={active} onClose={() => setActive(null)} />
    </>
  );
}
