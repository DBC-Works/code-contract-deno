/**
 * @file Code contract utility
 */
//
// Types
//

// deno-lint-ignore no-explicit-any
type FunctionType<T> = ((...args: any[]) => T) & { name: string };
type ContractType<TResult> = {
  // deno-lint-ignore no-explicit-any
  pre?: (...args: any[]) => boolean;
  post?: (result: TResult) => boolean;
  invariant?: () => boolean;
};

//
// Variables
//

let checkContract = true;

//
// Functions
//

/**
 * Bind function with code contract
 * @param fn Function to bind
 * @param contract Code contract
 * @returns Bound function
 */
export function codeContract<
  T extends FunctionType<ReturnType<T>>,
>(
  fn: T,
  contract: ContractType<ReturnType<T>> = {},
): T {
  if (checkContract === false) {
    return fn;
  }
  return ((...args) => {
    const check = requireContractCheck();
    if (
      check !== false && contract.pre !== undefined &&
      contract.pre(...args) === false
    ) {
      const msg = [
        "Code Contract: Failed to assert the pre condition.",
        `\tfunction: ${fn.name}`,
        `\targs: ${JSON.stringify(args)}`,
      ];
      throw new Error(msg.join("\n"));
    }
    const result = fn(...args);
    if (
      check !== false && contract.post !== undefined &&
      contract.post(result) === false
    ) {
      const msg = [
        "Code Contract: Failed to assert the post condition.",
        `\tfunction: ${fn.name}`,
        `\tresult: ${JSON.stringify(args)}`,
      ];
      throw new Error(msg.join("\n"));
    }
    if (
      check !== false && contract.invariant !== undefined &&
      contract.invariant() === false
    ) {
      const msg = [
        "Code Contract: Failed to assert the invariant.",
        `\tfunction: ${fn.name}`,
      ];
      throw new Error(msg.join("\n"));
    }

    return result;
  }) as T;
}

/**
 * Enable contract
 */
export function enableContract() {
  checkContract = true;
}

/**
 * Disable contract check
 */
export function disableContract() {
  checkContract = false;
}

/**
 * Require contract check
 * @returns Require contract check flag
 */
function requireContractCheck() {
  return checkContract;
}
