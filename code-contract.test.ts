/**
 * @file Unit tests for code contract utility
 */
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import {
  codeContract,
  disableContract,
  enableContract,
} from "./code-contract.ts";

//
// Variables
//

let sideEffectTarget = true;

//
// Functions
//

const func = (lhs: number, rhs: number) => (lhs + rhs);

//
// Test cases
//

Deno.test({
  name: "It should success the function call if the contract is kept",
  fn: () => {
    // arrange
    enableContract();
    sideEffectTarget = false;
    const contracted = codeContract(func, {
      pre: (lhs: number, rhs: number) => 0 < lhs && 0 < rhs,
      post: (result: number) => (result === 30),
    });

    // act & assert
    assertEquals(contracted(10, 20), 30);
  },
});
Deno.test({
  name: "It should fail the function call if the pre condition is invalid",
  fn: () => {
    assertThrows(
      () => {
        // arrange
        enableContract();
        sideEffectTarget = false;
        const contracted = codeContract(func, {
          pre: (lhs: number, rhs: number) => 0 < lhs && 0 < rhs,
        });

        // act & assert
        assertEquals(contracted(20, -10), 10);
      },
    );
  },
});
Deno.test({
  name: "It should fail the function call if the post condition is invalid",
  fn: () => {
    assertThrows(
      () => {
        // arrange
        enableContract();
        sideEffectTarget = false;
        const contracted = codeContract(func, {
          post: (result: number) => (result === 30),
        });

        // act & assert
        assertEquals(contracted(20, 20), 40);
      },
    );
  },
});
Deno.test({
  name:
    "It should fail the function call if the invariant condition is invalid",
  fn: () => {
    assertThrows(
      () => {
        // arrange
        enableContract();
        sideEffectTarget = false;

        const funcWithSideEffect = (
          lhs: number,
          rhs: number,
        ) => (sideEffectTarget = true, lhs + rhs);
        const contracted = codeContract(funcWithSideEffect, {
          invariant: () => (sideEffectTarget === false),
        });

        // act & assert
        assertEquals(contracted(20, 20), 40);
      },
    );
  },
});
Deno.test({
  name: "It should omit contract check if contract check is disabled",
  fn: () => {
    // arrange
    disableContract();
    sideEffectTarget = false;
    const contracted = codeContract(func, {
      pre: (lhs: number, rhs: number) => 0 < lhs && 0 < rhs,
      post: (result: number) => (result === 30),
    });

    // act & assert
    assertEquals(contracted(-10, -20), -30);

    enableContract();
  },
});
