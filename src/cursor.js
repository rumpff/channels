

document.body.style.cursor = 'none';

// 1. Create the shadow FIRST so it sits behind the cursor in the DOM stack
const cursorShadow = document.createElement('img');
cursorShadow.className = 'cursor-shadow';
cursorShadow.src = 'assets/cursor-shadow.png';
document.body.appendChild(cursorShadow); // Append to body, not the cursor

// 2. Create the cursor
const cursor = document.createElement('img');
cursor.className = 'cursor';
cursor.src = 'assets/cursor.png';
document.body.appendChild(cursor);

window.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  
  const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(-10deg)`;
  
  cursor.style.transform = transform;
  // Offset the shadow slightly so it actually looks like a shadow
  cursorShadow.style.transform = transform + ` translate(5px, 5px)`; 
});