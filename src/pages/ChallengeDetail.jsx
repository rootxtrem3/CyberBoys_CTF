import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { generateHint } from '../services/geminiService';
import { 
  ArrowLeft, 
  Download, 
  Flag, 
  Lightbulb, 
  CheckCircle, 
  XCircle,
  Trophy,
  Eye,
  FileText,
  Clock,
  Zap
} from 'lucide-react';

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flagInput, setFlagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [generatingHint, setGeneratingHint] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challengeDoc = await getDoc(doc(db, 'challenges', id));
        if (challengeDoc.exists()) {
          const challengeData = challengeDoc.data();
          setChallenge(challengeData);
          
          // Check if already solved
          if (userData?.solvedChallenges?.[id]) {
            setSolved(true);
            setFlagInput(userData.solvedChallenges[id]);
          }
        } else {
          navigate('/arena');
        }
      } catch (error) {
        console.error('Error fetching challenge:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChallenge();
    }
  }, [id, user, userData, navigate]);

  const handleFlagSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setMessageType('');

    try {
      if (flagInput.trim() === challenge.flag) {
        // Correct flag
        const newScore = (userData?.score || 0) + challenge.points;
        const solvedChallenges = {
          ...userData?.solvedChallenges,
          [id]: flagInput.trim()
        };

        await updateDoc(doc(db, 'users', user.uid), {
          score: newScore,
          solvedChallenges: solvedChallenges
        });

        setMessage(`🎉 Congratulations! You earned ${challenge.points} points!`);
        setMessageType('success');
        setSolved(true);
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 5000);
      } else {
        // Incorrect flag
        setMessage('❌ Incorrect flag. Try again!');
        setMessageType('error');
        
        // Auto-hide error message after 3 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting flag:', error);
      setMessage('❌ Error submitting flag. Please try again.');
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGetHint = async () => {
    if (hint) {
      setShowHint(!showHint);
      return;
    }

    setGeneratingHint(true);
    try {
      const generatedHint = await generateHint(challenge.name, challenge.description);
      setHint(generatedHint);
      setShowHint(true);
    } catch (error) {
      console.error('Error generating hint:', error);
      setHint('Sometimes the answer is hidden in plain sight...');
      setShowHint(true);
    } finally {
      setGeneratingHint(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'Hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Web': Code,
      'Crypto': Shield,
      'Pwn': Lock,
      'Reverse': Search,
      'Forensics': FileText,
      'Steganography': Eye
    };
    return icons[category] || FileText;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-900 flex items-center justify-center">
        <div className="text-neon-cyan text-xl animate-pulse">Loading challenge...</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-cyber-900 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Challenge Not Found</h2>
          <button
            onClick={() => navigate('/arena')}
            className="text-neon-cyan hover:text-neon-yellow transition-colors duration-200"
          >
            Return to Arena
          </button>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(challenge.category);

  return (
    <div className="min-h-screen bg-cyber-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/arena')}
            className="flex items-center space-x-2 text-neon-cyan hover:text-neon-yellow transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Arena</span>
          </button>

          <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CategoryIcon className="w-8 h-8 text-neon-cyan" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {challenge.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-neon-cyan">{challenge.category}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="flex items-center space-x-1 text-neon-yellow">
                  <Trophy className="w-5 h-5" />
                  <span className="text-2xl font-bold">{challenge.points}</span>
                </div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>

            {/* Status */}
            {solved && (
              <div className="flex items-center space-x-2 text-neon-green mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Challenge Completed!</span>
              </div>
            )}

            {/* Description */}
            <div className="prose prose-invert max-w-none mb-6">
              <h3 className="text-lg font-semibold text-neon-cyan mb-2 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Description</span>
              </h3>
              <div className="text-gray-300 whitespace-pre-wrap">
                {challenge.description}
              </div>
            </div>

            {/* Tags */}
            {challenge.tags && challenge.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neon-cyan mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {challenge.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-cyber-700 text-gray-300 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Section */}
            {challenge.filePath && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-neon-cyan mb-2 flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Challenge Files</span>
                </h3>
                <a
                  href={`${import.meta.env.VITE_STORAGE_BASE_URL}${challenge.filePath}`}
                  download
                  className="inline-flex items-center space-x-2 bg-cyber-700 hover:bg-cyber-600 text-neon-cyan px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Files</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Flag Submission */}
        <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Flag className="w-5 h-5 text-neon-yellow" />
            <span>Submit Flag</span>
          </h2>

          <form onSubmit={handleFlagSubmit} className="space-y-4">
            <div>
              <label htmlFor="flag" className="block text-sm font-medium text-neon-cyan mb-2">
                Flag Format: flag{`{...}`}
              </label>
              <input
                type="text"
                id="flag"
                value={flagInput}
                onChange={(e) => setFlagInput(e.target.value)}
                disabled={solved || submitting}
                className="w-full px-4 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter the flag..."
              />
            </div>

            <button
              type="submit"
              disabled={solved || submitting || !flagInput.trim()}
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-yellow text-cyber-900 py-2 px-4 rounded-md font-bold hover:from-neon-yellow hover:to-neon-cyan transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {solved ? 'Already Solved' : (submitting ? 'Submitting...' : 'Submit Flag')}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              messageType === 'success' 
                ? 'bg-green-400/10 border border-green-400/20 text-green-400' 
                : 'bg-red-400/10 border border-red-400/20 text-red-400'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Hint Section */}
        <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-neon-yellow" />
              <span>Need a Hint?</span>
            </h2>
            
            <button
              onClick={handleGetHint}
              disabled={generatingHint}
              className="flex items-center space-x-2 bg-neon-yellow/10 hover:bg-neon-yellow/20 text-neon-yellow px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{generatingHint ? 'Generating...' : (hint ? 'Toggle Hint' : 'Get Hint')}</span>
            </button>
          </div>

          {showHint && hint && (
            <div className="bg-neon-yellow/5 border border-neon-yellow/20 rounded-lg p-4">
              <p className="text-neon-yellow italic">{hint}</p>
            </div>
          )}

          {!hint && !generatingHint && (
            <p className="text-gray-400 text-sm">
              Click the button above to get a cryptic hint from our AI assistant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;