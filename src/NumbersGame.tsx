import * as React from 'react';
import Worker from 'worker-loader!./NumbersWorker';
import { Button } from './Button';
import { Clock } from './Clock';
import { musicStartPosition } from './Constants';
import { delay } from './Delay';
import { INumbersGameSettings } from './GameSettings';
import { GameState } from './GameState';
import { randomInt, shuffle } from './Random';
import './Screen.css';
import './Solution.css';
import { speak } from './Speech';
import './Target.css';
import { TileSet } from './TileSet';

interface INumbersGameProps {
    settings: INumbersGameSettings;
    endGame: () => void;
    audio: HTMLAudioElement;
}

interface INumbersGameState {
    state: GameState;
    numbers: number[];
    target: number;
    timeLeft: number;
    solutionValue?: number;
    solution?: string;
    hasChosen: boolean;
}

export class NumbersGame extends React.PureComponent<INumbersGameProps, INumbersGameState> {
    private timerID: number;
    private worker: Worker;

    constructor(props: INumbersGameProps) {
        super(props);

        this.state = {
            hasChosen: false,
            numbers: [],
            state: GameState.Setup,
            target: 0,
            timeLeft: 30,
        };
    }
    
    public render() {
        const clock = this.state.state === GameState.Active ? <Clock time={this.state.timeLeft} /> : undefined;
        
        let screenClasses = 'screen screen--numbers';

        let buttonsEtc: JSX.Element | undefined;
        switch (this.state.state) {
            case GameState.Setup:
                screenClasses += ' screen--setup'
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

        const target = this.state.target === 0
            ? undefined
            : <div className="target">{this.state.target}</div>;

        return (
            <div className={screenClasses}>
                {clock}
                {target}
                <TileSet text={this.state.numbers.map(n => n.toString())} size={this.props.settings.numberCount} />
                {buttonsEtc}
            </div>
        );
    }

    private renderSetup() {
        const buttons: JSX.Element[] = [];
        for (let i = 0 ; i <= this.props.settings.bigNumbers.length; i++) {
            const text = i === 1 ? '1 big number' : `${i} big numbers`;
            const action = () => this.chooseNumbers(i);
            
            buttons.push((
                <Button
                    text={text}
                    enabled={!this.state.hasChosen}
                    onClick={action}
                    key={i}
                    className="button--short" />
                )
            );
        }

        return (
            <div className="screen__actions">
                {buttons}
            </div>
        );
    }

    private renderFinished(showSolutions: boolean) {
        const endGame = () => this.props.endGame();
        const revealSolution = () => this.showSolutions();

        const solution = showSolutions
            ? this.renderSolution()
            : <Button text="Show solution" enabled={true} onClick={revealSolution} />;

        return (
            <div className="screen__actions">
                {solution}
                <Button text="End game" enabled={true} onClick={endGame} />
            </div>
        );
    }

    private renderSolution() {
        return (
            <div className="solution">
                <div className="solution__value">{this.state.solutionValue}</div>
                <div className="solution__working">{this.state.solution}</div>
            </div>
        );
    }

    private showSolutions() {
        this.setState({
            state: GameState.Revealed,
        });
    }

    private async chooseNumbers(numBig: number) {
        this.setState({
            hasChosen: true,
        });

        const big = shuffle(this.props.settings.bigNumbers.slice());
        const small = shuffle(this.props.settings.smallNumbers.slice());

        let numAdded = 0;
        const numSmall = this.props.settings.numberCount - numBig;
        
        for (numAdded=0; numAdded<numSmall; numAdded++) {
            await delay(1250);
            this.addNumber(small.shift() as number);
        }

        for (numAdded; numAdded<this.props.settings.numberCount; numAdded++) {
            await delay(1250);
            this.addNumber(big.shift() as number);
        }

        const targetValue = randomInt(this.props.settings.minTarget, this.props.settings.maxTarget + 1);
        speak('and your target is', true);
        speak(targetValue.toString(), false);

        await delay(2000);

        this.setState({
            target: targetValue,
        });

        this.worker = new Worker();

        this.worker.onmessage = (m) => {
            const data = m.data as [number, string];
            this.setState({
                solution: data[1],
                solutionValue: data[0],
            });
        };
        
        this.worker.postMessage(['calculate', targetValue, this.state.numbers]);

        await delay(2000);

        this.startGame();
    }

    private addNumber(num: number) {
        speak(num.toString(), true);

        this.setState(prevState => {
            const allNumbers = prevState.numbers.slice();
            allNumbers.push(num);
            return {
                numbers: allNumbers,
            };
        })
    }

    private startGame() {
        this.props.audio.currentTime = musicStartPosition;
        this.props.audio.play();
        
        this.setState({ state: GameState.Active });
        this.timerID = window.setInterval(() => this.tick(), 1000);
    }

    private tick() {
        this.setState(prevState => {
            const secsRemaining = prevState.timeLeft - 1;
            const finished = secsRemaining === -1;

            if (finished) {
                if (this.state.solutionValue === undefined) {
                    this.worker.postMessage(['respond', 0, []]); // demand the best solution now
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
