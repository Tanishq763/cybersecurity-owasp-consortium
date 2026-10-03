/**
 * network-bg-3d.js  — Full-page 3D Live Network Background (SPARSE & ATMOSPHERIC)
 *
 * White on #050505 only. No gradients, no glow, no blur, no color.
 * Very sparse — subtle depth effect, NOT overwhelming.
 */

import * as THREE from 'three';

export function mountNetworkBg3D(hostEl, { quietEl } = {}) {
  /* ── Canvas & renderer ───────────────────────────────────── */
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');

  const isFixed = !hostEl;
  canvas.style.cssText = isFixed
    ? 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:-1;display:block;'
    : 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;display:block;';

  if (isFixed) document.body.appendChild(canvas);
  else hostEl.appendChild(canvas);

  const DPR_CAP = 1.5;
  const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x050505, 1);

  /* ── Scene / Camera ──────────────────────────────────────── */
  const scene = new THREE.Scene();
  let W = window.innerWidth, H = window.innerHeight;
  renderer.setSize(W, H, false);

  const CAM_Z = 22;
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 300);
  camera.position.set(0, 0, CAM_Z);

  /* ── Config (sparse!) ────────────────────────────────────── */
  const mobile = () => W < 768;

  // Fewer nodes, bigger spread
  const NUM_NODES = () => mobile() ? 45 : 85;
  // Shorter link distance → fewer connections per node
  const LINK_DIST = () => mobile() ? 5.2 : 6.8;
  // Max links drawn per frame
  const MAX_LINK_OPACITY = 0.35;  // very faint lines
  // Drifting box half-size (bigger = more spread)
  const BOX = 11;

  /* ── State ───────────────────────────────────────────────── */
  let paused = false, animId = null;
  let nodes = [], packets = [], pings = [];
  let lastPacket = 0, lastPing = 0;

  /* ── Node geometry pool ──────────────────────────────────── */
  const sphereGeo = new THREE.SphereGeometry(1, 4, 3);

  function makeNode() { let x,y,z; do { x = (Math.random() - 0.5) * BOX * 2; y = (Math.random() - 0.5) * BOX * 2; z = (Math.random() - 0.5) * BOX * 1.4; } while(Math.hypot(x,y) < 5.5);
    const size = (Math.random() * 0.7 + 0.6) * 0.05; // world radius
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    
    
    
    mesh.scale.setScalar(size);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return {
      x, y, z, size,
      vx: (Math.random() - 0.5) * 0.008,
      vy: (Math.random() - 0.5) * 0.008,
      vz: (Math.random() - 0.5) * 0.004,
      mesh, links: []
    };
  }

  function buildNodes() {
    nodes.forEach(n => { scene.remove(n.mesh); n.mesh.material.dispose(); });
    packets.forEach(p => { scene.remove(p.mesh); p.mesh.material.dispose(); });
    pings.forEach(g => { scene.remove(g.mesh); g.mesh.geometry.dispose(); g.mesh.material.dispose(); });
    nodes = []; packets = []; pings = [];
    const count = NUM_NODES();
    for (let i = 0; i < count; i++) nodes.push(makeNode());
  }

  /* ── Lines (single dynamic LineSegments) ─────────────────── */
  const MAX_SEG = 2000;
  const lPos = new Float32Array(MAX_SEG * 6);
  const lCol = new Float32Array(MAX_SEG * 6);
  const lPosAttr = new THREE.BufferAttribute(lPos, 3); lPosAttr.setUsage(THREE.DynamicDrawUsage);
  const lColAttr = new THREE.BufferAttribute(lCol, 3); lColAttr.setUsage(THREE.DynamicDrawUsage);
  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute('position', lPosAttr);
  linesGeo.setAttribute('color', lColAttr);
  const linesMesh = new THREE.LineSegments(linesGeo,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1 }));
  scene.add(linesMesh);

  /* ── Packets ─────────────────────────────────────────────── */
  const pktGeo = new THREE.SphereGeometry(0.04, 4, 3);

  function spawnPacket(t) {
    if (nodes.length < 2) return;
    const src = nodes[Math.floor(Math.random() * nodes.length)];
    if (!src.links.length) return;
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(pktGeo, mat);
    scene.add(mesh);
    packets.push({ node: src, next: src.links[Math.floor(Math.random() * src.links.length)], progress: 0, hopsLeft: Math.floor(Math.random() * 4) + 2, mesh });
    lastPacket = t;
  }

  /* ── Ping rings ──────────────────────────────────────────── */
  const RING_SEGS = 40;
  const ringBase = (() => {
    const pos = new Float32Array((RING_SEGS + 1) * 3);
    for (let i = 0; i <= RING_SEGS; i++) {
      const a = (i / RING_SEGS) * Math.PI * 2;
      pos[i * 3] = Math.cos(a); pos[i * 3 + 1] = Math.sin(a);
    }
    return pos;
  })();

  function spawnPing(t) {
    if (!nodes.length) return;
    const src = nodes[Math.floor(Math.random() * nodes.length)];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(ringBase.slice(), 3));
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
    const mesh = new THREE.LineLoop(geo, mat);
    mesh.position.set(src.x, src.y, src.z);
    mesh.lookAt(camera.position);
    scene.add(mesh);
    const maxR = Math.random() * 1.5 + 1.0;
    pings.push({ x: src.x, y: src.y, z: src.z, r: 0, maxR, mesh });
    lastPing = t;
  }

  /* ── Pointer line ────────────────────────────────────────── */
  let mouse = { x: -9999, y: -9999 };
  const ptrGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const ptrLine = new THREE.Line(ptrGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
  scene.add(ptrLine);
  const onMM = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
  window.addEventListener('mousemove', onMM);

  function mouseToWorld() {
    const nx = (mouse.x / W) * 2 - 1, ny = -(mouse.y / H) * 2 + 1;
    const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
    const dir = v.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z;
    return new THREE.Vector3(camera.position.x + dir.x * t, camera.position.y + dir.y * t, 0);
  }

  /* ── Quiet zone ──────────────────────────────────────────── */
  function quietFactor(wx, wy) {
    if (!quietEl) return 1;
    const qr = quietEl.getBoundingClientRect();
    const pv = new THREE.Vector3(wx, wy, 0).project(camera);
    const sx = (pv.x + 1) * 0.5 * W;
    const sy = (1 - (pv.y + 1) * 0.5) * H;
    const dx = Math.max(0, Math.abs(sx - (qr.left + qr.width / 2)) - qr.width / 2);
    const dy = Math.max(0, Math.abs(sy - (qr.top + qr.height / 2)) - qr.height / 2);
    const dist = Math.hypot(dx, dy);
    return dist < 140 ? 0.3 + (dist / 140) * 0.7 : 1;
  }

  /* ── Camera ──────────────────────────────────────────────── */
  let tCamX = 0, tCamY = 0, camRoll = 0;

  /* ── Reduced motion ──────────────────────────────────────── */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Resize ──────────────────────────────────────────────── */
  function onResize() {
    W = window.innerWidth; H = window.innerHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H, false);
    buildNodes();
  }
  const ro = new ResizeObserver(onResize);
  ro.observe(document.documentElement);

  const onVis = () => { paused = document.hidden; };
  document.addEventListener('visibilitychange', onVis);

  /* ── Init ────────────────────────────────────────────────── */
  buildNodes();

  /* ── Tick ────────────────────────────────────────────────── */
  function tick(t) {
    animId = requestAnimationFrame(tick);
    if (paused && !reduced) return;

    const LD = LINK_DIST();
    const m3 = mouseToWorld();

    /* Camera parallax */
    if (!reduced) {
      tCamX = ((mouse.x / W) - 0.5) * -2.0;
      tCamY = ((mouse.y / H) - 0.5) *  2.0;
      camera.position.x += (tCamX - camera.position.x) * 0.025;
      camera.position.y += (tCamY - camera.position.y) * 0.025;
      camRoll += 0.00015;
      camera.rotation.z = camRoll;
      camera.position.z = CAM_Z;
      camera.lookAt(0, 0, 0);
    }

    /* Update nodes */
    for (const n of nodes) { n.links = []; }
    for (const n of nodes) {
      if (!reduced) {
        n.x += n.vx; n.y += n.vy; n.z += n.vz;
        if (n.x > BOX || n.x < -BOX) n.vx *= -1;
        if (n.y > BOX || n.y < -BOX) n.vy *= -1;
        if (n.z > BOX * 0.7 || n.z < -BOX * 0.7) n.vz *= -1;
        
        // Keep center free (invisible cylinder bounce)
        const dCenter = Math.hypot(n.x, n.y);
        if (dCenter < 5.5) {
          const nx = n.x / dCenter, ny = n.y / dCenter;
          const dot = n.vx * nx + n.vy * ny;
          if (dot < 0) { n.vx -= 2 * dot * nx; n.vy -= 2 * dot * ny; }
        }
      }
      n.mesh.position.set(n.x, n.y, n.z);
    }

    /* Find closest node to cursor */
    let closestNode = null, closestDist = Infinity;
    for (const n of nodes) {
      // Screen-space distance for cursor highlight
      const pv = new THREE.Vector3(n.x, n.y, n.z).project(camera);
      const sx = (pv.x + 1) * 0.5 * W;
      const sy = (1 - (pv.y + 1) * 0.5) * H;
      const sd = Math.hypot(sx - mouse.x, sy - mouse.y);
      const near = sd < 200;

      const qf = quietFactor(n.x, n.y);
      n.mesh.material.opacity = near ? 0.92 : 0.45 * qf;
      n.mesh.scale.setScalar(near ? n.size * 1.6 : n.size);

      const wd = Math.hypot(n.x - m3.x, n.y - m3.y);
      if (wd < closestDist) { closestDist = wd; closestNode = n; }
    }

    /* Pointer → closest node line */
    if (closestNode && closestDist < 6) {
      const pa = ptrGeo.attributes.position;
      pa.setXYZ(0, m3.x, m3.y, m3.z);
      pa.setXYZ(1, closestNode.x, closestNode.y, closestNode.z);
      pa.needsUpdate = true;
      ptrLine.material.opacity = 0.35;
      ptrLine.visible = true;
    } else { ptrLine.visible = false; }

    /* Build links */
    let seg = 0;
    for (let i = 0; i < nodes.length && seg < MAX_SEG; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length && seg < MAX_SEG; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < LD) {
          a.links.push(b); b.links.push(a);
          const op = (1 - d / LD) * MAX_LINK_OPACITY;
          const qf = Math.min(quietFactor(a.x, a.y), quietFactor(b.x, b.y));
          const c = op * qf;
          const base = seg * 6;
          lPos[base]   = a.x; lPos[base+1] = a.y; lPos[base+2] = a.z;
          lPos[base+3] = b.x; lPos[base+4] = b.y; lPos[base+5] = b.z;
          lCol[base]   = lCol[base+1] = lCol[base+2] = c;
          lCol[base+3] = lCol[base+4] = lCol[base+5] = c;
          seg++;
        }
      }
    }
    linesGeo.setDrawRange(0, seg * 2);
    lPosAttr.needsUpdate = true;
    lColAttr.needsUpdate = true;

    if (!reduced) {
      /* Packets */
      if (t - lastPacket > Math.random() * 400 + 300) spawnPacket(t);
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += 0.045;
        if (p.progress >= 1) {
          p.hopsLeft--;
          if (p.hopsLeft <= 0 || !p.next.links.length) {
            scene.remove(p.mesh); p.mesh.material.dispose(); packets.splice(i, 1); continue;
          }
          p.node = p.next;
          p.next = p.next.links[Math.floor(Math.random() * p.next.links.length)];
          p.progress = 0;
        } else {
          const px = p.node.x + (p.next.x - p.node.x) * p.progress;
          const py = p.node.y + (p.next.y - p.node.y) * p.progress;
          const pz = p.node.z + (p.next.z - p.node.z) * p.progress;
          p.mesh.position.set(px, py, pz);
          p.mesh.material.opacity = quietFactor(px, py);
        }
      }

      /* Pings */
      if (t - lastPing > Math.random() * 2000 + 1400) spawnPing(t);
      for (let i = pings.length - 1; i >= 0; i--) {
        const pg = pings[i];
        pg.r += 0.014;
        if (pg.r > pg.maxR) {
          scene.remove(pg.mesh); pg.mesh.geometry.dispose(); pg.mesh.material.dispose(); pings.splice(i, 1); continue;
        }
        pg.mesh.scale.setScalar(pg.r);
        pg.mesh.lookAt(camera.position);
        pg.mesh.material.opacity = (1 - pg.r / pg.maxR) * 0.28 * quietFactor(pg.x, pg.y);
      }
    }

    renderer.render(scene, camera);
    if (reduced) { cancelAnimationFrame(animId); animId = null; }
  }

  animId = requestAnimationFrame(tick);

  return {
    destroy() {
      if (animId) cancelAnimationFrame(animId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('mousemove', onMM);
      nodes.forEach(n => { scene.remove(n.mesh); n.mesh.material.dispose(); });
      packets.forEach(p => { scene.remove(p.mesh); p.mesh.material.dispose(); });
      pings.forEach(g => { scene.remove(g.mesh); g.mesh.geometry.dispose(); g.mesh.material.dispose(); });
      linesGeo.dispose(); linesMesh.material.dispose();
      ptrGeo.dispose(); ptrLine.material.dispose();
      pktGeo.dispose(); sphereGeo.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };
}
