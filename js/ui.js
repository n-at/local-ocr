(() => {

    const captureCameraImage = CaptureCameraImage(document.getElementById('camera-preview'), {
        accept: dataUrl => {
            captureCameraImage.stop();
            captureCameraVisibility(false);
            cropper.replace(dataUrl);
            cropperVisibility(true);
        },
        error: e => {
            console.log(e)
        },
    });
    document.getElementById('btn-open-camera').addEventListener('click', () => {
        startVisibility(false);
        captureCameraVisibility(true);
        captureCameraImage.start();
    });
    document.getElementById('btn-open-camera-capture').addEventListener('click', () => {
        captureCameraImage.capture();
    });

    ///////////////////////////////////////////////////////////////////////////

    const captureScreenImage = CaptureScreenImage(document.getElementById('screen-preview'), {
        accept: dataUrl => {
            captureScreenImage.stop();
            captureScreenVisibility(false);
            cropper.replace(dataUrl);
            cropperVisibility(true);
        },
        error: e => {
            console.log(e)
        },
    });
    document.getElementById('btn-open-screenshot').addEventListener('click', () => {
        startVisibility(false);
        captureScreenVisibility(true);
        captureScreenImage.start();
    });
    document.getElementById('btn-capture-screen-capture').addEventListener('click', () => {
        captureScreenImage.capture();
    });

    ///////////////////////////////////////////////////////////////////////////

    const openImageFile = OpenImageFile(document.getElementById('open-file-input'), {
        accept: dataUrl => {
            startVisibility(false);
            cropper.replace(dataUrl);
            cropperVisibility(true);
        },
        error: e => {
            console.log(e.getMessage());
        },
    });
    document.getElementById('btn-open-file').addEventListener('click', () => {
        openImageFile.open();
    });

    ///////////////////////////////////////////////////////////////////////////

    DropImageFile(document.getElementById('drop-area'), {
        accept: dataUrl => {
            startVisibility(false);
            cropper.replace(dataUrl);
            cropperVisibility(true);
        },
        error: e => {
            console.log(e.getMessage());
        },
    });

    ///////////////////////////////////////////////////////////////////////////

    const cropperImage = document.getElementById('cropper-image');
    const cropper = new Cropper(cropperImage, {
        viewMode: 0,
        dragMode: 'move',
        minContainerHeight: 500,
    });
    document.getElementById('btn-crop-crop').addEventListener('click', () => {
        const imageDataUrl = cropper.getCroppedCanvas().toDataURL();
        cropper.replace(imageDataUrl);
    });
    document.getElementById('btn-crop-rotate-left').addEventListener('click', () => {
        cropper.rotate(-90);
    });
    document.getElementById('btn-crop-rotate-right').addEventListener('click', () => {
        cropper.rotate(90);
    });
    document.getElementById('btn-crop-zoom-in').addEventListener('click', () => {
        cropper.zoom(0.2);
    });
    document.getElementById('btn-crop-zoom-out').addEventListener('click', () => {
        cropper.zoom(-0.2);
    });
    document.getElementById('btn-crop-next').addEventListener('click', () => {
        cropperVisibility(false);
        const imageDataUrl = cropper.getCroppedCanvas().toDataURL();
        console.log(imageDataUrl); //TODO
    });

    ///////////////////////////////////////////////////////////////////////////

    function adjustCanvasSize() {
        const canvasIdx = [
            'camera-preview',
            'screen-preview',
        ];
        const size = canvasSize();
        for (let idx = 0; idx < canvasIdx.length; idx++) {
            const el = document.getElementById(canvasIdx[idx]);
            el.width = size.width;
            el.height = size.height;
        }
    }

    function canvasSize() {
        const ratio = window.screen.availHeight / window.screen.availWidth;
        const width = window.innerWidth - 20;
        const height = width * ratio;
        return {
            width,
            height,
        };
    }

    window.addEventListener('resize', () => {
        adjustCanvasSize();
    });
    adjustCanvasSize();

    ///////////////////////////////////////////////////////////////////////////

    function startVisibility(value) {
        elementVisibility('start', value);
    }

    function captureCameraVisibility(value) {
        elementVisibility('capture-camera', value);
    }

    function captureScreenVisibility(value) {
        elementVisibility('capture-screen', value);
    }

    function cropperVisibility(value) {
        elementVisibility('cropper', value);
    }

    function elementVisibility(id, value) {
        const el = document.getElementById(id);
        if (value) {
            el.classList.remove('d-none');
        } else {
            el.classList.add('d-none');
        }
    }

})();
