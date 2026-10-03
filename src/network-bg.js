export function mountNetworkBg(hostEl, { quietEl }) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  canvas.setAttribute('aria-hidden', 'true');
  hostEl.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let active = true;
  let animId;
  let lastPacketTime = 0;
  let lastPingTime = 0;
  
  let nodes = [];
  let packets = [];
  let pings = [];
  
  const isMobile = window.innerWidth < 768;
  const numNodes = isMobile ? 50 : 120;
  const linkDist = isMobile ? 130 : 175;
  
  let pointer = { x: -1000, y: -1000 };
  
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = hostEl.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }
  
  function initNodes() {
    nodes = [];
    for(let i=0; i<numNodes; i++) {
      nodes.push({
        x: Math.random() * (width || window.innerWidth),
        y: Math.random() * (height || window.innerHeight),
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 0.7 + 0.5,
        links: []
      });
    }
  }
  
  resize();
  initNodes();
  
  const ro = new ResizeObserver(() => {
    resize();
    initNodes();
  });
  ro.observe(hostEl);
  
  const io = new IntersectionObserver(entries => {
    active = entries[0].isIntersecting;
  });
  io.observe(hostEl);
  
  const onVis = () => { active = !document.hidden; };
  document.addEventListener('visibilitychange', onVis);
  
  const onMove = (e) => {
    const rect = hostEl.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };
  window.addEventListener('mousemove', onMove);
  
  let qRect = null;
  function updateQuietRect() {
    if (quietEl) {
      const qr = quietEl.getBoundingClientRect();
      const hr = hostEl.getBoundingClientRect();
      qRect = {
        x: qr.left - hr.left + qr.width/2,
        y: qr.top - hr.top + qr.height/2,
        w: qr.width,
        h: qr.height
      };
    }
  }
  
  function getOpacityFactor(x, y) {
    if (!qRect) return 1;
    const dx = Math.max(0, Math.abs(x - qRect.x) - qRect.w/2);
    const dy = Math.max(0, Math.abs(y - qRect.y) - qRect.h/2);
    const dist = Math.hypot(dx, dy);
    if (dist < 140) {
      return 0.3 + (dist/140) * 0.7;
    }
    return 1;
  }
  
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  function draw(t) {
    if (!reducedMotion && (!active || width === 0)) {
      animId = requestAnimationFrame(draw);
      return;
    }
    
    updateQuietRect();
    ctx.clearRect(0, 0, width, height);
    
    // update nodes
    for (const n of nodes) {
      if (!reducedMotion) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      n.links = [];
    }
    
    // links
    ctx.lineWidth = 1;
    let closestNode = null;
    let closestDist = Infinity;
    
    for (let i=0; i<nodes.length; i++) {
      const a = nodes[i];
      const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
      if (pd < closestDist) {
        closestDist = pd;
        closestNode = a;
      }
      
      for (let j=i+1; j<nodes.length; j++) {
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < linkDist) {
          a.links.push(b);
          b.links.push(a);
          const op = (1 - d/linkDist) * 0.42;
          const fo = Math.min(getOpacityFactor(a.x, a.y), getOpacityFactor(b.x, b.y));
          ctx.strokeStyle = `rgba(255,255,255,${op * fo})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    
    // pointer links
    if (closestNode && closestDist < 200) {
      ctx.strokeStyle = `rgba(255,255,255,0.5)`;
      ctx.beginPath();
      ctx.moveTo(pointer.x, pointer.y);
      ctx.lineTo(closestNode.x, closestNode.y);
      ctx.stroke();
    }
    
    // draw nodes
    for (const n of nodes) {
      const pd = Math.hypot(n.x - pointer.x, n.y - pointer.y);
      const active = pd < 200;
      const r = active ? n.r * 1.5 : n.r;
      const op = active ? 0.9 : 0.5 * getOpacityFactor(n.x, n.y);
      ctx.fillStyle = `rgba(255,255,255,${op})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI*2);
      ctx.fill();
    }
    
    if (!reducedMotion) {
      // packets
      if (t - lastPacketTime > Math.random() * 300 + 200) {
        lastPacketTime = t;
        const start = nodes[Math.floor(Math.random() * nodes.length)];
        if (start.links.length > 0) {
          packets.push({
            node: start,
            next: start.links[Math.floor(Math.random() * start.links.length)],
            progress: 0,
            hops: Math.floor(Math.random() * 4) + 2
          });
        }
      }
      
      for (let i=packets.length-1; i>=0; i--) {
        const p = packets[i];
        p.progress += 0.05;
        if (p.progress >= 1) {
          p.hops--;
          if (p.hops <= 0 || p.next.links.length === 0) {
            packets.splice(i, 1);
            continue;
          }
          p.node = p.next;
          p.next = p.next.links[Math.floor(Math.random() * p.next.links.length)];
          p.progress = 0;
        } else {
          const x = p.node.x + (p.next.x - p.node.x) * p.progress;
          const y = p.node.y + (p.next.y - p.node.y) * p.progress;
          const fo = getOpacityFactor(x, y);
          ctx.fillStyle = `rgba(255,255,255,${fo})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI*2);
          ctx.fill();
        }
      }
      
      // pings
      if (t - lastPingTime > Math.random() * 1800 + 1200) {
        lastPingTime = t;
        const source = nodes[Math.floor(Math.random() * nodes.length)];
        pings.push({ x: source.x, y: source.y, r: 0, maxR: Math.random() * 50 + 50 });
      }
      
      for (let i=pings.length-1; i>=0; i--) {
        const p = pings[i];
        p.r += 0.5;
        if (p.r > p.maxR) {
          pings.splice(i, 1);
        } else {
          const fo = getOpacityFactor(p.x, p.y);
          const op = (1 - p.r/p.maxR) * 0.4 * fo;
          ctx.strokeStyle = `rgba(255,255,255,${op})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
          ctx.stroke();
        }
      }
      
      animId = requestAnimationFrame(draw);
    }
  }
  
  animId = requestAnimationFrame(draw);
  
  return {
    destroy() {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('mousemove', onMove);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };
}
