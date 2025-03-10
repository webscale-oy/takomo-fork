import { merge } from "../../../src/takomo-util"

describe("#merge", () => {
  test("a single empty object", () => {
    const a = {}
    expect(merge(a)).toStrictEqual(a)
  })

  test("a single object", () => {
    const a = { name: "John" }
    expect(merge(a)).toStrictEqual(a)
  })

  test("two empty objects", () => {
    const a = {}
    const b = {}
    const expected = {}
    expect(merge(a, b)).toStrictEqual(expected)
  })

  test("two identical objects", () => {
    const a = { name: "John" }
    const b = { name: "John" }
    const expected = { name: "John" }
    expect(merge(a, b)).toStrictEqual(expected)
  })

  test("two objects with different properties", () => {
    const a = { name: "Don" }
    const b = { age: 13 }
    const expected = { name: "Don", age: 13 }
    expect(merge(a, b)).toStrictEqual(expected)
  })

  test("two objects with partly overlapping properties", () => {
    const a = { name: "Don", color: "red" }
    const b = { name: "El Zorro", age: 13 }
    const expected = { name: "El Zorro", age: 13, color: "red" }
    expect(merge(a, b)).toStrictEqual(expected)
  })

  test("two objects with partly overlapping properties", () => {
    const a = { name: "Don", color: "red", code: "123", nested: { a: 1, b: 2 } }
    const b = { name: "El Zorro", age: 13, nested: { a: 3 } }
    const expected = {
      name: "El Zorro",
      age: 13,
      color: "red",
      code: "123",
      nested: { a: 3, b: 2 },
    }
    expect(merge(a, b)).toStrictEqual(expected)
  })

  test("three objects with partly overlapping properties", () => {
    const a = { name: "Don", color: "red" }
    const b = { name: "El Zorro", age: 13 }
    const c = { code: 7, array: [1, 2, 3], age: 8 }
    const expected = {
      name: "El Zorro",
      age: 8,
      color: "red",
      code: 7,
      array: [1, 2, 3],
    }
    expect(merge(a, b, c)).toStrictEqual(expected)
  })

  test("nested objects", () => {
    const a = { name: "Don", child: {} }
    const b = { age: 13, child: { mode: "turbo" } }
    const c = { code: 7, child: { person: { name: "x " } } }
    const expected = {
      name: "Don",
      age: 13,
      code: 7,
      child: { mode: "turbo", person: { name: "x " } },
    }
    expect(merge(a, b, c)).toStrictEqual(expected)
  })

  test("Two empty arrays", () => {
    const a: string[] = []
    const b: string[] = []
    const expected: string[] = []
    expect(merge(a, b)).toStrictEqual(expected)
  })

  test("Two arrays with equal contents", () => {
    const a = ["1", "2"]
    const b = ["1", "2"]
    const expected = ["1", "2"]
    expect(merge(a, b)).toStrictEqual(expected)
  })

  test("Two arrays with non-equal contents", () => {
    const a = ["1", "2"]
    const b = ["3"]
    const expected = ["3", "2"]
    expect(merge(a, b)).toStrictEqual(expected)
  })
})
