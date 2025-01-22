<script lang="ts" setup>

import KoFiIcon from '../icons/KoFiIcon.vue'
import {ref} from "vue";
import {ColorCategory} from "../../code/type/ColorCategory.ts";
import {NTC} from "../ntc/ntc.ts";
import {rgbaToCssString} from "../utils";
import CopyCssIcon from "../icons/CopyCSSIcon.vue";
import CopyComposeIcon from "../icons/CopyComposeIcon.vue";
import CopyXMLIcon from "../icons/CopyXMLIcon.vue";

const ntc = new NTC()
const colorCategories = ref<ColorCategory[]>([]);

window.onmessage = (event: MessageEvent) => {
  colorCategories.value = event.data.pluginMessage as ColorCategory[]
};

const nameThatColor = (rgba: RGBA) => {
  const colorMatch = ntc.name(rgbaToCssString({...rgba, a: 1}))
  const name = colorMatch.name
  const opacity = (rgba.a * 100).toFixed(0)
  const approx = !colorMatch.exactMatch ? "approx" : ''

  return `${name} ${approx} ${opacity} `.trim()
}

const copyCSS = () => {
  // writeTextToClipboard(code.value);
  // showToast('Copied')
  console.log("copyCSS")
};

const copyCompose = () => {
  // writeTextToClipboard(code.value);
  // showToast('Copied')
  console.log("copyCompose")
};

const copyXML = () => {
  // writeTextToClipboard(code.value);
  // showToast('Copied')
  console.log("copyXML")
};

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
            <span class="name">{{ nameThatColor(rgba) }}</span>
            <div class="btn-group">
              <button class="btn copy" @click="copyCSS()">
                <CopyCssIcon/>
              </button>
              <button class="btn copy" @click="copyCompose()">
                <CopyComposeIcon/>
              </button>
              <button class="btn copy" @click="copyXML()">
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
  padding: 0.8rem;
  border-radius: 0.8rem;
  border: 0.1rem solid white;
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.name {
  font-size: 1.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
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