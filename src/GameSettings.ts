import { IConundrumSettings } from './Conundrum';
import { ILettersGameSettings } from './LettersGame';
import { INumbersGameSettings } from './NumbersGame';

export type GameSettings = ILettersGameSettings | INumbersGameSettings | IConundrumSettings;

export const defaultLettersSettings: ILettersGameSettings = {
    consonants: [
        'B', 'B',
        'C', 'C', 'C',
        'D', 'D', 'D', 'D', 'D', 'D',
        'F', 'F',
        'G', 'G', 'G',
        'H', 'H',
        'J',
        'K',
        'L', 'L', 'L', 'L', 'L',
        'M', 'M', 'M', 'M',
        'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N',
        'P', 'P', 'P', 'P',
        'Q',
        'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R',
        'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S',
        'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T',
        'V',
        'W',
        'X',
        'Y',
        'Z',
    ],
    game: 'LETTERS',
    maxLetters: 9,
    minConsonants: 4,
    minLetters: 9,
    minVowels: 3,
    vowels: [
        'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
        'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
        'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'U', 'U', 'U', 'U', 'U',
    ],
};

export const defaultNumbersSettings: INumbersGameSettings = {
    bigNumbers: [25, 50, 75, 100],
    game: 'NUMBERS',
    maxTarget: 999,
    minTarget: 101,
    numberCount: 6,
    smallNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

export const defaultConundrumSettings: IConundrumSettings = {
    game: 'CONUNDRUM',
    numLetters: 9,
};

export const defaultGameSequence: GameSettings[] = [
    defaultLettersSettings,
    defaultLettersSettings,
    defaultNumbersSettings,

    defaultLettersSettings,
    defaultLettersSettings,
    defaultNumbersSettings,

    defaultConundrumSettings,
]