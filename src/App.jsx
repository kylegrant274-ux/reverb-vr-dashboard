import React, { useState } from 'react';
import { Send, Wallet, TrendingUp, Users, Settings } from 'lucide-react';

export default function Dashboard() {
  const [page, setPage] = useState('home');
  const [eventsSubpage, setEventsSubpage] = useState(null);
  
  // Reverbucks state
  const [rbPlayerId, setRbPlayerId] = useState('');
  const [rbAmount, setRbAmount] = useState('');
  const [rbReason, setRbReason] = useState('');
  const [rbAction, setRbAction] = useState('add');
  const [rbTransactions, setRbTransactions] = useState([]);
  const [rbResponseMessage, setRbResponseMessage] = useState('');
  
  // Items state
  const [itemPlayerId, setItemPlayerId] = useState('');
  const [itemId, setItemId] = useState('');
  const [itemAction, setItemAction] = useState('add');
  const [itemTransactions, setItemTransactions] = useState([]);
  const [itemResponseMessage, setItemResponseMessage] = useState('');
  
  // Player search state
  const [playerSearchResults, setPlayerSearchResults] = useState([]);
  const [playerSearchLoading, setPlayerSearchLoading] = useState(false);  const handleSendRB = async () => {
    if (!rbPlayerId || !rbAmount) {
      setRbResponseMessage('❌ Please fill in Player ID and amount');
      return;
    }
    
    setRbResponseMessage('⏳ Sending...');
    
    try {
      const response = await fetch('/api/add-reverbucks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: rbPlayerId,
          amount: parseInt(rbAmount),
          action: rbAction,
          reason: rbReason || 'Manual grant'
        })
      });

      const data = await response.json();

      if (data.success) {
        const newTransaction = {
          id: rbTransactions.length + 1,
          player: rbPlayerId,
          amount: parseInt(rbAmount),
          action: rbAction,
          reason: rbReason || 'Manual grant',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
        
        setRbTransactions([newTransaction, ...rbTransactions]);
        setRbPlayerId('');
        setRbAmount('');
        setRbReason('');
        setRbResponseMessage(`✅ ${rbAction === 'add' ? 'Sent' : 'Removed'} ${rbAmount} RB!`);
      } else {
        setRbResponseMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setRbResponseMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleSendItem = async () => {
    if (!itemPlayerId || !itemId) {
      setItemResponseMessage('❌ Please fill in Player ID and Item ID');
      return;
    }
    
    setItemResponseMessage('⏳ Sending...');
    const sentItemId = itemId;
    
    try {
      const response = await fetch('/api/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId: itemPlayerId,
          itemId: itemId,
          action: itemAction
        })
      });

      const data = await response.json();

      if (data.success) {
        const newTransaction = {
          id: itemTransactions.length + 1,
          player: itemPlayerId,
          itemId: itemId,
          action: itemAction,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };
        
        setItemTransactions([newTransaction, ...itemTransactions]);
        setItemPlayerId('');
        setItemId('');
        setItemResponseMessage(`✅ ${itemAction === 'add' ? 'Sent' : 'Removed'} ${sentItemId}!`);
      } else {
        setItemResponseMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setItemResponseMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleSearchPlayer = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setPlayerSearchResults([]);
      return;
    }

    setPlayerSearchLoading(true);
    try {
      const response = await fetch('/api/search-player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery
        })
      });

      const data = await response.json();

      if (data.success) {
        setPlayerSearchResults(data.players || []);
      } else {
        setPlayerSearchResults([]);
      }
    } catch (error) {
      setPlayerSearchResults([]);
    }
    setPlayerSearchLoading(false);
  };

  const totalRB = rbTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 border-b border-blue-500/30 z-50">
        <div className="px-8 py-6 flex flex-col items-center justify-center gap-6 relative">
          <h1 className="text-3xl font-bold text-blue-400">Reverb Admin</h1>
          
          <div className="flex gap-8 items-center w-full justify-center">
            <nav className="flex gap-8">
              <button
                onClick={() => { setPage('home'); setEventsSubpage(null); }}
                className={`text-lg font-semibold transition-all ${
                  page === 'home' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-300'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => { setPage('players'); setEventsSubpage(null); }}
                className={`text-lg font-semibold transition-all ${
                  page === 'players' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-300'
                }`}
              >
                Players
              </button>

              <button
                onClick={() => { setPage('analytics'); setEventsSubpage(null); }}
                className={`text-lg font-semibold transition-all ${
                  page === 'analytics' 
                    ? 'text-blue-400 border-b-2 border-blue-400 pb-1' 
                    : 'text-gray-300 hover:text-blue-300'
                }`}
              >
                Analytics
              </button>

              <button
                onClick={() => { setPage('events'); setEventsSubpage(null); }}
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
              onClick={() => { setPage('settings'); setEventsSubpage(null); }}
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
                    <p className="text-4xl font-bold text-white">{rbTransactions.length}</p>
                  </div>
                  <Send className="w-10 h-10 text-blue-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 text-sm mb-1">Active Players</p>
                    <p className="text-4xl font-bold text-white">{new Set(rbTransactions.map(t => t.player)).size}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Players Page */}
        {page === 'players' && (
          <div>
            <h1 className="text-4xl font-bold text-white mb-8">Player Search</h1>
            
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6 mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by Player ID or Username..."
                  onKeyUp={(e) => handleSearchPlayer(e.target.value)}
                  className="flex-1 bg-black border border-blue-500/30 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Search Results</h2>
              <div className="space-y-3">
                {playerSearchLoading && <p className="text-gray-400 text-center py-8">Searching...</p>}
                {!playerSearchLoading && playerSearchResults.length === 0 && (
                  <p className="text-gray-400 text-center py-8">Enter a Player ID or Username to search</p>
                )}
                {playerSearchResults.map((player) => (
                  <div key={player.PlayFabId} className="bg-blue-900/20 border border-blue-500/20 rounded p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">{player.DisplayName || player.PlayFabId}</p>
                        <p className="text-blue-300 text-sm">ID: {player.PlayFabId}</p>
                        {player.Created && <p className="text-gray-400 text-sm">Joined: {new Date(player.Created).toLocaleDateString()}</p>}
                      </div>
                      <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded text-sm">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Page */}
        {page === 'analytics' && (
          <div>
            <h1 className="text-4xl font-bold text-white mb-8">Analytics</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Daily Active Users</h3>
                <div className="h-40 flex items-end justify-around gap-2">
                  {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                    <div key={i} className="bg-gradient-to-t from-blue-600 to-blue-400 rounded" style={{height: `${h}%`, width: '20px'}}></div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Revenue</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Reverbucks Sales</span>
                    <span className="text-blue-400 font-bold">$2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Items</span>
                    <span className="text-blue-400 font-bold">$1,230</span>
                  </div>
                  <div className="border-t border-blue-500/30 pt-3 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-blue-400 font-bold">$3,680</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events - Main Page */}
        {page === 'events' && !eventsSubpage && (
          <div>
            <h1 className="text-4xl font-bold text-white mb-8">Events</h1>
            
            <div className="flex gap-6">
              <button
                onClick={() => setEventsSubpage('reverbucks')}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg"
              >
                Reverbucks
              </button>
              <button
                onClick={() => setEventsSubpage('items')}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-all shadow-lg"
              >
                Items
              </button>
            </div>
          </div>
        )}

        {/* Events - Reverbucks */}
        {page === 'events' && eventsSubpage === 'reverbucks' && (
          <div>
            <button onClick={() => setEventsSubpage(null)} className="text-blue-400 hover:text-blue-300 mb-6 text-lg">← Back</button>
            <h1 className="text-4xl font-bold text-white mb-8">Distribute Reverbucks</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Send Reverbucks</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-blue-300 text-sm mb-2">Player ID</label>
                      <input
                        type="text"
                        value={rbPlayerId}
                        onChange={(e) => setRbPlayerId(e.target.value)}
                        placeholder="Player ID"
                        className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-300 text-sm mb-2">Action</label>
                      <select
                        value={rbAction}
                        onChange={(e) => setRbAction(e.target.value)}
                        className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="add">Add</option>
                        <option value="remove">Remove</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-blue-300 text-sm mb-2">Amount (RB)</label>
                      <input
                        type="number"
                        value={rbAmount}
                        onChange={(e) => setRbAmount(e.target.value)}
                        placeholder="500"
                        className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-300 text-sm mb-2">Reason</label>
                      <input
                        type="text"
                        value={rbReason}
                        onChange={(e) => setRbReason(e.target.value)}
                        placeholder="Event reward"
                        className="w-full bg-black border border-blue-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      onClick={handleSendRB}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-2 px-4 rounded transition-all"
                    >
                      {rbAction === 'add' ? 'Add' : 'Remove'} Reverbucks
                    </button>

                    {rbResponseMessage && (
                      <div className="text-sm text-blue-300 mt-4 p-3 bg-blue-900/30 rounded border border-blue-500/30">
                        {rbResponseMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {rbTransactions.length === 0 ? (
                      <p className="text-blue-300">No transactions yet</p>
                    ) : (
                      rbTransactions.map((t) => (
                        <div key={t.id} className="bg-blue-900/20 border border-blue-500/20 rounded p-3 flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">{t.player}</p>
                            <p className="text-blue-300 text-sm">{t.reason}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${t.action === 'add' ? 'text-green-400' : 'text-red-400'}`}>
                              {t.action === 'add' ? '+' : '-'}{t.amount} RB
                            </p>
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

        {/* Events - Items */}
        {page === 'events' && eventsSubpage === 'items' && (
          <div>
            <button onClick={() => setEventsSubpage(null)} className="text-purple-400 hover:text-purple-300 mb-6 text-lg">← Back</button>
            <h1 className="text-4xl font-bold text-white mb-8">Distribute Items</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Send Item</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-purple-300 text-sm mb-2">Player ID</label>
                      <input
                        type="text"
                        value={itemPlayerId}
                        onChange={(e) => setItemPlayerId(e.target.value)}
                        placeholder="Player ID"
                        className="w-full bg-black border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-300 text-sm mb-2">Item ID</label>
                      <input
                        type="text"
                        value={itemId}
                        onChange={(e) => setItemId(e.target.value)}
                        placeholder="Item ID"
                        className="w-full bg-black border border-purple-500/30 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-purple-300 text-sm mb-2">Action</label>
                      <select
                        value={itemAction}
                        onChange={(e) => setItemAction(e.target.value)}
                        className="w-full bg-black border border-purple-500/30 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="add">Add</option>
                        <option value="remove">Remove</option>
                      </select>
                    </div>

                    <button
                      onClick={handleSendItem}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-2 px-4 rounded transition-all"
                    >
                      {itemAction === 'add' ? 'Send' : 'Remove'} Item
                    </button>

                    {itemResponseMessage && (
                      <div className="text-sm text-purple-300 mt-4 p-3 bg-purple-900/30 rounded border border-purple-500/30">
                        {itemResponseMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Recent Item Distributions</h2>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {itemTransactions.length === 0 ? (
                      <p className="text-purple-300">No items distributed yet</p>
                    ) : (
                      itemTransactions.map((t) => (
                        <div key={t.id} className="bg-purple-900/20 border border-purple-500/20 rounded p-3 flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">{t.player}</p>
                            <p className="text-purple-300 text-sm">Item ID: {t.itemId}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${t.action === 'add' ? 'text-green-400' : 'text-red-400'}`}>
                              {t.action === 'add' ? 'Sent' : 'Removed'}
                            </p>
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
      </div>
    </div>
  );
}