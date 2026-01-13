import React, { useState } from 'react';
import WalletBalance from '../components/wallet/WalletBalance';
import TransactionHistory from '../components/wallet/TransactionHistory';
import RedeemModal from '../components/wallet/RedeemModal';
import { walletAPI } from '../api/wallet.api';

const WalletPage = () => {
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRedeemSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8">My Wallet</h1>

        {/* Wallet Balance Card */}
        <div className="mb-8">
          <WalletBalance
            key={refreshKey}
            onRedeemClick={() => setIsRedeemModalOpen(true)}
          />
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <TransactionHistory key={refreshKey} />
        </div>
      </div>

      {/* Redeem Modal */}
      <RedeemModal
        isOpen={isRedeemModalOpen}
        onClose={() => setIsRedeemModalOpen(false)}
        currentBalance={balance}
        onRedeemSuccess={handleRedeemSuccess}
      />
    </div>
  );
};

export default WalletPage;