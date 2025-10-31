class MorphManager {
    constructor() {
        this.canvas = document.getElementById('output');
        this.ctx = this.canvas.getContext('2d');
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
                    console.log(uploadImg);
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

        this.drawImg(inputPx, targetPx);
    }

    drawImg(inputPx, targetPx) {
        const pixels = [];

        for (let i = 0; i < inputPx.length; i += 4) {
            const avgBrightness = (inputPx[i] + inputPx[i + 1] + inputPx[i + 2]) / 3;
            
            pixels.push({
                r: targetPx[i], g: targetPx[i + 1], b: targetPx[i + 2], index: i, avg: avgBrightness
            });

        }

        // pixels.sort((a, b) => a.avg - b.avg);

        const output = this.ctx.createImageData(size, size);
        const outputData = output.data;

        for (let q = 0; q < pixels.length; q++) {
            const px = pixels[i];
            const idx = px.index;

            outputData[idx] = px.r;
            outputData[idx + 1] = px.g;
            outputData[idx + 2] = px.b;
            outputData[idx + 3] = 125;
        }

        this.ctx.putImageData(output, 0, 0);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MorphManager();
});