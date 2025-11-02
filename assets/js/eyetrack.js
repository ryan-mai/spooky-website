class eyeManager {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            const anchor = document.getElementById('anchor');
            const rect = anchor.getBoundingClientRect();
            const anchorX = rect.left + rect.width / 2;
            const anchorY = rect.top + rect.height / 2;

            const angle = this.calcAngle(mouseX, mouseY, anchorX, anchorY);

            const eyes = document.querySelectorAll('.eye')
            eyes.forEach(eye => {
                eye.style.transform = `rotate(${180 +angle}deg)`
            })
        });
    }

    calcAngle(cx, cy, ex, ey) {
        const dy = ey - cy;
        const dx = ex - cx;
        const rad = Math.atan2(dy, dx);
        const deg = rad * 180 / Math.PI;
        return deg;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new eyeManager();
})
