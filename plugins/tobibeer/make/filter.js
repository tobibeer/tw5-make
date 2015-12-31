/*\
title: $:/plugins/tobibeer/make/filters.js
type: application/javascript
module-type: filteroperator

a filter to generate tiddler titles

@preserve
\*/
(function(){"use strict";exports.make=function(e,t,i){var r,a,n,d,u,c,l,s,p=[],m=i.widget,o=i.wiki,f=[],g={inc:1,min:1,sep:" ",tiddler:m?m.getVariable("currentTiddler"):""},x=/\%TITLE\%/gim,h=/\%COUNT\%/gim,w=/\%DATE\%/gim,D=/\%UUID\%/gim,k=/\%MAX\%/gim,T=/RANDOM\((\d*)\)/gim,b=/\%TIDDLER\%/gim,$=/^\s*([\$\w\d\-\_\/]*):(.*)(?:\s*)$/,q=function(e,t){t=t||16;var i="",r=function(){var e=Math.floor(Math.random()*62);return e<10?e:e<36?String.fromCharCode(e+55):String.fromCharCode(e+61)};while(t--){i+=r()}return i},N=function(e,t){return o.getTextReference(t,"",g.tiddler)},v=function(e,t){return m?m.getVariable(t):""},C=function(e){return e.replace(/{{([^}]*)}}/gm,N).replace(/<<([^>]*)>>/gm,v)},E=function(e,t){var i=0,r=t,a=o.getTiddler(g.tiddler),n=g.uniq===1?o.getTiddlerData(g.tiddler,{}):0;while(e.indexOf(r)>=0||!g.uniq&&o.tiddlerExists(r)||g.uniq===0&&a.hasField(r)||g.uniq===1&&$tw.utils.hop(n,r)){i++;r=t+g.sep+i.toString()}return r};e(function(e,t){p.push(t)});d=!(p.length===1&&!p[0]);try{$tw.utils.each((t.operand||"").split("\\"),function(e){var t;e=e.trim();if(e){u=$.exec(e);if(u){switch(u[1]){case"min":case"max":case"inc":t=parseInt(C(u[2]));if(isNaN(t)||t<1){t=1}g[u[1]]=t;break;case"sep":g.sep=u[2];break;case"unique":g.uniq=u[2]==="field"?0:1;break;case"pad":g.pad=parseInt(u[2]);break;case"tiddler":g.tiddler=u[2];break;case"date-format":g.dateFormat=u[2].trim();break}}else if(g.expr===undefined){g.expr=e}}});if(g.uniq===0){g.sep=g.sep===" "?"":g.sep.trim()}if(g.expr===undefined){g.expr="%tiddler%"}if(g.pad!==undefined&&isNaN(g.pad)){g.pad=g.max?g.max.toString().length:2}if(d){g.max=g.max?Math.min(p.length,g.max):p.length}if(!g.max||g.max<g.min){g.max=g.min}l=new Date;n=l;g.count=g.min;c=T.test(g.expr);if(w.test(g.expr)){r=g.dateFormat?$tw.utils.formatDateString(l,g.dateFormat):$tw.utils.stringifyDate(l)}s=D.test(g.expr);do{a=C(g.expr);if(c){a=a.replace(T,q)}if(s){a=a.replace(D,$tw.utils.uuid())}a=E(f,a.replace(b,g.tiddler).replace(x,d?p[g.count-1]:g.tiddler).replace(k,g.max).replace(h,g.pad?$tw.utils.pad(g.count,g.pad):g.count).replace(w,r));f.push(a);g.count=g.count+g.inc;if(g.count%500===0){n=new Date}}while(g.count<=g.max&&n-l<5e3)}catch(I){return["Error in make filter:\n"+I]}return f}})();