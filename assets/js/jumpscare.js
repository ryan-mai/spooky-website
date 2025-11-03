class JumpscareManager {
    constructor() {
        this.index = 1;
        this.delay = 500;
        this.isClickable = true;
        this.lastIdx = 7;

        this.hasStartedLoop = false;
        this.jumpscareLoop = new Audio("../../assets/audio/jumpscare_loop.mp3");
        this.jumpscareLoop.loop = true;

        this.indexAudio = new Audio("../../assets/audio/index.mp3");
        this.indexAudio.loop = true;

        this.init();
    }

    init() {
        window.addEventListener('click', () => {
            if (!this.isClickable) return;

            if (!this.hasStartedLoop) {
                this.hasStartedLoop = true;
                this.jumpscareLoop.currentTime = 0;
                this.jumpscareLoop.play().catch((err) => { console.error(err) });
            }

            this.changeBg();
        });
    }

    changeBg() {
        this.isClickable = false;
        this.index += 1;
        document.body.style.backgroundImage = `url("../../assets/img/jumpscare/scene_${this.index}.webp")`;

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
                    try {
                        this.jumpscareLoop.pause();
                        this.jumpscareLoop.currentTime = 0;
                    } catch (e) {}

                    this.indexAudio.currentTime = 0;
                    this.indexAudio.loop = true;
                    this.indexAudio.play().catch(() => { /* autoplay blocked */ });

                    const navigate = () => {
                        window.location.href = '/src/pages/index.html';
                    };

                    setTimeout(navigate, this.delay * 3);
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