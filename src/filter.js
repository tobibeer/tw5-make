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
 	var count,date,ex,end,match,rand,random,start,uuid,
		widget = options.widget,
		wiki = options.wiki,
		results = [],
		// Init make options
		make = {
			dateFormat:"YYYY0MM0DD0hh0mm0ss",
			inc:1,
			max:1,
			min:1
		},
		// Current tiddler
		current = widget ? widget.getVariable("currentTiddler") : "",
		// The regular expressions for replacing count, date, and random
		reCOUNT = /\%COUNT\%/mgi,
		reDATE = /\%DATE\%/mgi,
		reUUID = /\%UUID\%/mgi,
		reMAX = /\%MAX\%/mgi,
		reRAND = /RANDOM\((\d*)\)/mgi,
		// The regex for make options
		reVAR = /^\s*([\$\w\d\-\_\/]*):(.*)(?:\s*)$/,
		// Trims that random number to the desired length, max 16
		getRandom = function(match,num){
			return num ? rand.substr(0,Math.min(16,num)) : rand;
		},
		//Replaces {{text!!references}} in the make expression
		replaceRefs = function(match,ref) {
			return wiki.getTextReference(ref,"",current);
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
				result=title;
			while(list.indexOf(result) >= 0 || wiki.tiddlerExists(result)) {
				c++;
				result = title + " " + c.toString();
			}
			return result;
		};
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
								// Not an integer?
								if(isNaN(v)) {
									// Init as 1
									v = 1;
								}
								// Set option to value
								make[match[1]] = v;
								break;
							// Date format?
							case "date-format":
								// Set to this format
								make.dateFormat = match[2].trim();
								break;
						}
					// Otherwise, if not an option, only once
					} else if(make.expr === undefined) {
						// Save as make expression
						make.expr = arg;
					}
				}
			}
		);
		if(make.expr === undefined) {
			make.expr = "<<currentTiddler>>";
		}
		// Max shall not be smaller than min
		if(make.max<make.min) {
			make.max = make.min;
		}
		// Just to be safe, remember when we started and when we should end, if loops go awry
		start = new Date();
		end = start;
		// Init counter
		count = make.min;
		// Check whether random number is desired
		random = reRAND.test(make.expr);
		if(reDATE.test(make.expr)) {
			// Generate new date based on format string, only once
			date = $tw.utils.formatDateString(start, make.dateFormat);
		}
		// UUID desired?
		uuid = reUUID.test(make.expr);
		// Repeat
		do {
			// Copy expression while replacing any variables or text-references
			ex = replaceRV(make.expr);
			// Do we want a random string?
			if(random) {
				// Well, then generate that random string
				rand = Math.random().toString(36).substr(2);
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
				.replace(reCOUNT, count)
				.replace(reMAX, make.max)
				.replace(reDATE, date)
			);
			// Add to output
			results.push(ex);
			// Next generated item
			count = count + make.inc;
			// Every 500
			if(count % 500 === 0) {
				// Check what time it is
				end = new Date();
			}
		// So long as our counter is below max and we're taking no longer than 5 seconds
		} while (count <= make.max && end - start < 5000);
	// On error...
	} catch(e) {
		return ["Error in make filter:\n" + e];
	}

	// Return filter results
	return results;
};

})();