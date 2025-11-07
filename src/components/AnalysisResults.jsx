import RepoOverview from './RepoOverview';
import RepoStats from './RepoStats';
import AIAnalysis from './AIAnalysis';

const AnalysisResults = ({ repoData }) => {
  if (!repoData) return null;
  
  return (
    <div className="mt-8 space-y-8">
      <RepoOverview repo={repoData.repo} />
      <RepoStats stats={repoData.stats} />
      <AIAnalysis analysis={repoData.analysis} />
    </div>
  );
};

export default AnalysisResults;