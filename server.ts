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

// Nigerian Food & Market Catalogs for Grounded AI Responses
const FOOD_CATALOG = [
  { id: 'm1', name: 'Signature Jollof Rice with Goat Meat & Dodo', restaurant: 'Terra Kulture Restaurant', cuisine: 'Nigerian Traditional', culture: 'Yoruba', price: 4200, category: 'Rice Dishes', spice: 'Medium', tags: ['comfort', 'local favourites', 'bestseller'] },
  { id: 'm-amala', name: 'Hot Oyo Amala with Abula (Ewedu & Gbegiri) & Goat Meat', restaurant: 'Bukka Hut', cuisine: 'Authentic Bukka', culture: 'Yoruba', price: 3600, category: 'Swallows & Soups', spice: 'Medium', tags: ['indigenous', 'swallow', 'yoruba', 'bestseller'] },
  { id: 'm-oha', name: 'Authentic Eastern Oha Soup with Pounded Yam & Stockfish', restaurant: 'Nkoyo Specialities', cuisine: 'Calabar Traditional', culture: 'Igbo', price: 4800, category: 'Swallows & Soups', spice: 'Medium', tags: ['indigenous', 'igbo', 'swallow'] },
  { id: 'm-tuwo', name: 'Northern Tuwo Shinkafa with Miyan Kuka & Tender Beef', restaurant: 'Nkoyo Specialities', cuisine: 'Northern Traditional', culture: 'Hausa', price: 3900, category: 'Swallows & Soups', spice: 'Mild', tags: ['indigenous', 'hausa', 'swallow'] },
  { id: 'm-afang', name: 'Calabar Native Afang Soup with Periwinkles & Pounded Yam', restaurant: 'Nkoyo Specialities', cuisine: 'Calabar Traditional', culture: 'Efik/Ibibio', price: 5200, category: 'Swallows & Soups', spice: 'Spicy', tags: ['indigenous', 'efik', 'swallow'] },
  { id: 'm2', name: 'Seafood Okro Soup with Poundo Yam', restaurant: 'Terra Kulture Restaurant', cuisine: 'Nigerian Traditional', culture: 'General Nigerian', price: 5800, category: 'Swallows & Soups', spice: 'Medium', tags: ['comfort', 'seafood', 'premium'] },
  { id: 'm3', name: 'Native Asun Fried Rice with Smoked Pepper Sauce', restaurant: 'Yellow Chilli', cuisine: 'Nigerian Fusion', culture: 'Yoruba', price: 4600, category: 'Rice Dishes', spice: 'Spicy', tags: ['spicy', 'local favourites'] },
  { id: 'm4', name: 'Slow-Cooked Egusi Soup with Assorted Meat & Eba', restaurant: 'Bukka Hut', cuisine: 'Authentic Bukka', culture: 'General Nigerian', price: 3400, category: 'Swallows & Soups', spice: 'Medium', tags: ['comfort', 'budget-friendly', 'lunch'] },
  { id: 'm5', name: 'Charcoal Grilled Suya Platter with Spiced Onions', restaurant: 'Danfo Bistro', cuisine: 'Street Gourmet', culture: 'Hausa', price: 3800, category: 'Grills & Suya', spice: 'Spicy', tags: ['grilled', 'spicy', 'snack'] },
  { id: 'm6', name: 'Ofada Rice with Ayamase Sauce & Boiled Egg', restaurant: 'The Place Restaurant', cuisine: 'Fast Casual', culture: 'Yoruba', price: 2900, category: 'Rice Dishes', spice: 'Spicy', tags: ['budget-friendly', 'quick lunch', 'local favourites'] },
  { id: 'm8', name: 'Fresh Hibiscus Zobo Cooler with Citrus & Ginger', restaurant: 'Danfo Bistro', cuisine: 'Refreshers', culture: 'General Nigerian', price: 1200, category: 'Drinks & Refreshers', spice: 'Mild', tags: ['drink', 'light meal', 'healthy'] }
];

const GROCERY_CATALOG = [
  { id: 'g-spag-1', name: 'Golden Penny Spaghetti', brand: 'Golden Penny', category: 'Pasta & Noodles', packSize: '500g Pack', price: 950 },
  { id: 'g-indomie-1', name: 'Indomie Instant Noodles (Onion Chicken)', brand: 'Indomie', category: 'Pasta & Noodles', packSize: 'Hungryman 180g', price: 650 },
  { id: 'g-rice-1', name: 'Mama Gold Pure Thai Parboiled Rice', brand: 'Mama Gold', category: 'Grains & Rice', packSize: '5kg Bag', price: 8400 },
  { id: 'g-beans-1', name: 'Oloyin Sweet Honey Beans (Cleaned)', brand: 'Premier Harvest', category: 'Grains & Rice', packSize: '2kg Pack', price: 4200 },
  { id: 'g-garri-1', name: 'Ijebu Crispy White Garri', brand: 'Ogun Gold', category: 'Flour & Swallow', packSize: '2kg Bag', price: 2800 },
  { id: 'g-tomato-1', name: 'Gino Peppe & Onion Tomato Paste', brand: 'Gino', category: 'Canned Foods', packSize: 'Pack of 5 (70g)', price: 1600 },
  { id: 'g-sardine-1', name: 'Titus Wild Sardines in Vegetable Oil', brand: 'Titus', category: 'Canned Foods', packSize: '125g Can', price: 1350 },
  { id: 'g-oil-1', name: "Devon King's Pure Vegetable Cooking Oil", brand: "Devon King's", category: 'Oils & Seasoning', packSize: '1 Litre Bottle', price: 3200 },
  { id: 'g-seasoning-1', name: 'Maggi Star Seasoning Cubes', brand: 'Maggi', category: 'Oils & Seasoning', packSize: 'Pack of 100', price: 1950 },
  { id: 'g-milk-1', name: 'Peak Full Cream Evaporated Milk Pouch', brand: 'Peak', category: 'Dairy & Drinks', packSize: '800g Pouch', price: 4800 }
];

// 1. Central Chopwize AI Food Assistant API (Personality: Playful, caring, familiar with Nigerian nuances)
app.post('/api/ai/concierge', async (req, res) => {
  const { prompt, customerName = 'Amina', activeRules = [], dietaryRestrictions, maxBudget } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const runFallbackMatch = () => {
    const q = prompt.toLowerCase();
    let matches = FOOD_CATALOG.filter((item) => {
      const matchText = (item.name + ' ' + item.category + ' ' + item.culture + ' ' + item.tags.join(' ') + ' ' + item.restaurant).toLowerCase();
      if (maxBudget && item.price > maxBudget) return false;
      if (dietaryRestrictions?.includes('seafood') && (item.name.toLowerCase().includes('seafood') || item.name.toLowerCase().includes('fish') || item.name.toLowerCase().includes('prawn'))) return false;
      if (q.includes('yoruba') && item.culture !== 'Yoruba') return false;
      if (q.includes('hausa') && item.culture !== 'Hausa') return false;
      if (q.includes('igbo') && item.culture !== 'Igbo') return false;
      return q.split(' ').some((w) => w.length > 2 && matchText.includes(w));
    });

    if (matches.length === 0) {
      matches = FOOD_CATALOG.slice(0, 3);
    } else {
      matches = matches.slice(0, 3);
    }

    const playfulIntro = q.includes('hungry')
      ? `This hunger is serious business, ${customerName}! 😂 Let's solve it right now with verified dishes near you:`
      : `Oya ${customerName}, here are delicious options that match your craving:`;

    return {
      reply: playfulIntro,
      recommendations: matches.map((m) => ({
        id: m.id,
        name: m.name,
        restaurant: m.restaurant,
        price: m.price,
        matchReason: `Fits your craving for authentic ${m.culture || m.category} (${m.spice} spice, ₦${m.price.toLocaleString()}).`
      })),
      isGroceryIntent: q.includes('market') || q.includes('groceries') || q.includes('spaghetti') || q.includes('noodles')
    };
  };

  if (!ai) {
    return res.json(runFallbackMatch());
  }

  try {
    const systemPrompt = `You are Chopwize AI, the intelligent food companion for Nigeria.
Personality:
- Playful and slightly goofy, but polite, caring and deeply knowledgeable about Nigerian food (Lagos, Abuja, Yoruba, Igbo, Hausa, Calabar meals).
- Greet customer naturally using their preferred name: "${customerName}".
- Example vibe: "This hunger is serious business! 😂 Let's solve it. Are you looking for something light, or something that will make you forget your worries?"
- Do NOT use jokes inappropriately if the user mentions an allergy, emergency, or payment problem.
- Strictly adhere to these Customer-defined AI Rules: ${JSON.stringify(activeRules)}
- Ground all recommendations in our official catalog:
${JSON.stringify(FOOD_CATALOG, null, 2)}

User request: "${prompt}"
${dietaryRestrictions ? `Medical Restrictions: ${dietaryRestrictions}` : ''}
${maxBudget ? `Budget Limit: ₦${maxBudget}` : ''}

Rules:
1. Recommend up to 3 real items strictly from the catalog.
2. Provide a playful, caring Nigerian response (1-2 sentences).
3. Check if the user is asking about groceries or Market items.
4. Output valid JSON:
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
  ],
  "isGroceryIntent": boolean
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

// 2. Chopwize Market: Natural Grocery Assistant (Section 9 & 10)
app.post('/api/ai/grocery-assistant', async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  const q = query.toLowerCase();
  const matchedProducts = GROCERY_CATALOG.filter((p) => {
    return (
      q.includes(p.name.toLowerCase()) ||
      q.includes(p.brand.toLowerCase()) ||
      q.includes(p.category.toLowerCase()) ||
      (q.includes('spaghetti') && p.name.includes('Spaghetti')) ||
      (q.includes('indomie') && p.name.includes('Indomie')) ||
      (q.includes('rice') && p.name.includes('Rice')) ||
      (q.includes('beans') && p.name.includes('Beans')) ||
      (q.includes('oil') && p.name.includes('Oil')) ||
      (q.includes('milk') && p.name.includes('Milk')) ||
      (q.includes('tomato') && p.name.includes('Tomato')) ||
      (q.includes('sardine') && p.name.includes('Sardine')) ||
      (q.includes('garri') && p.name.includes('Garri'))
    );
  });

  const finalMatches = matchedProducts.length > 0 ? matchedProducts : GROCERY_CATALOG.slice(0, 4);
  const totalBasketCost = finalMatches.reduce((sum, item) => sum + item.price, 0);

  return res.json({
    reply: `I put together your Chopwize Market grocery basket with ${finalMatches.length} items from our verified shelf-stable catalog:`,
    items: finalMatches.map((m) => ({
      productId: m.id,
      name: m.name,
      brand: m.brand,
      packSize: m.packSize,
      price: m.price,
      quantity: 1,
    })),
    totalCost: totalBasketCost,
    consolidation: {
      bestSingleStore: 'Ebeano Supermarket (Lekki Phase 1)',
      availableCount: `${finalMatches.length} of ${finalMatches.length} items in 1 store`,
      deliveryFee: 1100,
    }
  });
});

// 3. AI Cooking Assistant & Recipe Ideas (Section 4B & 12.6)
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

// 4. AI Meal Planner (Weekly timetable generator)
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
