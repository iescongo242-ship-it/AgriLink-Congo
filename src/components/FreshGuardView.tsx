import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Flame,
  Snowflake,
  Wind,
  RefreshCw,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Radio,
  FileCode,
  Info,
  Clock,
  Sliders,
} from 'lucide-react';

export const FreshGuardView: React.FC = () => {
  const {
    freshGuardReadings,
    freshGuardConfig,
    updateFreshGuardConfig,
    simulateNewReading,
    heatStock,
    coolStock,
    ventilateStock,
    t,
  } = useApp();

  const [espUrlInput, setEspUrlInput] = useState(freshGuardConfig.esp32Endpoint);
  const [thresholdInput, setThresholdInput] = useState(freshGuardConfig.tempCriticalThreshold);
  const [showFirmwareModal, setShowFirmwareModal] = useState(false);

  const current = freshGuardReadings[freshGuardReadings.length - 1];

  // SVG Chart points calculation
  const historyTemps = freshGuardReadings.slice(-10);
  const minTempChart = 15;
  const maxTempChart = 40;
  const chartHeight = 160;
  const chartWidth = 500;

  const points = historyTemps
    .map((r, i) => {
      const x = (i / Math.max(1, historyTemps.length - 1)) * (chartWidth - 40) + 20;
      const normalizedY = (r.temperature - minTempChart) / (maxTempChart - minTempChart);
      const y = chartHeight - normalizedY * (chartHeight - 30) - 15;
      return `${x},${y}`;
    })
    .join(' ');

  // Critical threshold Y line
  const thresholdY =
    chartHeight -
    ((freshGuardConfig.tempCriticalThreshold - minTempChart) / (maxTempChart - minTempChart)) *
      (chartHeight - 30) -
    15;

  const handleApplyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateFreshGuardConfig({
      esp32Endpoint: espUrlInput,
      tempCriticalThreshold: thresholdInput,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Source Indicator */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              <span>{t.sensorTitle}</span>
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 ${
                freshGuardConfig.source === 'real_esp32'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {freshGuardConfig.source === 'real_esp32' ? (
                <>
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Mode Capteur Réel</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3 h-3" />
                  <span>Mode Simulation</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Surveillance préventive de la maturation et fermentation des denrées tropicales
          </p>
        </div>

        {/* Action Controls for Demo */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={simulateNewReading}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
            title="Générer une nouvelle mesure de capteur"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.simulateMeasure}</span>
          </button>
          <button
            onClick={heatStock}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
            title="Chauffer le stock pour déclencher une alerte"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{t.heatBtn}</span>
          </button>
          <button
            onClick={coolStock}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
            title="Refroidir le stock"
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>{t.coolBtn}</span>
          </button>
          <button
            onClick={ventilateStock}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-xs transition active:scale-98 cursor-pointer"
            title="Aérer le stockage pour faire chuter les gaz"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>{t.ventilateBtn}</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if triggered */}
      {current?.isAlert && (
        <div className="p-4 rounded-2xl bg-red-600 text-white shadow-md flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h3 className="font-extrabold text-sm uppercase tracking-wide">
                Alerte Critique FreshGuard Déclenchée !
              </h3>
              <p className="text-xs text-red-100 mt-0.5 leading-relaxed">
                {current.alertReason || 'Dépassement du seuil critique ou dégradation imminente.'}
                Action requise : ventiler d'urgence ou écouler le stock au marché sous séquestre.
              </p>
            </div>
          </div>
          <button
            onClick={coolStock}
            className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs hover:bg-red-50 transition shrink-0 cursor-pointer"
          >
            Refroidir maintenant
          </button>
        </div>
      )}

      {/* 4 Telemetry Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{t.temperature} (DHT22)</span>
            <span className="text-[10px] font-mono">Max : {freshGuardConfig.tempCriticalThreshold}°C</span>
          </div>
          <p
            className={`text-3xl font-black tabular-nums ${
              (current?.temperature || 25) >= freshGuardConfig.tempCriticalThreshold
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {current?.temperature || 24.5}°C
          </p>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                (current?.temperature || 25) >= freshGuardConfig.tempCriticalThreshold
                  ? 'bg-red-600'
                  : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (((current?.temperature || 25) - 15) / 25) * 100)}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            Plage de sécurité : 18°C – 28°C
          </span>
        </div>

        {/* Humidity */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{t.humidity}</span>
            <span className="text-[10px] font-mono">Max : 82%</span>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {current?.humidity || 75}%
          </p>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                (current?.humidity || 75) > 82 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, current?.humidity || 75)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            {(current?.humidity || 75) > 82 ? 'Risque de condensation' : 'Humidité contrôlée'}
          </span>
        </div>

        {/* Gas Index */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">{t.gasIndex} (MQ-135)</span>
            <span className="text-[10px] font-mono">Normal : 1.0</span>
          </div>
          <p
            className={`text-3xl font-black tabular-nums ${
              (current?.gasIndex || 1.0) > 1.15
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {current?.gasIndex || 1.0}
          </p>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                (current?.gasIndex || 1.0) > 1.15 ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (((current?.gasIndex || 1.0) - 0.7) / 0.8) * 100)}%`,
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block pt-1">
            {(current?.gasIndex || 1.0) > 1.15 ? 'Émission éthylène active' : 'Atmosphère neutre'}
          </span>
        </div>

        {/* Estimated Days */}
        <div
          className={`p-5 rounded-2xl border shadow-sm space-y-2 ${
            (current?.estimatedDays || 7) <= freshGuardConfig.shelfLifeAlertThreshold
              ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-200'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>{t.estimatedShelfLife}</span>
            <span className="text-[10px] font-mono">Calcul FAO</span>
          </div>
          <p className="text-3xl font-black tabular-nums">
            {current?.estimatedDays || 7} {t.days}
          </p>
          <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                (current?.estimatedDays || 7) <= freshGuardConfig.shelfLifeAlertThreshold
                  ? 'bg-red-600'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, ((current?.estimatedDays || 7) / 10) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] opacity-80 block pt-1">
            {(current?.estimatedDays || 7) <= freshGuardConfig.shelfLifeAlertThreshold
              ? 'ALERTE : Vendre sous 48h !'
              : 'Stock sain pour expédition'}
          </span>
        </div>
      </div>

      {/* SVG Interactive Timeline Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Courbe d'Historique Thermique (°C) & Ligne Critique
            </h3>
            <p className="text-xs text-slate-500">
              Mesures continues enregistrées lors des dernières sessions
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <span className="w-3 h-0.5 bg-emerald-600 inline-block" />
              <span>Température observée</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-500">
              <span className="w-3 h-0.5 border-b border-dashed border-red-500 inline-block" />
              <span>Seuil critique ({freshGuardConfig.tempCriticalThreshold}°C)</span>
            </div>
          </div>
        </div>

        {/* SVG Curve */}
        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 overflow-visible font-mono text-[10px]"
          >
            {/* Grid horizontal guidelines */}
            {[20, 25, 30, 35].map((tempVal) => {
              const y =
                chartHeight -
                ((tempVal - minTempChart) / (maxTempChart - minTempChart)) * (chartHeight - 30) -
                15;
              return (
                <g key={tempVal}>
                  <line
                    x1="20"
                    y1={y}
                    x2={chartWidth - 20}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="1"
                  />
                  <text
                    x="2"
                    y={y + 3}
                    fill="currentColor"
                    className="text-slate-400 dark:text-slate-500 text-[9px]"
                  >
                    {tempVal}°
                  </text>
                </g>
              );
            })}

            {/* Critical threshold red dashed line */}
            <line
              x1="20"
              y1={thresholdY}
              x2={chartWidth - 20}
              y2={thresholdY}
              stroke="#DC2626"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Main Temperature Line */}
            <polyline
              fill="none"
              stroke="#159447"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />

            {/* Points on curve */}
            {historyTemps.map((r, i) => {
              const x = (i / Math.max(1, historyTemps.length - 1)) * (chartWidth - 40) + 20;
              const normalizedY = (r.temperature - minTempChart) / (maxTempChart - minTempChart);
              const y = chartHeight - normalizedY * (chartHeight - 30) - 15;
              const isOver = r.temperature >= freshGuardConfig.tempCriticalThreshold;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isOver ? '5' : '3.5'}
                    fill={isOver ? '#DC2626' : '#159447'}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                  <text
                    x={x}
                    y={y - 8}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-[9px] font-bold text-slate-700 dark:text-slate-300"
                  >
                    {r.temperature}°
                  </text>
                  <text
                    x={x}
                    y={chartHeight - 2}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-[8px] text-slate-400"
                  >
                    {r.timestamp}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sensor Configuration & Hardware Mode (ESP32) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware ESP32 & Source Switch */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Paramètres du Capteur FreshGuard</span>
            </h3>
            <button
              onClick={() => setShowFirmwareModal(true)}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Code Arduino ESP32</span>
            </button>
          </div>

          <form onSubmit={handleApplyConfig} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Source des données :
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateFreshGuardConfig({ source: 'simulation' })}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    freshGuardConfig.source === 'simulation'
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Cpu className="w-4 h-4 text-emerald-600 mb-1" />
                  <p className="text-xs">Simulation interne</p>
                  <span className="text-[10px] text-slate-500 font-normal">Recommandé en concours</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateFreshGuardConfig({ source: 'real_esp32' })}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    freshGuardConfig.source === 'real_esp32'
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Radio className="w-4 h-4 text-blue-600 mb-1" />
                  <p className="text-xs">Capteur réel ESP32</p>
                  <span className="text-[10px] text-slate-500 font-normal">Sonde physique connectée</span>
                </button>
              </div>
            </div>

            {freshGuardConfig.source === 'real_esp32' && (
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
                <label className="text-xs font-semibold text-blue-900 dark:text-blue-200 block">
                  Adresse URL du point d'accès ESP32 (HTTP) :
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={espUrlInput}
                    onChange={(e) => setEspUrlInput(e.target.value)}
                    placeholder="http://192.168.4.1/data"
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition"
                  >
                    Connecter
                  </button>
                </div>
                {freshGuardConfig.connectionError && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-300">
                    {freshGuardConfig.connectionError}
                  </p>
                )}
                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Note technique : un navigateur sous HTTPS bloque les requêtes HTTP locales (Mixed Content). En présentation réelle, lancez en HTTP local (localhost).
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Seuil critique de température (°C) :
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="20"
                  max="45"
                  value={thresholdInput}
                  onChange={(e) => setThresholdInput(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
                >
                  Mettre à jour le seuil
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Agronomical Scientific Logic Explanation */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Formule de Conservation Estimée (Transparence)</span>
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            L'estimation de conservation repose sur une règle simple, transparente et documentée basée sur les guides agronomiques de conservation post-récolte en zone équatoriale :
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 border border-slate-200 dark:border-slate-700">
            <p><strong>Base idéale (20°C, 65% RH) :</strong> 7 à 12 jours</p>
            <p><strong>Pénalité Température :</strong> -1 jour par tranche de 2°C au-dessus de 24°C</p>
            <p><strong>Pénalité Humidité :</strong> -1.5 jour si RH &gt; 82% (risque de pourriture)</p>
            <p><strong>Pénalité Gaz (Éthylène) :</strong> -2 jours si indice &gt; 1.15 (fermentation active)</p>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            * Aucune précision médicale ou scientifique absolue n'est revendiquée : il s'agit d'un modèle empirique d'aide à la décision pour petits producteurs.
          </p>
        </div>
      </div>

      {/* Firmware Inspection Modal */}
      {showFirmwareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Firmware Arduino ESP32 (freshguard_esp32.ino)
                </h3>
              </div>
              <button
                onClick={() => setShowFirmwareModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Fermer
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl text-emerald-400 font-mono text-xs leading-relaxed">
              <pre>{`// AgriLink Congo - FreshGuard ESP32 Server
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

#define DHTPIN 4
#define DHTTYPE DHT22
#define GAS_PIN 34

DHT dht(DHTPIN, DHTTYPE);
WebServer server(80);

void handleData() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  float g = 0.8 + ((float)analogRead(GAS_PIN)/4095.0) * 0.8;
  int d = (t > 28) ? 5 : 7;
  bool alert = (t >= 30.0 || d <= 3);

  String json = "{\\"name\\":\\"FreshGuard-Stock\\",\\"t\\":" + String(t,1) + 
                ",\\"h\\":" + String(h,0) + ",\\"g\\":" + String(g,2) + 
                ",\\"d\\":" + String(d) + ",\\"alert\\":" + (alert?"true":"false") + "}";

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}`}</pre>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">
                Fichier disponible dans le projet : <code>/public/freshguard_esp32.ino</code>
              </span>
              <a
                href="/freshguard_esp32.ino"
                download="freshguard_esp32.ino"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
              >
                Télécharger .ino
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
