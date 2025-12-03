
export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'multiselect' | 'date';
  label: { en: string; ar: string };
  placeholder?: { en: string; ar: string };
  required: boolean;
  options?: string[]; // For select inputs
  value: string | string[] | number;
  section: 'personal' | 'health' | 'goals';
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  // New: Conditional Logic
  logic?: {
    fieldId: string;
    operator: 'equals' | 'not_equals' | 'contains';
    value: string | number;
  };
  error?: string; 
}

export interface Meal {
  id: string;
  name: string;
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  notes?: string;
  completed?: boolean; // For interactive tracking
}

export interface PlanData {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    bmi: number;
    recommendation: string;
  };
  meals: Meal[];
  exercises: Exercise[];
}

export interface UserProfile {
  [key: string]: any;
  region?: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export type Language = 'en' | 'ar';