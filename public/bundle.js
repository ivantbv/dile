!function(){"use strict";document.addEventListener("component-ready",(()=>{!function(e){const t=document.querySelector("my-component");if(t){const s=t.shadowRoot.querySelector(".form-group label");s&&(s.textContent=e),t.shadowRoot.querySelector("#showpage1").addEventListener("click",(()=>{t.shadowRoot.querySelector("dile-pages").selected="page1"}))}}("Imported ")})),document.addEventListener("modal-ready",(()=>{const e=document.querySelector("modal-component");if(e){const t=e.shadowRoot.querySelector("#preview-btn");console.log("modal comp",e,"and preview btn",t),t.addEventListener("click",(()=>{!function(){const e=document.querySelector("modal-component");if(e){const t=e.shadowRoot.querySelector("#preview-thead"),s=e.shadowRoot.querySelector("#preview-tbody");t.innerHTML="",s.innerHTML="";const i=document.createElement("tr");for(let e=0;e<15;e++){const e=document.createElement("th");e.textContent="asd",i.appendChild(e)}t.appendChild(i);for(let e=0;e<15;e++){const e=document.createElement("tr");for(let t=0;t<15;t++){const t=document.createElement("td");t.textContent="value",e.appendChild(t)}s.appendChild(e)}e.shadowRoot.querySelector("#preview").style.display="block"}}()}))}}));
/**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const s=this.t;if(t&&void 0===e){const t=void 0!==s&&1===s.length;t&&(e=i.get(s)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(s,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce(((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1]),e[0]);return new o(i,e,s)},r=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,s))(t)})(e):e
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */,{is:a,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",b=u.reactiveElementPolyfillSupport,v=(e,t)=>e,f={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},y=(e,t)=>!a(e,t),_={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;class $ extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:o}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get(){return i?.call(this)},set(t){const n=i?.call(this);o.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...c(e),...h(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(t)s.adoptedStyleSheets=i.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const t of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=t.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$EC(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:f).toAttribute(t,s.type);this._$Em=e,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:f;this._$Em=i,this[i]=o.fromAttribute(t,e.type),this._$Em=null}}requestUpdate(e,t,s){if(void 0!==e){if(s??=this.constructor.getPropertyOptions(e),!(s.hasChanged??y)(this[e],t))return;this.P(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(e,t,s){this._$AL.has(e)||this._$AL.set(e,t),!0===s.reflect&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e)!0!==s.wrapped||this._$AL.has(t)||void 0===this[t]||this.P(t,this[t],s)}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EU()}catch(t){throw e=!1,this._$EU(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach((e=>this._$EC(e,this[e]))),this._$EU()}updated(e){}firstUpdated(e){}}$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[v("elementProperties")]=new Map,$[v("finalized")]=new Map,b?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.0.4");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
const w=globalThis,S=w.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+x,k=`<${C}>`,P=document,H=()=>P.createComment(""),I=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,R="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,L=/>/g,z=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,O=/"/g,q=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...s)=>({_$litType$:e,strings:t,values:s}))(1),D=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),F=new WeakMap,V=P.createTreeWalker(P,129);function W(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(t):t}const J=(e,t)=>{const s=e.length-1,i=[];let o,n=2===t?"<svg>":"",r=T;for(let t=0;t<s;t++){const s=e[t];let a,l,d=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===T?"!--"===l[1]?r=M:void 0!==l[1]?r=L:void 0!==l[2]?(q.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=z):void 0!==l[3]&&(r=z):r===z?">"===l[0]?(r=o??T,d=-1):void 0===l[1]?d=-2:(d=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?z:'"'===l[3]?O:N):r===O||r===N?r=z:r===M||r===L?r=T:(r=z,o=void 0);const h=r===z&&e[t+1].startsWith("/>")?" ":"";n+=r===T?s+k:d>=0?(i.push(a),s.slice(0,d)+E+s.slice(d)+x+h):s+x+(-2===d?t:h)}return[W(e,n+(e[s]||"<?>")+(2===t?"</svg>":"")),i]};class K{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,n=0;const r=e.length-1,a=this.parts,[l,d]=J(e,t);if(this.el=K.createElement(l,s),V.currentNode=this.el.content,2===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=V.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=d[n++],s=i.getAttribute(e).split(x),r=/([.?@])?(.*)/.exec(t);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?X:"?"===r[1]?ee:"@"===r[1]?te:Q}),i.removeAttribute(e)}else e.startsWith(x)&&(a.push({type:6,index:o}),i.removeAttribute(e));if(q.test(i.tagName)){const e=i.textContent.split(x),t=e.length-1;if(t>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],H()),V.nextNode(),a.push({type:2,index:++o});i.append(e[t],H())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(x,e+1));)a.push({type:7,index:o}),e+=x.length-1}o++}}static createElement(e,t){const s=P.createElement("template");return s.innerHTML=e,s}}function Z(e,t,s=e,i){if(t===D)return t;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=I(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(t=Z(e,o._$AS(e,t.values),o,i)),t}class G{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??P).importNode(t,!0);V.currentNode=i;let o=V.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new Y(o,o.nextSibling,this,e):1===a.type?t=new a.ctor(o,a.name,a.strings,this,e):6===a.type&&(t=new se(o,this,e)),this._$AV.push(t),a=s[++r]}n!==a?.index&&(o=V.nextNode(),n++)}return V.currentNode=P,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Z(this,e,t),I(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==D&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>U(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}S(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.S(e))}_(e){this._$AH!==j&&I(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=K.createElement(W(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new G(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=F.get(e.strings);return void 0===t&&F.set(e.strings,t=new K(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const o of e)i===t.length?t.push(s=new Y(this.S(H()),this.S(H()),this,this.options)):s=t[i],s._$AI(o),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=j}_$AI(e,t=this,s,i){const o=this.strings;let n=!1;if(void 0===o)e=Z(this,e,t,0),n=!I(e)||e!==this._$AH&&e!==D,n&&(this._$AH=e);else{const i=e;let r,a;for(e=o[0],r=0;r<o.length-1;r++)a=Z(this,i[s+r],t,r),a===D&&(a=this._$AH[r]),n||=!I(a)||a!==this._$AH[r],a===j?e=j:e!==j&&(e+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class ee extends Q{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class te extends Q{constructor(e,t,s,i,o){super(e,t,s,i,o),this.type=5}_$AI(e,t=this){if((e=Z(this,e,t,0)??j)===D)return;const s=this._$AH,i=e===j&&s!==j||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,o=e!==j&&(s===j||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){Z(this,e)}}const ie=w.litHtmlPolyfillSupport;ie?.(K,Y),(w.litHtmlVersions??=[]).push("3.1.4");
/**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
class oe extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let o=i._$litPart$;if(void 0===o){const e=s?.renderBefore??null;i._$litPart$=o=new Y(t.insertBefore(H(),e),e,void 0,s??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}}oe._$litElement$=!0,oe.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:oe});const ne=globalThis.litElementPolyfillSupport;ne?.({LitElement:oe}),(globalThis.litElementVersions??=[]).push("4.0.6");window.customElements.define("dile-pages",class extends oe{static get properties(){return{attrForSelected:{type:String},selected:{type:String},selectorId:{type:String},showDisplay:{type:String}}}render(){return B`
    <slot></slot>
    `}constructor(){super(),this.transitionTime=1e3,this.selected=0,this._pageInitialization(),this._onSelectorIdChangedHandler=this._onSelectorIdChanged.bind(this),this.showDisplay="block"}static get styles(){return n`
      :host {
        display: block;
      }
    `}_pageInitialization(){this.pages=[];let e=this.children;for(let t of e)t.style.display="none",t.style.transition=`opacity ${this.transitionTime}ms`,t.style.opacity="0",this.pages.push(t)}initializeExternalPages(e){this.innerHTML=e,this._pageInitialization()}firstUpdated(){let e=this._selectPage(this.selected,this.attrForSelected);e&&(e.style.display=this.showDisplay),this.selectorId&&document.addEventListener("dile-selected-changed",this._onSelectorIdChangedHandler)}disconnectedCallback(){super.disconnectedCallback(),this.selectorId&&document.removeEventListener("dile-selected-changed",this._onSelectorIdChangedHandler)}updated(e){if(this._updatedAndNotUndefined(e,"selected")||this._updatedAndNotUndefined(e,"attrForSelected")){let t=this._getLastValueProperty(e,"selected"),s=this._getLastValueProperty(e,"attrForSelected");this.hidePage(t,s)}this._showCurrentPage()}_selectPage(e,t){let s;if(t){for(let i of this.pages)if(i.getAttribute(t)==e){s=i;break}}else s=this.pages[e];return s}_showCurrentPage(){let e=this._selectPage(this.selected,this.attrForSelected);e&&(e.style.display=this.showDisplay,setTimeout((()=>{e.style.opacity="1"}),50))}hidePage(e,t){let s=this._selectPage(e,t);s&&(s.style.display="none",s.style.opacity="0")}_updatedAndNotUndefined(e,t){return e.has(t)&&null!=e.get(t)}_getLastValueProperty(e,t){return e.has(t)?e.get(t):this[t]}_onSelectorIdChanged(e){e.detail.selectorId==this.selectorId&&(this.selected=e.detail.selected)}});const re=n`
    .dile-icon path, .dile-icon polygon {
      fill: var(--dile-icon-color, #888);
    }
    .dile-icon path[fill="none"] {
      fill: transparent;
    }
    .dile-icon {
      width: var(--dile-icon-size, 24px);
      height: var(--dile-icon-size, 24px);
    }
  `,ae=B`<svg class="dile-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`;window.customElements.define("dile-icon",class extends oe{static get properties(){return{icon:{type:Object}}}static get styles(){return[re,n`
        :host {
          display: inline-block;
          transition-duration: 0.3s;
          transition-timing-function: ease-in-out;
          transition-property: background-color;
        }
        span {
          display: flex;
          align-items: center;
        }
        path {
          transition-duration: 0.3s;
          transition-timing-function: ease-in-out;
          transition-property: fill;
        }
        :host([rounded]) {
          background-color: var(--dile-icon-rounded-background-color, #eee);
          border-radius: 50%;
          padding: var(--dile-icon-rounded-padding, 0.5rem);
        }
    `]}render(){return B`
      <span>${this.icon}</span>
    `}});const le=e=>class extends e{constructor(){super(),this.closeOnEscHandler=this.escClose.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this.closeOnEscHandler)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this.closeOnEscHandler)}escClose(e){"Escape"===e.key&&this.opened&&this.close()}close(){console.log("You need to implement a close method!")}};class de extends(le(oe)){static get properties(){return{_toChange:{type:Boolean},opened:{type:Boolean},showCloseIcon:{type:Boolean},blocking:{type:Boolean}}}constructor(){super(),this._toChange=!1,this.opened=!1,this.showCloseIcon=!1,this.blocking=!1}static get styles(){return[n`
        * {
          box-sizing: border-box;
        }
        :host {
          display: block;
          --dile-close-icon-template-color: var(
            --dile-modal-close-icon-color,
            #888
          );
        }
        .closeicon {
          --dile-icon-color: var( --dile-modal-close-icon-color, #888);
        }
        section {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: 100vw;
          display: none;
          transition: opacity var(--dile-modal-animation-duration, 0.3s) ease-in;
          -webkit-transition: opacity var(--dile-modal-animation-duration, 0.3s)
            ease-in;
          align-items: center;
          justify-content: center;
          z-index: var(--dile-modal-z-index, 100);
          background-color: var(
            --dile-modal-background-color,
            rgba(30, 30, 30, 0.8)
          );
        }
        .content {
          display: block;
          position: relative;
          z-index: var(--dile-modal-content-z-index, 101);
          width: var(--dile-modal-width, 280px);
          min-width: var(--dile-modal-min-width, 250px);
          max-width: var(--dile-modal-max-width, 100vw);
          height: var(--dile-modal-height, auto);
          min-height: var(--dile-modal-min-height, auto);
          max-height: var(--dile-modal-max-height, 100vh);
          background-color: var(--dile-modal-content-background-color, #fff);
          box-shadow: var(--dile-modal-content-shadow-displacement, 6px)
            var(--dile-modal-content-shadow-displacement, 6px)
            var(--dile-modal-content-shadow-blur, 16px)
            var(--dile-modal-content-shadow-color, #000);
          border-radius: var(--dile-modal-border-radius, 15px);
          padding: var(--dile-modal-content-padding, 1em) 0
            var(--dile-modal-content-padding, 1em)
            var(--dile-modal-content-padding, 1em);
        }
        article {
          overflow: auto;
          max-height: 100%;
          height: 100%;
          padding-right: var(--dile-modal-content-padding, 1em);
        }
        .transparent {
          opacity: 0;
        }
        .opaque {
          opacity: 1;
          display: flex !important;
        }
        .opened {
          display: flex !important;
        }
        dile-icon {
          position: absolute;
          display: inline-block;
          top: var(--dile-modal-close-icon-top, 5px);
          right: var(--dile-modal-close-icon-right, 18px);
          z-index: 1002;
          width: var(--dile-modal-close-icon-size, 24px);
          height: var(--dile-modal-close-icon-size, 24px);
          cursor: var(--dile-modal-close-icon-cursor, pointer);
        }
        .contentIconSeparation {
          padding-top: var(--dile-modal-extra-top-separation-when-icon, 10px);
        }
      `]}render(){return B`
      <section
        class="${this.getModalClass(this.opened,this._toChange)}"
        @click="${this._backgroundModalClick}"
        @transitionend="${this.animationEnd}"
        id="backgroundmodal"
      >
        <div class="content" @click="${this.contentClick}">
          ${this.showCloseIcon?B`<dile-icon .icon="${ae}" @click="${this.close}" class="closeicon"></dile-icon>`:""}
          <article class="${this.showCloseIcon?"contentIconSeparation":""}">
            <slot></slot>
          </article>
        </div>
      </section>
    `}getModalClass(e,t){return e||t?e&&t?"transparent opened":e&&!t?"opaque":!e&&t?"transparent opened":"":"transparent"}open(){this.opened=!0,this._toChange=!0,setTimeout((()=>{this._toChange=!1}),50)}_backgroundModalClick(e){!this.blocking&&e.target&&"backgroundmodal"===e.target.getAttribute("id")&&(this.close(),this.dispatchEvent(new CustomEvent("dile-modal-background-closed",{bubbles:!0,composed:!0,detail:this})))}close(){this.opened=!1,this._toChange=!0,this.dispatchEvent(new CustomEvent("dile-modal-closed",{bubbles:!0,composed:!0,detail:this}))}animationEnd(){this._toChange=!1}}customElements.define("dile-modal",de);class ce extends oe{static styles=n`
    #showpage1 {
        font-size: large;
        }
    `;render(){return B`
      <p>
        <button id="showpage1">Show page 1</button>
        <button id="showpage2">Show page 2</button>
        <button id="showpage3">Show page 3</button>
      </p>
      <dile-pages selected="page1" attrforselected="name">
        <div name="page1">
        <div class="container">
        <h1>Survey Data Export</h1>
        <div class="form-group">
            <label for="portal">Select Portal:</label>
            <select id="portal">
                <option value="">-- Select Portal --</option>
                <option value="newportal.x5.ru">newportal.x5.ru</option>
                <option value="example.x5.ru">example.x5.ru</option>
                <option value="data.x5.ru">data.x5.ru</option>
            </select>
        </div>
        <div class="form-group" id="campaign-group" style="display: none;">
            <label for="campaign">Select Survey:</label>
            <select id="campaign"></select>
        </div>
        <div class="form-group">
            <label for="date">Select Date:</label>
            <input type="date" id="date">
        </div>
        <button id="download-btn">Download Excel</button>
            
        </div>
        </div>
        <div name="page2">
          <h2>Page 2</h2>
          <ul>
            <li>item 1</li>
            <li>item 2</li>
            <li>item 3</li>
          </ul>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde excepturi atque, et quaerat vero saepe maiores, maxime dolore officiis earum cumque temporibus tenetur, possimus deserunt magni itaque! Reiciendis, assumenda quo?</p>
        </div>
        <div name="page3">
          <h2>Page three</h2>
          <p>Just another page</p>
        </div>
      </dile-pages>
    `}firstUpdated(){this.shadowRoot.getElementById("showpage2").addEventListener("click",(()=>{this.shadowRoot.querySelector("dile-pages").selected="page2"})),this.shadowRoot.getElementById("showpage3").addEventListener("click",(()=>{this.shadowRoot.querySelector("dile-pages").selected="page3"})),this.dispatchEvent(new CustomEvent("component-ready",{bubbles:!0,composed:!0}))}}customElements.define("modal-component",class extends oe{static get styles(){return n`
    .myModalCustomized h2 {
        margin-top: 0;
      }
      .myModalCustomized {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        --dile-modal-border-radius: 0;
        --dile-modal-max-height: 227vh;
        --dile-modal-min-width: 110vh;
        --dile-modal-height: 77vh;
        --dile-modal-min-height, 76vh
      }
      .myModalCustomized #preview {
        max-height: 300px;
      } 
      .myModalCustomized #backgroundmodal div {
        width: 740px;
      }
      .article {
        display: inline-block;
      }
      section {
        background-color: none;
        backdrop-filter: blur(2px);
      }
      .contentIconSeparation {
        overflow: auto;
        max-height: 273px;
      }
      dile-modal section .content {
        max-height: 270px;
      }
      table {
        width: 100%;
        border-collapse: collapse; /* Ensures borders do not have spacing between them */
      }

      th, td {
        border: 1px solid black; /* Adds border to table cells */
        padding: 8px;
        text-align: left; /* Align text to the left */
      }

      th {
        background-color: #f2f2f2; /* Light gray background for headers */
      }

    `}render(){return B`
  <button id="preview-btn">Show Preview</button>
  <dile-modal id="elmodal4" class="myModalCustomized" showCloseIcon>
  
    <div class="preview" id="preview" style="display: none;">
      <h2>Data Preview</h2>
      <table>
          <thead id="preview-thead"></thead>
          <tbody id="preview-tbody"></tbody>
      </table>
    </div>
  </dile-modal>
  `}firstUpdated(){this.shadowRoot.getElementById("preview-btn").addEventListener("click",(()=>{this.shadowRoot.getElementById("elmodal4").open()})),this.dispatchEvent(new CustomEvent("modal-ready",{bubbles:!0,composed:!0}))}}),customElements.define("my-component",ce);const he=e=>class extends e{static get properties(){return{selected:{type:String},attrForSelected:{type:String},selectorId:{type:String},hashSelection:{type:Boolean}}}constructor(){super(),this._items=[],this.hashSelection=!1,this.itemSelectedChangedHandler=this._itemSelectedChanged.bind(this),this.onHashChangeHandler=this._onHashChange.bind(this)}_onHashChange(){if(this.hashSelection){let e,t=this.getItems(),s=this.getCleanHash(),i=t.find(((t,i)=>{let o=this.getItemValueComputed(t,i);return e=i,o==s}));if(i){let t=this.getItemValueComputed(i,e);this.selected!=t&&(this.selected=t,this.setSelectedItem(),this.dispatchSelectedChanged())}}}getCleanHash(){let e=window.location.hash;return e.length>1&&(e=e.substring(1)),e}getItemValueComputed(e,t){return this.attrForSelected?e.getAttribute(this.attrForSelected):t}connectedCallback(){super.connectedCallback(),this.addEventListener("dile-item-selected",this.itemSelectedChangedHandler),window.addEventListener("hashchange",this.onHashChangeHandler)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("dile-item-selected",this.itemSelectedChangedHandler),window.removeEventListener("hashchange",this.onHashChangeHandler)}firstUpdated(){super.firstUpdated(),this._items=this.getItems();let e=0;this._items.forEach((t=>{t._assignedIndex=e,e++})),this._onHashChange(),this.setSelectedItem(),void 0!==this.selected&&setTimeout((()=>this.dispatchSelectedChanged()),500)}render(){return B`
        <slot></slot>
      `}setSelectedItem(){if(this._items=this.getItems(),this.attrForSelected)this._items.forEach((e=>{e.getAttribute(this.attrForSelected)==this.selected?e.selected=!0:e.selected=!1}));else{let e=parseInt(this.selected);!isNaN(e)&&this._items[e]&&this._items.forEach(((t,s)=>{t.selected=s==e}))}this.hashSelection&&null!=this.selected&&(window.location.hash=this.selected)}_itemSelectedChanged(e){this.attrForSelected?this.selected=e.detail.getAttribute(this.attrForSelected):this.selected=e.detail._assignedIndex,this.dispatchSelectedChanged()}dispatchSelectedChanged(){this.dispatchEvent(new CustomEvent("dile-selected-changed",{bubbles:!0,composed:!0,detail:{selected:this.selected,selectorId:this.selectorId}}))}updated(e){this.setSelectedItem()}getItems(){return this.shadowRoot.querySelector("slot").assignedElements({flatten:!0})}},pe=e=>class extends e{static get properties(){return{selected:{type:Boolean,reflect:!0},index:{type:Number}}}constructor(){super(),this.selected=!1}select(){this.dispatchEvent(new CustomEvent("dile-item-selected",{bubbles:!0,composed:!0,detail:this}))}};class ue extends(pe(oe)){static get styles(){return n`
      :host {
        display: inline-block;
        margin: 0 3px;
      }
      article {
        border-top-left-radius: var(--dile-tab-border-radius, 4px);
        border-top-right-radius: var(--dile-tab-border-radius, 4px);
        transition: all 0.3s ease;
        color: var(--dile-tab-text-color, #666);
        background-color: var(--dile-tab-background-color, transparent);
        cursor: pointer;
        border: var(--dile-tab-border, none);
        font-weight: var(--dile-tab-font-weight, normal);
        font-size: var(--dile-tab-font-size, 1rem);
      }
      div.label {
        padding: var(--dile-tab-padding, 8px 12px 6px 12px);
        text-transform: var(--dile-tab-text-transform, uppercase);
        white-space: nowrap;
      }
      .selected {
        background-color: var(--dile-tab-selected-background-color, #039be5);
        color: var(--dile-tab-selected-text-color, #fff);
        border: var(--dile-tab-selected-border, none);
      }
      span {
        display: block;
        height: var(--dile-tab-selected-line-height, 5px);
        width: 0;
        background-color: var(--dile-tab-selected-line-color, #0070c0);
        transition: width 0.3s ease;
      }
      .markselected {
        width: 100%;
      }
      .line {
        display: flex;
        justify-content: center;
      }
    `}render(){return B`
      <article @click='${this.select}' class="${this.selected?"selected":""}">
        <div class="label"><slot></slot></div>
        <div class="line">
          <span class="${this.selected?"markselected":""}"></span>
        </div>
      </article>
    `}}window.customElements.define("dile-tab",ue);class me extends(he(oe)){static get styles(){return n`
      :host {
        display: flex;
      }
    `}}window.customElements.define("dile-tabs",me);class ge extends oe{static styles=n`
    #showpage1 {
      font-size: large;
    }
    dile-tabs dile-tab, dile-tab selected  {
        background: #63b14d;
    }

    .tab {
      background: #63b14d;
    }
  `;render(){return B`
      <dile-tabs selectorId="selector1" attrforselected="name" selected="one">
        <dile-tab class="tab" name="one">One</dile-tab>
        <dile-tab class="tab" name="two">Two</dile-tab>
      </dile-tabs>
      <hr>
      <dile-pages selectorId="selector1" attrforselected="name">
        <section name="one">
          <p>Page one...</p>
          Lorem ipsum...
        </section>
        <section name="two">
          <p>Page two...</p>
          Other page...
        </section>
      </dile-pages>
    `}firstUpdated(){}}customElements.define("page-component",ge)}();
//# sourceMappingURL=bundle.js.map
