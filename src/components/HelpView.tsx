import React from 'react';
import { useApp } from '../context/AppContext';
import {
  HelpCircle,
  ShieldCheck,
  PlayCircle,
  FileCode,
  Smartphone,
  Cpu,
  Layers,
  Award,
  ExternalLink,
} from 'lucide-react';

export const HelpView: React.FC = () => {
  const { executeDemoStep, setActiveTab } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
            <span>Guide d'Utilisation & Documentation Officielle</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Projet AgriLink Congo · Plateforme Vivrière Connectée pour la République du Congo
          </p>
        </div>

        <button
          onClick={() => executeDemoStep(1)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition self-start sm:self-auto cursor-pointer"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Lancer la Démo Guidée (4 min)</span>
        </button>
      </div>

      {/* Honesty & Transparency Declaration */}
      <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <h3 className="font-extrabold text-sm uppercase tracking-wide">
            Charte d'Honnêteté & Transparence (Non Négociable)
          </h3>
        </div>

        <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
          L'application propose un environnement de démonstration pleinement fonctionnel avec des garanties de transparence :
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-amber-900/90 dark:text-amber-200/90 pt-1">
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span><strong>Données de démonstration :</strong> Les prix, volumes et noms sont des hypothèses réalistes.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span><strong>Paiement Mobile Money :</strong> Simulation de séquestre (aucun vrai argent ni code PIN traité).</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span><strong>Code USSD *140# :</strong> Code d'essai pour la démonstration (non attribué par l'ARPCE).</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span><strong>GPS & Carte :</strong> Schématique de la RN1 (Kinkala ↔ Brazzaville).</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span><strong>Traductions Lingala/Kituba :</strong> Provisoires, à faire certifier par des linguistes.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span>•</span>
            <span><strong>Calculs agronomiques :</strong> Formules simples et transparentes basées sur les guides FAO.</span>
          </li>
        </ul>
      </div>

      {/* 4-Minute Jury Demonstration Script */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>Parcours Démonstration Jury en 13 Étapes (&lt; 4 minutes)</span>
        </h3>

        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          {[
            { n: 1, title: 'Publication 500 kg manioc', desc: "Jean Mavoungou publie son stock à 250 FCFA/kg depuis Kinkala.", tab: 'producer' },
            { n: 2, title: 'Affichage instantané', desc: 'Le produit apparaît immédiatement dans le catalogue du Marché.', tab: 'market' },
            { n: 3, title: 'Alerte FreshGuard Stock', desc: 'Simulation d’une montée en température : dégradation sous 3 jours.', tab: 'freshguard' },
            { n: 4, title: 'Réservation 100 kg & Séquestre', desc: 'Mireille réserve 100 kg. L’argent est consigné en séquestre Mobile Money.', tab: 'market' },
            { n: 5, title: 'Déduction stock (500 → 400 kg)', desc: 'Le stock disponible passe à 400 kg sans risque de survente.', tab: 'market' },
            { n: 6, title: 'Offre transport acceptée', desc: 'Marcel Okemba prend en charge le lot dans son camion frigorifique.', tab: 'transport' },
            { n: 7, title: 'Livraison « En route »', desc: 'La sonde FreshGuard Route suit la température le long de la RN1.', tab: 'transport' },
            { n: 8, title: 'Génération rapport audit', desc: 'À l’arrivée, le rapport confirme : température max sous le seuil de 30°C.', tab: 'transport' },
            { n: 9, title: 'Validation & Libération des fonds', desc: 'L’acheteur valide la réception. Le producteur et transporteur reçoivent leur virement.', tab: 'transactions' },
            { n: 10, title: 'Commission AgriLink 5%', desc: 'Calcul transparent et archivage comptable de la transaction.', tab: 'transactions' },
            { n: 11, title: 'Mise à jour Vue Nationale', desc: 'Les pertes évitées et volumes s’incrémentent sur le tableau de bord macro.', tab: 'national' },
            { n: 12, title: 'Variante Litige', desc: 'Démonstration d’une panne frigo (>30°C) bloquant le paiement en séquestre.', tab: 'transport' },
            { n: 13, title: 'Inclusion USSD *140#', desc: 'Accès sans smartphone ni Internet pour les exploitants ruraux.', tab: 'ussd' },
          ].map((item) => (
            <div
              key={item.n}
              onClick={() => executeDemoStep(item.n)}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {item.n}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                    {item.title}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{item.desc}</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold group-hover:translate-x-1 transition shrink-0">
                Lancer →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ESP32 Hardware Integration Instructions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Cpu className="w-5 h-5 text-emerald-600" />
          <span>Mode Capteur Réel (ESP32) & Contraintes Techniques</span>
        </h3>

        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
          <p>
            L'application est conçue pour communiquer directement avec un boîtier ESP32 équipé d'un capteur DHT22 (température/humidité) et d'un capteur de gaz MQ-135.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <p><strong>Format JSON attendu par AgriLink :</strong></p>
            <code className="text-emerald-600 dark:text-emerald-400 block font-mono text-[11px] overflow-x-auto">
              {`{"name":"FreshGuard-Stock","t":27.5,"h":78,"g":1.02,"d":7,"alert":false,"msg":"Conditions stables","hist":[26.9,27.1,27.5]}`}
            </code>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 space-y-1 text-xs">
            <span className="font-bold">Contrainte de sécurité HTTPS / HTTP (Mixed Content) :</span>
            <p>
              Les navigateurs modernes refusent d'effectuer des requêtes vers <code>http://192.168.4.1</code> depuis une URL hébergée en HTTPS. Pour brancher le capteur réel ESP32 devant le jury, vous devez soit :
            </p>
            <ol className="list-decimal pl-5 space-y-0.5 text-[11px]">
              <li>Lancer AgriLink Congo en local en HTTP (ex: <code>npm run preview</code> sur l'ordinateur portable relié au point d'accès WiFi de l'ESP32).</li>
              <li>Ou utiliser le mode simulation interne garanti sans échec réseau le jour du concours.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
