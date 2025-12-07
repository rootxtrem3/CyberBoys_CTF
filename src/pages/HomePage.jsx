import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Shield, 
  Code, 
  Trophy, 
  Users, 
  Terminal, 
  Eye, 
  Lock, 
  Zap,
  ArrowRight,
  Github,
  Mail,
  Key
} from 'lucide-react';

const HomePage = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register(formData.email, formData.password, formData.username);
      }
      navigate('/arena');
    } catch (error) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    navigate('/arena');
    return null;
  }

  const features = [
    {
      icon: Code,
      title: 'Multiple Categories',
      description: 'Web, Crypto, Pwn, Reverse, Forensics, and more challenges',
      color: 'text-neon-cyan'
    },
    {
      icon: Trophy,
      title: 'Real-time Leaderboard',
      description: 'Track your progress and compete with other players',
      color: 'text-neon-yellow'
    },
    {
      icon: Zap,
      title: 'AI-Powered Hints',
      description: 'Get cryptic hints from Gemini AI when you need help',
      color: 'text-neon-green'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Built with modern security practices and Firebase',
      color: 'text-neon-pink'
    }
  ];

  const stats = [
    { label: 'Active Challenges', value: '50+', icon: Code },
    { label: 'Categories', value: '6', icon: Shield },
    { label: 'AI Integration', value: 'Gemini', icon: Zap },
    { label: 'Real-time Updates', value: 'Live', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-cyber-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-900 via-cyber-800 to-cyber-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-neon-yellow rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 mb-6">
                <Terminal className="w-8 h-8 text-neon-cyan" />
                <span className="text-neon-cyan font-mono text-lg">Gelan CyberBoys CTF</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-cyan bg-clip-text text-transparent animate-glow">
                  Capture The Flag
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Test your cybersecurity skills in our advanced CTF platform. 
                Solve challenges, climb the leaderboard, and prove your hacking prowess.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  to="#auth"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-neon-cyan to-neon-yellow text-cyber-900 px-8 py-3 rounded-lg font-bold hover:from-neon-yellow hover:to-neon-cyan transition-all duration-300 transform hover:scale-105"
                >
                  <span>Start Hacking</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="#features"
                  className="inline-flex items-center space-x-2 border-2 border-neon-cyan text-neon-cyan px-8 py-3 rounded-lg font-bold hover:bg-neon-cyan hover:text-cyber-900 transition-all duration-300"
                >
                  <span>Learn More</span>
                  <Eye className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6 text-center hover:border-neon-cyan/40 transition-all duration-300">
                    <Icon className="w-8 h-8 text-neon-cyan mx-auto mb-2" />
                    <div className="text-2xl font-bold text-neon-yellow mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-neon-cyan to-neon-yellow bg-clip-text text-transparent">
                Platform Features
              </span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-6 hover:border-neon-cyan/40 hover:transform hover:scale-105 transition-all duration-300">
                    <Icon className={`w-12 h-12 ${feature.color} mb-4`} />
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Auth Section */}
        <section id="auth" className="py-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-cyber-800/50 backdrop-blur-sm border border-neon-cyan/20 rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isLogin ? 'Welcome Back' : 'Join the Challenge'}
                </h2>
                <p className="text-gray-300">
                  {isLogin ? 'Sign in to continue hacking' : 'Create your account and start competing'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-neon-cyan mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full pl-10 pr-3 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200"
                        placeholder="Enter your username"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neon-cyan mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neon-cyan mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neon-cyan mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full pl-10 pr-3 py-2 bg-cyber-700 border border-cyber-600 rounded-md text-white placeholder-gray-400 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all duration-200"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-yellow text-cyber-900 py-2 px-4 rounded-md font-bold hover:from-neon-yellow hover:to-neon-cyan transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ email: '', password: '', username: '', confirmPassword: '' });
                  }}
                  className="text-neon-cyan hover:text-neon-yellow transition-colors duration-200 text-sm"
                >
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-cyber-700">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400">
              © 2024 Gelan CyberBoys CTF Platform. Built for cybersecurity enthusiasts.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;