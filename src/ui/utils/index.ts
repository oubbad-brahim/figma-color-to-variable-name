export const writeTextToClipboard = (text: string) => {
    const prevActive = document.activeElement as HTMLElement;
    const textArea = document.createElement("textarea");

    textArea.value = text;

    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    return new Promise<void>((res, rej) => {
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
        prevActive.focus();
    });
};

export const showToast = (message: string) => {
    parent.postMessage(
        {pluginMessage: {type: "toast-message", message}},
        "*"
    );
};

const toHex = (value: number): string => Math.round(value * 255).toString(16).padStart(2, '0');

const toHexUpperCase = (value: number) => toHex(value).toUpperCase();

export const rgbaToCssString = (color: RGBA): string => {
    const {r, g, b, a} = color;

    const red = Math.round(r * 255);
    const green = Math.round(g * 255);
    const blue = Math.round(b * 255);
    const alpha = Math.round(a * 100);

    const rHex = toHex(r);
    const gHex = toHex(g);
    const bHex = toHex(b);

    return alpha === 100
        ? `#${rHex}${gHex}${bHex}`
        : `rgba(${red}, ${green}, ${blue}, ${alpha}%)`;
};

export const rgbaToComposeHex = (rgba: RGBA): string => {
    const rHex = toHexUpperCase(rgba.r);
    const gHex = toHexUpperCase(rgba.g);
    const bHex = toHexUpperCase(rgba.b);
    const aHex = toHexUpperCase(rgba.a);

    return `0x${aHex}${rHex}${gHex}${bHex}`;
}

export const rgbaToHexString = (rgba: RGBA): string => {
    const rHex = toHexUpperCase(rgba.r);
    const gHex = toHexUpperCase(rgba.g);
    const bHex = toHexUpperCase(rgba.b);
    const aHex = toHexUpperCase(rgba.a);

    return `#${aHex}${rHex}${gHex}${bHex}`;
}