import axios from 'axios';

// Extract username and repo name from GitHub URL
const parseGitHubUrl = (url) => {
  try {
    // Handle different GitHub URL formats
    const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);
    
    if (!match || match.length < 3) {
      throw new Error('Invalid GitHub repository URL');
    }
    
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  } catch (error) {
    throw new Error('Failed to parse GitHub URL. Please enter a valid repository URL.');
  }
};

// Fetch repository data from GitHub API
export const fetchRepoData = async (repoUrl) => {
  try {
    const { owner, repo } = parseGitHubUrl(repoUrl);
    
    // Fetch basic repository information
    const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
    const repoData = repoResponse.data;
    
    // Fetch additional data (commits, contributors, languages)
    const [commitsResponse, contributorsResponse, languagesResponse] = await Promise.all([
      axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100`),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`),
      axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`)
    ]);
    
    // Process and structure the data
    const processedData = {
      repo: {
        name: repoData.full_name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.subscribers_count,
        issues: repoData.open_issues_count,
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        language: repoData.language,
        // Calculate scores based on repository metrics
        activityScore: calculateActivityScore(repoData, commitsResponse.data),
        communityScore: calculateCommunityScore(repoData, contributorsResponse.data),
        documentationScore: calculateDocumentationScore(repoData)
      },
      stats: {
        languages: Object.keys(languagesResponse.data),
        totalFiles: estimateTotalFiles(repoData),
        linesOfCode: estimateLinesOfCode(languagesResponse.data),
        codeSize: formatBytes(repoData.size * 1024), // Convert KB to bytes
        contributors: contributorsResponse.data.length,
        recentContributors: countRecentContributors(contributorsResponse.data),
        pullRequests: 0, // Would require additional API calls
        mergedPRs: 0, // Would require additional API calls
        commits: repoData.network_count || commitsResponse.data.length,
        recentCommits: countRecentCommits(commitsResponse.data),
        releases: 0, // Would require additional API calls
        lastRelease: 'N/A' // Would require additional API calls
      },
      analysis: generateAIAnalysis(repoData, languagesResponse.data, commitsResponse.data, contributorsResponse.data)
    };
    
    return processedData;
  } catch (error) {
    console.error('Error fetching repository data:', error);
    throw new Error('Failed to fetch repository data. Please check the URL and try again.');
  }
};

// Helper functions for data processing and analysis

// Calculate activity score based on commits, issues, and update frequency
const calculateActivityScore = (repoData, commits) => {
  // Simple algorithm to estimate activity (0-100%)
  const now = new Date();
  const lastUpdate = new Date(repoData.updated_at);
  const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
  
  // More recent updates get higher scores
  let score = 100 - Math.min(daysSinceUpdate * 2, 70);
  
  // Adjust based on commit frequency
  if (commits.length > 50) score += 15;
  else if (commits.length > 20) score += 10;
  else if (commits.length > 5) score += 5;
  
  return Math.min(Math.max(Math.round(score), 10), 100);
};

// Calculate community score based on stars, forks, and contributors
const calculateCommunityScore = (repoData, contributors) => {
  let score = 0;
  
  // Stars contribute to score
  if (repoData.stargazers_count > 1000) score += 40;
  else if (repoData.stargazers_count > 100) score += 30;
  else if (repoData.stargazers_count > 10) score += 20;
  else score += 10;
  
  // Forks contribute to score
  if (repoData.forks_count > 100) score += 30;
  else if (repoData.forks_count > 10) score += 20;
  else if (repoData.forks_count > 0) score += 10;
  
  // Contributors contribute to score
  if (contributors.length > 10) score += 30;
  else if (contributors.length > 3) score += 20;
  else score += 10;
  
  return Math.min(Math.max(Math.round(score), 10), 100);
};

// Calculate documentation score based on readme, wiki, etc.
const calculateDocumentationScore = (repoData) => {
  // Simple estimation (would need more API calls for accuracy)
  let score = 50; // Base score
  
  // Adjust based on description
  if (repoData.description && repoData.description.length > 50) score += 20;
  else if (repoData.description) score += 10;
  
  // Adjust based on homepage
  if (repoData.homepage) score += 20;
  
  // Adjust based on wiki
  if (repoData.has_wiki) score += 10;
  
  return Math.min(Math.max(Math.round(score), 10), 100);
};

// Estimate total files (GitHub API doesn't provide this directly)
const estimateTotalFiles = (repoData) => {
  // Rough estimation based on repository size
  return Math.round(repoData.size / 10);
};

// Estimate lines of code based on languages
const estimateLinesOfCode = (languages) => {
  // Rough estimation based on language bytes
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  return Math.round(totalBytes / 30); // Assuming average 30 bytes per line
};

// Format bytes to human-readable format
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Count contributors who contributed in the last 3 months
const countRecentContributors = (contributors) => {
  // Would need additional API calls for accuracy
  // This is a placeholder implementation
  return Math.round(contributors.length * 0.6);
};

// Count commits from the last month
const countRecentCommits = (commits) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  return commits.filter(commit => {
    const commitDate = new Date(commit.commit.author.date);
    return commitDate > oneMonthAgo;
  }).length;
};

// Language helpers
const getTopLanguage = (languages) => {
  let top = null;
  let max = -1;
  for (const [lang, bytes] of Object.entries(languages || {})) {
    if (bytes > max) {
      max = bytes;
      top = lang;
    }
  }
  return top;
};

const getLanguageDistribution = (languages) => {
  const total = Object.values(languages || {}).reduce((s, b) => s + b, 0);
  if (!total) return [];
  return Object.entries(languages)
    .map(([lang, bytes]) => ({ lang, pct: Math.round((bytes / total) * 100) }))
    .sort((a, b) => b.pct - a.pct);
};

// Commit/activity helpers
const getLastCommitDaysAgo = (commits) => {
  if (!commits || commits.length === 0) return null;
  const latest = commits
    .map((c) => new Date(c.commit?.author?.date))
    .filter((d) => !isNaN(d))
    .sort((a, b) => b - a)[0];
  if (!latest) return null;
  const now = new Date();
  return Math.round((now - latest) / (1000 * 60 * 60 * 24));
};

const getCommitCadence = (commits, weeks = 12) => {
  const now = new Date();
  const bins = new Array(weeks).fill(0);
  for (const c of commits || []) {
    const d = new Date(c.commit?.author?.date);
    if (isNaN(d)) continue;
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks >= 0 && diffWeeks < weeks) bins[diffWeeks] += 1;
  }
  const avg = bins.reduce((s, n) => s + n, 0) / weeks;
  const recentAvg = bins.slice(0, 4).reduce((s, n) => s + n, 0) / 4;
  const earlierAvg = bins.slice(4).reduce((s, n) => s + n, 0) / Math.max(weeks - 4, 1);
  let trend = 'stable';
  if (earlierAvg > 0 && recentAvg > earlierAvg * 1.2) trend = 'increasing';
  else if (earlierAvg > 0 && recentAvg < earlierAvg * 0.8) trend = 'decreasing';
  return { bins, avg: Math.round(avg * 10) / 10, recentAvg: Math.round(recentAvg * 10) / 10, earlierAvg: Math.round(earlierAvg * 10) / 10, trend };
};

// Contributor helpers
const getBusFactorStats = (commits) => {
  const counts = new Map();
  for (const c of commits || []) {
    const login = c.author?.login || c.commit?.author?.name || 'unknown';
    counts.set(login, (counts.get(login) || 0) + 1);
  }
  const total = Array.from(counts.values()).reduce((s, n) => s + n, 0);
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  let cumulative = 0;
  let bus = 0;
  for (const [, n] of sorted) {
    cumulative += n;
    bus += 1;
    if (cumulative >= total * 0.5) break;
  }
  const topShare = total ? Math.round((sorted[0]?.[1] / total) * 100) : 0;
  const dominanceRisk = topShare >= 60;
  return { busFactor: bus || 1, topContributorSharePct: topShare, dominanceRisk };
};

// Generate AI analysis based on repository data
const generateAIAnalysis = (repoData, languages, commits, contributors) => {
  const languageList = Object.keys(languages || {});
  const primaryLanguage = repoData.language || getTopLanguage(languages) || 'Unknown';
  const dist = getLanguageDistribution(languages);
  const lastCommitDays = getLastCommitDaysAgo(commits);
  const cadence = getCommitCadence(commits);
  const busStats = getBusFactorStats(commits);

  const stars = repoData.stargazers_count || 0;
  const forks = repoData.forks_count || 0;
  const issuesOpen = repoData.open_issues_count || 0;

  const distSummary = dist.slice(0, 3).map(({ lang, pct }) => `${lang} ${pct}%`).join(', ');
  const cadenceText = `${cadence.avg}/week (last 12 weeks, ${cadence.trend})`;
  const lastCommitText = lastCommitDays == null ? 'unknown' : `${lastCommitDays} days ago`;

  const summary = `${repoData.full_name || 'Repository'} is primarily ${primaryLanguage}. Stars ${stars}, forks ${forks}. Average commit cadence ~${cadenceText}; last commit ${lastCommitText}. Bus factor ≈ ${busStats.busFactor} (top contributor ${busStats.topContributorSharePct}%).`;

  const strengths = [
    distSummary ? `Balanced stack: ${distSummary}` : `Focused stack: ${primaryLanguage}.`,
    cadence.recentAvg >= 1 ? `Active development with ~${cadence.recentAvg} commits/week recently.` : 'Low recent commit volume but historically stable.',
    stars > 1000 ? 'Strong community interest (1000+ stars).' : stars > 100 ? 'Good community interest (100+ stars).' : 'Emerging project; room to grow star engagement.',
    forks > 100 ? 'High fork count suggests adoption and experimentation.' : forks > 10 ? 'Some forks indicate external usage.' : 'Limited forks; consider increasing visibility.',
    repoData.description ? 'Clear description improves discoverability and onboarding.' : 'Add a concise description to clarify purpose.',
  ];

  const improvements = [];
  if (issuesOpen > 50) improvements.push(`High open issue backlog (${issuesOpen}). Prioritize triage and labeling.`);
  else if (issuesOpen > 10) improvements.push(`Moderate open issues (${issuesOpen}). Establish SLAs and cleanup stale items.`);

  if (lastCommitDays != null && lastCommitDays > 30) improvements.push('Inactivity risk: last commit over 30 days ago. Plan a maintenance cycle.');
  if (busStats.dominanceRisk) improvements.push(`Bus factor risk: one contributor drives ~${busStats.topContributorSharePct}% of commits. Encourage code reviews and shared ownership.`);

  const docScore = calculateDocumentationScore(repoData);
  if (docScore < 60) {
    improvements.push('Documentation gaps: add README badges, contribution guide, and quickstart examples.');
  } else {
    strengths.push('Documentation signals look healthy (description/wiki/homepage present).');
  }

  improvements.push('Automate CI with tests and linting; add coverage reports to improve reliability.');
  improvements.push('Publish a roadmap and release notes to align community expectations.');

  const technologies = [
    ...(languageList.length > 0 ? languageList : ['Unknown']),
    primaryLanguage,
    'Git'
  ];

  return { summary, strengths, improvements, technologies };
};