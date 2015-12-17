/*\
title: $:/plugins/tobibeer/make/filters.js
type: application/javascript
module-type: filteroperator

a filter to generate tiddler titles

@preserve
\*/
(function(){"use strict";exports.make=function(e,t,r){var i,n,a,c,m,s,u,f,d,l=r.widget,o=r.wiki,p=[],x={dateFormat:"YYYY0MM0DD0hh0mm0ss",inc:1,max:1,min:1},g=l?l.getVariable("currentTiddler"):"",w=/\%COUNT\%/gim,h=/\%DATE\%/gim,D=/\%UUID\%/gim,b=/\%MAX\%/gim,M=/RANDOM\((\d*)\)/gim,k=/^\s*([\$\w\d\-\_\/]*):(.*)(?:\s*)$/,T=function(e,t){return t?s.substr(0,Math.min(16,t)):s},$=function(e,t){return o.getTextReference(t,"",g)},N=function(e,t){return l?l.getVariable(t):""},Y=function(e){return e.replace(/{{([^}]*)}}/gm,$).replace(/<<([^>]*)>>/gm,N)},v=function(e,t){var r=0,i=t;while(e.indexOf(i)>=0||o.tiddlerExists(i)){r++;i=t+" "+r.toString()}return i};try{$tw.utils.each((t.operand||"").split("\\"),function(e){var t;e=e.trim();if(e){m=k.exec(e);if(m){switch(m[1]){case"min":case"max":case"inc":t=parseInt(Y(m[2]));if(isNaN(t)){t=1}x[m[1]]=t;break;case"date-format":x.dateFormat=m[2].trim();break}}else if(x.expr===undefined){x.expr=e}}});if(x.expr===undefined){x.expr="<<currentTiddler>>"}if(x.max<x.min){x.max=x.min}f=new Date;c=f;i=x.min;u=M.test(x.expr);if(h.test(x.expr)){n=$tw.utils.formatDateString(f,x.dateFormat)}d=D.test(x.expr);do{a=Y(x.expr);if(u){s=Math.random().toString(36).substr(2);a=a.replace(M,T)}if(d){a=a.replace(D,$tw.utils.uuid())}a=v(p,a.replace(w,i).replace(b,x.max).replace(h,n));p.push(a);i=i+x.inc;if(i%500===0){c=new Date}}while(i<=x.max&&c-f<5e3)}catch(A){return["Error in make filter:\n"+A]}return p}})();