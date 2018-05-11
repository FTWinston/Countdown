import * as React from 'react';
import { Button } from './Button';
import { Clock } from './Clock';
import { GameState } from './GameState';
import workerScript from './LettersWorker';
import { shuffle } from './Random';
import './Screen.css';
import { TileSet } from './TileSet';

interface ILettersGameProps {
    minLetters: number;
    maxLetters: number;
    minConsonants: number;
    minVowels: number;
    consonants: string[];
    vowels: string[];
    endGame: () => void;
}

interface ILettersGameState {
    state: GameState;
    letters: string[];
    numConsonants: number;
    numVowels: number;
    timeLeft: number;
    solutions: string[];
    consonantsAvailable: string[];
    vowelsAvailable: string[];
}

export class LettersGame extends React.PureComponent<ILettersGameProps, ILettersGameState> {
    private timerID: number;
    private worker: Worker;

    constructor(props: ILettersGameProps) {
        super(props);

        this.state = {
            consonantsAvailable: shuffle(this.props.consonants.slice()),
            letters: [],
            numConsonants: 0,
            numVowels: 0,
            solutions: [],
            state: GameState.Setup,
            timeLeft: 30,
            vowelsAvailable: shuffle(this.props.vowels.slice()),
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
        const addConsonant = () => this.addLetter(true);
        const addVowel = () => this.addLetter(false);
        const startGame = () => this.startGame();

        const lettersRemaining = this.props.minLetters - this.state.letters.length;
        const needsAllConsonants = this.state.numConsonants < this.props.minConsonants
            && (this.props.minConsonants - this.state.numConsonants) >= lettersRemaining;
        const needsAllVowels = this.state.numVowels < this.props.minVowels
            && (this.props.minVowels - this.state.numVowels) >= lettersRemaining;

        return (
            <div className="screen__actions">
                <Button
                    text="Consonant"
                    enabled={this.state.letters.length < this.props.maxLetters && !needsAllVowels}
                    onClick={addConsonant}
                />
                <Button
                    text="Vowel"
                    enabled={this.state.letters.length < this.props.maxLetters && !needsAllConsonants}
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
        this.setState({
            state: GameState.Revealed,
        });
    }

    private addLetter(isConsonant: boolean) {
        let letter: string;

        if (isConsonant) {
            this.setState(prevState => {
                const remaining = prevState.consonantsAvailable.slice();
                letter = remaining.shift() as string;
                return {
                    consonantsAvailable: remaining,
                    numConsonants: prevState.numConsonants + 1,
                };
            });
        }
        else {
            this.setState(prevState => {
                const remaining = prevState.vowelsAvailable.slice();
                letter = remaining.shift() as string;
                return {
                    numVowels: prevState.numVowels + 1,
                    vowelsAvailable: remaining,
                };
            });
        }

        this.setState(prevState => {
            const allLetters = prevState.letters.slice();
            allLetters.push(letter);
            return {
                letters: allLetters,
            };
        });
    }

    private startGame() {
        this.worker = new Worker(workerScript);

        this.worker.onmessage = (m) => {
            const data = m.data as string[];
            this.setState({
                solutions: data,
            });
        };
        
        this.worker.postMessage(['calculate', this.state.letters]);

        this.setState({ state: GameState.Active });
        this.timerID = window.setInterval(() => this.tick(), 1000);
    }

    private tick() {
        this.setState(prevState => {
            const secsRemaining = prevState.timeLeft - 1;
            const finished = secsRemaining === 0;

            if (finished) {        
                if (this.state.solutions.length === 0) {
                    this.worker.postMessage(['respond', []]);
                }

                window.clearInterval(this.timerID);
            }

            return {
                state: finished ? GameState.Finished : GameState.Active,
                timeLeft: secsRemaining,
            };
        })
    }
}
