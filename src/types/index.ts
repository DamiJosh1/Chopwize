export type AppRole = 'customer' | 'restaurant' | 'rider' | 'admin';

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
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedPortion?: MenuItemPortion;
  selectedAddOns: MenuItemAddOn[];
  specialInstructions?: string;
  unitPrice: number;
  lineTotal: number;
}

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
