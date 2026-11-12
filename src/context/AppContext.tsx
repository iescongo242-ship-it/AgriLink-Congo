/**
 * AgriLink Congo - Global State Management & Persistence
 * Single source of truth shared by Web UI and USSD Simulator
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  UserProfile,
  LanguageCode,
  Product,
  OrderItem,
  TransportOffer,
  FreshGuardReading,
  FreshGuardConfig,
  AppNotification,
  PaymentMethod,
} from '../types';
import {
  DEMO_PROFILES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_TRANSPORT_OFFERS,
  INITIAL_READINGS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import {
  calculateCommission,
  calculateProducerNet,
  calculateOrderTotal,
  calculateEstimatedDays,
  auditDeliveryColdChain,
} from '../utils/calculations';
import { translations, TranslationDictionary } from '../i18n/translations';

const STORAGE_KEY = 'AGRILINK_CONGO_STATE_v1';

interface AppContextType {
  // Auth & Session
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  registeredUsers: UserProfile[];
  registerUser: (newUser: UserProfile) => void;

  // Profiles & UI State
  currentProfile: UserProfile;
  setCurrentProfile: (profile: UserProfile) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Domain Data
  products: Product[];
  orders: OrderItem[];
  transportOffers: TransportOffer[];
  freshGuardReadings: FreshGuardReading[];
  freshGuardConfig: FreshGuardConfig;
  notifications: AppNotification[];
  inTransitTruckTemp: number;
  inTransitHistory: number[];

  // Presentation Mode
  presentationStep: number | null;
  setPresentationStep: (step: number | null) => void;
  executeDemoStep: (stepNumber: number) => void;

  // Actions
  publishCrop: (cropData: {
    name: string;
    category: 'roots' | 'cereals' | 'vegetables' | 'fruits';
    variety: string;
    location: string;
    totalQuantity: number;
    pricePerUnit: number;
    harvestDate: string;
    notes?: string;
  }) => Product;
  reserveProduct: (params: {
    productId: string;
    quantity: number;
    paymentMethod: PaymentMethod;
    buyerPhone: string;
    transporterName?: string;
  }) => { success: boolean; order?: OrderItem; error?: string };
  advanceDeliveryStep: (orderId: string) => void;
  confirmReceptionAndReleaseFunds: (orderId: string) => void;
  openDispute: (orderId: string, reason: string) => void;
  simulateNewReading: () => void;
  heatStock: () => void;
  coolStock: () => void;
  ventilateStock: () => void;
  updateFreshGuardConfig: (config: Partial<FreshGuardConfig>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  resetToDefaultDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved AgriLink state, fallback to defaults:', e);
    }
    return null;
  };

  const initialSaved = loadInitialState();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialSaved?.isAuthenticated ?? false
  );
  const [currentProfile, setCurrentProfileState] = useState<UserProfile>(
    initialSaved?.currentProfile || DEMO_PROFILES[0]
  );
  const [language, setLanguageState] = useState<LanguageCode>(
    initialSaved?.language || 'fr'
  );
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(
    initialSaved?.isDarkMode || false
  );
  const [activeTab, setActiveTab] = useState<string>(
    initialSaved?.activeTab || 'farmer_space'
  );

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(
    initialSaved?.registeredUsers || DEMO_PROFILES
  );

  const login = (user: UserProfile) => {
    setIsAuthenticated(true);
    setCurrentProfileState(user);
    if (user.role === 'farmer') setActiveTab('farmer_space');
    else if (user.role === 'cooperative') setActiveTab('coop_space');
    else if (user.role === 'transporter') setActiveTab('transporter_space');
    else if (user.role === 'buyer') setActiveTab('buyer_space');
    else setActiveTab('dashboard');
  };

  const registerUser = (newUser: UserProfile) => {
    setRegisteredUsers((prev) => {
      const exists = prev.some((u) => u.phone === newUser.phone || u.id === newUser.id);
      if (exists) {
        return prev.map((u) => (u.phone === newUser.phone ? newUser : u));
      }
      return [...prev, newUser];
    });
    login(newUser);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const [products, setProducts] = useState<Product[]>(
    initialSaved?.products || INITIAL_PRODUCTS
  );
  const [orders, setOrders] = useState<OrderItem[]>(
    initialSaved?.orders || INITIAL_ORDERS
  );
  const [transportOffers] = useState<TransportOffer[]>(
    initialSaved?.transportOffers || INITIAL_TRANSPORT_OFFERS
  );
  const [freshGuardReadings, setFreshGuardReadings] = useState<FreshGuardReading[]>(
    initialSaved?.freshGuardReadings || INITIAL_READINGS
  );
  const [freshGuardConfig, setFreshGuardConfig] = useState<FreshGuardConfig>(
    initialSaved?.freshGuardConfig || {
      source: 'simulation',
      esp32Endpoint: 'http://192.168.4.1/data',
      tempCriticalThreshold: 30, // 30°C threshold for fresh produce
      gasCriticalThreshold: 1.2,
      shelfLifeAlertThreshold: 3, // <= 3 days triggers alert
      isConnected: false,
    }
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    initialSaved?.notifications || INITIAL_NOTIFICATIONS
  );

  // Live truck telemetry during in-transit simulation
  const [inTransitTruckTemp, setInTransitTruckTemp] = useState<number>(
    initialSaved?.inTransitTruckTemp || 24.2
  );
  const [inTransitHistory, setInTransitHistory] = useState<number[]>(
    initialSaved?.inTransitHistory || [23.5, 24.0, 24.2]
  );

  // Guided presentation mode step
  const [presentationStep, setPresentationStep] = useState<number | null>(null);

  // Sync to HTML root for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        isAuthenticated,
        currentProfile,
        registeredUsers,
        language,
        isDarkMode,
        activeTab,
        products,
        orders,
        transportOffers,
        freshGuardReadings,
        freshGuardConfig,
        notifications,
        inTransitTruckTemp,
        inTransitHistory,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [
    isAuthenticated,
    currentProfile,
    registeredUsers,
    language,
    isDarkMode,
    activeTab,
    products,
    orders,
    transportOffers,
    freshGuardReadings,
    freshGuardConfig,
    notifications,
    inTransitTruckTemp,
    inTransitHistory,
  ]);

  // Polling for ESP32 if real mode is enabled
  useEffect(() => {
    if (freshGuardConfig.source !== 'real_esp32') return;

    let isSubscribed = true;
    const interval = setInterval(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout constraint
        const res = await fetch(freshGuardConfig.esp32Endpoint, {
          signal: controller.signal,
          mode: 'cors',
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();

        if (isSubscribed && data && typeof data.t === 'number') {
          const newReading: FreshGuardReading = {
            temperature: data.t,
            humidity: data.h || 75,
            gasIndex: data.g || 1.0,
            estimatedDays: data.d || 5,
            isAlert: !!data.alert || data.t >= freshGuardConfig.tempCriticalThreshold,
            alertReason: data.msg || undefined,
            timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            source: 'real_esp32',
          };

          setFreshGuardReadings((prev) => [...prev.slice(-15), newReading]);
          setFreshGuardConfig((prev) => ({
            ...prev,
            isConnected: true,
            connectionError: undefined,
            lastSyncTime: new Date().toLocaleTimeString('fr-FR'),
          }));
        }
      } catch (err: unknown) {
        if (isSubscribed) {
          const msg = err instanceof Error ? err.message : 'Injoignable';
          console.warn('ESP32 unreachable, auto-falling back to simulation per specification:', msg);
          setFreshGuardConfig((prev) => ({
            ...prev,
            source: 'simulation',
            isConnected: false,
            connectionError: 'Capteur réel injoignable (délai dépassé ou bloqué par HTTPS). Bascule automatique en mode simulation.',
          }));
          addNotification({
            title: 'Bascule capteur FreshGuard',
            message: 'Le capteur ESP32 n a pas répondu dans le délai de 1.5s. Rebascule automatique sur la simulation interne sécurisée.',
            type: 'warning',
          });
        }
      }
    }, 2000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [freshGuardConfig.source, freshGuardConfig.esp32Endpoint, freshGuardConfig.tempCriticalThreshold]);

  // Helpers
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: 'À l instant',
      isRead: false,
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const publishCrop = (cropData: {
    name: string;
    category: 'roots' | 'cereals' | 'vegetables' | 'fruits';
    variety: string;
    location: string;
    totalQuantity: number;
    pricePerUnit: number;
    harvestDate: string;
    notes?: string;
  }): Product => {
    const id = `prod-custom-${Date.now()}`;
    const initialDays = calculateEstimatedDays(25, 75, 1.0, cropData.category);

    const newProd: Product = {
      id,
      name: cropData.name,
      category: cropData.category,
      variety: cropData.variety || 'Variété locale',
      location: cropData.location || 'Brazzaville',
      region: 'Pool / Brazzaville',
      farmerName: currentProfile.name,
      farmerPhone: currentProfile.phone,
      totalQuantity: cropData.totalQuantity,
      availableStock: cropData.totalQuantity,
      unit: 'kg',
      pricePerUnit: cropData.pricePerUnit,
      harvestDate: cropData.harvestDate || 'Aujourd hui',
      shelfLifeDays: initialDays,
      image:
        cropData.category === 'roots'
          ? '/src/assets/images/crop_cassava_manioc_1794476792190.jpg'
          : cropData.category === 'cereals'
          ? '/src/assets/images/crop_yellow_corn_1794476792544.jpg'
          : '/src/assets/images/crop_ripe_tomatoes_1794476792513.jpg',
      isDemo: true,
      notes: cropData.notes,
    };

    setProducts((prev) => [newProd, ...prev]);

    addNotification({
      title: 'Récolte publiée au Marché',
      message: `${cropData.totalQuantity} kg de ${cropData.name} mis en vente à ${cropData.pricePerUnit} FCFA/kg.`,
      type: 'success',
    });

    return newProd;
  };

  const reserveProduct = ({
    productId,
    quantity,
    paymentMethod,
    buyerPhone,
    transporterName = 'Marcel Okemba (Transport Frigo)',
  }: {
    productId: string;
    quantity: number;
    paymentMethod: PaymentMethod;
    buyerPhone: string;
    transporterName?: string;
  }) => {
    const target = products.find((p) => p.id === productId);
    if (!target) return { success: false, error: 'Produit introuvable.' };

    if (quantity <= 0) return { success: false, error: 'La quantité doit être supérieure à 0.' };
    if (quantity > target.availableStock) {
      return {
        success: false,
        error: `Stock insuffisant : seulement ${target.availableStock} kg disponibles (vous avez demandé ${quantity} kg).`,
      };
    }

    // Step 5 of demo: stock decreases (e.g. 500 -> 400 kg)
    const newStock = target.availableStock - quantity;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, availableStock: newStock } : p))
    );

    const productTotal = quantity * target.pricePerUnit;
    const commissionFee = calculateCommission(productTotal); // 5%
    const producerNet = calculateProducerNet(productTotal);   // 95%
    const deliveryFee = 2500; // Flat demonstration delivery fee
    const totalPaid = calculateOrderTotal(productTotal, deliveryFee);

    const orderNumber = `#AGL-${String(orders.length + 1).padStart(3, '0')}`;
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber,
      productId: target.id,
      productName: target.name,
      quantity,
      unit: target.unit,
      unitPrice: target.pricePerUnit,
      productTotal,
      commissionFee,
      producerNet,
      deliveryFee,
      totalPaid,
      buyerName: currentProfile.role === 'buyer' ? currentProfile.name : 'Mireille Ngoma (Grossiste)',
      buyerPhone: buyerPhone || currentProfile.phone,
      transporterName,
      transporterPhone: '+242 06 945 11 22',
      paymentMethod,
      escrowStatus: 'locked', // Locked in escrow!
      deliveryStep: 'accepted',
      createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Add telemetry log for this new order
    setInTransitHistory([24.0, 24.5, 25.0]);

    addNotification({
      title: `Réservation confirmée (${orderNumber})`,
      message: `${quantity} kg de ${target.name} réservés. Montant de ${totalPaid.toLocaleString()} FCFA bloqué en séquestre sécurisé.`,
      type: 'success',
    });

    return { success: true, order: newOrder };
  };

  const advanceDeliveryStep = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;

        let nextStep = ord.deliveryStep;
        if (ord.deliveryStep === 'pending') nextStep = 'accepted';
        else if (ord.deliveryStep === 'accepted') nextStep = 'in_transit';
        else if (ord.deliveryStep === 'in_transit') nextStep = 'arrived';
        else if (ord.deliveryStep === 'arrived') nextStep = 'delivered';

        let report = ord.deliveryReport;
        let newEscrow = ord.escrowStatus;

        // When arriving or delivered, audit temperature against threshold (30°C)
        if (nextStep === 'arrived' || nextStep === 'delivered') {
          report = auditDeliveryColdChain(inTransitHistory, freshGuardConfig.tempCriticalThreshold);

          // If cold chain violated, mark dispute
          if (!report.coldChainRespected) {
            newEscrow = 'disputed_frozen';
            addNotification({
              title: `Rupture de chaîne du froid (${ord.orderNumber})`,
              message: `Température max de ${report.maxTemperature}°C (> ${freshGuardConfig.tempCriticalThreshold}°C). Paiement bloqué en litige.`,
              type: 'alert',
            });
          } else {
            addNotification({
              title: `Livraison prête à être validée (${ord.orderNumber})`,
              message: `Arrivé à destination. Chaîne du froid respectée (${report.maxTemperature}°C). En attente de validation acheteur.`,
              type: 'info',
            });
          }
        }

        return {
          ...ord,
          deliveryStep: nextStep,
          deliveryReport: report,
          escrowStatus: newEscrow,
        };
      })
    );
  };

  const confirmReceptionAndReleaseFunds = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          deliveryStep: 'delivered',
          escrowStatus: 'released', // Money unlocked to producer and transporter!
        };
      })
    );

    const target = orders.find((o) => o.id === orderId);
    if (target) {
      addNotification({
        title: `Paiement Séquestre Libéré (${target.orderNumber})`,
        message: `Fonds versés : ${target.producerNet.toLocaleString()} FCFA au producteur, ${target.deliveryFee.toLocaleString()} FCFA au transporteur. Commission AgriLink (5%) : ${target.commissionFee.toLocaleString()} FCFA.`,
        type: 'success',
      });
    }
  };

  const openDispute = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, escrowStatus: 'disputed_frozen' } : ord))
    );
    addNotification({
      title: `Litige ouvert sur la commande`,
      message: `Raison : ${reason}. Les fonds restent sous séquestre jusqu à arbitrage.`,
      type: 'alert',
    });
  };

  // FreshGuard interactive tests
  const simulateNewReading = () => {
    const last = freshGuardReadings[freshGuardReadings.length - 1] || INITIAL_READINGS[0];
    const newTemp = Math.round((last.temperature + (Math.random() * 0.8 - 0.4)) * 10) / 10;
    const newHum = Math.min(95, Math.max(50, Math.round(last.humidity + (Math.random() * 2 - 1))));
    const newGas = Math.round((last.gasIndex + (Math.random() * 0.04 - 0.02)) * 100) / 100;
    const days = calculateEstimatedDays(newTemp, newHum, newGas, 'vegetables');

    const isAlert = days <= freshGuardConfig.shelfLifeAlertThreshold || newTemp >= freshGuardConfig.tempCriticalThreshold;
    const newReading: FreshGuardReading = {
      temperature: newTemp,
      humidity: newHum,
      gasIndex: newGas,
      estimatedDays: days,
      isAlert,
      alertReason: isAlert
        ? newTemp >= freshGuardConfig.tempCriticalThreshold
          ? `Température excessive (${newTemp}°C >= ${freshGuardConfig.tempCriticalThreshold}°C)`
          : `Conservation courte (${days} jours restants)`
        : undefined,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      source: 'simulation',
    };

    setFreshGuardReadings((prev) => [...prev.slice(-15), newReading]);
    setInTransitTruckTemp(newTemp);
    setInTransitHistory((prev) => [...prev, newTemp]);

    if (isAlert) {
      addNotification({
        title: 'Alerte FreshGuard Stock !',
        message: `Attention : ${newReading.alertReason}. Risque de perte de récolte.`,
        type: 'alert',
      });
    }
  };

  const heatStock = () => {
    // Forced +3°C heat simulation (causes critical alert and enables dispute testing!)
    const last = freshGuardReadings[freshGuardReadings.length - 1] || INITIAL_READINGS[0];
    const newTemp = Math.round((last.temperature + 3.0) * 10) / 10;
    const newHum = Math.min(96, last.humidity + 4);
    const newGas = Math.round((last.gasIndex + 0.15) * 100) / 100;
    const days = calculateEstimatedDays(newTemp, newHum, newGas, 'vegetables');

    const newReading: FreshGuardReading = {
      temperature: newTemp,
      humidity: newHum,
      gasIndex: newGas,
      estimatedDays: days,
      isAlert: true,
      alertReason: `Chaleur anormale détectée : ${newTemp}°C (seuil ${freshGuardConfig.tempCriticalThreshold}°C)`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      source: 'simulation',
    };

    setFreshGuardReadings((prev) => [...prev.slice(-15), newReading]);
    setInTransitTruckTemp(newTemp);
    setInTransitHistory((prev) => [...prev, newTemp]);

    addNotification({
      title: 'Alerte Canicule / Rupture Chaîne du Froid',
      message: `Température grimpée à ${newTemp}°C ! Dégradation estimée dans ${days} jours.`,
      type: 'alert',
    });
  };

  const coolStock = () => {
    // Forced -3°C cool down
    const last = freshGuardReadings[freshGuardReadings.length - 1] || INITIAL_READINGS[0];
    const newTemp = Math.max(12, Math.round((last.temperature - 3.0) * 10) / 10);
    const newHum = Math.max(60, last.humidity - 5);
    const newGas = Math.max(0.85, Math.round((last.gasIndex - 0.1) * 100) / 100);
    const days = calculateEstimatedDays(newTemp, newHum, newGas, 'vegetables');

    const newReading: FreshGuardReading = {
      temperature: newTemp,
      humidity: newHum,
      gasIndex: newGas,
      estimatedDays: days,
      isAlert: false,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      source: 'simulation',
    };

    setFreshGuardReadings((prev) => [...prev.slice(-15), newReading]);
    setInTransitTruckTemp(newTemp);
    setInTransitHistory((prev) => [...prev, newTemp]);

    addNotification({
      title: 'Refroidissement actif réussi',
      message: `Température rétablie à ${newTemp}°C. Conservation estimée allongée à ${days} jours.`,
      type: 'success',
    });
  };

  const ventilateStock = () => {
    const last = freshGuardReadings[freshGuardReadings.length - 1] || INITIAL_READINGS[0];
    const newGas = Math.max(0.8, Math.round((last.gasIndex - 0.25) * 100) / 100);
    const newHum = Math.max(65, last.humidity - 8);
    const days = calculateEstimatedDays(last.temperature, newHum, newGas, 'vegetables');

    const newReading: FreshGuardReading = {
      temperature: last.temperature,
      humidity: newHum,
      gasIndex: newGas,
      estimatedDays: days,
      isAlert: false,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      source: 'simulation',
    };

    setFreshGuardReadings((prev) => [...prev.slice(-15), newReading]);
    addNotification({
      title: 'Ventilation du stockage terminée',
      message: `Évacuation de l éthylène et de l humidité. Indice de gaz ramené à ${newGas}.`,
      type: 'info',
    });
  };

  const updateFreshGuardConfig = (config: Partial<FreshGuardConfig>) => {
    setFreshGuardConfig((prev) => ({ ...prev, ...config }));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetToDefaultDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
    setCurrentProfileState(DEMO_PROFILES[0]);
    setLanguageState('fr');
    setIsDarkModeState(false);
    setActiveTab('dashboard');
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setFreshGuardReadings(INITIAL_READINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setInTransitTruckTemp(24.2);
    setInTransitHistory([23.5, 24.0, 24.2]);
    setPresentationStep(null);
    setFreshGuardConfig({
      source: 'simulation',
      esp32Endpoint: 'http://192.168.4.1/data',
      tempCriticalThreshold: 30,
      gasCriticalThreshold: 1.2,
      shelfLifeAlertThreshold: 3,
      isConnected: false,
    });
  };

  // Guided 13-step demonstration script execution helper
  const executeDemoStep = useCallback((stepNumber: number) => {
    setIsAuthenticated(true);
    setPresentationStep(stepNumber);

    switch (stepNumber) {
      case 1:
        // 1. Jean Mavoungou publishes 500 kg cassava at 250 FCFA/kg
        setCurrentProfileState(DEMO_PROFILES[0]); // Jean Mavoungou (farmer)
        setActiveTab('farmer_space');
        break;
      case 2:
        // 2. Product appears immediately on the market
        setActiveTab('producer');
        break;
      case 3:
        // 3. FreshGuard stock triggers alert: decay in 3 days
        setActiveTab('freshguard');
        heatStock(); // simulates temperature rise and brings conservation down
        break;
      case 4:
      case 5:
        // 4 & 5. Buyer Mireille Ngoma reserves 100 kg, pays with MoMo, stock goes 500 -> 400 kg
        setCurrentProfileState(DEMO_PROFILES[3]); // Mireille Ngoma (buyer)
        setActiveTab('buyer_space');
        reserveProduct({
          productId: 'prod-manioc-01',
          quantity: 100,
          paymentMethod: 'mtn_momo',
          buyerPhone: '+242 05 777 44 33',
        });
        break;
      case 6:
        // 6. Carrier Marcel Okemba accepts transport offer
        setCurrentProfileState(DEMO_PROFILES[2]); // Marcel Okemba (transporter)
        setActiveTab('transporter_space');
        break;
      case 7:
        // 7. Delivery moves to "En route", FreshGuard Route shows live telemetry
        setActiveTab('transporter_space');
        if (orders.length > 0) {
          advanceDeliveryStep(orders[0].id);
        }
        break;
      case 8:
        // 8. Delivery arrives, delivery report generated
        setActiveTab('transporter_space');
        if (orders.length > 0) {
          advanceDeliveryStep(orders[0].id);
        }
        break;
      case 9:
      case 10:
        // 9 & 10. Buyer confirms reception: money released, 5% commission recorded, order Confirmed
        setCurrentProfileState(DEMO_PROFILES[3]); // Mireille Ngoma (buyer)
        setActiveTab('buyer_space');
        if (orders.length > 0) {
          confirmReceptionAndReleaseFunds(orders[0].id);
        }
        break;
      case 11:
        // 11. National view & dashboard show avoided waste
        setCurrentProfileState(DEMO_PROFILES[4]); // Supervision Direction Nationale
        setActiveTab('national');
        break;
      case 12:
        // 12. Dispute variant: heat during route > 30°C, payment retained, dispute opened
        setActiveTab('transport');
        heatStock();
        setInTransitHistory((prev) => [...prev, 32.5, 33.1]);
        if (orders.length > 0) {
          advanceDeliveryStep(orders[0].id);
        }
        break;
      case 13:
        // 13. Show USSD *140#, language choice, product browsing
        setActiveTab('ussd');
        break;
      default:
        break;
    }
  }, [orders, freshGuardConfig.tempCriticalThreshold]);

  const t = translations[language] || translations.fr;

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        registeredUsers,
        registerUser,
        currentProfile,
        setCurrentProfile: setCurrentProfileState,
        language,
        setLanguage: setLanguageState,
        t,
        isDarkMode,
        setIsDarkMode: setIsDarkModeState,
        activeTab,
        setActiveTab,
        products,
        orders,
        transportOffers,
        freshGuardReadings,
        freshGuardConfig,
        notifications,
        inTransitTruckTemp,
        inTransitHistory,
        presentationStep,
        setPresentationStep,
        executeDemoStep,
        publishCrop,
        reserveProduct,
        advanceDeliveryStep,
        confirmReceptionAndReleaseFunds,
        openDispute,
        simulateNewReading,
        heatStock,
        coolStock,
        ventilateStock,
        updateFreshGuardConfig,
        markNotificationAsRead,
        clearAllNotifications,
        resetToDefaultDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
