/**
 * AgriLink Congo - Multilingual Translation Dictionaries
 * FR (Français) | LN (Lingala) | KT (Kituba / Munukutuba)
 * Note: Lingala and Kituba translations are provisional prototypes.
 */

export interface TranslationDictionary {
  appName: string;
  slogan: string;
  demoBadge: string;
  provisionalNotice: string;
  countryTitle: string;
  welcome: string;
  overviewSub: string;
  presentationMode: string;
  exitPresentation: string;
  resetDemo: string;
  
  // Navigation
  navDashboard: string;
  navMarket: string;
  navProducer: string;
  navFreshGuard: string;
  navTransport: string;
  navUSSD: string;
  navTransactions: string;
  navRevenues: string;
  navNational: string;
  navSettings: string;
  navHelp: string;
  navLogout: string;
  footerSlogan: string;

  // KPIs
  kpiHarvests: string;
  kpiReservations: string;
  kpiDeliveries: string;
  kpiFreshGuard: string;
  
  // Market & Products
  searchPlaceholder: string;
  filterAll: string;
  filterRoots: string;
  filterCereals: string;
  filterVegetables: string;
  filterFruits: string;
  reserveBtn: string;
  availableStock: string;
  location: string;
  pricePerKg: string;
  demoDataTag: string;

  // Reservation Modal & Escrow
  reserveModalTitle: string;
  quantityDesired: string;
  subtotal: string;
  deliveryFee: string;
  platformCommission: string;
  producerNet: string;
  totalToPay: string;
  selectPaymentMethod: string;
  momoDesc: string;
  airtelDesc: string;
  phoneLabel: string;
  pinLabel: string;
  confirmPaymentBtn: string;
  escrowExplanation: string;

  // FreshGuard
  sensorTitle: string;
  temperature: string;
  humidity: string;
  gasIndex: string;
  estimatedShelfLife: string;
  days: string;
  simulateMeasure: string;
  heatBtn: string;
  coolBtn: string;
  ventilateBtn: string;
  sensorSource: string;
  simulationSource: string;
  realSource: string;
  alertDanger: string;
  alertNormal: string;
  criticalThreshold: string;

  // Transport
  transportTitle: string;
  stepPending: string;
  stepAccepted: string;
  stepInTransit: string;
  stepArrived: string;
  stepDelivered: string;
  advanceStepBtn: string;
  liveTruckTemp: string;
  deliveryReportTitle: string;
  coldChainOk: string;
  coldChainBroken: string;

  // USSD
  ussdTitle: string;
  ussdSubtitle: string;
  ussdDialCode: string;
  ussdCallBtn: string;
  ussdEndBtn: string;
  ussdMenuPrompt: string;
}

export const translations: Record<'fr' | 'ln' | 'kt', TranslationDictionary> = {
  fr: {
    appName: 'AGRILINK CONGO',
    slogan: 'Votre agriculture, connectée.',
    demoBadge: 'Mode démonstration : données simulées',
    provisionalNotice: 'Traductions provisoires, à faire valider par des locuteurs natifs.',
    countryTitle: 'République du Congo – Brazzaville',
    welcome: 'Bonjour',
    overviewSub: 'Voici un aperçu de votre activité sur AgriLink Congo.',
    presentationMode: 'Mode Démonstration & Parcours',
    exitPresentation: 'Quitter la présentation',
    resetDemo: 'Réinitialiser la démo',

    navDashboard: 'Tableau de bord',
    navMarket: 'Marché',
    navProducer: 'Producteur',
    navFreshGuard: 'FreshGuard Stock',
    navTransport: 'Transport & Froid',
    navUSSD: 'Simulateur USSD',
    navTransactions: 'Transactions',
    navRevenues: 'Revenus & Modèle',
    navNational: 'Vue nationale',
    navSettings: 'Paramètres',
    navHelp: 'Aide & Démo',
    navLogout: 'Déconnexion',
    footerSlogan: 'Une agriculture plus forte pour le Congo',

    kpiHarvests: 'Récoltes actives',
    kpiReservations: 'Réservations en cours',
    kpiDeliveries: 'Livraisons en cours',
    kpiFreshGuard: 'Alertes FreshGuard',

    searchPlaceholder: 'Rechercher un produit (manioc, maïs, tomates...)...',
    filterAll: 'Tous les produits',
    filterRoots: 'Racines & Tubercules',
    filterCereals: 'Céréales & Grains',
    filterVegetables: 'Légumes frais',
    filterFruits: 'Fruits locaux',
    reserveBtn: 'Réserver ce lot',
    availableStock: 'Stock disponible',
    location: 'Provenance',
    pricePerKg: 'Prix au kg',
    demoDataTag: 'Données de démonstration',

    reserveModalTitle: 'Réserver une récolte & Paiement Séquestre',
    quantityDesired: 'Quantité souhaitée (kg)',
    subtotal: 'Sous-total produit',
    deliveryFee: 'Transport / Livraison',
    platformCommission: 'Commission AgriLink (5 %)',
    producerNet: 'Net pour le producteur',
    totalToPay: 'Total à payer',
    selectPaymentMethod: 'Moyen de paiement Mobile Money',
    momoDesc: 'MTN Mobile Money Congo (Paiement simulé)',
    airtelDesc: 'Airtel Money Congo (Paiement simulé)',
    phoneLabel: 'Numéro de téléphone (+242)',
    pinLabel: 'Code PIN secret (fictif pour démo)',
    confirmPaymentBtn: 'Bloquer les fonds en séquestre & Valider',
    escrowExplanation: 'Sécurité séquestre : votre argent est bloqué. Il ne sera libéré au producteur et transporteur que lorsque vous aurez validé la bonne réception avec la chaîne du froid intacte.',

    sensorTitle: 'Surveillance FreshGuard Stock',
    temperature: 'Température',
    humidity: 'Humidité relative',
    gasIndex: 'Indice de gaz (fermentation)',
    estimatedShelfLife: 'Conservation estimée',
    days: 'jours',
    simulateMeasure: 'Nouvelle mesure',
    heatBtn: 'Chauffer (+3°C)',
    coolBtn: 'Refroidir (-3°C)',
    ventilateBtn: 'Ventiler le stock',
    sensorSource: 'Source du capteur',
    simulationSource: 'Simulation interne',
    realSource: 'Capteur réel ESP32',
    alertDanger: 'Alerte critique : risque de dégradation imminente !',
    alertNormal: 'Conditions de conservation stables',
    criticalThreshold: 'Seuil critique',

    transportTitle: 'Suivi Transport & FreshGuard Route',
    stepPending: 'En attente',
    stepAccepted: 'Accepté',
    stepInTransit: 'En route',
    stepArrived: 'Arrivé à destination',
    stepDelivered: 'Livré & Conforme',
    advanceStepBtn: 'Faire avancer la livraison',
    liveTruckTemp: 'Température camion en direct',
    deliveryReportTitle: 'Rapport de Livraison & Audit de Froid',
    coldChainOk: 'Chaîne du froid respectée',
    coldChainBroken: 'Seuil dépassé - Rupture de la chaîne du froid',

    ussdTitle: 'Simulateur USSD Téléphone à touches',
    ussdSubtitle: 'Accès sans Internet pour les petits producteurs ruraux',
    ussdDialCode: 'Composez *140# pour accéder au service',
    ussdCallBtn: 'Appeler (*140#)',
    ussdEndBtn: 'Raccrocher',
    ussdMenuPrompt: 'Entrez un numéro puis validez',
  },

  ln: {
    appName: 'AGRILINK CONGO',
    slogan: 'Bilanga na yo, eza na ba reseaux.',
    demoBadge: 'Mekano ya kolakisa : makambo ya démo',
    provisionalNotice: 'Maloba oyo ya Lingala eza ya komeka, esengeli bato ya mboka batalela yango malamu.',
    countryTitle: 'Republique ya Congo – Brazzaville',
    welcome: 'Mbote na yo',
    overviewSub: 'Tala makambo nionso oyo ezali kokende na AgriLink Congo.',
    presentationMode: 'Mode Lakisa Démo',
    exitPresentation: 'Bima na kolakisa',
    resetDemo: 'Zongisa na ebandeli',

    navDashboard: 'Tableau ya botalisi',
    navMarket: 'Zando ya biloko',
    navProducer: 'Mosali bilanga',
    navFreshGuard: 'Bokengi FreshGuard',
    navTransport: 'Mituka ya kotinda',
    navUSSD: 'Simulateur USSD',
    navTransactions: 'Mbongo na basombi',
    navRevenues: 'Matabisi na Mbongo',
    navNational: 'Botalisi ya Mboka mobimba',
    navSettings: 'Bobongisi',
    navHelp: 'Lisungi',
    navLogout: 'Kobima',
    footerSlogan: 'Bilanga ya makasi mpo na Congo',

    kpiHarvests: 'Biloko ya sika',
    kpiReservations: 'Biloko basombi batie motema',
    kpiDeliveries: 'Mituka ezali kokende',
    kpiFreshGuard: 'Makelele ya FreshGuard',

    searchPlaceholder: 'Luka eloko (ngondo, masangu, tomate...)...',
    filterAll: 'Biloko nionso',
    filterRoots: 'Misisa na Kwanga',
    filterCereals: 'Masangu na loso',
    filterVegetables: 'Ndunda ya sika',
    filterFruits: 'Mbuma ya mboka',
    reserveBtn: 'Sombela oyo',
    availableStock: 'Biloko etikali',
    location: 'Esika euti',
    pricePerKg: 'Talo na kilo',
    demoDataTag: 'Makambo ya komeka (démo)',

    reserveModalTitle: 'Kosomba biloko & Bobombi mbongo na bokengi',
    quantityDesired: 'Kilo boni olingi ? (kg)',
    subtotal: 'Talo ya biloko',
    deliveryFee: 'Talo ya motuka',
    platformCommission: 'Matabisi AgriLink (5 %)',
    producerNet: 'Mbongo ya mosali bilanga',
    totalToPay: 'Nionso esengeli ofuta',
    selectPaymentMethod: 'Nzela ya kofuta na telefone',
    momoDesc: 'MTN Mobile Money Congo (Komeka)',
    airtelDesc: 'Airtel Money Congo (Komeka)',
    phoneLabel: 'Nimero ya telefone (+242)',
    pinLabel: 'Kode ya sekre PIN',
    confirmPaymentBtn: 'Bomba mbongo na bokengi & Ndima',
    escrowExplanation: 'Bokengi ya mbongo : mbongo na yo ebombami kino motuka ekomisa biloko malamu mpe batala ete ebebi te.',

    sensorTitle: 'Bokengi ya biloko FreshGuard',
    temperature: 'Molunge (T°)',
    humidity: 'Mayi na mopepe (%)',
    gasIndex: 'Gaze ya kobeba',
    estimatedShelfLife: 'Mikolo ekoumela',
    days: 'mikolo',
    simulateMeasure: 'Meka lisusu',
    heatBtn: 'Bakisa molunge (+3°C)',
    coolBtn: 'Kitisa molunge (-3°C)',
    ventilateBtn: 'Fungola mopepe',
    sensorSource: 'Esika meka euti',
    simulationSource: 'Masini ya komeka',
    realSource: 'Capteur ya solo ESP32',
    alertDanger: 'Keba : biloko elingi ebeba mikolo mikie !',
    alertNormal: 'Biloko eza malamu',
    criticalThreshold: 'Ndelo ya molunge',

    transportTitle: 'Kolanda motuka na FreshGuard',
    stepPending: 'Kozela',
    stepAccepted: 'Bandimi motuka',
    stepInTransit: 'Nzela nzela',
    stepArrived: 'Ekomi na zando',
    stepDelivered: 'Bakabi biloko',
    advanceStepBtn: 'Pusa motuka na liboso',
    liveTruckTemp: 'Molunge na motuka',
    deliveryReportTitle: 'Rapport ya bokomi ya biloko',
    coldChainOk: 'Malili ezalaki malamu',
    coldChainBroken: 'Molunge elekaki ndelo - ebebi',

    ussdTitle: 'Telefone ya maboko USSD (*140#)',
    ussdSubtitle: 'Pamba pamba ata internet eza te na mboka',
    ussdDialCode: 'Finika *140# mpo na kokota',
    ussdCallBtn: 'Benga (*140#)',
    ussdEndBtn: 'Kanga telefone',
    ussdMenuPrompt: 'Tia nimero mpe finika',
  },

  kt: {
    appName: 'AGRILINK CONGO',
    slogan: 'Kisalu ya bilanga ya beno, me vukana.',
    demoBadge: 'Kisalu ya kumona : bansangu ya meka',
    provisionalNotice: 'Bampova yai ya Kituba kele ya kumeka, bampangi ya bwala fwete tadila yo mbote.',
    countryTitle: 'Repubilika ya Kôngo – Brazzaville',
    welcome: 'Mbote',
    overviewSub: 'Tala mambu nionso ya ke na kusalama na AgriLink Congo.',
    presentationMode: 'Kumonisila Démo',
    exitPresentation: 'Basika na kumonisa',
    resetDemo: 'Vutula na luyantiku',

    navDashboard: 'Kibansala ya mutindu',
    navMarket: 'Zandu ya bima',
    navProducer: 'Muntu ya bilanga',
    navFreshGuard: 'Kukengila FreshGuard',
    navTransport: 'Bakamio ya kutinda',
    navUSSD: 'Simulateur USSD',
    navTransactions: 'Mbongo na bakiliya',
    navRevenues: 'Mbongo na mbongo ya luyalu',
    navNational: 'Mutindu ya nsi ya mvimba',
    navSettings: 'Kubongisa mambu',
    navHelp: 'Lusadisu',
    navLogout: 'Kubasika',
    footerSlogan: 'Kisalu ya ngolo ya bilanga sambu na Kôngo',

    kpiHarvests: 'Bima ya bilanga ya sika',
    kpiReservations: 'Bima yina bantu me lomba',
    kpiDeliveries: 'Bakamio ke na nzila',
    kpiFreshGuard: 'Lukebisi FreshGuard',

    searchPlaceholder: 'Sosa kima (kwanga, masa, matomati...)...',
    filterAll: 'Bima nionso',
    filterRoots: 'Mikazi na kwanga',
    filterCereals: 'Masa na loso',
    filterVegetables: 'Ndunda ya sika',
    filterFruits: 'Bambuma ya bwala',
    reserveBtn: 'Lomba kima yai',
    availableStock: 'Kima me bikala',
    location: 'Kintwadi na bwala',
    pricePerKg: 'Ntalu na kilo',
    demoDataTag: 'Bansangu ya kumeka',

    reserveModalTitle: 'Kulomba bima & Mbongo na lutaninu',
    quantityDesired: 'Kilo ikwa nge zola ? (kg)',
    subtotal: 'Ntalu ya bima',
    deliveryFee: 'Ntalu ya kamio',
    platformCommission: 'Kigonsa AgriLink (5 %)',
    producerNet: 'Mbongo ya muntu ya bilanga',
    totalToPay: 'Nionso nge fwete futa',
    selectPaymentMethod: 'Mutindu ya kufuta na telefone',
    momoDesc: 'MTN Mobile Money Congo (Kumeka)',
    airtelDesc: 'Airtel Money Congo (Kumeka)',
    phoneLabel: 'Nimero ya telefone (+242)',
    pinLabel: 'Kodi ya kinsweki PIN',
    confirmPaymentBtn: 'Bumba mbongo na ngolo & Ndima',
    escrowExplanation: 'Lutaninu ya mbongo : mbongo ke bumbama tii bima ta kuma mbote mpi tii nge ta mona nde kima ya kubeba kele ve.',

    sensorTitle: 'Kukengila bima na FreshGuard',
    temperature: 'Madidi to Tiya (T°)',
    humidity: 'Masa na mupepe (%)',
    gasIndex: 'Gaze ya kubeba',
    estimatedShelfLife: 'Bilumbu ya kubikala mbote',
    days: 'bilumbu',
    simulateMeasure: 'Meka diaka',
    heatBtn: 'Yika tiya (+3°C)',
    coolBtn: 'Yika madidi (-3°C)',
    ventilateBtn: 'Kangula mupepe',
    sensorSource: 'Kisika meka ke basika',
    simulationSource: 'Masini ya kumeka',
    realSource: 'Capteur ya kieleka ESP32',
    alertDanger: 'Lukebisi : bima ke zola beba nswalu !',
    alertNormal: 'Bima ke mbote penza',
    criticalThreshold: 'Ndilu ya tiya',

    transportTitle: 'Kulandila kamio na FreshGuard',
    stepPending: 'Kukinga',
    stepAccepted: 'Me ndima kamio',
    stepInTransit: 'Na nzila',
    stepArrived: 'Me kuma na zandu',
    stepDelivered: 'Me pesa na muntu',
    advanceStepBtn: 'Pusa kamio na ntwala',
    liveTruckTemp: 'Tiya na kati ya kamio',
    deliveryReportTitle: 'Rapport ya kukuma ya bima',
    coldChainOk: 'Madidi vandaka mbote',
    coldChainBroken: 'Tiya me luta ndilu - bima me beba',

    ussdTitle: 'Telefone ya buto USSD (*140#)',
    ussdSubtitle: 'Kukonda Internet sambu na bantu ya bwala',
    ussdDialCode: 'Niata *140# sambu na kukota',
    ussdCallBtn: 'Binga (*140#)',
    ussdEndBtn: 'Kanga telefone',
    ussdMenuPrompt: 'Kota nimero mpe niata',
  },
};
