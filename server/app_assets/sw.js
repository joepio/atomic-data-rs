if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const o=e=>a(e,c),r={module:{uri:c},exports:t,require:o};s[c]=Promise.all(i.map((e=>r[e]||o(e)))).then((e=>(n(...e),t)))}}define(["./workbox-b77c083a"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.css",revision:"9fe407de805ff09adf45038cd1428e1e"},{url:"assets/index.js",revision:"cac871fd020beb71ca139924918293a8"},{url:"assets/index2.css",revision:"405a9a0bb47821933fc73abec4c75710"},{url:"assets/index2.js",revision:"b847323c124881d583a813e2482f62f8"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"app_data/images/android-chrome-192x192.png",revision:"0c18f249158fb1312653ba5d58f99694"},{url:"app_data/images/android-chrome-512x512.png",revision:"fb7c0555e46c69807e43c38fc64e9b02"},{url:"app_data/images/maskable_icon.png",revision:"b2028eea26b14b5638e7dbdfe1fc044f"},{url:"app_data/images/maskable_icon_x512.png",revision:"9338a856b023f814f9bd9b6c9b58f3f5"},{url:"app_data/images/maskable_icon_x384.png",revision:"c83fdfe79ab1541a7b6f3dceec70a200"},{url:"app_data/images/maskable_icon_x192.png",revision:"dc9b09a2eff18baf7366764ac4c5bdca"},{url:"app_data/images/maskable_icon_x128.png",revision:"e2c63434d1928dedec819db66a473a98"},{url:"manifest.webmanifest",revision:"aa69e1459876f46ce0334485cb3ddfea"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i,new e.CacheFirst({cacheName:"gstatic-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
//# sourceMappingURL=sw.js.map
