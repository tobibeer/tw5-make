/*\
title: test-make.js
type: application/javascript
tags: [[$:/tags/test-spec]]

Tests the make filter.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

describe("test make filter", function() {

	// Create a wiki
	var wiki = new $tw.Wiki({
		shadowTiddlers: {
			"$:/shadow": {
				tiddler: new $tw.Tiddler({title: "$:/shadow"}),
			}
		}
	});

	// Add a few  tiddlers
	wiki.addTiddler({title: "foo",modified:"20151218"});
	wiki.addTiddler({title: "bar"});
	wiki.addTiddler({title: "baz"});
	var fakeWidget = {getVariable: function() {return "foo";}};

	// Tests

	it("make new title", function() {
		expect(wiki.filterTiddlers(
			"[[]make[]]"
		,fakeWidget).join(",")).toBe("foo 1");
	});
	it("make two titles", function() {
		expect(wiki.filterTiddlers(
			"[[]make[max:2]]"
		,fakeWidget).join(",")).toBe("foo 1,foo 2");
	});
	it("count and max=1", function() {
		expect(wiki.filterTiddlers(
			"[[]make[%count%/%max%]]"
		,fakeWidget).join(",")).toBe("1/1");
	});
	it("count and max=2", function() {
		expect(wiki.filterTiddlers(
			"[[]make[%count%/%max%\\max:2]]"
		,fakeWidget).join(",")).toBe("1/2,2/2");
	});
	it("min=2, inc=2, max=4", function() {
		expect(wiki.filterTiddlers(
			"[[]make[<<foo>> %count%\\min:2\\inc:2\\max:4]]"
		,fakeWidget).join(",")).toBe("foo 2,foo 4");
	});
	it("min=2, inc=2, max=4", function() {
		expect(wiki.filterTiddlers(
			"[[]make[<<foo>>%count%\\min:2\\inc:2\\max:4]]"
		,fakeWidget).join(",")).toBe("foo2,foo4");
	});
	it("variable", function() {
		expect(wiki.filterTiddlers(
			"[[]make[X<<any>>X]]"
		,fakeWidget).join(",")).toBe("XfooX");
	});
	it("text-reference", function() {
		expect(wiki.filterTiddlers(
			"[[]make[X{{!!modified}}X]]"
		,fakeWidget).join(",")).toBe("X20151218000000000X");
	});
	it("empty text-reference", function() {
		expect(wiki.filterTiddlers(
			"[[]make[X{{!!doesntexist}}X]]"
		,fakeWidget).join(",")).toBe("XX");
	});
	it("date", function() {
		expect(wiki.filterTiddlers(
			"[[]make[X%date%X]]"
		,fakeWidget).join(",")).toMatch(/^X[\d]{14}X$/);
	});
	it("date format", function() {
		expect(wiki.filterTiddlers(
			"[[]make[X%date%X\\date-format:0hh:0mm:0ss]]"
		,fakeWidget).join(",")).toMatch(/^X(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)X$/);
	});
	it("random", function() {
		expect(wiki.filterTiddlers(
			"[[]make[XRANDOM()X]]"
		,fakeWidget).join(",")).toMatch(/^X[\w\d]{15,16}X$/);
	});
	it("random 12", function() {
		expect(wiki.filterTiddlers(
			"[[]make[XRANDOM(12)X]]"
		,fakeWidget).join(",")).toMatch(/^X[\w\d]{12}X$/);
	});
	it("uuid pattern", function() {
		expect(wiki.filterTiddlers(
			"[[]make[X%uuid%X]]"
		,fakeWidget).join(",")).toMatch(/^X[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}X$/);
	});
});

})();
