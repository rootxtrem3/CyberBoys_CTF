import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  Code, 
  Shield, 
  Lock, 
  Search, 
  FileText, 
  Eye, 
  Trophy,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

const ArenaPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { userData } = useAuth();

  const categories = [
    { name: 'All', icon: Code, color: 'text-neon-cyan' },
    { name: 'Web', icon: Code, color: 'text-neon-green' },
    { name: 'Crypto', icon: Shield, color: 'text-neon-yellow' },
    { name: 'Pwn', icon: Lock, color: 'text-neon-pink' },
    { name: 'Reverse', icon: Search, color: 'text-blue-400' },
    { name: 'Forensics', icon: FileText, color: 'text-purple-400' },
    { name: 'Steganography', icon: Eye, color: 'text-green-400' }
  ];

  useEffect(() => {
    const challengesQuery = query(collection(db, 'challenges'));
    
    const unsubscribe = onSnapshot(challengesQuery, (snapshot) => {
      const challengesData = [];
      snapshot.forEach((doc) => {
        challengesData.push({ id: doc.id, ...doc.data() });
      });
      setChallenges(challengesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredChallenges = selectedCategory === 'All' 
    ? challenges 
    : challenges.filter(challenge => challenge.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.name === category);
    return categoryData ? categoryData.icon : Code;
  };

  const isSolved = (challengeId) => {
    return userData?.solvedChallenges?.[challengeId] || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-900 flex items-center justify-center">
        <div className="text-neon-cyan text-xl animate-pulse">Loading challenges...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-neon-cyan to-neon-yellow bg-clip-text text-transparent">
              CTF Arena
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Choose your challenges and prove your skills
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg px-4 py-2">
              <span className="text-neon-cyan font-bold">{challenges.length}</span>
              <span className="text-gray-300 ml-2">Total Challenges</span>
            </div>
            <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-yellow/20 rounded-lg px-4 py-2">
              <span className="text-neon-yellow font-bold">
                {Object.keys(userData?.solvedChallenges || {}).length}
              </span>
              <span className="text-gray-300 ml-2">Solved</span>
            </div>
            <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-green/20 rounded-lg px-4 py-2">
              <span className="text-neon-green font-bold">{userData?.score || 0}</span>
              <span className="text-gray-300 ml-2">Points</span>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-neon-cyan text-cyber-900'
                      : 'bg-cyber-800 text-gray-300 hover:bg-cyber-700 hover:text-neon-cyan'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${category.color}`} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChallenges.map((challenge) => {
            const CategoryIcon = getCategoryIcon(challenge.category);
            const solved = isSolved(challenge.id);
            
            return (
              <Link
                key={challenge.id}
                to={`/challenge/${challenge.id}`}
                className={`bg-cyber-800/50 backdrop-blur-sm border rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300 ${
                  solved 
                    ? 'border-neon-green/40 bg-neon-green/5' 
                    : 'border-neon-cyan/20 hover:border-neon-cyan/40'
                }`}
              >
                {/* Challenge Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className={`w-5 h-5 ${
                      solved ? 'text-neon-green' : 'text-neon-cyan'
                    }`} />
                    <span className="text-sm font-medium text-gray-300">
                      {challenge.category}
                    </span>
                  </div>
                  
                  {/* Solved Indicator */}
                  {solved && (
                    <CheckCircle className="w-5 h-5 text-neon-green" />
                  )}
                </div>

                {/* Challenge Info */}
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                  {challenge.name}
                </h3>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {challenge.description}
                </p>

                {/* Challenge Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-neon-yellow" />
                    <span className="text-sm font-bold text-neon-yellow">
                      {challenge.points}
                    </span>
                  </div>
                  
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    getDifficultyColor(challenge.difficulty)
                  }`}>
                    {challenge.difficulty}
                  </span>
                </div>

                {/* Tags */}
                {challenge.tags && challenge.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {challenge.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-cyber-700 text-gray-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status Indicator */}
                <div className="mt-4 pt-4 border-t border-cyber-700">
                  {solved ? (
                    <div className="flex items-center space-x-2 text-neon-green text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Available</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-16">
            <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No challenges found</h3>
            <p className="text-gray-400">
              {selectedCategory === 'All' 
                ? 'No challenges available yet. Check back soon!' 
                : `No ${selectedCategory} challenges available.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArenaPage;