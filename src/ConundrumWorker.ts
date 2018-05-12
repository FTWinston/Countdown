const workerCode = () => {
    // copied from Random.ts until/unless imports can be made to work here
    function randomInt(minInclusive: number, maxExclusive: number) {
        return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
    }
    
    // copied from Random.ts until/unless imports can be made to work here
    function shuffle<T>(array: T[]) {
        let currentIndex = array.length;
        let temporaryValue: T;
        let randomIndex: number;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
            // Pick a remaining element...
            randomIndex = randomInt(0, currentIndex);
            currentIndex -= 1;
      
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
      
        return array;
    }

    function shuffleWord(word: string) {
        return shuffle(word.split('')).join('');
    }

    function postMsg(msg: [string, string]) {
        // TODO: save this word to sessionStorage so we don't choose it again
        const workaround = self as any;
        workaround.postMessage(msg);
    }

    function loadRandomWord() {
        loadWord(0)
            .then((firstData: [number, string]) => {        
                const length = firstData[0];
                const num = randomInt(0, length);

                loadWord(num)
                    .then((data: [number, string]) => {
                        const word = data[1];
                        bestResult = [shuffleWord(word), word];

                        // TODO: load several words and see which can be "anagramized" the best
                        postMsg(bestResult);
                    });
            });
    }

    function loadWord(pos: number) {
        return fetch(`http://wordfinder.yourdictionary.com/scrabble/articleAjax/type/letter-words/letter/${size}`
            + `?sEcho=1&iColumns=1&sColumns=&iDisplayStart=${pos}&iDisplayLength=1&mDataProp_0=word&sSearch=&sSearch_0=`
            + '&bRegex_0=false&bSearchable_0=true&iSortCol_0=2&sSortDir_0=asc&iSortingCols=1&bSortable_0=true&sorting_field=wwf')
        .then(response => response.json())
        .then(data => [
                data.iTotalRecords,
                data.aaData[0].word,
            ]
        );
    }

    let size: number = 0;
    let bestResult: [string, string] = ['', ''];

    self.onmessage = e => {
        const data = e.data as [string, number];

        if (data[0] === 'generate') {
            size = data[1];
            loadRandomWord();
        }
        else if (data[0] === 'respond') {
            // a result is needed NOW ... send one only if we have one
            if (bestResult[0] !== '') {
                postMsg(bestResult);
            }
        }
    }
};

let code = workerCode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));

const blob = new Blob([code], {type: 'application/javascript'});
const workerScript = URL.createObjectURL(blob);

export default workerScript;