export function randomInt(minInclusive: number, maxExclusive: number) {
    return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
}

export function shuffle<T>(array: T[]) {
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

export function shuffleWord(word: string) {
    return shuffle(word.split('')).join('');
}

export function preventRepeats<T>(data: T[], repeatRejectionChance: number = 1) {
    const output = [];
    let unused = data.slice();

    let prev: T | null = null;
    let repeats = 0;

    do {
        const rejected = [];

        for (const val of unused) {
            if (val === prev && Math.random() <= repeatRejectionChance) {
                rejected.push(val);
            }
            else {
                output.push(val);
            }

            prev = val;
        }

        unused = rejected;
    } while (++repeats < 4 && unused.length > 0);
    
    return output;
}