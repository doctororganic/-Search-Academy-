
import { PlanData, UserProfile, Meal, Exercise } from '../types';
import { KNOWLEDGE_BASE } from './knowledgeBase';
import { generateNutritionPlan } from './geminiService';

export class Automation {
  
  static async process(formData: any, language: 'en' | 'ar'): Promise<PlanData> {
    console.log("AUTOMATION: Starting orchestration for", formData);

    const tdee = this.calculateTDEE(formData);
    const goal = formData.goal?.toLowerCase() || '';
    const region = formData.region?.toLowerCase() || '';
    const dietPref = formData.diet_preference?.toLowerCase() || '';
    const diseases = Array.isArray(formData.diseases) ? formData.diseases : [];

    let rawPlanData = null;
    let strategy = "";

    // --- 1. INTELLIGENT ROUTING LOGIC ---

    // A. Dirty Bulking (High Priority for Muscle Gain)
    if (goal.includes('muscle') && (dietPref === 'standard' || dietPref === 'dirty bulk')) {
      rawPlanData = KNOWLEDGE_BASE.arabian_dirty_bulking_api;
      strategy = "Dirty Bulking";
    }

    // B. Keto (North African / Iraqi priority)
    else if (goal.includes('keto') || dietPref.includes('keto')) {
      rawPlanData = KNOWLEDGE_BASE.north_african_iraqi_keto_api;
      strategy = "North African Keto";
    }

    // C. Low Carb (Gulf Priority)
    else if (goal.includes('weight') && (region.includes('saudi') || region.includes('uae') || region.includes('kuwait') || region.includes('qatar'))) {
      rawPlanData = KNOWLEDGE_BASE.arabian_gulf_low_carb_api;
      strategy = "Gulf Low Carb";
    }

    // D. Intermittent Fasting (Gulf Priority)
    else if (dietPref.includes('fasting') || dietPref.includes('ramadan')) {
      rawPlanData = KNOWLEDGE_BASE.arabian_gulf_intermittent_fasting_api;
      strategy = "Gulf IF";
    }

    // E. Mediterranean (General Health)
    else if (goal.includes('maintenance') || goal.includes('health')) {
      rawPlanData = KNOWLEDGE_BASE.gulf_mediterranean_diet_api;
      strategy = "Gulf Mediterranean";
    }

    // F. Balanced / Default (North Africa / General)
    else {
      // Fallback to balanced if region matches North Africa
      if (['morocco', 'algeria', 'libya', 'tunisia', 'egypt'].some(r => region.includes(r))) {
         rawPlanData = KNOWLEDGE_BASE.north_african_balanced_IF_meal_plan;
         strategy = "North African Balanced";
      } else {
         // Default to Calorie Tier if no specific expert plan found, or use Low Carb API
         rawPlanData = null; 
      }
    }

    console.log(`AUTOMATION: Selected Strategy [${strategy}]`);

    // --- 2. DATA ADAPTERS ---
    
    if (rawPlanData) {
      try {
        const normalizedPlan = this.normalizeData(rawPlanData, strategy, region, tdee, language);
        if (normalizedPlan) return normalizedPlan;
      } catch (e) {
        console.error("AUTOMATION: Adapter failed", e);
      }
    }

    // --- 3. CALORIE TIER FALLBACK ---
    if (!rawPlanData) {
        let expertPlan;
        if (tdee > 2800) expertPlan = KNOWLEDGE_BASE.calorie_tiers.c3000;
        else if (tdee > 1800) expertPlan = KNOWLEDGE_BASE.calorie_tiers.c2000;
        else expertPlan = KNOWLEDGE_BASE.calorie_tiers.c1500;
        
        return this.transformStaticData(expertPlan, formData, language, tdee, "Calorie Matched");
    }

    // --- 4. FALLBACK TO AI ---
    console.log("AUTOMATION: Fallback to AI Generation");
    return await generateNutritionPlan(formData, language);
  }

  private static normalizeData(data: any, strategy: string, region: string, tdee: number, language: 'en' | 'ar'): PlanData | null {
    let meals: Meal[] = [];
    let macros = { calories: tdee, protein: 0, carbs: 0, fats: 0, bmi: 0, recommendation: "" };

    // --- ADAPTER: DIRTY BULKING ---
    if (strategy === "Dirty Bulking") {
      const plan = data.weekly_meal_plans?.middle_eastern_powerhouse?.day_1;
      if (plan) {
        meals = plan.meals.map((m: any, idx: number) => ({
          id: `db_${idx}`,
          name: m.meal_name,
          type: m.meal_type || 'meal',
          calories: m.ingredients.reduce((acc: number, i: any) => acc + (i.calories || 0), 0),
          protein: m.ingredients.reduce((acc: number, i: any) => acc + (i.protein_g || 0), 0),
          carbs: m.ingredients.reduce((acc: number, i: any) => acc + (i.carbs_g || 0), 0),
          fats: m.ingredients.reduce((acc: number, i: any) => acc + (i.fat_g || 0), 0),
          ingredients: m.ingredients.map((i: any) => `${i.item} (${i.amount})`)
        }));
        macros = {
          ...macros,
          calories: plan.daily_totals.calories,
          protein: plan.daily_totals.protein_g,
          carbs: plan.daily_totals.carbs_g,
          fats: plan.daily_totals.fat_g,
          recommendation: "High Calorie Muscle Gain Protocol (Dirty Bulk)"
        };
      }
    }

    // --- ADAPTER: KETO ---
    else if (strategy === "North African Keto") {
      const regionKey = Object.keys(data.weekly_meal_plans).find(k => region.toLowerCase().includes(k.split('_')[0])) || 'moroccan_keto';
      const dayPlan = data.weekly_meal_plans[regionKey]?.day_1 || data.weekly_meal_plans.moroccan_keto.day_1;
      
      if (dayPlan) {
        meals = dayPlan.meals.map((m: any, idx: number) => ({
          id: `keto_${idx}`,
          name: language === 'ar' ? m.meal_name.ar : m.meal_name.en,
          type: m.meal_time,
          calories: m.nutrition_per_serving?.calories || 0, 
          protein: m.nutrition_per_serving?.protein_g || 0,
          carbs: m.nutrition_per_serving?.net_carbs_g || 0,
          fats: m.nutrition_per_serving?.fat_g || 0,
          ingredients: m.ingredients ? m.ingredients.map((i: any) => language === 'ar' && i.item?.ar ? i.item.ar : (i.item?.en || i.item)) : []
        }));
        macros = {
          ...macros,
          calories: dayPlan.daily_totals?.calories || 1500,
          protein: dayPlan.daily_totals?.protein_g || 100,
          carbs: dayPlan.daily_totals?.net_carbs_g || 20,
          fats: dayPlan.daily_totals?.fat_g || 100,
          recommendation: `Keto Protocol (${regionKey.replace('_', ' ')})`
        };
      }
    }

    // --- ADAPTER: GULF IF & LOW CARB ---
    else if (strategy === "Gulf IF" || strategy === "Gulf Low Carb") {
      const regionSlug = region.toLowerCase().replace(' ', '_');
      const targetRegion = Object.keys(data.meal_plans || data.weekly_meal_plans).find(k => k.includes(regionSlug)) || 'saudi_arabia';
      
      const root = data.meal_plans || data.weekly_meal_plans;
      const scheduleKey = Object.keys(root[targetRegion] || {})[0]; // e.g. '16_8_schedule'
      const dayPlan = root[targetRegion]?.[scheduleKey]?.day_1;

      if (dayPlan) {
        meals = dayPlan.meals.map((m: any, idx: number) => ({
          id: `gulf_${idx}`,
          name: language === 'ar' ? m.meal_name.ar : m.meal_name.en,
          type: m.meal_time,
          calories: m.ingredients?.reduce((acc: number, i: any) => acc + (i.calories || 0), 0) || 500,
          protein: m.ingredients?.reduce((acc: number, i: any) => acc + (i.protein_g || 0), 0) || 30,
          carbs: m.ingredients?.reduce((acc: number, i: any) => acc + (i.carbs_g || 0), 0) || 40,
          fats: m.ingredients?.reduce((acc: number, i: any) => acc + (i.fat_g || 0), 0) || 15,
          ingredients: m.ingredients?.map((i: any) => language === 'ar' ? i.item.ar : i.item.en) || []
        }));
        
        const totals = dayPlan.total_nutrition || dayPlan.daily_totals;
        macros = {
          ...macros,
          calories: totals?.calories || tdee,
          protein: totals?.protein_g || 100,
          carbs: totals?.carbs_g || 100,
          fats: totals?.fat_g || 60,
          recommendation: `${strategy} Protocol (${targetRegion.replace('_', ' ')})`
        };
      }
    }

    // --- ADAPTER: BALANCED (North Africa) ---
    else if (strategy === "North African Balanced") {
       const dayKey = 'day_1_moroccan_focus'; 
       const dayPlan = data.weekly_meal_rotation?.[dayKey];
       
       if (dayPlan) {
         meals = Object.keys(dayPlan).map((key, idx) => {
           const m = dayPlan[key];
           return {
             id: `na_${idx}`,
             name: language === 'ar' ? m.name.ar : m.name.en,
             type: key.replace('_', ' '),
             calories: m.nutrition_per_serving.calories,
             protein: m.nutrition_per_serving.protein_g,
             carbs: m.nutrition_per_serving.carbs_g,
             fats: m.nutrition_per_serving.fat_g,
             ingredients: Object.values(m.ingredients || {}).map((i: any) => `${i.amount}${i.unit}`)
           };
         });
         
         macros.calories = meals.reduce((acc, m) => acc + m.calories, 0);
         macros.protein = meals.reduce((acc, m) => acc + m.protein, 0);
         macros.carbs = meals.reduce((acc, m) => acc + m.carbs, 0);
         macros.fats = meals.reduce((acc, m) => acc + m.fats, 0);
         macros.recommendation = "Balanced North African Protocol";
       }
    }

    if (meals.length === 0) return null;

    // Default Exercises
    const exercises: Exercise[] = KNOWLEDGE_BASE.exercises.standard;

    return {
      macros,
      meals,
      exercises
    };
  }

  private static calculateTDEE(formData: any): number {
    const weight = parseFloat(formData.weight_kg) || 70;
    const height = parseFloat(formData.height_cm) || 170;
    const age = parseFloat(formData.age) || 30;
    const isMale = formData.gender === 'Male';
    
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + (isMale ? 5 : -161);
    
    const activityMap: {[key: string]: number} = {
      'Sedentary': 1.2, 'Light': 1.375, 'Moderate': 1.55, 'Active': 1.725, 'Athlete': 1.9
    };
    const activity = activityMap[formData.activity_level] || 1.55;
    
    let tdee = Math.round(bmr * activity);

    const goal = formData.goal || '';
    if (goal === 'Weight Loss') tdee -= 500;
    else if (goal === 'Muscle Gain') tdee += 500;

    return tdee;
  }

  private static transformStaticData(staticData: any, formData: any, language: 'en' | 'ar', tdee: number, strategyName: string): PlanData {
    let macros = { ...staticData.macros };
    
    // Calculate BMI
    const weight = parseFloat(formData.weight_kg) || 70;
    const height = parseFloat(formData.height_cm) || 170;
    const heightM = height / 100;
    macros.bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));
    
    if (!macros.recommendation) {
      macros.recommendation = language === 'en' 
        ? `${strategyName} Protocol: Optimized for your profile.`
        : `بروتوكول ${strategyName}: محسن لملفك الشخصي.`;
    }

    const translateMeal = (meal: Meal): Meal => {
      // In a real app, this would use a translation dictionary.
      // Here we assume static data is largely EN-based but some have AR support built-in.
      return meal; 
    };

    return {
      macros,
      meals: staticData.meals.map(translateMeal),
      exercises: KNOWLEDGE_BASE.exercises.standard
    };
  }
}