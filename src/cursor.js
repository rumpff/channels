const cursorBaseScale = 0.46;
const shadowOffset = 5;
let cursorAngle = -3;

document.body.style.cursor = 'none';

const cursorShadow = document.createElement('img');
cursorShadow.className = 'cursor-shadow';
cursorShadow.src = 'assets/cursor-shadow.png';
document.body.appendChild(cursorShadow);

const cursor = document.createElement('img');
cursor.className = 'cursor';
cursor.src = 'assets/cursor.png';
document.body.appendChild(cursor);


updateCursorTransforms(0,0)

window.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  
  updateCursorTransforms(x, y)
});

function updateCursorTransforms(x, y) {
  cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${cursorAngle}deg) scale(calc(var(--channel-scale) * ${cursorBaseScale}))`;
  cursorShadow.style.transform = `translate3d(${x + shadowOffset}px, ${y + shadowOffset}px, 0) translate(-50%, -50%) rotate(${cursorAngle}deg) scale(calc(var(--channel-scale) * ${cursorBaseScale}))`;
}