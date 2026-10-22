(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[205],{5044:function(e,t,r){Promise.resolve().then(r.bind(r,4763))},4763:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return m}});var a=r(7437),s=r(2265),n=r(5153),l=r(2328),i=r(6881),c=r(2022),o=r(9832),u=r(4086),d=r(4453);function m(){let e=(0,n.T)("auth"),t=(0,l.tv)(),[r,m]=(0,s.useState)({name:"",phone:"",email:"",password:""}),[p,h]=(0,s.useState)(""),[f,x]=(0,s.useState)(!1),v=e=>t=>m(r=>({...r,[e]:t.target.value}));async function g(a){a.preventDefault(),x(!0),h("");let{data:s,error:n}=await i.O.auth.signUp({email:r.email,password:r.password,options:{data:{name:r.name}}});if(n){h(e("registerError")),x(!1);return}s.user&&await i.O.from("profiles").update({name:r.name,phone:r.phone}).eq("id",s.user.id),t.push("/account")}return(0,a.jsx)("div",{className:"min-h-screen flex items-center justify-center px-6 pt-20",children:(0,a.jsxs)("div",{className:"w-full max-w-md",children:[(0,a.jsxs)("div",{className:"text-center mb-10",children:[(0,a.jsx)("p",{className:"section-subtitle mb-2",children:e("registerBadge")}),(0,a.jsx)("h1",{className:"text-3xl font-serif text-cream",children:e("registerTitle")}),(0,a.jsx)("div",{className:"gold-divider"})]}),(0,a.jsxs)("form",{onSubmit:g,className:"card-dark p-8 space-y-4",children:[(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(c.Z,{size:16,className:"absolute left-4 top-1/2 -translate-y-1/2 text-gold/40"}),(0,a.jsx)("input",{type:"text",value:r.name,onChange:v("name"),placeholder:e("name"),required:!0,className:"input-field pl-11"})]}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(o.Z,{size:16,className:"absolute left-4 top-1/2 -translate-y-1/2 text-gold/40"}),(0,a.jsx)("input",{type:"tel",value:r.phone,onChange:v("phone"),placeholder:e("phone"),className:"input-field pl-11"})]}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(u.Z,{size:16,className:"absolute left-4 top-1/2 -translate-y-1/2 text-gold/40"}),(0,a.jsx)("input",{type:"email",value:r.email,onChange:v("email"),placeholder:e("email"),required:!0,className:"input-field pl-11"})]}),(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsx)(d.Z,{size:16,className:"absolute left-4 top-1/2 -translate-y-1/2 text-gold/40"}),(0,a.jsx)("input",{type:"password",value:r.password,onChange:v("password"),placeholder:e("password"),required:!0,minLength:6,className:"input-field pl-11"})]}),p&&(0,a.jsx)("div",{className:"bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-sm",children:p}),(0,a.jsx)("button",{type:"submit",disabled:f,className:"btn-primary w-full text-center disabled:opacity-50 disabled:cursor-not-allowed",children:f?e("loading"):e("registerBtn")})]}),(0,a.jsxs)("p",{className:"text-center text-cream/40 text-sm mt-6",children:[e("alreadyHaveAccount")," ",(0,a.jsx)(l.rU,{href:"/auth/login",className:"text-gold hover:underline transition-colors",children:e("loginLink")})]})]})})}},2328:function(e,t,r){"use strict";r.d(t,{rU:function(){return n},jD:function(){return i},tv:function(){return c}});var a=r(7600);let s=(0,r(7066).Z)({locales:["ka","en","ru"],defaultLocale:"ka",localePrefix:"always"}),{Link:n,redirect:l,usePathname:i,useRouter:c}=(0,a.Z)(s)},6881:function(e,t,r){"use strict";r.d(t,{O:function(){return a}});let a=(0,r(7427).eI)("https://swtsszumgtgmrobxrmtw.supabase.co","sb_publishable_27N3Qpe-k_WKvVjHj6TsZQ_cVgjPUSv")},8030:function(e,t,r){"use strict";r.d(t,{Z:function(){return c}});var a=r(2265);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),n=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&r.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var l={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a.forwardRef)((e,t)=>{let{color:r="currentColor",size:s=24,strokeWidth:i=2,absoluteStrokeWidth:c,className:o="",children:u,iconNode:d,...m}=e;return(0,a.createElement)("svg",{ref:t,...l,width:s,height:s,stroke:r,strokeWidth:c?24*Number(i)/Number(s):i,className:n("lucide",o),...m},[...d.map(e=>{let[t,r]=e;return(0,a.createElement)(t,r)}),...Array.isArray(u)?u:[u]])}),c=(e,t)=>{let r=(0,a.forwardRef)((r,l)=>{let{className:c,...o}=r;return(0,a.createElement)(i,{ref:l,iconNode:t,className:n("lucide-".concat(s(e)),c),...o})});return r.displayName="".concat(e),r}},4453:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(8030).Z)("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]])},4086:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(8030).Z)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]])},9832:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(8030).Z)("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]])},2022:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(8030).Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])}},function(e){e.O(0,[762,385,153,864,971,23,744],function(){return e(e.s=5044)}),_N_E=e.O()}]);