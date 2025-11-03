const ghost = document.getElementById('ghost');
const options = ['bat', 'cat', 'frankenstein', 'ghost', 'skull', 'witch-hat', 'zombie'];
let x = 0, y = 0;

document.addEventListener('mousemove', e => {
  x = e.clientX;
  y = e.clientY;
});

document.addEventListener('click', () => {
    const pick = options[Math.floor(Math.random() * options.length)]
    ghost.style.background = `url(/assets/img/cursor/${pick}.png)`;
    ghost.style.backgroundRepeat = 'no-repeat';
    ghost.style.backgroundSize = 'contain';
    ghost.style.backgroundPosition = 'center';
})

function animate() {
  const ghostX = parseFloat(ghost.style.left || 0);
  const ghostY = parseFloat(ghost.style.top || 0);
  const dx = x - ghostX;
  const dy = y - ghostY;
  ghost.style.left = ghostX + dx * 0.75 + 'px';
  ghost.style.top = ghostY + dy * 0.75 + 'px';
  requestAnimationFrame(animate);
}
animate();

setInterval(() => {
  const offsetX = (Math.random() - 0.5) * 200;
  const offsetY = (Math.random() - 0.5) * 200;
  ghost.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX/10}deg)`;
  setTimeout(() => ghost.style.transform = '', 500);
}, 1000);