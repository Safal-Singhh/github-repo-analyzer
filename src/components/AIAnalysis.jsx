import { FaLightbulb, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const AIAnalysis = ({ analysis }) => {
  return (
    <div className="section-card">
      <h2 className="text-2xl text-white font-semibold mb-6">AI Analysis</h2>
      
      <div className="space-y-6">
        {/* Project Summary (top) */}
        <div className="info-box-emerald">
          <div className="flex items-center gap-3 mb-3">
            <FaLightbulb className="text-emerald-400" size={20} />
            <h3 className="text-xl text-white font-medium">Project Summary</h3>
          </div>
          <p className="text-slate-300">{analysis.summary}</p>
        </div>
        
        <div>
          <h3 className="text-xl text-white font-medium mb-4">Strengths</h3>
          <div className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="list-item-green">
                <FaCheckCircle className="text-green-400 mt-1" />
                <p className="text-slate-300">{strength}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl text-white font-medium mb-4">Areas for Improvement</h3>
          <div className="space-y-3">
            {analysis.improvements.map((improvement, index) => (
              <div key={index} className="list-item-orange">
                <FaExclamationTriangle className="text-orange-400 mt-1" />
                <p className="text-slate-300">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl text-white font-medium mb-4">Technology Stack</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.technologies.map((tech, index) => (
              <span key={index} className="keyword-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Contribution Ideas (optional) */}
        {Array.isArray(analysis.contributionIdeas) && analysis.contributionIdeas.length > 0 && (
          <div>
            <h3 className="text-xl text-white font-medium mb-4">Contribution Ideas</h3>
            <div className="space-y-4">
              {analysis.contributionIdeas.map((idea, idx) => (
                <div key={idx} className="bg-card-gradient rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg text-white font-medium">{idea.title}</h4>
                    <div className="flex gap-2">
                      {idea.difficulty && (
                        <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-200 border border-slate-600">{idea.difficulty}</span>
                      )}
                      {idea.impact && (
                        <span className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-200 border border-slate-600">impact: {idea.impact}</span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-300 mt-2">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onboarding Tips (optional) */}
        {Array.isArray(analysis.onboardingTips) && analysis.onboardingTips.length > 0 && (
          <div>
            <h3 className="text-xl text-white font-medium mb-4">Onboarding Tips</h3>
            <div className="space-y-3">
              {analysis.onboardingTips.map((tip, idx) => (
                <div key={idx} className="list-item-green">
                  <FaCheckCircle className="text-green-400 mt-1" />
                  <p className="text-slate-300">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risks (optional) */}
        {Array.isArray(analysis.risks) && analysis.risks.length > 0 && (
          <div>
            <h3 className="text-xl text-white font-medium mb-4">Risks</h3>
            <div className="space-y-3">
              {analysis.risks.map((risk, idx) => (
                <div key={idx} className="list-item-orange">
                  <FaExclamationTriangle className="text-orange-400 mt-1" />
                  <p className="text-slate-300">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;