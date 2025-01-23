<script lang="ts" setup>

import KoFiIcon from '../icons/KoFiIcon.vue'
import {ref} from "vue";
import {ColorCategory} from "../../code/type/ColorCategory.ts";
import {NTC} from "../ntc/ntc.ts";
import {rgbaToComposeHex, rgbaToCssString, rgbaToHexString, showToast, writeTextToClipboard} from "../utils";
import CopyCssIcon from "../icons/CopyCSSIcon.vue";
import CopyComposeIcon from "../icons/CopyComposeIcon.vue";
import CopyXMLIcon from "../icons/CopyXMLIcon.vue";

const ntc = new NTC()
const colorCategories = ref<ColorCategory[]>([]);

window.onmessage = (event: MessageEvent) => {
  colorCategories.value = event.data.pluginMessage as ColorCategory[]
};

function nameThatColor(rgba: RGBA) {
  const colorMatch = ntc.name(rgbaToCssString({...rgba, a: 1}))
  const name = colorMatch.name
  const opacity = (rgba.a * 100).toFixed(0)
  const approx = !colorMatch.exactMatch ? "Approx" : ''

  return `${name} ${approx} ${opacity} `.trim()
}

const copyCSS = (rgba: RGBA) => {
  const codeCSS = convertToCSSVariable(nameThatColor(rgba), rgbaToCssString(rgba))
  writeTextToClipboard(codeCSS);
  showToast('Copied CSS Color Style')
  console.log(codeCSS)
};

function convertToCSSVariable(colorName: string, colorCSS: string): string {
  const lowerCased = colorName.toLowerCase();
  const hyphenated = lowerCased.replace(/\s+/g, '-');

  return `--${hyphenated}: ${colorCSS};`;
}

function copyCompose(rgba: RGBA) {
  const colorHex = rgbaToComposeHex(rgba);
  const colorName = nameThatColor(rgba);
  const composeCode = convertToComposeVariable(colorName, colorHex);
  writeTextToClipboard(composeCode);
  showToast('Copied Compose Color');
  console.log(composeCode);
}

function convertToComposeVariable(name: string, color: string): string {
  const pascalCased = name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');

  return `val ${pascalCased} = Color(${color})`;
}

function copyXML(rgba: RGBA) {
  const colorHex = rgbaToHexString(rgba);
  const colorName = nameThatColor(rgba); // Assuming this function returns a color name
  const xmlColorResource = convertToXMLVariable(colorName, colorHex);
  writeTextToClipboard(xmlColorResource);
  showToast('Copied XML Color');
  console.log(xmlColorResource);
}

function convertToXMLVariable(name: string, color: string): string {
  const snakeCasedName = name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '')

  return `<color name="${snakeCasedName}">${color}</color>`;
}
</script>

<template>
  <div class="container">
    <ul class="type">
      <li v-for="{type , rgbaList } in colorCategories">
        <h2>{{ type }}</h2>
        <ul class="name-that-color">
          <li class="info" v-for="rgba in rgbaList">
            <div
                class="preview"
                :style="{backgroundColor: rgbaToCssString(rgba)}"
            ></div>
            <div class="tooltip">
              <span class="name">{{ nameThatColor(rgba) }}</span>
              <span class="text">{{ nameThatColor(rgba) }}</span>
            </div>
            <div class="btn-group">
              <button class="btn copy" @click="copyCSS(rgba)">
                <CopyCssIcon/>
              </button>
              <button class="btn copy" @click="copyCompose(rgba)">
                <CopyComposeIcon/>
              </button>
              <button class="btn copy" @click="copyXML(rgba)">
                <CopyXMLIcon/>
              </button>
            </div>
          </li>
        </ul>
      </li>
    </ul>

    <a class="btn kofi" href="https://ko-fi.com/oubbadbrahim" target="_blank">
      <KoFiIcon/>
      <span>Buy me a coffee</span>
    </a>
  </div>
</template>

<style scoped>

h2 {
  font-size: 1.8rem;
}

.type {
  padding: 1.2rem;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.type > :last-child {
  margin-bottom: 3.8rem;
}

.name-that-color {
  padding: 1.2rem 0.8rem;
  border-radius: 0.8rem;
  border: 0.1rem solid white;
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.tooltip {
  position: relative;
  flex-grow: 1;
}

.tooltip .text {
  position: absolute;
  bottom: 100%;
  left: 0;
  white-space: nowrap;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 0.2rem 0.4rem;
  border-radius: 0.4rem 0.4rem 0.4rem 0;
  font-size: 1rem;
  transition: all 300ms ease-in-out;
  visibility: hidden;
  opacity: 0;
}

.tooltip .text::after {
  content: " ";
  position: absolute;
  top: 100%;
  left: 0;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.3) transparent transparent transparent;
}

.tooltip:hover .text {
  visibility: visible;
  opacity: 1;
}

.name {
  font-size: 1.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.info {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.preview {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  border: white solid 0.1rem;
  flex-shrink: 0;
}

.btn-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
}

.btn {
  font-family: inherit;
  background-color: var(--ebony-clay);
  border-width: 0.1rem;
  border-style: solid;
  border-color: white;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: 300ms;
}

.btn.copy {
  width: 2.4rem;
  height: 2.4rem;
  flex-shrink: 0;
}

.btn.copy > * {
  width: 100%;
  height: 100%;
}

.btn.kofi {
  position: absolute;
  bottom: 0.8rem;
  display: flex;
  align-items: center;
  left: 0.8rem;
  overflow: hidden;
  border-radius: 0.4rem;
  padding: 0.4rem;
}

.btn.kofi span {
  display: flex;
  align-items: center;
  max-width: 0;
  opacity: 0;
  white-space: nowrap;
  transition: 300ms ease-out;
}

.btn.kofi:hover span {
  max-width: 15ch;
  margin-left: 0.4rem;
  margin-right: 0.4rem;
  opacity: 1;
}

.btn:not(:disabled):not(:active):hover {
  border-color: white;
}

.btn:active,
.btn:hover {
  color: greenyellow;
  border-color: greenyellow !important;
}
</style>