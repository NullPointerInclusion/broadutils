/// <reference types="mocha" />

import { expect } from "chai";
import { assert, check, nonNullable, isNonNullable } from "../../../validate/validate.ts";

describe("Validation utilities", () => {
  describe("check", () => {
    describe("string", () => {
      it("returns true for string", () => {
        expect(check.string("hello")).to.be.true;
      });

      it("returns false for non-string", () => {
        expect(check.string(123)).to.be.false;
        expect(check.string(null)).to.be.false;
      });
    });

    describe("number", () => {
      it("returns true for number", () => {
        expect(check.number(42)).to.be.true;
      });

      it("returns false for non-number", () => {
        expect(check.number("42")).to.be.false;
        expect(check.number(NaN)).to.be.true; // NaN is number
      });

      describe("aan", () => {
        it("returns true for number not NaN", () => {
          expect(check.number.aan(42)).to.be.true;
        });

        it("returns false for NaN", () => {
          expect(check.number.aan(NaN)).to.be.false;
        });
      });

      describe("positive", () => {
        it("returns true for positive number", () => {
          expect(check.number.positive(1)).to.be.true;
        });

        it("returns false for non-positive", () => {
          expect(check.number.positive(0)).to.be.false;
          expect(check.number.positive(-1)).to.be.false;
          expect(check.number.positive("1")).to.be.false;
        });
      });

      describe("negative", () => {
        it("returns true for negative number", () => {
          expect(check.number.negative(-1)).to.be.true;
        });

        it("returns false for non-negative", () => {
          expect(check.number.negative(0)).to.be.false;
          expect(check.number.negative(1)).to.be.false;
        });
      });

      describe("zero", () => {
        it("returns true for zero", () => {
          expect(check.number.zero(0)).to.be.true;
        });

        it("returns false for non-zero", () => {
          expect(check.number.zero(1)).to.be.false;
          expect(check.number.zero(-0)).to.be.true;
        });
      });

      describe("integer", () => {
        it("returns true for integer", () => {
          expect(check.number.integer(42)).to.be.true;
        });

        it("returns false for float", () => {
          expect(check.number.integer(42.5)).to.be.false;
        });
      });

      describe("float", () => {
        it("returns true for float", () => {
          expect(check.number.float(42.5)).to.be.true;
        });

        it("returns false for integer", () => {
          expect(check.number.float(42)).to.be.false;
          expect(check.number.float(Infinity)).to.be.false;
        });
      });

      describe("finite", () => {
        it("returns true for finite number", () => {
          expect(check.number.finite(42)).to.be.true;
        });

        it("returns false for infinite", () => {
          expect(check.number.finite(Infinity)).to.be.false;
          expect(check.number.finite(-Infinity)).to.be.false;
        });
      });

      describe("safeInteger", () => {
        it("returns true for safe integer", () => {
          expect(check.number.safeInteger(42)).to.be.true;
        });

        it("returns false for unsafe", () => {
          expect(check.number.safeInteger(Number.MAX_SAFE_INTEGER + 1)).to.be.false;
        });
      });
    });

    describe("boolean", () => {
      it("returns true for boolean", () => {
        expect(check.boolean(true)).to.be.true;
        expect(check.boolean(false)).to.be.true;
      });

      it("returns false for non-boolean", () => {
        expect(check.boolean(1)).to.be.false;
      });
    });

    describe("true", () => {
      it("returns true for true", () => {
        expect(check.true(true)).to.be.true;
      });

      it("returns false for false", () => {
        expect(check.true(false)).to.be.false;
      });
    });

    describe("false", () => {
      it("returns true for false", () => {
        expect(check.false(false)).to.be.true;
      });

      it("returns false for true", () => {
        expect(check.false(true)).to.be.false;
      });
    });

    describe("symbol", () => {
      it("returns true for symbol", () => {
        expect(check.symbol(Symbol())).to.be.true;
      });

      it("returns false for non-symbol", () => {
        expect(check.symbol("symbol")).to.be.false;
      });
    });

    describe("null", () => {
      it("returns true for null", () => {
        expect(check.null(null)).to.be.true;
      });

      it("returns false for non-null", () => {
        expect(check.null(undefined)).to.be.false;
      });
    });

    describe("undefined", () => {
      it("returns true for undefined", () => {
        expect(check.undefined(undefined)).to.be.true;
      });

      it("returns false for defined", () => {
        expect(check.undefined(null)).to.be.false;
      });
    });

    describe("object", () => {
      it("returns true for object", () => {
        expect(check.object({})).to.be.true;
      });

      it("returns false for null", () => {
        expect(check.object(null)).to.be.false;
      });
    });

    describe("array", () => {
      it("returns true for array", () => {
        expect(check.array([])).to.be.true;
      });

      it("returns false for non-array", () => {
        expect(check.array({})).to.be.false;
      });
    });

    describe("arraybuffer", () => {
      it("returns true for ArrayBuffer", () => {
        expect(check.arraybuffer(new ArrayBuffer(1))).to.be.true;
      });

      it("returns false for non-ArrayBuffer", () => {
        expect(check.arraybuffer(new Uint8Array(1))).to.be.false;
      });
    });

    describe("arraybufferview", () => {
      it("returns true for ArrayBufferView", () => {
        expect(check.arraybufferview(new Uint8Array(1))).to.be.true;
      });

      it("returns false for non-ArrayBufferView", () => {
        expect(check.arraybufferview(new ArrayBuffer(1))).to.be.false;
      });
    });

    describe("regexp", () => {
      it("returns true for RegExp", () => {
        expect(check.regexp(/test/)).to.be.true;
      });

      it("returns false for non-RegExp", () => {
        expect(check.regexp("test")).to.be.false;
      });
    });

    describe("nonNullable", () => {
      it("returns true for non-nullable", () => {
        expect(check.nonNullable(0)).to.be.true;
        expect(check.nonNullable("")).to.be.true;
        expect(check.nonNullable(false)).to.be.true;
      });

      it("returns false for null or undefined", () => {
        expect(check.nonNullable(null)).to.be.false;
        expect(check.nonNullable(undefined)).to.be.false;
      });
    });
  });

  describe("assert", () => {
    describe("string", () => {
      it("does not throw for string", () => {
        expect(() => assert.string("hello")).not.to.throw();
      });

      it("throws for non-string", () => {
        expect(() => assert.string(123)).to.throw();
      });
    });

    describe("number", () => {
      it("does not throw for number", () => {
        expect(() => assert.number(42)).not.to.throw();
      });

      it("throws for non-number", () => {
        expect(() => assert.number("42")).to.throw();
      });

      describe("aan", () => {
        it("does not throw for number not NaN", () => {
          expect(() => assert.number.aan(42)).not.to.throw();
        });

        it("throws for NaN", () => {
          expect(() => assert.number.aan(NaN)).to.throw();
        });
      });

      describe("positive", () => {
        it("does not throw for positive", () => {
          expect(() => assert.number.positive(1)).not.to.throw();
        });

        it("throws for non-positive", () => {
          expect(() => assert.number.positive(0)).to.throw();
        });
      });

      describe("negative", () => {
        it("does not throw for negative", () => {
          expect(() => assert.number.negative(-1)).not.to.throw();
        });

        it("throws for non-negative", () => {
          expect(() => assert.number.negative(0)).to.throw();
        });
      });

      describe("zero", () => {
        it("does not throw for zero", () => {
          expect(() => assert.number.zero(0)).not.to.throw();
        });

        it("throws for non-zero", () => {
          expect(() => assert.number.zero(1)).to.throw();
        });
      });

      describe("integer", () => {
        it("does not throw for integer", () => {
          expect(() => assert.number.integer(42)).not.to.throw();
        });

        it("throws for float", () => {
          expect(() => assert.number.integer(42.5)).to.throw();
        });
      });

      describe("float", () => {
        it("does not throw for float", () => {
          expect(() => assert.number.float(42.5)).not.to.throw();
        });

        it("throws for integer", () => {
          expect(() => assert.number.float(42)).to.throw();
        });
      });

      describe("finite", () => {
        it("does not throw for finite", () => {
          expect(() => assert.number.finite(42)).not.to.throw();
        });

        it("throws for infinite", () => {
          expect(() => assert.number.finite(Infinity)).to.throw();
        });
      });

      describe("safeInteger", () => {
        it("does not throw for safe integer", () => {
          expect(() => assert.number.safeInteger(42)).not.to.throw();
        });

        it("throws for unsafe", () => {
          expect(() => assert.number.safeInteger(Number.MAX_SAFE_INTEGER + 1)).to.throw();
        });
      });
    });

    describe("boolean", () => {
      it("does not throw for boolean", () => {
        expect(() => assert.boolean(true)).not.to.throw();
      });

      it("throws for non-boolean", () => {
        expect(() => assert.boolean(1)).to.throw();
      });
    });

    describe("true", () => {
      it("does not throw for true", () => {
        expect(() => assert.true(true)).not.to.throw();
      });

      it("throws for false", () => {
        expect(() => assert.true(false)).to.throw();
      });
    });

    describe("false", () => {
      it("does not throw for false", () => {
        expect(() => assert.false(false)).not.to.throw();
      });

      it("throws for true", () => {
        expect(() => assert.false(true)).to.throw();
      });
    });

    describe("symbol", () => {
      it("does not throw for symbol", () => {
        expect(() => assert.symbol(Symbol())).not.to.throw();
      });

      it("throws for non-symbol", () => {
        expect(() => assert.symbol("symbol")).to.throw();
      });
    });

    describe("null", () => {
      it("does not throw for null", () => {
        expect(() => assert.null(null)).not.to.throw();
      });

      it("throws for non-null", () => {
        expect(() => assert.null(undefined)).to.throw();
      });
    });

    describe("undefined", () => {
      it("does not throw for undefined", () => {
        expect(() => assert.undefined(undefined)).not.to.throw();
      });

      it("throws for defined", () => {
        expect(() => assert.undefined(null)).to.throw();
      });
    });

    describe("object", () => {
      it("does not throw for object", () => {
        expect(() => assert.object({})).not.to.throw();
      });

      it("throws for null", () => {
        expect(() => assert.object(null)).to.throw();
      });
    });

    describe("array", () => {
      it("does not throw for array", () => {
        expect(() => assert.array([])).not.to.throw();
      });

      it("throws for non-array", () => {
        expect(() => assert.array({})).to.throw();
      });
    });

    describe("arraybuffer", () => {
      it("does not throw for ArrayBuffer", () => {
        expect(() => assert.arraybuffer(new ArrayBuffer(1))).not.to.throw();
      });

      it("throws for non-ArrayBuffer", () => {
        expect(() => assert.arraybuffer(new Uint8Array(1))).to.throw();
      });
    });

    describe("arraybufferview", () => {
      it("does not throw for ArrayBufferView", () => {
        expect(() => assert.arraybufferview(new Uint8Array(1))).not.to.throw();
      });

      it("throws for non-ArrayBufferView", () => {
        expect(() => assert.arraybufferview(new ArrayBuffer(1))).to.throw();
      });
    });

    describe("regexp", () => {
      it("does not throw for RegExp", () => {
        expect(() => assert.regexp(/test/)).not.to.throw();
      });

      it("throws for non-RegExp", () => {
        expect(() => assert.regexp("test")).to.throw();
      });
    });

    describe("nonNullable", () => {
      it("does not throw for non-nullable", () => {
        expect(() => assert.nonNullable(0)).not.to.throw();
      });

      it("throws for null or undefined", () => {
        expect(() => assert.nonNullable(null)).to.throw();
        expect(() => assert.nonNullable(undefined)).to.throw();
      });
    });
  });

  describe("nonNullable", () => {
    it("returns the value if not null or undefined", () => {
      expect(nonNullable(42)).to.equal(42);
      expect(nonNullable("test")).to.equal("test");
    });

    it("throws if null or undefined", () => {
      expect(() => nonNullable(null)).to.throw();
      expect(() => nonNullable(undefined)).to.throw();
    });
  });

  describe("isNonNullable", () => {
    it("returns true for non-nullable", () => {
      expect(isNonNullable(42)).to.be.true;
      expect(isNonNullable("")).to.be.true;
    });

    it("returns false for null or undefined", () => {
      expect(isNonNullable(null)).to.be.false;
      expect(isNonNullable(undefined)).to.be.false;
    });
  });
});
