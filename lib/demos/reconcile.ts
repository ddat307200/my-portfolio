/**
 * Demo 2: compare two CSV lists by a key column.
 * Result: rows that match, rows only in A, rows only in B, and rows whose key
 * matches but some values differ (with the differing fields). Exact comparison
 * after trimming spaces; no fuzzy matching, no guessing.
 *
 * Self-contained (no imports) so it can move to its own public repo later.
 */

export type Table = { headers: string[]; rows: string[][] };
export type FieldDiff = { field: string; a: string; b: string };
export type Mismatch = { key: string; diffs: FieldDiff[] };
export type ReconcileResult = {
  key: string;
  compared: string[];
  matched: string[];
  onlyA: string[];
  onlyB: string[];
  mismatched: Mismatch[];
  duplicates: { side: "A" | "B"; key: string }[];
};

export type CsvErrorCode = "unclosed-quote" | "stray-quote" | "column-count";

/** Parse error with a machine-readable code (UIs translate it) and the 1-based line. */
export class CsvError extends Error {
  code: CsvErrorCode;
  line: number;
  constructor(code: CsvErrorCode, line: number, message: string) {
    super(message);
    this.name = "CsvError";
    this.code = code;
    this.line = line;
  }
}

/** RFC 4180-style parser: commas, double quotes, "" escapes, CRLF/LF. Blank lines are skipped. */
export function parseCSV(text: string): Table {
  const records: string[][] = [];
  let field = "";
  let record: string[] = [];
  let quoted = false;
  let line = 1;
  let quoteLine = 0;
  const pushRecord = () => {
    record.push(field);
    field = "";
    if (!(record.length === 1 && record[0]?.trim() === "")) records.push(record);
    record = [];
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i] as string;
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else {
        if (ch === "\n") line++;
        field += ch;
      }
    } else if (ch === '"') {
      if (field.trim() !== "") throw new CsvError("stray-quote", line, "Unexpected quote inside an unquoted field");
      field = "";
      quoted = true;
      quoteLine = line;
    } else if (ch === ",") {
      record.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      pushRecord();
      line++;
    } else field += ch;
  }
  if (quoted) throw new CsvError("unclosed-quote", quoteLine, "Unclosed quote");
  if (field !== "" || record.length) pushRecord();

  const [headers = [], ...rows] = records.map((r) => r.map((c) => c.trim()));
  rows.forEach((r, i) => {
    if (r.length !== headers.length)
      throw new CsvError("column-count", i + 2, `Row has ${r.length} columns, header has ${headers.length}`);
  });
  return { headers, rows };
}

/**
 * Compare by `key` (default: the first header present in both tables).
 * Only columns present in both tables are compared.
 */
export function reconcile(a: Table, b: Table, key?: string): ReconcileResult {
  if (!a.headers.length || !b.headers.length) throw new Error("empty");
  const common = a.headers.filter((h) => b.headers.includes(h));
  const k = key ?? common[0];
  if (!k || !common.includes(k)) throw new Error("no-common-key");
  const compared = common.filter((h) => h !== k);

  const index = (t: Table, side: "A" | "B", dup: ReconcileResult["duplicates"]) => {
    const ki = t.headers.indexOf(k);
    const map = new Map<string, Record<string, string>>();
    for (const r of t.rows) {
      const id = (r[ki] ?? "").trim();
      if (map.has(id)) dup.push({ side, key: id });
      map.set(id, Object.fromEntries(t.headers.map((h, i) => [h, (r[i] ?? "").trim()])));
    }
    return map;
  };
  const duplicates: ReconcileResult["duplicates"] = [];
  const A = index(a, "A", duplicates);
  const B = index(b, "B", duplicates);

  const res: ReconcileResult = { key: k, compared, matched: [], onlyA: [], onlyB: [], mismatched: [], duplicates };
  for (const [id, ra] of A) {
    const rb = B.get(id);
    if (!rb) {
      res.onlyA.push(id);
      continue;
    }
    const diffs = compared.filter((f) => ra[f] !== rb[f]).map((f) => ({ field: f, a: ra[f] ?? "", b: rb[f] ?? "" }));
    if (diffs.length) res.mismatched.push({ key: id, diffs });
    else res.matched.push(id);
  }
  for (const id of B.keys()) if (!A.has(id)) res.onlyB.push(id);
  return res;
}

const esc = (s: string) => (/[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

/** Export: one line per finding (status,key,field,a,b). */
export function resultToCSV(r: ReconcileResult): string {
  const out = [["status", r.key, "field", "a", "b"]];
  for (const id of r.matched) out.push(["match", id, "", "", ""]);
  for (const m of r.mismatched) for (const d of m.diffs) out.push(["mismatch", m.key, d.field, d.a, d.b]);
  for (const id of r.onlyA) out.push(["only_a", id, "", "", ""]);
  for (const id of r.onlyB) out.push(["only_b", id, "", "", ""]);
  return out.map((row) => row.map(esc).join(",")).join("\n") + "\n";
}
