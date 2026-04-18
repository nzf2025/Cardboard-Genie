import React, { useState } from 'react';
import { Package, Sparkles, Box, Archive, Heart } from 'lucide-react';
import { UserInput } from '../types';

interface InputFormProps {
  onSubmit: (input: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [boxType, setBoxType] = useState('');
  const [intendedUse, setIntendedUse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (boxType && intendedUse) {
      onSubmit({ boxType, intendedUse, boxCondition: 'Good' });
    }
  };

  const commonBoxes = [
    { label: '快递纸箱', value: '普通的瓦楞纸快递箱', icon: <Package className="w-5 h-5" /> },
    { label: '鞋盒', value: '结实的鞋盒', icon: <Archive className="w-5 h-5" /> },
    { label: '食品包装盒', value: '麦片或饼干的薄纸盒', icon: <Box className="w-5 h-5" /> },
  ];

  const commonUses = [
    { label: '收纳整理', value: '桌面或衣柜的收纳工具' },
    { label: '家居装饰', value: '提升家里氛围的装饰品' },
    { label: '宠物玩具', value: '给猫咪或宠物的玩具' },
    { label: '儿童玩具', value: '适合小孩子的趣味玩具' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
      <div className="bg-amber-500 p-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8" />
          开始你的改造
        </h2>
        <p className="opacity-90">告诉我你有什么箱子，我来帮你变废为宝</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Step 1: Box Type */}
        <div className="space-y-4">
          <label className="block text-amber-900 font-semibold text-lg mb-2">
            1. 你收集了什么样的纸箱？
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {commonBoxes.map((box) => (
              <button
                key={box.label}
                type="button"
                onClick={() => setBoxType(box.value)}
                className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  boxType === box.value
                    ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold shadow-md'
                    : 'border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
              >
                {box.icon}
                <span>{box.label}</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="或者手动输入，例如：大号冰箱包装箱..."
            value={boxType}
            onChange={(e) => setBoxType(e.target.value)}
            className="w-full mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none transition-all"
          />
        </div>

        {/* Step 2: Intended Use */}
        <div className="space-y-4">
          <label className="block text-amber-900 font-semibold text-lg mb-2">
            2. 你想做什么类型的物品？
          </label>
          <div className="grid grid-cols-2 gap-3">
            {commonUses.map((use) => (
              <button
                key={use.label}
                type="button"
                onClick={() => setIntendedUse(use.value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  intendedUse === use.value
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-md'
                    : 'border-gray-200 text-gray-600 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                {use.label}
              </button>
            ))}
          </div>
           <input
            type="text"
            placeholder="例如：想要一个放杂物的置物架..."
            value={intendedUse}
            onChange={(e) => setIntendedUse(e.target.value)}
            className="w-full mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none transition-all"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!boxType || !intendedUse || isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在构思创意...
            </>
          ) : (
            <>
              <Heart className="w-6 h-6 fill-current" />
              生成创意方案
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;