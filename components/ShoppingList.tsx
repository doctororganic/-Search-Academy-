
import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart, Trash2 } from 'lucide-react';
import { Meal, Language } from '../types';

interface ShoppingListProps {
  meals: Meal[];
  language: Language;
}

export default function ShoppingList({ meals, language }: ShoppingListProps) {
  const [items, setItems] = useState<{ id: string; text: string; checked: boolean }[]>([]);

  useEffect(() => {
    // Deduplicate and aggregate ingredients
    const allIngredients = new Set<string>();
    meals.forEach(meal => {
      meal.ingredients.forEach(ing => allIngredients.add(ing));
    });
    
    setItems(Array.from(allIngredients).map((text, idx) => ({
      id: `item-${idx}`,
      text,
      checked: false
    })));
  }, [meals]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100) || 0;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            {language === 'en' ? 'Shopping List' : 'قائمة التسوق'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'en' 
              ? `You have ${items.length} items to buy.` 
              : `لديك ${items.length} عنصر للشراء.`}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">{progress}%</span>
          <span className="text-xs text-slate-400 block uppercase tracking-wider">{language === 'en' ? 'Completed' : 'مكتمل'}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`
              p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 group
              ${item.checked 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary'}
            `}
          >
            <div className={`
              w-5 h-5 rounded border flex items-center justify-center transition-colors
              ${item.checked 
                ? 'bg-primary border-primary text-white' 
                : 'bg-transparent border-slate-300 dark:border-slate-500 group-hover:border-primary'}
            `}>
              {item.checked && <Check size={12} strokeWidth={3} />}
            </div>
            <span className={`text-sm ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
