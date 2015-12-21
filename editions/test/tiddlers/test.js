/*\
title: test-tobibeer/make-filter.js
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
	wiki.addTiddler({
		title: "foo",
		key:"val",
		foo:"bar",
		foo1:"baz",
		modified:"20151218",
		type:"application/x-tiddler-dictionary",
		text:"foo: bar\nfoo 1: baz"
	});
	wiki.addTiddler({title: "bar",key:"val"});
	wiki.addTiddler({title: "baz"});
	var fakeWidget = {getVariable: function() {return "foo";}};

	// Tests

	it("make new title from default being %tiddler%=foo", function() {
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
		,fakeWidget).join(",")).toMatch(/^X[\d]{17}X$/);
	});
	it("date format", function() {
		expect(wiki.filterTiddlers(
			"[[]make[X%date%X\\date-format:0hh:0mm:0ss]]"
		,fakeWidget).join(",")).toMatch(/^X(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)X$/);
	});
	it("random", function() {
		expect(wiki.filterTiddlers(
			"[[]make[XRANDOM()X]]"
		,fakeWidget).join(",")).toMatch(/^X[\w\d]{16}X$/);
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
	it("empty separator via sep:\\", function() {
		expect(wiki.filterTiddlers(
			"[[]make[sep:]]"
		,fakeWidget).join(",")).toBe("foo1");
	});
	it("custom separator via sep:-\\", function() {
		expect(wiki.filterTiddlers(
			"[[]make[sep:-]]"
		,fakeWidget).join(",")).toBe("foo-1");
	});
	it("unique fields", function() {
		expect(wiki.filterTiddlers(
			"[[]make[unique:field\\max:2]]"
		,fakeWidget).join(",")).toBe("foo2,foo3");
	});
	it("unique indexes", function() {
		expect(wiki.filterTiddlers(
			"[[]make[unique:index\\max:2]]"
		,fakeWidget).join(",")).toBe("foo 2,foo 3");
	});
	it("tiddler option", function() {
		expect(wiki.filterTiddlers(
			"[[]make[tiddler:bar\\max:2]]"
		,fakeWidget).join(",")).toBe("bar 1,bar 2");
	});
	it("input titles using %title%", function() {
		expect(wiki.filterTiddlers(
			"a b c +[make[X%title%X\\max:2]]"
		,fakeWidget).join(",")).toBe("XaX,XbX");
	});
	it("max as num input titles", function() {
		expect(wiki.filterTiddlers(
			"a b c +[make[%title%]]"
		,fakeWidget).join(",")).toBe("a,b,c");
	});
	/* also tests maxing out with max */
	it("input titles with %title% and %count%", function() {
		expect(wiki.filterTiddlers(
			"a b c +[make[X%title%%count%X\\max:2]]"
		,fakeWidget).join(",")).toBe("Xa1X,Xb2X");
	});
	it("max from num input titles wins over specified max", function() {
		expect(wiki.filterTiddlers(
			"a b c +[make[%title%\\max:5]]"
		,fakeWidget).join(",")).toBe("a,b,c");
	});
});

})();
