export const enum AppScreen {
    Welcome,
    Settings,
    About,
    Game,
    Interlude,
}

export const enum Game {
    Letters = 0,
    Numbers = 1,
    Conundrum = 2,
}

export const enum Sequence {
    GameSequence = 3,
}

export type GameOrSequence = Game | Sequence;