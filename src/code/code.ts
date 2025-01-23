import {ColorsType} from "./type/ColorsType";
import {ColorCategory} from "./type/ColorCategory";
import {ShadowEffect} from "./type/ShadowEffect";

figma.showUI(__html__, {themeColors: true, width: 400, height: 200});
figma.loadAllPagesAsync();
figma.on("selectionchange", getAllAvailableColors);
figma.on("documentchange", getAllAvailableColors);

figma.ui.onmessage = (msg: { type: string; message: string }) => {
    if (msg.type === "toast-message") {
        figma.notify(msg.message);
    }
};

if (figma.currentPage.selection.length != 0) {
    getAllAvailableColors();
}

function getAllAvailableColors() {
    const colorCategories: ColorCategory[] = []
    if (figma.currentPage.selection.length == 1) {
        const node = figma.currentPage.selection[0];

        const fillColors = getFillColors(node);
        if (fillColors.length > 0) {
            colorCategories.push({
                type: ColorsType.Fills,
                rgbaList: fillColors
            });
        }

        const strokeColors = getStrokeColors(node);
        if (strokeColors.length > 0) {
            colorCategories.push({
                type: ColorsType.Strokes,
                rgbaList: strokeColors
            });
        }

        const effectColors = getEffectColors(node);
        if (effectColors.length > 0) {
            colorCategories.push({
                type: ColorsType.Effects,
                rgbaList: effectColors
            });
        }

    }
    figma.ui.postMessage(colorCategories);
}

function getFillColors(node: SceneNode): RGBA[] {
    const fills = (node as MinimalFillsMixin).fills as ReadonlyArray<Paint>;
    return getColors(fills);
}

function getStrokeColors(node: SceneNode): RGBA[] {
    const strokes = (node as MinimalStrokesMixin).strokes;
    return getColors(strokes);
}

function getEffectColors(node: SceneNode): RGBA[] {
    const effects = (node as BlendMixin).effects;
    return effects.reduce<RGBA[]>((colors, effect) => {
        if (effect.visible && isShadowEffect(effect)) {
            colors.push(effect.color);
        }
        return colors;
    }, []);
}

function isShadowEffect(effect: Effect): effect is ShadowEffect {
    return effect.type === "INNER_SHADOW" || effect.type === "DROP_SHADOW";
}

function getColors(paints: readonly Paint[]): RGBA[] {
    let rgba: RGBA[] = [];
    paints.forEach((paints) => {
        switch (paints.type) {
            case "SOLID": {
                const {r, g, b} = paints.color;
                const a = paints.opacity !== undefined ? paints.opacity : 1;
                rgba.push({r, g, b, a});
                break;
            }
            case "GRADIENT_LINEAR":
            case "GRADIENT_RADIAL":
            case "GRADIENT_ANGULAR":
            case "GRADIENT_DIAMOND": {
                paints.gradientStops.forEach((stop) => {
                    rgba.push(stop.color);
                });
                break;
            }
            default:
                console.log(`Unsupported paints type: ${paints.type}`);
        }
    });
    return rgba.reverse();
}