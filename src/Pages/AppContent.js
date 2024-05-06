import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { useTonAddress } from '@tonconnect/ui-react';
// import { useTonWallet } from '@tonconnect/ui-react';
import Layout from './Layout';
import GiveAways from './Giveaways';
import GiveawayDetails from './Giveaway';
import NoPage from './NoPage';
import CheckinComponent from './Checkin';
import CompleteTaskComponent from './CompleteTask';

function AppContent() {
  // const userFriendlyAddress = useTonAddress();
  // const rawAddress = useTonAddress(false);
  // const wallet = useTonWallet();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route path="/giveaways" element={<GiveAways /> }></Route>
        <Route path="/giveaways/:giveawayId" element={<GiveawayDetails /> }></Route>
        <Route path="/giveaways/:giveawayId/complete-task" element={<CompleteTaskComponent /> }></Route>
        <Route path="/:giveawayId" element={<CheckinComponent /> }></Route>
        <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppContent;
