/* PropertyOS · glass3d.js
   Companion to glass3d.css. Load as the LAST script, after the main inline script.
   Adds: floating glass header, glass spheres, pointer parallax, 3D tilt with a
   moving specular highlight, and a gliding "lens" in the mobile dock.
   Touches no app logic. Safe to delete along with glass3d.css. */
(() => {
  const d = document, root = d.documentElement;
  const mq = q => matchMedia(q).matches;
  const reduce = mq('(prefers-reduced-motion: reduce)');
  const fine = mq('(hover: hover) and (pointer: fine)');

  root.classList.add('glass3d');

  /* 1. Header becomes a floating glass bar */
  const hd = d.querySelector('header');
  if (hd) {
    hd.classList.add('g');
    const sc = () => hd.classList.toggle('is-stuck', scrollY > 6);
    addEventListener('scroll', sc, { passive: true });
    sc();
  }

  /* 2. Glass spheres behind the UI (decorative) */
  const bl = d.querySelector('.bl');
  if (bl && !bl.querySelector('b')) {
    ['b1', 'b2', 'b3'].forEach(c => {
      const b = d.createElement('b');
      b.className = c;
      b.setAttribute('aria-hidden', 'true');
      bl.append(b);
    });
  }

  if (fine && !reduce) {
    /* 3. Pointer parallax for the background layers */
    let px = 0, py = 0, pf = 0;
    addEventListener('pointermove', e => {
      px = e.clientX / innerWidth * 2 - 1;
      py = e.clientY / innerHeight * 2 - 1;
      if (!pf) pf = requestAnimationFrame(() => {
        pf = 0;
        root.style.setProperty('--px', px.toFixed(3));
        root.style.setProperty('--py', py.toFixed(3));
      });
    }, { passive: true });

    /* 4. 3D tilt + specular highlight on glass surfaces inside the main view */
    let cur = null, rect = null, last = null, tf = 0;
    const inside = (r, e, p) => e.clientX > r.left - p && e.clientX < r.right + p && e.clientY > r.top - p && e.clientY < r.bottom + p;

    const release = el => {
      if (!el) return;
      el.classList.remove('is-tilt');
      ['--rx', '--ry', '--tx', '--ty'].forEach(k => el.style.removeProperty(k));
    };

    const apply = () => {
      tf = 0;
      if (!cur || !cur.isConnected || !rect || !last) return;
      const x = Math.min(1, Math.max(0, (last.clientX - rect.left) / rect.width));
      const y = Math.min(1, Math.max(0, (last.clientY - rect.top) / rect.height));
      /* big surfaces tilt less, small tiles tilt more */
      const m = Math.max(1.4, 7 * Math.min(1, 320 / Math.max(rect.width, rect.height)));
      const s = cur.style;
      s.setProperty('--rx', ((.5 - y) * 2 * m).toFixed(2) + 'deg');
      s.setProperty('--ry', ((x - .5) * 2 * m).toFixed(2) + 'deg');
      s.setProperty('--mx', (last.clientX - rect.left).toFixed(0) + 'px');
      s.setProperty('--my', (last.clientY - rect.top).toFixed(0) + 'px');
      s.setProperty('--tx', ((x - .5) * 2).toFixed(2));
      s.setProperty('--ty', ((y - .5) * 2).toFixed(2));
    };

    addEventListener('pointermove', e => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      last = e;
      /* hysteresis: a tilted card's edge moves, so stay on it a few px past its edge */
      if (cur && cur.isConnected && rect && inside(rect, e, 6)) {
        if (!tf) tf = requestAnimationFrame(apply);
        return;
      }
      const next = e.target.closest ? e.target.closest('.v .g') : null;
      if (next !== cur) {
        release(cur);
        cur = next;
        rect = cur ? cur.getBoundingClientRect() : null;
        if (cur) cur.classList.add('is-tilt');
      }
      if (cur && !tf) tf = requestAnimationFrame(apply);
    }, { passive: true });

    root.addEventListener('mouseleave', () => { release(cur); cur = rect = null; });
    addEventListener('scroll', () => { if (cur && cur.isConnected) rect = cur.getBoundingClientRect(); }, { passive: true });
  }

  /* 5. Dock lens glides between tabs instead of snapping.
     The app rebuilds #tb on every render, so we replay the move from the old position. */
  if (typeof window.render === 'function' && !reduce) {
    const orig = window.render;
    window.render = function () {
      const old = d.querySelector('#tb .lens');
      const from = old ? old.style.transform : '';
      const out = orig.apply(this, arguments);
      const lens = d.querySelector('#tb .lens');
      if (lens && from) {
        const to = lens.style.transform;
        if (from !== to) {
          lens.style.transition = 'none';
          lens.style.transform = from;
          lens.getBoundingClientRect();           /* commit the start frame */
          lens.style.transition = '';
          lens.style.transform = to;
        }
      }
      return out;
    };
  }
})();
