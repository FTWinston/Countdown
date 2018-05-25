import { Game } from './Enums';

interface ISettings {
    game: Game;
    name: string;
}

export interface ILettersGameSettings extends ISettings {
    game: Game.Letters;
    minLetters: number;
    maxLetters: number;
    minConsonants: number;
    minVowels: number;
    consonants: string[];
    vowels: string[];
}

export interface INumbersGameSettings extends ISettings {
    game: Game.Numbers;
    smallNumbers: number[];
    bigNumbers: number[];
    numberCount: number;
    minTarget: number;
    maxTarget: number;
}

export interface IConundrumSettings extends ISettings {
    game: Game.Conundrum;
    numLetters: number;
    word?: string;
    scrambled?: string;
}

export type GameSettings = ILettersGameSettings | INumbersGameSettings | IConundrumSettings;