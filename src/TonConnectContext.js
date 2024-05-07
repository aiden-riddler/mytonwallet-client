// TonConnectContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';

const baseDappUrl = process.env.REACT_APP_DAPP_URL;
const TonConnectContext = createContext(null);

export const useTonConnect = () => useContext(TonConnectContext);

export const TonConnectProvider = ({ children }) => {
  const wallet = useTonWallet();
  const [tonConnectUI, setTonConnectUIOptions] = useTonConnectUI();
  const [currentWallet, setCurrentWallet] = useState(null);

  useEffect(() => {
    if (tonConnectUI) {
      const openWalletModal = async () => {
        if (wallet){
          setCurrentWallet(wallet);
        }
      };

      openWalletModal();
    }
  }, [tonConnectUI]);

  const connectWallet = async () => {
    try {
      await tonConnectUI.openSingleWalletModal('mytonwallet');
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
