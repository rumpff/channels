let cursor;
let cursorShadow;

const baseCursorScale = 0.46;
const baseShadowOffset = 5;
const baseCursorAngle = -8;

const cursorAnimationSensitivity = 1.3;

let cursorAngle = -3;

let lastMove = performance.now();
let lastX = 0;

let idleTimer;
const idleThreshold = 2;

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

initCursor();


function initCursor() {
  document.body.style.cursor = 'none';

  cursorShadow = document.createElement('img');

  cursorShadow.className = 'cursor-shadow';
  cursorShadow.src = 'assets/img/cursor-shadow.png';

  document.body.appendChild(cursorShadow);

  cursor = document.createElement('img');

  cursor.className = 'cursor';
  cursor.src = 'assets/img/cursor.png';

  document.body.appendChild(cursor);


  updateCursorTransforms(0,0);

  window.addEventListener('mousemove', (e) => {   
    updateCursorTransforms(e.clientX, e.clientY);
    lastMove = performance.now(); 
    lastX = e.clientX;

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { cursorAngle = baseCursorAngle; updateCursorTransforms(e.clientX, e.clientY, false) }, idleThreshold);
  });
}

function updateCursorTransforms(x, y, calcAngle = true) {
  if(calcAngle) {
    cursorAngle = clamp(baseCursorAngle + (-(lastX - x) / channelScale * cursorAnimationSensitivity), -90, 90);
  }

  cursor.style.setProperty('--angle', cursorAngle + 'deg');
  cursorShadow.style.setProperty('--angle', cursorAngle  + 'deg');

  cursor.style.setProperty('--x', `${x}px`);
  cursor.style.setProperty('--y', `${y}px`);

  cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(var(--angle)) scale(calc(var(--channel-scale) * ${baseCursorScale}))`;
  cursorShadow.style.transform = `translate3d(calc(${x}px + (${baseShadowOffset}px * var(--channel-scale))), calc(${y}px + (${baseShadowOffset}px * var(--channel-scale))), 0) translate(-50%, -50%) rotate(var(--angle)) scale(calc(var(--channel-scale) * ${baseCursorScale}))`;
}