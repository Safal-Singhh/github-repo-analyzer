import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchRepoData } from '../services/githubService';
import { isUserSignedIn, saveRepoToHistory } from '../services/authService';

const RepoInput = ({ setRepoData, setLoading, setError }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const location = useLocation();

  // Helper to analyze a given URL (used by form submit and deep-link)
  const analyzeRepoUrl = async (url) => {
    if (!url) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRepoData(url);
      setRepoData(data);
      // Save to history if user is signed in
      if (isUserSignedIn()) {
        const [owner, repoName] = (data.repo.name || '').split('/');
        const ok = await saveRepoToHistory({
          name: data.repo.name,
          owner: owner || '',
          url: url,
          stars: data.repo.stars,
          forks: data.repo.forks,
          language: data.repo.language,
          summary: data.analysis?.summary || null
        });
        if (!ok) {
          setSaveNotice('Analysis saved, but history save failed (quota or network).');
          setTimeout(() => setSaveNotice(''), 4000);
        } else {
          setSaveNotice('Saved to history.');
          setTimeout(() => setSaveNotice(''), 2000);
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to analyze repository. Please check the URL and try again.');
      setRepoData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await analyzeRepoUrl(repoUrl);
  };

  // Auto-analyze when arriving with ?repo=<url>
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlParam = params.get('repo');
    if (urlParam) {
      const decoded = decodeURIComponent(urlParam);
      setRepoUrl(decoded);
      analyzeRepoUrl(decoded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="upload-area">
      <h2 className="text-2xl sm:text-3xl text-white font-semibold mb-4 text-center">
        Analyze GitHub Repository
      </h2>
      
      <p className="text-slate-300 mb-6 text-center">
        Enter a GitHub repository URL to get detailed insights, statistics, and AI-powered suggestions
      </p>
      
      <form onSubmit={handleSubmit} className="upload-zone">
        <div className="mb-6">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full bg-slate-800/70 text-white border border-slate-600 rounded-lg p-4 focus:outline-none focus:border-sky-500"
          />
        </div>
        
        <button type="submit" className="btn-primary w-full">
          Analyze Repository
        </button>
        {saveNotice && (
          <div className="mt-3 text-center">
            <span className="text-slate-300 text-sm">{saveNotice}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default RepoInput;