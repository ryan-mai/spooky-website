class JumpscareManager {
    constructor() {
        this.init();
        this.index = 1;
    }

    init() {
        window.addEventListener('click', () => {
            this.changeBg();
        });
    }

    changeBg() {
        document.body.style.backgroundImage = `url("/assets/img/jumpscare/scene_${this.index}.webp")`;
        this.index += 1;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JumpscareManager;
})