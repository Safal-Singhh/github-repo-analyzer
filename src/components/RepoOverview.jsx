import { FaStar, FaCodeBranch, FaEye, FaExclamationCircle } from 'react-icons/fa';

const RepoOverview = ({ repo }) => {
  return (
    <div className="section-card">
      <h2 className="text-2xl text-white font-semibold mb-4">Repository Overview</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="text-xl text-white font-medium mb-2">{repo.name}</h3>
          <p className="text-slate-300 mb-4">{repo.description || 'No description available'}</p>
          
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2 text-yellow-400">
              <FaStar />
              <span>{repo.stars.toLocaleString()} Stars</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <FaCodeBranch />
              <span>{repo.forks.toLocaleString()} Forks</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <FaEye />
              <span>{repo.watchers.toLocaleString()} Watchers</span>
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <FaExclamationCircle />
              <span>{repo.issues.toLocaleString()} Open Issues</span>
            </div>
          </div>
          
          <div className="text-slate-300">
            <p>Created: {new Date(repo.createdAt).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(repo.updatedAt).toLocaleDateString()}</p>
            <p>Primary Language: {repo.language || 'Not specified'}</p>
          </div>
        </div>
        
        <div className="bg-card-gradient rounded-xl p-4 border border-slate-600/50 w-full md:w-64">
          <h4 className="text-lg text-white font-medium mb-3">Repository Health</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Activity</span>
                <span className="text-green-400">{repo.activityScore}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-excellent h-full" 
                  style={{ width: `${repo.activityScore}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Community</span>
                <span className="text-yellow-400">{repo.communityScore}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-good h-full" 
                  style={{ width: `${repo.communityScore}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Documentation</span>
                <span className="text-red-400">{repo.documentationScore}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-improvement h-full" 
                  style={{ width: `${repo.documentationScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoOverview;