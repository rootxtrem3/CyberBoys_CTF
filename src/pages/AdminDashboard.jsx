import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { generateChallengeIdea } from '../services/geminiService';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Code, 
  Save,
  X,
  Lightbulb,
  Zap,
  FileText,
  Settings,
  Eye,
  Download,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [generatingIdea, setGeneratingIdea] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Web',
    description: '',
    points: 100,
    difficulty: 'Easy',
    flag: '',
    filePath: '',
    tags: ''
  });

  const categories = ['Web', 'Crypto', 'Pwn', 'Reverse', 'Forensics', 'Steganography', 'Misc'];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    const challengesQuery = query(collection(db, 'challenges'), orderBy('createdAt', 'desc'));
    
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerateIdea = async () => {
    setGeneratingIdea(true);
    try {
      const idea = await generateChallengeIdea();
      setFormData({
        ...formData,
        name: idea.name,
        category: idea.category,
        description: idea.description,
        points: idea.points,
        difficulty: idea.difficulty,
        tags: idea.tags?.join(', ') || ''
      });
    } catch (error) {
      console.error('Error generating challenge idea:', error);
    } finally {
      setGeneratingIdea(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const challengeData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        createdAt: new Date().toISOString(),
        createdBy: userData.uid
      };

      if (editingChallenge) {
        await updateDoc(doc(db, 'challenges', editingChallenge.id), challengeData);
      } else {
        await addDoc(collection(db, 'challenges'), challengeData);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving challenge:', error);
      alert('Error saving challenge. Please try again.');
    }
  };

  const handleEdit = (challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      name: challenge.name,
      category: challenge.category,
      description: challenge.description,
      points: challenge.points,
      difficulty: challenge.difficulty,
      flag: challenge.flag || '',
      filePath: challenge.filePath || '',
      tags: challenge.tags?.join(', ') || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        await deleteDoc(doc(db, 'challenges', challengeId));
      } catch (error) {
        console.error('Error deleting challenge:', error);
        alert('Error deleting challenge. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingChallenge(null);
    setFormData({
      name: '',
      category: 'Web',
      description: '',
      points: 100,
      difficulty: 'Easy',
      flag: '',
      filePath: '',
      tags: ''
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web': Code,
      'Crypto': Shield,
      'Pwn': Zap,
      'Reverse': Eye,
      'Forensics': FileText,
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
        <div className="text-neon-cyan text-xl animate-pulse">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-neon-cyan to-neon-yellow bg-clip-text text-transparent">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-gray-300">
              Manage CTF challenges and platform settings
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-neon-cyan/10 text-neon-cyan px-4 py-2 rounded-lg">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Admin Access</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Code className="w-8 h-8 text-neon-cyan" />
              <div>
                <div className="text-2xl font-bold text-neon-cyan">{challenges.length}</div>
                <div className="text-sm text-gray-300">Total Challenges</div>
              </div>
            </div>
          </div>
          
          <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-yellow/20 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-neon-yellow" />
              <div>
                <div className="text-2xl font-bold text-neon-yellow">
                  {challenges.filter(c => c.difficulty === 'Easy').length}
                </div>
                <div className="text-sm text-gray-300">Easy Challenges</div>
              </div>
            </div>
          </div>
          
          <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-green/20 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-neon-green" />
              <div>
                <div className="text-2xl font-bold text-neon-green">
                  {challenges.filter(c => c.difficulty === 'Medium').length}
                </div>
                <div className="text-sm text-gray-300">Medium Challenges</div>
              </div>
            </div>
          </div>
          
          <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-pink/20 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-neon-pink" />
              <div>
                <div className="text-2xl font-bold text-neon-pink">
                  {challenges.filter(c => c.difficulty === 'Hard').length}
                </div>
                <div className="text-sm text-gray-300">Hard Challenges</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-neon-cyan to-neon-yellow text-cyber-900 px-6 py-3 rounded-lg font-bold hover:from-neon-yellow hover:to-neon-cyan transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Add Challenge</span>
          </button>
          
          <button
            onClick={handleGenerateIdea}
            disabled={generatingIdea}
            className="flex items-center space-x-2 bg-neon-yellow/10 hover:bg-neon-yellow/20 text-neon-yellow px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            <Lightbulb className="w-5 h-5" />
            <span>{generatingIdea ? 'Generating...' : 'Generate Idea'}</span>
          </button>
        </div>

        {/* Challenge Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-cyber-800 border border-neon-cyan/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neon-cyan mb-2">
                      Challenge Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                      placeholder="Enter challenge name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neon-cyan mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neon-cyan mb-2">
                        Difficulty
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                      >
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-cyan mb-2">
                      Points (100-500)
                    </label>
                    <input
                      type="number"
                      name="points"
                      value={formData.points}
                      onChange={handleInputChange}
                      min="100"
                      max="500"
                      required
                      className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-cyan mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                      placeholder="Describe the challenge..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-cyan mb-2">
                      Flag (Format: flag{`{...}`})
                    </label>
                    <input
                      type="text"
                      name="flag"
                      value={formData.flag}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                      placeholder="flag{your_flag_here}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-cyan mb-2">
                      File Path (Optional)
                    </label>
                    <input
                      type="text"
                      name="filePath"
                      value={formData.filePath}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                      placeholder="crypto/challenge.zip"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      File will be available at: {import.meta.env.VITE_STORAGE_BASE_URL}{formData.filePath || '[path]'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-cyan mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
                      placeholder="web, xss, javascript"
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-yellow text-cyber-900 py-2 px-4 rounded-md font-bold hover:from-neon-yellow hover:to-neon-cyan transition-all duration-300"
                    >
                      {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-cyber-700 hover:bg-cyber-600 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Challenges List */}
        <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-cyber-700">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Settings className="w-5 h-5 text-neon-cyan" />
              <span>Manage Challenges</span>
            </h2>
          </div>

          {challenges.length > 0 ? (
            <div className="divide-y divide-cyber-700">
              {challenges.map((challenge) => {
                const CategoryIcon = getCategoryIcon(challenge.category);
                
                return (
                  <div key={challenge.id} className="px-6 py-4 hover:bg-cyber-700/30 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <CategoryIcon className="w-6 h-6 text-neon-cyan" />
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{challenge.name}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-400">
                            <span>{challenge.category}</span>
                            <span>•</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                            <span>•</span>
                            <span>{challenge.points} points</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {challenge.filePath && (
                          <a
                            href={`${import.meta.env.VITE_STORAGE_BASE_URL}${challenge.filePath}`}
                            download
                            className="p-2 text-neon-cyan hover:bg-neon-cyan/10 rounded-lg transition-colors duration-200"
                            title="Download files"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        
                        <button
                          onClick={() => handleEdit(challenge)}
                          className="p-2 text-neon-yellow hover:bg-neon-yellow/10 rounded-lg transition-colors duration-200"
                          title="Edit challenge"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(challenge.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors duration-200"
                          title="Delete challenge"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Challenges Yet</h3>
              <p className="text-gray-400 mb-4">
                Create your first challenge to get started!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-neon-cyan to-neon-yellow text-cyber-900 px-6 py-2 rounded-lg font-bold hover:from-neon-yellow hover:to-neon-cyan transition-all duration-300"
              >
                Create Challenge
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;