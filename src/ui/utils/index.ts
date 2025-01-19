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
    { pluginMessage: { type: "toast-message", message } },
    "*"
  );
};

export const rgbaToCssString = (color: RGBA, opacity: number = 1): string => {
  const { r, g, b, a } = color;

  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);
  const alpha = Math.round(a * opacity * 100);

  return rgbaOrHexConvert(red, green, blue, alpha);
};

const rgbaOrHexConvert = (
    red: number,
    green: number,
    blue: number,
    alpha: number
) => {
  return alpha === 100
      ? rgbToHex(red, green, blue)
      : `rgba(${red}, ${green}, ${blue}, ${alpha}%)`;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error(
        "Invalid RGB value. Each component must be between 0 and 255."
    );
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const toHex = (value: number): string => {
  const hex = value.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};