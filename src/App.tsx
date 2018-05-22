import * as React from 'react';
import { About } from './About';
import { Conundrum, IConundrumSettings } from './Conundrum';
import { defaultConundrumSettings, defaultGameSequence, defaultLettersSettings, defaultNumbersSettings, GameConfiguration } from './GameConfiguration';
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
    lettersSettings: ILettersGameSettings;
    numbersSettings: INumbersGameSettings;
    conundrumSettings: IConundrumSettings;
    sequenceSettings: GameConfiguration[];
}

class App extends React.PureComponent<{}, IAppState> {
    private audio: HTMLAudioElement;

    constructor(props: {}) {
        super(props);

        // TODO: letters should be weighted as per scrabble
        // TODO: letters game needs min 3 vowels and min 4 consonants. Store these values in app the state.
        this.state = {
            conundrumSettings: defaultConundrumSettings,
            currentScreen: AppScreen.Welcome,
            lettersSettings: defaultLettersSettings,
            numbersSettings: defaultNumbersSettings,
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
        const setLetters = (settings: ILettersGameSettings) => this.setLettersGameSettings(settings);
        const setNumbers = (settings: INumbersGameSettings) => this.setNumbersGameSettings(settings);
        const setConundrum = (settings: IConundrumSettings) => this.setConundrumSettings(settings);

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
                    />
                );
            case AppScreen.About:
                return <About key="screen" goBack={nextScreen} />;
            case AppScreen.Letters:
                return (
                    <LettersGame
                        key="screen"
                        settings={this.state.lettersSettings}
                        endGame={nextScreen}
                        audio={this.audio}
                    />
                );
            case AppScreen.Numbers:
                return (
                    <NumbersGame
                        key="screen"
                        settings={this.state.numbersSettings}
                        endGame={nextScreen}
                        audio={this.audio}
                    />
                );
            case AppScreen.Conundrum:
                return (
                    <Conundrum
                        key="screen"
                        settings={this.state.conundrumSettings}
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

    private setLettersGameSettings(settings: ILettersGameSettings) {
        this.setState({
            lettersSettings: settings,
        });
    }

    private setNumbersGameSettings(settings: INumbersGameSettings) {
        this.setState({
            numbersSettings: settings,
        });
    }

    private setConundrumSettings(settings: IConundrumSettings) {
        this.setState({
            conundrumSettings: settings,
        });
    }
}

export default App;
