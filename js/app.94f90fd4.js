(function(t){function e(e){for(var a,s,o=e[0],l=e[1],c=e[2],d=0,p=[];d<o.length;d++)s=o[d],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&p.push(r[s][0]),r[s]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);u&&u(e);while(p.length)p.shift()();return n.push.apply(n,c||[]),i()}function i(){for(var t,e=0;e<n.length;e++){for(var i=n[e],a=!0,o=1;o<i.length;o++){var l=i[o];0!==r[l]&&(a=!1)}a&&(n.splice(e--,1),t=s(s.s=i[0]))}return t}var a={},r={app:0},n=[];function s(e){if(a[e])return a[e].exports;var i=a[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,s),i.l=!0,i.exports}s.m=t,s.c=a,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)s.d(i,a,function(e){return t[e]}.bind(null,a));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],l=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var u=l;n.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},"0174":function(t,e,i){"use strict";i("134d")},"134d":function(t,e,i){},"56d7":function(t,e,i){"use strict";i.r(e);i("e260"),i("e6cf"),i("cca6"),i("a79d");var a=i("2b0e"),r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-app",[i("v-app-bar",{attrs:{app:"",dark:"",color:"primary"}},[i("div",{staticClass:"d-flex align-center"},[i("span",[t._v("Test App")])])]),i("v-main",[i("List")],1)],1)},n=[],s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"list pt-5"},[i("div",{staticClass:"pl-4 pr-4 text-right"},[i("v-btn",{attrs:{color:"secondary",small:""},on:{click:function(e){t.editDialog=!0}}},[i("v-icon",[t._v(" mdi-plus ")]),t._v(" Add Item ")],1)],1),i("v-list",{attrs:{dense:""}},[i("draggable",{on:{end:t.sortItems},model:{value:t.currentList,callback:function(e){t.currentList=e},expression:"currentList"}},t._l(t.currentList,(function(e,a){return i("v-list-item",{key:a},[i("list-item",{attrs:{item:e},on:{edit:function(e){return t.editItem(a)},remove:function(e){return t.removeItem(a)}}})],1)})),1)],1)],1),i("v-pagination",{attrs:{length:t.pageLength,"total-visible":7},model:{value:t.currentPage,callback:function(e){t.currentPage=e},expression:"currentPage"}}),i("v-dialog",{attrs:{persistent:"","max-width":"390"},model:{value:t.editDialog,callback:function(e){t.editDialog=e},expression:"editDialog"}},[i("v-card",[i("v-card-title",{staticClass:"headline"},[t._v(" "+t._s(void 0!=t.editableItemIndex?"Edit":"Add")+" Item ")]),i("v-form",{ref:"form",attrs:{"lazy-validation":""},on:{submit:function(e){return e.preventDefault(),t.saveItem(e)}},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[i("v-card-text",[i("v-text-field",{attrs:{label:"Item name",placeholder:"Name...",autofocus:"",rules:[function(t){return!!t||"Item is required"}]},model:{value:t.itemName,callback:function(e){t.itemName="string"===typeof e?e.trim():e},expression:"itemName"}})],1),i("v-card-actions",[i("v-btn",{attrs:{color:"error",depressed:""},on:{click:t.closeDialog}},[t._v(" Cancel ")]),i("v-spacer"),i("v-btn",{attrs:{color:"primary",depressed:"",type:"submit"}},[t._v(" Save ")])],1)],1)],1)],1)],1)},o=[],l=(i("99af"),i("fb6a"),i("a434"),i("96cf"),i("1da1")),c=i("2909"),u=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"list-item"},[i("v-card",{staticClass:"list-item-card"},[i("div",{staticClass:"list-item-content"},[i("div",{staticClass:"list-item_title",on:{dblclick:t.edit}},[t._v(" "+t._s(t.item)+" ")]),i("div",[i("v-btn",{attrs:{fab:"",depressed:"","x-small":"",color:"error"},on:{click:t.remove}},[i("v-icon",{attrs:{dark:""}},[t._v(" mdi-delete ")])],1)],1)])])],1)},d=[],p={props:{item:{type:String,required:!0}},methods:{edit:function(){this.$emit("edit")},remove:function(){this.$emit("remove")}}},f=p,m=(i("0174"),i("2877")),v=i("6544"),h=i.n(v),g=i("8336"),b=i("b0af"),P=i("132d"),y=Object(m["a"])(f,u,d,!1,null,null,null),I=y.exports;h()(y,{VBtn:g["a"],VCard:b["a"],VIcon:P["a"]});var x=i("b76a"),_=i.n(x),L={data:function(){return{list:[],listByPages:[],currentList:[],currentPage:1,pearPage:10,editDialog:!1,valid:!0,itemName:"",editableItemIndex:void 0}},computed:{pageLength:function(){return Math.ceil(this.list.length/this.pearPage)}},methods:{randomString:function(t){for(var e="",i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",a=i.length,r=0;r<t;r++)e+=i.charAt(Math.floor(Math.random()*a));return e},getItemsList:function(){var t=JSON.parse(localStorage.getItem("list"));if(t&&t.length)this.list=t;else for(var e=0;e<100;e++)this.list.push(this.randomString(10));this.saveLocally()},splitToPages:function(){for(var t=[],e=0;e<=this.list.length;e+=this.pearPage)t.push(this.list.slice(e,e+this.pearPage));this.listByPages=t,this.getCurrentPage()},getCurrentPage:function(){this.currentList=this.listByPages[this.currentPage-1]},editItem:function(t){this.editableItemIndex=t,this.currentPage>1&&(this.editableItemIndex=t+(this.currentPage-1)*this.pearPage),this.itemName=this.list[this.editableItemIndex],this.editDialog=!0},removeItem:function(t){var e=t;this.currentPage>1&&(e=t+(this.currentPage-1)*this.pearPage),this.list.splice(e,1),this.saveLocally(),this.splitToPages()},saveItem:function(){this.$refs.form.validate(),this.valid&&(void 0!==this.editableItemIndex?this.list[this.editableItemIndex]=this.itemName:this.list.unshift(this.itemName),this.splitToPages(),this.saveLocally(),this.closeDialog())},closeDialog:function(){this.$refs.form.resetValidation(),this.editDialog=!1,this.editableItemIndex=void 0,this.itemName=""},sortItems:function(){var t,e=0;this.currentPage>1&&(e=(this.currentPage-1)*this.pearPage),(t=this.list).splice.apply(t,[e,this.pearPage].concat(Object(c["a"])(this.currentList))),this.saveLocally()},saveLocally:function(){localStorage.setItem("list",JSON.stringify(this.list))}},mounted:function(){var t=this;return Object(l["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.getItemsList();case 2:t.splitToPages();case 3:case"end":return e.stop()}}),e)})))()},components:{ListItem:I,draggable:_.a},watch:{currentPage:function(){this.getCurrentPage()}}},V=L,O=(i("f62b"),i("99d9")),w=i("169a"),C=i("4bd4"),k=i("8860"),j=i("da13"),S=i("891e"),D=i("2fa4"),N=i("8654"),T=Object(m["a"])(V,s,o,!1,null,null,null),M=T.exports;h()(T,{VBtn:g["a"],VCard:b["a"],VCardActions:O["a"],VCardText:O["b"],VCardTitle:O["c"],VDialog:w["a"],VForm:C["a"],VIcon:P["a"],VList:k["a"],VListItem:j["a"],VPagination:S["a"],VSpacer:D["a"],VTextField:N["a"]});var A={components:{List:M}},$=A,B=i("7496"),E=i("40dc"),J=i("f6c4"),q=Object(m["a"])($,r,n,!1,null,null,null),F=q.exports;h()(q,{VApp:B["a"],VAppBar:E["a"],VMain:J["a"]});var R=i("f309");a["a"].use(R["a"]);var z=new R["a"]({});a["a"].config.productionTip=!1,new a["a"]({vuetify:z,render:function(t){return t(F)}}).$mount("#app")},"65da":function(t,e,i){},f62b:function(t,e,i){"use strict";i("65da")}});
//# sourceMappingURL=app.94f90fd4.js.map