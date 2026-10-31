import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());

// Initialize Gemini Client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Nigerian Food Catalog Context for Grounded AI Responses
const FOOD_CATALOG = [
  { id: 'm1', name: 'Signature Jollof Rice with Goat Meat & Dodo', restaurant: 'Terra Kulture Restaurant', cuisine: 'Nigerian Traditional', price: 4200, category: 'Rice Dishes', spice: 'Medium', tags: ['comfort', 'local favourites', 'bestseller'] },
  { id: 'm2', name: 'Seafood Okro Soup with Poundo Yam', restaurant: 'Terra Kulture Restaurant', cuisine: 'Nigerian Traditional', price: 5800, category: 'Swallows & Soups', spice: 'Medium', tags: ['comfort', 'seafood', 'premium'] },
  { id: 'm3', name: 'Native Asun Fried Rice with Smoked Pepper Sauce', restaurant: 'Yellow Chilli', cuisine: 'Nigerian Fusion', price: 4600, category: 'Rice Dishes', spice: 'Spicy', tags: ['spicy', 'local favourites'] },
  { id: 'm4', name: 'Slow-Cooked Egusi Soup with Assorted Meat & Eba', restaurant: 'Bukka Hut', cuisine: 'Authentic Bukka', price: 3400, category: 'Swallows & Soups', spice: 'Medium', tags: ['comfort', 'budget-friendly', 'lunch'] },
  { id: 'm5', name: 'Charcoal Grilled Suya Platter with Spiced Onions', restaurant: 'Danfo Bistro', cuisine: 'Street Gourmet', price: 3800, category: 'Grills & Suya', spice: 'Spicy', tags: ['grilled', 'spicy', 'snack'] },
  { id: 'm6', name: 'Catfish Pepper Soup with Boiled Sweet Yam', restaurant: 'Nkoyo Specialities', cuisine: 'Soups & Grills', price: 4900, category: 'Swallows & Soups', spice: 'Spicy', tags: ['spicy', 'comfort', 'light meal'] },
  { id: 'm7', name: 'Ofada Rice with Ayamase Sauce & Boiled Egg', restaurant: 'The Place Restaurant', cuisine: 'Fast Casual', price: 2900, category: 'Rice Dishes', spice: 'Spicy', tags: ['budget-friendly', 'quick lunch', 'local favourites'] },
  { id: 'm8', name: 'Crispy Akara & Warm Ogi Breakfast Bowl', restaurant: 'Bukka Hut', cuisine: 'Breakfast & Street', price: 1800, category: 'Breakfast & Street', spice: 'Mild', tags: ['breakfast', 'budget-friendly', 'light meal'] },
  { id: 'm9', name: 'Fresh Hibiscus Zobo Cooler with Citrus & Ginger', restaurant: 'Danfo Bistro', cuisine: 'Refreshers', price: 1200, category: 'Drinks & Refreshers', spice: 'Mild', tags: ['drink', 'light meal', 'healthy'] },
  { id: 'm10', name: 'Golden Warm Puff Puff (10 pcs) with Spiced Honey', restaurant: 'The Place Restaurant', cuisine: 'Pastries & Snacks', price: 1500, category: 'Snacks & Small Chops', spice: 'Mild', tags: ['sweet treat', 'snack'] },
  { id: 'm11', name: 'Grilled Jumbo Croaker Fish with Yam Fries & Sauce', restaurant: 'Bungalow Grill', cuisine: 'Grills & Seafood', price: 6500, category: 'Grills & Suya', spice: 'Medium', tags: ['grilled', 'dinner', 'premium'] },
  { id: 'm12', name: 'Smoked Smoked Chicken Caesar Wrap (African Twist)', restaurant: 'Ile Eros', cuisine: 'Modern Gourmet', price: 3600, category: 'Light Bites', spice: 'Mild', tags: ['light meal', 'quick lunch'] }
];

// 1. AI Concierge API
app.post('/api/ai/concierge', async (req, res) => {
  const { prompt, dietaryRestrictions, maxBudget } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Fallback intelligent filter if Gemini is unavailable
  const runFallbackMatch = () => {
    const query = prompt.toLowerCase();
    let matches = FOOD_CATALOG.filter(item => {
      const matchText = (item.name + ' ' + item.category + ' ' + item.tags.join(' ') + ' ' + item.restaurant).toLowerCase();
      if (maxBudget && item.price > maxBudget) return false;
      if (dietaryRestrictions?.includes('seafood') && item.name.toLowerCase().includes('seafood')) return false;
      return query.split(' ').some(word => word.length > 2 && matchText.includes(word));
    });

    if (matches.length === 0) {
      matches = FOOD_CATALOG.slice(0, 3);
    } else {
      matches = matches.slice(0, 3);
    }

    return {
      reply: `Here are verified recommendations from top Lagos and Abuja partner restaurants matching "${prompt}":`,
      recommendations: matches.map(m => ({
        id: m.id,
        name: m.name,
        restaurant: m.restaurant,
        price: m.price,
        matchReason: `Fits your craving for ${m.category.toLowerCase()} (${m.spice} spice, ₦${m.price.toLocaleString()}).`
      }))
    };
  };

  if (!ai) {
    return res.json(runFallbackMatch());
  }

  try {
    const systemPrompt = `You are Chopwize's AI Food Concierge for Nigeria.
Your job is to recommend real food items from our catalog based on the customer's craving or question.
Here is the official partner catalog:
${JSON.stringify(FOOD_CATALOG, null, 2)}

User Request: "${prompt}"
${dietaryRestrictions ? `Dietary restrictions: ${dietaryRestrictions}` : ''}
${maxBudget ? `Budget cap: ₦${maxBudget}` : ''}

Rules:
1. Recommend up to 3 real items strictly from the provided catalog.
2. Provide a warm, concise Nigerian hospitality reply (1-2 sentences).
3. For each recommendation, provide the exact item id from the catalog, name, restaurant, price, and a 1-sentence reason.
4. Output must be valid JSON strictly matching this structure:
{
  "reply": "string",
  "recommendations": [
    {
      "id": "string",
      "name": "string",
      "restaurant": "string",
      "price": number,
      "matchReason": "string"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      return res.json(runFallbackMatch());
    }
    return res.json(parsed);
  } catch (error) {
    console.error('Gemini Concierge API error:', error);
    return res.json(runFallbackMatch());
  }
});

// 2. AI Cooking Assistant & Recipe Ideas
app.post('/api/ai/cooking-assistant', async (req, res) => {
  const { ingredients, timeMinutes, mealType } = req.body;

  const fallbackRecipes = [
    {
      title: 'Quick Jollof Spaghetti with Fried Pepper Garnish',
      cookingTime: timeMinutes || 25,
      servings: 2,
      ingredientsUsed: ['Spaghetti / noodles', 'Tomatoes', 'Peppers', 'Onions', 'Vegetable oil'],
      missingIngredients: ['Smoked fish or boiled egg for protein'],
      steps: [
        'Blend tomatoes, scotch bonnet peppers, and onions into a coarse pepper mix.',
        'Heat 2 tablespoons of oil in a pot, fry tomato paste and blended pepper until aromatic and oil separates.',
        'Add 1.5 cups of seasoned water/stock, bring to a rolling boil, and snap spaghetti in half into the sauce.',
        'Cover tightly and steam on medium-low heat for 12 minutes until pasta absorbs all the rich jollof sauce.'
      ],
      matchingChopwizeItem: {
        id: 'm1',
        name: 'Signature Jollof Rice with Goat Meat & Dodo',
        restaurant: 'Terra Kulture Restaurant',
        price: 4200
      }
    }
  ];

  if (!ai) {
    return res.json({ recipes: fallbackRecipes });
  }

  try {
    const prompt = `Generate 2 practical Nigerian home meal recipes using these available ingredients: ${ingredients || 'Rice, tomatoes, onions, oil, seasoning'}.
Cooking time limit: ${timeMinutes || 30} minutes. Meal type: ${mealType || 'Lunch/Dinner'}.
Also identify if there's a matching restaurant item in Chopwize if the user decides to order instead.
Return JSON:
{
  "recipes": [
    {
      "title": "string",
      "cookingTime": number,
      "servings": number,
      "ingredientsUsed": ["string"],
      "missingIngredients": ["string"],
      "steps": ["string"],
      "matchingChopwizeItem": {
        "id": "m1",
        "name": "string",
        "restaurant": "string",
        "price": number
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Cooking Assistant error:', error);
    return res.json({ recipes: fallbackRecipes });
  }
});

// 3. AI Meal Planner (Weekly timetable generator)
app.post('/api/ai/meal-planner', async (req, res) => {
  const { weeklyBudget, preferences, householdSize } = req.body;

  const fallbackSchedule = [
    { day: 'Monday', breakfast: 'Warm Akara & Pap (Ogi) with Milk', lunch: 'Smoked Fish Jollof Rice with Steamed Veggies', dinner: 'Light Pepper Soup with Boiled Yam', estCost: 3500 },
    { day: 'Tuesday', breakfast: 'Toasted Bread with Spiced Scrambled Eggs & Tea', lunch: 'Fried Rice with Grilled Chicken Wing', dinner: 'Efo Riro Vegetable Soup with Eba', estCost: 4000 },
    { day: 'Wednesday', breakfast: 'Boiled Plantain with Egg and Pepper Sauce', lunch: 'Beans Porridge with Sweet Fried Dodo', dinner: 'Okro Soup with Poundo Yam', estCost: 3200 },
    { day: 'Thursday', breakfast: 'Golden Puff Puff & Cold Zobo Cooler', lunch: 'Ofada Rice with Ayamase & Boiled Egg', dinner: 'Grilled Suya Salad with Cabbage & Onions', estCost: 3800 },
    { day: 'Friday', breakfast: 'Club Sandwich with Black Tea', lunch: 'Yam Porridge (Asaro) with Smoked Mackerel', dinner: 'Egusi Soup with Goat Meat & Semo', estCost: 4500 },
    { day: 'Saturday', breakfast: 'Yam and Egg Frittata', lunch: 'Jollof Spaghetti with Grilled Sausage', dinner: 'Fresh Fish Catfish Pepper Soup', estCost: 5200 },
    { day: 'Sunday', breakfast: 'Pancake roll-ups with Chocolate Spread & Tea', lunch: 'Sunday Special Party Jollof & Fried Chicken', dinner: 'Fruit Salad & Light Broth', estCost: 5800 }
  ];

  if (!ai) {
    return res.json({ timetable: fallbackSchedule, estimatedWeeklyTotal: 30000 });
  }

  try {
    const prompt = `Create a realistic 7-day Nigerian meal plan for a household of ${householdSize || 1} person(s).
Weekly target budget: ₦${weeklyBudget || 35000}.
Preferences: ${preferences || 'Balanced Nigerian staples, mix of home cooked and restaurant lunch'}.
Return JSON:
{
  "timetable": [
    {
      "day": "Monday",
      "breakfast": "string",
      "lunch": "string",
      "dinner": "string",
      "estCost": number
    }
  ],
  "estimatedWeeklyTotal": number,
  "savingsTip": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Meal Planner error:', error);
    return res.json({ timetable: fallbackSchedule, estimatedWeeklyTotal: 30000 });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'CHOPWIZE',
    descriptor: 'Intelligent Food Decisions',
    aiEnabled: !!ai,
    environment: isDev ? 'development' : 'production'
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CHOPWIZE server running on port ${PORT} (dev: ${isDev})`);
  });
}

startServer();
