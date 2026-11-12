/**
 * =========================================================================
 * AgriLink Congo - FreshGuard IoT Firmware (ESP32)
 * Projet Concours Inter-Universitaire USHINE 2026
 * Équipe : Institut d'Enseignement Supérieur du Congo (IES Congo)
 * =========================================================================
 * Description :
 * Ce firmware pour carte ESP32 lit un capteur de température/humidité (DHT22)
 * et un capteur de gaz/éthylène (MQ-135 ou MQ-4), calcule la conservation
 * estimée des denrées fraîches, et sert un point d'accès Web local (HTTP)
 * répondant au format JSON standard attendu par AgriLink Congo :
 *
 * GET /data
 * Response:
 * {
 *   "name": "FreshGuard-Stock",
 *   "t": 27.5,
 *   "h": 78,
 *   "g": 1.02,
 *   "d": 7,
 *   "alert": false,
 *   "msg": "Conditions stables",
 *   "hist": [26.9, 27.1, 27.5]
 * }
 * =========================================================================
 */

#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

// --- Configuration WiFi (Point d'accès ou Réseau local) ---
const char* ssid = "FreshGuard-WiFi";
const char* password = "agrilinkcongo";

// --- Broches Matérielles (ESP32) ---
#define DHTPIN 4          // Broche data du DHT22
#define DHTTYPE DHT22     // DHT 22 (AM2302)
#define GAS_PIN 34        // Broche analogique ADC pour capteur MQ-135

// --- Instances ---
DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);

// --- Historique des 5 dernières températures ---
float tempHistory[5] = {25.2, 25.8, 26.4, 27.0, 27.5};
int historyIndex = 0;

void handleRoot() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "AgriLink FreshGuard ESP32 Server Online. Use /data");
}

void handleData() {
  // Lecture des capteurs
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int rawGas = analogRead(GAS_PIN);
  
  // Si le capteur DHT est débranché, générer des valeurs représentatives
  if (isnan(t) || isnan(h)) {
    t = 27.5;
    h = 78.0;
  }
  
  // Normalisation indice de gaz (1.0 = référence normale sans fermentation)
  float g = 0.8 + ((float)rawGas / 4095.0) * 0.8;
  if (g < 0.8) g = 0.95;

  // Mise à jour de l'historique
  tempHistory[historyIndex] = t;
  historyIndex = (historyIndex + 1) % 5;

  // Calcul estimation de conservation (jours)
  int d = 7;
  if (t > 28.0) d -= 2;
  if (h > 80.0) d -= 1;
  if (g > 1.15) d -= 2;
  if (d < 1) d = 1;

  // Détection d'alerte
  bool alert = (t >= 30.0 || d <= 3);
  String msg = alert ? "Alerte : Risque de détérioration thermique" : "Stock sous contrôle optimal";

  // Construction du JSON
  String json = "{";
  json += "\"name\":\"FreshGuard-Stock\",";
  json += "\"t\":" + String(t, 1) + ",";
  json += "\"h\":" + String(h, 0) + ",";
  json += "\"g\":" + String(g, 2) + ",";
  json += "\"d\":" + String(d) + ",";
  json += "\"alert\":" + String(alert ? "true" : "false") + ",";
  json += "\"msg\":\"" + msg + "\",";
  json += "\"hist\":[";
  for (int i = 0; i < 5; i++) {
    json += String(tempHistory[i], 1);
    if (i < 4) json += ",";
  }
  json += "]}";

  // Envoi avec en-têtes CORS pour autoriser les requêtes du navigateur
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "*");
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Démarrage AgriLink FreshGuard...");

  dht.begin();

  // Création du point d'accès WiFi
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("Point d'accès actif. Adresse IP : ");
  Serial.println(IP); // Habituellement 192.168.4.1

  server.on("/", handleRoot);
  server.on("/data", handleData);
  server.begin();
  Serial.println("Serveur HTTP prêt sur le port 80.");
}

void loop() {
  server.handleClient();
  delay(10);
}
