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

function testSolution(result: number, solution: Expression, firstUnusedSolutionElement: number) {
    const distance = Math.abs(result - target);
    
    if (distance > bestDistance) {
        return;
    }

    const solutionExpression = solution.slice(0, firstUnusedSolutionElement); // chop equal amount from start and end?
    
    const writtenSolution = writeExpression(solutionExpression);

    if (distance === bestDistance && writtenSolution.length > bestSolution.length) {
        return;
    }

    bestValue = result;
    bestDistance = distance;
    bestSolution = writtenSolution;
}

function forEachPermutation<T>(items: T[], permutation: T[], size: number, forEach: (val: T[]) => void) {
    if (permutation.length === size) {
        forEach(permutation);
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        permutation.push(item);
        items.splice(i, 1);

        forEachPermutation(items, permutation, size, forEach);

        items.splice(i, 0, item);
        permutation.pop();
    }
}

export function isOperatorPositionPermutationValid(numElements: number, positions: number[]) {
    let stackSize = 0;
    let evalPos = 0;

    for (const nextOperatorPos of positions) {

        stackSize += nextOperatorPos - evalPos;
        evalPos = nextOperatorPos;
        
        if (stackSize < 2) {
            return false;
        }

        stackSize -= 2;
    }

    return stackSize === 0;
}

export function getValidOperatorPositionPermutations(numNumbers: number) {
    const numOperators = numNumbers - 1;
    const numElements = numNumbers + numOperators;

    const firstAddIndex = 2;
    const lastAddIndex = numElements - 2; // we will always add an operator at the end

    const validPositions: number[][] = [];

    const gotPermuation = (positions: number[]) => {
        positions = positions.slice();
        positions.push(numElements - 1); // we always add an operator at the end
        if (isOperatorPositionPermutationValid(numElements, positions)) {
            validPositions.push(positions);
        }
    }

    const data: number[] = [];
    getNumberPermutations(data, firstAddIndex, lastAddIndex, 0, numOperators - 1, gotPermuation);
    return validPositions;
}

function getNumberPermutations(
    data: number[],
    startIndex: number,
    endIndex: number,
    currentIndex: number,
    combinationSize: number,
    gotPermuation: (permutation: number[]) => void
) {
    if (currentIndex === combinationSize) {
        gotPermuation(data);
        return;
    }

    for (let i = startIndex; i <= endIndex && endIndex - i + 1 >= combinationSize - currentIndex; i++) {
        data[currentIndex] = i;
        getNumberPermutations(data, i + 1, endIndex, currentIndex + 1, combinationSize, gotPermuation);
    }
}

function applyOperatorPositionPermutations(values: number[]) {
    const operatorPositionPermutations = getValidOperatorPositionPermutations(values.length);

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

    let firstUnusedElement = 0;
    for (const element of postfix) {
        firstUnusedElement++;

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

        testSolution(result, postfix, firstUnusedElement);

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
    const multiplication = operators[2];
    const subtraction = operators[1];
    let firstUsedElement = postfix.length;

    for (const element of postfix) {
        if (typeof element === 'number') {
            stack.push(new InfixOperation(element.toString(), null));
            continue;
        }

        const operator = element;

        const operand2 = stack.pop() as InfixOperation;
        const operand1 = stack.pop() as InfixOperation;
        const firstOperandIndex = stack.length;
        if (firstOperandIndex < firstUsedElement) {
            firstUsedElement = firstOperandIndex;
        }
        
        let text = bracketNeeded(operand1, operator, false) ?  `(${operand1.text})` : operand1.text;
        text += ` ${operator.text} `;
        text += bracketNeeded(operand2, operator, true) ?  `(${operand2.text})` : operand2.text;

        const operation = new InfixOperation(text, operator);
        stack.push(operation);
    }

    if (firstUsedElement > 0) {
        stack.splice(0, firstUsedElement);
    }

    return stack.join(' ');

    function bracketNeeded(operand: InfixOperation, operator: Operator, isSecondOperand: boolean) {
        if (operand.operator === null) {
            return false;
        }

        if ((!operator.displayLinear || !operand.operator.displayLinear)
            && (operator !== multiplication || operand.operator !== multiplication)) {
            return true;
        }

        if (isSecondOperand && operator === subtraction && operand.operator === subtraction) {
            return true;
        }

        return false;
    }
}