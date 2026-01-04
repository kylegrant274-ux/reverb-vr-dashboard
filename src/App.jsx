import React, { useState } from 'react';
import { Send, Wallet, TrendingUp, Users, Settings, Home } from 'lucide-react';

export default function Dashboard() {
  const [page, setPage] = useState('home');
  const [playerId, setPlayerId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSend = async () => {
    if (!playerId || !amount) {
      setResponseMessage('❌ Please fill in Player ID and amount');
      return;
    }
    
    setResponseMessage('⏳ Sending...');
    
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
      console.log('Response:', data);

      if (data.success) {
        const newTransaction = {
          id: transactions.length + 1,
          player: playerId,
          amount: parseInt(amount),
          reason: reason || 'Manual grant',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
        
        setTransactions([newTransaction, ...transactions]);
        setPlayerId('');
        setAmount('');
        setReason('');
        setResponseMessage(`✅ Sent ${amount} RB to ${playerId}!`);
      } else {
        setResponseMessage(`❌ Error: ${data.error || JSON.stringify(data)}`);
      }
    } catch (error) {
      setResponseMessage(`❌ Error: ${error.message}`);
    }
  };

  const totalRB = transactions.reduce((sum, t) => sum + t.amount, 0);

  const clearData = () => {
    if (window.confirm('Clear all transactions?')) {
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 border-b border-blue-500/30 z-50">
        <div className="px-8 py-6 flex flex-col items-center justify-center gap-6 relative">
          <h1 className="text-3xl font-bold text-blue-400">Reverb Admin</h1>
          
          <div className="flex gap-8 items-center w-full justify-center">
            <nav className="flex gap-8">
              <button
                onClick={() => setPage('home')}
                className={`text-lg font-semibold transition-all ${
                  page === 'home' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-300'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => setPage('reverbucks')}
                className={`text-lg font-semibold transition-all ${
                  page === 'reverbucks' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-300'
                }`}
              >
                Reverbucks
              </button>

              <button
                onClick={() => setPage('players')}
                className={`text-lg font-semibold transition-all ${
                  page === 'players' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-300'
                }`}
              >
                Players
              </button>

              <button
                onClick={() => setPage('analytics')}
                className={`text-lg font-semibold transition-all ${
                  page === 'analytics' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-300'
                }`}
              >
                Analytics
              </button>

              <button
                onClick={() => setPage('events')}
                className={`text-lg font-semibold transition-all ${
                  page === 'events' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-300'
                }`}
              >
                Events
              </button>
            </nav>

            <button
              onClick={() => setPage('settings')}
              className="absolute right-8 text-blue-400 hover:text-blue-300 transition-all"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-36 p-8">
        {/* Home Page */}
        {page === 'home' && (
          <div>
            <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm mb-1">Total Reverbucks Sent</p>
                    <p className="text-4xl font-bold text-white">{totalRB.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-blue-400" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm mb-1">Total Transactions</p>
                    <p className="text-4xl font-bold text-white">{transactions.length}</p>
                  </div>
                  <Send className="w-10 h-10 text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm mb-1">Active Players</p>
                    <p className="text-4xl font-bold text-white">{new Set(transactions.map(t => t.player)).size}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reverbucks Page */}
        {page === 'reverbucks' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-white">Reverbucks Manager</h1>
              <button
                onClick={clearData}
                className="bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 rounded px-4 py-2 transition-colors"
              >
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Send Reverbucks</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-blue-300 text-sm mb-2">Player ID</label>
                      <input
                        type="text"
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        placeholder="Player ID"
                        className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-300 text-sm mb-2">Amount (RB)</label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="500"
                        className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-300 text-sm mb-2">Reason</label>
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Event reward"
                        className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      onClick={handleSend}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-2 px-4 rounded transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>

                    {responseMessage && (
                      <div className="text-sm text-blue-300 mt-4 p-3 bg-blue-900/30 rounded border border-blue-500/30">
                        {responseMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {transactions.length === 0 ? (
                      <p className="text-blue-300">No transactions yet</p>
                    ) : (
                      transactions.map((t) => (
                        <div key={t.id} className="bg-blue-900/20 border border-blue-500/20 rounded p-3 flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">{t.player}</p>
                            <p className="text-blue-300 text-sm">{t.reason}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-bold">+{t.amount} RB</p>
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
        )}

        {/* Settings Page */}
        {page === 'settings' && (
          <div>
            <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
            
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6 max-w-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Game Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-300 text-sm mb-2">Game Name</label>
                  <input
                    type="text"
                    defaultValue="Reverb"
                    className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-blue-300 text-sm mb-2">API Key</label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white"
                  />
                </div>

                <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-2 px-4 rounded transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Players Page */}
        {page === 'players' && (
          <div>
            <h1 className="text-4xl font-bold text-white mb-8">Players</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">Total Players</p>
                <p className="text-3xl font-bold text-white">1,254</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">Active Today</p>
                <p className="text-3xl font-bold text-white">342</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">New Players</p>
                <p className="text-3xl font-bold text-white">45</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm">Avg Session</p>
                <p className="text-3xl font-bold text-white">32m</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300 pb-3 border-b border-blue-500/20">
                  <span>Player234 logged in</span>
                  <span className="text-blue-300">2 min ago</span>
                </div>
                <div className="flex justify-between text-gray-300 pb-3 border-b border-blue-500/20">
                  <span>Player891 completed level 5</span>
                  <span className="text-blue-300">15 min ago</span>
                </div>
                <div className="flex justify-between text-gray-300 pb-3 border-b border-blue-500/20">
                  <span>Player567 purchased item</span>
                  <span className="text-blue-300">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Page */}
        {page === 'analytics' && (
          <div>
            <h1 className="text-4xl font-bold text-white mb-8">Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Daily Active Users</h3>
                <div className="h-40 flex items-end justify-around gap-2">
                  {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                    <div key={i} className="bg-gradient-to-t from-blue-600 to-blue-400 rounded" style={{height: `${h}%`, width: '20px'}}></div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">Last 7 days</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Revenue</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Reverbucks Sales</span>
                    <span className="text-blue-400 font-bold">$2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Battle Pass</span>
                    <span className="text-blue-400 font-bold">$890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Premium Items</span>
                    <span className="text-blue-400 font-bold">$1,230</span>
                  </div>
                  <div className="border-t border-blue-500/30 pt-3 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-blue-400 font-bold">$4,570</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Page */}
        {page === 'events' && (
          <div>
            <h1 className="text-4xl font-bold text-white mb-8">Events</h1>
            
            <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-2 px-6 rounded mb-6">
              Create Event
            </button>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">Summer Event</h3>
                    <p className="text-gray-400 text-sm mt-1">Double Reverbucks Weekend</p>
                  </div>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-sm">Active</span>
                </div>
                <p className="text-blue-300 text-sm mt-4">Ends in 3 days • 45,230 participants</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">Halloween Cosmetics</h3>
                    <p className="text-gray-400 text-sm mt-1">Limited cosmetic shop</p>
                  </div>
                  <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded text-sm">Scheduled</span>
                </div>
                <p className="text-blue-300 text-sm mt-4">Starts in 5 days • Expected: 12,000 participants</p>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">Spring Blast</h3>
                    <p className="text-gray-400 text-sm mt-1">Free skin giveaway</p>
                  </div>
                  <span className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded text-sm">Ended</span>
                </div>
                <p className="text-blue-300 text-sm mt-4">Ended 2 days ago • 89,450 participants</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}