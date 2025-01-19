/*

+-----------------------------------------------------------------+
|     Created by Chirag Mehta - http://chir.ag/projects/ntc       |
|-----------------------------------------------------------------|
|               ntc ts (Name that Color TypeScript)               |
+-----------------------------------------------------------------+

All the functions, code, lists, etc., have been written specifically
for the Name that Color JavaScript by Chirag Mehta unless otherwise
specified.

This script is released under the: Creative Commons License:
Attribution 2.5 http://creativecommons.org/licenses/by/2.5/

*/

import nameThatColorListData from "../assets/json/colors-name.json";
import {ColorName} from "../type/color-name";
import {ColorMatch} from "../type/color-match";

export class NTC {
    private nameThatColorList: ColorName[] = nameThatColorListData;

    constructor() {
        this.init();
    }

    private init(): void {
        for (const color of this.nameThatColorList) {
            const rgb = this.rgb(`#${color.hex}`);
            const hsl = this.hsl(`#${color.hex}`);
            color.r = rgb[0];
            color.g = rgb[1];
            color.b = rgb[2];
            color.h = hsl[0];
            color.s = hsl[1];
            color.l = hsl[2];
        }
    }

    public name(color: string): ColorMatch {
        color = color.toUpperCase();
        if (color.length < 3 || color.length > 7) {
            return {
                rgb: "#000000",
                name: `Invalid Color: ${color}`,
                exactMatch: false,
            };
        }
        if (color.length % 3 === 0) {
            color = `#${color}`;
        }
        if (color.length === 4) {
            color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
        }

        const rgb = this.rgb(color);
        const hsl = this.hsl(color);
        let closestIndex = -1;
        let closestDistance = -1;

        for (let i = 0; i < this.nameThatColorList.length; i++) {
            const nameColor = this.nameThatColorList[i];
            if (color === `#${nameColor.hex}`) {
                return {
                    rgb: `#${nameColor.hex}`,
                    name: nameColor.name,
                    exactMatch: true,
                };
            }

            const rgbDistance =
                Math.pow(rgb[0] - (nameColor.r ?? 0), 2) +
                Math.pow(rgb[1] - (nameColor.g ?? 0), 2) +
                Math.pow(rgb[2] - (nameColor.b ?? 0), 2);
            const hslDistance =
                Math.pow(hsl[0] - (nameColor.h ?? 0), 2) +
                Math.pow(hsl[1] - (nameColor.s ?? 0), 2) +
                Math.pow(hsl[2] - (nameColor.l ?? 0), 2);
            const totalDistance = rgbDistance + hslDistance * 2;

            if (closestDistance < 0 || totalDistance < closestDistance) {
                closestDistance = totalDistance;
                closestIndex = i;
            }
        }

        if (closestIndex < 0) {
            return {
                rgb: "#000000",
                name: `Invalid Color: ${color}`,
                exactMatch: false,
            };
        }

        const closestColor = this.nameThatColorList[closestIndex];
        return {
            rgb: `#${closestColor.hex}`,
            name: closestColor.name,
            exactMatch: false,
        };
    }

    private hsl(color: string): [number, number, number] {
        const r = parseInt(color.substring(1, 3), 16) / 255;
        const g = parseInt(color.substring(3, 5), 16) / 255;
        const b = parseInt(color.substring(5, 7), 16) / 255;

        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        const delta = max - min;
        let h = 0;
        let s = 0;
        const l = (min + max) / 2;

        if (delta > 0) {
            s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            if (max === r) {
                h = (g - b) / delta + (g < b ? 6 : 0);
            } else if (max === g) {
                h = (b - r) / delta + 2;
            } else if (max === b) {
                h = (r - g) / delta + 4;
            }
            h /= 6;
        }

        return [Math.round(h * 255), Math.round(s * 255), Math.round(l * 255)];
    }

    private rgb(color: string): [number, number, number] {
        return [
            parseInt(color.substring(1, 3), 16),
            parseInt(color.substring(3, 5), 16),
            parseInt(color.substring(5, 7), 16),
        ];
    }
}