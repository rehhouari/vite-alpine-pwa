class t{constructor(t,e){this.path=t,this.settings=e}setProps(t){this.props=t}handle(t){if("function"==typeof this.settings.handler)return this.settings.handler(t)}}var e=!(!window.history.location&&!window.location);function n(t,e){switch(e){case!0:t.endsWith("/")||(t+="/");break;case!1:t.endsWith("/")&&(t=t.substr(0,t.length-1))}return t}function i(t,n=null){document.querySelectorAll("a").forEach((i=>{i.hasAttribute("x-link")||0!=function(t,n){for(;t&&"A"!==t.nodeName.toUpperCase();)t=t.parentNode;if(!t||"A"!==t.nodeName.toUpperCase())return!1;var i="object"==typeof t.href&&"SVGAnimatedString"===t.href.constructor.name;if(t.hasAttribute("download")||"external"===t.getAttribute("rel"))return!1;var s=t.getAttribute("href");return n||!function(t){if(!e)return!1;var n=window.location;return t.pathname===n.pathname&&t.search===n.search}(t)||!t.hash&&"#"!==s?!((s=t.getAttribute("href"))&&s.indexOf("mailto:")>-1||(i?t.target.baseVal:t.target)||!i&&!function(t){if(!t||!e)return!1;var n=function(t){if("function"==typeof URL&&e)return new URL(t,window.location.toString());var n=window.document.createElement("a");return n.href=t,n}(t),i=window.location;return i.protocol===n.protocol&&i.hostname===n.hostname&&(i.port===n.port||""===i.port&&(80==n.port||443==n.port))}(t.href)):void 0}(i,t)&&(i.setAttribute("x-link",""),null!=n&&i.addEventListener("mouseover",(t=>{if(!n.enabled||!n.preload)return;let e=t.target.getAttribute("href");null==e&&(e="/"),n.preloaded.path!=e&&window.setTimeout((function(){fetch(e).then((t=>t.text())).then((t=>{n.preloaded.path=e,n.preloaded.content=t}))}))})),i.addEventListener("click",(e=>{e.preventDefault();let n=i.pathname;t?window.location.hash="#"+n:AlpineRouter.navigate(n)}),!1))}))}function s(t,e){document.querySelector(e).innerHTML=t}function r(t,e,n){let i=(new DOMParser).parseFromString(t,"text/html");i=i.querySelector(e);let r=function(t,e,n){let i=t.querySelectorAll("[x-router]");switch(i.length){case 0:"body"==e&&(n=[]);break;case 1:document.querySelector("[x-router]").setAttribute("x-router",""),i[0].isEqualNode(document.querySelector("[x-router]"))?(i[0].setAttribute("x-router","loaded"),document.querySelector("[x-router]").remove()):(n=[],document.querySelector("[x-router]").remove());break;default:throw new Error("Alpine Router: there can only be one router in the same page")}return{doc:t,routes:n}}(i,e,n);return i=r.doc,s(t=i.innerHTML,e),r.routes}function o(t,e,n){return{route:t,path:e,props:n,query:window.location.search.substring(1),hash:window.location.hash.substring(1),go:t=>(window.AlpineRouter.navigate(t),!1)}}const a={version:"0.0.8",routes:[],settings:{interceptLinks:!0,basepath:"/",trailingSlash:null,hash:!1,allowNoHandler:!1,pushNotfoundToHistory:!0,render:{enabled:!1,selector:"body",preload:!0,preloadtime:200,preloaded:{path:null,content:null}},views:{enabled:!1,basepath:"/",selector:"#content",notfound:null,static:!1,cached:[]}},loaded:!1,currentContext:null,routerloaded:new Event("routerloaded"),loadstart:new Event("loadstart"),loadend:new Event("loadend"),notfound:function(t){console.error(`Alpine Router: requested path ${t.path} was not found`)},start(){if(!window.Alpine)throw new Error("Alpine is require for `Alpine Router` to work.");let t=0;Alpine.onComponentInitialized((e=>{if(e.$el.hasAttribute("x-router")){if("loaded"==e.$el.getAttribute("x-router"))return;if(t>1)throw new Error("Alpine Router: Only one router can be in a page.");if(e.$el.hasAttribute("x-base")&&(this.settings.basepath=e.$el.getAttribute("x-base")),e.$el.hasAttribute("x-hash")&&(this.settings.hash=!0),e.$el.hasAttribute("x-slash")){let t=e.$el.getAttribute("x-slash");if("add"==t||""==t)t=!0;else{if("remove"!=t)throw new Error('Alpine Router: Invalid value suplied to x-slash must be either "add", "remove", or empty');t=!1}this.settings.trailingSlash=t}if(e.$el.hasAttribute("x-render")){if(this.settings.hash)throw new Error("Alpine Router: Cannot use x-render along with x-hash.");this.settings.render.enabled=!0;let t=e.$el.getAttribute("x-render");""!=t&&(this.settings.render.selector=t),this.notfound=null,this.settings.allowNoHandler=!0}if(e.$el.hasAttribute("x-views")){if(this.settings.render.enabled)throw new Error("Alpine Router: Cannot use x-views along with x-render.");this.settings.views.enabled=!0;let t=e.$el.getAttribute("x-views");if("body"==t)throw new Error("Alpine Router: Do not use body as the selector, it will cause the router component to be removed");""!=t&&(this.settings.views.selector=t),e.$el.hasAttribute("x-static")&&(this.settings.views.static=!0),this.notfound=null,this.settings.allowNoHandler=!0}if(Array.from(e.$el.children).forEach((t=>{t.hasAttribute("x-route")&&this.processRoute(t,e)})),e.$el.setAttribute("x-router","loaded"),t++,this.settings.hash){if(""==window.location.hash)return void(document.location.href=window.location.pathname+"#/");this.navigate(window.location.hash.substring(1),!0,!0)}else this.navigate(window.location.pathname,!1,!0);this.loaded=!0,window.dispatchEvent(this.routerloaded)}})),i(this.settings.hash,this.settings.render),window.addEventListener("popstate",(()=>{this.settings.hash?""!=window.location.hash&&this.navigate(window.location.hash.substring(1),!0):this.navigate(window.location.pathname,!0)})),Alpine.addMagicProperty("router",(()=>window.AlpineRouter.currentContext))},processRoute(t,e){if("template"!==t.tagName.toLowerCase())throw new Error("Alpine Router: x-route must be used on a template tag.");let i=t.getAttribute("x-route");if("string"!=typeof i)throw new Error(`Alpine Router: x-route must be a string, ${typeof i} given.`);if(i.indexOf("#")>-1)throw new Error("Alpine Router: A route's path may not have a hash, using x-hash is sufficiant.");let s=null;if(this.settings.views.enabled){if(0==t.hasAttribute("x-view"))throw new Error("Alpine Router: route must have an x-view attribute when using x-views.");s=t.getAttribute("x-view"),"/"!=this.settings.views.basepath&&(s=this.settings.views.basepath+s),"notfound"==i&&(this.settings.views.notfound=s)}let r=null;if(0==t.hasAttribute("x-handler")&&!this.settings.allowNoHandler)throw new Error('Alpine Router: x-route must have a handler (x-handler="handler") unless using x-views or x-render.');if(t.hasAttribute("x-handler")){let n=t.getAttribute("x-handler");try{r=e.getUnobservedData()[n]}catch(o){throw new Error("Alpine Router: "+o)}if("function"!=typeof r)throw new Error(`Alpine Router: handler must be a callback function, ${typeof r} given.`);"notfound"==i&&(this.notfound=r)}if("notfound"!=i){if("/"==this.settings.basepath||this.settings.hash||(i=this.settings.basepath+i),i=n(i,this.settings.trailingSlash),this.settings.views.enabled)return void this.addRoute(i,{handler:r,view:s});this.addRoute(i,{handler:r})}},navigate(t,e=!1,a=!1){window.dispatchEvent(this.loadstart),null==t&&(t="/"),"/"==this.settings.basepath||this.settings.hash||0==t.indexOf(this.settings.basepath)||(t=this.settings.basepath+t),t!=this.settings.basepath?t=n(t,this.settings.trailingSlash):t.endsWith("/")||(t+="/");const h=this.routes.find((e=>function(t,e){let n=[],i=t.path.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&").replace(/([:^\s])(\w+)/g,((t,e,i)=>(n.push(i),"([^/]+)")))+"(?:/|$)",s={},r=e.match(new RegExp(i));if(null!==r){if(0!=r.index)return null;if(r.input!=r[0])return null;s=r.slice(1).reduce(((t,e,i)=>(null===t&&(t={}),t[n[i]]=e,t)),null)}return t.setProps(s),r}(e,t)));let l,u=null==h;if(u?(l=o("notfound",t,{}),null!=this.notfound&&this.notfound(l)):l=o(h.path,t,h.props),this.currentContext=l,null!=h&&null!=h.settings.handler&&0==h.handle(l))return;!this.settings.render.enabled||a||u||(this.settings.render.preloaded.path==t?(this.routes=r(this.settings.render.preloaded.content,this.settings.render.selector,this.routes),i(this.settings.hash,this.settings.render),this.settings.render.preloaded.path=null,this.settings.render.preloaded.content=null):fetch(t).then((t=>t.text())).then((t=>{this.routes=r(t,this.settings.render.selector,this.routes),i(this.settings.hash,this.settings.render)})));let d=null!=h?h.settings.view:this.settings.views.notfound;if(this.settings.views.enabled&&null!=d){if(this.settings.views.static){var w=this.settings.views.cached.find((t=>t.view==d));null!=w&&(s(w.content,this.settings.views.selector),i(this.settings.hash,this.settings.render))}fetch(d).then((t=>t.text())).then((t=>{s(t,this.settings.views.selector),i(this.settings.hash,this.settings.render),this.settings.views.static&&null==w&&this.settings.views.cached.push({view:d,content:t})}))}if(!e&&(!u||this.settings.pushNotfoundToHistory)){let e="";this.settings.hash?(e="#","/"!=window.location.pathname&&(e+=window.location.pathname),e+=window.location.search+t):e=t+window.location.search+window.location.hash,history.pushState({path:e},"",e)}window.dispatchEvent(this.loadend)},addRoute(e,n,i=null){if(null!=this.routes.find((t=>t.path==e)))throw new Error("Alpine Router: route already exist");this.routes.push(new t(e,n,i))},removeRoute(t){this.routes=this.routes.filter((e=>e.path!=t))}},h=window.deferLoadingAlpine||(t=>t());window.AlpineRouter=a,window.deferLoadingAlpine=function(t){window.AlpineRouter.start(),h(t)};export default a;
