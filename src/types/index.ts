export type AppRole = 'customer' | 'restaurant' | 'rider' | 'admin';

export type CustomerNavigationTab = 'home' | 'explore' | 'orders' | 'profile';

export type FoodCulture = 'Yoruba' | 'Igbo' | 'Hausa' | 'Efik/Ibibio' | 'General Nigerian';

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  minOrder: number;
  deliveryFee: number;
  address: string;
  area: string;
  isOpen: boolean;
  isPaused: boolean;
  supportsPickup: boolean;
  supportsDelivery: boolean;
  verified: {
    isVerified: boolean;
    verificationText: string;
    inspectedDate: string;
  };
  openingHours: string;
  categories: string[];
}

export interface MenuItemPortion {
  name: string;
  priceDelta: number;
}

export interface MenuItemAddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  prepTimeMinutes: number;
  dietary: string[];
  allergens: string[];
  portionOptions?: MenuItemPortion[];
  addOns?: MenuItemAddOn[];
  isPopular?: boolean;
  foodCulture?: FoodCulture;
  removableIngredients?: string[];
  availableProteins?: { name: string; priceDelta: number }[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedPortion?: MenuItemPortion;
  selectedAddOns: MenuItemAddOn[];
  selectedProtein?: { name: string; priceDelta: number };
  removedIngredients?: string[];
  specialInstructions?: string;
  unitPrice: number;
  lineTotal: number;
}

// Grocery & Chopwize Market Types
export interface GroceryStore {
  id: string;
  name: string;
  area: string;
  rating: number;
  deliveryFee: number;
  minOrder: number;
  openingHours: string;
  isOpen: boolean;
}

export interface MarketProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  imageUrl: string;
  description: string;
  packSize: string;
  basePrice: number;
  availableUnits: {
    unitName: string; // e.g. "Single Pack", "Carton (40 pcs)", "5kg Bag"
    price: number;
    stock: number;
  }[];
  storeAvailability: {
    storeId: string;
    storeName: string;
    price: number;
    inStock: boolean;
  }[];
}

export interface GroceryCartItem {
  id: string;
  product: MarketProduct;
  selectedUnit: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface GroceryStoreComparison {
  storeId: string;
  storeName: string;
  itemsAvailable: number;
  totalItems: number;
  missingItemNames: string[];
  subtotal: number;
  deliveryFee: number;
  totalCost: number;
  isFullMatch: boolean;
}

// Orders & Lifecycle
export type OrderTimelineState =
  | 'awaiting_payment'
  | 'paid'
  | 'restaurant_accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'rider_assigned'
  | 'picked_up'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  orderType?: 'restaurant_meal' | 'grocery_market' | 'surprise_delivery';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  serviceArea: string;
  restaurantId: string;
  restaurantName: string;
  fulfilmentType: 'delivery' | 'pickup';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  discount: number;
  total: number;
  paymentMethod: 'paystack_card' | 'bank_transfer' | 'chopwize_wallet' | 'cash_on_delivery';
  paymentStatus: 'awaiting_payment' | 'paid' | 'failed' | 'refunded';
  timelineState: OrderTimelineState;
  placedAt: string;
  prepTimeMinutes?: number;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  pickupVerificationCode?: string;
  deliveryVerificationCode?: string;
  isGroupOrder?: boolean;
  groupHostName?: string;
  isGift?: boolean;
  giftDetails?: {
    recipientName: string;
    recipientPhone: string;
    message: string;
  };
  notes?: string;
  cancellationReason?: string;
  restaurantRating?: number;
  riderRating?: number;
}

export interface BudgetExpense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: 'chopwize' | 'groceries' | 'external_dining';
}

export interface FoodBudget {
  monthlyBudget: number;
  recordedSpending: number;
  homeCookingSpending: number;
  restaurantSpending: number;
  householdSize: number;
  expenses: BudgetExpense[];
}

export interface MealTimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  mealSlot: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  dishName: string;
  time?: string;
  servings: number;
  notes?: string;
  matchingMenuItemId?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  orderId?: string;
  userRole: AppRole;
  userName: string;
  category: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  subject: string;
  description: string;
  internalNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface RiderState {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  plateNumber: string;
  zone: string;
  isOnline: boolean;
  approvalStatus: 'approved' | 'under_review' | 'suspended';
  completedTripsToday: number;
  todayEarnings: number;
  rating: number;
}

// Customer-Defined AI Rules (Section 5)
export interface AIRule {
  id: string;
  text: string;
  category: 'budget' | 'ingredient' | 'cuisine' | 'cart_guard' | 'store_preference';
  isActive: boolean;
  isPermanent: boolean;
  createdAt: string;
}

// Food Memory (Section 6)
export interface FoodMemoryItem {
  id: string;
  type: 'favourite_meal' | 'favourite_restaurant' | 'dietary_habit' | 'frequent_grocery' | 'inferred_pattern';
  label: string;
  detail: string;
  confirmedByCustomer: boolean;
  dateObserved: string;
}

// Smart Meal Reminder (Section 7)
export interface MealReminder {
  id: string;
  time: string;
  mealSlot: 'Breakfast' | 'Lunch' | 'Dinner';
  title: string;
  message: string;
  plannedMeal?: string;
  suggestedDishes: {
    name: string;
    restaurant: string;
    price: number;
    menuItemId: string;
  }[];
  status: 'pending' | 'dismissed' | 'snoozed' | 'ordered' | 'completed' | 'skipped';
}

// Chopwize Surprise Delivery (Section 13)
export interface SurpriseDeliveryConfig {
  isEnabled: boolean;
  frequency: 'weekly' | 'twice_monthly' | 'monthly' | 'occasionally';
  maxBudget: number;
  preferredAddress: string;
  preferredTime: string;
  spicePreference: string;
  dietaryExclusions: string[];
  activeInvitation?: {
    id: string;
    date: string;
    restaurantName: string;
    mealName: string;
    menuItemId: string;
    price: number;
    deliveryFee: number;
    total: number;
    expiresAt: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
  };
}
