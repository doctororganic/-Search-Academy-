
// This file acts as the local database for the automation engine
// It contains expert-curated plans for specific regions, goals, and medical needs

export const KNOWLEDGE_BASE = {
  // --- Raw Data from Uploaded Files ---
  
  arabian_gulf_intermittent_fasting_api: {
    meal_plans: {
      saudi_arabia: {
        "16_8_schedule": {
          day_1: {
            total_nutrition: { calories: 1315, protein_g: 88, carbs_g: 155, fat_g: 45 },
            meals: [
              {
                meal_time: "lunch",
                meal_name: { en: "Traditional Chicken Kabsa Bowl", ar: "كبسة دجاج تقليدية" },
                ingredients: [{ item: { en: "Basmati rice", ar: "أرز بسمتي" }, calories: 216 }, { item: { en: "Chicken breast", ar: "صدر دجاج" }, calories: 330 }, { item: { en: "Ghee", ar: "سمن" }, calories: 135 }]
              }
            ]
          }
        }
      },
      uae: {
        "18_6_schedule": {
          day_1: {
             total_nutrition: { calories: 1450, protein_g: 90, carbs_g: 140, fat_g: 50 },
             meals: [
               { meal_time: "lunch", meal_name: { en: "Emirati Machboos with Lamb", ar: "مجبوس إماراتي باللحم" }, ingredients: [{item: {en: "Lamb", ar: "لحم"}}, {item: {en: "Rice", ar: "أرز"}}] }
             ]
          }
        }
      }
    }
  },

  north_african_iraqi_keto_api: {
    weekly_meal_plans: {
      moroccan_keto: {
        day_1: {
          daily_totals: { calories: 1471, fat_g: 105, protein_g: 105, net_carbs_g: 22 },
          meals: [
            {
              meal_time: "breakfast",
              meal_name: { en: "Moroccan Keto Shakshuka", ar: "شكشوكة مغربية كيتو" },
              ingredients: [{ item: { en: "Eggs", ar: "بيض" } }, { item: { en: "Tomatoes", ar: "طماطم" } }]
            },
            {
              meal_time: "lunch",
              meal_name: { en: "Keto Moroccan Lamb Tagine", ar: "طاجين لحم كيتو" },
              ingredients: [{ item: { en: "Lamb", ar: "لحم" } }, { item: { en: "Zucchini", ar: "كوسا" } }]
            }
          ]
        }
      },
      algerian_keto: {
        day_1: {
           daily_totals: { calories: 1500, fat_g: 110, protein_g: 100, net_carbs_g: 25 },
           meals: [
             { meal_time: "breakfast", meal_name: { en: "Keto Chorba", ar: "شوربة كيتو" }, ingredients: [{ item: {en: "Lamb", ar: "لحم"} }] }
           ]
        }
      }
    }
  },

  arabian_gulf_low_carb_api: {
    weekly_meal_plans: {
      saudi_arabia_low_carb: {
        day_1: {
          daily_totals: { calories: 1398, carbs_g: 45, protein_g: 102, fat_g: 95 },
          meals: [
            {
              meal_time: "lunch",
              meal_name: { en: "Low-Carb Kabsa with Cauliflower Rice", ar: "كبسة قليلة الكربوهيدرات" },
              ingredients: [{ item: { en: "Chicken", ar: "دجاج" } }, { item: { en: "Cauliflower", ar: "قرنبيط" } }]
            }
          ]
        }
      }
    }
  },

  gulf_mediterranean_diet_api: {
    weekly_meal_plans: {
      saudi_mediterranean: {
        day_1: {
          daily_nutrition: { total_calories: 1388, carbs_g: 121, protein_g: 102, fat_g: 68 },
          meals: [
            {
              meal_time: "lunch",
              meal_name: "Mediterranean Kabsa with Ancient Grains",
              ingredients: [{ item: "Organic chicken" }, { item: "Brown rice" }, { item: "Olive oil" }]
            }
          ]
        }
      }
    }
  },

  north_african_balanced_IF_meal_plan: {
    weekly_meal_rotation: {
      day_1_moroccan_focus: {
        breaking_fast: {
          name: { en: "Traditional Moroccan Harira", ar: "حريرة مغربية" },
          nutrition_per_serving: { calories: 195, protein_g: 12, fat_g: 6, carbs_g: 28 },
          ingredients: { lentils: {amount: 50, unit: "g"}, chickpeas: {amount: 40, unit: "g"} }
        },
        main_meal: {
          name: { en: "Moroccan Chicken Tagine", ar: "طاجين دجاج" },
          nutrition_per_serving: { calories: 385, protein_g: 35, fat_g: 18, carbs_g: 25 },
          ingredients: { chicken: {amount: 150, unit: "g"} }
        }
      }
    }
  },

  arabian_dirty_bulking_api: {
    weekly_meal_plans: {
      middle_eastern_powerhouse: {
        day_1: {
          daily_totals: { calories: 4622, protein_g: 193, carbs_g: 403, fat_g: 176 },
          meals: [
            {
              meal_time: "breakfast",
              meal_name: "Arabian Breakfast Feast",
              ingredients: [{ item: "Eggs", amount: "3 pieces", calories: 210 }, { item: "Labneh", amount: "150g", calories: 238 }, { item: "Dates", amount: "50g", calories: 139 }]
            }
          ]
        }
      }
    }
  },

  // --- Fallback Static Plans ---
  calorie_tiers: {
    c1500: { // Weight Loss
      meals: [
        { id: "c15_1", type: "breakfast", name: "2 Boiled Eggs & Cucumber", calories: 160, protein: 12, carbs: 2, fats: 10, ingredients: ["Eggs", "Cucumber"] },
        { id: "c15_2", type: "lunch", name: "Grilled Chicken Breast & Salad", calories: 400, protein: 50, carbs: 10, fats: 15, ingredients: ["Chicken breast", "Mixed greens", "Vinaigrette"] },
        { id: "c15_3", type: "snack", name: "Greek Yogurt & Berries", calories: 150, protein: 15, carbs: 20, fats: 0, ingredients: ["Greek yogurt", "Berries"] },
        { id: "c15_4", type: "dinner", name: "Tuna Salad", calories: 350, protein: 40, carbs: 15, fats: 12, ingredients: ["Tuna (water)", "Lettuce", "Corn", "Olives"] }
      ],
      macros: { calories: 1060, protein: 117, carbs: 47, fats: 37, bmi: 0, recommendation: "Rapid Fat Loss (High Protein)" }
    },
    c2000: { // Maintenance
      meals: [
        { id: "c20_1", type: "breakfast", name: "Oatmeal with Nuts", calories: 400, protein: 12, carbs: 60, fats: 14, ingredients: ["Oats", "Almonds", "Milk", "Honey"] },
        { id: "c20_2", type: "lunch", name: "Beef Kabsa", calories: 700, protein: 45, carbs: 80, fats: 25, ingredients: ["Lean beef", "Basmati rice", "Kabsa spices", "Carrots"] },
        { id: "c20_3", type: "dinner", name: "Grilled Halloumi Sandwich", calories: 500, protein: 25, carbs: 40, fats: 28, ingredients: ["Halloumi", "Whole wheat bread", "Tomato", "Mint"] }
      ],
      macros: { calories: 1600, protein: 82, carbs: 180, fats: 67, bmi: 0, recommendation: "Balanced Maintenance" }
    },
    c3000: { // Bulking
      meals: [
        { id: "c30_1", type: "breakfast", name: "Shakshuka with Extra Cheese & Bread", calories: 700, protein: 35, carbs: 60, fats: 38, ingredients: ["3 Eggs", "Feta cheese", "Olive oil", "2 Pita breads"] },
        { id: "c30_2", type: "lunch", name: "Mega Koshari Bowl", calories: 950, protein: 30, carbs: 160, fats: 20, ingredients: ["Rice", "Lentils", "Macaroni", "Chickpeas", "Fried onions"] },
        { id: "c30_3", type: "snack", name: "Mass Gainer Shake", calories: 600, protein: 50, carbs: 80, fats: 10, ingredients: ["Whey protein", "Oats", "Peanut butter", "Milk", "Banana"] },
        { id: "c30_4", type: "dinner", name: "Lamb Mandi Feast", calories: 850, protein: 55, carbs: 90, fats: 35, ingredients: ["Lamb shank", "Mandi rice", "Yogurt", "Nuts"] }
      ],
      macros: { calories: 3100, protein: 170, carbs: 390, fats: 103, bmi: 0, recommendation: "Aggressive Muscle Building" }
    }
  },
  
  exercises: {
    standard: [
      { id: "ex_1", name: "Push Ups", sets: "3", reps: "12-15", notes: "Keep core tight" },
      { id: "ex_2", name: "Bodyweight Squats", sets: "3", reps: "15-20", notes: "Depth below parallel" },
      { id: "ex_3", name: "Plank", sets: "3", reps: "45s", notes: "Maintain straight line" }
    ]
  }
};