webpackJsonp([10],{"9E3L":function(t,e,n){var i=n("RaNg");"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);n("rjj0")("2ccbeaca",i,!0)},RaNg:function(t,e,n){(t.exports=n("FZ+f")(!1)).push([t.i,"\n.content-container[data-v-664015ba] {\r\n  position: relative;\r\n  padding: 0px;\r\n  width: 100%;\r\n  height: 85vh;\n}\n.box-card[data-v-664015ba] {\r\n  margin: 0px 5px;\n}\n.links-icon[data-v-664015ba] {\r\n  width: 24px;\r\n  height: 24px;\n}\n.input-new-tag[data-v-664015ba] {\r\n  width: 100px;\n}\r\n",""])},"Z+wY":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("JAv/"),s={name:"hostlist",data:function(){return{form:{hostname:"",ip:"",tag:""},tableData:[],fetchSuccess:!0,tableSelections:[],dialogVisible:!1,hostInEdit:{},tagInputVisible:!1,tagInputValue:"",search_hostname:"",page:{currentPage:1,size:10,total:5},tableLoading:!1}},methods:{editHost:function(t){this.dialogVisible=!0,this.hostInEdit=t},deleteHosts:function(){for(var t=[],e=this,n=0;n<this.tableSelections.length;n++){var s=this.tableSelections[n];t.push(s.properties.uid)}Object(i.e)({uids:t}).then(function(t){e.fetchHostList()}).catch(function(t){console.log(t)})},handleEditClose:function(){this.dialogVisible=!1,this.hostInEdit={}},tagHandleClose:function(t){this.hostInEdit.properties.tags.splice(this.hostInEdit.properties.tags.indexOf(t),1),this.updateHostTags()},tagHandleInputConfirm:function(){var t=this.tagInputValue;this.tagInputVisible=!1,this.tagInputValue="",void 0===this.hostInEdit.properties.tags&&(this.hostInEdit.properties.tags=[]),""!==t&&(this.hostInEdit.properties.tags.push(t),this.updateHostTags())},updateHostTags:function(){var t=this,e={uid:this.hostInEdit.properties.uid,tags:this.hostInEdit.properties.tags},n=this;Object(i.f)(e).then(function(t){console.log(t),n.fetchHostList()}).catch(function(e){t.fetchSuccess=!1,console.log(e)})},tagShowInput:function(){var t=this;this.tagInputVisible=!0,this.$nextTick(function(e){t.$refs.saveTagInput.$refs.input.focus()})},reset:function(){this.form={hostname:"",ip:"",tag:""},this.fetchHostList()},fetchHostList:function(){var t=this;this.freshHostCount(),this.tableLoading=!0,this.form.skip=this.page.size*(this.page.currentPage-1),this.form.limit=this.page.size*this.page.currentPage,Object(i.a)(this.form).then(function(e){console.log(e);var n=e.data;t.tableData=n.nodes,t.tableLoading=!1}).catch(function(e){t.fetchSuccess=!1,t.tableLoading=!1,console.log(e)})},freshHostCount:function(){var t=this;Object(i.d)().then(function(e){var n=e.data;t.page.total=parseInt(n.node_count)}).catch(function(t){console.log(t)})},handleCurrentChange:function(t){this.page.currentPage=t,this.fetchHostList()},handleSizeChange:function(t){this.page.size=t,this.fetchHostList()},selectionChange:function(t){this.tableSelections=t},showInput:function(){var t=this;this.inputVisible=!0,this.$nextTick(function(e){t.$refs.saveTagInput.$refs.input.focus()})}},mounted:function(){},created:function(){this.fetchHostList()}},a={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"content-container"},[n("el-row",[n("el-col",{attrs:{span:24}},[n("el-form",{ref:"form",attrs:{model:t.form,inline:!0,"label-width":"90px"}},[n("el-form-item",{attrs:{label:t.$t("host.hostname")}},[n("el-input",{model:{value:t.form.hostname,callback:function(e){t.$set(t.form,"hostname",e)},expression:"form.hostname"}})],1),t._v(" "),n("el-form-item",{attrs:{label:t.$t("host.ips")}},[n("el-input",{model:{value:t.form.ip,callback:function(e){t.$set(t.form,"ip",e)},expression:"form.ip"}})],1),t._v(" "),n("el-form-item",{attrs:{label:t.$t("host.tag")}},[n("el-input",{model:{value:t.form.tag,callback:function(e){t.$set(t.form,"tag",e)},expression:"form.tag"}})],1),t._v(" "),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:t.fetchHostList}},[t._v(t._s(t.$t("host.search")))])],1),t._v(" "),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:t.reset}},[t._v(t._s(t.$t("host.reset")))])],1)],1)],1)],1),t._v(" "),n("el-row",[n("el-col",{attrs:{span:24}},[n("div",{staticStyle:{"margin-bottom":"10px"}},[n("el-button-group",[n("el-button",{attrs:{size:"mini",disabled:!(t.tableSelections.length>0),type:"primary",icon:"el-icon-delete"},on:{click:t.deleteHosts}})],1)],1),t._v(" "),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.tableLoading,expression:"tableLoading"}],staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:!0,border:!1},on:{"selection-change":t.selectionChange}},[n("el-table-column",{attrs:{type:"selection",width:"30"}}),t._v(" "),n("el-table-column",{attrs:{prop:"identity",label:t.$t("host.chart"),width:"90px"},scopedSlots:t._u([{key:"default",fn:function(t){return[n("router-link",{attrs:{to:"/charts/link/"+t.row.properties.uid+"/0/0/1"}},[n("svg-icon",{staticClass:"links-icon",attrs:{"icon-class":"wang"}})],1)]}}])}),t._v(" "),n("el-table-column",{attrs:{prop:"properties.hostname",label:t.$t("host.hostname")}}),t._v(" "),n("el-table-column",{attrs:{label:t.$t("host.ips")},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.properties.ips,function(e){return n("div",{key:e},[t._v("\n                "+t._s(e)+"\n              ")])})}}])}),t._v(" "),n("el-table-column",{attrs:{label:t.$t("host.tag")},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.properties.tags,function(i){return e.row.properties.tags?n("el-tag",{key:i,attrs:{"disable-transitions":!1}},[t._v("\n                "+t._s(i)+"\n              ")]):t._e()})}}])}),t._v(" "),n("el-table-column",{attrs:{label:t.$t("host.action")},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{type:"default",size:"mini",icon:"el-icon-edit"},on:{click:function(n){t.editHost(e.row)}}})]}}])})],1),t._v(" "),n("el-pagination",{attrs:{"current-page":t.page.currenPage,"page-sizes":[5,10,30,50],"page-size":t.page.size,layout:"total, sizes, prev, pager, next",total:t.page.total,small:"true"},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1),t._v(" "),n("el-dialog",{attrs:{title:"EDIT",visible:t.dialogVisible,width:"30%","before-close":t.handleEditClose},on:{"update:visible":function(e){t.dialogVisible=e}}},[t.hostInEdit.identity?n("div",[n("p",[t._v("hostname: "+t._s(t.hostInEdit.properties.hostname))]),t._v(" "),n("p",[t._v("ip:"),t._l(t.hostInEdit.properties.ips,function(e){return n("span",{key:e},[t._v(t._s(e)+";")])})],2),t._v(" "),n("div",[t._l(t.hostInEdit.properties.tags,function(e){return n("el-tag",{key:e,attrs:{closable:"","disable-transitions":!1},on:{close:function(n){t.tagHandleClose(e)}}},[t._v("\n          "+t._s(e)+"\n        ")])}),t._v(" "),t.tagInputVisible?n("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"mini"},on:{blur:t.tagHandleInputConfirm},nativeOn:{keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"enter",13,e.key))return null;t.tagHandleInputConfirm(e)}},model:{value:t.tagInputValue,callback:function(e){t.tagInputValue=e},expression:"tagInputValue"}}):n("el-button",{staticClass:"button-new-tag",attrs:{size:"mini"},on:{click:t.tagShowInput}},[t._v("+ New Tag")])],2),t._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"})]):t._e()])],1)},staticRenderFns:[]};var o=n("VU/8")(s,a,!1,function(t){n("9E3L")},"data-v-664015ba",null);e.default=o.exports}});