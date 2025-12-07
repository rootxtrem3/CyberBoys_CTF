import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Trophy, 
  Target, 
  Clock, 
  Award, 
  TrendingUp,
  Shield,
  Star,
  Zap,
  CheckCircle,
  Code,
  Calendar
} from 'lucide-react';

const ProfilePage = () => {
  const { userData } = useAuth();
  const [solvedChallenges, setSolvedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!userData) return;

      try {
        // Fetch solved challenges
        const solvedChallengeIds = Object.keys(userData.solvedChallenges || {});
        if (solvedChallengeIds.length > 0) {
          const challengesQuery = query(
            collection(db, 'challenges'),
            where('__name__', 'in', solvedChallengeIds)
          );
          
          const challengesSnapshot = await getDocs(challengesQuery);
          const challengesData = [];
          challengesSnapshot.forEach((doc) => {
            challengesData.push({ 
              id: doc.id, 
              ...doc.data(),
              solvedAt: userData.solvedChallenges[doc.id] 
            });
          });
          
          // Sort by points descending
          challengesData.sort((a, b) => b.points - a.points);
          setSolvedChallenges(challengesData);
        }

        // Calculate rank
        const allUsersQuery = query(collection(db, 'users'), orderBy('score', 'desc'));
        const allUsersSnapshot = await getDocs(allUsersQuery);
        const allUsersData = [];
        allUsersSnapshot.forEach((doc) => {
          allUsersData.push({ id: doc.id, ...doc.data() });
        });
        
        setTotalUsers(allUsersData.length);
        const userRank = allUsersData.findIndex(user => user.id === userData.uid) + 1;
        setRank(userRank);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [userData]);

  const getRankIcon = (rank) => {
    if (rank === 1) return { icon: Trophy, color: 'text-yellow-400', title: 'Champion' };
    if (rank === 2) return { icon: Award, color: 'text-gray-300', title: 'Elite' };
    if (rank === 3) return { icon: Award, color: 'text-orange-400', title: 'Expert' };
    if (rank <= 10) return { icon: Star, color: 'text-neon-cyan', title: 'Top 10' };
    return { icon: TrendingUp, color: 'text-neon-green', title: 'Competitor' };
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web': Code,
      'Crypto': Shield,
      'Pwn': Zap,
      'Reverse': Target,
      'Forensics': Calendar,
      'Steganography': Eye
    };
    return icons[category] || Code;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-900 flex items-center justify-center">
        <div className="text-neon-cyan text-xl animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-cyber-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const solvedCount = Object.keys(userData.solvedChallenges || {}).length;
  const rankInfo = getRankIcon(rank);
  const RankIcon = rankInfo.icon;

  return (
    <div className="min-h-screen bg-cyber-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-cyan to-neon-yellow bg-clip-text text-transparent">
              Player Profile
            </span>
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-neon-cyan to-neon-yellow rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-cyber-900" />
              </div>
              {rank && (
                <div className={`absolute -top-2 -right-2 w-12 h-12 ${rankInfo.color} rounded-full flex items-center justify-center border-4 border-cyber-800`}>
                  <RankIcon className="w-6 h-6 text-cyber-900" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                {userData.username || 'Anonymous'}
              </h2>
              
              {rank && (
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                  <span className={`font-medium ${rankInfo.color}`}>
                    {rankInfo.title}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">
                    Rank #{rank} of {totalUsers}
                  </span>
                </div>
              )}

              <p className="text-gray-300 mb-6">
                {userData.email}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-cyber-700/50 rounded-lg p-4 text-center">
                  <Trophy className="w-8 h-8 text-neon-yellow mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-yellow">{userData.score || 0}</div>
                  <div className="text-sm text-gray-300">Total Score</div>
                </div>
                
                <div className="bg-cyber-700/50 rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-neon-green mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-green">{solvedCount}</div>
                  <div className="text-sm text-gray-300">Challenges Solved</div>
                </div>
                
                <div className="bg-cyber-700/50 rounded-lg p-4 text-center">
                  <Zap className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-cyan">
                    {solvedCount > 0 ? Math.round(userData.score / solvedCount) : 0}
                  </div>
                  <div className="text-sm text-gray-300">Avg Points</div>
                </div>
                
                <div className="bg-cyber-700/50 rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 text-neon-pink mx-auto mb-2" />
                  <div className="text-2xl font-bold text-neon-pink">
                    {Math.round((solvedCount / (users.length * 10)) * 100) || 0}%
                  </div>
                  <div className="text-sm text-gray-300">Completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Rank Progress */}
          <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-neon-cyan" />
              <span>Ranking Progress</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Current Rank</span>
                <span className={`font-bold ${rankInfo.color}`}>#{rank}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Total Players</span>
                <span className="text-neon-cyan font-bold">{totalUsers}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Percentile</span>
                <span className="text-neon-green font-bold">
                  {totalUsers > 0 ? Math.round(((totalUsers - rank + 1) / totalUsers) * 100) : 0}%
                </span>
              </div>
              
              <div className="w-full bg-cyber-700 rounded-full h-2 mt-4">
                <div 
                  className="bg-gradient-to-r from-neon-cyan to-neon-yellow h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalUsers > 0 ? ((totalUsers - rank + 1) / totalUsers) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-neon-yellow" />
              <span>Quick Actions</span>
            </h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/arena'}
                className="w-full flex items-center justify-center space-x-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Target className="w-4 h-4" />
                <span>Continue Hacking</span>
              </button>
              
              <button 
                onClick={() => window.location.href = '/leaderboard'}
                className="w-full flex items-center justify-center space-x-2 bg-neon-yellow/10 hover:bg-neon-yellow/20 text-neon-yellow py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <Trophy className="w-4 h-4" />
                <span>View Leaderboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Solved Challenges */}
        <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg">
          <div className="px-6 py-4 border-b border-cyber-700">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-neon-green" />
              <span>Solved Challenges ({solvedCount})</span>
            </h3>
          </div>

          {solvedCount > 0 ? (
            <div className="divide-y divide-cyber-700">
              {solvedChallenges.map((challenge) => {
                const CategoryIcon = getCategoryIcon(challenge.category);
                
                return (
                  <div key={challenge.id} className="px-6 py-4 hover:bg-cyber-700/30 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <CategoryIcon className="w-6 h-6 text-neon-cyan" />
                        <div>
                          <h4 className="text-white font-medium">{challenge.name}</h4>
                          <p className="text-sm text-gray-400">{challenge.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4 text-neon-yellow" />
                          <span className="text-neon-yellow font-bold">{challenge.points}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-300 mb-2">No Challenges Solved Yet</h4>
              <p className="text-gray-400 mb-4">
                Start solving challenges to see them here!
              </p>
              <button 
                onClick={() => window.location.href = '/arena'}
                className="bg-gradient-to-r from-neon-cyan to-neon-yellow text-cyber-900 px-6 py-2 rounded-lg font-bold hover:from-neon-yellow hover:to-neon-cyan transition-all duration-300"
              >
                Go to Arena
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;