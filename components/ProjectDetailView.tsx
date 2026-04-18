import React, { useState, useEffect } from 'react';
import { ProjectDetail, ProjectIdea } from '../types';
import { generateProjectDetails, generateProjectImage } from '../services/geminiService';
import { ArrowLeft, CheckCircle, AlertTriangle, Lightbulb, Image as ImageIcon, Download, Share2, Sparkles, Check } from 'lucide-react';

interface ProjectDetailViewProps {
  idea: ProjectIdea;
  onBack: () => void;
}

const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({ idea, onBack }) => {
  const [details, setDetails] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await generateProjectDetails(idea);
        setDetails(result);
      } catch (err) {
        setError('获取项目详情失败，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [idea]);

  const handleGenerateImage = async () => {
    if (!details || imageLoading || imageUrl) return;
    setImageLoading(true);
    try {
      const url = await generateProjectImage(details.title, details.description);
      if (url) {
        setImageUrl(url);
      } else {
        // Fallback or error
        alert("图片生成好像出了点问题，可能需要重试。");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImageLoading(false);
    }
  };

  const handleShare = () => {
    // Simulate copying link
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-amber-800 text-lg font-medium animate-pulse">正在生成详细步骤...</p>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={onBack} className="text-amber-600 font-bold hover:underline">返回</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-screen sm:min-h-0 animate-fadeIn relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">链接已复制到剪贴板</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-amber-600 p-6 sm:p-10 text-white relative">
        <div className="flex justify-between items-start">
            <button 
            onClick={onBack}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
            >
            <ArrowLeft className="w-6 h-6" />
            </button>

            <button 
            onClick={handleShare}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all flex items-center gap-2"
            title="分享项目"
            >
            <Share2 className="w-5 h-5" />
            </button>
        </div>

        <div className="mt-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">{details.title}</h1>
            <p className="text-amber-100 text-lg max-w-2xl">{details.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-6">
            <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md border border-white/10">
                {details.estimatedTime}
            </span>
             <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md border border-white/10">
                {details.difficulty === 'Easy' ? '简单' : details.difficulty === 'Medium' ? '中等' : '困难'}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 p-8 border-r border-gray-100">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 p-1.5 rounded-lg"><CheckCircle className="w-5 h-5 text-amber-600" /></span>
              制作步骤
            </h3>
            <div className="space-y-6 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-100"></div>
              {details.steps.map((step, index) => (
                <div key={index} className="relative pl-12">
                   <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-amber-500 text-amber-700 flex items-center justify-center font-bold text-sm z-10">
                     {index + 1}
                   </div>
                   <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
             <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 flex gap-4">
                <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-yellow-800 mb-1">小贴士</h4>
                    <p className="text-yellow-800/80 text-sm">{details.tips}</p>
                </div>
             </div>
             <div className="bg-red-50 p-5 rounded-xl border border-red-100 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="font-bold text-red-800 mb-1">安全警告</h4>
                    <p className="text-red-800/80 text-sm">{details.safetyWarning}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar / Tools / Image */}
        <div className="bg-gray-50 p-8 space-y-8">
           {/* Image Generator Section */}
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  效果预览
              </h3>
              
              <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden relative group">
                {imageUrl ? (
                    <>
                        <img src={imageUrl} alt="Generated Project" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                             <a href={imageUrl} download="project-idea.png" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors" title="Download">
                                <Download className="w-5 h-5 text-gray-800" />
                             </a>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                        {imageLoading ? (
                            <>
                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                <span className="text-sm">正在绘制效果图...<br/><span className="text-xs opacity-75">(可能需要几秒钟)</span></span>
                            </>
                        ) : (
                            <>
                                <div className="mb-3 opacity-50">
                                   <Sparkles className="w-10 h-10" />
                                </div>
                                <p className="text-sm mb-4">想看看成品大概长什么样吗？</p>
                                <button 
                                    onClick={handleGenerateImage}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-colors w-full"
                                >
                                    生成AI效果图
                                </button>
                            </>
                        )}
                    </div>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">图片由 AI 生成，仅供参考</p>
           </div>

           <div>
              <h3 className="font-bold text-gray-800 mb-4">所需工具</h3>
              <ul className="space-y-2">
                {details.toolsNeeded.map((tool, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                        {tool}
                    </li>
                ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;