import*as e from"../../core/common/common.js";import*as t from"../../core/sdk/sdk.js";let r;const n=["ALL","DESKTOP","PHONE"],a=["origin","url"],i=["largest_contentful_paint","cumulative_layout_shift","interaction_to_next_paint","round_trip_time"];class o extends e.ObjectWrapper.ObjectWrapper{#e=new Map;#t=new Map;#r;#n=e.Settings.Settings.instance().createSetting("field-data",{enabled:!1,override:""});#a="https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=AIzaSyCCSOx25vrb5z0tbedCB3_JRzzbVW6Uwgw";constructor(){super(),this.#n.addChangeListener((()=>{this.#i()})),t.TargetManager.TargetManager.instance().addModelListener(t.ResourceTreeModel.ResourceTreeModel,t.ResourceTreeModel.Events.FrameNavigated,this.#o,this)}static instance(e={forceNew:null}){const{forceNew:t}=e;return r&&!t||(r=new o),r}getConfigSetting(){return this.#n}async getFieldDataForPage(e){const t={"origin-ALL":null,"origin-DESKTOP":null,"origin-PHONE":null,"origin-TABLET":null,"url-ALL":null,"url-DESKTOP":null,"url-PHONE":null,"url-TABLET":null};try{const r=this.#s(e),i=[];for(const e of a)for(const a of n){const n=this.#c(r,e,a).then((r=>{t[`${e}-${a}`]=r}));i.push(n)}await Promise.all(i)}catch(e){console.error(e)}finally{return t}}async getFieldDataForCurrentPage(){const e=this.#n.get().override||this.#r||await this.#d();return this.getFieldDataForPage(e)}async#d(){const e=t.TargetManager.TargetManager.instance();let r=e.inspectedURL();return r||(r=await new Promise((t=>{e.addEventListener("InspectedURLChanged",(function r(n){const a=n.data.inspectedURL();a&&(t(a),e.removeEventListener("InspectedURLChanged",r))}))}))),r}async#o(e){e.data.isPrimaryFrame()&&(this.#r=e.data.url,await this.#i())}async#i(){if(this.dispatchEventToListeners("field-data-changed",void 0),!this.#n.get().enabled)return;const e=await this.getFieldDataForCurrentPage();this.dispatchEventToListeners("field-data-changed",e)}#s(e){const t=new URL(e);return t.hash="",t.search="",t}async#c(e,t,r){const{origin:n,href:a}=e,o="origin"===t?this.#e:this.#t,s="origin"===t?`${n}-${r}`:`${a}-${r}`,c=o.get(s);if(void 0!==c)return c;try{const e="ALL"===r?void 0:r,c="origin"===t?await this.#l({origin:n,metrics:i,formFactor:e}):await this.#l({url:a,metrics:i,formFactor:e});return o.set(s,c),c}catch(e){return console.error(e),null}}async#l(e){const t=JSON.stringify(e),r=await fetch(this.#a,{method:"POST",body:t});if(!r.ok&&404!==r.status)throw new Error(`Failed to fetch data from CrUX server (Status code: ${r.status})`);const n=await r.json();if(404===r.status){if("NOT_FOUND"===n?.error?.status)return null;throw new Error(`Failed to fetch data from CrUX server (Status code: ${r.status})`)}if(!("record"in n))throw new Error(`Failed to find data in CrUX response: ${JSON.stringify(n)}`);return n}setEndpointForTesting(e){this.#a=e}}export{o as CrUXManager,n as DEVICE_SCOPE_LIST};