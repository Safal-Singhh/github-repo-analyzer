import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import RepoInput from './components/RepoInput'
import AnalysisResults from './components/AnalysisResults'
import AuthButtons from './components/AuthButtons'
import UserProfile from './components/UserProfile'
import { isUserSignedIn, saveRepoToHistory } from './services/authService'

function App() {
  const [repoData, setRepoData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    setIsAuthenticated(isUserSignedIn())
    
    // Add Puter.js script to the document
    const script = document.createElement('script')
    script.src = 'https://js.puter.com/v2/'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Listen for authentication events
  useEffect(() => {
    const handleAuthEvent = (event) => {
      if (event.detail && event.detail.type === 'auth') {
        setIsAuthenticated(event.detail.isSignedIn)
      }
    }
    
    window.addEventListener('puter:auth', handleAuthEvent)
    
    return () => {
      window.removeEventListener('puter:auth', handleAuthEvent)
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-main-gradient p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl sm:text-5xl text-white font-bold text-center mb-4 sm:mb-0">
              GitHub Repo Analyzer
            </h1>
            <div className="flex items-center gap-4">
              <AuthButtons />
            </div>
          </header>
          
          <nav className="mb-8">
            {isAuthenticated ? (
              <div className="glass-nav max-w-lg mx-auto">
                <ul className="flex gap-4 justify-center">
                  <li>
                    <Link to="/" className="link-pill">Home</Link>
                  </li>
                  <li>
                    <Link to="/profile" className="link-pill">History</Link>
                  </li>
                </ul>
              </div>
            ) : null}
          </nav>
          
          <Routes>
            <Route path="/" element={
              isAuthenticated ? (
                <>
                  <RepoInput 
                    setRepoData={setRepoData} 
                    setLoading={setLoading} 
                    setError={setError} 
                  />
                  
                  {loading && (
                    <div className="text-center py-12">
                      <div className="loading-spinner"></div>
                      <p className="text-white text-xl">Analyzing repository...</p>
                    </div>
                  )}
                  
                  {error && (
                    <div className="info-box-cyan mt-8 text-red-300">
                      <p className="text-lg">{error}</p>
                    </div>
                  )}
                  
                  {repoData && !loading && (
                    <AnalysisResults repoData={repoData} />
                  )}
                </>
              ) : (
                <div className="hero-card mt-6">
                  {/* Decorative shapes */}
                  <span className="hero-shape animate-float animate-glow w-48 h-48 bg-cyan-600/30 -top-10 -left-10"></span>
                  <span className="hero-shape animate-float w-56 h-56 bg-sky-700/30 -bottom-12 -right-12"></span>
                  <span className="hero-shape animate-glow w-24 h-24 bg-teal-500/30 top-12 right-24"></span>

                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    Welcome to <span className="glow-text">GitHub Repo Analyzer</span>
                  </h2>
                  <p className="text-slate-300 max-w-2xl mx-auto">
                    Sign in to explore rich insights, activity trends, contributors, and languages for any GitHub repository.
                  </p>
                  <p className="text-slate-400 mt-4">
                    After logging in, paste a repository URL on the Home page to start analysis.
                  </p>
                </div>
              )
            } />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <UserProfile /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App