import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
registerServiceWorker();
