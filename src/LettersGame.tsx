import * as React from 'react';
import { Button } from './Button';
import { Clock } from './Clock';
import './Game.css';
import { GameState } from './GameState';
import { randomInt } from './Random';
import { TileSet } from './TileSet';

interface ILettersGameProps {
    minLetters: number;
    maxLetters: number;
}

interface ILettersGameState {
    state: GameState;
    letters: string[];
    timeLeft: number;
}

export class LettersGame extends React.PureComponent<ILettersGameProps, ILettersGameState> {
    private timerID: number;

    constructor(props: ILettersGameProps) {
        super(props);

        this.state = {
            letters: [],
            state: GameState.Setup,
            timeLeft: 30,
        };
    }
    
    public render() {
        const clock = this.state.state === GameState.Setup ? undefined : <Clock time={this.state.timeLeft} />;
        const selection = this.state.state === GameState.Setup ? this.renderSetup() : undefined;

        return (
            <div className="game game--letters">
                {clock}
                <TileSet text={this.state.letters} size={this.props.minLetters} />
                {selection}
            </div>
        );
    }

    private renderSetup() {
        const addConsonant = () => this.addLetter(this.getConsonant());
        const addVowel = () => this.addLetter(this.getVowel());
        const startGame = () => this.startGame();

        return (
            <div className="game--actions">
                <Button
                    text="Consonant"
                    enabled={this.state.letters.length < this.props.maxLetters}
                    onClick={addConsonant}
                />
                <Button
                    text="Vowel"
                    enabled={this.state.letters.length < this.props.maxLetters}
                    onClick={addVowel}
                />
                <Button
                    text="Start"
                    enabled={this.state.letters.length >= this.props.minLetters}
                    onClick={startGame}
                />
            </div>
        );
    }

    private getConsonant() {
        const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
        return consonants[randomInt(0, consonants.length)];
    }

    private getVowel() {
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        return vowels[randomInt(0, vowels.length)];
    }

    private addLetter(letter: string) {
        this.setState(prevState => {
            const allLetters = prevState.letters.slice();
            allLetters.push(letter);
            return {
                letters: allLetters,
            };
        })
    }

    private startGame() {
        this.setState({ state: GameState.Active });
        this.timerID = window.setInterval(() => this.tick(), 1000);
    }

    private tick() {
        this.setState(prevState => {
            const secsRemaining = prevState.timeLeft - 1;
            const finished = secsRemaining === 0;

            if (finished) {
                window.clearInterval(this.timerID);
            }

            return {
                state: finished ? GameState.Finished : GameState.Active,
                timeLeft: secsRemaining,
            };
        })
    }
}
