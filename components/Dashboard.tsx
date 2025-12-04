
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Activity, Utensils, Dumbbell, Calendar, Download, ShoppingCart, TrendingUp, CheckCircle, Circle, ChefHat, Lock, Info } from 'lucide-react';
import * as ReactWindow from 'react-window';
import ShoppingList from './ShoppingList';
import ProgressTracker from './ProgressTracker';
import { Language, PlanData, Exercise } from '../types';

// Robust import for FixedSizeList
const List = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList || ReactWindow;

interface DashboardProps {
  data: PlanData;
  language: Language;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export default function Dashboard({ data, language }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'nutrition' | 'meals'>('nutrition');

  // If no data, show empty state
  if (!data) return null;

  const { macros, meals } = data;

  const macroData = [
    { name: language === 'en' ? 'Protein' : 'بروتين', value: macros.protein },
    { name: language === 'en' ? 'Carbs' : 'كارب', value: macros.carbs },
    { name: language === 'en' ? 'Fats' : 'دهون', value: macros.fats },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: language === 'en' ? 'Calories' : 'سعرات', value: `${macros.calories} kcal`, icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: language === 'en' ? 'Protein' : 'بروتين', value: `${macros.protein}g`, icon: Dumbbell, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: language === 'en' ? 'Carbs' : 'كارب', value: `${macros.carbs}g`, icon: Utensils, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: language === 'en' ? 'BMI' : 'كتلة الجسم', value: macros.bmi, icon: TrendingUp, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Calculation Explanation Box (Harris-Benedict) */}
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
        <Info className="text-blue-500 flex-shrink-0 mt-1" size={20} />
        <div>
          <h4 className="font-bold text-blue-800 dark:text-blue-200 text-sm mb-1">
            {language === 'en' ? 'Calculation Methodology' : 'منهجية الحساب'}
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            {language === 'en' 
              ? 'We use the Harris-Benedict equation to estimate your Basal Metabolic Rate (BMR) based on your weight, height, age, and gender. This is multiplied by your activity factor to determine your Total Daily Energy Expenditure (TDEE).' 
              : 'نستخدم معادلة هاريس-بينيديكت لتقدير معدل الأيض الأساسي (BMR) بناءً على وزنك وطولك وعمرك وجنسك. يتم ضرب هذا في عامل نشاطك لتحديد إجمالي استهلاك الطاقة اليومي (TDEE).'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'nutrition', label: language === 'en' ? 'Analysis' : 'التحليل', icon: Activity },
          { id: 'meals', label: language === 'en' ? 'Meal Plan' : 'الوجبات', icon: Calendar },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[500px] p-6 transition-all">
        
        {/* Tab 1: Nutrition Charts */}
        {activeTab === 'nutrition' && (
          <div className="grid md:grid-cols-2 gap-8 items-center h-full animate-fadeIn">
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={macroData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {macroData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                   />
                   <Legend formatter={(value) => <span className="text-slate-700 dark:text-slate-300">{value}</span>} />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div>
               <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">{language === 'en' ? 'Diet Recommendation' : 'توصيات النظام الغذائي'}</h3>
               <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                 {macros.recommendation || (language === 'en' 
                   ? 'Based on your activity level and goals, a balanced diet focusing on lean proteins and complex carbohydrates is recommended. Ensure adequate hydration.'
                   : 'بناءً على مستوى نشاطك وأهدافك، يوصى بنظام غذائي متوازن يركز على البروتينات الخالية من الدهون والكربوهيدرات المعقدة. تأكد من شرب كمية كافية من الماء.')}
               </p>
               <div className="bg-pale dark:bg-pale-dark/20 border border-yellow-200 dark:border-yellow-900 p-4 rounded-lg text-slate-800 dark:text-slate-200 text-sm">
                 <strong className="block mb-1 text-accent">{language === 'en' ? 'Pro Tip:' : 'نصيحة احترافية:'}</strong>
                 {language === 'en' ? 'Try to consume protein within 30 minutes of exercise for optimal recovery.' : 'حاول تناول البروتين في غضون 30 دقيقة من التمرين للتعافي الأمثل.'}
               </div>
             </div>
          </div>
        )}

        {/* Tab 2: Meal Plan */}
        {activeTab === 'meals' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{language === 'en' ? 'Daily Schedule' : 'الجدول اليومي'}</h3>
              <button className="text-primary flex items-center gap-2 text-sm hover:underline" onClick={() => window.print()}>
                <Download size={16} /> {language === 'en' ? 'Print / PDF' : 'طباعة / PDF'}
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {meals?.map((meal: any, idx: number) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-all cursor-move group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-primary">
                        <ChefHat size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">{meal.type}</span>
                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{meal.name}</h4>
                      </div>
                    </div>
                    <span className="text-xs bg-pale dark:bg-pale-dark/20 text-accent dark:text-yellow-400 px-3 py-1 rounded-full font-bold">{meal.calories} kcal</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm border border-slate-100 dark:border-slate-700">
                      <strong className="block text-slate-700 dark:text-slate-300 mb-1 text-xs uppercase tracking-wide opacity-70">
                        {language === 'en' ? 'Ingredients' : 'المكونات'}
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {meal.ingredients?.join(', ')}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm border border-slate-100 dark:border-slate-700">
                       <strong className="block text-slate-700 dark:text-slate-300 mb-1 text-xs uppercase tracking-wide opacity-70">
                        {language === 'en' ? 'Preparation' : 'التحضير'}
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        {language === 'en' 
                          ? 'Mix ingredients thoroughly. Cook or assemble as per standard recipe guidelines for optimal nutrition.' 
                          : 'تخلط المكونات جيدا. اطبخ أو اجمع وفقًا لإرشادات الوصفة القياسية للحصول على تغذية مثالية.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Plan Subscription Box */}
            <div className="mt-8 p-6 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 flex flex-col md:flex-row items-center justify-between gap-4 group hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                  <Lock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white">
                    {language === 'en' ? 'Unlock Full Month Plan' : 'احصل على الخطة الشهرية الكاملة'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {language === 'en' 
                      ? 'Get a detailed 30-day schedule with shopping lists and recipes by subscribing to our Pro Plan.' 
                      : 'احصل على جدول مفصل لمدة 30 يومًا مع قوائم التسوق والوصفات من خلال الاشتراك في الخطة الاحترافية.'}
                  </p>
                </div>
              </div>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all whitespace-nowrap">
                {language === 'en' ? 'Upgrade to Pro' : 'الترقية للبرو'}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
