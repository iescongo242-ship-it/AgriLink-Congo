import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem } from '../types';
import {
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Download,
} from 'lucide-react';
import { formatFCFA } from '../utils/calculations';

export const TransactionsView: React.FC = () => {
  const { orders, confirmReceptionAndReleaseFunds, openDispute, setActiveTab, t } = useApp();

  const [filter, setFilter] = useState<'all' | 'locked' | 'released' | 'disputed'>('all');
  const [activeReportModal, setActiveReportModal] = useState<OrderItem | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'locked') return o.escrowStatus === 'locked';
    if (filter === 'released') return o.escrowStatus === 'released';
    if (filter === 'disputed') return o.escrowStatus === 'disputed_frozen';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Gestion des Commandes & Séquestre Mobile Money</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Garantie de paiement : les fonds sont bloqués jusqu'à validation de la chaîne du froid
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all' as const, label: 'Toutes' },
            { id: 'locked' as const, label: 'En séquestre' },
            { id: 'released' as const, label: 'Clôturées' },
            { id: 'disputed' as const, label: 'Litiges' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filter === tab.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Commande</th>
                <th className="p-4 font-semibold">Produit & Quantité</th>
                <th className="p-4 font-semibold">Montant Total</th>
                <th className="p-4 font-semibold">Répartition (Net / Com 5%)</th>
                <th className="p-4 font-semibold">Statut Séquestre</th>
                <th className="p-4 font-semibold">Livraison</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Aucune commande trouvée pour ce filtre.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                      {ord.orderNumber}
                      <span className="block text-[10px] font-sans font-normal text-slate-400">
                        {ord.createdAt}
                      </span>
                    </td>
                    <td className="p-4 font-medium">
                      <span className="text-slate-900 dark:text-white font-semibold block">
                        {ord.productName}
                      </span>
                      <span className="text-slate-500">
                        {ord.quantity} {ord.unit} · Acheteur : {ord.buyerName}
                      </span>
                    </td>
                    <td className="p-4 font-black tabular-nums text-slate-900 dark:text-white">
                      {formatFCFA(ord.totalPaid)}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {ord.paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'Airtel Money'}
                      </span>
                    </td>
                    <td className="p-4 text-[11px] font-mono space-y-0.5">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold block">
                        Producteur : {formatFCFA(ord.producerNet)}
                      </span>
                      <span className="text-slate-500 block">
                        Commission AgriLink : {formatFCFA(ord.commissionFee)}
                      </span>
                      <span className="text-orange-600 block">
                        Transport : {formatFCFA(ord.deliveryFee)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ord.escrowStatus === 'released'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : ord.escrowStatus === 'locked'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {ord.escrowStatus === 'released' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Libéré au producteur</span>
                          </>
                        ) : ord.escrowStatus === 'locked' ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Bloqué en séquestre</span>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Retenu (Litige ouvert)</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 capitalize font-medium text-slate-700 dark:text-slate-300">
                      {ord.deliveryStep === 'delivered'
                        ? 'Livré & Conforme'
                        : ord.deliveryStep === 'in_transit'
                        ? 'En route (RN1)'
                        : ord.deliveryStep === 'arrived'
                        ? 'Arrivé à destination'
                        : 'Accepté'}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {ord.deliveryReport && (
                        <button
                          onClick={() => setActiveReportModal(ord)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition cursor-pointer"
                        >
                          Rapport Froid
                        </button>
                      )}

                      {ord.escrowStatus === 'locked' && (
                        <button
                          onClick={() => confirmReceptionAndReleaseFunds(ord.id)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
                          title="Valider la bonne réception pour verser les fonds au producteur et chauffeur"
                        >
                          Libérer Séquestre
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {activeReportModal && activeReportModal.deliveryReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Rapport de Livraison officiel ({activeReportModal.deliveryReport.id})
                </h3>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Commande :</span>
                  <span className="font-mono font-bold">{activeReportModal.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Marchandise :</span>
                  <span className="font-semibold">{activeReportModal.quantity} kg {activeReportModal.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transporteur :</span>
                  <span>{activeReportModal.transporterName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block">Température max :</span>
                  <span className="text-lg font-bold font-mono">
                    {activeReportModal.deliveryReport.maxTemperature}°C
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 block">Seuil toléré :</span>
                  <span className="text-lg font-bold font-mono">
                    {activeReportModal.deliveryReport.thresholdTemperature}°C
                  </span>
                </div>
              </div>

              <div
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  activeReportModal.deliveryReport.coldChainRespected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                    : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-800 dark:text-red-300'
                }`}
              >
                {activeReportModal.deliveryReport.coldChainRespected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Chaîne du froid respectée · Aucune détérioration constatée.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Rupture de la chaîne du froid (&gt; 30°C) · Paiement consigné en litige.</span>
                  </>
                )}
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {activeReportModal.deliveryReport.details}
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setActiveReportModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
