const workerCode = () => {
    function postMsg(msg: string[]) {
        const workaround = self as any;
        workaround.postMessage(msg);
    }

    const bestWords: string[] = [];

    self.onmessage = e => {
        const data = e.data as [string, string[]];

        if (data[0] === 'calculate') {

            // TODO: start calculating solutions
            bestWords.push('CANT');
            bestWords.push('SOLVE');
            bestWords.push('YET');
        }
        else if (data[0] === 'respond') {
            // a result is needed NOW
            postMsg(bestWords);
        }
    }
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], {type: 'application/javascript'});
const workerScript = URL.createObjectURL(blob);

export default workerScript;