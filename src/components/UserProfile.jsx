import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar as FaStarIcon, FaThumbtack } from 'react-icons/fa';
import { getCurrentUser, isUserSignedIn, getRepoHistory, togglePinRepoInHistory } from '../services/authService';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repoHistory, setRepoHistory] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isUserSignedIn()) {
        const userData = await getCurrentUser();
        setUser(userData);
        
        // Fetch repository history
        const history = await getRepoHistory();
        setRepoHistory(history);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-300">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">User Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400">Username</p>
          <p className="text-white font-medium">{user.username}</p>
        </div>
        {user.email && (
          <div>
            <p className="text-gray-400">Email</p>
            <p className="text-white font-medium">{user.email}</p>
          </div>
        )}
        <div className="pt-4">
          <p className="text-gray-400">Storage Usage</p>
          <p className="text-white font-medium">{user.storage?.usage || '0'} / {user.storage?.quota || 'Unknown'}</p>
        </div>
      </div>
      
      {/* Repository History Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-white mb-4">Repository History</h3>
        {repoHistory.length > 0 ? (
          <div className="space-y-4">
            {repoHistory.map((repo, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/?repo=${encodeURIComponent(repo.url)}`} className="block">
                      <h4 className="text-lg font-medium text-white flex items-center gap-2">
                        {repo.name}
                        {repo.pinned && (
                          <span className="text-yellow-400 text-xs border border-yellow-500/50 px-2 py-0.5 rounded">Pinned</span>
                        )}
                      </h4>
                      <p className="text-gray-300 text-sm">{repo.owner}</p>
                    </Link>
                    {repo.summary && (
                      <p className="text-slate-300 text-sm mt-2">{repo.summary}</p>
                    )}
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-400 text-xs">{new Date(repo.timestamp).toLocaleString()}</span>
                      <span className="text-blue-400 text-xs flex items-center gap-1"><FaStarIcon /> {repo.stars} stars</span>
                    </div>
                  </div>
                  <button
                    className="ml-4 text-slate-200 hover:text-white"
                    title={repo.pinned ? 'Unpin' : 'Pin'}
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const ok = await togglePinRepoInHistory(repo.url);
                      if (ok) {
                        // Refresh list
                        const updated = await getRepoHistory();
                        setRepoHistory(updated);
                      }
                    }}
                  >
                    <FaThumbtack className={repo.pinned ? 'text-yellow-400' : 'text-slate-400'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No repositories analyzed yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;