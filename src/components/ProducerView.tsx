import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Clock,
  Coins,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { formatFCFA } from '../utils/calculations';

export const ProducerView: React.FC = () => {
  const { publishCrop, products, currentProfile, setActiveTab, t } = useApp();

  const [cropName, setCropName] = useState('Manioc frais (Cossettes)');
  const [category, setCategory] = useState<'roots' | 'cereals' | 'vegetables' | 'fruits'>('roots');
  const [variety, setVariety] = useState('Variété locale douce améliorée');
  const [quantity, setQuantity] = useState<number>(500);
  const [pricePerUnit, setPricePerUnit] = useState<number>(250);
  const [location, setLocation] = useState('Kinkala (Pool) · 75 km de Brazzaville');
  const [harvestDate, setHarvestDate] = useState('12/11/2026');
  const [notes, setNotes] = useState('Récolte du matin, triée à la main. Stocké dans un hangar aéré avec sonde FreshGuard.');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) {
      setErrorMsg('Veuillez renseigner le nom de la culture.');
      return;
    }
    if (quantity <= 0) {
      setErrorMsg('La quantité doit être supérieure à 0 kg.');
      return;
    }
    if (pricePerUnit <= 0) {
      setErrorMsg('Le prix doit être supérieur à 0 FCFA/kg.');
      return;
    }

    const created = publishCrop({
      name: cropName,
      category,
      variety,
      location,
      totalQuantity: quantity,
      pricePerUnit,
      harvestDate,
      notes,
    });

    setErrorMsg(null);
    setSuccessMsg(
      `Votre lot de ${quantity} kg de ${cropName} a été publié avec succès au Marché AgriLink !`
    );

    // Reset some fields for next entry
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4500);
  };

  // Farmer's own listings
  const myListings = products.filter(
    (p) => p.farmerName.toLowerCase().includes(currentProfile.name.toLowerCase()) || p.isDemo
  );

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            <span>Espace Producteur & Publication de Récoltes</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enregistrez vos récoltes pour les rendre visibles aux grossistes de Brazzaville et Pointe-Noire
          </p>
        </div>

        <button
          onClick={() => setActiveTab('freshguard')}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition self-start sm:self-auto cursor-pointer"
        >
          Voir mes capteurs FreshGuard
        </button>
      </div>

      {/* Main Form and Guidance Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Publication Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            Formulaire d'enregistrement de récolte
          </h3>

          {successMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
              <button
                onClick={() => setActiveTab('market')}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Voir au Marché
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Crop name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Culture vivrière / Produit *
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="Ex : Manioc frais, Maïs jaune, Tomates..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Catégorie de produit *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="roots">Racines & Tubercules (Manioc, Igname, Patate)</option>
                  <option value="cereals">Céréales & Grains (Maïs, Soja, Arachides)</option>
                  <option value="vegetables">Légumes frais (Tomates, Aubergines, Oignons)</option>
                  <option value="fruits">Fruits locaux (Banane plantain, Safou, Ananas)</option>
                </select>
              </div>

              {/* Variety */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Variété / Spécification
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="Ex : Doux, Roma, Grain lourd..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Localisation & Département *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex : Kinkala (Pool), Nkayi (Bouenza)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Quantité totale à vendre (kg) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                  required
                />
              </div>

              {/* Price per unit */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Prix au kg (FCFA) *
                </label>
                <input
                  type="number"
                  min="50"
                  step="25"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Conditions de stockage & Remarques
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#159447] hover:bg-emerald-600 text-white font-semibold text-xs shadow-md transition cursor-pointer"
            >
              Enregistrer et publier au Marché
            </button>
          </form>
        </div>

        {/* Right Col: Agronomical Advice Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Guide de Conservation Tropicale</span>
          </h3>

          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Manioc (Pool / Bouenza)
              </span>
              <p>
                Sensible au brunissement vasculaire sous 48h s'il est exposé au soleil. Conserver sous abri aéré à moins de 25°C.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Maïs jaune
              </span>
              <p>
                Séchage complet requis avant ensachage. Risque de charançons si l'humidité dépasse 13%.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                Tomates (Maraîchage)
              </span>
              <p>
                Seuil critique à 30°C. Au-dessus, la fermentation s'accélère exponentiellement. Transport frigorifique fortement conseillé.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer's Active Listings Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
          Mes Récoltes enregistrées ({myListings.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Produit</th>
                <th className="pb-3 font-semibold">Localisation</th>
                <th className="pb-3 font-semibold">Stock Initial</th>
                <th className="pb-3 font-semibold">Stock Restant</th>
                <th className="pb-3 font-semibold">Prix / kg</th>
                <th className="pb-3 font-semibold">Conservation estimée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {myListings.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {p.name}
                  </td>
                  <td className="py-3 text-slate-500">{p.location}</td>
                  <td className="py-3 font-mono">{p.totalQuantity} kg</td>
                  <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {p.availableStock} kg
                  </td>
                  <td className="py-3 font-mono font-semibold">{formatFCFA(p.pricePerUnit)}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                      ~{p.shelfLifeDays} jours
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
