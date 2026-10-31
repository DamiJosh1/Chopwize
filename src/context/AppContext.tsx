import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppRole,
  Restaurant,
  MenuItem,
  CartItem,
  Order,
  OrderTimelineState,
  FoodBudget,
  MealTimetableEntry,
  SupportTicket,
  RiderState,
  MenuItemPortion,
  MenuItemAddOn,
} from '../types';
import {
  INITIAL_RESTAURANTS,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_BUDGET,
  INITIAL_TIMETABLE,
  INITIAL_TICKETS,
  INITIAL_RIDER,
} from '../data/mockData';

interface CartConflictModalState {
  isOpen: boolean;
  newItem?: {
    item: MenuItem;
    portion?: MenuItemPortion;
    addOns: MenuItemAddOn[];
    instructions?: string;
  };
}

interface AppContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  customerTab: 'home' | 'discover' | 'orders' | 'plans' | 'profile';
  setCustomerTab: (tab: 'home' | 'discover' | 'orders' | 'plans' | 'profile') => void;
  
  // Location
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Catalog
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  toggleRestaurantPause: (id: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  updateMenuItemPrice: (itemId: string, newPrice: number) => void;

  // Cart
  cart: CartItem[];
  cartRestaurant: Restaurant | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: MenuItem, portion?: MenuItemPortion, addOns?: MenuItemAddOn[], instructions?: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartServiceFee: number;
  cartTotal: number;

  // Conflict modal
  cartConflict: CartConflictModalState;
  resolveCartConflict: (replace: boolean) => void;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (details: {
    fulfilmentType: 'delivery' | 'pickup';
    deliveryAddress: string;
    contactPhone: string;
    contactName: string;
    paymentMethod: 'paystack_card' | 'bank_transfer' | 'chopwize_wallet' | 'cash_on_delivery';
    notes?: string;
    isGroupOrder?: boolean;
    groupHostName?: string;
    isGift?: boolean;
    giftDetails?: { recipientName: string; recipientPhone: string; message: string };
  }) => Order;
  updateOrderTimeline: (orderId: string, newState: OrderTimelineState, extra?: Partial<Order>) => void;
  reorder: (order: Order) => void;
  submitOrderRating: (orderId: string, restRating: number, riderRating?: number) => void;

  // Modals & Feature Tools
  isAIConciergeOpen: boolean;
  setIsAIConciergeOpen: (open: boolean) => void;
  aiConciergeInitialQuery: string;
  openAIConciergeWithQuery: (query: string) => void;

  isSurpriseMeOpen: boolean;
  setIsSurpriseMeOpen: (open: boolean) => void;

  isCookingAssistantOpen: boolean;
  setIsCookingAssistantOpen: (open: boolean) => void;

  // Customer Plans
  budget: FoodBudget;
  addBudgetExpense: (title: string, amount: number, category: 'chopwize' | 'groceries' | 'external_dining') => void;
  updateMonthlyBudget: (amount: number) => void;

  timetable: MealTimetableEntry[];
  addTimetableEntry: (entry: Omit<MealTimetableEntry, 'id'>) => void;
  removeTimetableEntry: (id: string) => void;
  setTimetable: (entries: MealTimetableEntry[]) => void;

  // Rider State
  riderState: RiderState;
  toggleRiderOnline: () => void;

  // Support
  tickets: SupportTicket[];
  createSupportTicket: (ticket: { orderId?: string; subject: string; category: string; description: string }) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status'], note?: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('customer');
  const [customerTab, setCustomerTab] = useState<'home' | 'discover' | 'orders' | 'plans' | 'profile'>('home');
  const [selectedLocation, setSelectedLocation] = useState<string>('Lekki Phase 1, Lagos');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Catalog
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartConflict, setCartConflict] = useState<CartConflictModalState>({ isOpen: false });

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Modals
  const [isAIConciergeOpen, setIsAIConciergeOpen] = useState(false);
  const [aiConciergeInitialQuery, setAIConciergeInitialQuery] = useState('');
  const [isSurpriseMeOpen, setIsSurpriseMeOpen] = useState(false);
  const [isCookingAssistantOpen, setIsCookingAssistantOpen] = useState(false);

  // Plans
  const [budget, setBudget] = useState<FoodBudget>(INITIAL_BUDGET);
  const [timetable, setTimetable] = useState<MealTimetableEntry[]>(INITIAL_TIMETABLE);

  // Rider & Support
  const [riderState, setRiderState] = useState<RiderState>(INITIAL_RIDER);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Find restaurant of items in cart
  const cartRestaurant = cart.length > 0
    ? restaurants.find((r) => r.id === cart[0].menuItem.restaurantId) || null
    : null;

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartDeliveryFee = cartRestaurant?.supportsDelivery ? cartRestaurant.deliveryFee : 0;
  const cartServiceFee = cart.length > 0 ? 250 : 0; // Standard fixed platform fee
  const cartTotal = cartSubtotal + cartDeliveryFee + cartServiceFee;

  // Active Customer Order
  const activeOrder = orders.find(
    (o) => o.timelineState !== 'completed' && o.timelineState !== 'cancelled'
  ) || null;

  // Add to cart with single-restaurant enforcement
  const addToCart = (
    item: MenuItem,
    portion?: MenuItemPortion,
    addOns: MenuItemAddOn[] = [],
    instructions?: string
  ) => {
    if (cart.length > 0 && cart[0].menuItem.restaurantId !== item.restaurantId) {
      setCartConflict({
        isOpen: true,
        newItem: { item, portion, addOns, instructions },
      });
      return;
    }

    const portionDelta = portion ? portion.priceDelta : 0;
    const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = item.price + portionDelta + addOnsTotal;

    const newItem: CartItem = {
      cartItemId: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItem: item,
      quantity: 1,
      selectedPortion: portion,
      selectedAddOns: addOns,
      specialInstructions: instructions,
      unitPrice,
      lineTotal: unitPrice,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added ${item.name} to your tray`);
  };

  const resolveCartConflict = (replace: boolean) => {
    if (replace && cartConflict.newItem) {
      const { item, portion, addOns, instructions } = cartConflict.newItem;
      const portionDelta = portion ? portion.priceDelta : 0;
      const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = item.price + portionDelta + addOnsTotal;

      const newItem: CartItem = {
        cartItemId: `ci-${Date.now()}`,
        menuItem: item,
        quantity: 1,
        selectedPortion: portion,
        selectedAddOns: addOns,
        specialInstructions: instructions,
        unitPrice,
        lineTotal: unitPrice,
      };

      setCart([newItem]);
      showToast(`Cleared previous tray & added ${item.name}`);
    }
    setCartConflict({ isOpen: false });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              lineTotal: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    showToast('Item removed from tray');
  };

  const clearCart = () => {
    setCart([]);
  };

  const openAIConciergeWithQuery = (query: string) => {
    setAIConciergeInitialQuery(query);
    setIsAIConciergeOpen(true);
  };

  // Place Order
  const placeOrder = (details: {
    fulfilmentType: 'delivery' | 'pickup';
    deliveryAddress: string;
    contactPhone: string;
    contactName: string;
    paymentMethod: 'paystack_card' | 'bank_transfer' | 'chopwize_wallet' | 'cash_on_delivery';
    notes?: string;
    isGroupOrder?: boolean;
    groupHostName?: string;
    isGift?: boolean;
    giftDetails?: { recipientName: string; recipientPhone: string; message: string };
  }): Order => {
    const orderNum = `CW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: details.contactName,
      customerPhone: details.contactPhone,
      deliveryAddress: details.deliveryAddress,
      serviceArea: selectedLocation.split(',')[0].trim(),
      restaurantId: cartRestaurant?.id || 'rest-terra',
      restaurantName: cartRestaurant?.name || 'Terra Kulture Restaurant',
      fulfilmentType: details.fulfilmentType,
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee: details.fulfilmentType === 'delivery' ? cartDeliveryFee : 0,
      serviceFee: cartServiceFee,
      discount: 0,
      total: cartSubtotal + (details.fulfilmentType === 'delivery' ? cartDeliveryFee : 0) + cartServiceFee,
      paymentMethod: details.paymentMethod,
      paymentStatus: 'paid', // Simulated verified demo payment
      timelineState: 'paid',
      placedAt: 'Just now',
      prepTimeMinutes: 25,
      pickupVerificationCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      deliveryVerificationCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      notes: details.notes,
      isGroupOrder: details.isGroupOrder,
      groupHostName: details.groupHostName,
      isGift: details.isGift,
      giftDetails: details.giftDetails,
    };

    setOrders((prev) => [newOrder, ...prev]);
    
    // Automatically record to budget
    addBudgetExpense(`${newOrder.restaurantName} (Order #${newOrder.orderNumber})`, newOrder.total, 'chopwize');

    // Clear cart and close drawer
    setCart([]);
    setIsCartOpen(false);
    setCustomerTab('orders');
    showToast(`Order ${orderNum} confirmed! Sent to restaurant.`);
    return newOrder;
  };

  // Order Timeline Update
  const updateOrderTimeline = (
    orderId: string,
    newState: OrderTimelineState,
    extra?: Partial<Order>
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updated = { ...order, timelineState: newState, ...extra };
          return updated;
        }
        return order;
      })
    );
  };

  const reorder = (order: Order) => {
    setCart(
      order.items.map((i) => ({
        ...i,
        cartItemId: `ci-reorder-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      }))
    );
    setIsCartOpen(true);
    showToast(`Items from Order #${order.orderNumber} loaded into tray`);
  };

  const submitOrderRating = (orderId: string, restRating: number, riderRating?: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, restaurantRating: restRating, riderRating: riderRating ?? o.riderRating }
          : o
      )
    );
    showToast('Thank you for your rating & feedback!');
  };

  // Restaurant Actions
  const toggleRestaurantPause = (id: string) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isPaused: !r.isPaused } : r))
    );
    const r = restaurants.find((item) => item.id === id);
    showToast(r?.isPaused ? `${r.name} is now accepting orders` : `${r?.name} orders paused temporarily`);
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    const m = menuItems.find((i) => i.id === itemId);
    showToast(m?.isAvailable ? `${m.name} marked as Sold Out` : `${m?.name} restored to Available`);
  };

  const updateMenuItemPrice = (itemId: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: newPrice } : item))
    );
    showToast('Price updated across active menu');
  };

  // Budget Actions
  const addBudgetExpense = (
    title: string,
    amount: number,
    category: 'chopwize' | 'groceries' | 'external_dining'
  ) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      title,
      amount,
      date: 'Today',
      category,
    };
    setBudget((prev) => {
      const isHome = category === 'groceries';
      return {
        ...prev,
        recordedSpending: prev.recordedSpending + amount,
        homeCookingSpending: isHome ? prev.homeCookingSpending + amount : prev.homeCookingSpending,
        restaurantSpending: !isHome ? prev.restaurantSpending + amount : prev.restaurantSpending,
        expenses: [newExp, ...prev.expenses],
      };
    });
  };

  const updateMonthlyBudget = (amount: number) => {
    setBudget((prev) => ({ ...prev, monthlyBudget: amount }));
    showToast(`Monthly food budget set to ₦${amount.toLocaleString()}`);
  };

  // Timetable Actions
  const addTimetableEntry = (entry: Omit<MealTimetableEntry, 'id'>) => {
    const newEntry: MealTimetableEntry = {
      ...entry,
      id: `tt-${Date.now()}`,
    };
    setTimetable((prev) => [...prev, newEntry]);
    showToast(`Added ${entry.dishName} to ${entry.day} ${entry.mealSlot}`);
  };

  const removeTimetableEntry = (id: string) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
    showToast('Removed meal plan slot');
  };

  // Rider Actions
  const toggleRiderOnline = () => {
    setRiderState((prev) => ({ ...prev, isOnline: !prev.isOnline }));
    showToast(riderState.isOnline ? 'Rider went offline' : 'Rider online! Ready for delivery dispatch.');
  };

  // Support
  const createSupportTicket = (ticket: {
    orderId?: string;
    subject: string;
    category: string;
    description: string;
  }) => {
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `CW-TK-${Math.floor(100 + Math.random() * 900)}`,
      orderId: ticket.orderId,
      userRole: role,
      userName: role === 'customer' ? 'Amina Bello' : 'Partner Account',
      category: ticket.category,
      status: 'open',
      subject: ticket.subject,
      description: ticket.description,
      createdAt: 'Just now',
    };
    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Support ticket ${newTicket.ticketNumber} opened. Our team will follow up.`);
  };

  const updateTicketStatus = (
    ticketId: string,
    status: SupportTicket['status'],
    note?: string
  ) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status,
              internalNotes: note || t.internalNotes,
              resolvedAt: status === 'resolved' ? 'Just now' : t.resolvedAt,
            }
          : t
      )
    );
    showToast(`Ticket status updated to ${status}`);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        customerTab,
        setCustomerTab,
        selectedLocation,
        setSelectedLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        restaurants,
        menuItems,
        selectedRestaurantId,
        setSelectedRestaurantId,
        toggleRestaurantPause,
        toggleItemAvailability,
        updateMenuItemPrice,
        cart,
        cartRestaurant,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDeliveryFee,
        cartServiceFee,
        cartTotal,
        cartConflict,
        resolveCartConflict,
        orders,
        activeOrder,
        placeOrder,
        updateOrderTimeline,
        reorder,
        submitOrderRating,
        isAIConciergeOpen,
        setIsAIConciergeOpen,
        aiConciergeInitialQuery,
        openAIConciergeWithQuery,
        isSurpriseMeOpen,
        setIsSurpriseMeOpen,
        isCookingAssistantOpen,
        setIsCookingAssistantOpen,
        budget,
        addBudgetExpense,
        updateMonthlyBudget,
        timetable,
        addTimetableEntry,
        removeTimetableEntry,
        setTimetable,
        riderState,
        toggleRiderOnline,
        tickets,
        createSupportTicket,
        updateTicketStatus,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
