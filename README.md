# Code contract for Deno

Tiny code contract programming utility for Deno.

## Usage

Use `codeContract` function to bind the contract.

```
import { codeContract } from "./code-contracts.ts";

const func = (lhs: number, rhs: number) => (lhs + rhs);
const contracted = codeContract(func, {
  pre: (lhs: number, rhs: number) => 0 < lhs && 0 < rhs,
  post: (result: number) => (result < 100),
});
contracted(10, 20); // OK
contracted(99, 1); // NG(throw Error)
```

### functions

#### codeContract

Return contracted function.

- `fn` - target function
- `contract` - contract functions container
  - `pre` - pre condition function
  - `post` - post condition function
  - `invariant` - invariant condition function

#### disableContractCheck

Disable contract check.

#### enableContractCheck

Enable contract check.

## CHANGELOG

[CHANGELOG](CHANGELOG.md)

## License

MIT
