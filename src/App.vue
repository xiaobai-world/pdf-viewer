<template>
 <div>
  <label>
   <input type="file" ref="download" />
   Select PDF
  </label>

  <div class="img-wrapper">
   <div v-for="(item, idx) in thumbnail" :key="idx">
    <img :src="item" />
   </div>
  </div>
  <canvas id="the-canvas"></canvas>
 </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import * as pdfjs from "pdfjs-dist";
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

export default defineComponent({
 setup() {
  const download = ref(null);
  const thumbnail: Ref<string[]> = ref([]);
  return {
   download,
   thumbnail,
  };
 },
 name: "App",
 mounted() {
  // Asynchronous download of PDF
  var loadingTask = pdfjs.getDocument("/demo.pdf");

  /** */
  const renderPage = (
   pdf: PDFDocumentProxy,
   param: {
    scale: number;
    pageNumber: number;
   }
  ) => {
   return new Promise((resolve) => {
    pdf.getPage(param.pageNumber).then((page) => {
     console.log("Page loaded");

     var viewport = page.getViewport({ scale: param.scale });

     // Prepare canvas using PDF page dimensions
     const canvas: HTMLCanvasElement = document.getElementById(
      "the-canvas"
     ) as HTMLCanvasElement;
     var context = canvas.getContext("2d");
     canvas.height = viewport.height;
     canvas.width = viewport.width;

     // Render PDF page into canvas context
     if (!context) {
      return;
     }
     var renderTask = page.render({
      canvasContext: context,
      viewport: viewport,
     });
     renderTask.promise.then(() => {
      canvas.toBlob((bolb) => {
       resolve(bolb);
      });
     });
    });
   });
  };

  loadingTask.promise.then(
   async (pdf) => {
    console.log("PDF loaded", this);

    console.log(await pdf.numPages);

    for (let i = 0; i < pdf.numPages; i++) {
     const bolb = await renderPage(pdf, {
      scale: 0.5,
      pageNumber: i + 1,
     });
     let url = URL.createObjectURL(bolb);
     this.thumbnail.push(url);
    }
   },
   function (reason) {
    // PDF loading error
    console.error(reason);
   }
  );
 },
});
</script>

<style scoped lang="less">
div {
 margin: 0 auto;
 display: block;
 > label {
  display: block;
  margin: 0 1em 2em auto;
  border: solid 5px rgb(10, 182, 145);
  color: rgb(10, 182, 145);
  padding: 1em;
  overflow: hidden;
  position: relative;
  text-align: center;
  border-radius: 5px;
  font-size: 23px;
  word-spacing: 0.5em;
  input {
   position: absolute;
   opacity: 0;
  }
 }
 .img-wrapper {
  display: flex;
  flex-wrap: wrap;
  margin: 0 1em;
  > div {
   border: solid 1px rgb(10, 182, 145);
   width: 119px;
   height: 168px;
   display: flex;
   align-items: center;
   justify-content: center;
   margin: 0.5em;
   border-radius: 0.5em;
   overflow: hidden;
   > img {
    max-width: 100%;
    max-height: 100%;
   }
  }
 }

 canvas {
  max-width: 400px;
  opacity: 0;
 }
}
</style>
