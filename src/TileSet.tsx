import * as React from 'react';
import { Tile } from './Tile';
import './TileSet.css';

interface ITileSetProps {
    text: string[];
    size?: number;
}

export class TileSet extends React.PureComponent<ITileSetProps, {}> {
    public render() {
        const tiles = this.props.text.slice();
        if (this.props.size !== undefined) {
            while (this.props.size > tiles.length) {
                tiles.push('');
            }
        }

        return (
            <div className={`tileset tileset--size${tiles.length}`}>
                {tiles.map((text, idx) => <Tile text={text} key={idx} />)}
            </div>
        );
    }
}