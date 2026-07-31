// Canvas, cursor and scroll-driven effects for the portfolio.
// Framework-agnostic: mount() attaches, unmount() removes every listener,
// observer and animation frame it created.

const CODE = `class CheckoutBloc extends Bloc<CheckoutEvent, CheckoutState> {
  CheckoutBloc(this._repo) : super(const CheckoutState.initial()) {
    on<CartSubmitted>(_onSubmit, transformer: droppable());
  }

  final CheckoutRepository _repo;

  Future<void> _onSubmit(CartSubmitted e, Emitter emit) async {
    emit(state.copyWith(status: Status.loading));

    final result = await _repo.submit(e.cart);

    result.fold(
      (failure) => emit(state.copyWith(status: Status.failed)),
      (order) => emit(state.copyWith(status: Status.paid, order: order)),
    );
  }
}`;

export default class PortfolioFX {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this._alive = false;
  }

  setProps(p) { this.props = p || {}; }


  get mode() { return this.props.heroMode || 'lattice'; }
  get calm() { return (this.props.motionLevel || 'full') === 'calm'; }



  mount() {
    this._alive = true;
    this._raf = [];
    this._abort = new AbortController();
    this._sig = this._abort.signal;
    this._gen = (window.__noctGen = (window.__noctGen || 0) + 1);
    document.querySelectorAll('[data-dfx]').forEach((el) => el.removeAttribute('data-dfx'));
    const run = () => {
      if (!this._alive) return;
      this.reveals(); this.pointerFx(); this.heroCanvas(); this.orbit();
      this.typer(); this.phoneScroll(); this.navFx(); this.contactCanvas();
      this.cursorFx(); this.detailsFx();
    };
    run();
    this._iv = setInterval(run, 400);
    setTimeout(() => clearInterval(this._iv), 9000);
  }


  unmount() {
    this._alive = false;
    clearInterval(this._iv);
    (this._loops || []).forEach((s) => cancelAnimationFrame(s.id));
    (this._ios || []).forEach((io) => io.disconnect());
    this._loops = []; this._ios = [];
    if (this._abort) this._abort.abort();
    if (this._io) { this._io.disconnect(); this._io = null; }
    const ns = document.getElementById('noct-nocursor');
    if (ns) ns.remove();
  }

  // Init guards live on the DOM, which survives a logic hot-reload; clear
  // them on every mount so each feature re-arms against the live instance.

  // True when this instance has not yet claimed the element this generation.
  claim(el) {
    if (!el || el.__gen === this._gen) return false;
    el.__gen = this._gen;
    return true;
  }

  on(target, type, fn, opts) {
    const o = Object.assign({}, opts || {});
    if (this._sig) o.signal = this._sig;
    target.addEventListener(type, fn, o);
  }


  accent() {
    const v = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
    return v || '#9184d9';
  }

  loop(fn, gate) {
    const gateEl = gate || this._gate;
    this._gate = null;
    const slot = { id: 0, on: !gateEl };
    this._loops = this._loops || [];
    this._loops.push(slot);
    if (gateEl) {
      const io = new IntersectionObserver((es) => { slot.on = es[0].isIntersecting; }, { rootMargin: '160px' });
      io.observe(gateEl);
      (this._ios = this._ios || []).push(io);
    }
    const step = () => {
      if (!this._alive) return;
      if (slot.on && !document.hidden) fn();
      slot.id = requestAnimationFrame(step);
    };
    step();
  }

  accentRGB() {
    if (this._acT === undefined || --this._acT < 0) {
      const a = this.accent();
      let r = 145, g = 132, b = 217;
      if (a[0] === '#') {
        const h = a.length === 4 ? a[1] + a[1] + a[2] + a[2] + a[3] + a[3] : a.slice(1, 7);
        r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
      }
      this._ac = [r, g, b]; this._acT = 40;
    }
    return this._ac;
  }

  /* ── cursor trail + click ripple ────────────────────────────── */
  cursorFx() {
    const cv = document.querySelector('[data-cursor-canvas]');
    const ring = document.querySelector('[data-cursor-ring]');
    if (!this.claim(cv)) return;
    cv.style.zIndex = '200';
    if (ring) {
      // The ring is positioned purely by transform, so its box origin must sit
      // at the viewport corner — a stray drag offset would shift every frame.
      ring.style.zIndex = '201';
      ring.style.position = 'fixed';
      ring.style.left = '0px';
      ring.style.top = '0px';
      ring.style.right = 'auto';
      ring.style.bottom = 'auto';
      ring.style.margin = '0';
      ring.style.boxSizing = 'border-box';
    }
    if (this.calm || window.matchMedia('(hover: none)').matches) {
      cv.style.display = 'none';
      if (ring) ring.style.display = 'none';
      return;
    }
    // The ring replaces the native pointer — but only once a frame has really
    // painted, so a stalled loop can never leave the user with no cursor.
    const hideNative = () => {
      if (document.getElementById('noct-nocursor')) return;
      const s = document.createElement('style');
      s.id = 'noct-nocursor';
      s.textContent = 'html,body,*,*::before,*::after{cursor:none !important}';
      document.head.appendChild(s);
    };
    const showNative = () => {
      const s = document.getElementById('noct-nocursor');
      if (s) s.remove();
    };
    showNative();
    const ctx = cv.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0;
    const size = () => {
      const r = cv.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    this.on(window, 'resize', size);

    const pts = [], rings = [], parts = [];
    let mx = -999, my = -999, rx = -999, ry = -999, hot = false;
    const TRAIL = 400;

    this.on(window, 'pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      pts.push({ x: mx, y: my, t: performance.now() });
      if (pts.length > 80) pts.shift();
      const t = e.target;
      hot = !!(t && t.closest && t.closest('a,button,[data-tilt],[data-orbit-item],image-slot'));
    }, { passive: true });

    this.on(window, 'pointerdown', (e) => {
      const now = performance.now();
      rings.push({ x: e.clientX, y: e.clientY, t: now });
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * 6.2832, s = 1.4 + Math.random() * 3.6;
        parts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: now });
      }
      if (ring) { ring.style.transition = 'none'; ring.__pop = now; }
    }, { passive: true });

    const track = (e) => {
      mx = e.clientX; my = e.clientY;
      if (rx < -100) { rx = mx; ry = my; }
    };
    this.on(document, 'pointerover', track, { passive: true });
    this.on(document, 'pointerenter', track, { passive: true });
    this.on(document, 'mousemove', track, { passive: true });
    this.on(document, 'pointerleave', (e) => {
      if (e.relatedTarget) return;
      mx = -999; my = -999;
    }, { passive: true });

    let painted = 0, cleared = false, hiddenForModal = false;
    this.loop(() => {
      // A dialog's backdrop-filter blur has to recomposite every frame this
      // canvas repaints above it — pausing here is what keeps that cheap.
      if (this.props.modalOpen) {
        if (!hiddenForModal) {
          hiddenForModal = true;
          cv.style.display = 'none';
          if (ring) ring.style.display = 'none';
          showNative();
        }
        return;
      }
      if (hiddenForModal) {
        hiddenForModal = false;
        painted = 0;
        cv.style.display = '';
        if (ring) ring.style.display = '';
      }
      const now = performance.now();
      const c = this.accentRGB(), cr = c[0], cg = c[1], cb = c[2];
      const idle = !pts.length && !rings.length && !parts.length;
      if (!idle || !cleared) { ctx.clearRect(0, 0, W, H); cleared = idle; }
      if (mx > -100) {
        if (++painted === 2) hideNative();
      } else if (painted < 2) {
        showNative();
      }

      while (pts.length && now - pts[0].t > TRAIL) pts.shift();
      ctx.lineCap = 'round';
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const age = (now - b.t) / TRAIL;
        const al = (1 - age) * (1 - age) * 0.6;
        if (al <= 0.008) continue;
        ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + al.toFixed(3) + ')';
        ctx.lineWidth = (1 - age) * 3.4 + 0.4;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      if (pts.length && mx > -100) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 26);
        g.addColorStop(0, 'rgba(' + cr + ',' + cg + ',' + cb + ',0.30)');
        g.addColorStop(1, 'rgba(' + cr + ',' + cg + ',' + cb + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(mx, my, 26, 0, 6.2832); ctx.fill();
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const p = (now - rings[i].t) / 640;
        if (p >= 1) { rings.splice(i, 1); continue; }
        const e = 1 - Math.pow(1 - p, 3);
        const r = 6 + e * 78;
        ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + ((1 - p) * 0.75).toFixed(3) + ')';
        ctx.lineWidth = (1 - p) * 2.2 + 0.3;
        ctx.beginPath(); ctx.arc(rings[i].x, rings[i].y, r, 0, 6.2832); ctx.stroke();
        ctx.strokeStyle = 'rgba(233,233,237,' + ((1 - p) * 0.22).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(rings[i].x, rings[i].y, r * 0.52, 0, 6.2832); ctx.stroke();
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i], p = (now - q.t) / 720;
        if (p >= 1) { parts.splice(i, 1); continue; }
        const e = 1 - Math.pow(1 - p, 2.4);
        const x = q.x + q.vx * e * 48, y = q.y + q.vy * e * 48 + p * p * 30;
        ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + ((1 - p) * 0.9).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(x, y, (1 - p) * 2.1 + 0.3, 0, 6.2832); ctx.fill();
      }

      rx = mx; ry = my;
      if (ring) {
        let s = hot ? 1.85 : 1;
        if (ring.__pop && now - ring.__pop < 260) s *= 1 + 0.55 * (1 - (now - ring.__pop) / 260);
        else if (ring.__pop) { ring.__pop = 0; ring.style.transition = 'opacity .3s ease,border-color .25s ease,background .25s ease'; }
        ring.style.transform = 'translate3d(' + (rx - 14).toFixed(1) + 'px,' + (ry - 14).toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
        ring.style.opacity = mx < -100 ? '0' : '1';
        ring.style.borderColor = hot ? 'var(--color-accent)' : 'color-mix(in srgb, var(--color-accent) 45%, transparent)';
        ring.style.background = hot ? 'color-mix(in srgb, var(--color-accent) 12%, transparent)' : 'transparent';
      }
    });
  }



  /* ── "Details" pill: idle drift + hover expand ──────────────── */
  detailsFx() {
    const pills = document.querySelectorAll('[data-details]:not([data-dfx])');
    if (!pills.length) return;
    const EASE = 'cubic-bezier(.16,.84,.28,1)';
    pills.forEach((pill) => {
      pill.setAttribute('data-dfx', '1');
      const card = pill.closest('[data-app]');
      const icon = pill.querySelector('i');
      pill.style.transition = 'transform .5s ' + EASE + ', background .35s ease, border-color .35s ease, color .35s ease, box-shadow .45s ease, padding .4s ' + EASE;
      pill.style.willChange = 'transform';
      if (icon) icon.style.transition = 'transform .5s ' + EASE;
      if (this.calm) return;
      // No hover on touch — the pill must read as an affordance at rest.
      if (window.matchMedia('(hover: none)').matches) { pill.style.opacity = '1'; return; }
      pill.style.transform = 'translateY(-4px)';
      pill.style.opacity = '0.72';
      if (!card) return;
      const on = () => {
        pill.style.transform = 'translateY(0) scale(1.06)';
        pill.style.opacity = '1';
        pill.style.padding = '5px 12px';
        pill.style.background = 'color-mix(in srgb, var(--color-accent) 22%, transparent)';
        pill.style.borderColor = 'var(--color-accent)';
        pill.style.color = 'var(--color-accent-100)';
        pill.style.boxShadow = '0 0 0 1px color-mix(in srgb, var(--color-accent) 35%, transparent), 0 6px 22px color-mix(in srgb, var(--color-accent) 30%, transparent)';
        if (icon) icon.style.transform = 'rotate(90deg) scale(1.15)';
      };
      // Restore the literal at-rest values rather than clearing to '' — the
      // pill's resting look comes from its inline style, so blanking those
      // properties leaves it smaller than it started.
      const off = () => {
        pill.style.transform = 'translateY(-4px)';
        pill.style.opacity = '0.72';
        pill.style.padding = '4px 9px';
        pill.style.background = 'color-mix(in srgb, var(--color-bg) 74%, transparent)';
        pill.style.borderColor = 'var(--color-divider)';
        pill.style.color = 'var(--color-neutral-400)';
        pill.style.boxShadow = 'none';
        if (icon) icon.style.transform = 'none';
      };
      this.on(card, 'pointerenter', on);
      this.on(card, 'pointerleave', off);
      this.on(card, 'pointerdown', () => {
        pill.style.transition = 'transform .12s linear';
        pill.style.transform = 'translateY(0) scale(.94)';
        setTimeout(() => {
          pill.style.transition = 'transform .5s ' + EASE + ', background .35s ease, border-color .35s ease, color .35s ease, box-shadow .45s ease, padding .4s ' + EASE;
          on();
        }, 130);
      });
    });
  }


  /* ── scroll reveals ─────────────────────────────────────────── */
  reveals() {
    if (!this._io) {
      this._io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          this._io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    }
    const show = (el) => { el.style.opacity = '1'; el.style.transform = 'none'; };
    document.querySelectorAll('[data-reveal]:not([data-rv])').forEach((el) => {
      el.setAttribute('data-rv', '1');
      const d = parseFloat(el.getAttribute('data-delay') || '0');
      el.style.willChange = 'opacity, transform';
      el.style.transition = 'opacity .9s cubic-bezier(.16,.84,.28,1) ' + d + 's, transform .9s cubic-bezier(.16,.84,.28,1) ' + d + 's';
      if (this.calm) { el.style.opacity = '1'; return; }
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        requestAnimationFrame(() => requestAnimationFrame(() => show(el)));
      } else {
        this._io.observe(el);
      }
    });
    if (document.body.__swGen !== this._gen) {
      document.body.__swGen = this._gen;
      const rescue = () => {
        if (!this._alive) return;
        document.querySelectorAll('[data-reveal]').forEach((el) => {
          if (getComputedStyle(el).opacity !== '0') return;
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) show(el);
          else if (el.getAttribute('data-rv')) this._io.observe(el);
        });
      };
      this.on(window, 'load', rescue);
      this.on(window, 'scroll', rescue, { passive: true });
      [600, 1200, 2400, 4000].forEach((ms) => setTimeout(rescue, ms));
    }
  }

  /* ── cursor tilt + glow + magnetic buttons ──────────────────── */
  pointerFx() {
    if (document.body.__pfxGen === this._gen) return;
    document.body.__pfxGen = this._gen;
    if (this.calm) return;
    const reset = (el) => {
      if (!el) return;
      el.style.transition = 'transform .55s cubic-bezier(.16,.84,.28,1)';
      el.style.transform = 'perspective(1000px)';
      const g = el.querySelector('[data-glow]');
      if (g) g.style.opacity = '0';
    };
    this.on(document, 'pointermove', (ev) => {
      if (ev.pointerType === 'touch') return;
      const t = ev.target;
      const card = t && t.closest ? t.closest('[data-tilt]') : null;
      if (this._card && this._card !== card) { reset(this._card); this._card = null; }
      if (card) {
        this._card = card;
        const r = card.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width;
        const py = (ev.clientY - r.top) / r.height;
        const max = parseFloat(card.getAttribute('data-tilt')) || 6;
        card.style.transition = 'transform .1s linear';
        card.style.transform = 'perspective(1000px) rotateY(' + ((px - 0.5) * max * 2).toFixed(2) + 'deg) rotateX(' + (-(py - 0.5) * max * 2).toFixed(2) + 'deg) translateZ(8px)';
        const g = card.querySelector('[data-glow]');
        if (g) {
          g.style.background = 'radial-gradient(360px circle at ' + (px * 100).toFixed(1) + '% ' + (py * 100).toFixed(1) + '%, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent 68%)';
          g.style.opacity = '1';
        }
      }

      const mag = t && t.closest ? t.closest('[data-magnet]') : null;
      if (this._mag && this._mag !== mag) {
        this._mag.style.transition = 'transform .5s cubic-bezier(.16,.84,.28,1)';
        this._mag.style.transform = 'translate(0,0)';
        this._mag = null;
      }
      if (mag) {
        this._mag = mag;
        const r = mag.getBoundingClientRect();
        const dx = (ev.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (ev.clientY - (r.top + r.height / 2)) / r.height;
        mag.style.transition = 'transform .12s linear';
        mag.style.transform = 'translate(' + (dx * 9).toFixed(1) + 'px,' + (dy * 9).toFixed(1) + 'px)';
      }
    }, { passive: true });
  }

  /* ── hero: 3D constellation / lattice ───────────────────────── */
  heroCanvas() {
    const c = document.querySelector('[data-hero-canvas]');
    if (!this.claim(c)) return;
    const ctx = c.getContext('2d');
    let W = 0, H = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      const r = c.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    this.on(window, 'resize', size);

    const N = Math.max(50, Math.min(300, this.props.heroDensity || 150));
    const pts = [];
    const gold = Math.PI * (1 + Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const th = gold * k;
      const rr = 0.72 + Math.random() * 0.42;
      pts.push({
        x: Math.cos(th) * Math.sin(phi) * rr,
        y: Math.sin(th) * Math.sin(phi) * rr,
        z: Math.cos(phi) * rr,
        s: 0.5 + Math.random() * 0.9,
      });
    }
    const G = 24, grid = [];
    for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) grid.push({ i: i, j: j, gx: (i / (G - 1) - 0.5) * 2.6, gz: (j / (G - 1) - 0.5) * 2.6 });

    let mx = 0, my = 0, tx = 0, ty = 0, t = 0;
    this.on(window, 'pointermove', (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const hex = () => {
      const a = this.accent();
      if (a[0] !== '#') return [145, 132, 217];
      const h = a.length === 4 ? a[1] + a[1] + a[2] + a[2] + a[3] + a[3] : a.slice(1, 7);
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    };
    let col = hex(), colT = 0;
    const speed = this.calm ? 0.25 : 1;
    this._gate = c;

    let glowSprite = null, glowKey = '';
    const makeGlow = () => {
      const S = 64, off = document.createElement('canvas');
      off.width = off.height = S;
      const g2 = off.getContext('2d');
      const rg = g2.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      rg.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0.4)');
      rg.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');
      g2.fillStyle = rg;
      g2.fillRect(0, 0, S, S);
      glowSprite = off; glowKey = col.join(',');
    };

    this.loop(() => {
      if (--colT < 0) { col = hex(); colT = 40; }
      t += 0.004 * speed;
      mx += (tx - mx) * 0.045; my += (ty - my) * 0.045;
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.5 + mx * 26, cy = H * 0.5 + my * 18;
      const R = Math.min(W, H) * 0.42;
      const f = 3.0;
      const cr = col[0], cg = col[1], cb = col[2];

      if (this.mode === 'lattice') {
        const lx = W * 0.60 + mx * 30, ly = H * 0.44 + my * 18;
        const LR = Math.max(W, H) * 0.44;
        const ry = t * 0.32 + mx * 0.3, rx = -0.58 + my * 0.14;
        const cB = Math.cos(rx), sB = Math.sin(rx), cA = Math.cos(ry), sA = Math.sin(ry);
        const P = [];
        for (let n = 0; n < grid.length; n++) {
          const p = grid[n];
          const wy = Math.sin(p.gx * 2.1 + t * 3.4) * Math.cos(p.gz * 1.9 - t * 2.6) * 0.3;
          const x1 = p.gx * cA + p.gz * sA, z1 = -p.gx * sA + p.gz * cA;
          const y1 = wy * cB - z1 * sB, z2 = wy * sB + z1 * cB;
          const sc = f / (f - z2 * 1.1);
          P.push({ X: lx + x1 * LR * sc, Y: ly + y1 * LR * sc, S: sc, h: wy });
        }
        ctx.lineWidth = 1;
        const line = (a, b) => {
          const al = Math.min(0.62, (0.17 + Math.max(0, a.S - 0.72) * 0.62) * (0.75 + Math.abs(a.h) * 1.5));
          ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + al.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.X, a.Y); ctx.lineTo(b.X, b.Y); ctx.stroke();
        };
        for (let i = 0; i < G; i++) for (let j = 0; j < G - 1; j++) line(P[i * G + j], P[i * G + j + 1]);
        for (let j = 0; j < G; j++) for (let i = 0; i < G - 1; i++) line(P[i * G + j], P[(i + 1) * G + j]);
        for (let n = 0; n < P.length; n++) {
          const p = P[n];
          if (p.h < 0.19) continue;
          const al = Math.min(0.92, (p.h - 0.19) * 6.5 * Math.min(1.1, p.S));
          ctx.fillStyle = 'rgba(233,233,237,' + al.toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(p.X, p.Y, 1.6 * p.S, 0, 6.2832); ctx.fill();
        }
        return;
      }

      const ry = t * 0.9 + mx * 0.4, rx = t * 0.35 + my * 0.3;
      const cA = Math.cos(ry), sA = Math.sin(ry), cB = Math.cos(rx), sB = Math.sin(rx);
      const P = [];
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const x1 = p.x * cA + p.z * sA, z1 = -p.x * sA + p.z * cA;
        const y1 = p.y * cB - z1 * sB, z2 = p.y * sB + z1 * cB;
        const sc = f / (f - z2);
        P.push({ X: cx + x1 * R * sc, Y: cy + y1 * R * sc, Z: z2, S: sc, s: p.s });
      }
      ctx.lineWidth = 1;
      const CELL = 123, ROW = 4096, OFF = 1024;
      const bins = new Map();
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (p.X < -160 || p.X > W + 160 || p.Y < -160 || p.Y > H + 160) continue;
        const key = (((p.X / CELL) | 0) + OFF) * ROW + (((p.Y / CELL) | 0) + OFF);
        const b = bins.get(key);
        if (b) b.push(i); else bins.set(key, [i]);
      }
      const NB = 6, ALMAX = 0.32, band = [];
      for (let k = 0; k < NB; k++) band.push([]);
      const NBR = [1, 0, -1, 1, 0, 1, 1, 1];
      bins.forEach((list, key) => {
        const gx = (key / ROW) | 0, gy = key - gx * ROW;
        for (let n = -1; n < 4; n++) {
          const other = n < 0 ? list : bins.get((gx + NBR[n * 2]) * ROW + (gy + NBR[n * 2 + 1]));
          if (!other) continue;
          for (let ii = 0; ii < list.length; ii++) {
            const a = P[list[ii]];
            for (let jj = n < 0 ? ii + 1 : 0; jj < other.length; jj++) {
              const b = P[other[jj]];
              const dx = a.X - b.X, dy = a.Y - b.Y, d2 = dx * dx + dy * dy;
              if (d2 > 15000) continue;
              const al = (1 - Math.sqrt(d2) / 122) * 0.3 * Math.max(0.15, a.S - 0.55);
              if (al <= 0.006) continue;
              const k = Math.min(NB - 1, ((al / ALMAX) * NB) | 0);
              band[k].push(a.X, a.Y, b.X, b.Y);
            }
          }
        }
      });
      for (let k = 0; k < NB; k++) {
        const s = band[k];
        if (!s.length) continue;
        ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (((k + 0.5) / NB) * ALMAX).toFixed(3) + ')';
        ctx.beginPath();
        for (let q = 0; q < s.length; q += 4) { ctx.moveTo(s[q], s[q + 1]); ctx.lineTo(s[q + 2], s[q + 3]); }
        ctx.stroke();
      }
      if (!glowSprite || glowKey !== col.join(',')) makeGlow();
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        const al = Math.max(0.05, Math.min(0.95, (p.S - 0.5) * 1.15));
        const rad = Math.max(0.5, p.s * p.S * 1.35);
        if (p.S > 1.1) {
          const d = rad * 14;
          ctx.globalAlpha = Math.min(1, al);
          ctx.drawImage(glowSprite, p.X - d / 2, p.Y - d / 2, d, d);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = 'rgba(233,233,237,' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(p.X, p.Y, rad, 0, 6.2832); ctx.fill();
      }
    });
  }

  /* ── contact section: drifting depth field ──────────────────── */
  contactCanvas() {
    const c = document.querySelector('[data-contact-canvas]');
    if (!this.claim(c)) return;
    const ctx = c.getContext('2d');
    let W = 0, H = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      const r = c.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    this.on(window, 'resize', size);
    const stars = [];
    for (let i = 0; i < 90; i++) stars.push({ x: Math.random(), y: Math.random(), z: 0.2 + Math.random() * 0.8, r: Math.random() * 1.4 + 0.3 });
    let t = 0;
    this._gate = c;
    this.loop(() => {
      t += this.calm ? 0.0006 : 0.0018;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const x = ((s.x + t * s.z) % 1) * W;
        const y = (s.y + Math.sin(t * 6 + i) * 0.006) * H;
        ctx.fillStyle = 'rgba(233,233,237,' + (s.z * 0.3).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(x, y, s.r * s.z, 0, 6.2832); ctx.fill();
      }
    });
  }

  /* ── orbiting tech ring ─────────────────────────────────────── */
  orbit() {
    const box = document.querySelector('[data-orbit]');
    if (!box) return;
    const items = Array.prototype.slice.call(box.querySelectorAll('[data-orbit-item]'));
    if (!items.length) return;
    if (!this.claim(box)) return;
    let a = 0, paused = false;
    this.on(box, 'pointerenter', () => { paused = true; });
    this.on(box, 'pointerleave', () => { paused = false; });
    const spd = this.calm ? 0.0016 : 0.005;
    this._gate = box;
    this.loop(() => {
      if (!paused) a += spd;
      const half = (items[0].offsetWidth || 80) / 2;
      const rx = Math.max(84, Math.min(box.clientWidth * 0.38, box.clientWidth / 2 - half - 4));
      for (let i = 0; i < items.length; i++) {
        const th = a + (i / items.length) * 6.2832;
        const x = Math.sin(th) * rx;
        const z = Math.cos(th);
        const d = (z + 1) / 2;
        const s = 0.6 + d * 0.55;
        const el = items[i];
        el.style.transform = 'translate(-50%,-50%) translate3d(' + x.toFixed(1) + 'px,' + (Math.cos(th * 2) * 34).toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
        el.style.opacity = (0.22 + d * 0.78).toFixed(3);
        el.style.zIndex = String(Math.round(d * 100));
        el.style.filter = z < 0 ? 'blur(' + (-z * 1.6).toFixed(2) + 'px)' : 'none';
        el.style.borderColor = d > 0.86 ? 'color-mix(in srgb, var(--color-accent) 60%, transparent)' : 'var(--color-divider)';
      }
    });
  }

  /* ── terminal typing ────────────────────────────────────────── */
  typer() {
    const el = document.querySelector('[data-type]');
    if (!this.claim(el)) return;
    const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const hl = (s) => esc(s)
      .replace(/\b(class|extends|final|const|await|async|void|super|this|return|required|late|new)\b/g, '<span style="color:var(--color-accent-400)">$1</span>')
      .replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, '<span style="color:var(--color-neutral-200)">$1</span>');
    const caret = '<span style="display:inline-block;width:7px;height:14px;background:var(--color-accent);vertical-align:-2px;animation:noct-caret 1s steps(1) infinite"></span>';
    let i = 0, started = false;
    const tick = () => {
      if (!this._alive) return;
      i = Math.min(CODE.length, i + 2);
      el.innerHTML = hl(CODE.slice(0, i)) + caret;
      if (i < CODE.length) setTimeout(tick, 22);
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !started) { started = true; io.disconnect(); setTimeout(tick, 240); }
      });
    }, { threshold: 0.2 });
    el.innerHTML = caret;
    io.observe(el);
  }

  /* ── scroll-scrubbed 3D phone ───────────────────────────────── */
  phoneScroll() {
    const el = document.querySelector('[data-phone]');
    if (!this.claim(el)) return;
    let target = 0, cur = 0, ticking = false;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const p = 1 - (r.top + r.height / 2) / (window.innerHeight + r.height / 2);
      target = Math.max(0, Math.min(1, p));
      ticking = false;
    };
    this.on(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(measure); } }, { passive: true });
    this.on(window, 'resize', measure);
    measure();
    this._gate = el;
    this.loop(() => {
      cur += (target - cur) * 0.07;
      const ry = -34 + cur * 58;
      const rx = 9 - cur * 15;
      el.style.transform = 'rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg) translateZ(0)';
    });
  }

  /* ── nav chrome + progress + scroll spy ─────────────────────── */
  navFx() {
    const nav = document.querySelector('[data-nav]');
    const bar = document.querySelector('[data-progress]');
    if (!nav || !this.claim(nav)) return;
    const links = Array.prototype.slice.call(document.querySelectorAll('[data-navlink]'));
    const onScroll = () => {
      const y = window.scrollY || 0;
      const on = y > 40;
      nav.style.background = on ? 'color-mix(in srgb, var(--color-bg) 82%, transparent)' : 'transparent';
      nav.style.backdropFilter = on ? 'blur(14px)' : 'none';
      nav.style.borderBottomColor = on ? 'var(--color-divider)' : 'transparent';
      if (bar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0).toFixed(2) + '%';
      }
      let active = null;
      links.forEach((a) => {
        const s = document.querySelector(a.getAttribute('href'));
        if (s && s.getBoundingClientRect().top <= window.innerHeight * 0.35) active = a;
      });
      links.forEach((a) => { a.style.color = a === active ? 'var(--color-text)' : 'var(--color-neutral-500)'; });
    };
    this.on(window, 'scroll', onScroll, { passive: true });
    onScroll();
  }
}
