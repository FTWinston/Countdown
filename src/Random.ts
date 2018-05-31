export function randomInt(minInclusive: number, maxExclusive: number) {
    return Math.floor(Math.random() * (maxExclusive - minInclusive)) + minInclusive;
}

/*export function shuffle<T>(array: T[]) {
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
}*/

export function shuffleWord(word: string) { 
    return weightedShuffle(shuffle(word.split(''))).join('');
}

export function weightedShuffle<T>(data:T[]):T[] {
    const start = [data[0]];
    const end = [];
    for(let i = 1; i < data.length; i++) {
        if(data[i-1] === data[i]) {
          end.push(data[i]);
      } else {
          start.push(data[i]);
      }
    }
    return [... start, ... end];
  }
  
  export function shuffle<T>(array:T[]):T[] {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }