function DropImageFile(el, options) {
    if (!el) {
        throw new Error('el required');
    }

    const accept = options.accept ? options.accept : () => {};
    const error = options.error ? options.error : () => {};

    el.addEventListener('dragover', e => {
        e.preventDefault();
        el.classList.add('drag-over');
    });
    el.addEventListener('drop', e => {
        e.preventDefault();
        el.classList.remove('drag-over');
        if (!e.dataTransfer || !e.dataTransfer.items || !e.dataTransfer.items.length === 0) {
            return;
        }
        const item = e.dataTransfer.items[0];
        if (item.kind !== 'file') {
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            accept(reader.result);
        });
        reader.addEventListener('error', e => {
            error(e);
        });
        reader.readAsDataURL(item.getAsFile());
    });

    return {}
}
