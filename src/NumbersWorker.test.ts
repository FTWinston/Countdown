import { operators, solve, writeExpression } from './NumbersWorker';

it('gets a solution', () => {
    const results = solve(757, [100, 10, 1, 1, 6, 5]);
    console.log(`got ${results[0]}: ${results[1]}`);
});

it('removes multiplicative brackets', () => {
    const results = solve(304, [2, 4, 1, 4, 3, 9]);
    console.log(`got ${results[0]}: ${results[1]}`); // 3 ((9 x 2) + 1) x 4 x 4
});

it('writes an expression with unused element on the start', () => {
    const infix = writeExpression([3, 9, 2, operators[2], 1, operators[0], 4, operators[2], 4, operators[2]]);
    console.log(infix);
});