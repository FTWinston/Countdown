const workerCode = () => {
    function postMsg(msg: [number, string]) {
        const workaround = self as any;
        workaround.postMessage(msg);
    }

    // let target: number;
    // let numbers: number[];
    let closestValue: number = -1;
    let bestSolution: string = '';

    self.onmessage = e => {
        const data = e.data as [string, number, number[]];

        if (data[0] === 'calculate') {
            // target = data[1];
            // numbers = data[2];
            
            // TODO: start calculating solutions
            closestValue = -1;
            bestSolution = 'Sorry I can\'t solve this yet';
        }
        else if (data[0] === 'respond') {
            // a result is needed NOW
            postMsg([closestValue, bestSolution]);
        }
    }
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], {type: 'application/javascript'});
const workerScript = URL.createObjectURL(blob);

export default workerScript;