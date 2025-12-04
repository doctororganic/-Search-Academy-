
import React, { useState } from 'react';
import { 
  User, Activity, Heart, ArrowRight, ArrowLeft, Check, 
  Scale, Ruler, Calendar, Utensils, Globe, AlertCircle, ChevronRight 
} from 'lucide-react';
import { Language } from '../types';

interface FormBuilderProps {
  language: Language;
  onGenerate: (data: any) => void;
  isGenerating: boolean;
}

const STEPS = [
  { id: 1, key: 'personal', title: { en: 'Personal', ar: 'الشخصية' }, icon: User },
  { id: 2, key: 'metrics', title: { en: 'Body Metrics', ar: 'القياسات' }, icon: Scale },
  { id: 3, key: 'lifestyle', title: { en: 'Lifestyle', ar: 'نمط الحياة' }, icon: Activity },
];

export default function FormBuilder({ language, onGenerate, isGenerating }: FormBuilderProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    region: 'Saudi Arabia',
    weight_kg: '',
    height_cm: '',
    diseases: [] as string[], // Kept in state for compatibility but not shown in UI
    activity_level: 'Moderate',
    goal: 'Weight Loss',
    diet_preference: 'Standard',
    budget: 'Standard',
    pregnant: 'No'
  });

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {language === 'en' ? 'Full Name' : 'الاسم الكامل'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder={language === 'en' ? 'e.g. John Doe' : 'مثال: أحمد محمد'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'en' ? 'Age' : 'العمر'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', Number(e.target.value))}
                    className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'en' ? 'Gender' : 'الجنس'}
                </label>
                <div className="flex gap-2">
                  {['Male', 'Female'].map(g => (
                    <button
                      key={g}
                      onClick={() => handleChange('gender', g)}
                      className={`flex-1 py-3 rounded-xl border transition-all ${
                        formData.gender === g 
                          ? 'bg-primary text-white border-primary shadow-lg shadow-emerald-200 dark:shadow-none' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary'
                      }`}
                    >
                      {language === 'en' ? g : (g === 'Male' ? 'ذكر' : 'أنثى')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {language === 'en' ? 'Country / Region' : 'الدولة / المنطقة'}
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-slate-400" size={20} />
                <select
                  value={formData.region}
                  onChange={(e) => handleChange('region', e.target.value)}
                  className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none appearance-none"
                >
                  <option value="Saudi Arabia">{language === 'en' ? 'Saudi Arabia' : 'السعودية'}</option>
                  <option value="UAE">{language === 'en' ? 'UAE' : 'الإمارات'}</option>
                  <option value="Kuwait">{language === 'en' ? 'Kuwait' : 'الكويت'}</option>
                  <option value="Qatar">{language === 'en' ? 'Qatar' : 'قطر'}</option>
                  <option value="Bahrain">{language === 'en' ? 'Bahrain' : 'البحرين'}</option>
                  <option value="Oman">{language === 'en' ? 'Oman' : 'عمان'}</option>
                  <option value="Morocco">{language === 'en' ? 'Morocco' : 'المغرب'}</option>
                  <option value="Algeria">{language === 'en' ? 'Algeria' : 'الجزائر'}</option>
                  <option value="Libya">{language === 'en' ? 'Libya' : 'ليبيا'}</option>
                  <option value="Iraq">{language === 'en' ? 'Iraq' : 'العراق'}</option>
                  <option value="Egypt">{language === 'en' ? 'Egypt' : 'مصر'}</option>
                  <option value="Levant">{language === 'en' ? 'Levant (Jordan/Lebanon)' : 'الشام'}</option>
                </select>
              </div>
            </div>

            {formData.gender === 'Female' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'en' ? 'Are you pregnant?' : 'هل أنت حامل؟'}
                </label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleChange('pregnant', opt)}
                      className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                        formData.pregnant === opt 
                          ? 'bg-secondary text-white border-secondary' 
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {language === 'en' ? opt : (opt === 'Yes' ? 'نعم' : 'لا')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {language === 'en' ? 'Current Weight (kg)' : 'الوزن الحالي (كغ)'}
              </label>
              <div className="relative">
                <Scale className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="number"
                  value={formData.weight_kg}
                  onChange={(e) => handleChange('weight_kg', e.target.value)}
                  className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="70"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {language === 'en' ? 'Height (cm)' : 'الطول (سم)'}
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="number"
                  value={formData.height_cm}
                  onChange={(e) => handleChange('height_cm', e.target.value)}
                  className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="170"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {language === 'en' ? 'Primary Goal' : 'الهدف الرئيسي'}
              </label>
              <select
                value={formData.goal}
                onChange={(e) => handleChange('goal', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Weight Loss">{language === 'en' ? 'Weight Loss' : 'خسارة الوزن'}</option>
                <option value="Muscle Gain">{language === 'en' ? 'Muscle Gain' : 'بناء العضلات'}</option>
                <option value="Maintenance">{language === 'en' ? 'Healthy Maintenance' : 'الحفاظ على الصحة'}</option>
                <option value="Keto">{language === 'en' ? 'Keto Adaptation' : 'نظام الكيتو'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {language === 'en' ? 'Activity Level' : 'مستوى النشاط'}
              </label>
              <select
                value={formData.activity_level}
                onChange={(e) => handleChange('activity_level', e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Sedentary">{language === 'en' ? 'Sedentary (Office Job)' : 'خامل (عمل مكتبي)'}</option>
                <option value="Light">{language === 'en' ? 'Lightly Active' : 'نشاط خفيف'}</option>
                <option value="Moderate">{language === 'en' ? 'Moderate (3-4 days/week)' : 'متوسط (3-4 أيام/أسبوع)'}</option>
                <option value="Active">{language === 'en' ? 'Very Active' : 'نشيط جداً'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'en' ? 'Preferences' : 'تفضيلات'}
                </label>
                <select
                  value={formData.diet_preference}
                  onChange={(e) => handleChange('diet_preference', e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                >
                  <option value="Standard">Standard</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Ramadan">Ramadan</option>
                  <option value="Keto">Keto</option>
                  <option value="Dirty Bulk">Dirty Bulk</option>
                </select>
               </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'en' ? 'Budget' : 'الميزانية'}
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                >
                  <option value="Standard">Standard</option>
                  <option value="Low">Budget Friendly</option>
                </select>
               </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
      {/* Progress Header */}
      <div className="bg-pale/50 dark:bg-slate-900 p-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            {language === 'en' ? 'Create Your Plan' : 'أنشئ خطتك'}
          </h2>
          <span className="text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-600">
            {step} / {STEPS.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <div 
              key={s.id}
              className={`h-2 rounded-full flex-1 transition-all duration-500 ${
                step >= s.id ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Step Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-pale dark:bg-yellow-900/30 text-accent rounded-xl">
            {React.createElement(STEPS[step-1].icon, { size: 24 })}
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {language === 'en' ? STEPS[step-1].title.en : STEPS[step-1].title.ar}
          </h3>
        </div>

        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors
              ${step === 1 
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}
            `}
          >
            {language === 'en' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            {language === 'en' ? 'Back' : 'رجوع'}
          </button>

          {step < STEPS.length ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              {language === 'en' ? 'Next' : 'التالي'}
              {language === 'en' ? <ChevronRight size={20} /> : <ChevronRight className="rotate-180" size={20} />}
            </button>
          ) : (
            <button
              onClick={() => onGenerate(formData)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 dark:shadow-none disabled:opacity-70 disabled:cursor-wait"
            >
              {isGenerating ? (
                <span className="animate-pulse">{language === 'en' ? 'Processing...' : 'جاري المعالجة...'}</span>
              ) : (
                <>
                  <Check size={20} />
                  {language === 'en' ? 'Generate My Plan' : 'إنشاء خطتي'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
