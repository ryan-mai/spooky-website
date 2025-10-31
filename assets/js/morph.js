class MorphManager {
    constructor() {
        this.canvas = document.getElementById('output');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true});
        this.upload = document.getElementById('upload');

        this.init();
    }

    init() {
        this.targetImg = new Image();
        this.targetImg.src = '/assets/img/pennywise.jpg';
        this.targetImg.onload = () => console.log("Happy Halloween!!! 🎃 Now be haunted...");

        this.upload.addEventListener('change', (e) => {
            console.log('You have uploaded an image you want haunted... 😈')
            const file = e.target.files && e.target.files[0];

            const reader = new FileReader();
            reader.onload = (e) => {
                const uploadImg = new Image();
                uploadImg.onload = () => {
                    this.processImg(uploadImg, this.targetImg);
                };
                uploadImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    processImg(inputImg, targetImg) {
        if (!targetImg.complete) {
            targetImg.onload = () => {
                this.processImg(inputImg, targetImg);
                return;
            }
        }

        console.log('Preparing to haunt you!!! 👻')
        const size = 480;
        this.canvas.width = size;
        this.canvas.height = size;

        this.ctx.drawImage(inputImg, 0, 0, size, size);
        const inputData = this.ctx.getImageData(0, 0, size, size);

        this.ctx.drawImage(targetImg, 0, 0, size, size);
        const targetData = this.ctx.getImageData(0, 0, size, size);

        const inputPx = inputData.data;
        const targetPx = targetData.data;

        this.drawImg(inputPx, targetPx, size, 0.9267);
    }

    drawImg(inputPx, targetPx, size, intensity = 0.65) {
        const output = this.ctx.createImageData(size, size);
        const outputData = output.data;

        for (let i = 0; i < targetPx.length; i += 4) {
            const inR = inputPx[i];            
            const inG = inputPx[i + 1];            
            const inB = inputPx[i + 2];            

            const tR = targetPx[i];            
            const tG = targetPx[i + 1];            
            const tB = targetPx[i + 2];            

            const [r, g, b] = this.calcBrightness(inR, inG, inB, tR, tG, tB, intensity);

            outputData[i] = r;
            outputData[i + 1] = g;
            outputData[i + 2] = b;
            outputData[i + 3] = 255;
        }
        
        this.ctx.putImageData(output, 0, 0);
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