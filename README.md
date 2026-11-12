# AgriLink Congo – Application AgriTech (Projet USHINE 2026)

> **Projet présenté au Concours Inter-Universitaire USHINE 2026**  
> **Thème :** Agriculture & AgriTech  
> **Équipe :** Institut d'Enseignement Supérieur du Congo (IES Congo) – Brazzaville  
> **Slogan :** *Votre agriculture, connectée.*

---

## 1. Présentation du Projet
AgriLink Congo est une plateforme AgriTech et une Progressive Web App (PWA) conçue pour répondre au défi majeur des pertes post-récolte en République du Congo (estimées entre 30% et 45% sur le manioc, le maïs et les légumes maraîchers).

La solution relie directement :
1. **Les petits producteurs vivriers et maraîchers** (Pool, Bouenza, Plateaux, Cuvette).
2. **Les coopératives agricoles groupées** (Niari, Bouenza).
3. **Les transporteurs de la RN1** équipés de camions frigorifiques ou aérés.
4. **Les grossistes et commerçants des grands marchés urbains** (Marché Total à Bacongo, Ouenzé, Pointe-Noire).

Elle intègre :
- **FreshGuard Stock & FreshGuard Route :** Surveillance IoT de la température, de l'humidité et de l'indice de fermentation gazeuse avec calcul prédictif de conservation.
- **Paiement sécurisé par séquestre (Escrow) :** Intégration simulée MTN Mobile Money (*105#) et Airtel Money (*128#) où l'argent n'est débloqué que si la chaîne du froid et la conformité sont respectées.
- **Simulateur USSD (*140#) :** Accès sans smartphone ni connexion 4G pour les exploitants ruraux équipés de téléphones 2G à touches basiques.
- **Multilinguisme :** Interface en Français, Lingala et Kituba (Munukutuba).

---

## 2. Règles d'Honnêteté et Déclaration de Démonstration (Obligatoire)
L'application est une démonstration conçue pour être évaluée par le jury USHINE 2026. Par souci d'éthique et de transparence :
- **Bandeau de démonstration :** Affiché en permanence en haut de page.
- **Transactions Mobile Money (MTN MoMo & Airtel Money) :** Entièrement simulées. Aucun argent réel n'est engagé, aucun compte bancaire n'est débité et aucun code PIN réel n'est stocké.
- **Code USSD *140# :** Code d'essai pour le simulateur de concours. Il n'est pas encore officiellement attribué par l'ARPCE (régulateur télécoms congolais).
- **Tracé GPS et carte :** Schématique le long de la RN1 reliant Kinkala à Brazzaville.
- **Capteur FreshGuard :** Simulé par défaut. Le mode capteur réel lit un boîtier ESP32 physique lorsqu'il est connecté sur le réseau local.
- **Traductions Lingala et Kituba :** Provisoires, conçues pour illustrer l'inclusion rurale, à faire valider par des locuteurs natifs et linguistes.
- **Formule de conservation estimée :** Modèle agronomique empirique inspiré des tables de la FAO, sans prétention médicale ou biochimique absolue.

---

## 3. Installation et Lancement Rapide

### Prérequis
- Node.js (v18+) et npm.

### Lancement en développement
```bash
# Installation des dépendances
npm install

# Démarrage du serveur local
npm run dev
```
L'application s'ouvre à l'adresse : `http://localhost:3000` (ou port indiqué par Vite).

### Construction pour la production (PWA hors-ligne)
```bash
npm run build
npm run preview
```
Une fois chargée une première fois dans le navigateur, l'application est entièrement mise en cache par le service worker et fonctionne **100% hors connexion Internet**.

---

## 4. Installation sur Smartphone (PWA)

### Sur Android (Google Chrome)
1. Ouvrez l'URL de l'application dans Chrome.
2. Cliquez sur le bouton vert **« Installer PWA »** dans la barre supérieure ou sur le menu de Chrome (3 points verticaux) > **« Installer l'application »**.
3. L'icône de la feuille verte AgriLink Congo s'ajoute sur votre écran d'accueil Android et se lance en plein écran (*standalone*), sans barre de navigateur.

### Sur iPhone / iPad (Safari)
1. Ouvrez l'application dans Safari.
2. Appuyez sur l'icône de partage (carré avec une flèche vers le haut au bas de l'écran).
3. Faites défiler vers le bas et touchez **« Sur l'écran d'accueil »**.
4. Validez en touchant **« Ajouter »**.

---

## 5. Mode Capteur Réel (ESP32) & Firmware

Le fichier firmware Arduino complet est fourni dans le projet à l'emplacement :  
`/public/freshguard_esp32.ino` (téléchargeable également depuis l'onglet FreshGuard de l'application).

### Matériel requis :
- Carte microcontrôleur ESP32 (NodeMCU ESP-32S).
- Capteur de température/humidité DHT22 (broche D4).
- Capteur de gaz/éthylène MQ-135 ou MQ-4 (broche analogique A34).

### Contrat JSON attendu par AgriLink :
```json
{
  "name": "FreshGuard-Stock",
  "t": 27.5,
  "h": 78,
  "g": 1.02,
  "d": 7,
  "alert": false,
  "msg": "Conditions stables",
  "hist": [26.9, 27.1, 27.5]
}
```

### Contrainte de sécurité de navigateur (Mixed Content) :
Les navigateurs web modernes interdisent à une page sécurisée en **HTTPS** d'effectuer des requêtes vers une adresse locale non sécurisée en **HTTP** (telle que `http://192.168.4.1/data`).  
Pour utiliser le capteur réel ESP32 devant le jury :
1. Lancez l'application en local en HTTP via `npm run preview` ou `npm run dev` sur votre ordinateur connecté au WiFi `FreshGuard-WiFi`.
2. Ou utilisez le **mode simulation interne**, qui reproduit fidèlement la télémétrie thermique et les alertes sans dépendance réseau.

---

## 6. Scénario de Démonstration Jury en 13 Étapes (< 4 Minutes)

L'application intègre un **assistant interactif de soutenance** (accessible via le bouton vert *"Visite Guidée Jury"* dans la bannière supérieure) :

1. **Étape 1 (Jean Mavoungou, Agriculteur) :** Jean publie 500 kg de manioc frais à 250 FCFA/kg depuis Kinkala (Pool).
2. **Étape 2 (Marché) :** Le lot apparaît instantanément dans le catalogue du Marché.
3. **Étape 3 (Capteur FreshGuard) :** Déclenchement d'une alerte thermique (+3°C) : la conservation tombe à 3 jours !
4. **Étape 4 (Mireille Ngoma, Acheteuse grossiste) :** Mireille réserve 100 kg et paie par MTN Mobile Money. Les 27 500 FCFA sont consignés en séquestre sécurisé.
5. **Étape 5 (Vérification Stock) :** Le stock disponible passe instantanément de **500 kg à 400 kg**.
6. **Étape 6 (Marcel Okemba, Transporteur) :** Marcel accepte la prise en charge dans son camion réfrigéré.
7. **Étape 7 (Suivi Transport RN1) :** Le statut passe à *« En route »*. La sonde transmet la température en direct (24.2°C) sur la carte animée de la RN1.
8. **Étape 8 (Arrivée à destination) :** Le camion arrive au Marché Total. Le système génère automatiquement le rapport d'audit de conformité.
9. **Étape 9 (Validation Acheteur) :** Mireille valide la bonne réception. Les fonds sont débloqués : le producteur reçoit son net (95%) et le transporteur ses frais.
10. **Étape 10 (Archivage Comptable) :** La commission AgriLink de 5% est enregistrée et la commande passe à *« Confirmée & Livrée »*.
11. **Étape 11 (Vue Nationale) :** Le tableau de bord macroéconomique s'incrémente des 100 kg sauvés de l'avarie.
12. **Étape 12 (Variante Litige) :** Démonstration du cas où le frigo dépasse 30°C : le rapport indique *« Seuil Dépassé »*, le séquestre est bloqué et un litige s'ouvre pour protéger l'acheteur.
13. **Étape 13 (Simulateur USSD *140#) :** Démonstration sur le téléphone à touches en Lingala : un producteur du village publie sa récolte en direct sur le même stock.

---

## 7. Comptes de Démonstration & Espaces Dédiés par Acteur (Contrôle d'Accès RBAC)
L'application propose une **page de connexion intelligente** d'accueil qui personnalise l'accès et n'affiche que les pages autorisées pour chaque acteur :

1. **Jean Mavoungou (Agriculteur Maraîcher · Kinkala, Pool) :**
   - *Espace Dédié :* **Mon Espace Producteur** (`farmer_space`).
   - *Fonctions accessibles :* Publication de récoltes, gestion de ses stocks, surveillance de sa sonde FreshGuard Kinkala, suivi de ses gains Mobile Money, accès USSD *140#.
   - *Pages masquées :* Achat grossiste, gestion de flotte de transport.

2. **Coopérative Agricole du Niari (Dolisie / Nkayi) :**
   - *Espace Dédié :* **Mon Espace Coopérative** (`coop_space`).
   - *Fonctions accessibles :* Consolidation des 45 adhérents, gestion des hangars groupés, réservation de camions 5T, formations collectives.

3. **Marcel Okemba (Transporteur Frigorifique · RN1) :**
   - *Espace Dédié :* **Mon Espace Transporteur** (`transporter_space`).
   - *Fonctions accessibles :* Missions d'acheminement, validation des 5 étapes (En attente → Livré), télématique en direct de la sonde frigo, audit thermique.
   - *Pages masquées :* Publication maraîchère, achats marché.

4. **Mireille Ngoma (Grossiste en Vivres Frais · Marché Total) :**
   - *Espace Dédié :* **Mon Espace Grossiste** (`buyer_space`).
   - *Fonctions accessibles :* Catalogue Marché, réservation avec paiement séquestre Mobile Money, validation de réception et libération des fonds, gestion des litiges.

5. **Délégation Jury USHINE 2026 / Ministère de l'Agriculture :**
   - *Espace Dédié :* **Observatoire National & Vue Macro** (`dashboard` / `national`).
   - *Fonctions accessibles :* Accès de supervision complète, baromètre des prix, modèle économique, calculateur de pertes évitées et parcours de soutenance en 13 étapes.

*Note :* Le bouton **« Se déconnecter »** dans la barre latérale ou le menu profil permet de revenir instantanément à la page de connexion pour basculer d'acteur lors de la présentation.

---

## 8. Modèle Économique (Section Revenus)
AgriLink assure sa pérennité à travers 4 flux de revenus équitables :
1. **Commission de 5% :** Prélevée sur le montant des récoltes vendues via la plateforme.
2. **Abonnements mensuels :**
   - *Essentiel Producteur :* 1 000 FCFA / mois.
   - *Coopérative Pro :* 5 000 FCFA / mois.
   - *Transporteur Frigo Connecté :* 8 000 FCFA / mois.
3. **Hardware IoT FreshGuard :** Vente à 25 000 FCFA ou location à 2 000 FCFA / mois.
4. **Formations agricoles spécialisées :** 2 500 à 5 000 FCFA par module e-learning / audio.

---

## 9. Limites Connues et Prochaines Étapes pour l'Équipe
1. **Validation linguistique :** Les traductions en Lingala et en Kituba sont des prototypes fonctionnels ; un travail de relecture avec des agronomes locaux sera conduit après le concours.
2. **Enquête de terrain sur les prix :** Les prix au kg (Manioc à 250 F, Maïs à 300 F, Tomate à 400 F) sont des moyennes observées à Brazzaville fin 2025/2026, à ajuster selon les saisons des pluies.
3. **Agrément USSD officiel :** La demande de code court dédié auprès de l'ARPCE sera déposée lors de la phase d'incubation post-concours.
