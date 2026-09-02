(function () {
  const canvas = document.getElementById('animation-canvas');
  const ctx = canvas.getContext('2d');
  const frameCount = 290;
  const images = [];

  const getFramePath = (index) => {
    const num = String(index + 1).padStart(3, '0');
    return `imagens-da-animação/ezgif-frame-${num}.jpg`;
  };

  let currentFrame = 0;
  let targetFrame = 0;
  const lerpFactor = 0.1; // Smooth interpolation factor

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    render();
  }

  function render() {
    const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrame)));
    const img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // Calculate aspect ratio containment (contain mode)
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = cw / ch;

    let drawWidth, drawHeight;
    if (canvasRatio > imgRatio) {
      drawHeight = ch;
      drawWidth = ch * imgRatio;
    } else {
      drawWidth = cw;
      drawHeight = cw / imgRatio;
    }

    const dx = (cw - drawWidth) / 2;
    const dy = (ch - drawHeight) / 2;

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
  }

  function updateScroll() {
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;
    targetFrame = scrollFraction * (frameCount - 1);
  }

  function animate() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.001) {
      currentFrame += diff * lerpFactor;
      render();
    }
    requestAnimationFrame(animate);
  }

  // Preload frames
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    if (i === 0) {
      img.onload = () => {
        render();
      };
    } else {
      img.onload = () => {
        if (Math.round(currentFrame) === i) {
          render();
        }
      };
    }
    images.push(img);
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  updateScroll();
  animate();
})();
