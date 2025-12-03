import React, { useState, useEffect } from 'react';
import { Layout, Globe, Moon, Sun, Menu, ChevronRight, ChevronLeft, AlertOctagon, Loader2, Brain, Leaf, ShieldCheck, Zap } from 'lucide-react';
import FormBuilder from './components/FormBuilder';
import Dashboard from './components/Dashboard';
import { Automation } from './services/automation';
import { Language, PlanData } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<'form' | 'dashboard'>('form');
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persistence: Load Plan Data
  useEffect(() => {
    const savedPlan = localStorage.getItem('ac_plan_data');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        setPlanData(parsed);
      } catch (e) {
        console.error("Failed to load saved plan");
      }
    }
  }, []);

  // Handle RTL
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleGenerate = async (formData: any) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await Automation.process(formData, language);
      setPlanData(result);
      localStorage.setItem('ac_plan_data', JSON.stringify(result)); 
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(language === 'en' 
        ? "Failed to generate plan. Please check your network connection and try again." 
        : "فشل في إنشاء الخطة. يرجى التحقق من الاتصال بالشبكة والمحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const FeatureBox = ({ icon: Icon, title, desc, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group hover:-translate-y-2 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="text-white" size={24} />
      </div>
      <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-[60] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center animate-fadeIn">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="text-primary animate-pulse" size={32} />
              </div>
            </div>
            <h3 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">
              {language === 'en' ? 'Crafting Your Protocol...' : 'جاري صياغة البروتوكول...'}
            </h3>
            <p className="text-slate-500 mt-2 animate-pulse">
              {language === 'en' ? 'Consulting expert databases & AI' : 'استشارة قواعد بيانات الخبراء والذكاء الاصطناعي'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('form')}>
              <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                <Layout size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Doctor<span className="text-primary">Healthy</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {planData && currentView === 'form' && (
                 <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="hidden md:flex text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {language === 'en' ? 'Go to My Plan' : 'الذهاب لخطتي'}
                </button>
              )}
              {currentView === 'dashboard' && (
                <button 
                  onClick={() => setCurrentView('form')}
                  className="hidden md:flex text-sm font-medium text-slate-500 hover:text-primary transition-colors"
                >
                  {language === 'en' ? 'Start Over' : 'ابدأ من جديد'}
                </button>
              )}

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

              <button 
                onClick={() => setLanguage(prev => prev === 'en' ? 'ar' : 'en')}
                className="font-bold text-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-colors w-8"
              >
                {language === 'en' ? 'AR' : 'EN'}
              </button>
              
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {currentView === 'form' ? (
          <div className="animate-slideIn">
            
            {/* Hero Section */}
            <div className="text-center mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pale dark:bg-yellow-900/30 text-accent dark:text-yellow-400 text-sm font-bold mb-4 animate-bounce">
                <Zap size={16} />
                {language === 'en' ? 'New: Ramadan & Keto Plans Added' : 'جديد: خطط رمضان والكيتو'}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {language === 'en' ? 'Transform Your Health with' : 'حول صحتك مع'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  {language === 'en' ? 'Doctor Healthy1' : 'دكتور هيلثي1'}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {language === 'en' 
                  ? 'Get a fully personalized nutrition and workout protocol tailored to your region, lifestyle, and health goals in seconds.' 
                  : 'احصل على بروتوكول تغذية وتمرين مخصص بالكامل ومصمم ليناسب منطقتك وأسلوب حياتك وأهدافك الصحية في ثوانٍ.'}
              </p>
            </div>

            {/* Animated Feature Boxes */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <FeatureBox 
                icon={Brain} 
                title={language === 'en' ? 'Smart Automation' : 'أتمتة ذكية'} 
                desc={language === 'en' ? 'Our engine selects the perfect expert plan for you instantly.' : 'محركنا يختار الخطة المثالية لك فوراً.'}
                color="bg-secondary"
              />
              <FeatureBox 
                icon={Leaf} 
                title={language === 'en' ? 'Culturally Tailored' : 'مخصص ثقافياً'} 
                desc={language === 'en' ? 'Meals from your region using local ingredients you love.' : 'وجبات من منطقتك باستخدام مكونات محلية تحبها.'}
                color="bg-primary"
              />
              <FeatureBox 
                icon={ShieldCheck} 
                title={language === 'en' ? 'Medically Sound' : 'سليم طبياً'} 
                desc={language === 'en' ? 'Safe protocols for Diabetes, Celiac, and Pregnancy.' : 'بروتوكولات آمنة للسكري والسيلياك والحمل.'}
                color="bg-accent"
              />
            </div>

            {/* Intake Form */}
            <div id="form-section">
              <FormBuilder 
                language={language} 
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </div>

          </div>
        ) : (
          planData && (
            <div className="animate-slideIn">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {language === 'en' ? 'Your Personalized Dashboard' : 'لوحة التحكم الخاصة بك'}
                </h2>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  {language === 'en' ? 'Live Plan' : 'خطة نشطة'}
                </div>
              </div>
              <Dashboard data={planData} language={language} />
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 bg-white dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1">Doctor Healthy</h4>
            <p className="text-slate-500 text-sm">Empowering health through heritage and technology.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
             <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-primary transition-colors">Contact Expert</a>
          </div>
        </div>
      </footer>
    </div>
  );
}