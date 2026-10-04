var ze=Object.defineProperty;var De=Object.getOwnPropertyDescriptor;var _=(r,e,t,s)=>{for(var i=s>1?void 0:s?De(e,t):e,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(e,t,i):o(i))||i);return s&&i&&ze(e,t,i),i};var G=globalThis,q=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),me=new WeakMap,R=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let s=t!==void 0&&t.length===1;s&&(e=me.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&me.set(t,e))}return e}toString(){return this.cssText}},fe=r=>new R(typeof r=="string"?r:r+"",void 0,Y),M=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new R(t,r,Y)},ge=(r,e)=>{if(q)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let s=document.createElement("style"),i=G.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,r.appendChild(s)}},Z=q?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let s of e.cssRules)t+=s.cssText;return fe(t)})(r):r;var{is:Ge,defineProperty:qe,getOwnPropertyDescriptor:je,getOwnPropertyNames:We,getOwnPropertySymbols:Be,getPrototypeOf:Ve}=Object,j=globalThis,be=j.trustedTypes,Ke=be?be.emptyScript:"",Xe=j.reactiveElementPolyfillSupport,U=(r,e)=>r,O={toAttribute(r,e){switch(e){case Boolean:r=r?Ke:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},W=(r,e)=>!Ge(r,e),_e={attribute:!0,type:String,converter:O,reflect:!1,useDefault:!1,hasChanged:W};Symbol.metadata??=Symbol("metadata"),j.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_e){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&qe(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){let{get:i,set:n}=je(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let l=i?.call(this);n?.call(this,o),this.requestUpdate(e,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_e}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let e=Ve(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let t=this.properties,s=[...We(t),...Be(t)];for(let i of s)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[t,s]of this.elementProperties){let i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let s=new Set(e.flat(1/0).reverse());for(let i of s)t.unshift(Z(i))}else e!==void 0&&t.push(Z(e));return t}static _$Eu(e,t){let s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ge(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){let s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){let n=(s.converter?.toAttribute!==void 0?s.converter:O).toAttribute(t,s.type);this._$Em=e,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(e,t){let s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:O;this._$Em=i;let l=o.fromAttribute(t,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(e,t,s,i=!1,n){if(e!==void 0){let o=this.constructor;if(i===!1&&(n=this[e]),s??=o.getPropertyOptions(e),!((s.hasChanged??W)(n,t)||s.useDefault&&s.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,n]of s){let{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[U("elementProperties")]=new Map,S[U("finalized")]=new Map,Xe?.({ReactiveElement:S}),(j.reactiveElementVersions??=[]).push("2.1.2");var ne=globalThis,ve=r=>r,B=ne.trustedTypes,$e=B?B.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ae="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,Ee="?"+w,Je=`<${Ee}>`,E=document,I=()=>E.createComment(""),N=r=>r===null||typeof r!="object"&&typeof r!="function",oe=Array.isArray,Ye=r=>oe(r)||typeof r?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xe=/-->/g,ye=/>/g,k=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Se=/'/g,we=/"/g,Le=/^(?:script|style|textarea|title)$/i,ae=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),f=ae(1),D=ae(2),$t=ae(3),L=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),ke=new WeakMap,A=E.createTreeWalker(E,129);function Pe(r,e){if(!oe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return $e!==void 0?$e.createHTML(e):e}var Ze=(r,e)=>{let t=r.length-1,s=[],i,n=e===2?"<svg>":e===3?"<math>":"",o=H;for(let l=0;l<t;l++){let a=r[l],p,u,c=-1,d=0;for(;d<a.length&&(o.lastIndex=d,u=o.exec(a),u!==null);)d=o.lastIndex,o===H?u[1]==="!--"?o=xe:u[1]!==void 0?o=ye:u[2]!==void 0?(Le.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=k):u[3]!==void 0&&(o=k):o===k?u[0]===">"?(o=i??H,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,p=u[1],o=u[3]===void 0?k:u[3]==='"'?we:Se):o===we||o===Se?o=k:o===xe||o===ye?o=H:(o=k,i=void 0);let h=o===k&&r[l+1].startsWith("/>")?" ":"";n+=o===H?a+Je:c>=0?(s.push(p),a.slice(0,c)+Ae+a.slice(c)+w+h):a+w+(c===-2?l:h)}return[Pe(r,n+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]},F=class r{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let n=0,o=0,l=e.length-1,a=this.parts,[p,u]=Ze(e,t);if(this.el=r.createElement(p,s),A.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=A.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(Ae)){let d=u[o++],h=i.getAttribute(c).split(w),b=/([.?@])?(.*)/.exec(d);a.push({type:1,index:n,name:b[2],strings:h,ctor:b[1]==="."?te:b[1]==="?"?se:b[1]==="@"?ie:C}),i.removeAttribute(c)}else c.startsWith(w)&&(a.push({type:6,index:n}),i.removeAttribute(c));if(Le.test(i.tagName)){let c=i.textContent.split(w),d=c.length-1;if(d>0){i.textContent=B?B.emptyScript:"";for(let h=0;h<d;h++)i.append(c[h],I()),A.nextNode(),a.push({type:2,index:++n});i.append(c[d],I())}}}else if(i.nodeType===8)if(i.data===Ee)a.push({type:2,index:n});else{let c=-1;for(;(c=i.data.indexOf(w,c+1))!==-1;)a.push({type:7,index:n}),c+=w.length-1}n++}}static createElement(e,t){let s=E.createElement("template");return s.innerHTML=e,s}};function P(r,e,t=r,s){if(e===L)return e;let i=s!==void 0?t._$Co?.[s]:t._$Cl,n=N(e)?void 0:e._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,t,s)),s!==void 0?(t._$Co??=[])[s]=i:t._$Cl=i),i!==void 0&&(e=P(r,i._$AS(r,e.values),i,s)),e}var ee=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??E).importNode(t,!0);A.currentNode=i;let n=A.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new z(n,n.nextSibling,this,e):a.type===1?p=new a.ctor(n,a.name,a.strings,this,e):a.type===6&&(p=new re(n,this,e)),this._$AV.push(p),a=s[++l]}o!==a?.index&&(n=A.nextNode(),o++)}return A.currentNode=E,i}p(e){let t=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}},z=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),N(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==L&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ye(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(E.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=F.createElement(Pe(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{let n=new ee(i,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=ke.get(e.strings);return t===void 0&&ke.set(e.strings,t=new F(e)),t}k(e){oe(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,s,i=0;for(let n of e)i===t.length?t.push(s=new r(this.O(I()),this.O(I()),this,this.options)):s=t[i],s._$AI(n),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let s=ve(e).nextSibling;ve(e).remove(),e=s}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},C=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,n){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=m}_$AI(e,t=this,s,i){let n=this.strings,o=!1;if(n===void 0)e=P(this,e,t,0),o=!N(e)||e!==this._$AH&&e!==L,o&&(this._$AH=e);else{let l=e,a,p;for(e=n[0],a=0;a<n.length-1;a++)p=P(this,l[s+a],t,a),p===L&&(p=this._$AH[a]),o||=!N(p)||p!==this._$AH[a],p===m?e=m:e!==m&&(e+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!i&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},te=class extends C{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}},se=class extends C{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}},ie=class extends C{constructor(e,t,s,i,n){super(e,t,s,i,n),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??m)===L)return;let s=this._$AH,i=e===m&&s!==m||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,n=e!==m&&(s===m||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},re=class{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var Qe=ne.litHtmlPolyfillSupport;Qe?.(F,z),(ne.litHtmlVersions??=[]).push("3.3.3");var Ce=(r,e,t)=>{let s=t?.renderBefore??e,i=s._$litPart$;if(i===void 0){let n=t?.renderBefore??null;s._$litPart$=i=new z(e.insertBefore(I(),n),n,void 0,t??{})}return i._$AI(r),i};var le=globalThis,x=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ce(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return L}};x._$litElement$=!0,x.finalized=!0,le.litElementHydrateSupport?.({LitElement:x});var et=le.litElementPolyfillSupport;et?.({LitElement:x});(le.litElementVersions??=[]).push("4.2.2");var V=r=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(r,e)}):customElements.define(r,e)};var tt={attribute:!0,type:String,converter:O,reflect:!1,hasChanged:W},st=(r=tt,e,t)=>{let{kind:s,metadata:i}=t,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(t.name,r),s==="accessor"){let{name:o}=t;return{set(l){let a=e.get.call(this);e.set.call(this,l),this.requestUpdate(o,a,r,!0,l)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(s==="setter"){let{name:o}=t;return function(l){let a=this[o];e.call(this,l),this.requestUpdate(o,a,r,!0,l)}}throw Error("Unsupported decorator location: "+s)};function K(r){return(e,t)=>typeof t=="object"?st(r,e,t):((s,i,n)=>{let o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,e,t)}function y(r){return K({...r,state:!0,attribute:!1})}var it=[{kind:"measured",label:"Bloom pour",chapterLabel:"Bloom",heroLabel:"",nextLabel:"",instruction:"Pour to {target}g within 10s. Keep it even.",endTimeS:10,waterFraction:.12},{kind:"timed",label:"Bloom",chapterLabel:"Rest",heroLabel:"Resting",nextLabel:"Swirl & wait",instruction:"Swirl firmly until no dry clumps remain, then wait.",endTimeS:45,waterFraction:.12},{kind:"measured",label:"First pour",chapterLabel:"First pour",heroLabel:"",nextLabel:"",instruction:"Pour to {target}g in slow circles. Keep the bed level.",endTimeS:75,waterFraction:.6},{kind:"measured",label:"Final pour",chapterLabel:"Final pour",heroLabel:"",nextLabel:"",instruction:"Pour to {target}g, a little slower. Stir once each way, then swirl.",endTimeS:105,waterFraction:1},{kind:"timed",label:"Drawdown",chapterLabel:"Drain",heroLabel:"Draining",nextLabel:"Let it drain",instruction:"Let the bed drain undisturbed. Swirl once if it's draining unevenly.",endTimeS:210,waterFraction:1},{kind:"done",label:"Done",chapterLabel:"",heroLabel:"Total poured",nextLabel:"Remove & enjoy",instruction:"Remove the dripper and enjoy.",endTimeS:210,waterFraction:1}],rt=[{kind:"measured",label:"Pour",chapterLabel:"Pour",heroLabel:"",nextLabel:"",instruction:"Add all {target}g within 10s. Don't stir.",endTimeS:10,waterFraction:1},{kind:"timed",label:"Steep",chapterLabel:"Steep",heroLabel:"Steeping",nextLabel:"Stir down the crust & skim",instruction:"Let it sit undisturbed. No stirring.",endTimeS:240,waterFraction:1},{kind:"timed",label:"Break & skim",chapterLabel:"Skim",heroLabel:"Skim now",nextLabel:"Let it settle",instruction:"Stir the crust down, then skim off the foam and grounds with two spoons.",endTimeS:250,waterFraction:1},{kind:"timed",label:"Settle",chapterLabel:"Settle",heroLabel:"Settling",nextLabel:"Plunge & serve",instruction:"Let the fine particles settle undisturbed, at least 5 minutes.",endTimeS:550,waterFraction:1},{kind:"done",label:"Ready",chapterLabel:"",heroLabel:"Ready to plunge",nextLabel:"",instruction:"Lower the plunger until it just rests on the surface \u2014 don't push it through. Serve immediately.",endTimeS:550,waterFraction:1}],nt=[{kind:"measured",label:"Bloom pour",chapterLabel:"Bloom",heroLabel:"",nextLabel:"",instruction:"Pour to {target}g within 10s.",endTimeS:10,waterFraction:.2},{kind:"timed",label:"Bloom",chapterLabel:"Rest",heroLabel:"Resting",nextLabel:"Swirl & wait",instruction:"Gently swirl for about 15s, then let it sit.",endTimeS:45,waterFraction:.2},{kind:"measured",label:"Pour 1",chapterLabel:"Pour 1",heroLabel:"",nextLabel:"",instruction:"Pour to {target}g. Keep the spout low and pour slowly.",endTimeS:60,waterFraction:.4},{kind:"timed",label:"Pause",chapterLabel:"",heroLabel:"Pause",nextLabel:"Pour 2",instruction:"Pause. Let it settle.",endTimeS:70,waterFraction:.4},{kind:"measured",label:"Pour 2",chapterLabel:"Pour 2",heroLabel:"",nextLabel:"",instruction:"Pour to {target}g.",endTimeS:80,waterFraction:.6},{kind:"timed",label:"Pause",chapterLabel:"",heroLabel:"Pause",nextLabel:"Pour 3",instruction:"Pause. Let it settle.",endTimeS:90,waterFraction:.6},{kind:"measured",label:"Pour 3",chapterLabel:"Pour 3",heroLabel:"",nextLabel:"",instruction:"Pour to {target}g.",endTimeS:100,waterFraction:.8},{kind:"timed",label:"Pause",chapterLabel:"",heroLabel:"Pause",nextLabel:"Pour 4",instruction:"Pause. Let it settle.",endTimeS:110,waterFraction:.8},{kind:"measured",label:"Pour 4",chapterLabel:"Pour 4",heroLabel:"",nextLabel:"",instruction:"Pour to {target}g. Finish with a gentle swirl.",endTimeS:120,waterFraction:1},{kind:"timed",label:"Drawdown",chapterLabel:"Drain",heroLabel:"Draining",nextLabel:"Let it drain",instruction:"Let the bed drain undisturbed.",endTimeS:180,waterFraction:1},{kind:"done",label:"Done",chapterLabel:"",heroLabel:"Total poured",nextLabel:"Remove & enjoy",instruction:"Remove the dripper and enjoy.",endTimeS:180,waterFraction:1}],ot={id:"v60",name:"V60",grindSize:"Medium-fine",template:it},at={id:"v60-1cup",name:"1 Cup V60",grindSize:"Medium-fine",template:nt},lt={id:"frenchpress",name:"French Press",grindSize:"Medium-coarse",template:rt},g=[ot,at,lt];function Te(r,e){return r.map(t=>{let s=Math.round(t.waterFraction*e.waterG),i=t.instruction.replace("{target}",String(s));return{kind:t.kind,label:t.label,chapterLabel:t.chapterLabel,heroLabel:t.heroLabel,nextLabel:t.nextLabel,instruction:i,endTimeS:t.endTimeS,targetWaterG:s}})}function ce(r,e){for(let t=0;t<r.length;t++)if(e<r[t].endTimeS)return t;return r.length-1}var T=class extends x{setConfig(e){this._config={title:"Pour-Over Timer",sound_enabled:!0,cups:2,default_recipe:g[0].id,...e}}_emit(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_onText(e,t){return s=>{let i=s.target.value;this._config={...this._config,[e]:t?Number(i):i},this._emit()}}_onSwitch(e){return t=>{let s=t.target.checked;this._config={...this._config,[e]:s},this._emit()}}render(){return this._config?f`
      <div class="form">
        <label>
          Title
          <input
            type="text"
            .value=${this._config.title??""}
            @input=${this._onText("title",!1)}
          />
        </label>
        <label>
          Default recipe
          <select @change=${this._onText("default_recipe",!1)}>
            ${g.map(e=>f`
                <option value=${e.id} ?selected=${this._config.default_recipe===e.id}>
                  ${e.name}
                </option>
              `)}
          </select>
        </label>
        <label>
          Cups (15g coffee : 250g water each)
          <input
            type="number"
            min="1"
            max="6"
            .value=${String(this._config.cups)}
            @input=${this._onText("cups",!0)}
          />
        </label>
        <label class="checkbox">
          <input
            type="checkbox"
            .checked=${this._config.sound_enabled??!0}
            @change=${this._onSwitch("sound_enabled")}
          />
          Play sound on step changes
        </label>
      </div>
    `:f``}};T.styles=M`
    .form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 0.9em;
      color: var(--primary-text-color, #000);
    }
    label.checkbox {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }
    input[type="text"],
    input[type="number"],
    select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
    }
  `,_([y()],T.prototype,"_config",2),T=_([V("v60-timer-card-editor")],T);var ct=15,pt=250,Re=1,Me=6,pe=2,de=320,dt=56,Ue=42,ht=28,Oe=160;function He(r){let e=Math.max(0,Math.floor(r)),t=Math.floor(e/60),s=e%60;return`${t}:${String(s).padStart(2,"0")}`}function ut(r,e,t){return r+(e-r)*Math.max(0,Math.min(1,t))}function mt(r){return r.kind==="measured"?`Pour to ${r.targetWaterG}g (${r.targetWaterG}ml)`:r.nextLabel}var v=class extends x{constructor(){super(...arguments);this._recipeId=g[0].id;this._steps=[];this._runState="idle";this._elapsedS=0;this._cups=pe;this._soundOn=!0;this._startEpochMs=0;this._pausedElapsedS=0;this._lastStepIndex=-1;this._tick=()=>{if(this._runState==="running"){let t=this._steps[this._steps.length-1].endTimeS,s=(Date.now()-this._startEpochMs)/1e3;this._elapsedS=Math.min(s,t);let i=ce(this._steps,this._elapsedS);if(i!==this._lastStepIndex){let n=i===this._steps.length-1;this._playChime(n?"done":"step"),this._lastStepIndex=i}this._elapsedS>=t&&(this._runState="finished",this._releaseWakeLock())}this._rafId=requestAnimationFrame(this._tick)};this._toggleSound=()=>{this._soundOn=!this._soundOn};this._onVisibilityChange=()=>{this._runState==="running"&&document.visibilityState==="visible"&&!this._wakeLock&&this._requestWakeLock()}}static getStubConfig(){return{type:"custom:v60-timer-card",title:"Pour-Over Timer",cups:pe,sound_enabled:!0,default_recipe:g[0].id}}static getConfigElement(){return document.createElement("v60-timer-card-editor")}setConfig(t){if(t.cups!==void 0&&t.cups<=0)throw new Error("cups must be greater than 0");this._config={title:"Pour-Over Timer",sound_enabled:!0,cups:pe,default_recipe:g[0].id,...t},this._cups=Math.min(Me,Math.max(Re,Math.round(this._config.cups))),this._soundOn=this._config.sound_enabled,this._recipeId=g.some(s=>s.id===this._config.default_recipe)?this._config.default_recipe:g[0].id,this._recomputeSteps()}getCardSize(){return 7}connectedCallback(){super.connectedCallback(),this._rafId=requestAnimationFrame(this._tick),document.addEventListener("visibilitychange",this._onVisibilityChange)}disconnectedCallback(){this._rafId&&cancelAnimationFrame(this._rafId),document.removeEventListener("visibilitychange",this._onVisibilityChange),this._releaseWakeLock(),super.disconnectedCallback()}updated(t){super.updated(t)}_start(){(this._runState==="idle"||this._runState==="finished")&&(this._pausedElapsedS=0,this._lastStepIndex=-1,this._elapsedS=0),this._ensureAudio(),this._startEpochMs=Date.now()-this._pausedElapsedS*1e3,this._runState="running",this._requestWakeLock()}_pause(){this._pausedElapsedS=this._elapsedS,this._runState="paused",this._releaseWakeLock()}_reset(){this._runState="idle",this._elapsedS=0,this._pausedElapsedS=0,this._lastStepIndex=-1,this._releaseWakeLock()}_doseG(){return this._cups*ct}_currentWaterG(){return this._cups*pt}_recomputeSteps(){let t=g.find(s=>s.id===this._recipeId)??g[0];this._steps=Te(t.template,{doseG:this._doseG(),waterG:this._currentWaterG()}),this._reset()}get _recipeLocked(){return this._runState==="running"||this._runState==="paused"}_switchRecipe(t){this._recipeLocked||t===this._recipeId||(this._recipeId=t,this._recomputeSteps())}_changeCups(t){this._recipeLocked||(this._cups=Math.min(Me,Math.max(Re,this._cups+t)),this._recomputeSteps())}async _requestWakeLock(){try{this._wakeLock=await navigator.wakeLock?.request?.("screen")}catch{this._wakeLock=void 0}}_releaseWakeLock(){this._wakeLock?.release?.(),this._wakeLock=void 0}_ensureAudio(){this._soundOn&&(this._audioCtx||(this._audioCtx=new AudioContext),this._audioCtx.state==="suspended"&&this._audioCtx.resume())}_playChime(t){if(!this._soundOn||!this._audioCtx)return;let s=this._audioCtx,i=t==="done"?[880,1100,1320]:[760],n=s.currentTime;for(let o of i){let l=s.createOscillator(),a=s.createGain();l.frequency.value=o,l.type="sine",a.gain.setValueAtTime(1e-4,n),a.gain.exponentialRampToValueAtTime(.25,n+.02),a.gain.exponentialRampToValueAtTime(1e-4,n+.18),l.connect(a),a.connect(s.destination),l.start(n),l.stop(n+.2),n+=.16}}_currentStepIndex(){return ce(this._steps,this._elapsedS)}_liveTargetG(t){let s=this._steps[t];if(s.kind!=="measured")return s.targetWaterG;let i=t>0?this._steps[t-1].endTimeS:0,n=t>0?this._steps[t-1].targetWaterG:0,o=s.endTimeS-i,l=o>0?(this._elapsedS-i)/o:1;return Math.round(ut(n,s.targetWaterG,l))}_axisTicks(t){let s=[0];for(let o of this._steps)o.kind!=="done"&&s.push(o.endTimeS);let i=t*.08,n=[];for(let o of s)n.length===0||o-n[n.length-1]>=i?n.push(o):o===s[s.length-1]&&(n[n.length-1]=o);return n}_humps(){let t=[],s=0;for(let i=0;i<this._steps.length;i++){let n=this._steps[i],o=i>0?this._steps[i-1].endTimeS:0,l=n.endTimeS-o;if(n.kind==="measured"){let a=n.targetWaterG-s;t.push({start:o,dur:l,flow:l>0?a/l:0})}s=n.targetWaterG}return t}_pulseGeometry(t){let s=this._humps(),i=Math.max(.001,...s.map(d=>d.flow)),n=d=>{for(let h of s)if(h.dur>0&&d>=h.start&&d<=h.start+h.dur){let b=(d-h.start)/h.dur,J=ht*(h.flow/i);return Ue-J*(.5-.5*Math.cos(2*Math.PI*b))}return Ue},o=[];for(let d=0;d<=Oe;d++){let h=d/Oe*t;o.push({x:h/t*de,y:n(h)})}let l=Math.min(this._elapsedS,t),a=l/t*de,p=n(l),u=d=>d.map((h,b)=>`${b===0?"M":"L"}${h.x.toFixed(1)},${h.y.toFixed(1)}`).join(" "),c=o.filter(d=>d.x<=a);return c.push({x:a,y:p}),{fullPath:u(o),pastPath:u(c),markerX:a,markerY:p}}_chapterLabels(t){let s=this._humps(),i=[],n=0;for(let o=0;o<this._steps.length;o++){let l=this._steps[o];if(l.kind==="done")continue;let a;if(l.kind==="measured"){let p=s[n++];a=p.start+p.dur/2}else a=((o>0?this._steps[o-1].endTimeS:0)+l.endTimeS)/2;i.push({leftPct:a/t*100,text:l.chapterLabel})}return i}render(){if(!this._config||!this._steps.length)return f``;let t=g.find($=>$.id===this._recipeId)??g[0],s=this._currentStepIndex(),i=this._steps[s],n=this._steps[this._steps.length-1].endTimeS,o=this._liveTargetG(s),l=this._recipeLocked,a=this._currentWaterG(),p=this._steps[s+1],u,c,d="",h="";i.kind==="measured"?(u="Pour to",c=String(o),d=`/ ${i.targetWaterG}`,h="g"):i.kind==="timed"?(u=i.heroLabel,c=He(Math.max(0,i.endTimeS-this._elapsedS))):(u=i.heroLabel,c=String(a),h="g");let b=this._pulseGeometry(n),J=this._chapterLabels(n);return f`
      <ha-card>
        <div class="content">
          <div class="recipe-tabs">
            ${g.map($=>f`
                <button
                  type="button"
                  class="tab ${$.id===this._recipeId?"active":""}"
                  ?disabled=${l}
                  @click=${()=>this._switchRecipe($.id)}
                >
                  ${$.name}
                </button>
              `)}
          </div>

          <div class="recipe-controls ${l?"is-locked":""}">
            <div class="control-row">
              <span class="control-label">Cups</span>
              <div class="stepper">
                <button
                  type="button"
                  aria-label="Fewer cups"
                  ?disabled=${l}
                  @click=${()=>this._changeCups(-1)}
                >
                  &minus;
                </button>
                <span class="stepper-value"
                  >${this._cups} ${this._cups===1?"cup":"cups"}</span
                >
                <button
                  type="button"
                  aria-label="More cups"
                  ?disabled=${l}
                  @click=${()=>this._changeCups(1)}
                >
                  &plus;
                </button>
              </div>
            </div>
            <div class="recipe-summary">
              ${this._doseG()}g coffee · ${a}g water · ${t.grindSize} grind
            </div>
          </div>

          <div class="now-label">Now</div>
          <div class="now-step">${i.label}</div>

          <div class="hero">
            <div class="hero-label">${u}</div>
            <div class="hero-value">
              <span class="hero-number">${c}</span>
              ${d?f`<span class="hero-target">${d}</span>`:""}
              ${h?f`<span class="hero-unit">${h}</span>`:""}
            </div>
          </div>

          <p class="instruction">${i.instruction}</p>

          ${p?f`<div class="next-row">Next: <strong>${mt(p)}</strong></div>`:""}

          <div class="pulse-wrap">
            <div class="pulse-labels">
              ${J.map($=>f`<span style="left:${$.leftPct}%">${$.text}</span>`)}
            </div>
            <svg
              class="pulse-svg"
              viewBox="0 0 ${de} ${dt}"
              preserveAspectRatio="none"
            >
              ${D`<defs>
                <linearGradient id="v60PulseGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stop-color="var(--v60-accent)" />
                  <stop offset="1" stop-color="var(--v60-accent-pale)" />
                </linearGradient>
              </defs>`}
              ${D`<path class="pulse-future" d=${b.fullPath}></path>`}
              ${D`<path class="pulse-past" d=${b.pastPath}></path>`}
              ${D`<circle class="pulse-dot" cx=${b.markerX} cy=${b.markerY} r="3.2"></circle>`}
            </svg>
            <div class="track-axis">
              ${this._axisTicks(n).map(($,he,Ie)=>{let Ne=$/n*100,ue=he===0?"left":he===Ie.length-1?"right":"center",Fe=ue==="left"?"left:0":ue==="right"?"right:0":`left:${Ne}%; transform:translateX(-50%)`;return f`<span style=${Fe}>${He($)}</span>`})}
            </div>
          </div>

          <div class="controls">
            ${this._runState==="running"?f`<button class="btn-primary" @click=${this._pause}>Pause</button>`:f`<button class="btn-primary" @click=${this._start}>
                  ${this._runState==="paused"?"Resume":"Start"}
                </button>`}
            <button class="btn-secondary" @click=${this._reset}>Reset</button>
          </div>

          <div class="toggle-row">
            <button class="chip ${this._soundOn?"on":""}" @click=${this._toggleSound}>
              Sound ${this._soundOn?"on":"off"}
            </button>
          </div>
        </div>
      </ha-card>
    `}};v.styles=M`
    :host {
      --v60-bg: #0a1210;
      --v60-surface: rgba(238, 246, 242, 0.055);
      --v60-surface-strong: rgba(238, 246, 242, 0.1);
      --v60-ink: #eef6f1;
      --v60-muted: #8fab9b;
      --v60-divider: rgba(238, 246, 242, 0.13);
      --v60-accent: #698f5b;
      --v60-accent-pale: #acbe9d;
      --v60-accent-ink: #12190f;
      --v60-accent-soft: rgba(105, 143, 91, 0.18);
      --v60-font-ui: "Roboto", "Noto Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;
      --v60-font-mono: "Roboto Mono", ui-monospace, "SF Mono", "Cascadia Code",
        "DejaVu Sans Mono", Consolas, monospace;
      display: block;
      container-type: inline-size;
    }
    ha-card {
      background: var(--v60-bg);
      color: var(--v60-ink);
      border-radius: 24px;
      padding-bottom: 8px;
      font-family: var(--v60-font-ui);
    }
    .content {
      padding: 24px 22px 18px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .recipe-tabs {
      display: flex;
      gap: 6px;
      padding: 4px;
      border-radius: 14px;
      background: var(--v60-surface);
      border: 1px solid var(--v60-divider);
    }
    .tab {
      flex: 1;
      padding: 8px;
      border-radius: 10px;
      border: none;
      background: transparent;
      color: var(--v60-muted);
      font-family: var(--v60-font-ui);
      font-weight: 600;
      font-size: 0.88em;
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .tab.active {
      color: var(--v60-accent-ink);
      background: var(--v60-accent);
    }
    .tab:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .recipe-controls {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 12px 14px;
      border-radius: 14px;
      background: var(--v60-surface);
      border: 1px solid var(--v60-divider);
    }
    .control-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .control-label {
      flex: 0 0 auto;
      font-size: 0.78em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--v60-muted);
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .stepper button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid var(--v60-divider);
      background: var(--v60-surface-strong);
      color: var(--v60-ink);
      font-size: 1.1em;
      line-height: 1;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .stepper button:active {
      transform: scale(0.92);
    }
    .stepper button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .stepper-value {
      min-width: 4.5em;
      text-align: center;
      font-family: var(--v60-font-mono);
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .recipe-summary {
      font-size: 0.8em;
      font-family: var(--v60-font-mono);
      color: var(--v60-muted);
      font-variant-numeric: tabular-nums;
    }
    .recipe-controls.is-locked {
      opacity: 0.6;
    }

    .now-label {
      font-size: 0.78em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--v60-muted);
    }
    .now-step {
      font-size: clamp(1.5rem, 10cqi, 2rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.01em;
      color: var(--v60-ink);
    }

    .hero-label {
      font-size: 0.78em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--v60-muted);
      margin-bottom: 4px;
    }
    .hero-value {
      display: flex;
      align-items: baseline;
      gap: 10px;
      flex-wrap: wrap;
    }
    .hero-number,
    .hero-unit {
      font-family: var(--v60-font-mono);
      font-weight: 700;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      background: linear-gradient(90deg, var(--v60-accent), var(--v60-accent-pale));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .hero-number {
      font-size: 4.5rem;
      font-size: clamp(3.25rem, 22cqi, 6rem);
    }
    .hero-unit {
      font-size: 1.8rem;
      font-size: clamp(1.4rem, 7cqi, 2.2rem);
    }
    .hero-target {
      font-family: var(--v60-font-mono);
      font-weight: 700;
      font-size: 1.8rem;
      font-size: clamp(1.4rem, 7cqi, 2.2rem);
      line-height: 1;
      font-variant-numeric: tabular-nums;
      color: var(--v60-muted);
    }
    .instruction {
      margin: 0;
      font-size: 1.15em;
      font-weight: 500;
      line-height: 1.45;
      color: var(--v60-ink);
    }

    .next-row {
      font-size: 0.92em;
      color: var(--v60-muted);
    }
    .next-row strong {
      color: var(--v60-ink);
      font-weight: 600;
    }

    .pulse-wrap {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .pulse-labels {
      position: relative;
      height: 1.2em;
      font-family: var(--v60-font-mono);
      font-size: 0.68em;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: var(--v60-muted);
    }
    .pulse-labels span {
      position: absolute;
      transform: translateX(-50%);
      white-space: nowrap;
    }
    .pulse-svg {
      width: 100%;
      height: 60px;
      display: block;
      overflow: visible;
    }
    .pulse-future {
      fill: none;
      stroke: var(--v60-accent-pale);
      stroke-opacity: 0.45;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .pulse-past {
      fill: none;
      stroke: url(#v60PulseGrad);
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .pulse-dot {
      fill: var(--v60-ink);
      stroke: var(--v60-accent);
      stroke-width: 2;
    }
    .track-axis {
      position: relative;
      height: 1.2em;
    }
    .track-axis span {
      position: absolute;
      font-family: var(--v60-font-mono);
      font-size: 0.75em;
      font-variant-numeric: tabular-nums;
      color: var(--v60-muted);
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-top: 4px;
    }
    .btn-primary {
      flex: 1;
      min-height: 58px;
      border-radius: 16px;
      border: none;
      background: var(--v60-accent);
      color: var(--v60-accent-ink);
      font-size: 1.1em;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 0 0 1px rgba(105, 143, 91, 0.5), 0 8px 24px -8px rgba(105, 143, 91, 0.5);
      transition: transform 0.1s ease, filter 0.15s ease;
    }
    .btn-primary:hover {
      filter: brightness(1.06);
    }
    .btn-primary:active {
      transform: scale(0.98);
    }
    .btn-secondary {
      min-width: 96px;
      border-radius: 16px;
      border: 1px solid var(--v60-divider);
      background: var(--v60-surface-strong);
      color: var(--v60-ink);
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .btn-secondary:active {
      transform: scale(0.98);
    }

    .toggle-row {
      display: flex;
      gap: 10px;
    }
    .chip {
      flex: 1;
      padding: 11px;
      border-radius: 14px;
      border: 1px solid var(--v60-divider);
      background: var(--v60-surface);
      color: var(--v60-muted);
      font-weight: 600;
      font-size: 0.86em;
      cursor: pointer;
      transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }
    .chip.on {
      color: var(--v60-ink);
      border-color: var(--v60-accent-pale);
      background: var(--v60-accent-soft);
    }
  `,_([K({attribute:!1})],v.prototype,"hass",2),_([y()],v.prototype,"_config",2),_([y()],v.prototype,"_recipeId",2),_([y()],v.prototype,"_steps",2),_([y()],v.prototype,"_runState",2),_([y()],v.prototype,"_elapsedS",2),_([y()],v.prototype,"_cups",2),_([y()],v.prototype,"_soundOn",2),v=_([V("v60-timer-card")],v);window.customCards=window.customCards||[];window.customCards.push({type:"v60-timer-card",name:"Pour-Over Timer",description:"Interactive timer for James Hoffmann's V60 and French press recipes.",preview:!0});export{v as V60TimerCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
