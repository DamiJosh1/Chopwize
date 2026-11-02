import {
  Restaurant,
  MenuItem,
  Order,
  FoodBudget,
  MealTimetableEntry,
  SupportTicket,
  RiderState,
  GroceryStore,
  MarketProduct,
  AIRule,
  FoodMemoryItem,
  MealReminder,
  SurpriseDeliveryConfig,
} from '../types';

// Curated Nigerian Restaurants
export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-terra',
    name: 'Terra Kulture Restaurant',
    tagline: 'Authentic Nigerian heritage recipes & slow-simmered pot favourites',
    cuisine: 'Nigerian Traditional & Fine Dining',
    coverImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewCount: 342,
    deliveryTimeMin: 35,
    deliveryTimeMax: 50,
    minOrder: 2500,
    deliveryFee: 1200,
    address: 'Plot 1376 Tiamiyu Savage St, Victoria Island, Lagos',
    area: 'Victoria Island',
    isOpen: true,
    isPaused: false,
    supportsPickup: true,
    supportsDelivery: true,
    verified: {
      isVerified: true,
      verificationText: 'CAC Registered & State Health Inspected',
      inspectedDate: 'October 2026',
    },
    openingHours: '10:00 AM – 10:00 PM',
    categories: ['Rice Dishes', 'Swallows & Soups', 'Grills & Suya', 'Drinks & Refreshers', 'Indigenous Specials'],
  },
  {
    id: 'rest-yellow',
    name: 'Yellow Chilli',
    tagline: 'Modern Nigerian culinary flair, renowned seafood okro & native pots',
    cuisine: 'Nigerian Fusion & Native Pots',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 289,
    deliveryTimeMin: 30,
    deliveryTimeMax: 45,
    minOrder: 3000,
    deliveryFee: 1400,
    address: '27 Oju Olobun Close, Off Bishop Oluwole, Victoria Island',
    area: 'Victoria Island',
    isOpen: true,
    isPaused: false,
    supportsPickup: true,
    supportsDelivery: true,
    verified: {
      isVerified: true,
      verificationText: 'Verified Partner & Hygiene Certified',
      inspectedDate: 'September 2026',
    },
    openingHours: '11:00 AM – 10:30 PM',
    categories: ['Rice Dishes', 'Swallows & Soups', 'Grills & Suya', 'Drinks & Refreshers'],
  },
  {
    id: 'rest-bukkahut',
    name: 'Bukka Hut',
    tagline: 'True Lagos bukka warmth: hot pounded yam, rich egusi & peppered proteins',
    cuisine: 'Authentic Bukka & Soul Food',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    reviewCount: 620,
    deliveryTimeMin: 25,
    deliveryTimeMax: 40,
    minOrder: 2000,
    deliveryFee: 950,
    address: 'Block 69A Admiralty Way, Lekki Phase 1, Lagos',
    area: 'Lekki Phase 1',
    isOpen: true,
    isPaused: false,
    supportsPickup: true,
    supportsDelivery: true,
    verified: {
      isVerified: true,
      verificationText: 'CAC Registered Bukka Chain',
      inspectedDate: 'October 2026',
    },
    openingHours: '08:00 AM – 09:30 PM',
    categories: ['Swallows & Soups', 'Rice Dishes', 'Breakfast & Street', 'Snacks & Small Chops', 'Indigenous Specials'],
  },
  {
    id: 'rest-theplace',
    name: 'The Place Restaurant',
    tagline: 'Fast, fresh Nigerian comfort dishes, smoky asun rice and crispy chicken',
    cuisine: 'Fast Casual & Street Specials',
    coverImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviewCount: 910,
    deliveryTimeMin: 20,
    deliveryTimeMax: 35,
    minOrder: 1500,
    deliveryFee: 800,
    address: '302 Herbert Macaulay Way, Yaba, Lagos',
    area: 'Yaba',
    isOpen: true,
    isPaused: false,
    supportsPickup: true,
    supportsDelivery: true,
    verified: {
      isVerified: true,
      verificationText: 'Chopwize Top Volume Verified Partner',
      inspectedDate: 'August 2026',
    },
    openingHours: '08:30 AM – 11:00 PM',
    categories: ['Rice Dishes', 'Grills & Suya', 'Snacks & Small Chops', 'Drinks & Refreshers'],
  },
  {
    id: 'rest-danfo',
    name: 'Danfo Bistro & Genius Bar',
    tagline: 'Artful Nigerian street food elevates suya platters and agege toast',
    cuisine: 'Street Gourmet & Grills',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewCount: 215,
    deliveryTimeMin: 30,
    deliveryTimeMax: 45,
    minOrder: 2500,
    deliveryFee: 1100,
    address: '2 Alexander Rd, Ikoyi, Lagos',
    area: 'Ikoyi',
    isOpen: true,
    isPaused: false,
    supportsPickup: true,
    supportsDelivery: true,
    verified: {
      isVerified: true,
      verificationText: 'Artisan Kitchen & Hygiene Approved',
      inspectedDate: 'October 2026',
    },
    openingHours: '11:00 AM – 10:00 PM',
    categories: ['Grills & Suya', 'Rice Dishes', 'Drinks & Refreshers', 'Snacks & Small Chops'],
  },
  {
    id: 'rest-nkoyo',
    name: 'Nkoyo Specialities',
    tagline: 'Calabar delicacies, rich afang, edikang ikong and fresh grilled catfish',
    cuisine: 'Calabar Traditional & Soups',
    coverImage: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewCount: 310,
    deliveryTimeMin: 40,
    deliveryTimeMax: 55,
    minOrder: 3500,
    deliveryFee: 1500,
    address: '1 Bathurst St, Maitama, Abuja',
    area: 'Abuja Central',
    isOpen: true,
    isPaused: false,
    supportsPickup: true,
    supportsDelivery: true,
    verified: {
      isVerified: true,
      verificationText: 'Abuja Premier Certified Kitchen',
      inspectedDate: 'October 2026',
    },
    openingHours: '11:00 AM – 09:30 PM',
    categories: ['Swallows & Soups', 'Grills & Suya', 'Rice Dishes', 'Indigenous Specials'],
  }
];

// Curated Nigerian Dishes (with Indigenous Food Cultures & Customization Modifiers)
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    restaurantId: 'rest-terra',
    restaurantName: 'Terra Kulture Restaurant',
    name: 'Signature Party Jollof with Smoked Goat Meat & Dodo',
    description: 'Long grain rice firewood-steamed with plum tomatoes, scotch bonnets, tatashe pepper base, served with succulent peppered goat meat and sweet fried plantain.',
    price: 4200,
    category: 'Rice Dishes',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Medium',
    prepTimeMinutes: 20,
    dietary: ['Halal'],
    allergens: [],
    isPopular: true,
    foodCulture: 'Yoruba',
    removableIngredients: ['Onions', 'Pepper Sauce'],
    availableProteins: [
      { name: 'Smoked Goat Meat', priceDelta: 0 },
      { name: 'Crispy Fried Chicken', priceDelta: -200 },
      { name: 'Assorted Meat (Shaki & Cow Foot)', priceDelta: 0 },
      { name: 'Peppered Croaker Fish', priceDelta: 800 }
    ],
    portionOptions: [
      { name: 'Standard Bowl', priceDelta: 0 },
      { name: 'Double Protein Platter', priceDelta: 1800 }
    ],
    addOns: [
      { id: 'ao-dodo', name: 'Extra Sweet Fried Dodo', price: 800 },
      { id: 'ao-moi', name: 'Steamed Moi Moi Roll', price: 900 },
      { id: 'ao-goat', name: 'Extra Peppered Goat Meat (1 cut)', price: 1600 }
    ]
  },
  {
    id: 'm-amala',
    restaurantId: 'rest-bukkahut',
    restaurantName: 'Bukka Hut',
    name: 'Hot Oyo Amala with Abula (Ewedu & Gbegiri) & Goat Meat',
    description: 'Silky smooth Oyo black amala served with piping hot ewedu, yellow gbegiri bean soup, and tender peppered goat meat.',
    price: 3600,
    category: 'Swallows & Soups',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Medium',
    prepTimeMinutes: 15,
    dietary: ['Gluten-Free', 'Halal'],
    allergens: [],
    isPopular: true,
    foodCulture: 'Yoruba',
    removableIngredients: ['Gbegiri Bean Soup', 'Red Stew'],
    availableProteins: [
      { name: 'Tender Goat Meat (Ogunfe)', priceDelta: 0 },
      { name: 'Assorted Tripe & Beef', priceDelta: -200 },
      { name: 'Peppered Snail', priceDelta: 1500 }
    ],
    portionOptions: [
      { name: '2 Wraps Amala', priceDelta: 0 },
      { name: '3 Wraps Amala', priceDelta: 400 }
    ],
    addOns: [
      { id: 'ao-ogfe', name: 'Extra Ogunfe Cut', price: 1400 },
      { id: 'ao-ponmo', name: 'Soft Brown Ponmo', price: 600 }
    ]
  },
  {
    id: 'm-oha',
    restaurantId: 'rest-nkoyo',
    restaurantName: 'Nkoyo Specialities',
    name: 'Authentic Eastern Oha Soup with Pounded Yam & Stockfish',
    description: 'Traditional Igbo delicacy prepared with tender oha leaves, cocoyam thickener, crayfish, stockfish head and assorted meats.',
    price: 4800,
    category: 'Swallows & Soups',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Medium',
    prepTimeMinutes: 25,
    dietary: ['Gluten-Free'],
    allergens: ['Fish'],
    isPopular: true,
    foodCulture: 'Igbo',
    removableIngredients: ['Stockfish Flakes'],
    availableProteins: [
      { name: 'Assorted Beef & Tripe', priceDelta: 0 },
      { name: 'Smoked Mangala Fish', priceDelta: 500 },
      { name: 'Dry Catfish Cut', priceDelta: 700 }
    ],
    portionOptions: [
      { name: 'Pounded Yam', priceDelta: 0 },
      { name: 'Yellow Garri (Eba)', priceDelta: -200 },
      { name: 'Oat Swallow', priceDelta: 200 }
    ]
  },
  {
    id: 'm-tuwo',
    restaurantId: 'rest-nkoyo',
    restaurantName: 'Nkoyo Specialities',
    name: 'Northern Tuwo Shinkafa with Miyan Kuka & Tender Beef',
    description: 'Mashed short-grain rice swallow paired with aromatic dry baobab leaf soup (Miyan Kuka), dawadawa seasoning and slow-boiled beef.',
    price: 3900,
    category: 'Swallows & Soups',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Mild',
    prepTimeMinutes: 20,
    dietary: ['Halal', 'Gluten-Free'],
    allergens: [],
    isPopular: true,
    foodCulture: 'Hausa',
    portionOptions: [
      { name: 'Tuwo Shinkafa', priceDelta: 0 },
      { name: 'Tuwo Masara (Corn)', priceDelta: 0 }
    ],
    addOns: [
      { id: 'ao-suya-side', name: 'Side of Spicy Suya Strips', price: 1200 }
    ]
  },
  {
    id: 'm-afang',
    restaurantId: 'rest-nkoyo',
    restaurantName: 'Nkoyo Specialities',
    name: 'Calabar Native Afang Soup with Periwinkles & Pounded Yam',
    description: 'Rich shredded okazi (afang) and waterleaf soup cooked in pure red palm oil, loaded with kpomo, periwinkles, stockfish and dried prawns.',
    price: 5200,
    category: 'Swallows & Soups',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Spicy',
    prepTimeMinutes: 25,
    dietary: ['Gluten-Free'],
    allergens: ['Crustaceans', 'Fish'],
    isPopular: true,
    foodCulture: 'Efik/Ibibio',
    portionOptions: [
      { name: 'Pounded Yam', priceDelta: 0 },
      { name: 'Eba', priceDelta: -200 }
    ]
  },
  {
    id: 'm2',
    restaurantId: 'rest-terra',
    restaurantName: 'Terra Kulture Restaurant',
    name: 'Gourmet Seafood Okro with Hot Poundo Yam',
    description: 'Crunchy diced okro tossed with jumbo tiger prawns, calamari rings, dried fish, and stockfish flakes in fragrant red palm oil broth.',
    price: 5800,
    category: 'Swallows & Soups',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Medium',
    prepTimeMinutes: 25,
    dietary: ['Gluten-Free'],
    allergens: ['Shellfish', 'Crustaceans'],
    isPopular: true,
    foodCulture: 'General Nigerian',
    portionOptions: [
      { name: 'Poundo Yam', priceDelta: 0 },
      { name: 'Eba (Yellow Garri)', priceDelta: -200 },
      { name: 'White Amala', priceDelta: 0 }
    ],
    addOns: [
      { id: 'ao-crab', name: 'Add Sea Crab Claw', price: 1500 },
      { id: 'ao-snail', name: 'Peppered Giant Snail', price: 2400 }
    ]
  },
  {
    id: 'm3',
    restaurantId: 'rest-yellow',
    restaurantName: 'Yellow Chilli',
    name: 'Native Asun Fried Rice with Crisp Pepper Sauce',
    description: 'Wok-charred fragrant rice infused with hot peppered goat meat bits, green peas, spring onion, and native aromatics.',
    price: 4600,
    category: 'Rice Dishes',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Spicy',
    prepTimeMinutes: 20,
    dietary: ['Halal'],
    allergens: [],
    isPopular: true,
    foodCulture: 'Yoruba',
    removableIngredients: ['Onions', 'Extra Hot Pepper'],
    addOns: [
      { id: 'ao-salad', name: 'Creamy Coleslaw Cup', price: 700 },
      { id: 'ao-chicken', name: 'Grilled Crispy Quarter Chicken', price: 2100 }
    ]
  },
  {
    id: 'm4',
    restaurantId: 'rest-bukkahut',
    restaurantName: 'Bukka Hut',
    name: 'Slow-Cooked Egusi Soup with Assorted Meat & Eba',
    description: 'Traditional melon seed soup rich with shredded bitterleaf and spinach, loaded with tripe, cow foot, beef and served with freshly turned eba.',
    price: 3400,
    category: 'Swallows & Soups',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Medium',
    prepTimeMinutes: 18,
    dietary: ['Gluten-Free'],
    allergens: [],
    isPopular: true,
    foodCulture: 'General Nigerian',
    portionOptions: [
      { name: 'Warm Eba (Ijebu Garri)', priceDelta: 0 },
      { name: 'Soft Pounded Yam', priceDelta: 400 },
      { name: 'Oyo Black Amala', priceDelta: 200 }
    ],
    addOns: [
      { id: 'ao-dryfish', name: 'Smoked Catfish Chunk', price: 1200 },
      { id: 'ao-shaki', name: 'Extra Tripe (Shaki)', price: 900 }
    ]
  },
  {
    id: 'm5',
    restaurantId: 'rest-danfo',
    restaurantName: 'Danfo Bistro & Genius Bar',
    name: 'Charcoal Grilled Suya Platter with Spiced Red Onions',
    description: 'Thinly sliced tender prime beef dusted in spicy kuli-kuli yaji pepper blend, grilled over hot open coals and served with sweet red cabbage & tomato.',
    price: 3800,
    category: 'Grills & Suya',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Spicy',
    prepTimeMinutes: 15,
    dietary: ['Halal', 'Dairy-Free'],
    allergens: ['Peanuts'],
    isPopular: true,
    foodCulture: 'Hausa',
    removableIngredients: ['Raw Red Onions', 'Hot Yaji Dust'],
    addOns: [
      { id: 'ao-masa', name: 'Warm Masa Rice Cakes (3 pcs)', price: 900 },
      { id: 'ao-suya-extra', name: 'Extra Suya Spice (Yaji) Pot', price: 300 }
    ]
  },
  {
    id: 'm6',
    restaurantId: 'rest-theplace',
    restaurantName: 'The Place Restaurant',
    name: 'Ofada Rice Bowl with Spicy Ayamase & Boiled Egg',
    description: 'Locally grown short brown ofada rice wrapped in tender leaves, topped with green pepper bleached-palm oil ayamase sauce, egg and diced offal.',
    price: 2900,
    category: 'Rice Dishes',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Spicy',
    prepTimeMinutes: 15,
    dietary: ['Halal'],
    allergens: [],
    isPopular: true,
    foodCulture: 'Yoruba',
    removableIngredients: ['Boiled Egg'],
    addOns: [
      { id: 'ao-dodo-ofada', name: 'Sweet Dodo Side', price: 600 },
      { id: 'ao-egg', name: 'Extra Hard-Boiled Egg', price: 350 }
    ]
  },
  {
    id: 'm8',
    restaurantId: 'rest-danfo',
    restaurantName: 'Danfo Bistro & Genius Bar',
    name: 'Cold Pressed Hibiscus Zobo Cooler with Ginger & Mint',
    description: 'Natural dried roselle calyces brewed with fresh ginger root, sweet pineapple cloves and orange rind. Unrefined and chillingly refreshing.',
    price: 1200,
    category: 'Drinks & Refreshers',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Mild',
    prepTimeMinutes: 5,
    dietary: ['Vegan', 'Gluten-Free'],
    allergens: [],
    isPopular: true
  }
];

// CHOPWIZE MARKET: Grocery Stores (Non-perishable consolidation partners)
export const INITIAL_GROCERY_STORES: GroceryStore[] = [
  {
    id: 'store-ebeano',
    name: 'Ebeano Supermarket',
    area: 'Lekki Phase 1, Lagos',
    rating: 4.8,
    deliveryFee: 1100,
    minOrder: 3000,
    openingHours: '08:00 AM – 09:30 PM',
    isOpen: true,
  },
  {
    id: 'store-spar',
    name: 'SPAR Nigeria',
    area: 'Victoria Island, Lagos',
    rating: 4.7,
    deliveryFee: 1400,
    minOrder: 4000,
    openingHours: '09:00 AM – 09:00 PM',
    isOpen: true,
  },
  {
    id: 'store-justrite',
    name: 'Justrite Superstore',
    area: 'Ikeja & Mainland Hub',
    rating: 4.6,
    deliveryFee: 900,
    minOrder: 2500,
    openingHours: '08:30 AM – 08:30 PM',
    isOpen: true,
  }
];

// CHOPWIZE MARKET: Shelf-Stable & Non-Perishable Food Products
export const INITIAL_MARKET_PRODUCTS: MarketProduct[] = [
  {
    id: 'g-spag-1',
    name: 'Golden Penny Spaghetti',
    brand: 'Golden Penny',
    category: 'Pasta & Noodles',
    imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80',
    description: 'Premium durum wheat semolina long pasta strands. Cooks in 10 minutes without sticking.',
    packSize: '500g Pack',
    basePrice: 950,
    availableUnits: [
      { unitName: '1 Pack (500g)', price: 950, stock: 120 },
      { unitName: 'Carton of 20 packs', price: 18500, stock: 15 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 950, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 980, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 920, inStock: true }
    ]
  },
  {
    id: 'g-indomie-1',
    name: 'Indomie Instant Noodles (Onion Chicken Flavor)',
    brand: 'Indomie',
    category: 'Pasta & Noodles',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    description: 'Nigeria’s favourite instant noodles, rich seasoned broth with onion oil and chili garnish.',
    packSize: 'Hungryman 180g',
    basePrice: 650,
    availableUnits: [
      { unitName: 'Single Pack (180g)', price: 650, stock: 240 },
      { unitName: 'Carton (40 Packs)', price: 24500, stock: 25 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 650, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 680, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 630, inStock: true }
    ]
  },
  {
    id: 'g-rice-1',
    name: 'Mama Gold Pure Thai Parboiled Rice',
    brand: 'Mama Gold',
    category: 'Grains & Rice',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Stone-free, premium parboiled long grain rice for party jollof and fried rice.',
    packSize: '5kg Sealed Bag',
    basePrice: 8400,
    availableUnits: [
      { unitName: '5kg Bag', price: 8400, stock: 40 },
      { unitName: '10kg Bag', price: 16500, stock: 20 },
      { unitName: '25kg Bag', price: 40000, stock: 8 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 8400, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 8700, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 8200, inStock: true }
    ]
  },
  {
    id: 'g-beans-1',
    name: 'Oloyin Sweet Honey Beans (Cleaned)',
    brand: 'Premier Harvest',
    category: 'Grains & Rice',
    imageUrl: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=600&q=80',
    description: 'Naturally sweet brown honey beans, de-stoned and weevil-free. Ideal for ewa aganyin.',
    packSize: '2kg Pack',
    basePrice: 4200,
    availableUnits: [
      { unitName: '2kg Pack', price: 4200, stock: 50 },
      { unitName: '5kg Bag', price: 10200, stock: 18 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 4200, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 4400, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 4100, inStock: true }
    ]
  },
  {
    id: 'g-garri-1',
    name: 'Ijebu Crispy White Garri (Sour & Stone-free)',
    brand: 'Ogun Gold',
    category: 'Flour & Swallow',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    description: 'Finely roasted cassava flakes with that signature tart Ijebu crunch. Great for drinking or hot eba.',
    packSize: '2kg Bag',
    basePrice: 2800,
    availableUnits: [
      { unitName: '2kg Bag', price: 2800, stock: 65 },
      { unitName: 'Paint Bucket (approx 4.5kg)', price: 6200, stock: 22 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 2800, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 2950, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 2700, inStock: true }
    ]
  },
  {
    id: 'g-tomato-1',
    name: 'Gino Peppe & Onion Tomato Paste',
    brand: 'Gino',
    category: 'Canned Foods',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80',
    description: 'Triple concentrated rich tomato paste pre-infused with scotch bonnet peppers and sweet onions.',
    packSize: 'Pack of 5 Sachets (70g each)',
    basePrice: 1600,
    availableUnits: [
      { unitName: 'Pack of 5 (70g)', price: 1600, stock: 90 },
      { unitName: 'Carton of 50 Sachets', price: 15200, stock: 12 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 1600, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 1700, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 1550, inStock: true }
    ]
  },
  {
    id: 'g-sardine-1',
    name: 'Titus Wild Sardines in Vegetable Oil',
    brand: 'Titus',
    category: 'Canned Foods',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    description: 'The golden original Portuguese wild-caught sardines packed in pure refined vegetable oil.',
    packSize: '125g Can',
    basePrice: 1350,
    availableUnits: [
      { unitName: '1 Can (125g)', price: 1350, stock: 150 },
      { unitName: 'Pack of 6 Cans', price: 7900, stock: 30 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 1350, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 1400, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 1300, inStock: false }
    ]
  },
  {
    id: 'g-oil-1',
    name: "Devon King's Pure Vegetable Cooking Oil",
    brand: "Devon King's",
    category: 'Oils & Seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    description: 'Cholesterol-free, crystal clear palm olein oil fortified with Vitamin A for crisp frying.',
    packSize: '1 Litre Bottle',
    basePrice: 3200,
    availableUnits: [
      { unitName: '1 Litre Bottle', price: 3200, stock: 80 },
      { unitName: '5 Litres Jerrycan', price: 15400, stock: 24 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 3200, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 3350, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 3100, inStock: true }
    ]
  },
  {
    id: 'g-seasoning-1',
    name: 'Maggi Star Seasoning Cubes (Pack of 100)',
    brand: 'Maggi',
    category: 'Oils & Seasoning',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    description: 'Classic fortified seasoning cubes delivering that signature West African umami depth.',
    packSize: 'Pack of 100 Cubes',
    basePrice: 1950,
    availableUnits: [
      { unitName: 'Pack of 100', price: 1950, stock: 110 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 1950, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 2050, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 1900, inStock: true }
    ]
  },
  {
    id: 'g-milk-1',
    name: 'Peak Full Cream Evaporated Milk Pouch',
    brand: 'Peak',
    category: 'Dairy & Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    description: 'Rich and creamy Dutch milk packed with essential vitamins and calcium.',
    packSize: 'Pouch 800g',
    basePrice: 4800,
    availableUnits: [
      { unitName: '800g Pouch', price: 4800, stock: 75 },
      { unitName: '400g Tin', price: 2600, stock: 80 }
    ],
    storeAvailability: [
      { storeId: 'store-ebeano', storeName: 'Ebeano Supermarket', price: 4800, inStock: true },
      { storeId: 'store-spar', storeName: 'SPAR Nigeria', price: 5000, inStock: true },
      { storeId: 'store-justrite', storeName: 'Justrite Superstore', price: 4700, inStock: true }
    ]
  }
];

// Initial Customer-Defined AI Rules (Section 5)
export const INITIAL_AI_RULES: AIRule[] = [
  {
    id: 'rule-1',
    text: 'Never recommend meals priced above ₦5,000 for weekday lunch.',
    category: 'budget',
    isActive: true,
    isPermanent: true,
    createdAt: 'Oct 20, 2026'
  },
  {
    id: 'rule-2',
    text: 'Strictly avoid dishes containing shellfish and crustaceans.',
    category: 'ingredient',
    isActive: true,
    isPermanent: true,
    createdAt: 'Oct 15, 2026'
  },
  {
    id: 'rule-3',
    text: 'Prioritise Yoruba and Bukka food when asking for lunch.',
    category: 'cuisine',
    isActive: true,
    isPermanent: false,
    createdAt: 'Oct 25, 2026'
  },
  {
    id: 'rule-4',
    text: 'Ask me for explicit confirmation before adding items to my tray.',
    category: 'cart_guard',
    isActive: true,
    isPermanent: true,
    createdAt: 'Oct 28, 2026'
  },
  {
    id: 'rule-5',
    text: 'Prefer stores where I can consolidate most groceries into 1 pickup.',
    category: 'store_preference',
    isActive: true,
    isPermanent: true,
    createdAt: 'Nov 01, 2026'
  }
];

// Initial Food Memory Items (Section 6)
export const INITIAL_FOOD_MEMORIES: FoodMemoryItem[] = [
  {
    id: 'mem-1',
    type: 'favourite_meal',
    label: 'Signature Jollof with Goat Meat',
    detail: 'Ordered 5 times in October from Terra Kulture Restaurant.',
    confirmedByCustomer: true,
    dateObserved: 'Confirmed Oct 24, 2026'
  },
  {
    id: 'mem-2',
    type: 'favourite_restaurant',
    label: 'Bukka Hut (Lekki Phase 1)',
    detail: 'Highest repeat order frequency for amala and native soups.',
    confirmedByCustomer: true,
    dateObserved: 'Confirmed Oct 18, 2026'
  },
  {
    id: 'mem-3',
    type: 'dietary_habit',
    label: 'Crustaceans & Shellfish Exclusion',
    detail: 'Hard medical allergy rule confirmed across all experiences.',
    confirmedByCustomer: true,
    dateObserved: 'Confirmed Oct 12, 2026'
  },
  {
    id: 'mem-4',
    type: 'inferred_pattern',
    label: 'Weekday 1:00 PM Lunch Habit',
    detail: 'Observed ordering lunch between 12:45 PM and 1:30 PM on workdays.',
    confirmedByCustomer: false,
    dateObserved: 'Observed from 8 recent orders'
  },
  {
    id: 'mem-5',
    type: 'frequent_grocery',
    label: 'Indomie Onion Chicken & Golden Penny Spaghetti',
    detail: 'Restocked bi-weekly from Ebeano Supermarket.',
    confirmedByCustomer: true,
    dateObserved: 'Confirmed Oct 29, 2026'
  }
];

// Initial Smart Meal Reminders (Section 7)
export const INITIAL_MEAL_REMINDERS: MealReminder[] = [
  {
    id: 'rem-lunch-1',
    time: '1:00 PM',
    mealSlot: 'Lunch',
    title: 'Your lunch time is here! 🍛',
    message: 'You planned to have something filling today. We found hot verified options within your ₦4,500 budget.',
    plannedMeal: 'Hot Oyo Amala with Abula',
    suggestedDishes: [
      {
        name: 'Hot Oyo Amala with Abula (Ewedu & Gbegiri)',
        restaurant: 'Bukka Hut',
        price: 3600,
        menuItemId: 'm-amala'
      },
      {
        name: 'Signature Party Jollof with Smoked Goat Meat',
        restaurant: 'Terra Kulture Restaurant',
        price: 4200,
        menuItemId: 'm1'
      }
    ],
    status: 'pending'
  }
];

// Initial Surprise Delivery Configuration (Section 13)
export const INITIAL_SURPRISE_CONFIG: SurpriseDeliveryConfig = {
  isEnabled: false, // Must be disabled by default per Section 13!
  frequency: 'weekly',
  maxBudget: 5000,
  preferredAddress: 'Flat 4B, 18 Bisola Durosinmi Etti Drive, Lekki Phase 1',
  preferredTime: '7:30 PM',
  spicePreference: 'Medium',
  dietaryExclusions: ['Crustaceans', 'Shellfish'],
  activeInvitation: {
    id: 'surp-inv-1',
    date: 'Today, 6:00 PM',
    restaurantName: 'Danfo Bistro & Genius Bar',
    mealName: 'Charcoal Grilled Suya Platter with Spiced Red Onions',
    menuItemId: 'm5',
    price: 3800,
    deliveryFee: 1100,
    total: 4900,
    expiresAt: '7:15 PM',
    status: 'pending'
  }
};

// Initial Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8492',
    orderNumber: 'CW-8492',
    orderType: 'restaurant_meal',
    customerName: 'Amina Bello',
    customerPhone: '+234 803 555 1290',
    deliveryAddress: 'Flat 4B, 18 Bisola Durosinmi Etti Drive, Lekki Phase 1',
    serviceArea: 'Lekki Phase 1',
    restaurantId: 'rest-terra',
    restaurantName: 'Terra Kulture Restaurant',
    fulfilmentType: 'delivery',
    items: [
      {
        cartItemId: 'ci-1',
        menuItem: INITIAL_MENU_ITEMS[0],
        quantity: 1,
        selectedPortion: { name: 'Standard Bowl', priceDelta: 0 },
        selectedAddOns: [{ id: 'ao-dodo', name: 'Extra Sweet Fried Dodo', price: 800 }],
        specialInstructions: 'Extra pepper sauce on the side please.',
        unitPrice: 5000,
        lineTotal: 5000
      },
      {
        cartItemId: 'ci-2',
        menuItem: INITIAL_MENU_ITEMS[9],
        quantity: 2,
        selectedAddOns: [],
        unitPrice: 1200,
        lineTotal: 2400
      }
    ],
    subtotal: 7400,
    deliveryFee: 1200,
    serviceFee: 250,
    discount: 0,
    total: 8850,
    paymentMethod: 'paystack_card',
    paymentStatus: 'paid',
    timelineState: 'preparing',
    placedAt: 'Today, 1:15 PM',
    prepTimeMinutes: 25,
    riderId: 'rider-tunde',
    riderName: 'Tunde Adeleke',
    riderPhone: '+234 812 888 4123',
    pickupVerificationCode: '4921',
    deliveryVerificationCode: '8492'
  },
  {
    id: 'ord-8491',
    orderNumber: 'CW-8491',
    orderType: 'restaurant_meal',
    customerName: 'Chidi Okafor',
    customerPhone: '+234 802 111 8899',
    deliveryAddress: 'Victoria Island Office, 12 Adeola Odeku St',
    serviceArea: 'Victoria Island',
    restaurantId: 'rest-yellow',
    restaurantName: 'Yellow Chilli',
    fulfilmentType: 'delivery',
    items: [
      {
        cartItemId: 'ci-past-1',
        menuItem: INITIAL_MENU_ITEMS[6],
        quantity: 1,
        selectedAddOns: [],
        unitPrice: 4600,
        lineTotal: 4600
      }
    ],
    subtotal: 4600,
    deliveryFee: 1400,
    serviceFee: 250,
    discount: 500,
    total: 5750,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    timelineState: 'completed',
    placedAt: 'Yesterday, 7:40 PM',
    riderId: 'rider-tunde',
    riderName: 'Tunde Adeleke',
    restaurantRating: 5,
    riderRating: 5
  }
];

// Initial Food Budget
export const INITIAL_BUDGET: FoodBudget = {
  monthlyBudget: 150000,
  recordedSpending: 52600,
  homeCookingSpending: 24200,
  restaurantSpending: 28400,
  householdSize: 2,
  expenses: [
    { id: 'exp-1', title: 'Terra Kulture Jollof Dinner', amount: 8850, date: 'Oct 31, 2026', category: 'chopwize' },
    { id: 'exp-2', title: 'Mile 12 Market - Fresh Peppers & Yams', amount: 14500, date: 'Oct 28, 2026', category: 'groceries' },
    { id: 'exp-3', title: 'Yellow Chilli Native Rice Lunch', amount: 5750, date: 'Oct 26, 2026', category: 'chopwize' },
    { id: 'exp-4', title: 'Ebeano Supermarket Shelf Goods', amount: 9700, date: 'Oct 22, 2026', category: 'groceries' },
    { id: 'exp-5', title: 'Weekend Suya & Drinks', amount: 13800, date: 'Oct 20, 2026', category: 'external_dining' }
  ]
};

// Initial Meal Timetable
export const INITIAL_TIMETABLE: MealTimetableEntry[] = [
  { id: 'tt-1', day: 'Monday', mealSlot: 'Breakfast', dishName: 'Akara & Warm Pap with Peak Milk', servings: 2, time: '08:00 AM' },
  { id: 'tt-2', day: 'Monday', mealSlot: 'Lunch', dishName: 'Hot Oyo Amala with Abula', servings: 2, time: '01:00 PM', matchingMenuItemId: 'm-amala' },
  { id: 'tt-3', day: 'Monday', mealSlot: 'Dinner', dishName: 'Signature Jollof Rice with Goat Meat', servings: 2, time: '07:30 PM', matchingMenuItemId: 'm1' },
  { id: 'tt-4', day: 'Tuesday', mealSlot: 'Breakfast', dishName: 'Toasted Agege Bread with Egg & Tea', servings: 2, time: '08:00 AM' },
  { id: 'tt-5', day: 'Tuesday', mealSlot: 'Lunch', dishName: 'Northern Tuwo Shinkafa with Miyan Kuka', servings: 1, time: '01:00 PM', matchingMenuItemId: 'm-tuwo' },
  { id: 'tt-6', day: 'Tuesday', mealSlot: 'Dinner', dishName: 'Native Asun Fried Rice Bowl', servings: 2, time: '08:00 PM', matchingMenuItemId: 'm3' },
  { id: 'tt-7', day: 'Wednesday', mealSlot: 'Lunch', dishName: 'Calabar Afang Soup with Pounded Yam', servings: 2, time: '02:00 PM', matchingMenuItemId: 'm-afang' }
];

// Initial Support Tickets
export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'CW-TK-101',
    orderId: 'ord-8491',
    userRole: 'customer',
    userName: 'Chidi Okafor',
    category: 'delivery_delay',
    status: 'resolved',
    subject: 'Minor delay at Victoria Island gate security',
    description: 'Rider took 10 extra minutes because the security gate required resident visitor call clearance.',
    internalNotes: 'Resolved with customer. Gate clearance procedure noted for VI delivery zone.',
    createdAt: 'Yesterday, 8:15 PM',
    resolvedAt: 'Yesterday, 8:40 PM'
  },
  {
    id: 'tkt-102',
    ticketNumber: 'CW-TK-102',
    userRole: 'restaurant',
    userName: 'Terra Kulture Restaurant',
    category: 'menu_update',
    status: 'open',
    subject: 'Weekend Seafood special pricing review',
    description: 'Requesting validation for new Tiger Prawn portion add-on delta.',
    internalNotes: 'Awaiting Ops approval on menu adjustment percentage.',
    createdAt: 'Today, 11:30 AM'
  }
];

// Initial Rider State
export const INITIAL_RIDER: RiderState = {
  id: 'rider-tunde',
  name: 'Tunde Adeleke',
  phone: '+234 812 888 4123',
  vehicleType: 'Motorcycle',
  plateNumber: 'LSR-429-XY',
  zone: 'Lekki 1 & Victoria Island',
  isOnline: true,
  approvalStatus: 'approved',
  completedTripsToday: 6,
  todayEarnings: 7800,
  rating: 4.9
};
