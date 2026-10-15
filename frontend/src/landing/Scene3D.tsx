import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const INK = 0x141c2b, ACCENT = 0x2c4a8f;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/**
 * One coherent scroll story rendered with line work only (no fills, lights or textures):
 * 01 folded map enters -> 02 unfolds / camera moves -> 03 pins appear -> 04 route draws ->
 * 05 itinerary cards emerge -> 06 settles for the CTA.
 * Renders only while the eased progress is still changing (no idle rAF loop).
 */
export default function Scene3D() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    const disposables: { dispose: () => void }[] = [];
    const line = (color: number, opacity: number) => {
      const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      disposables.push(m);
      return m;
    };

    // Map sheet: grid + topographic contours; Y scale animates for the unfolding.
    const sheet = new THREE.Group();
    const grid = new THREE.GridHelper(10, 20, INK, INK);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.18;
    grid.rotation.x = Math.PI / 2;
    sheet.add(grid);
    for (let i = 1; i <= 5; i++) {
      const pts = Array.from({ length: 65 }, (_, k) => {
        const t = (k / 64) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(t) * (0.7 * i) * 1.2 + Math.sin(t * 3) * 0.12 * i - 1.2, Math.sin(t) * 0.55 * i + Math.cos(t * 2) * 0.1 * i, 0.01);
      });
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      disposables.push(g);
      sheet.add(new THREE.Line(g, line(INK, 0.22)));
    }
    scene.add(sheet);

    // Destinations + route.
    const spots = [[-3.2, -1.4], [-1.5, 1.6], [0.4, -0.6], [2.2, 1.3], [3.4, -1.2]].map(([x, y]) => new THREE.Vector3(x, y, 0));
    const pinGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.5, 4);
    pinGeo.rotateX(Math.PI / 2);
    disposables.push(pinGeo);
    const pinMat = line(ACCENT, 1);
    const pins = spots.map((s) => {
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(pinGeo), pinMat);
      edges.position.set(s.x, s.y, 0.25);
      edges.scale.setScalar(0.001);
      sheet.add(edges);
      return edges;
    });
    const curve = new THREE.CatmullRomCurve3(spots.map((s) => s.clone().setZ(0.02)), false, 'catmullrom', 0.4);
    const routeGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(200));
    disposables.push(routeGeo);
    const route = new THREE.Line(routeGeo, new THREE.LineBasicMaterial({ color: ACCENT }));
    disposables.push(route.material as THREE.Material);
    sheet.add(route);

    // Itinerary cards (outlines floating above stops).
    const cardGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 0.9, 0.02));
    disposables.push(cardGeo);
    const cardMat = line(INK, 0.7);
    const cards = [1, 2, 3].map((n) => {
      const c = new THREE.LineSegments(cardGeo, cardMat);
      c.position.set(-2 + n * 1.6, 2.7 - n * 0.15, 1.2 + n * 0.25);
      c.visible = false;
      sheet.add(c);
      return c;
    });

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let target = 0, current = 0, raf = 0;
    const lookAt = new THREE.Vector3();

    const draw = () => {
      const p = current;
      const unfold = seg(p, 0.0, 0.25);
      sheet.scale.y = 0.15 + 0.85 * unfold;
      sheet.rotation.x = -1.15 + 0.6 * seg(p, 0.1, 0.85) + 0.1 * (1 - unfold);
      sheet.rotation.z = -0.25 + 0.25 * seg(p, 0, 0.3);
      camera.position.set(2.2 - 3 * seg(p, 0.1, 0.9), 2.5 + 3 * seg(p, 0.25, 0.9), 11 - 3.5 * seg(p, 0.2, 0.9));
      lookAt.set(0.8 - 1 * seg(p, 0.2, 0.9), 0, 0);
      camera.lookAt(lookAt);
      pins.forEach((pin, i) => pin.scale.setScalar(0.001 + seg(p, 0.28 + i * 0.05, 0.34 + i * 0.05)));
      routeGeo.setDrawRange(0, Math.floor(201 * seg(p, 0.5, 0.78)));
      cards.forEach((c, i) => { const s = seg(p, 0.76 + i * 0.04, 0.84 + i * 0.04); c.visible = s > 0; c.scale.setScalar(Math.max(s, 0.001)); });
      renderer.render(scene, camera);
    };

    const tick = () => {
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0008) current = target;
      draw();
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? clamp01(window.scrollY / max) : 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      disposables.forEach((d) => d.dispose());
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="pointer-events-none fixed inset-0 z-[1] opacity-70" aria-hidden="true" />;
}
