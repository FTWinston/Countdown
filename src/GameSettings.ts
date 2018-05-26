import { Game, GameOrSequence, Sequence } from './Enums';

interface ISettings {
    name: string;
    type: GameOrSequence;
}

interface IGameSettings extends ISettings {
    type: Game;
}

export interface ILettersGameSettings extends IGameSettings {
    type: Game.Letters;
    minLetters: number;
    maxLetters: number;
    minConsonants: number;
    minVowels: number;
    consonants: string[];
    vowels: string[];
}

export interface INumbersGameSettings extends IGameSettings {
    type: Game.Numbers;
    smallNumbers: number[];
    bigNumbers: number[];
    numberCount: number;
    minTarget: number;
    maxTarget: number;
}

export interface IConundrumSettings extends IGameSettings {
    type: Game.Conundrum;
    numLetters: number;
    word?: string;
    scrambled?: string;
}

export interface ISequenceSettings extends ISettings {
    games: GameSettings[];
    type: Sequence.GameSequence;
}

export type GameSettings     = ILettersGameSettings | INumbersGameSettings | IConundrumSettings;
export type EditableSettings = ILettersGameSettings | INumbersGameSettings | IConundrumSettings | ISequenceSettings;