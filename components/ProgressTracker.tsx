
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Plus, Save } from 'lucide-react';
import { Language, WeightEntry } from '../types';

interface ProgressTrackerProps {
  language: Language;
}

export default function ProgressTracker({ language }: ProgressTrackerProps) {
  const [data, setData] = useState<WeightEntry[]>([]);
  const [currentWeight, setCurrentWeight] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('ac_progress');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const addEntry = () => {
    if (!currentWeight) return;
    
    const newEntry: WeightEntry = {
      date: new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG'),
      weight: parseFloat(currentWeight)
    };

    const newData = [...data, newEntry];
    setData(newData);
    localStorage.setItem('ac_progress', JSON.stringify(newData));
    setCurrentWeight('');
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            {language === 'en' ? 'Weight Tracker' : 'تتبع الوزن'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'en' ? 'Visualize your journey over time' : 'تخيل رحلتك مع مرور الوقت'}
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="number" 
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder={language === 'en' ? 'kg' : 'كغ'}
            className="w-24 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
          />
          <button 
            onClick={addEntry}
            disabled={!currentWeight}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Plus size={16} />
            {language === 'en' ? 'Log Weight' : 'سجل الوزن'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 h-80">
        {data.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <TrendingUp size={48} className="mb-4 opacity-20" />
            <p>{language === 'en' ? 'Add at least 2 entries to see the graph' : 'أضف قيدين على الأقل لرؤية الرسم البياني'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
