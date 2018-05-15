import { IConundrumSettings } from './Conundrum';
import { ILettersGameSettings } from './LettersGame';
import { INumbersGameSettings } from './NumbersGame';

export interface ILettersGameConfiguration extends ILettersGameSettings {
    game: 'LETTERS';
}

export interface INumbersGameConfiguration extends INumbersGameSettings {
    game: 'NUMBERS';
}

export interface IConundrumConfiguration extends IConundrumSettings {
    game: 'CONUNDRUM';
}

export type GameConfiguration = ILettersGameConfiguration | INumbersGameConfiguration | IConundrumConfiguration;