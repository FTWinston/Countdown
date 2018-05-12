import * as React from 'react';
import './Clock.css';

interface IClockProps {
    time: number;
}

interface IClockState {
    width: number;
    height: number;
}

export class Clock extends React.PureComponent<IClockProps, IClockState> {
    private root: HTMLElement;
    private ctx: CanvasRenderingContext2D;
    private resizeListener?: () => void;

    constructor(props: IClockProps) {
        super(props);

        this.state = {
            height: 0,
            width: 0,
        };
    }

    public render() {
        return (
            <div
                className="clock"
                ref={r => { if (r !== null) { this.root = r; }}}
            >
                <canvas
                    className="clock__canvas"
                    ref={c => {if (c !== null) { const ctx = c.getContext('2d'); if (ctx !== null) { this.ctx = ctx; }}}}
                    width={this.state.width}
                    height={this.state.height}
                />
            </div>
        );
    }

    public componentDidMount() {
        this.resizeListener = () => this.updateSize();
        window.addEventListener('resize', this.resizeListener);
        this.updateSize();
    }

    public componentDidUpdate() {
        this.draw();
    }

    public componentWillUnmount() {
        if (this.resizeListener !== undefined) {
            window.removeEventListener('resize', this.resizeListener);
        }
    }
    
    private updateSize() {
        this.setState({
            height: this.root.offsetHeight,
            width: this.root.offsetWidth,
        });
    }

    private draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.state.width, this.state.height);

        const cx = this.state.width / 2;
        const cy = this.state.height / 2;

        ctx.save();
        ctx.translate(cx, cy);

        const r =  Math.min(this.state.width, this.state.height) * 0.45;

        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = '#e1d4c8';
        ctx.strokeStyle = '#0e1b2c';
        ctx.lineWidth = r * 0.075;
        
        ctx.fill();
        ctx.stroke();

        ctx.lineWidth = r * 0.015;
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(0, r);
        ctx.moveTo(-r, 0);
        ctx.lineTo(r, 0);
        ctx.stroke();

        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.9);
        ctx.lineTo(0, -r * 0.6);
        ctx.moveTo(0, r * 0.9);
        ctx.lineTo(0, r * 0.6);
        ctx.stroke();

        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.9);
        ctx.lineTo(0, -r * 0.6);
        ctx.moveTo(0, r * 0.9);
        ctx.lineTo(0, r * 0.6);
        ctx.stroke();

        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.9);
        ctx.lineTo(0, -r * 0.6);
        ctx.moveTo(0, r * 0.9);
        ctx.lineTo(0, r * 0.6);
        ctx.stroke();

        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.9);
        ctx.lineTo(0, -r * 0.6);
        ctx.moveTo(0, r * 0.9);
        ctx.lineTo(0, r * 0.6);
        ctx.stroke();

        ctx.rotate(- Math.PI / 3 - Math.PI * this.props.time / 30);
        ctx.fillStyle = '#0e1b2c';

        ctx.beginPath();
        ctx.moveTo(0, r * 0.05);
        ctx.lineTo(r, r * 0.005);
        ctx.lineTo(r, -r * 0.005);
        ctx.lineTo(0, -r * 0.05);
        ctx.arc(0, 0, r * 0.05, Math.PI / 2, 3 * Math.PI / 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fill();

        ctx.restore();
    }
}