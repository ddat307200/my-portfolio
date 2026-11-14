import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CsvError, parseCSV, reconcile, resultToCSV } from "../lib/demos/reconcile.ts";
import { csvSamples } from "../lib/demos/samples.ts";

describe("parseCSV", () => {
  it("parses quotes, escaped quotes, commas inside quotes and CRLF", () => {
    const t = parseCSV('id,name,note\r\n1,"Bánh, quy","nói ""ngon"""\r\n2,Trà,\r\n');
    assert.deepEqual(t.headers, ["id", "name", "note"]);
    assert.deepEqual(t.rows, [
      ["1", "Bánh, quy", 'nói "ngon"'],
      ["2", "Trà", ""],
    ]);
  });

  it("skips blank lines", () => {
    assert.equal(parseCSV("a,b\n\n1,2\n\n").rows.length, 1);
  });

  it("reports an unclosed quote with its line number", () => {
    assert.throws(
      () => parseCSV('a,b\n1,"oops\n2,3'),
      (e: unknown) => e instanceof CsvError && e.code === "unclosed-quote" && e.line === 2,
    );
  });

  it("reports rows with the wrong number of columns", () => {
    assert.throws(
      () => parseCSV("a,b\n1,2\n3"),
      (e: unknown) => e instanceof CsvError && e.code === "column-count" && e.line === 3,
    );
  });

  it("reports a quote in the middle of an unquoted field", () => {
    assert.throws(
      () => parseCSV(["a,b", 'x"y,2'].join("\n")),
      (e: unknown) => e instanceof CsvError && e.code === "stray-quote" && e.line === 2,
    );
  });

  it("returns an empty table for empty text", () => {
    assert.deepEqual(parseCSV(""), { headers: [], rows: [] });
  });
});

describe("reconcile", () => {
  it("finds matches, rows only on one side and value differences (sample data)", () => {
    const r = reconcile(parseCSV(csvSamples.vi.a), parseCSV(csvSamples.vi.b));
    assert.equal(r.key, "ma_hang");
    assert.deepEqual(r.matched, ["SP01"]);
    assert.deepEqual(r.onlyA, ["SP03"]);
    assert.deepEqual(r.onlyB, ["SP05"]);
    assert.deepEqual(r.mismatched, [
      { key: "SP02", diffs: [{ field: "so_luong", a: "40", b: "38" }] },
      { key: "SP04", diffs: [{ field: "don_gia", a: "4000", b: "4500" }] },
    ]);
    assert.deepEqual(r.duplicates, []);
  });

  it("compares only the columns both files have and ignores surrounding spaces", () => {
    const r = reconcile(parseCSV("id,qty,extra\n1, 5 ,x"), parseCSV("id,qty\n1,5"));
    assert.deepEqual(r.compared, ["qty"]);
    assert.deepEqual(r.matched, ["1"]);
  });

  it("reports duplicate keys", () => {
    const r = reconcile(parseCSV("id,v\n1,a\n1,b"), parseCSV("id,v\n1,b"));
    assert.deepEqual(r.duplicates, [{ side: "A", key: "1" }]);
  });

  it("fails clearly when there is no common key column", () => {
    assert.throws(() => reconcile(parseCSV("a,b\n1,2"), parseCSV("c,d\n1,2")), /no-common-key/);
    assert.throws(() => reconcile(parseCSV("a\n1"), parseCSV("a\n1"), "zzz"), /no-common-key/);
  });

  it("fails clearly on empty input", () => {
    assert.throws(() => reconcile(parseCSV(""), parseCSV("a\n1")), /empty/);
  });

  it("exports findings as CSV, escaping commas and quotes", () => {
    const r = reconcile(parseCSV('id,name\n1,"A, B"'), parseCSV('id,name\n1,"A ""B"""'));
    assert.equal(resultToCSV(r), 'status,id,field,a,b\nmismatch,1,name,"A, B","A ""B"""\n');
  });
});
