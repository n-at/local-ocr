/**
 * @param el HTMLElement
 * @param options Object
 */
function OpenImageFile(el, options) {
    if (!el) {
        throw new Error('el required');
    }

    const accept = options.accept ? options.accept : () => {};
    const error = options.error ? options.error : () => {};

    el.addEventListener('change', () => {
        if (!el.files || el.files.length === 0) {
            return;
        }
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            accept(reader.result);
        });
        reader.addEventListener('error', e => {
            error(e);
        });
        reader.readAsDataURL(el.files[0]);
    });

    return {
        open() {
            el.click();
        },
    };
}
