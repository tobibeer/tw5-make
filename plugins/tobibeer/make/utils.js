/*\
title: $:/plugins/tobibeer/make/utils.js
type: application/javascript
module-type: utils

Utility function to create a uuid

@preserve
\*/
(function(){"use strict";exports.uuid=function(){var r=[];for(var t=0;t<256;t++){r[t]=(t<16?"0":"")+t.toString(16)}function n(){var t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,a=Math.random()*4294967295|0,o=Math.random()*4294967295|0;return r[t&255]+r[t>>8&255]+r[t>>16&255]+r[t>>24&255]+"-"+r[n&255]+r[n>>8&255]+"-"+r[n>>16&15|64]+r[n>>24&255]+"-"+r[a&63|128]+r[a>>8&255]+"-"+r[a>>16&255]+r[a>>24&255]+r[o&255]+r[o>>8&255]+r[o>>16&255]+r[o>>24&255]}return n()}})();