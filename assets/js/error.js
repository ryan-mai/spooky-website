const ghost = document.getElementById('ghost');
const options = ['bat', 'cat', 'frankenstein', 'ghost', 'skull', 'witch-hat', 'zombie'];
let x = 0, y = 0;

document.addEventListener('mousemove', e => {
  x = e.clientX;
  y = e.clientY;
});

document.addEventListener('click', () => {
    const pick = options[Math.floor(Math.random() * options.length)]
    ghost.style.background = `url(../../assets/img/cursor/${pick}.png)`;
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

const annabelle = document.getElementById('annabelle');
const scaryAudio = new Audio('../../assets/audio/button.mp3');

function randomDoll() {
    if (!annabelle) return;
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    const size = Math.min(260, Math.max(80, 120 + Math.floor(Math.random() * 140)));
    const xPos = Math.random() * (viewW - size);
    const yPos = Math.random() * (viewH - size);

    annabelle.style.width = size + 'px';
    annabelle.style.left = xPos + 'px';
    annabelle.style.top = yPos + 'px';
    annabelle.style.display = 'block';
    annabelle.style.opacity = '0';
    annabelle.style.transform = 'scale(1)';
    requestAnimationFrame(() => annabelle.style.opacity = '1');

    const visibleFor = 2500 + Math.random() * 4500;
    setTimeout(() => {
        annabelle.style.opacity = '0';
        setTimeout(() => annabelle.style.display = 'none', 450);
    }, visibleFor);
}

setInterval(() => {
    if (!annabelle) return;
    if (Math.random() < 0.67) {
        randomDoll();
    }
}, 3067);

if (annabelle) {
    annabelle.addEventListener('click', (e) => {
        e.stopPropagation();
        scaryAudio.play();
        annabelle.style.transform = 'scale(1.08) rotate(-6deg)';
        setTimeout(() => {
        annabelle.style.transform = 'scale(1) rotate(0deg)';
        }, 220);
    });
}

annabelle.addEventListener('mouseenter', () => {
  ghost.style.pointerEvents = 'none';
});
annabelle.addEventListener('mouseleave', () => {
  ghost.style.pointerEvents = '';
});