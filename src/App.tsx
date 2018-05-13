import * as React from 'react';
import { Conundrum } from './Conundrum';
import { Interlude } from './Interlude';
import { LettersGame } from './LettersGame';
import { NumbersGame } from './NumbersGame';
import { Welcome } from './Welcome';

const enum AppScreen {
    Welcome,
    Setup,
    Letters,
    Numbers,
    Conundrum,
    Interlude,
}

interface IAppState {
    currentScreen: AppScreen;
    screenQueue: AppScreen[];
    minLetters: number;
    maxLetters: number;
    minConsonants: number;
    minVowels: number;
    consonants: string[];
    vowels: string[];
    smallNumbers: number[];
    bigNumbers: number[];
    numberCount: number;
    minTarget: number;
    maxTarget: number;
    conundrumSize: number;
}

class App extends React.PureComponent<{}, IAppState> {
    private audio: HTMLAudioElement;

    constructor(props: {}) {
        super(props);

        // TODO: letters should be weighted as per scrabble
        // TODO: letters game needs min 3 vowels and min 4 consonants. Store these values in app the state.
        this.state = {
            bigNumbers: [25, 50, 75, 100],
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
            conundrumSize: 9,
            currentScreen: AppScreen.Welcome,
            maxLetters: 9,
            maxTarget: 999,
            minConsonants: 4,
            minLetters: 9,
            minTarget: 101,
            minVowels: 3,
            numberCount: 6,
            screenQueue: [],
            smallNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            vowels: [
                'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
                'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
                'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I',
                'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
                'U', 'U', 'U', 'U', 'U',
            ],
        };
    }

    public render() {
        return [
            this.renderAudio(),
            this.renderScreen(),
        ];
    }

    private renderScreen() {
        const nextScreen = () => this.advanceToNextScreen();
        const selectLetters = () => this.startLetters();
        const selectNumbers = () => this.startNumbers();
        const selectConundrum = () => this.startConundrum();
        const selectFullShow = () => this.startFullShow();
        
        switch (this.state.currentScreen) {
            case AppScreen.Interlude:
                return <Interlude endGame={nextScreen} />;
            case AppScreen.Setup:
                return <div>No configuration currently available</div>;
            case AppScreen.Letters:
                return (
                    <LettersGame
                        minLetters={this.state.minLetters}
                        maxLetters={this.state.maxLetters}
                        minConsonants={this.state.minConsonants}
                        minVowels={this.state.minVowels}
                        consonants={this.state.consonants}
                        vowels={this.state.vowels}
                        endGame={nextScreen}
                        audio={this.audio}
                    />
                );
            case AppScreen.Numbers:
                return (
                    <NumbersGame
                        numberCount={this.state.numberCount}
                        minTarget={this.state.minTarget}
                        maxTarget={this.state.maxTarget}
                        smallNumbers={this.state.smallNumbers}
                        bigNumbers={this.state.bigNumbers}
                        endGame={nextScreen}
                        audio={this.audio}
                    />
                );
            case AppScreen.Conundrum:
                return (
                    <Conundrum
                        numLetters={this.state.conundrumSize}
                        endGame={nextScreen}
                        audio={this.audio}
                />
            );
            default:
                return (
                    <Welcome selectLetters={selectLetters}
                        selectNumbers={selectNumbers}
                        selectConundrum={selectConundrum}
                        selectFullShow={selectFullShow}
                    />
                );
        }
    }

    private renderAudio() {
        return (
            <audio
                src="countdown.mp3"
                preload="auto"
                key="audio"
                ref={a => { if (a !== null) { this.audio = a; }}}
            />
        )
    }

    private startLetters() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [AppScreen.Letters],
        });
    }

    private startNumbers() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [AppScreen.Numbers],
        });
    }

    private startConundrum() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [AppScreen.Conundrum],
        });
    }

    private startFullShow() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [
                AppScreen.Letters,
                AppScreen.Letters,
                AppScreen.Numbers,
                AppScreen.Letters,
                AppScreen.Letters,
                AppScreen.Numbers,
                AppScreen.Conundrum,
            ],
        });
    }

    private advanceToNextScreen() {
        if (this.state.currentScreen !== AppScreen.Interlude) {
            this.setState({
                currentScreen: AppScreen.Interlude,
            });
            return;
        }

        const queue = this.state.screenQueue.slice();
        let screen: AppScreen;

        if (queue.length === 0) {
            screen = AppScreen.Welcome;
        }
        else {
            screen = queue.shift() as AppScreen;
        }

        this.setState({
            currentScreen: screen,
            screenQueue: queue,
        })
    }
}

export default App;
