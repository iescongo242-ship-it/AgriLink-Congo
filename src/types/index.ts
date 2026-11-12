/**
 * AgriLink Congo - Domain Types
 * République du Congo - Plateforme Vivrière & AgriTech
 */

export type UserRole = 'farmer' | 'cooperative' | 'transporter' | 'buyer' | 'jury';

export type LanguageCode = 'fr' | 'ln' | 'kt';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  location: string;
  phone: string;
  email?: string;
  password?: string;
  avatar: string;
  description: string;
  allowedTabs: string[];
}

export type CropCategory = 'all' | 'roots' | 'cereals' | 'vegetables' | 'fruits';

export interface Product {
  id: string;
  name: string;
  category: 'roots' | 'cereals' | 'vegetables' | 'fruits';
  variety: string;
  location: string;
  region: string;
  farmerName: string;
  farmerPhone: string;
  totalQuantity: number;
  availableStock: number;
  unit: string;
  pricePerUnit: number; // in FCFA
  harvestDate: string;
  shelfLifeDays: number;
  image: string;
  isDemo: boolean;
  notes?: string;
}

export type PaymentMethod = 'mtn_momo' | 'airtel_money';

export type EscrowStatus = 'unpaid' | 'locked' | 'released' | 'disputed_frozen';

export type DeliveryStep = 'pending' | 'accepted' | 'in_transit' | 'arrived' | 'delivered';

export interface OrderItem {
  id: string;
  orderNumber: string; // e.g. #AGL-001
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  productTotal: number;
  commissionFee: number; // 5%
  producerNet: number;   // 95%
  deliveryFee: number;
  totalPaid: number;
  buyerName: string;
  buyerPhone: string;
  transporterName: string;
  transporterPhone: string;
  paymentMethod: PaymentMethod;
  escrowStatus: EscrowStatus;
  deliveryStep: DeliveryStep;
  createdAt: string;
  deliveryReport?: DeliveryReport;
}

export interface DeliveryReport {
  id: string;
  maxTemperature: number;
  avgTemperature: number;
  minTemperature: number;
  thresholdTemperature: number;
  durationMinutes: number;
  coldChainRespected: boolean;
  statusText: string;
  details: string;
  generatedAt: string;
}

export interface FreshGuardReading {
  temperature: number; // Celsius
  humidity: number;    // %
  gasIndex: number;    // Ethylene / CO2 fermentation index (normal: 0.8 - 1.1)
  estimatedDays: number;
  isAlert: boolean;
  alertReason?: string;
  timestamp: string;
  source: 'simulation' | 'real_esp32';
}

export interface FreshGuardConfig {
  source: 'simulation' | 'real_esp32';
  esp32Endpoint: string;
  tempCriticalThreshold: number; // e.g. 30°C for tomatoes
  gasCriticalThreshold: number;  // e.g. 1.25
  shelfLifeAlertThreshold: number; // e.g. 3 days
  isConnected: boolean;
  lastSyncTime?: string;
  connectionError?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
}

export interface TransportOffer {
  id: string;
  transporterName: string;
  vehicleType: string;
  isRefrigerated: boolean;
  capacityKg: number;
  route: string;
  pricePerKg: number;
  availableDate: string;
  phone: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  targetRole: string;
  features: string[];
  isPopular?: boolean;
}

export interface AgroTraining {
  id: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  instructor: string;
  priceFCFA: number;
  isFreeDemo: boolean;
}
