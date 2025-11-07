import { FaCode, FaUserFriends, FaHistory } from 'react-icons/fa';

const RepoStats = ({ stats }) => {
  return (
    <div className="section-card">
      <h2 className="text-2xl text-white font-semibold mb-6">Repository Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-gradient rounded-xl p-5 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <FaCode size={24} />
            </div>
            <h3 className="text-xl text-white font-medium">Code</h3>
          </div>
          
          <ul className="space-y-2">
            <li className="list-item-cyan">
              <span className="text-slate-400">Languages:</span>
              <span className="text-white">{stats.languages.length}</span>
            </li>
            <li className="list-item-cyan">
              <span className="text-slate-400">Files:</span>
              <span className="text-white">{stats.totalFiles.toLocaleString()}</span>
            </li>
            <li className="list-item-cyan">
              <span className="text-slate-400">Lines of Code:</span>
              <span className="text-white">{stats.linesOfCode.toLocaleString()}</span>
            </li>
            <li className="list-item-cyan">
              <span className="text-slate-400">Code Size:</span>
              <span className="text-white">{stats.codeSize}</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-card-gradient rounded-xl p-5 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container-lg bg-green-500/20 text-green-400 border border-green-500/30">
              <FaUserFriends size={24} />
            </div>
            <h3 className="text-xl text-white font-medium">Contributors</h3>
          </div>
          
          <ul className="space-y-2">
            <li className="list-item-emerald">
              <span className="text-slate-400">Total Contributors:</span>
              <span className="text-white">{stats.contributors.toLocaleString()}</span>
            </li>
            <li className="list-item-emerald">
              <span className="text-slate-400">Recent Contributors:</span>
              <span className="text-white">{stats.recentContributors.toLocaleString()}</span>
            </li>
            <li className="list-item-emerald">
              <span className="text-slate-400">Pull Requests:</span>
              <span className="text-white">{stats.pullRequests.toLocaleString()}</span>
            </li>
            <li className="list-item-emerald">
              <span className="text-slate-400">Merged PRs:</span>
              <span className="text-white">{stats.mergedPRs.toLocaleString()}</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-card-gradient rounded-xl p-5 border border-slate-600/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="icon-container-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <FaHistory size={24} />
            </div>
            <h3 className="text-xl text-white font-medium">Activity</h3>
          </div>
          
          <ul className="space-y-2">
            <li className="list-item-cyan">
              <span className="text-slate-400">Commits:</span>
              <span className="text-white">{stats.commits.toLocaleString()}</span>
            </li>
            <li className="list-item-cyan">
              <span className="text-slate-400">Recent Commits:</span>
              <span className="text-white">{stats.recentCommits.toLocaleString()}</span>
            </li>
            <li className="list-item-cyan">
              <span className="text-slate-400">Releases:</span>
              <span className="text-white">{stats.releases.toLocaleString()}</span>
            </li>
            <li className="list-item-cyan">
              <span className="text-slate-400">Last Release:</span>
              <span className="text-white">{stats.lastRelease || 'None'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RepoStats;