// TonConnectContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { TonConnectUI } from '@tonconnect/ui';

const baseDappUrl = process.env.REACT_APP_DAPP_URL;
const TonConnectContext = createContext(null);

export const useTonConnect = () => useContext(TonConnectContext);

export const TonConnectProvider = ({ children }) => {
  const [tonConnectUI, setTonConnectUI] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);

  useEffect(() => {
    if (!customElements.get('tc-root')) {
      const tcu = new TonConnectUI({
        manifestUrl: `${baseDappUrl}/tonconnect-manifest.json`,
      });
      setTonConnectUI(tcu);
      
      // Set up subscription to connection status changes
      const unsubscribe = tcu.onStatusChange((walletAndWalletInfo) => {
        console.log("Status change detected:", walletAndWalletInfo);
        setCurrentWallet(walletAndWalletInfo.wallet);
      });

      // Cleanup function to unsubscribe when the component unmounts
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    try {
        await tonConnectUI.openSingleWalletModal('mytonwallet');
        setCurrentWallet(tonConnectUI.wallet);
        console.error("Wallet Connected", tonConnectUI.wallet);
      } catch (error) {
        console.error("Error connecting wallet", error);
      }
  };

  const updateCurrentWallet = (wallet) => {
    setCurrentWallet(wallet);
  };

  const disconnectCurrentWallet = async () => {
    await tonConnectUI.disconnect();
    setCurrentWallet(null);
  };

  const value = {
    tonConnectUI,
    currentWallet,
    connectWallet,
    updateCurrentWallet,
    disconnectCurrentWallet
  };

  return (
    <TonConnectContext.Provider value={value}>
      {children}
    </TonConnectContext.Provider>
  );
};
