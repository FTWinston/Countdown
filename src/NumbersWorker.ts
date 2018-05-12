const workerCode = () => {
    function postMsg(msg: [number, string]) {
        const workaround = self as any;
        workaround.postMessage(msg);
    }

    function isInt(n: number) {
        return n >> 0 === n;
    }

    let target: number;
    let numbers: number[];
    let bestValue: number = -1;
    let bestDistance = 99999;
    let bestSolution: string = '';

    const operators: Array<[string, (a: number, b: number) => number | null]> = [
        ['+', (a, b) => a + b],
        ['-', (a, b) => { const val = a - b; return val <= 0 ? null : val; }],
        ['x', (a, b) => a * b],
        ['/', (a, b) => { const val = a / b; return isInt(val) ? val : null; }],
    ];

    self.onmessage = e => {
        const data = e.data as [string, number, number[]];

        if (data[0] === 'calculate') {
            target = data[1];
            numbers = data[2];
            
            findAllCombinations(numbers);
        }
        else if (data[0] === 'respond') {
            // a result is needed NOW
            postMsg([bestValue, bestSolution]);
        }
    }

    function testValue(value: number, solution: string) {
        const distance = Math.abs(value - target);
        
        if (distance < bestDistance || (distance === bestDistance && solution.length < bestSolution.length)) {
            bestValue = value;
            bestDistance = distance;
            bestSolution = solution;
        }
    }

    function findAllCombinations(values: number[]) {
        findCombinations([], values);
    }

    function findCombinations(committed: number[], available: number[]) {
        const count = available.length;
        const canContinue = count > 1;

        for (let i = 0; i < count; i++) {
            // create new combos by taking each remaining value, and adding it onto the previously committed array
            const combo = committed.slice();
            const remaining = available.slice();
            const next = remaining.splice(i, 1)[0];

            combo.push(next);
            if (combo.length > 1) {
                addOperators(combo);
            }

            if (canContinue) {
                findCombinations(combo, remaining);
            }
        }
    }

    function addOperators(sequence: number[]) {
        sequence = sequence.slice();
        const first = sequence.shift() as number;

        applyOperatorsAndTest(first, first.toString(), sequence);
    }

    function applyOperatorsAndTest(value: number, display: string, remainingNumbers: number[]) {
        remainingNumbers = remainingNumbers.slice();
        const appendNumber = remainingNumbers.shift() as number;
        const canContinue = remainingNumbers.length > 0;

        for (const operator of operators) {
            const nextValue = operator[1](value, appendNumber);
            if (nextValue === null) {
                continue;
            }

            const nextDisplay = canContinue
                ? `(${display} ${operator[0]} ${appendNumber})`
                : `${display} ${operator[0]} ${appendNumber}`; // no brackets for the last one

            testValue(nextValue, nextDisplay);

            if (canContinue) {
                applyOperatorsAndTest(nextValue, nextDisplay, remainingNumbers);
            }
        }
    }
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], {type: 'application/javascript'});
const workerScript = URL.createObjectURL(blob);

export default workerScript;