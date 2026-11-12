import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, PaymentMethod } from '../types';
import {
  Search,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  X,
  Smartphone,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import {
  formatFCFA,
  calculateCommission,
  calculateProducerNet,
  calculateOrderTotal,
} from '../utils/calculations';
import confetti from 'canvas-confetti';

export const MarketView: React.FC = () => {
  const { products, reserveProduct, setActiveTab, currentProfile, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'roots' | 'cereals' | 'vegetables' | 'fruits'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Reservation Form State
  const [quantity, setQuantity] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo');
  const [phoneNumber, setPhoneNumber] = useState('066123456');
  const [pinCode, setPinCode] = useState('1234');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrderNum, setConfirmedOrderNum] = useState<string | null>(null);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCat = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.variety.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenReserveModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(Math.min(100, product.availableStock));
    setErrorMsg(null);
    setConfirmedOrderNum(null);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (quantity <= 0) {
      setErrorMsg('Veuillez entrer une quantité supérieure à 0 kg.');
      return;
    }
    if (quantity > selectedProduct.availableStock) {
      setErrorMsg(`Stock insuffisant. Seulement ${selectedProduct.availableStock} kg disponibles.`);
      return;
    }

    const res = reserveProduct({
      productId: selectedProduct.id,
      quantity,
      paymentMethod,
      buyerPhone: `+242 ${phoneNumber}`,
    });

    if (res.success && res.order) {
      setConfirmedOrderNum(res.order.orderNumber);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Confetti optional
      }
    } else {
      setErrorMsg(res.error || 'Erreur lors de la réservation.');
    }
  };

  // Math for modal preview
  const subtotal = selectedProduct ? quantity * selectedProduct.pricePerUnit : 0;
  const deliveryFee = 2500;
  const total = calculateOrderTotal(subtotal, deliveryFee);
  const commission = calculateCommission(subtotal);
  const producerNet = calculateProducerNet(subtotal);

  return (
    <div className="space-y-6">
      {/* Header and Search Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Marché AgriLink · Vivres Frais du Congo
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Vente directe producteur-acheteur · Paiement sous séquestre Mobile Money · Données de démonstration
            </p>
          </div>

          <button
            onClick={() => setActiveTab('producer')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition self-start sm:self-auto cursor-pointer"
          >
            + Vendre mes récoltes
          </button>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'all' as const, label: t.filterAll },
              { id: 'roots' as const, label: t.filterRoots },
              { id: 'cereals' as const, label: t.filterCereals },
              { id: 'vegetables' as const, label: t.filterVegetables },
              { id: 'fruits' as const, label: t.filterFruits },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isOutOfStock = product.availableStock <= 0;
          return (
            <div
              key={product.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition group"
            >
              <div>
                {/* Product Image */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                    {t.demoDataTag}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{product.location}</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {product.variety} · Producteur : {product.farmerName}
                    </p>
                  </div>

                  {/* Stock Gauge */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">{t.availableStock}</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {product.availableStock} {product.unit} / {product.totalQuantity} {product.unit}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          product.availableStock < 100
                            ? 'bg-amber-500'
                            : product.availableStock <= 0
                            ? 'bg-slate-400'
                            : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (product.availableStock / product.totalQuantity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Freshness Countdown */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Conservation estimée :</span>
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ~{product.shelfLifeDays} jours
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {t.pricePerKg}
                  </span>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums leading-tight">
                    {formatFCFA(product.pricePerUnit)}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenReserveModal(product)}
                  disabled={isOutOfStock}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-[#159447] hover:bg-emerald-600 text-white shadow-sm hover:shadow active:scale-98'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Épuisé' : t.reserveBtn}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reservation Modal with Live Financial & Escrow Math */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  <span>{t.reserveModalTitle}</span>
                </h3>
                <p className="text-xs text-emerald-200/90 mt-0.5">
                  {selectedProduct.name} ({selectedProduct.location})
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {confirmedOrderNum ? (
                /* Success state */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Réservation confirmée sous séquestre !
                    </h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-1">
                      Numéro de commande : {confirmedOrderNum}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      Vos fonds sont sécurisés en séquestre Mobile Money. Le transporteur Marcel Okemba a été notifié pour prise en charge frigorifique.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-left text-xs space-y-1.5 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantité réservée :</span>
                      <span className="font-semibold">{quantity} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nouveau stock restant :</span>
                      <span className="font-semibold text-emerald-600">
                        {selectedProduct.availableStock} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total bloqué en séquestre :</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatFCFA(total)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setActiveTab('transport');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                    >
                      Suivre le transport
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setActiveTab('transactions');
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      Voir ma commande
                    </button>
                  </div>
                </div>
              ) : (
                /* Reservation Form */
                <form onSubmit={handleConfirmReservation} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Quantity input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t.quantityDesired}
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Disponible : {selectedProduct.availableStock} kg
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={selectedProduct.availableStock}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <span className="text-xs font-bold text-slate-500">kg</span>
                    </div>

                    {/* Quick quantity chips */}
                    <div className="flex items-center gap-2 mt-2">
                      {[50, 100, 200].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQuantity(Math.min(q, selectedProduct.availableStock))}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition cursor-pointer"
                        >
                          {q} kg
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setQuantity(selectedProduct.availableStock)}
                        className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 font-medium transition cursor-pointer"
                      >
                        Tout le stock ({selectedProduct.availableStock} kg)
                      </button>
                    </div>
                  </div>

                  {/* Financial Breakdown Table */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>{t.subtotal} ({quantity} kg × {selectedProduct.pricePerUnit} F) :</span>
                      <span className="font-mono tabular-nums font-semibold">{formatFCFA(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-300">
                      <span>{t.deliveryFee} (Forfait RN1) :</span>
                      <span className="font-mono tabular-nums font-semibold">{formatFCFA(deliveryFee)}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white">
                      <span>{t.totalToPay} :</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono tabular-nums text-base">
                        {formatFCFA(total)}
                      </span>
                    </div>

                    {/* Transparent breakdown for jury */}
                    <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>· {t.platformCommission} :</span>
                        <span className="font-mono">{formatFCFA(commission)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                        <span>· {t.producerNet} (95%) :</span>
                        <span className="font-mono">{formatFCFA(producerNet)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.selectPaymentMethod}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mtn_momo')}
                        className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                          paymentMethod === 'mtn_momo'
                            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#FFCC00] text-black font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                          MoMo
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">MTN MoMo</p>
                          <p className="text-[10px] text-slate-500">Congo (*105#)</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('airtel_money')}
                        className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                          paymentMethod === 'airtel_money'
                            ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#E60000] text-white font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs">
                          Airtel
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">Airtel Money</p>
                          <p className="text-[10px] text-slate-500">Congo (*128#)</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Phone & Mock PIN Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {t.phoneLabel}
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="06 612 34 56"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        {t.pinLabel}
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="••••"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-center tracking-widest"
                        required
                      />
                    </div>
                  </div>

                  {/* Escrow Guarantee Text */}
                  <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t.escrowExplanation}</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#159447] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{t.confirmPaymentBtn}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
