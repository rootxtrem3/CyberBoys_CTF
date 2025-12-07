# Gelan CyberBoys CTF Platform

A production-ready, modular Capture The Flag (CTF) platform with cyberpunk aesthetic, built with React, Firebase, and Google Gemini AI integration.

## 🚀 Features

- **Modern Tech Stack**: React 18, Vite, Tailwind CSS, Firebase
- **Cyberpunk Design**: Dark theme with neon cyan and yellow accents
- **Real-time Updates**: Live leaderboard and challenge updates using Firestore
- **AI-Powered Hints**: Gemini AI integration for cryptic, non-spoiler hints
- **Challenge Management**: Full CRUD operations for admins
- **Secure Authentication**: Firebase Auth with protected routes
- **File Downloads**: Challenge file hosting integration
- **Responsive Design**: Mobile-first approach with stunning visuals

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Lucide React** - Icons

### Backend & Services
- **Firebase Auth** - Authentication
- **Firestore** - Real-time Database
- **Google Gemini AI** - Hint generation
- **Firebase Hosting** - Deployment ready

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── firebase/           # Firebase configuration
├── pages/              # Page components
├── services/           # API services (Gemini)
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gelan-cyberboys-ctf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Firebase and Gemini API credentials in `.env`:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Gemini API Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # Challenge Storage Configuration
   VITE_STORAGE_BASE_URL=http://203.0.113.42/ctf/challenges/
   ```

4. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Set up Firestore rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection
       match /users/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Challenges collection
       match /challenges/{challengeId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
       }
     }
   }
   ```

5. **Get Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 🎯 Usage

### For Players
1. **Register** a new account or **login**
2. **Browse challenges** in the Arena
3. **Solve challenges** and submit flags
4. **View leaderboard** to see your ranking
5. **Get AI hints** when stuck (without spoilers!)

### For Admins
1. **Login** with an admin account
2. **Access Admin Dashboard** from the navigation
3. **Create challenges** with the built-in form
4. **Generate challenge ideas** using AI
5. **Edit or delete** existing challenges
6. **Upload challenge files** to your storage server

### Making a User Admin
To grant admin privileges, update the user's document in Firestore:
```javascript
// In Firestore, set the user's isAdmin field to true
db.collection('users').doc('userId').update({
  isAdmin: true
});
```

## 🔧 Configuration

### Challenge File Storage
The platform supports challenge file downloads. Configure your storage:

1. **Set up a web server** (Apache/Nginx) at `203.0.113.42`
2. **Create directory structure**:
   ```
   /var/www/ctf/challenges/
   ├── web/
   ├── crypto/
   ├── pwn/
   └── ...
   ```
3. **Upload challenge files** to appropriate directories
4. **Update file paths** in challenge creation form

### Customization
- **Theme colors**: Modify Tailwind config in `tailwind.config.js`
- **Animations**: Update CSS animations in `index.css`
- **Firebase rules**: Adjust security rules as needed
- **Gemini prompts**: Customize AI behavior in `geminiService.js`

## 🚀 Deployment

### Firebase Hosting
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Other Hosting Options
The built project in `dist/` can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 🔒 Security Considerations

- **Environment Variables**: Never commit `.env` files
- **Firebase Rules**: Restrict write access to admins only
- **Challenge Flags**: Use unique, hard-to-guess flags
- **File Uploads**: Validate and sanitize all uploaded files
- **HTTPS**: Always use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered hints
- **Firebase** for backend services
- **Tailwind CSS** for styling
- **Lucide** for beautiful icons
- **React Community** for the amazing ecosystem

---

**Happy Hacking! 🏴‍☠️**