import * as React from 'react';
import { Button } from './Button';
import { Clock } from './Clock';
import { musicStartPosition } from './Constants';
import { delay } from './Delay';
import { ILettersGameSettings } from './GameSettings';
import { GameState } from './GameState';
import { preventRepeats, shuffle } from './Random';
import './Screen.css';
import './Solution.css';
import { speak } from './Speech';
import { TileSet } from './TileSet';

interface ILettersGameProps {
    settings: ILettersGameSettings;
    endGame: () => void;
    audio: HTMLAudioElement;
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
            consonantsAvailable: preventRepeats(shuffle(this.props.settings.consonants.slice()), 0.5),
            letters: [],
            numConsonants: 0,
            numVowels: 0,
            solutions: [],
            state: GameState.Setup,
            timeLeft: 30,
            vowelsAvailable: preventRepeats(shuffle(this.props.settings.vowels.slice()), 0.5),
        };
    }
    
    public componentDidUpdate(prevProps: ILettersGameProps, prevState: ILettersGameState) {
        if (this.state.state === GameState.Active && prevState.state !== GameState.Active) {
            this.startGame(); // had to wait til all the letters are in the state, or it calculated without the last one
        }
    }

    public render() {
        const clock = this.state.state === GameState.Active ? <Clock time={this.state.timeLeft} /> : undefined;

        let screenClasses = 'screen screen--letters';

        let buttonsEtc: JSX.Element | undefined;
        switch (this.state.state) {
            case GameState.Setup:
            case GameState.Paused:
                screenClasses += ' screen--setup';
                buttonsEtc = this.renderSetup();
                break;
            case GameState.Active:
                screenClasses += ' screen--active';
                break;
            case GameState.Finished:
                screenClasses += ' screen--finished';
                buttonsEtc = this.renderFinished(false);
                break;
            case GameState.Revealed:
                screenClasses += ' screen--finished';
                buttonsEtc = this.renderFinished(true);
                break;
        }

        return (
            <div className={screenClasses}>
                {clock}
                <TileSet text={this.state.letters} size={this.props.settings.minLetters} />
                {buttonsEtc}
            </div>
        );
    }

    private renderSetup() {
        const addConsonant = () => this.addLetter(true);
        const addVowel = () => this.addLetter(false);
        const startGame = () => {
            this.setState({
                state: GameState.Active,
            });
        };

        const lettersRemaining = this.props.settings.minLetters - this.state.letters.length;
        const needsAllConsonants = this.state.numConsonants < this.props.settings.minConsonants
            && (this.props.settings.minConsonants - this.state.numConsonants) >= lettersRemaining;
        const needsAllVowels = this.state.numVowels < this.props.settings.minVowels
            && (this.props.settings.minVowels - this.state.numVowels) >= lettersRemaining;

        const startButton = lettersRemaining > 0 || this.state.state !== GameState.Setup
            ? undefined
            : (
                <Button
                    text="Start game"
                    enabled={true}
                    onClick={startGame}
                />
            )

        return (
            <div className="screen__actions">
                <Button
                    text="Consonant"
                    enabled={this.state.letters.length < this.props.settings.maxLetters && !needsAllVowels}
                    onClick={addConsonant}
                />
                <Button
                    text="Vowel"
                    enabled={this.state.letters.length < this.props.settings.maxLetters && !needsAllConsonants}
                    onClick={addVowel}
                />
                {startButton}
            </div>
        );
    }

    private renderFinished(showSolutions: boolean) {
        const endGame = () => this.props.endGame();
        const revealSolutions = () => this.showSolutions();

        const solutions = showSolutions
            ? (
                <div className="solution">
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
            <div className="solution__value" key={index}>
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
                speak(letter);
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
                speak(letter);
                return {
                    numVowels: prevState.numVowels + 1,
                    vowelsAvailable: remaining,
                };
            });
        }

        this.setState(prevState => {
            const allLetters = prevState.letters.slice();
            allLetters.push(letter);

            if (allLetters.length >= this.props.settings.maxLetters) {
                return {
                    letters: allLetters,
                    state: GameState.Active,
                };
            }

            return {
                letters: allLetters,
                state: prevState.state,
            };
        });
    }

    private async startGame() {
        this.worker = new Worker(new URL('./LettersWorker.ts', import.meta.url));

        this.worker.onmessage = (m) => {
            const data = m.data as string[];
            this.setState({
                solutions: data,
            });
        };
        
        this.worker.postMessage(['calculate', this.state.letters.join('')]);

        await delay(1500);

        this.props.audio.currentTime = musicStartPosition;
        this.props.audio.play();
        
        this.timerID = window.setInterval(() => this.tick(), 1000);
    }

    private tick() {
        this.setState(prevState => {
            const secsRemaining = prevState.timeLeft - 1;
            const finished = secsRemaining === -1;

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
