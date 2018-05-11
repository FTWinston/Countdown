import * as React from 'react';

interface IInterludeProps {
    endGame: () => void;
}

export class Interlude extends React.PureComponent<IInterludeProps, {}> {
    public render() {
        return <div className="screen screen--interlude" />;
    }

    public componentDidMount() {
        window.setTimeout(() => this.props.endGame(), 1000);
    }
}
