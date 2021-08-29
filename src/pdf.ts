import { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist/types/display/api";
import { Ref, ref } from "vue";
import * as pdfjs from "pdfjs-dist";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
import JSZip from 'jszip'


export const thumbnail: Ref<{
 url: string,
 bolb: Blob
}[]> = ref([]);

export const loaded = ref(false);
export const pageCount = ref(0)

let loadingTask: Ref<PDFDocumentLoadingTask> | Ref<undefined> = ref(undefined);
let pdf: PDFDocumentProxy | null = null
// constructor(file: File) {

// }

export function selectPdfFile(event: any) {
 const reader = new FileReader()
 reader.onload = (e: any) => {
  loadingTask.value = pdfjs.getDocument(e.target.result);
  loadingTask.value.promise.then(async p => {
   pdf = p
   getPageCount()
   // render thumbnail
   for (let i = 0; i < pageCount.value; i++) {
    thumbnail.value.push(await getPdfBolbByPageNumber({
     scale: 0.5,
     pageNumber: i + 1
    }))
   }
  })
 }
 reader.readAsDataURL(event.currentTarget.files[0])
}

export async function downloadPageByNumber(event: MouseEvent, index: number) {
 let node = event.currentTarget as HTMLAnchorElement
 if (node.getAttribute('href')) {
  return
 }

 if (!pdf) {
  return
 }

 const bolb = await renderPage(pdf, {
  scale: 4,
  pageNumber: index
 })

 const url = URL.createObjectURL(bolb)
 node.href = url
 node.click()

}


export async function downloadWithZip(event: MouseEvent) {
 let node = event.currentTarget as HTMLAnchorElement
 if (node.getAttribute('href')) {
  return
 }

 if (!pdf) {
  return
 }
 var zip = new JSZip();

 for (let i = 0; i < pageCount.value; i++) {
  const bolb = await renderPage(pdf, {
   scale: 4,
   pageNumber: i + 1
  })
  zip.file(`${i + 1}.png`, bolb);
 }

 zip.generateAsync({ type: "blob" })
  .then(function (content) {

   console.log('ok')
   // see FileSaver.js
   const url = URL.createObjectURL(content)
   node.href = url
   node.click()
  });


}

export function getPageCount() {
 if (!pdf) {
  return
 }
 pageCount.value = pdf.numPages
}

export function renderPage(
 pdf: PDFDocumentProxy,
 param: {
  scale: number;
  pageNumber: number;
 }
) {
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

export async function getPdfBolbByPageNumber(param: {
 pageNumber: number,
 scale: number
}): Promise<{
 url: string,
 bolb: Blob
}> {

 if (!pdf) {
  throw new Error('pdf not found')
 }

 const bolb = await renderPage(pdf, {
  scale: param.scale,
  pageNumber: param.pageNumber
 });
 let url = URL.createObjectURL(bolb);
 return {
  url,
  bolb: bolb as Blob
 }
}


