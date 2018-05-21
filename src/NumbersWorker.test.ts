import { solve } from './NumbersWorker';

it('gets a solution', () => {
    const results = solve(757, [100, 10, 1, 1, 6, 5]);
    console.log(`got ${results[0]}: ${results[1]}`);
});

it('writes a dodgy solution', () => {
    const results = solve(733, [75, 6, 10, 6, 4, 7]);
    console.log(`got ${results[0]}: ${results[1]}`); // 4 ((75 - (6 ÷ 6)) x 10) - 7
});