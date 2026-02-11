document.body.style.cursor = 'none';
const cursor = document.querySelector('.cursor');

window.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  
  // This moves the element without triggering a full page reflow
  cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
});