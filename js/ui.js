(() => {

    ///////////////////////////////////////////////////////////////////////////
    // Capture camera

    const captureCameraImage = CaptureCameraImage(document.getElementById('camera-preview'), {
        accept: cropImage,
        error: reportError,
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
    // Capture screen

    const captureScreenImage = CaptureScreenImage(document.getElementById('screen-preview'), {
        accept: cropImage,
        error: reportError,
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
    // Open image file

    const openImageFile = OpenImageFile(document.getElementById('open-file-input'), {
        accept: cropImage,
        error: reportError,
    });
    document.getElementById('btn-open-file').addEventListener('click', () => {
        openImageFile.open();
    });

    ///////////////////////////////////////////////////////////////////////////
    // Drop image

    DropImageFile(document.getElementById('drop-area'), {
        accept: cropImage,
        error: reportError,
    });

    ///////////////////////////////////////////////////////////////////////////
    // Crop image

    const cropperImage = document.getElementById('cropper-image');
    const cropper = new Cropper(cropperImage, {
        viewMode: 0,
        dragMode: 'move',
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
        ocrParameters(imageDataUrl);
    });

    ///////////////////////////////////////////////////////////////////////////
    // Resize canvas on resize window

    const maxCanvasHeight = 500;

    function adjustCanvasSize() {
        const size = canvasSize();

        [
            'camera-preview',
            'screen-preview',
        ].forEach(id => {
            const el = document.getElementById(id);
            if (!el) {
                return;
            }
            el.width = size.width;
            el.height = size.height;
        });
    }

    function canvasSize() {
        const ratio = window.screen.availHeight / window.screen.availWidth;
        let width = window.innerWidth - 20;
        let height = width * ratio;

        if (height > maxCanvasHeight) {
            height = maxCanvasHeight;
            width = height / ratio;
        }

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
    // OCR parameters

    let ocrImage = null;

    window.addEventListener('load', () => {
        const languagesContainer = document.getElementById('ocr-languages');

        for (let langCode in OcrLanguages) {
            const div = document.createElement('div');
            div.classList.add('col-3');

            const id = 'lang-' + langCode;

            const check = document.createElement('div');
            check.classList.add('form-check');
            div.append(check);

            const input = document.createElement('input');
            input.setAttribute('id', id);
            input.setAttribute('type', 'checkbox');
            input.setAttribute('value', langCode);
            input.classList.add('form-check-input');
            if (langCode === 'eng' || langCode === 'rus') {
                input.setAttribute('checked', 'checked');
            }
            check.append(input);

            const label = document.createElement('label');
            label.setAttribute('for', id);
            label.classList.add('form-check-label');
            label.innerText = OcrLanguages[langCode];
            check.append(label);

            languagesContainer.append(div);
        }
    });
    document.getElementById('btn-ocr-params-next').addEventListener('click', () => {
        const languages = collectOcrLanguages();
        console.log(languages);
    });

    ///////////////////////////////////////////////////////////////////////////
    // UI elements visibility

    function cropImage(dataUrl) {
        startVisibility(false);

        captureCameraVisibility(false);
        captureCameraImage.stop();

        captureScreenVisibility(false);
        captureScreenImage.stop();

        cropper.replace(dataUrl);
        cropperVisibility(true);
    }

    function ocrParameters(dataUrl) {
        cropperVisibility(false);
        ocrImage = dataUrl;
        ocrParamsVisibility(true);
    }

    function reportError(e) {
        console.log(e);
    }

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

    function ocrParamsVisibility(value) {
        elementVisibility('ocr-params', value);
    }

    function elementVisibility(id, value) {
        const el = document.getElementById(id);
        if (value) {
            el.classList.remove('d-none');
        } else {
            el.classList.add('d-none');
        }
    }

    function collectOcrLanguages() {
        const container = document.getElementById('ocr-languages');
        const inputs = container.getElementsByTagName('input');
        let value = '';
        for (let idx = 0; idx < inputs.length; idx++) {
            const input = inputs[idx];
            if (input.getAttribute('checked')) {
                if (value.length > 0) {
                    value += '+';
                }
                value += input.getAttribute('value');
            }
        }
        return value;
    }

})();
