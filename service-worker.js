if(!self.define){let e,i={};const t=(t,s)=>(t=new URL(t+".js",s).href,i[t]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=i,document.head.appendChild(e)}else e=t,importScripts(t),i()})).then((()=>{let e=i[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(s,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let o={};const d=e=>t(e,r),c={module:{uri:r},exports:o,require:d};i[r]=Promise.all(s.map((e=>c[e]||d(e)))).then((e=>(n(...e),o)))}}define(["./workbox-7d6a3f4d"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"82f40c946a94ca440f9e42b6846707bd"},{url:"main.js",revision:"fc5028f20ac9d878625161ae6da656ea"},{url:"main.js.LICENSE.txt",revision:"7da11dff125bd1573054b04e8cd319b5"}],{})}));
