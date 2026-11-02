import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AppRole,
  CustomerNavigationTab,
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
  GroceryStore,
  MarketProduct,
  GroceryCartItem,
  GroceryStoreComparison,
  AIRule,
  FoodMemoryItem,
  MealReminder,
  SurpriseDeliveryConfig,
} from '../types';
import {
  INITIAL_RESTAURANTS,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
  INITIAL_BUDGET,
  INITIAL_TIMETABLE,
  INITIAL_TICKETS,
  INITIAL_RIDER,
  INITIAL_GROCERY_STORES,
  INITIAL_MARKET_PRODUCTS,
  INITIAL_AI_RULES,
  INITIAL_FOOD_MEMORIES,
  INITIAL_MEAL_REMINDERS,
  INITIAL_SURPRISE_CONFIG,
} from '../data/mockData';

interface CartConflictModalState {
  isOpen: boolean;
  newItem?: {
    item: MenuItem;
    portion?: MenuItemPortion;
    addOns: MenuItemAddOn[];
    protein?: { name: string; priceDelta: number };
    removedIngredients?: string[];
    instructions?: string;
  };
}

interface AppContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  customerTab: CustomerNavigationTab;
  setCustomerTab: (tab: CustomerNavigationTab) => void;
  customerName: string;
  setCustomerName: (name: string) => void;

  // Location
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;

  // Prepared Food Catalog
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  selectedRestaurantId: string | null;
  setSelectedRestaurantId: (id: string | null) => void;
  toggleRestaurantPause: (id: string) => void;
  toggleItemAvailability: (itemId: string) => void;
  updateMenuItemPrice: (itemId: string, newPrice: number) => void;

  // Prepared Food Tray (Single Restaurant Rule)
  cart: CartItem[];
  cartRestaurant: Restaurant | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    item: MenuItem,
    portion?: MenuItemPortion,
    addOns?: MenuItemAddOn[],
    protein?: { name: string; priceDelta: number },
    removedIngredients?: string[],
    instructions?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartServiceFee: number;
  cartTotal: number;

  // Cart Conflict
  cartConflict: CartConflictModalState;
  resolveCartConflict: (replace: boolean) => void;

  // Chopwize Market: Groceries
  groceryStores: GroceryStore[];
  marketProducts: MarketProduct[];
  groceryCart: GroceryCartItem[];
  isGroceryCartOpen: boolean;
  setIsGroceryCartOpen: (open: boolean) => void;
  addGroceryToCart: (product: MarketProduct, unitName: string, quantity?: number) => void;
  updateGroceryQuantity: (id: string, delta: number) => void;
  removeGroceryItem: (id: string) => void;
  clearGroceryCart: () => void;
  grocerySubtotal: number;
  groceryConsolidations: GroceryStoreComparison[];
  selectedGroceryStoreId: string;
  setSelectedGroceryStoreId: (storeId: string) => void;
  checkoutGroceryOrder: (fulfilment: 'delivery' | 'pickup', address: string) => Order;

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

  // Customer-Defined AI Rules (Section 5)
  aiRules: AIRule[];
  addAIRule: (text: string, category: AIRule['category'], isPermanent: boolean) => void;
  toggleAIRule: (id: string) => void;
  deleteAIRule: (id: string) => void;

  // Food Memory (Section 6)
  foodMemories: FoodMemoryItem[];
  confirmFoodMemory: (id: string) => void;
  deleteFoodMemory: (id: string) => void;

  // Smart Meal Reminders (Section 7)
  mealReminders: MealReminder[];
  handleReminderAction: (id: string, action: 'order' | 'dismiss' | 'snooze' | 'completed' | 'skipped') => void;

  // Chopwize Surprise Delivery (Section 13)
  surpriseConfig: SurpriseDeliveryConfig;
  updateSurpriseConfig: (config: Partial<SurpriseDeliveryConfig>) => void;
  respondToSurpriseInvitation: (action: 'accept' | 'decline') => void;

  // Decision Modals & Feature Tools
  isAIConciergeOpen: boolean;
  setIsAIConciergeOpen: (open: boolean) => void;
  aiConciergeInitialQuery: string;
  openAIConciergeWithQuery: (query: string) => void;

  isSurpriseMeOpen: boolean;
  setIsSurpriseMeOpen: (open: boolean) => void;

  isCookingAssistantOpen: boolean;
  setIsCookingAssistantOpen: (open: boolean) => void;

  // Plans & Budget
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
  const [customerTab, setCustomerTab] = useState<CustomerNavigationTab>('home');
  const [customerName, setCustomerName] = useState('Amina');
  const [selectedLocation, setSelectedLocation] = useState<string>('Lekki Phase 1, Lagos');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Catalog
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  // Prepared Food Tray
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartConflict, setCartConflict] = useState<CartConflictModalState>({ isOpen: false });

  // Chopwize Market Groceries
  const [groceryStores] = useState<GroceryStore[]>(INITIAL_GROCERY_STORES);
  const [marketProducts] = useState<MarketProduct[]>(INITIAL_MARKET_PRODUCTS);
  const [groceryCart, setGroceryCart] = useState<GroceryCartItem[]>([]);
  const [isGroceryCartOpen, setIsGroceryCartOpen] = useState(false);
  const [selectedGroceryStoreId, setSelectedGroceryStoreId] = useState<string>('store-ebeano');

  // Customer AI Rules & Food Memory
  const [aiRules, setAiRules] = useState<AIRule[]>(INITIAL_AI_RULES);
  const [foodMemories, setFoodMemories] = useState<FoodMemoryItem[]>(INITIAL_FOOD_MEMORIES);
  const [mealReminders, setMealReminders] = useState<MealReminder[]>(INITIAL_MEAL_REMINDERS);
  const [surpriseConfig, setSurpriseConfig] = useState<SurpriseDeliveryConfig>(INITIAL_SURPRISE_CONFIG);

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Modals
  const [isAIConciergeOpen, setIsAIConciergeOpen] = useState(false);
  const [aiConciergeInitialQuery, setAIConciergeInitialQuery] = useState('');
  const [isSurpriseMeOpen, setIsSurpriseMeOpen] = useState(false);
  const [isCookingAssistantOpen, setIsCookingAssistantOpen] = useState(false);

  // Plans & Budget
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

  // Find restaurant of items in tray
  const cartRestaurant = cart.length > 0
    ? restaurants.find((r) => r.id === cart[0].menuItem.restaurantId) || null
    : null;

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
  const cartDeliveryFee = cartRestaurant?.supportsDelivery ? cartRestaurant.deliveryFee : 0;
  const cartServiceFee = cart.length > 0 ? 250 : 0;
  const cartTotal = cartSubtotal + cartDeliveryFee + cartServiceFee;

  // Active Customer Order
  const activeOrder = orders.find(
    (o) => o.timelineState !== 'completed' && o.timelineState !== 'cancelled'
  ) || null;

  // Add to tray with single-restaurant enforcement
  const addToCart = (
    item: MenuItem,
    portion?: MenuItemPortion,
    addOns: MenuItemAddOn[] = [],
    protein?: { name: string; priceDelta: number },
    removedIngredients: string[] = [],
    instructions?: string
  ) => {
    if (cart.length > 0 && cart[0].menuItem.restaurantId !== item.restaurantId) {
      setCartConflict({
        isOpen: true,
        newItem: { item, portion, addOns, protein, removedIngredients, instructions },
      });
      return;
    }

    const portionDelta = portion ? portion.priceDelta : 0;
    const proteinDelta = protein ? protein.priceDelta : 0;
    const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = item.price + portionDelta + proteinDelta + addOnsTotal;

    const newItem: CartItem = {
      cartItemId: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      menuItem: item,
      quantity: 1,
      selectedPortion: portion,
      selectedAddOns: addOns,
      selectedProtein: protein,
      removedIngredients,
      specialInstructions: instructions,
      unitPrice,
      lineTotal: unitPrice,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added ${item.name} to your tray`);
  };

  const resolveCartConflict = (replace: boolean) => {
    if (replace && cartConflict.newItem) {
      const { item, portion, addOns, protein, removedIngredients, instructions } = cartConflict.newItem;
      const portionDelta = portion ? portion.priceDelta : 0;
      const proteinDelta = protein ? protein.priceDelta : 0;
      const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);
      const unitPrice = item.price + portionDelta + proteinDelta + addOnsTotal;

      const newItem: CartItem = {
        cartItemId: `ci-${Date.now()}`,
        menuItem: item,
        quantity: 1,
        selectedPortion: portion,
        selectedAddOns: addOns,
        selectedProtein: protein,
        removedIngredients,
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

  // Chopwize Market Grocery Actions & Store Consolidation (Section 9 & 10)
  const addGroceryToCart = (product: MarketProduct, unitName: string, quantity = 1) => {
    const unitConfig = product.availableUnits.find((u) => u.unitName === unitName) || product.availableUnits[0];
    const unitPrice = unitConfig ? unitConfig.price : product.basePrice;

    setGroceryCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.selectedUnit === unitName);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id
            ? { ...i, quantity: i.quantity + quantity, lineTotal: (i.quantity + quantity) * unitPrice }
            : i
        );
      }
      const newItem: GroceryCartItem = {
        id: `gci-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product,
        selectedUnit: unitName,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
      };
      return [...prev, newItem];
    });

    showToast(`Added ${quantity}× ${product.name} (${unitName}) to grocery basket`);
  };

  const updateGroceryQuantity = (id: string, delta: number) => {
    setGroceryCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...i, quantity: nextQty, lineTotal: nextQty * i.unitPrice };
          }
          return i;
        })
        .filter((i): i is GroceryCartItem => i !== null)
    );
  };

  const removeGroceryItem = (id: string) => {
    setGroceryCart((prev) => prev.filter((i) => i.id !== id));
    showToast('Grocery item removed');
  };

  const clearGroceryCart = () => {
    setGroceryCart([]);
  };

  const grocerySubtotal = groceryCart.reduce((sum, item) => sum + item.lineTotal, 0);

  // Grocery Store Consolidation Logic (Section 10)
  const groceryConsolidations = useMemo<GroceryStoreComparison[]>(() => {
    if (groceryCart.length === 0) return [];

    return groceryStores.map((store) => {
      let itemsAvailable = 0;
      let storeSubtotal = 0;
      const missingItemNames: string[] = [];

      groceryCart.forEach((cartItem) => {
        const storeInfo = cartItem.product.storeAvailability.find((sa) => sa.storeId === store.id);
        if (storeInfo && storeInfo.inStock) {
          itemsAvailable += 1;
          storeSubtotal += storeInfo.price * cartItem.quantity;
        } else {
          missingItemNames.push(cartItem.product.name);
        }
      });

      return {
        storeId: store.id,
        storeName: store.name,
        itemsAvailable,
        totalItems: groceryCart.length,
        missingItemNames,
        subtotal: storeSubtotal,
        deliveryFee: store.deliveryFee,
        totalCost: storeSubtotal + (itemsAvailable > 0 ? store.deliveryFee : 0) + 250,
        isFullMatch: itemsAvailable === groceryCart.length,
      };
    }).sort((a, b) => b.itemsAvailable - a.itemsAvailable || a.totalCost - b.totalCost);
  }, [groceryCart, groceryStores]);

  const checkoutGroceryOrder = (fulfilment: 'delivery' | 'pickup', address: string): Order => {
    const chosenStore = groceryStores.find((s) => s.id === selectedGroceryStoreId) || groceryStores[0];
    const comparison = groceryConsolidations.find((c) => c.storeId === chosenStore.id);
    const orderNum = `CW-MKT-${Math.floor(1000 + Math.random() * 9000)}`;

    const deliveryFee = fulfilment === 'delivery' ? chosenStore.deliveryFee : 0;
    const serviceFee = 250;
    const subtotal = comparison?.subtotal || grocerySubtotal;
    const total = subtotal + deliveryFee + serviceFee;

    const newOrder: Order = {
      id: `ord-mkt-${Date.now()}`,
      orderNumber: orderNum,
      orderType: 'grocery_market',
      customerName,
      customerPhone: '+234 803 555 1290',
      deliveryAddress: address,
      serviceArea: selectedLocation.split(',')[0].trim(),
      restaurantId: chosenStore.id,
      restaurantName: chosenStore.name,
      fulfilmentType: fulfilment,
      items: groceryCart.map((gc) => ({
        cartItemId: gc.id,
        menuItem: {
          id: gc.product.id,
          restaurantId: chosenStore.id,
          restaurantName: chosenStore.name,
          name: `${gc.product.name} (${gc.selectedUnit})`,
          description: gc.product.description,
          price: gc.unitPrice,
          category: gc.product.category,
          imageUrl: gc.product.imageUrl,
          isAvailable: true,
          spiceLevel: 'Mild',
          prepTimeMinutes: 15,
          dietary: [],
          allergens: [],
        },
        quantity: gc.quantity,
        selectedAddOns: [],
        unitPrice: gc.unitPrice,
        lineTotal: gc.lineTotal,
      })),
      subtotal,
      deliveryFee,
      serviceFee,
      discount: 0,
      total,
      paymentMethod: 'paystack_card',
      paymentStatus: 'paid',
      timelineState: 'paid',
      placedAt: 'Just now',
      prepTimeMinutes: 20,
      pickupVerificationCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      deliveryVerificationCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      notes: `Consolidated Market order fulfilled by ${chosenStore.name}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
    addBudgetExpense(`${chosenStore.name} (Groceries #${newOrder.orderNumber})`, total, 'groceries');
    setGroceryCart([]);
    setIsGroceryCartOpen(false);
    setCustomerTab('orders');
    showToast(`Grocery order ${orderNum} confirmed from ${chosenStore.name}!`);
    return newOrder;
  };

  const openAIConciergeWithQuery = (query: string) => {
    setAIConciergeInitialQuery(query);
    setIsAIConciergeOpen(true);
  };

  // Place Prepared Food Order
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
      orderType: 'restaurant_meal',
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
      paymentStatus: 'paid',
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
    addBudgetExpense(`${newOrder.restaurantName} (Order #${newOrder.orderNumber})`, newOrder.total, 'chopwize');

    setCart([]);
    setIsCartOpen(false);
    setCustomerTab('orders');
    showToast(`Order ${orderNum} confirmed! Sent to restaurant.`);
    return newOrder;
  };

  const updateOrderTimeline = (
    orderId: string,
    newState: OrderTimelineState,
    extra?: Partial<Order>
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return { ...order, timelineState: newState, ...extra };
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

  // AI Rules Management (Section 5)
  const addAIRule = (text: string, category: AIRule['category'], isPermanent: boolean) => {
    const newRule: AIRule = {
      id: `rule-${Date.now()}`,
      text,
      category,
      isActive: true,
      isPermanent,
      createdAt: 'Today',
    };
    setAiRules((prev) => [newRule, ...prev]);
    showToast('New AI Rule taught to Chopwize!');
  };

  const toggleAIRule = (id: string) => {
    setAiRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
    const target = aiRules.find((r) => r.id === id);
    showToast(target?.isActive ? 'Rule paused' : 'Rule resumed');
  };

  const deleteAIRule = (id: string) => {
    setAiRules((prev) => prev.filter((r) => r.id !== id));
    showToast('AI Rule deleted');
  };

  // Food Memory Management (Section 6)
  const confirmFoodMemory = (id: string) => {
    setFoodMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, confirmedByCustomer: true } : m))
    );
    showToast('Preference confirmed into your permanent Food Memory');
  };

  const deleteFoodMemory = (id: string) => {
    setFoodMemories((prev) => prev.filter((m) => m.id !== id));
    showToast('Memory item removed from your profile');
  };

  // Smart Reminders Management (Section 7)
  const handleReminderAction = (
    id: string,
    action: 'order' | 'dismiss' | 'snooze' | 'completed' | 'skipped'
  ) => {
    const statusMap: Record<string, 'ordered' | 'dismissed' | 'snoozed' | 'completed' | 'skipped'> = {
      order: 'ordered',
      dismiss: 'dismissed',
      snooze: 'snoozed',
      completed: 'completed',
      skipped: 'skipped',
    };
    const nextStatus = statusMap[action] || 'dismissed';
    setMealReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );
    if (action === 'order') {
      const reminder = mealReminders.find((r) => r.id === id);
      if (reminder && reminder.suggestedDishes.length > 0) {
        const dish = menuItems.find((m) => m.id === reminder.suggestedDishes[0].menuItemId) || menuItems[0];
        addToCart(dish);
        setIsCartOpen(true);
      }
    } else if (action === 'dismiss') {
      showToast('Reminder dismissed');
    } else if (action === 'snooze') {
      showToast('Reminder snoozed for 15 minutes');
    } else if (action === 'completed') {
      showToast('Marked meal as enjoyed!');
    } else if (action === 'skipped') {
      showToast('Marked meal as skipped');
    }
  };

  // Surprise Delivery Configuration & Consent Protection (Section 13)
  const updateSurpriseConfig = (config: Partial<SurpriseDeliveryConfig>) => {
    setSurpriseConfig((prev) => ({ ...prev, ...config }));
    showToast('Surprise Delivery settings updated');
  };

  const respondToSurpriseInvitation = (action: 'accept' | 'decline') => {
    if (!surpriseConfig.activeInvitation) return;
    if (action === 'decline') {
      setSurpriseConfig((prev) => ({
        ...prev,
        activeInvitation: prev.activeInvitation ? { ...prev.activeInvitation, status: 'declined' } : undefined,
      }));
      showToast('Surprise invitation declined. No order was created.');
    } else {
      // Customer explicitly accepted invitation -> opens cart with dish and explicit payment
      const inv = surpriseConfig.activeInvitation;
      const dish = menuItems.find((m) => m.id === inv.menuItemId) || menuItems[0];
      addToCart(dish);
      setSurpriseConfig((prev) => ({
        ...prev,
        activeInvitation: prev.activeInvitation ? { ...prev.activeInvitation, status: 'accepted' } : undefined,
      }));
      setIsCartOpen(true);
      showToast('Surprise meal loaded into tray! Review full price and confirm payment.');
    }
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
      userName: role === 'customer' ? customerName : 'Partner Account',
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
        customerName,
        setCustomerName,
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
        groceryStores,
        marketProducts,
        groceryCart,
        isGroceryCartOpen,
        setIsGroceryCartOpen,
        addGroceryToCart,
        updateGroceryQuantity,
        removeGroceryItem,
        clearGroceryCart,
        grocerySubtotal,
        groceryConsolidations,
        selectedGroceryStoreId,
        setSelectedGroceryStoreId,
        checkoutGroceryOrder,
        orders,
        activeOrder,
        placeOrder,
        updateOrderTimeline,
        reorder,
        submitOrderRating,
        aiRules,
        addAIRule,
        toggleAIRule,
        deleteAIRule,
        foodMemories,
        confirmFoodMemory,
        deleteFoodMemory,
        mealReminders,
        handleReminderAction,
        surpriseConfig,
        updateSurpriseConfig,
        respondToSurpriseInvitation,
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
