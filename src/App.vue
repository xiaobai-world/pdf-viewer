<template>
 <div class="pdf-viewer" :class="{ loading }">
  <div class="control">
   <label>
    <input type="file" @change="selectPdfFile" :id="domId" />
    Select PDF
   </label>
   <a @click="downloadWithZip" v-if="thumbnail.length > 0">Download with Zip</a>
  </div>

  <div class="img-wrapper">
   <div v-for="(item, idx) in thumbnail" :key="idx">
    <img :src="item.url" />
    <a @click="downloadPageByNumber($event, idx + 1)" :download="`${idx}.png`"
     >Download</a
    >
   </div>
  </div>
  <canvas id="the-canvas"></canvas>
 </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
 thumbnail,
 loading,
 pageCount,
 selectPdfFile,
 downloadPageByNumber,
 downloadWithZip,
} from "./pdf";

export default defineComponent({
 setup() {
  const domId = `file_${Math.random().toString(36)}`;
  return {
   domId,
   thumbnail,
   loading,
   pageCount,
   selectPdfFile,
   downloadPageByNumber,
   downloadWithZip,
  };
 },
 name: "App",
});
</script>

<style scoped lang="less">
.pdf-viewer {
 margin: 0 auto;
 display: block;
 position: relative;
 user-select: none;
 &.loading {
  &::after {
   display: flex;
   align-items: center;
   justify-content: center;
   content: "please wait ....";
   position: absolute;
   left: 0;
   right: 0;
   top: 0;
   bottom: 0;
   z-index: 2;
   background: rgba(0, 0, 0, 0.5);
   font-size: 120%;
   color: #fff;
  }
 }
 > .control {
  display: flex;
  padding: 2em 0 2em 0;
  align-items: center;
  justify-content: center;
  > label,
  > a {
   border: solid 5px currentColor;
   color: rgb(10, 182, 145);
   padding: 1em;
   font-size: 16px;
   margin: 0 1em;
   border-radius: 5px;
   white-space: nowrap;
   text-decoration: none;
  }
  > label {
   overflow: hidden;
   position: relative;
   text-align: center;
   word-spacing: 0.5em;
   input {
    position: absolute;
    opacity: 0;
   }
  }
  > a {
   color: rgb(18, 63, 160);
  }
 }
 .img-wrapper {
  display: flex;
  flex-flow: wrap;
  align-content: flex-start;
  margin: 0 1em;
  > div {
   flex: 0 0 100px;
   padding: 0.5em;
   box-sizing: border-box;
   overflow: hidden;
   position: relative;
   > a {
    position: absolute;
    right: 1em;
    bottom: 1em;
    color: #fff;
    text-decoration: none;
    background: cadetblue;
    padding: 0.2em 0.3em;
    border-radius: 0.2em;
    font-size: 12px;
   }
   > img {
    border: solid 1px rgb(10, 182, 145);
    border-radius: 0.5em;
    max-width: 100%;
    max-height: 100%;
    display: block;
   }
  }
 }

 canvas {
  max-width: 400px;
  opacity: 0;
 }
}
</style>
