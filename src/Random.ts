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