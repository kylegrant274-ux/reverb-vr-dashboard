import React, { useState, useEffect } from 'react';
import { Send, Wallet, TrendingUp, Users } from 'lucide-react';

export default function ReverbucksDashboard() {
  const [playerId, setPlayerId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Load transactions on mount
  useEffect(() => {
    // Transactions loaded
  }, []);

  // Save transactions (local only)
  const saveTransactions = async (newTransactions) => {
    // Transaction is saved in state
  };

  const handleSend = async () => {
    if (!playerId || !amount) {
      alert('Please fill in Player ID and amount');
      return;
    }
    
    try {
      const response = await fetch('/api/add-reverbucks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: playerId,
          amount: parseInt(amount),
          reason: reason || 'Manual grant'
        })
      });

      const data = await response.json();

      if (data.success) {
        const newTransaction = {
          id: transactions.length + 1,
          player: playerId,
          amount: parseInt(amount),
          reason: reason || 'Manual grant',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
        
        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        saveTransactions(updatedTransactions);
        setPlayerId('');
        setAmount('');
        setReason('');
        alert(`✓ Sent ${amount} RB to ${playerId}!`);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const totalRB = transactions.reduce((sum, t) => sum + t.amount, 0);

  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all transactions?')) {
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Wallet className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl font-bold text-white">Reverbucks Manager</h1>
            </div>
            <button
              onClick={clearData}
              className="text-sm bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded px-3 py-1 transition-colors"
            >
              Clear Data
            </button>
          </div>
          <p className="text-purple-300">Distribute in-game currency to your players</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Total Distributed</p>
                <p className="text-3xl font-bold text-white">{totalRB.toLocaleString()} RB</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Transactions</p>
                <p className="text-3xl font-bold text-white">{transactions.length}</p>
              </div>
              <Send className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm mb-1">Active Players</p>
                <p className="text-3xl font-bold text-white">{new Set(transactions.map(t => t.player)).size}</p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Send Currency Form */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Send Reverbucks</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-300 text-sm mb-2">Player ID</label>
                  <input
                    type="text"
                    value={playerId}
                    onChange={(e) => setPlayerId(e.target.value)}
                    placeholder="e.g., Player123"
                    className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 text-sm mb-2">Amount (RB)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="500"
                    className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-purple-300 text-sm mb-2">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g., Event reward"
                    className="w-full bg-slate-700 border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={handleSend}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-2 px-4 rounded transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Reverbucks
                </button>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <p className="text-purple-300">No transactions yet</p>
                ) : (
                  transactions.map((t) => (
                    <div key={t.id} className="bg-slate-700/50 border border-purple-500/20 rounded p-3 flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{t.player}</p>
                        <p className="text-purple-300 text-sm">{t.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 font-bold">+{t.amount} RB</p>
                        <p className="text-gray-400 text-sm">{t.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}