import * as React from 'react';
import './Button.css';

interface IButtonProps {
    text: string;
    enabled: boolean;
    onClick?: () => void;
    className?: string;
}

export const Button: React.FC<IButtonProps> = props => {
    return (
        <button disabled={!props.enabled} onClick={props.onClick} className={props.className}>
            {props.text}
        </button>
    );
}