import * as React from 'react';
import { Button } from './Button';
import { Clock } from './Clock';
import { GameState } from './GameState';
import { randomInt } from './Random';
import './Screen.css';
import { TileSet } from './TileSet';

interface ILettersGameProps {
    minLetters: number;
    maxLetters: number;
    endGame: () => void;
}

interface ILettersGameState {
    state: GameState;
    letters: string[];
    timeLeft: number;
    solutions: string[];
}

export class LettersGame extends React.PureComponent<ILettersGameProps, ILettersGameState> {
    private timerID: number;

    constructor(props: ILettersGameProps) {
        super(props);

        this.state = {
            letters: [],
            solutions: [],
            state: GameState.Setup,
            timeLeft: 30,
        };
    }
    
    public render() {
        const clock = this.state.state === GameState.Active ? <Clock time={this.state.timeLeft} /> : undefined;

        let buttonsEtc: JSX.Element | undefined;
        switch (this.state.state) {
            case GameState.Setup:
                buttonsEtc = this.renderSetup(); break;
            case GameState.Finished:
                buttonsEtc = this.renderFinished(false); break;
            case GameState.Revealed:
                buttonsEtc = this.renderFinished(true); break;
        }

        return (
            <div className="screen screen--letters">
                {clock}
                <TileSet text={this.state.letters} size={this.props.minLetters} />
                {buttonsEtc}
            </div>
        );
    }

    private renderSetup() {
        const addConsonant = () => this.addLetter(this.getConsonant());
        const addVowel = () => this.addLetter(this.getVowel());
        const startGame = () => this.startGame();

        return (
            <div className="screen__actions">
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

    private renderFinished(showSolutions: boolean) {
        const endGame = () => this.props.endGame();
        const revealSolutions = () => this.showSolutions();

        const solutions = showSolutions
            ? (
                <div className="screen__solutions">
                    {this.state.solutions.map((sol, idx) => this.renderSolution(sol, idx))}
                </div>
            )
            : (
                <Button
                    text="Show solutions"
                    enabled={true}
                    onClick={revealSolutions}
                />
            )

        return (
            <div className="screen__actions">
                {solutions}
                
                <Button
                    text="End game"
                    enabled={true}
                    onClick={endGame}
                />
            </div>
        );
    }

    private renderSolution(word: string, index: number) {
        return (
            <div className="game__solution" key={index}>
                {word}
            </div>
        );
    }

    private showSolutions() {
        const bestSolutions = this.getBestSolutions();

        this.setState({
            solutions: bestSolutions,
            state: GameState.Revealed,
        });
    }

    private getBestSolutions() {
        // TODO: retrieve from background thread somewhere
        return ['Fake', 'Solution', 'Needs', 'Work'];
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
