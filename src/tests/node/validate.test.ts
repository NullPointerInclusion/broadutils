import { describe, it, expect } from "bun:test";
import { assert, check, nonNullable, isNonNullable } from "../../validate/validate.ts";

describe("Validation utilities", () => {
  describe("check", () => {
    describe("string", () => {
      it("returns true for string", () => {
        expect(check.string("hello")).toBe(true);
      });

      it("returns false for non-string", () => {
        expect(check.string(123)).toBe(false);
        expect(check.string(null)).toBe(false);
      });
    });

    describe("number", () => {
      it("returns true for number", () => {
        expect(check.number(42)).toBe(true);
      });

      it("returns false for non-number", () => {
        expect(check.number("42")).toBe(false);
        expect(check.number(NaN)).toBe(true); // NaN is number
      });

      describe("aan", () => {
        it("returns true for number not NaN", () => {
          expect(check.number.aan(42)).toBe(true);
        });

        it("returns false for NaN", () => {
          expect(check.number.aan(NaN)).toBe(false);
        });
      });

      describe("positive", () => {
        it("returns true for positive number", () => {
          expect(check.number.positive(1)).toBe(true);
        });

        it("returns false for non-positive", () => {
          expect(check.number.positive(0)).toBe(false);
          expect(check.number.positive(-1)).toBe(false);
          expect(check.number.positive("1")).toBe(false);
        });
      });

      describe("negative", () => {
        it("returns true for negative number", () => {
          expect(check.number.negative(-1)).toBe(true);
        });

        it("returns false for non-negative", () => {
          expect(check.number.negative(0)).toBe(false);
          expect(check.number.negative(1)).toBe(false);
        });
      });

      describe("zero", () => {
        it("returns true for zero", () => {
          expect(check.number.zero(0)).toBe(true);
        });

        it("returns false for non-zero", () => {
          expect(check.number.zero(1)).toBe(false);
          expect(check.number.zero(-0)).toBe(true);
        });
      });

      describe("integer", () => {
        it("returns true for integer", () => {
          expect(check.number.integer(42)).toBe(true);
        });

        it("returns false for float", () => {
          expect(check.number.integer(42.5)).toBe(false);
        });
      });

      describe("float", () => {
        it("returns true for float", () => {
          expect(check.number.float(42.5)).toBe(true);
        });

        it("returns false for integer", () => {
          expect(check.number.float(42)).toBe(false);
          expect(check.number.float(Infinity)).toBe(false);
        });
      });

      describe("finite", () => {
        it("returns true for finite number", () => {
          expect(check.number.finite(42)).toBe(true);
        });

        it("returns false for infinite", () => {
          expect(check.number.finite(Infinity)).toBe(false);
          expect(check.number.finite(-Infinity)).toBe(false);
        });
      });

      describe("safeInteger", () => {
        it("returns true for safe integer", () => {
          expect(check.number.safeInteger(42)).toBe(true);
        });

        it("returns false for unsafe", () => {
          expect(check.number.safeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
        });
      });
    });

    describe("boolean", () => {
      it("returns true for boolean", () => {
        expect(check.boolean(true)).toBe(true);
        expect(check.boolean(false)).toBe(true);
      });

      it("returns false for non-boolean", () => {
        expect(check.boolean(1)).toBe(false);
      });
    });

    describe("true", () => {
      it("returns true for true", () => {
        expect(check.true(true)).toBe(true);
      });

      it("returns false for false", () => {
        expect(check.true(false)).toBe(false);
      });
    });

    describe("false", () => {
      it("returns true for false", () => {
        expect(check.false(false)).toBe(true);
      });

      it("returns false for true", () => {
        expect(check.false(true)).toBe(false);
      });
    });

    describe("symbol", () => {
      it("returns true for symbol", () => {
        expect(check.symbol(Symbol())).toBe(true);
      });

      it("returns false for non-symbol", () => {
        expect(check.symbol("symbol")).toBe(false);
      });
    });

    describe("null", () => {
      it("returns true for null", () => {
        expect(check.null(null)).toBe(true);
      });

      it("returns false for non-null", () => {
        expect(check.null(undefined)).toBe(false);
      });
    });

    describe("undefined", () => {
      it("returns true for undefined", () => {
        expect(check.undefined(undefined)).toBe(true);
      });

      it("returns false for defined", () => {
        expect(check.undefined(null)).toBe(false);
      });
    });

    describe("object", () => {
      it("returns true for object", () => {
        expect(check.object({})).toBe(true);
      });

      it("returns false for null", () => {
        expect(check.object(null)).toBe(false);
      });
    });

    describe("array", () => {
      it("returns true for array", () => {
        expect(check.array([])).toBe(true);
      });

      it("returns false for non-array", () => {
        expect(check.array({})).toBe(false);
      });
    });

    describe("arraybuffer", () => {
      it("returns true for ArrayBuffer", () => {
        expect(check.arraybuffer(new ArrayBuffer(1))).toBe(true);
      });

      it("returns false for non-ArrayBuffer", () => {
        expect(check.arraybuffer(new Uint8Array(1))).toBe(false);
      });
    });

    describe("arraybufferview", () => {
      it("returns true for ArrayBufferView", () => {
        expect(check.arraybufferview(new Uint8Array(1))).toBe(true);
      });

      it("returns false for non-ArrayBufferView", () => {
        expect(check.arraybufferview(new ArrayBuffer(1))).toBe(false);
      });
    });

    describe("regexp", () => {
      it("returns true for RegExp", () => {
        expect(check.regexp(/test/)).toBe(true);
      });

      it("returns false for non-RegExp", () => {
        expect(check.regexp("test")).toBe(false);
      });
    });

    describe("nonNullable", () => {
      it("returns true for non-nullable", () => {
        expect(check.nonNullable(0)).toBe(true);
        expect(check.nonNullable("")).toBe(true);
        expect(check.nonNullable(false)).toBe(true);
      });

      it("returns false for null or undefined", () => {
        expect(check.nonNullable(null)).toBe(false);
        expect(check.nonNullable(undefined)).toBe(false);
      });
    });
  });

  describe("assert", () => {
    describe("string", () => {
      it("does not throw for string", () => {
        expect(() => assert.string("hello")).not.toThrow();
      });

      it("throws for non-string", () => {
        expect(() => assert.string(123)).toThrow();
      });
    });

    describe("number", () => {
      it("does not throw for number", () => {
        expect(() => assert.number(42)).not.toThrow();
      });

      it("throws for non-number", () => {
        expect(() => assert.number("42")).toThrow();
      });

      describe("aan", () => {
        it("does not throw for number not NaN", () => {
          expect(() => assert.number.aan(42)).not.toThrow();
        });

        it("throws for NaN", () => {
          expect(() => assert.number.aan(NaN)).toThrow();
        });
      });

      describe("positive", () => {
        it("does not throw for positive", () => {
          expect(() => assert.number.positive(1)).not.toThrow();
        });

        it("throws for non-positive", () => {
          expect(() => assert.number.positive(0)).toThrow();
        });
      });

      describe("negative", () => {
        it("does not throw for negative", () => {
          expect(() => assert.number.negative(-1)).not.toThrow();
        });

        it("throws for non-negative", () => {
          expect(() => assert.number.negative(0)).toThrow();
        });
      });

      describe("zero", () => {
        it("does not throw for zero", () => {
          expect(() => assert.number.zero(0)).not.toThrow();
        });

        it("throws for non-zero", () => {
          expect(() => assert.number.zero(1)).toThrow();
        });
      });

      describe("integer", () => {
        it("does not throw for integer", () => {
          expect(() => assert.number.integer(42)).not.toThrow();
        });

        it("throws for float", () => {
          expect(() => assert.number.integer(42.5)).toThrow();
        });
      });

      describe("float", () => {
        it("does not throw for float", () => {
          expect(() => assert.number.float(42.5)).not.toThrow();
        });

        it("throws for integer", () => {
          expect(() => assert.number.float(42)).toThrow();
        });
      });

      describe("finite", () => {
        it("does not throw for finite", () => {
          expect(() => assert.number.finite(42)).not.toThrow();
        });

        it("throws for infinite", () => {
          expect(() => assert.number.finite(Infinity)).toThrow();
        });
      });

      describe("safeInteger", () => {
        it("does not throw for safe integer", () => {
          expect(() => assert.number.safeInteger(42)).not.toThrow();
        });

        it("throws for unsafe", () => {
          expect(() => assert.number.safeInteger(Number.MAX_SAFE_INTEGER + 1)).toThrow();
        });
      });
    });

    describe("boolean", () => {
      it("does not throw for boolean", () => {
        expect(() => assert.boolean(true)).not.toThrow();
      });

      it("throws for non-boolean", () => {
        expect(() => assert.boolean(1)).toThrow();
      });
    });

    describe("true", () => {
      it("does not throw for true", () => {
        expect(() => assert.true(true)).not.toThrow();
      });

      it("throws for false", () => {
        expect(() => assert.true(false)).toThrow();
      });
    });

    describe("false", () => {
      it("does not throw for false", () => {
        expect(() => assert.false(false)).not.toThrow();
      });

      it("throws for true", () => {
        expect(() => assert.false(true)).toThrow();
      });
    });

    describe("symbol", () => {
      it("does not throw for symbol", () => {
        expect(() => assert.symbol(Symbol())).not.toThrow();
      });

      it("throws for non-symbol", () => {
        expect(() => assert.symbol("symbol")).toThrow();
      });
    });

    describe("null", () => {
      it("does not throw for null", () => {
        expect(() => assert.null(null)).not.toThrow();
      });

      it("throws for non-null", () => {
        expect(() => assert.null(undefined)).toThrow();
      });
    });

    describe("undefined", () => {
      it("does not throw for undefined", () => {
        expect(() => assert.undefined(undefined)).not.toThrow();
      });

      it("throws for defined", () => {
        expect(() => assert.undefined(null)).toThrow();
      });
    });

    describe("object", () => {
      it("does not throw for object", () => {
        expect(() => assert.object({})).not.toThrow();
      });

      it("throws for null", () => {
        expect(() => assert.object(null)).toThrow();
      });
    });

    describe("array", () => {
      it("does not throw for array", () => {
        expect(() => assert.array([])).not.toThrow();
      });

      it("throws for non-array", () => {
        expect(() => assert.array({})).toThrow();
      });
    });

    describe("arraybuffer", () => {
      it("does not throw for ArrayBuffer", () => {
        expect(() => assert.arraybuffer(new ArrayBuffer(1))).not.toThrow();
      });

      it("throws for non-ArrayBuffer", () => {
        expect(() => assert.arraybuffer(new Uint8Array(1))).toThrow();
      });
    });

    describe("arraybufferview", () => {
      it("does not throw for ArrayBufferView", () => {
        expect(() => assert.arraybufferview(new Uint8Array(1))).not.toThrow();
      });

      it("throws for non-ArrayBufferView", () => {
        expect(() => assert.arraybufferview(new ArrayBuffer(1))).toThrow();
      });
    });

    describe("regexp", () => {
      it("does not throw for RegExp", () => {
        expect(() => assert.regexp(/test/)).not.toThrow();
      });

      it("throws for non-RegExp", () => {
        expect(() => assert.regexp("test")).toThrow();
      });
    });

    describe("nonNullable", () => {
      it("does not throw for non-nullable", () => {
        expect(() => assert.nonNullable(0)).not.toThrow();
      });

      it("throws for null or undefined", () => {
        expect(() => assert.nonNullable(null)).toThrow();
        expect(() => assert.nonNullable(undefined)).toThrow();
      });
    });
  });

  describe("nonNullable", () => {
    it("returns the value if not null or undefined", () => {
      expect(nonNullable(42)).toBe(42);
      expect(nonNullable("test")).toBe("test");
    });

    it("throws if null or undefined", () => {
      expect(() => nonNullable(null)).toThrow();
      expect(() => nonNullable(undefined)).toThrow();
    });
  });

  describe("isNonNullable", () => {
    it("returns true for non-nullable", () => {
      expect(isNonNullable(42)).toBe(true);
      expect(isNonNullable("")).toBe(true);
    });

    it("returns false for null or undefined", () => {
      expect(isNonNullable(null)).toBe(false);
      expect(isNonNullable(undefined)).toBe(false);
    });
  });
});
