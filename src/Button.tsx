import * as React from 'react';
import './Button.css';

interface IButtonProps {
    text: string;
    enabled: boolean;
    onClick: () => void;
}

export class Button extends React.PureComponent<IButtonProps, {}> {
    public render() {
        return (
            <button disabled={!this.props.enabled} onClick={this.props.onClick}>
                {this.props.text}
            </button>
        );
    }
}