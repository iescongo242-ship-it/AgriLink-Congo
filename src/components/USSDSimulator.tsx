import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, PhoneOff, Delete, CornerDownLeft, Info, Sparkles } from 'lucide-react';
import { formatFCFA } from '../utils/calculations';

type USSDScreen =
  | 'idle'
  | 'language_select'
  | 'main_menu'
  | 'browse_products'
  | 'publish_step1_name'
  | 'publish_step2_qty'
  | 'publish_step3_price'
  | 'publish_success'
  | 'track_orders'
  | 'momo_balance'
  | 'freshguard_sms';

export const USSDSimulator: React.FC = () => {
  const { products, orders, publishCrop, language, setLanguage, t } = useApp();

  const [inputBuffer, setInputBuffer] = useState('*140#');
  const [screen, setScreen] = useState<USSDScreen>('idle');
  const [ussdLang, setUssdLang] = useState<'fr' | 'ln' | 'kt'>('fr');

  // Form memory for crop publication via USSD
  const [draftName, setDraftName] = useState('');
  const [draftQty, setDraftQty] = useState(0);

  // Keypad press handler
  const handleKeyPress = (val: string) => {
    if (screen === 'idle') {
      setInputBuffer((prev) => (prev.length < 10 ? prev + val : prev));
    } else {
      // In USSD session, append to response input
      setInputBuffer((prev) => prev + val);
    }
  };

  const handleClear = () => {
    setInputBuffer((prev) => prev.slice(0, -1));
  };

  const handleEndCall = () => {
    setScreen('idle');
    setInputBuffer('*140#');
    setDraftName('');
    setDraftQty(0);
  };

  const handleCall = () => {
    if (screen === 'idle') {
      if (inputBuffer.trim() === '*140#') {
        setScreen('language_select');
        setInputBuffer('');
      } else {
        alert('Code USSD non reconnu. Pour la démonstration AgriLink Congo, composez *140#.');
      }
    } else {
      handleMenuChoice(inputBuffer.trim());
      setInputBuffer('');
    }
  };

  const handleMenuChoice = (choice: string) => {
    if (screen === 'language_select') {
      if (choice === '1') {
        setUssdLang('fr');
        setLanguage('fr');
        setScreen('main_menu');
      } else if (choice === '2') {
        setUssdLang('ln');
        setLanguage('ln');
        setScreen('main_menu');
      } else if (choice === '3') {
        setUssdLang('kt');
        setLanguage('kt');
        setScreen('main_menu');
      } else {
        setScreen('language_select');
      }
      return;
    }

    if (screen === 'main_menu') {
      if (choice === '1') setScreen('browse_products');
      else if (choice === '2') setScreen('publish_step1_name');
      else if (choice === '3') setScreen('track_orders');
      else if (choice === '4') setScreen('momo_balance');
      else if (choice === '5') setScreen('freshguard_sms');
      else if (choice === '0') handleEndCall();
      return;
    }

    if (screen === 'browse_products') {
      if (choice === '0') setScreen('main_menu');
      return;
    }

    if (screen === 'publish_step1_name') {
      // Choice 1: Manioc, 2: Maïs, 3: Tomates
      const chosenName =
        choice === '1'
          ? 'Manioc frais (Cossettes USSD)'
          : choice === '2'
          ? 'Maïs jaune (Grain USSD)'
          : 'Tomates de plein champ (USSD)';
      setDraftName(chosenName);
      setScreen('publish_step2_qty');
      return;
    }

    if (screen === 'publish_step2_qty') {
      const q = parseInt(choice, 10) || 100;
      setDraftQty(q);
      setScreen('publish_step3_price');
      return;
    }

    if (screen === 'publish_step3_price') {
      const p = parseInt(choice, 10) || 250;
      publishCrop({
        name: draftName || 'Récolte USSD *140#',
        category: draftName.includes('Maïs')
          ? 'cereals'
          : draftName.includes('Tomates')
          ? 'vegetables'
          : 'roots',
        variety: 'Enregistré via téléphone à touches 2G',
        location: 'Kinkala / Pool (Signal USSD)',
        totalQuantity: draftQty || 100,
        pricePerUnit: p,
        harvestDate: 'Aujourd hui',
        notes: 'Publication directe transmise par code USSD *140#',
      });
      setScreen('publish_success');
      return;
    }

    if (screen === 'publish_success' || screen === 'track_orders' || screen === 'momo_balance' || screen === 'freshguard_sms') {
      if (choice === '0') setScreen('main_menu');
      else handleEndCall();
      return;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Explanation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-emerald-600" />
            <span>Simulateur USSD *140# (Inclusion Rurale 2G)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Permet aux producteurs des villages sans smartphone ni 4G d'accéder au marché AgriLink
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Code d'essai démonstration · Même base de données que le Web</span>
        </div>
      </div>

      {/* Center Phone Frame */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4">
        {/* Vintage Feature Phone Body */}
        <div className="w-80 bg-gradient-to-b from-slate-800 to-slate-900 rounded-[40px] p-6 shadow-2xl border-4 border-slate-700 space-y-6 select-none">
          {/* Top Speaker Earphone Grill */}
          <div className="w-16 h-1.5 bg-slate-700 rounded-full mx-auto" />

          {/* LCD Screen Display */}
          <div className="bg-[#B9D8B4] border-4 border-[#8CA887] rounded-xl p-4 shadow-inner min-h-[190px] flex flex-col justify-between font-mono text-black text-xs">
            {screen === 'idle' && (
              <div className="flex flex-col justify-between h-full space-y-3">
                <div className="flex justify-between text-[10px] text-slate-800 border-b border-black/20 pb-1">
                  <span>AIRTEL / MTN 2G</span>
                  <span>🔋 92%</span>
                </div>
                <div className="text-center py-4">
                  <p className="text-[11px] text-slate-700 font-bold">AGRILINK CONGO</p>
                  <p className="text-sm font-black tracking-wider text-black mt-1">
                    {inputBuffer || '*140#'}
                  </p>
                  <p className="text-[9px] text-slate-600 mt-2">
                    Appuyez sur APPEL pour lancer
                  </p>
                </div>
                <div className="flex justify-between text-[10px] text-slate-700 pt-1 border-t border-black/20">
                  <span>MENU</span>
                  <span>CONTACTS</span>
                </div>
              </div>
            )}

            {screen === 'language_select' && (
              <div className="space-y-1.5">
                <p className="font-bold text-[11px] border-b border-black/30 pb-1">
                  AGRILINK CONGO (*140#)
                </p>
                <p className="text-[10px] leading-tight">Pona lokota / Choisir langue :</p>
                <p className="text-[10px]">1. Français</p>
                <p className="text-[10px]">2. Lingala (Brazza/Kin)</p>
                <p className="text-[10px]">3. Kituba (Niari/Pool)</p>
                <div className="pt-2 border-t border-black/20 flex items-center justify-between">
                  <span className="text-[9px]">Rep: [{inputBuffer}]</span>
                  <span className="text-[9px] font-bold">ENVOYER</span>
                </div>
              </div>
            )}

            {screen === 'main_menu' && (
              <div className="space-y-1">
                <p className="font-bold text-[10px] border-b border-black/30 pb-0.5">
                  {ussdLang === 'ln'
                    ? 'MENU AGRILINK CONGO'
                    : ussdLang === 'kt'
                    ? 'KIBANSALA AGRILINK'
                    : 'MENU AGRILINK CONGO'}
                </p>
                <p className="text-[10px]">
                  1. {ussdLang === 'ln' ? 'Tala biloko na zando' : ussdLang === 'kt' ? 'Tala bima na zandu' : 'Consulter récoltes'}
                </p>
                <p className="text-[10px]">
                  2. {ussdLang === 'ln' ? 'Teka biloko ya sika' : ussdLang === 'kt' ? 'Teka bima ya bilanga' : 'Publier une récolte'}
                </p>
                <p className="text-[10px]">
                  3. {ussdLang === 'ln' ? 'Landa motuka ya bima' : ussdLang === 'kt' ? 'Landa kamio ya bima' : 'Suivre ma livraison'}
                </p>
                <p className="text-[10px]">
                  4. {ussdLang === 'ln' ? 'Solde MoMo / Airtel' : ussdLang === 'kt' ? 'Mbongo na MoMo' : 'Solde & MoMo'}
                </p>
                <p className="text-[10px]">
                  5. {ussdLang === 'ln' ? 'Alerte FreshGuard SMS' : ussdLang === 'kt' ? 'Lukebisi FreshGuard' : 'Alerte FreshGuard'}
                </p>
                <p className="text-[9px] text-slate-700">0. {ussdLang === 'ln' ? 'Bima' : 'Quitter'}</p>
                <div className="pt-1 border-t border-black/20 flex items-center justify-between text-[9px]">
                  <span>Rep: [{inputBuffer}]</span>
                  <span className="font-bold">OK</span>
                </div>
              </div>
            )}

            {screen === 'browse_products' && (
              <div className="space-y-1">
                <p className="font-bold text-[10px] border-b border-black/30 pb-0.5">
                  RECOLTES DISPONIBLES :
                </p>
                {products.slice(0, 3).map((p, idx) => (
                  <p key={p.id} className="text-[10px] truncate leading-tight">
                    {idx + 1}. {p.name.slice(0, 14)}: {p.availableStock}kg ({p.pricePerUnit}F)
                  </p>
                ))}
                <p className="text-[9px] pt-1">0. Retour menu</p>
                <div className="pt-1 border-t border-black/20 flex justify-between text-[9px]">
                  <span>Rep: [{inputBuffer}]</span>
                  <span className="font-bold">OK</span>
                </div>
              </div>
            )}

            {screen === 'publish_step1_name' && (
              <div className="space-y-1.5">
                <p className="font-bold text-[10px] border-b border-black/30 pb-0.5">
                  PUBLIER UNE RECOLTE :
                </p>
                <p className="text-[10px]">1. Manioc frais</p>
                <p className="text-[10px]">2. Maïs jaune</p>
                <p className="text-[10px]">3. Tomates fraîches</p>
                <div className="pt-2 border-t border-black/20 flex justify-between text-[9px]">
                  <span>Choix: [{inputBuffer}]</span>
                  <span className="font-bold">OK</span>
                </div>
              </div>
            )}

            {screen === 'publish_step2_qty' && (
              <div className="space-y-1.5">
                <p className="font-bold text-[10px] border-b border-black/30 pb-0.5">
                  {draftName.slice(0, 20)}
                </p>
                <p className="text-[10px]">Entrez la quantite (kg) :</p>
                <p className="text-[9px] text-slate-700">Ex: 100, 200, 500</p>
                <div className="pt-3 border-t border-black/20 flex justify-between text-[9px]">
                  <span>Kg: [{inputBuffer}]</span>
                  <span className="font-bold">OK</span>
                </div>
              </div>
            )}

            {screen === 'publish_step3_price' && (
              <div className="space-y-1.5">
                <p className="font-bold text-[10px] border-b border-black/30 pb-0.5">
                  PRIX AU KG :
                </p>
                <p className="text-[10px]">Entrez votre prix en FCFA :</p>
                <p className="text-[9px] text-slate-700">Ex: 250, 300, 400</p>
                <div className="pt-3 border-t border-black/20 flex justify-between text-[9px]">
                  <span>Prix: [{inputBuffer}]</span>
                  <span className="font-bold">VALIDER</span>
                </div>
              </div>
            )}

            {screen === 'publish_success' && (
              <div className="space-y-2 py-2">
                <p className="font-bold text-[11px] text-emerald-950">
                  SUCCESS AGRILINK !
                </p>
                <p className="text-[10px] leading-tight">
                  Votre recolte a ete mise en ligne au Marche Web ! Les acheteurs peuvent desormais reserver.
                </p>
                <p className="text-[9px]">0. Menu principal</p>
              </div>
            )}

            {screen === 'track_orders' && (
              <div className="space-y-1.5">
                <p className="font-bold text-[10px] border-b border-black/30 pb-0.5">
                  SUIVI EXPEDITION :
                </p>
                {orders.length > 0 ? (
                  <>
                    <p className="text-[10px] font-bold">{orders[0].orderNumber} - {orders[0].productName.slice(0, 15)}</p>
                    <p className="text-[10px]">Etape : {orders[0].deliveryStep.toUpperCase()}</p>
                    <p className="text-[10px]">Frigo : 24.2°C (Conforme)</p>
                  </>
                ) : (
                  <p className="text-[10px]">Aucune commande en cours.</p>
                )}
                <p className="text-[9px] pt-2">0. Retour menu</p>
              </div>
            )}

            {screen === 'momo_balance' && (
              <div className="space-y-2 py-1">
                <p className="font-bold text-[10px] border-b border-black/30 pb-0.5">
                  SOLDE SEQUESTRE MOMO :
                </p>
                <p className="text-[10px]">Compte : Jean Mavoungou</p>
                <p className="text-[11px] font-bold">En séquestre : 27 500 FCFA</p>
                <p className="text-[9px] text-slate-700">Libération automatique à confirmation de livraison.</p>
                <p className="text-[9px] pt-1">0. Retour</p>
              </div>
            )}

            {screen === 'freshguard_sms' && (
              <div className="space-y-1.5 py-1">
                <p className="font-bold text-[10px] border-b border-black/30 pb-0.5">
                  ALERTES SMS FRESHGUARD :
                </p>
                <p className="text-[10px]">Capteur Entrepôt Kinkala :</p>
                <p className="text-[10px]">Temp : 25.1°C · Gaz : 0.98</p>
                <p className="text-[10px] font-bold text-emerald-950">Statut : Conditions stables (7 jours)</p>
                <p className="text-[9px] pt-2">0. Retour</p>
              </div>
            )}
          </div>

          {/* Action / Call Keys */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCall}
              className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{screen === 'idle' ? 'APPEL (*140#)' : 'ENVOYER'}</span>
            </button>
            <button
              onClick={handleEndCall}
              className="py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>FIN</span>
            </button>
          </div>

          {/* 12-Key Vintage Keypad (1-9, *, 0, #) */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {[
              { val: '1', sub: '.,-' },
              { val: '2', sub: 'ABC' },
              { val: '3', sub: 'DEF' },
              { val: '4', sub: 'GHI' },
              { val: '5', sub: 'JKL' },
              { val: '6', sub: 'MNO' },
              { val: '7', sub: 'PQRS' },
              { val: '8', sub: 'TUV' },
              { val: '9', sub: 'WXYZ' },
              { val: '*', sub: 'LANG' },
              { val: '0', sub: 'RET' },
              { val: '#', sub: 'SEND' },
            ].map((k) => (
              <button
                key={k.val}
                onClick={() => handleKeyPress(k.val)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600/70 shadow-sm flex flex-col items-center justify-center active:scale-90 transition cursor-pointer"
              >
                <span className="font-bold text-base leading-none">{k.val}</span>
                <span className="text-[8px] text-slate-400 font-mono mt-0.5">{k.sub}</span>
              </button>
            ))}
          </div>

          {/* Quick Clear Key */}
          <button
            onClick={handleClear}
            className="w-full py-1.5 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1"
          >
            <Delete className="w-3.5 h-3.5" />
            <span>Effacer le dernier chiffre</span>
          </button>
        </div>

        {/* Right Explanatory Guide for Jury */}
        <div className="max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Pourquoi l'USSD est capital en République du Congo ?
            </h3>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Dans les départements du Pool, de la Bouenza ou de la Cuvette, la couverture 4G est souvent absente et de nombreux exploitants possèdent des téléphones basiques à touches.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <p><strong>✅ Code d'essai :</strong> *140# (simulation interactive)</p>
            <p><strong>✅ Multilingue 2G :</strong> Choix 1 (FR), 2 (Lingala), 3 (Kituba)</p>
            <p><strong>✅ Synchronisation temps réel :</strong> Une récolte publiée sur le clavier du téléphone apparaît immédiatement sur le site web des acheteurs !</p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setInputBuffer('*140#');
                setScreen('language_select');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Tester la session USSD en 1 clic</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
