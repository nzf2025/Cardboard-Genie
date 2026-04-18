import React, { useState } from 'react';
import { PackageOpen, Recycle, Sparkles, Heart, Lightbulb, Box, Archive, Package } from 'lucide-react';
import InputForm from './components/InputForm';
import IdeaList from './components/IdeaList';
import ProjectDetailView from './components/ProjectDetailView';
import { generateCreativeIdeas } from './services/geminiService';
import { AppState, ProjectIdea, UserInput } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputSubmit = async (input: UserInput) => {
    setIsLoading(true);
    setAppState(AppState.LOADING_IDEAS);
    try {
      const generatedIdeas = await generateCreativeIdeas(input.boxType, input.intendedUse);
      setIdeas(generatedIdeas);
      setAppState(AppState.IDEAS_LIST);
    } catch (error) {
      console.error(error);
      alert("抱歉，获取创意时出现了一些问题。请检查API Key配置或稍后再试。");
      setAppState(AppState.INPUT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIdea = (idea: ProjectIdea) => {
    setSelectedIdea(idea);
    setAppState(AppState.PROJECT_DETAIL);
  };

  const handleBackToInput = () => {
    setAppState(AppState.INPUT);
    setIdeas([]);
  };

  const handleBackToList = () => {
    setAppState(AppState.IDEAS_LIST);
    setSelectedIdea(null);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 selection:bg-amber-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => {
                if(appState !== AppState.INPUT) {
                  if(window.confirm("回到首页？当前进度将丢失。")) handleBackToInput();
                }
              }}
            >
              <div className="bg-amber-500 p-2 rounded-lg group-hover:bg-amber-600 transition-colors">
                 <PackageOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-amber-900">
                纸箱焕新工坊
                <span className="hidden sm:inline-block ml-2 text-sm font-normal text-amber-700/60">Cardboard Genie</span>
              </span>
            </div>
            
            <a 
                href="https://ai.google.dev/" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-medium text-gray-400 hover:text-amber-600 flex items-center gap-1 transition-colors"
            >
                Powered by Gemini <Recycle className="w-3 h-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {appState === AppState.INPUT && (
           <div className="animate-fadeIn space-y-20">
              <section className="text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-900 tracking-tight leading-tight">
                    发现废弃纸箱的<br className="sm:hidden" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">无限可能</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    不要急着扔掉那些快递盒和鞋盒！这里是你的创意变废为宝基地。<br className="hidden sm:inline" />告诉我们你有的材料，AI 将为你量身定制实用又美观的家居改造方案。
                    </p>
                </div>
                <InputForm onSubmit={handleInputSubmit} isLoading={isLoading} />
              </section>

              {/* How it works Section */}
              <section>
                <h2 className="text-2xl font-bold text-center text-amber-900 mb-10">只需三步，变废为宝</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 bg-white rounded-2xl shadow-sm border border-amber-50 hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                        <PackageOpen className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-800">1. 描述你的纸箱</h3>
                    <p className="text-gray-500 leading-relaxed">输入你手边的纸箱类型，比如快递盒、鞋盒或包装箱。</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl shadow-sm border border-amber-50 hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-800">2. 获取AI创意</h3>
                    <p className="text-gray-500 leading-relaxed">Gemini AI 为你生成专属改造灵感、详细步骤和效果图。</p>
                    </div>
                    <div className="p-8 bg-white rounded-2xl shadow-sm border border-amber-50 hover:-translate-y-1 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                        <Heart className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-800">3. 享受DIY乐趣</h3>
                    <p className="text-gray-500 leading-relaxed">跟随教程，亲手将废弃物变成独一无二的家居好物。</p>
                    </div>
                </div>
              </section>

              {/* Inspiration Gallery */}
              <section className="pb-10">
                <h2 className="text-2xl font-bold text-amber-900 mb-8 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-amber-500" />
                    热门改造灵感
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Static Card 1 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-default group">
                        <div className="h-48 bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <Box className="w-20 h-20 text-orange-300 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-3">
                                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">中等难度</span>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">家居娱乐</span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">简易鞋盒投影仪</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">只需要一个鞋盒、一块放大镜和你的手机，就能在墙上投射出家庭影院般的画面。周末宅家必备神器！</p>
                        </div>
                    </div>

                    {/* Static Card 2 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-default group">
                        <div className="h-48 bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                            <Archive className="w-20 h-20 text-emerald-300 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-3">
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">简单上手</span>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">宠物用品</span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">瓦楞纸猫抓板</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">将废弃的瓦楞纸箱裁切成条，卷起来或拼接固定，制作一个环保耐用的猫咪磨爪乐园，省钱又环保。</p>
                        </div>
                    </div>

                    {/* Static Card 3 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-default group">
                        <div className="h-48 bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Package className="w-20 h-20 text-blue-300 group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6">
                             <div className="flex gap-2 mb-3">
                                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">挑战项目</span>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">收纳整理</span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">桌面抽屉式收纳柜</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">利用硬纸板制作多层抽屉结构，外贴装饰纸，完美收纳文具和杂物，让你的书桌井井有条。</p>
                        </div>
                    </div>
                </div>
              </section>
           </div>
        )}

        {appState === AppState.LOADING_IDEAS && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
             <div className="relative">
                <div className="w-20 h-20 border-4 border-amber-200 rounded-full animate-ping absolute top-0 left-0"></div>
                <div className="w-20 h-20 border-4 border-amber-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
             </div>
             <p className="mt-8 text-xl font-medium text-amber-800 animate-pulse">
                AI 正在头脑风暴中...
             </p>
             <p className="text-gray-500 mt-2">正在分析你的纸箱结构，寻找最佳改造方案</p>
          </div>
        )}

        {appState === AppState.IDEAS_LIST && (
          <IdeaList 
            ideas={ideas} 
            onSelect={handleSelectIdea} 
            onBack={handleBackToInput} 
          />
        )}

        {appState === AppState.PROJECT_DETAIL && selectedIdea && (
          <ProjectDetailView 
            idea={selectedIdea} 
            onBack={handleBackToList} 
          />
        )}

      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-100 mt-auto bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
           <p>&copy; {new Date().getFullYear()} Cardboard Genie. Make with ❤️ & Cardboard.</p>
           <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-amber-600 transition-colors">隐私政策</a>
              <a href="#" className="hover:text-amber-600 transition-colors">使用条款</a>
              <a href="#" className="hover:text-amber-600 transition-colors">关于我们</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

export default App;