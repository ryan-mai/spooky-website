class MorphManager {
    constructor() {
        this.size = 480;

        this.resultCanvas = document.getElementById('result');
        this.resultCtx = this.resultCanvas.getContext('2d', { willReadFrequently: true});
        
        this.overlayCanvas = document.getElementById('original-overlay');
        this.overlayCtx = this.overlayCanvas && this.overlayCanvas.getContext('2d', { willReadFrequently: true });

        this.inputCanvas = document.createElement('canvas');
        this.inputCanvas.width = this.size;
        this.inputCanvas.height = this.size;
        this.inputCtx = this.inputCanvas.getContext('2d', { willReadFrequently: true});
        
        this.upload = document.getElementById('upload');
        this.slider = document.getElementById('reveal');

        this.delay = 2000;
        this.timer = null;
        this.autoAnim = null;
        this.isAuto = false;
        this.isUploaded = false;

        this.revealInput = document.getElementById('reveal-value');

        this.morphAudio = new Audio('/assets/audio/morph.mp3');

        this.init();
    }

    init() {
        this.targetImg = new Image();
        this.targetImg.src = '/assets/img/pennywise.jpg';
        this.targetImg.onload = () => console.log("Happy Halloween!!! 🎃 Now be haunted...");
        this.targetImg.onerror = (e) => console.error('Uh ohhhhhhhhhhhhhhhhhhhh', e); 

        if (this.upload) {
            this.upload.addEventListener('change', (e) => {
                this.fileUpload(e)
                this.resetIdleTimer(true);
            });
        }

        if (this.slider) {
            this.slider.addEventListener('input', () => {
                this.updateOverlay()
                
                if (this.revealInput) this.revealInput.value = this.slider.value;
            });
        }

        this.attachIdle();
        this.resetIdleTimer(false);
    }

    attachIdle() {
        const onActivity = () => this.resetIdleTimer(true);

        if (this.slider) {
            this.slider.addEventListener('change', onActivity);
        }

        if (this.upload) this.upload.addEventListener('change', onActivity);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) this.stopAuto();
            onActivity();
        });
    }

    resetIdleTimer(stop = false) {
        if (stop) this.stopAuto();
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.startAuto(), this.delay);
    }

    startAuto() {
        if (!this.isUploaded) return;
        
        if (!this.slider || this.isAuto) return;
        if (Number(this.slider.value) === 100) {
            this.resetIdleTimer();
            return;
        }

        this.isAuto = true;
        const startVal = Number(this.slider.value || 0);
        const endVal = 100;
        const duration = 4500;
        const startTime = performance.now();

        const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const time = Math.min(1, (now - startTime) / duration);
            const value = Math.round(startVal + (endVal - startVal) * easeOutCubic(time));
            this.animateSlider(value);
            if (time < 1 && this.isAuto) {
                this.autoAnim = requestAnimationFrame(tick);
            } else {
                this.isAuto = false;
            }
        };

        this.autoAnim = requestAnimationFrame(tick);
        }

    stopAuto() {
        this.isAuto = false;
        if (this.autoAnim) cancelAnimationFrame(this.autoAnim);
        this.autoAnim = null;
    }
    animateSlider(val) {
        if (!this.slider) return;
        let value = Number(val);

        if (value <= 1 && value >= 0) value = Math.round(value * 100);
        value = Math.max(0, Math.min(100, Math.round(value)))
        this.slider.value = String(value);

        if (this.revealInput) this.revealInput.value = String(value);

        this.updateOverlay();
    }

    fileUpload(e) {
        const file = e.target.files && e.target.files[0];

        const reader = new FileReader();
        reader.onload = (ev) => {
            const uploadImg = new Image();
            uploadImg.onerror = (err) => console.error(":/", err);
            uploadImg.src = ev.target.result;
        
            uploadImg.onload = () => {
                this.centerImg(uploadImg, this.inputCtx, this.size, this.size);
                this.processImg();
                this.updateOverlay();

                this.isUploaded = true;

                this.morphAudio.currentTime = 0;
                this.morphAudio.play();
            };

            uploadImg.onerror = (err) => console.error(":/", err);
            uploadImg.src = ev.target.result;
        };
        reader.onerror = (err) => console.error(":???", err);
        reader.readAsDataURL(file);
    }

    centerImg(img, ctx, cw, ch) {
        ctx.clearRect(0, 0, cw, ch);
        const imgW = img.width;
        const imgH = img.height;

        const scale = Math.min(cw / imgW, ch / imgH );
        const dw = Math.round(imgW * scale);
        const dh = Math.round(imgH * scale);
        const dx = Math.round((cw - dw) / 2);
        const dy = Math.round((ch - dh) / 2);
        ctx.drawImage(img, dx, dy, dw, dh);
    }

    processImg() {
        if (!this.targetImg.complete) {
            this.targetImg.onload = () => {
                this.processImg();
                return;
            }
        }

        console.log('Preparing to haunt you!!! 👻');

        const size = this.size;

        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = size;
        targetCanvas.height = size;

        const targetCtx = targetCanvas.getContext('2d', { willReadFrequently: true });
        const tImg = this.targetImg;
        const tW = tImg.width;
        const tH = tImg.height;
        const tScale = Math.min(tImg / tW, tImg / tH);
        const tDw = Math.round(tW * tScale);
        const tDh = Math.round(tH * tScale);
        const tDx = Math.round((size - tDw) / 2);
        const tDy = Math.round((size - tDh) / 2);

        targetCtx.clearRect(0, 0, size, size);
        targetCtx.drawImage(this.targetImg, 0, 0, size, size);
        
        const targetData = targetCtx.getImageData(0, 0, size, size);
        const inputData = this.inputCtx.getImageData(0, 0, size, size);

        const inputPx = inputData.data;
        const targetPx = targetData.data;

        this.getOutput(inputPx, targetPx, size);
        this.updateOverlay();
    }

    getOutput(inputData, targetData, size) {
        const output = this.resultCtx.createImageData(size, size);
        const outputData = output.data;

        for (let i = 0; i < inputData.length; i += 4) {
            const inR = inputData[i], inG = inputData[i + 1], inB = inputData[i + 2];
            const tR = targetData[i], tG = targetData[i + 1], tB = targetData[i + 2];

            const [r, g, b] = this.calcBrightness(inR, inG, inB, tR, tG, tB, 0.92);

            outputData[i] = r, outputData[i + 1] = g, outputData[i + 2] = b, outputData[i + 3] = 255;
        }

        this.resultCtx.clearRect(0, 0, size, size);
        this.resultCtx.putImageData(output, 0, 0);
    }

    updateOverlay() {
        if (!this.overlayCtx || !this.inputCanvas) return;

        const pct = (this.slider ? Number(this.slider.value) : 50) / 100;
        const revealPercent = 1 - pct;

        this.overlayCtx.clearRect(0, 0, this.size, this.size);

        if (revealPercent <= 0) return;

        this.overlayCtx.save();
        this.overlayCtx.globalAlpha = revealPercent;
        this.overlayCtx.globalCompositeOperation = 'source-over';
        this.overlayCtx.drawImage(this.inputCanvas, 0, 0, this.size, this.size);
        this.overlayCtx.restore();
    }

    calcBrightness(inR, inG, inB, tR, tG, tB, intensity = 0.65) {
        const luminance = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        
        const lum = luminance(inR, inG, inB);

        const k = (lum - 0.5) * 2;
        let factor = 1 + k * intensity;

        if (factor < 1) factor = Math.pow(factor, 1.05);
        else factor = Math.pow(factor, 0.95);

        const r = Math.max(0, Math.min(255, tR * factor));
        const g = Math.max(0, Math.min(255, tG * factor));
        const b = Math.max(0, Math.min(255, tB * factor));

        return [r, g, b];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MorphManager();
});