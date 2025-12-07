import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  TrendingUp, 
  Zap,
  Crown,
  Shield,
  Target
} from 'lucide-react';

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('score', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return { icon: Crown, color: 'text-yellow-400', bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600' };
      case 2: return { icon: Medal, color: 'text-gray-300', bg: 'bg-gradient-to-r from-gray-300 to-gray-500' };
      case 3: return { icon: Award, color: 'text-orange-400', bg: 'bg-gradient-to-r from-orange-400 to-orange-600' };
      default: return { icon: Star, color: 'text-neon-cyan', bg: 'bg-neon-cyan' };
    }
  };

  const getUserRank = () => {
    if (!userData) return null;
    const userIndex = users.findIndex(user => user.id === userData.uid);
    return userIndex !== -1 ? userIndex + 1 : null;
  };

  const getSolvedCount = (solvedChallenges) => {
    return Object.keys(solvedChallenges || {}).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-900 flex items-center justify-center">
        <div className="text-neon-cyan text-xl animate-pulse">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-yellow to-neon-cyan bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Top cybersecurity warriors ranking
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-neon-cyan">{users.length}</div>
              <div className="text-sm text-gray-300">Competitors</div>
            </div>
            <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-yellow/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-neon-yellow">
                {users.reduce((total, user) => total + getSolvedCount(user.solvedChallenges), 0)}
              </div>
              <div className="text-sm text-gray-300">Total Solves</div>
            </div>
            <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-green/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-neon-green">
                {users.length > 0 ? Math.max(...users.map(u => u.score)) : 0}
              </div>
              <div className="text-sm text-gray-300">Highest Score</div>
            </div>
            {userData && (
              <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-pink/20 rounded-lg p-4">
                <div className="text-2xl font-bold text-neon-pink">
                  #{getUserRank() || '-'}
                </div>
                <div className="text-sm text-gray-300">Your Rank</div>
              </div>
            )}
          </div>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center text-white mb-8">🏆 Top 3 Hackers 🏆</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((rank) => {
                const user = users[rank - 1];
                if (!user) return null;
                
                const rankInfo = getRankIcon(rank);
                const RankIcon = rankInfo.icon;
                
                return (
                  <div 
                    key={rank} 
                    className={`relative bg-cyber-800/50 backdrop-blur-sm border rounded-lg p-6 transform transition-all duration-300 hover:scale-105 ${
                      rank === 1 
                        ? 'border-yellow-400/40 order-2 md:order-1' 
                        : rank === 2 
                        ? 'border-gray-400/40 order-1 md:order-2' 
                        : 'border-orange-400/40 order-3'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 ${rankInfo.bg} rounded-full flex items-center justify-center`}>
                      <span className="text-cyber-900 font-bold text-sm">{rank}</span>
                    </div>
                    
                    {/* User Info */}
                    <div className="text-center mt-4">
                      <RankIcon className={`w-12 h-12 ${rankInfo.color} mx-auto mb-3`} />
                      <h3 className="text-lg font-bold text-white mb-1">
                        {user.username || 'Anonymous'}
                      </h3>
                      <div className="text-2xl font-bold text-neon-yellow mb-2">
                        {user.score}
                      </div>
                      <div className="text-sm text-gray-300">
                        {getSolvedCount(user.solvedChallenges)} challenges solved
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-cyber-700">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-neon-cyan" />
              <span>Full Ranking</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyber-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Solved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-700">
                {users.map((user, index) => {
                  const rank = index + 1;
                  const rankInfo = getRankIcon(rank);
                  const solvedCount = getSolvedCount(user.solvedChallenges);
                  const isCurrentUser = userData?.uid === user.id;
                  
                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-cyber-700/50 transition-colors duration-200 ${
                        isCurrentUser ? 'bg-neon-cyan/5' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {rank <= 3 ? (
                            <rankInfo.icon className={`w-5 h-5 ${rankInfo.color}`} />
                          ) : (
                            <span className="text-neon-cyan font-bold">#{rank}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-yellow rounded-full flex items-center justify-center">
                            <span className="text-cyber-900 font-bold text-sm">
                              {user.username?.charAt(0).toUpperCase() || 'A'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {user.username || 'Anonymous'}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-neon-cyan text-cyber-900 px-2 py-1 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {user.email?.split('@')[0] || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-neon-yellow" />
                          <span className="text-neon-yellow font-bold">{user.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-neon-green" />
                          <span className="text-neon-green">{solvedCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {rank <= 3 ? (
                          <div className="flex items-center space-x-1">
                            <Shield className={`w-4 h-4 ${rankInfo.color}`} />
                            <span className={`text-sm font-medium ${rankInfo.color}`}>
                              {rank === 1 ? 'Champion' : rank === 2 ? 'Elite' : 'Expert'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">Competitor</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">No competitors yet</h3>
              <p className="text-gray-400">Be the first to join the competition!</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-cyber-800/50 backdrop-blur-sm border border-cyber-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Ranking Tiers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">Champion (Top 1)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Medal className="w-4 h-4 text-gray-300" />
              <span className="text-gray-300">Elite (Top 2)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400">Expert (Top 3)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-neon-cyan" />
              <span className="text-neon-cyan">Competitor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;