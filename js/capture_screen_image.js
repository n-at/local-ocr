function CaptureScreenImage(previewCanvasEl, options) {
    if (!previewCanvasEl) {
        throw new Error('el required');
    }

    const accept = options.accept ? options.accept : () => {};
    const error = options.error ? options.error : () => {};
    const fps = options.fps ? options.fps : 30;

    const ctx = previewCanvasEl.getContext('2d');

    let mediaStream = null;
    let videoElement = null;
    let updateInterval = null;

    const drawNextFrame = () => {
        const videoWidth = videoElement.getAttribute('width');
        const videoHeight = videoElement.getAttribute('height');
        const scaleWidth = previewCanvasEl.getAttribute('width') / videoWidth;
        const scaleHeight = previewCanvasEl.getAttribute('height') / videoHeight;
        const scale = Math.min(scaleWidth, scaleHeight);
        const scaledWidth = videoWidth * scale;
        const scaledHeight = videoHeight * scale;
        ctx.drawImage(videoElement, (previewCanvasEl.width-scaledWidth)/2, (previewCanvasEl.height-scaledHeight)/2, scaledWidth, scaledHeight);
    };

    const stop = () => {
        if (mediaStream == null) {
            return;
        }
        for (let track of mediaStream.getTracks()) {
            track.stop();
        }
        clearInterval(updateInterval);
        updateInterval = null;

        videoElement.pause();
        videoElement.remove();
        videoElement = null;

        mediaStream = null;
    };

    return {
        start() {
            stop();
            navigator.mediaDevices.getDisplayMedia({video: true})
                .then(stream => {
                    mediaStream = stream;
                    videoElement = document.createElement('video');
                    videoElement.addEventListener('canplay', () => {
                        videoElement.setAttribute('width', videoElement.videoWidth);
                        videoElement.setAttribute('height', videoElement.videoHeight);
                        videoElement.play();
                    });
                    videoElement.srcObject = mediaStream;
                    updateInterval = setInterval(drawNextFrame, 1000 / fps);
                })
                .catch(e => {
                    error(e);
                });
        },

        stop() {
            stop();
        },

        capture() {
            if (mediaStream == null) {
                return;
            }
            const canvas = document.createElement('canvas');
            canvas.height = videoElement.height;
            canvas.width = videoElement.width;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            accept(canvas.toDataURL());
            canvas.remove();
        },
    };
}
