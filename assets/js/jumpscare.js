class JumpscareManager {
    constructor() {
        this.index = 1;
        this.delay = 500;
        this.isClickable = true;
        this.lastIdx = 7;
        
        this.init();
    }

    init() {
        window.addEventListener('click', () => {
            if (!this.isClickable) return;
            this.changeBg();
        });
    }

    changeBg() {
        this.isClickable = false;
        this.index += 1;
        document.body.style.backgroundImage = `url("/assets/img/jumpscare/scene_${this.index}.webp")`;

        if (this.index >= this.lastIdx - 3) {
            if (this.index === this.lastIdx - 3 || this.index === this.lastIdx - 2) {
                setTimeout(() => {
                    this.changeBg();
                }, this.delay * 2);
            }
            
            if (this.index === this.lastIdx - 1) {
                this.isClickable = true;
            }
            
            if (this.index === this.lastIdx) {
                setTimeout(() => {
                    const audio = new Audio("/assets/audio/index.mp3");
                    audio.play();
                    window.location.href = "/src/pages/index.html";

                }, this.delay * 2);
            }
        }
        if (this.index < this.lastIdx - 3){
            setTimeout(() => {
            this.isClickable = true;
            }, this.delay);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new JumpscareManager;
});