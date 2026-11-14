/**
 * Demo 1: pull order data out of messy chat messages with fixed rules (regex).
 * Not an AI: no guessing. A line is an order only when it has a valid phone number
 * AND at least one "quantity + product". Everything else is returned in `unread`
 * with a reason, so a person can look at it.
 *
 * Self-contained (no imports) so it can move to its own public repo later.
 */

export type Item = { qty: number; unit: string | null; product: string };
export type Order = { line: number; raw: string; name: string | null; phone: string; items: Item[] };
export type UnreadReason = "no-phone" | "bad-phone" | "no-item";
export type Unread = { line: number; raw: string; reason: UnreadReason };
export type ExtractResult = { orders: Order[]; unread: Unread[] };

const UNITS = [
  // Vietnamese
  "hộp", "cái", "chai", "kg", "túi", "thùng", "gói", "ly", "phần", "bó", "lon", "hũ", "bịch", "cuốn", "chiếc",
  // English (singular and plural)
  "boxes", "box", "bottles", "bottle", "bags", "bag", "packs", "pack", "cans", "can", "jars", "jar",
  "cups", "cup", "cartons", "carton", "pcs", "pieces", "piece",
];

/** Words that are never part of a customer's name (greetings, honorifics, verbs, filler). */
const FILLER = new Set([
  "chị", "anh", "em", "cô", "chú", "bác", "bạn", "c", "a", "e", "ơi", "cho", "lấy", "đặt", "mua", "giúp", "mình",
  "nhé", "nha", "với", "sđt", "sdt", "ship", "gửi", "order", "hi", "hello", "it's", "its", "this", "is", "i'm",
  "im", "wants", "want", "orders", "needs", "need", "would", "like", "please", "phone", "tel", "mr", "ms", "mrs",
]);

const UNIT_RE = UNITS.join("|");
// "\b" is ASCII-only in JS regex, so word boundaries use Unicode letter lookarounds.
const word = (w: string) => String.raw`(?<![\p{L}])${w}(?![\p{L}])`;
const STOP = ["và", "and", "sđt", "sdt", "phone", "please", "nhé", "nha"].map(word).join("|");
// quantity, optional "x", optional unit, optional "of", then the product up to a separator
const ITEM_RE = new RegExp(
  String.raw`(?<![\p{L}\d])(\d{1,4})\s*(?:x\s*)?(?:(${UNIT_RE})(?![\p{L}]))?\s+(?:of\s+)?([\p{L}][\p{L}\s'-]*?)` +
    String.raw`(?=\s*(?:,|;|\+|\.|!|\?|$|\d|${STOP}))`,
  "giu",
);
// a run of digits that looks like it is meant to be a phone number (spaces, dots or dashes allowed)
const PHONE_LIKE = /(?:\+?84|0)(?:[\s.-]?\d){5,11}/g;

function normalizePhone(s: string): string | null {
  let d = s.replace(/\D/g, "");
  if (d.startsWith("84")) d = `0${d.slice(2)}`;
  return /^0[35789]\d{8}$/.test(d) ? d : null;
}

function cleanName(s: string): string | null {
  const words = s
    .replace(/[^\p{L}\s']/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  while (words.length && FILLER.has((words[0] ?? "").toLowerCase())) words.shift();
  while (words.length && FILLER.has((words[words.length - 1] ?? "").toLowerCase())) words.pop();
  const name = words.join(" ").trim();
  return name && words.length <= 4 ? name : null;
}

export function extractOrders(text: string): ExtractResult {
  const orders: Order[] = [];
  const unread: Unread[] = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const n = i + 1;

    // phone: first candidate that is a valid Vietnamese mobile number
    const candidates = [...line.matchAll(PHONE_LIKE)].map((m) => m[0]);
    const valid = candidates.map(normalizePhone).find((p): p is string => p !== null);
    if (!valid) {
      unread.push({ line: n, raw: line, reason: candidates.length ? "bad-phone" : "no-phone" });
      return;
    }
    let rest = line;
    for (const c of candidates) rest = rest.replace(c, " ");

    const items: Item[] = [];
    let firstItemAt = -1;
    for (const m of rest.matchAll(ITEM_RE)) {
      const product = (m[3] ?? "").trim().replace(/\s+/g, " ");
      if (!product) continue;
      if (firstItemAt < 0) firstItemAt = m.index ?? 0;
      items.push({ qty: Number(m[1]), unit: m[2] ? m[2].toLowerCase() : null, product });
    }
    if (!items.length) {
      unread.push({ line: n, raw: line, reason: "no-item" });
      return;
    }
    orders.push({ line: n, raw: line, name: cleanName(rest.slice(0, firstItemAt)), phone: valid, items });
  });
  return { orders, unread };
}

/** One row per item, for a table or CSV. */
export function ordersToRows(orders: Order[]) {
  return orders.flatMap((o) =>
    o.items.map((it) => ({ line: o.line, name: o.name ?? "", phone: o.phone, qty: it.qty, unit: it.unit ?? "", product: it.product })),
  );
}
