/*\
title: $:/plugins/tobibeer/make/filters.js
type: application/javascript
module-type: filteroperator

a filter to generate tiddler titles

@preserve
\*/

(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
The make filter function...
*/
exports.make = function(source,operator,options) {
 	var date,ex,end,input,match,random,start,uuid,
		titles=[],
		widget = options.widget,
		wiki = options.wiki,
		results = [],
		// Init make options
		m = {
			inc:1,
			min:1,
			// default separator
			sep:" ",
			// default tiddler => current tiddler
			tiddler:widget ? widget.getVariable("currentTiddler") : ""
		},
		// The regular expressions for replacing count, date, and random
		reTITLE = /\%TITLE\%/mgi,
		reCOUNT = /\%COUNT\%/mgi,
		reDATE = /\%DATE\%/mgi,
		reUUID = /\%UUID\%/mgi,
		reMAX = /\%MAX\%/mgi,
		reRAND = /RANDOM\((\d*)\)/mgi,
		reTIDDLER = /\%TIDDLER\%/mgi,
		// The regex for make options
		reVAR = /^\s*([\$\w\d\-\_\/]*):(.*)(?:\s*)$/,
		// Replaces a random number placeholder with a random number of a given length N, default 16
		getRandom = function(match,N){
			N = N || 16;
			var rand = '',
				char = function(){
					var n= Math.floor(Math.random()*62);
					return (
						//1-10
						n<10 ? n :
						//A-Z
						n<36 ? String.fromCharCode(n+55) :
						//a-z
						String.fromCharCode(n+61)
					);
				};
			while(N--) {
				rand += char();
			}
			return rand;
		},
		//Replaces {{text!!references}} in the make expression
		replaceRefs = function(match,ref) {
			return wiki.getTextReference(ref,"",m.tiddler);
		},
		//Replaces <<variables>> in the make expression
		replaceVars = function(match,v) {
			return widget ? widget.getVariable(v) : "";
		},
		// triggers replacing of both variables and text references in an expression
		replaceRV = function(e){
			return e
				.replace(/{{([^}]*)}}/mg, replaceRefs)
				.replace(/<<([^>]*)>>/mg, replaceVars);
		},
		unique = function(list,title) {
			var c = 0,
				result = title,
				tid = wiki.getTiddler(m.tiddler),
				data = m.uniq === 1 ? wiki.getTiddlerData(m.tiddler,{}) : 0;
			while(
				list.indexOf(result) >= 0 ||
				!m.uniq && wiki.tiddlerExists(result) ||
				m.uniq === 0 && tid.hasField(result) ||
				m.uniq === 1 && $tw.utils.hop(data,result)
			) {
				c++;
				result = title + m.sep + c.toString();
			}
			return result;
		};
	// Iterate input
	source(function(tiddler,title) {
		// Add to titles
		titles.push(title);
	});
	// Has input titles?
	input = !(titles.length === 1 && !titles[0]);
	// Return errors
	try {
		// Each
		$tw.utils.each(
			// Operand item, split via "\"
			(operator.operand || "").split("\\"),
			function(arg) {
				var v;
				// Skip empty
				arg = arg.trim();
				if(arg) {
					// Test for make option
					match = reVAR.exec(arg);
					// Is option?
					if(match) {
						// Check option
						switch (match[1]) {
							case "min":
							case "max":
							case "inc":
								// Get any of these as integer while replacing any variables or text-references
								v = parseInt(replaceRV(match[2]));
								// Not an integer or smaller than 0?
								if(isNaN(v) || v < 1) {
									// Init as 1
									v = 1;
								}
								// Set option to value
								m[match[1]] = v;
								break;
							case "sep":
								m.sep = match[2];
								break;
							case "unique":
								m.uniq = match[2] === "field" ? 0 : 1;
								break;
							case "tiddler":
								m.tiddler = match[2];
								break;
							// Date format?
							case "date-format":
								// Set to this format
								m.dateFormat = match[2].trim();
								break;
						}
					// Otherwise, if not an option, only once
					} else if(m.expr === undefined) {
						// Save as make expression
						m.expr = arg;
					}
				}
			}
		);
		// Do we want unique field-names
		if(m.uniq === 0) {
			// Blank separator => use empty, otherwise trim
			m.sep = m.sep === " " ? "" : m.sep.trim();
		}
		// No expression?
		if(m.expr === undefined) {
			// Take current tiddler
			m.expr = "%tiddler%";
		}
		// Operating on input titles?
		if(input) {
			// If specified, calculate min of num titles and specified value
			// Otherwise use num input titles
			m.max = m.max ? Math.min(titles.length,m.max) : titles.length;
		}
		// Max undefined or smaller than min
		if(!m.max || m.max < m.min) {
			// Set to min
			m.max = m.min;
		}
		// Just to be safe, remember when we started and when we should end, if loops go awry
		start = new Date();
		end = start;
		// Init counter
		m.count = m.min;
		// Check whether random number is desired
		random = reRAND.test(m.expr);
		if(reDATE.test(m.expr)) {
			// Generate new date string (only once)
			date = m.dateFormat ?
				// Based on format string, if defined
				$tw.utils.formatDateString(start, m.dateFormat) :
				// Otherwise also return milliseconds
				$tw.utils.stringifyDate(start);
		}
		// UUID desired?
		uuid = reUUID.test(m.expr);
		// Repeat
		do {
			// Copy expression while replacing any variables or text-references
			ex = replaceRV(m.expr);
			// Do we want a random string?
			if(random) {
				// Replace placeholder with random value
				ex = ex.replace(reRAND,getRandom);
			}
			// Do we want a uuid?
			if(uuid) {
				// Replace placeholder with uuid
				ex = ex.replace(reUUID,$tw.utils.uuid());
			}
			// Replace placeholders for count and date...
			ex = unique(results,ex
				.replace(reTIDDLER, m.tiddler)
				.replace(reTITLE, input ? titles[m.count-1] : m.tiddler)
				.replace(reMAX, m.max)
				.replace(reCOUNT, m.count)
				.replace(reDATE, date)
			);
			// Add to output
			results.push(ex);
			// Next generated item
			m.count = m.count + m.inc;
			// Every 500
			if(m.count % 500 === 0) {
				// Check what time it is
				end = new Date();
			}
		// So long as our counter is below max and we're taking no longer than 5 seconds
		} while (m.count <= m.max && end - start < 5000);
	// On error...
	} catch(e) {
		return ["Error in make filter:\n" + e];
	}

	// Return filter results
	return results;
};

})();