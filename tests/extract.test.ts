import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { extractOrders, ordersToRows } from "../lib/demos/extract.ts";
import { orderSamples } from "../lib/demos/samples.ts";

describe("extractOrders — normal cases", () => {
  it("reads name, phone and several items from one Vietnamese line", () => {
    const { orders, unread } = extractOrders("Chị Lan 0912345678 lấy 2 hộp bánh quy, 1 chai nước mắm");
    assert.equal(unread.length, 0);
    assert.equal(orders.length, 1);
    const o = orders[0]!;
    assert.equal(o.name, "Lan");
    assert.equal(o.phone, "0912345678");
    assert.deepEqual(o.items, [
      { qty: 2, unit: "hộp", product: "bánh quy" },
      { qty: 1, unit: "chai", product: "nước mắm" },
    ]);
  });

  it("normalizes phones written with spaces, dots or +84", () => {
    assert.equal(extractOrders("0987 654 321 - anh Tuấn đặt 3 kg cà phê").orders[0]?.phone, "0987654321");
    assert.equal(extractOrders("Mai +84 356 123 789 lấy 1 ly trà").orders[0]?.phone, "0356123789");
    const o = extractOrders("Em Hoa ơi cho chị 5 gói mì và 2 lon nước ngọt nhé, sđt 0356.123.789").orders[0];
    assert.equal(o?.phone, "0356123789");
    assert.equal(o?.name, "Hoa");
    assert.deepEqual(
      o?.items.map((i) => [i.qty, i.unit, i.product]),
      [
        [5, "gói", "mì"],
        [2, "lon", "nước ngọt"],
      ],
    );
  });

  it("handles the English sample", () => {
    const { orders, unread } = extractOrders(orderSamples.en);
    assert.equal(orders.length, 3);
    assert.equal(orders[0]?.name, "Anna");
    assert.deepEqual(orders[0]?.items[0], { qty: 2, unit: "boxes", product: "cookies" });
    assert.equal(orders[2]?.name, "Mai");
    assert.deepEqual(
      unread.map((u) => u.reason),
      ["no-phone", "bad-phone", "no-item"],
    );
  });

  it("flattens orders into one row per item", () => {
    const rows = ordersToRows(extractOrders(orderSamples.vi).orders);
    assert.equal(rows.length, 5);
    assert.deepEqual(rows[0], { line: 1, name: "Lan", phone: "0912345678", qty: 2, unit: "hộp", product: "bánh quy" });
  });
});

describe("extractOrders — lines it must not guess", () => {
  it("puts lines without a phone, with a malformed phone, or without items in `unread`", () => {
    const { orders, unread } = extractOrders(orderSamples.vi);
    assert.equal(orders.length, 3);
    assert.deepEqual(
      unread.map((u) => [u.line, u.reason]),
      [
        [4, "no-phone"],
        [5, "bad-phone"],
        [6, "no-item"],
      ],
    );
  });

  it("does not invent a name when there is none", () => {
    assert.equal(extractOrders("0912345678 lấy 2 hộp bánh").orders[0]?.name, null);
  });

  it("rejects numbers that are not Vietnamese mobile numbers", () => {
    assert.equal(extractOrders("Lan 0212345678 lấy 2 hộp bánh").unread[0]?.reason, "bad-phone");
  });
});

describe("extractOrders — empty input", () => {
  it("returns nothing for empty or blank text", () => {
    assert.deepEqual(extractOrders(""), { orders: [], unread: [] });
    assert.deepEqual(extractOrders("  \n\n \t\n"), { orders: [], unread: [] });
  });
});
