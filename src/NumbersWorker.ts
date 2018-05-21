function postNumbersResult(msg: [number, string]) {
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

class Operator {
    constructor(public readonly text: string, public readonly displayLinear: boolean, public readonly action: (a: number, b: number) => number | null) {

    }
}

export type Expression = Array<Operator | number>;

function add(a: number, b: number) {
    if (a < b) {
        return null; // don't do it this way around, it doesn't look pleasant
    }

    return a + b;
}

function subtract(a: number, b: number) {
    const val = a - b;
    
    if (val === b) {
        return null; // a valid, but pointless operation
    }
    
    if (val <= 0) {
        return null; // not allowed by game rules
    }

    return val;
}

function multiply(a: number, b: number) {
    if (a < b) {
        return null; // don't do it this way around, it doesn't look pleasant
    }

    if (b === 1) {
        return null; // a valid, but pointless operation
    }

    return a * b;
}

function divide(a: number, b: number) {
    if (b === 1) {
        return null; // a valid, but pointless operation
    }

    const val = a / b;

    if (!isInt(val)) {
        return null; // not allowed by game rules
    }
    
    return val;
}

export const operators: Operator[] = [
    new Operator('+', true, add),
    new Operator('-', true, subtract),
    new Operator('x', false, multiply),
    new Operator('÷', false, divide),
];

self.onmessage = e => {
    const data = e.data as [string, number, number[]];

    if (data[0] === 'calculate') {
        solve(data[1], data[2]);
    }
    else if (data[0] === 'respond') {
        // a result is needed NOW

        postNumbersResult([bestValue, bestSolution]);
    }
}

export function solve(targetVal: number, useNumbers: number[]) {
    target = targetVal;
    numbers = useNumbers;

    forEachPermutation(numbers, [], numbers.length, applyOperatorPositionPermutations);

    return [bestValue, bestSolution];
}

function testSolution(result: number, solution: Expression, solutionElementsToKeep: number) {
    const distance = Math.abs(result - target);
    
    if (distance < bestDistance || (distance === bestDistance && solution.length < bestSolution.length)) {
        bestValue = result;
        bestDistance = distance;

        const solutionExpression = solution.slice(0, solutionElementsToKeep);
        bestSolution = writeExpression(solutionExpression);
    }
}

function forEachPermutation<T>(items: T[], permutation: T[], size: number, forEach: (val: T[]) => void) {
    if (permutation.length === size) {
        forEach(permutation);
    }

    for (const item of items) {
        permutation.push(item);


        items.splice(items.indexOf(item), 1);

        forEachPermutation(items, permutation, size, forEach);

        items.push(permutation.pop() as T);
    }
}

// this fixed list only works for 6-number games, of course. D'oh! Can we calculate a reliable list quickly,
// or do we just try all that aren't "obviously" wrong and abort if they are?
const operatorPositionPermutations = [
    [6, 7, 8, 9, 10],
    [5, 7, 8, 9, 10],
    [5, 6, 8, 9, 10],
    [5, 6, 7, 9, 10],
    [5, 6, 7, 8, 10],
    [4, 7, 8, 9, 10],
    [4, 6, 8, 9, 10],
    [4, 6, 7, 9, 10],
    [4, 6, 7, 8, 10],
    [4, 5, 8, 9, 10],
    [4, 5, 7, 9, 10],
    [4, 5, 7, 8, 10],
    [4, 5, 6, 9, 10],
    [4, 5, 6, 8, 10],
    [3, 7, 8, 9, 10],
    [3, 6, 8, 9, 10],
    [3, 6, 7, 9, 10],
    [3, 6, 7, 8, 10],
    [3, 5, 8, 9, 10],
    [3, 5, 7, 9, 10],
    [3, 5, 7, 8, 10],
    [3, 5, 6, 9, 10],
    [3, 5, 6, 8, 10],
    [3, 4, 8, 9, 10],
    [3, 4, 7, 9, 10],
    [3, 4, 7, 8, 10],
    [3, 4, 6, 9, 10],
    [3, 4, 6, 8, 10],
    [2, 7, 8, 9, 10],
    [2, 6, 8, 9, 10],
    [2, 6, 7, 9, 10],
    [2, 6, 7, 8, 10],
    [2, 5, 8, 9, 10],
    [2, 5, 7, 9, 10],
    [2, 5, 7, 8, 10],
    [2, 5, 6, 9, 10],
    [2, 5, 6, 8, 10],
    [2, 4, 8, 9, 10],
    [2, 4, 7, 9, 10],
    [2, 4, 7, 8, 10],
    [2, 4, 6, 9, 10],
    [2, 4, 6, 8, 10],
];

function applyOperatorPositionPermutations(values: number[]) {
    for (const operatorIndices of operatorPositionPermutations) {
        const expression = values.slice();

        // put blanks into the expression where the operators will go
        for (const index of operatorIndices) {
            expression.splice(index, 0, -1);
        }

        applyOperatorPermutations(expression, operatorIndices, operatorIndices.length - 1);
    }
}

function applyOperatorPermutations(expression: Expression, operatorIndices: number[], operatorNum: number) {
    const lastLevel = operatorNum === 0;

    for (const operator of operators) {
        const index = operatorIndices[operatorNum];
        expression[index] = operator;

        if (lastLevel) {
            testSolve(expression);
        }
        else {
            applyOperatorPermutations(expression, operatorIndices, operatorNum - 1);
        }
    }
}

function testSolve(postfix: Expression) {
    // solve a postfix expression, testing each step of the way to see if that counts as a solution
    if (postfix.length === 0) {
        return;
    } 

    const stack = [];

    let numUsedElements = 0;
    for (const element of postfix) {
        numUsedElements++;

        if (typeof element === 'number') {
            stack.push(element);
            continue;
        }

        if (stack.length < 2) {
            return;
        }

        const operand2 = stack.pop() as number;
        const operand1 = stack.pop() as number;
        const result = element.action(operand1, operand2);

        if (result === null) {
            return;
        }

        testSolution(result, postfix, numUsedElements);

        stack.push(result);
    }
}

class InfixOperation {
    constructor(public readonly text: string, public readonly operator: Operator | null) {
    }

    public toString() {
        return this.text;
    }
}

export function writeExpression(postfix: Expression) {
    const stack: InfixOperation[] = [];

    for (const element of postfix) {
        if (typeof element === 'number') {
            stack.push(new InfixOperation(element.toString(), null));
            continue;
        }

        const operator = element;

        const operand2 = stack.pop() as InfixOperation;
        const operand1 = stack.pop() as InfixOperation;
        
        const bracketNeededOperand1 = operand1.operator !== null
            && (!operator.displayLinear || !operand1.operator.displayLinear);
        let text = bracketNeededOperand1 ?  `(${operand1.text})` : operand1.text;

        text += ` ${operator.text} `;
        
        const bracketNeededOperand2 = operand2.operator !== null
            && (!operator.displayLinear || !operand2.operator.displayLinear);
        text += bracketNeededOperand2 ?  `(${operand2.text})` : operand2.text;

        const operation = new InfixOperation(text, operator);
        stack.push(operation);
    }

    return stack.join(' ');
}