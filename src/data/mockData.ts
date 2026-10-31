import { Restaurant, MenuItem, Order, FoodBudget, MealTimetableEntry, SupportTicket, RiderState } from '../types';

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
    categories: ['Rice Dishes', 'Swallows & Soups', 'Grills & Suya', 'Drinks & Refreshers'],
  },
  {
    id: 'rest-yellow',
    name: 'Yellow Chilli',
    tagline: 'Modern Nigerian culinary flair, renowned seafood okro & native pots',
    cuisine: 'Nigerian Fusion & Seafood',
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
    categories: ['Swallows & Soups', 'Rice Dishes', 'Breakfast & Street', 'Snacks & Small Chops'],
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
    categories: ['Swallows & Soups', 'Grills & Suya', 'Rice Dishes'],
  }
];

// Curated Nigerian Dishes
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
    addOns: [
      { id: 'ao-dodo-ofada', name: 'Sweet Dodo Side', price: 600 },
      { id: 'ao-egg', name: 'Extra Hard-Boiled Egg', price: 350 }
    ]
  },
  {
    id: 'm7',
    restaurantId: 'rest-bukkahut',
    restaurantName: 'Bukka Hut',
    name: 'Hot Fluffy Akara & Ogi (Pap) Breakfast Bowl',
    description: 'Six freshly deep-fried bean cakes golden crisp on the exterior and airy inside, served with steamed spiced corn pap sweetened with milk.',
    price: 1800,
    category: 'Breakfast & Street',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Mild',
    prepTimeMinutes: 12,
    dietary: ['Vegetarian'],
    allergens: [],
    isPopular: false,
    addOns: [
      { id: 'ao-milk', name: 'Evaporated Peak Milk Tin', price: 400 },
      { id: 'ao-akara3', name: 'Add 3 More Akara Balls', price: 500 }
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
  },
  {
    id: 'm9',
    restaurantId: 'rest-theplace',
    restaurantName: 'The Place Restaurant',
    name: 'Warm Sweet Puff Puff Basket (10 pieces)',
    description: 'Traditional Nigerian fried yeast dough balls with hints of nutmeg and vanilla, dusted with cinnamon sugar.',
    price: 1500,
    category: 'Snacks & Small Chops',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Mild',
    prepTimeMinutes: 10,
    dietary: ['Vegetarian'],
    allergens: ['Wheat'],
    isPopular: true
  },
  {
    id: 'm10',
    restaurantId: 'rest-nkoyo',
    restaurantName: 'Nkoyo Specialities',
    name: 'Fresh Catfish Pepper Soup with Boiled Sweet Yam',
    description: 'Wild live catfish cutlets poached in an aromatic broth of alligator pepper, uziza seeds, uda pods, and scent leaves. Fiery and restorative.',
    price: 4900,
    category: 'Swallows & Soups',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    spiceLevel: 'Spicy',
    prepTimeMinutes: 22,
    dietary: ['Pescatarian', 'Dairy-Free'],
    allergens: ['Fish'],
    isPopular: true
  }
];

// Initial Order for Live Multi-Role Synchronization
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8492',
    orderNumber: 'CW-8492',
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
        menuItem: INITIAL_MENU_ITEMS[7],
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
        menuItem: INITIAL_MENU_ITEMS[2],
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
    { id: 'exp-4', title: 'Ebeano Supermarket Proteins & Oil', amount: 9700, date: 'Oct 22, 2026', category: 'groceries' },
    { id: 'exp-5', title: 'Weekend Suya & Drinks', amount: 13800, date: 'Oct 20, 2026', category: 'external_dining' }
  ]
};

// Initial Meal Timetable
export const INITIAL_TIMETABLE: MealTimetableEntry[] = [
  { id: 'tt-1', day: 'Monday', mealSlot: 'Breakfast', dishName: 'Akara & Warm Pap with Peak Milk', servings: 2, time: '08:00 AM', matchingMenuItemId: 'm7' },
  { id: 'tt-2', day: 'Monday', mealSlot: 'Lunch', dishName: 'Party Jollof Rice with Fried Chicken', servings: 2, time: '01:30 PM', matchingMenuItemId: 'm1' },
  { id: 'tt-3', day: 'Monday', mealSlot: 'Dinner', dishName: 'Light Catfish Pepper Soup with Boiled Yam', servings: 2, time: '07:30 PM', matchingMenuItemId: 'm10' },
  { id: 'tt-4', day: 'Tuesday', mealSlot: 'Breakfast', dishName: 'Toasted Agege Bread with Egg & Tea', servings: 2, time: '08:00 AM' },
  { id: 'tt-5', day: 'Tuesday', mealSlot: 'Lunch', dishName: 'Native Asun Fried Rice Bowl', servings: 1, time: '01:00 PM', matchingMenuItemId: 'm3' },
  { id: 'tt-6', day: 'Tuesday', mealSlot: 'Dinner', dishName: 'Fresh Okro Soup with Hot Eba', servings: 2, time: '08:00 PM', matchingMenuItemId: 'm2' },
  { id: 'tt-7', day: 'Wednesday', mealSlot: 'Lunch', dishName: 'Egusi Soup with Assorted Meat & Pounded Yam', servings: 2, time: '02:00 PM', matchingMenuItemId: 'm4' }
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
