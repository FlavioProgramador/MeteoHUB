import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  LayersControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import type { WeatherData } from "../../Types/weather";
import styles from "./WeatherRadar.module.css";
import { CloudRain, Map as MapIcon, Layers } from "lucide-react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface WeatherRadarProps {
  weather: WeatherData;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export const WeatherRadar = ({ weather }: WeatherRadarProps) => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const position: [number, number] = [weather.coord.lat, weather.coord.lon];

  return (
    <div className={styles.radarCard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <MapIcon size={20} className={styles.icon} />
          <h3 className={styles.title}>Radar Climático</h3>
        </div>
        <div className={styles.layerInfo}>
          <Layers size={14} />
          <span>Poluição / Nuvens / Chuva</span>
        </div>
      </header>

      <div className={styles.mapContainer}>
        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={false}
          className={styles.map}
        >
          <MapUpdater center={position} />
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Mapa Padrão">
              <TileLayer
                attribution='&amp;copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Modo Escuro">
              <TileLayer
                attribution='&amp;copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name="Precipitação (Chuva)">
              <TileLayer
                attribution="Meteorologia por OpenWeatherMap"
                url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                opacity={0.8}
              />
            </LayersControl.Overlay>

            <LayersControl.Overlay name="Camada de Nuvens">
              <TileLayer
                attribution="Meteorologia por OpenWeatherMap"
                url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
                opacity={0.8}
              />
            </LayersControl.Overlay>
          </LayersControl>
          <Marker position={position} />
        </MapContainer>
      </div>
    </div>
  );
};
