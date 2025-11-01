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

        this.init();
    }

    init() {
        this.targetImg = new Image();
        this.targetImg.src = '/assets/img/pennywise.jpg';
        this.targetImg.onload = () => console.log("Happy Halloween!!! 🎃 Now be haunted...");
        this.targetImg.onerror = (e) => console.error('Uh ohhhhhhhhhhhhhhhhhhhh', e); 

        if (this.upload) {
            this.upload.addEventListener('change', (e) => this.fileUpload(e));
        }

        if (this.slider) {
            this.slider.addEventListener('input', () => this.updateOverlay());
        }
    }

    fileUpload(e) {
        const file = e.target.files && e.target.files[0];

        const reader = new FileReader();
        reader.onload = (ev) => {
            const uploadImg = new Image();
            uploadImg.onload = () => {
                this.inputCtx.clearRect(0, 0, this.size, this.size);
                this.inputCtx.drawImage(uploadImg, 0, 0, this.size, this.size);
                this.processImg();
                this.updateOverlay();
            };
            uploadImg.onerror = (err) => console.error(":/", err);
            uploadImg.src = ev.target.result;
        };
        reader.onerror = (err) => console.error(":???", err);
        reader.readAsDataURL(file);
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
        targetCtx.drawImage(this.targetImg, 0, 0, size, size);
        
        const targetData = targetCtx.getImageData(0, 0, size, size);
        const inputData = this.inputCtx.getImageData(0, 0, size, size);

        const inputPx = inputData.data;
        const targetPx = targetData.data;

        this.getOutput(inputPx, targetPx, size);
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

        const pct = (this.slider ? Number(this.slider.value) : 0) / 100;
        const visibleW = Math.round(this.size * pct);

        this.overlayCtx.clearRect(0, 0, this.size, this.size);
        
        if (visibleW > 0) {
            this.overlayCtx.drawImage(
                this.inputCanvas,
                0, 0,
                visibleW, this.size,
                0, 0,
                visibleW, this.size,
            );
        }
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