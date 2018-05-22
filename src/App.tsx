import * as React from 'react';
import { About } from './About';
import { defaultSettingsName } from './Constants';
import { Conundrum, IConundrumSettings } from './Conundrum';
import { defaultConundrumSettings, defaultGameSequence, defaultLettersSettings, defaultNumbersSettings, GameSettings } from './GameSettings';
import { Interlude } from './Interlude';
import { ILettersGameSettings, LettersGame } from './LettersGame';
import { INumbersGameSettings, NumbersGame } from './NumbersGame';
import { Settings } from './Settings';
import { Welcome } from './Welcome';

const enum AppScreen {
    Welcome,
    Settings,
    About,
    Letters,
    Numbers,
    Conundrum,
    Interlude,
}

interface IAppState {
    currentScreen: AppScreen;
    screenQueue: AppScreen[];
    lettersSettings: [string, ILettersGameSettings];
    numbersSettings: [string, INumbersGameSettings];
    conundrumSettings: [string, IConundrumSettings];
    sequenceSettings: GameSettings[];
}

class App extends React.PureComponent<{}, IAppState> {
    private audio: HTMLAudioElement;

    constructor(props: {}) {
        super(props);

        // TODO: letters should be weighted as per scrabble
        // TODO: letters game needs min 3 vowels and min 4 consonants. Store these values in app the state.
        this.state = {
            conundrumSettings: [defaultSettingsName, defaultConundrumSettings],
            currentScreen: AppScreen.Welcome,
            lettersSettings: [defaultSettingsName, defaultLettersSettings],
            numbersSettings: [defaultSettingsName, defaultNumbersSettings],
            screenQueue: [],
            sequenceSettings: defaultGameSequence,
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
        const selectAbout = () => this.showAboutScreen();
        const selectSettings = () => this.showSettingsScreen();
        const setLetters = (name: string, settings: ILettersGameSettings) => this.setLettersGameSettings(name, settings);
        const setNumbers = (name: string, settings: INumbersGameSettings) => this.setNumbersGameSettings(name, settings);
        const setConundrum = (name: string, settings: IConundrumSettings) => this.setConundrumSettings(name, settings);

        switch (this.state.currentScreen) {
            case AppScreen.Interlude:
                return <Interlude endGame={nextScreen} key="screen" />;
            case AppScreen.Settings:
                return (
                    <Settings
                        key="screen"
                        setLettersSettings={setLetters}
                        setNumbersSettings={setNumbers}
                        setConundrumSettings={setConundrum}
                        goBack={nextScreen}
                    />
                );
            case AppScreen.About:
                return <About key="screen" goBack={nextScreen} />;
            case AppScreen.Letters:
                return (
                    <LettersGame
                        key="screen"
                        settings={this.state.lettersSettings[1]}
                        endGame={nextScreen}
                        audio={this.audio}
                    />
                );
            case AppScreen.Numbers:
                return (
                    <NumbersGame
                        key="screen"
                        settings={this.state.numbersSettings[1]}
                        endGame={nextScreen}
                        audio={this.audio}
                    />
                );
            case AppScreen.Conundrum:
                return (
                    <Conundrum
                        key="screen"
                        settings={this.state.conundrumSettings[1]}
                        endGame={nextScreen}
                        audio={this.audio}
                />
            );
            default:
                return (
                    <Welcome
                        key="screen"
                        selectLetters={selectLetters}
                        selectNumbers={selectNumbers}
                        selectConundrum={selectConundrum}
                        selectFullShow={selectFullShow}
                        selectAbout={selectAbout}
                        selectSettings={selectSettings}
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

    private showAboutScreen() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [AppScreen.About],
        });
    }

    private showSettingsScreen() {
        this.setState({
            currentScreen: AppScreen.Interlude,
            screenQueue: [AppScreen.Settings],
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

    private setLettersGameSettings(name: string, settings: ILettersGameSettings) {
        this.setState({
            lettersSettings: [name, settings],
        });
    }

    private setNumbersGameSettings(name: string, settings: INumbersGameSettings) {
        this.setState({
            numbersSettings: [name, settings],
        });
    }

    private setConundrumSettings(name: string, settings: IConundrumSettings) {
        this.setState({
            conundrumSettings: [name, settings],
        });
    }
}

export default App;
