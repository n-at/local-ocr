function CaptureCameraImage(el, options) {
    if (!el) {
        throw new Error('el required');
    }

    const accept = options.accept ? options.accept : () => {};
    const error = options.error ? options.error : () => {};
    const fps = options.fps ? options.fps : 30;

    const ctx = el.getContext('2d');

    let mediaStream = null;
    let videoElement = null;
    let updateInterval = null;

    const drawNextFrame = () => {
        const videoWidth = videoElement.getAttribute('width');
        const videoHeight = videoElement.getAttribute('height');
        const scaleWidth = el.getAttribute('width') / videoWidth;
        const scaleHeight = el.getAttribute('height') / videoHeight;
        const scale = Math.min(scaleWidth, scaleHeight);
        ctx.drawImage(videoElement, 0, 0, videoWidth * scale, videoHeight * scale);
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
            navigator.mediaDevices.getUserMedia({video: true})
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
            if (mediaStream != null) {
                accept(el.toDataURL());
            }
        },
    };
}
