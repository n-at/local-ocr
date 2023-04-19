window.addEventListener('load', () => {
    const image = document.getElementById('crop');
    const cropper = new Cropper(image, {
        viewMode: 0,
        dragMode: 'move',
        minContainerHeight: 500,
    });

    document.getElementById('btn-crop').addEventListener('click', () => {
        const imageDataUrl = cropper.getCroppedCanvas().toDataURL();
        cropper.replace(imageDataUrl);
    });
    document.getElementById('btn-rotate-left').addEventListener('click', () => {
        cropper.rotate(-90);
    });
    document.getElementById('btn-rotate-right').addEventListener('click', () => {
        cropper.rotate(90);
    });
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
        cropper.zoom(0.2);
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
        cropper.zoom(-0.2);
    });
});
