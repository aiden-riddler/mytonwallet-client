import './App.css';
import AppContent from './Pages/AppContent';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TonConnectProvider } from './TonConnectContext';

const baseDappUrl = process.env.REACT_APP_DAPP_URL;

function App() {
  return (
    <TonConnectUIProvider manifestUrl={`${baseDappUrl}/tonconnect-manifest.json`}>
        <TonConnectProvider>
        <AppContent />

        </TonConnectProvider>
        </TonConnectUIProvider>
    
  );
}

export default App;
