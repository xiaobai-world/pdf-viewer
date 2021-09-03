import { createApp } from 'vue'
import App from './App.vue'
import { mount } from '@xiaobai-world/api'
import { appRootPath } from './app-info'
import * as pdfjs from "pdfjs-dist";

function render(selector: string) {
 createApp(App).mount(selector)
}

mount((selector, appInfo) => {
 appRootPath.value = appInfo.appRootPath
 pdfjs.GlobalWorkerOptions.workerSrc = `${appRootPath.value}/pdf.worker.js`;
 render(selector)
}).catch(() => {
 render('#app')
})
