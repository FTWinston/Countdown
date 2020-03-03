import { getValidOperatorPositionPermutations, operators, solve, writeExpression } from './NumbersWorker';

test('avoid writing unused number', () => {
    const infix = writeExpression([3, 9, 2, operators[2], 1, operators[0], 4, operators[2], 4, operators[2]]);
    expect(infix).toBe('((9 x 2) + 1) x 4 x 4');
});

test('get the right number of operator position permutations', () => {
    expect(getValidOperatorPositionPermutations(6).length).toBe(42);
});

test('get the right solution', () => {
    const results = solve(757, [100, 10, 1, 1, 6, 5]);
    expect(results[0]).toBe(757);
});

test('don\'t remove subtractive brackets', () => {
    const solution = solve(919, [79, 13, 10, 3, 2]);
    expect(solution[1]).not.toBe('((79 + 13) x 10) - 3 - 2');
    // console.log(solution[1]);
});

test('remove multiplicative brackets', () => {
    const results = solve(304, [2, 4, 1, 4, 3, 9]);
    expect(results[1]).toBe('((9 x 2) + 1) x 4 x 4');
});
