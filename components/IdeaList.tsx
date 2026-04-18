import React from 'react';
import { ProjectIdea } from '../types';
import { Clock, Hammer, BarChart, ChevronRight } from 'lucide-react';

interface IdeaListProps {
  ideas: ProjectIdea[];
  onSelect: (idea: ProjectIdea) => void;
  onBack: () => void;
}

const IdeaList: React.FC<IdeaListProps> = ({ ideas, onSelect, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-amber-900">为你推荐的改造方案</h2>
        <button 
          onClick={onBack}
          className="text-amber-700 hover:text-amber-900 font-medium underline decoration-2 underline-offset-4"
        >
          重新输入
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ideas.map((idea) => (
          <div 
            key={idea.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer flex flex-col"
            onClick={() => onSelect(idea)}
          >
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-3">
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold tracking-wide uppercase">
                  {idea.category}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                  idea.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  idea.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {idea.difficulty === 'Easy' ? '简单' : idea.difficulty === 'Medium' ? '进阶' : '挑战'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                {idea.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {idea.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-500" />
                    {idea.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                    <Hammer className="w-4 h-4 text-amber-500" />
                    {idea.toolsNeeded.length} 种工具
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center group-hover:bg-amber-50 transition-colors">
               <span className="text-sm font-semibold text-gray-500 group-hover:text-amber-700">查看详情</span>
               <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeaList;