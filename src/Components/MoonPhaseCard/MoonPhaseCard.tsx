import { useState, useEffect } from "react";
import styles from "./MoonPhaseCard.module.css";
import { 
  WiMoonNew, 
  WiMoonWaxingCrescent3, 
  WiMoonFirstQuarter, 
  WiMoonWaxingGibbous3, 
  WiMoonFull, 
  WiMoonWaningGibbous3, 
  WiMoonThirdQuarter, 
  WiMoonWaningCrescent3 
} from "react-icons/wi";

import type { ReactNode } from "react";

interface MoonPhaseInfo {
  name: string;
  icon: ReactNode;
  description: string;
}

// Simple algorithm to calculate Moon Phase based on current date
function calculateMoonPhase(date: Date): MoonPhaseInfo {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  const day = date.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }
  ++month;
  
  const c = 365.25 * year;
  const e = 30.6 * month;
  const jd = c + e + day - 694039.09; 
  const phase = jd / 29.53058867; 
  const normalizedPhase = phase - Math.floor(phase);

  if (normalizedPhase < 0.04 || normalizedPhase > 0.96) {
    return { name: "Lua Nova", icon: <WiMoonNew size={85} />, description: "Início de um novo ciclo lunar." };
  } else if (normalizedPhase < 0.21) {
    return { name: "Crescente", icon: <WiMoonWaxingCrescent3 size={85} />, description: "Lua começando a ficar visível." };
  } else if (normalizedPhase < 0.29) {
    return { name: "Quarto Crescente", icon: <WiMoonFirstQuarter size={85} />, description: "Metade da lua iluminada à direita." };
  } else if (normalizedPhase < 0.46) {
    return { name: "Crescente Gibosa", icon: <WiMoonWaxingGibbous3 size={85} />, description: "Mais da metade iluminada antes da Lua Cheia." };
  } else if (normalizedPhase < 0.54) {
    return { name: "Lua Cheia", icon: <WiMoonFull size={85} />, description: "O lado visível da lua está totalmente iluminado." };
  } else if (normalizedPhase < 0.71) {
    return { name: "Minguante Gibosa", icon: <WiMoonWaningGibbous3 size={85} />, description: "A iluminação da lua começa a diminuir." };
  } else if (normalizedPhase < 0.79) {
    return { name: "Quarto Minguante", icon: <WiMoonThirdQuarter size={85} />, description: "Metade da lua iluminada à esquerda." };
  } else {
    return { name: "Minguante", icon: <WiMoonWaningCrescent3 size={85} />, description: "Quase desaparecendo antes da nova fase." };
  }
}

export function MoonPhaseCard() {
  const [moonPhase] = useState<MoonPhaseInfo>(() => calculateMoonPhase(new Date()));

  return (
    <div className={styles.moonCard}>
      <h3 className={styles.title}>
        <WiMoonFull className={styles.titleIcon} size={24} /> Fase da Lua
      </h3>
      
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          {moonPhase.icon}
        </div>
        <div className={styles.info}>
          <div className={styles.phaseName}>{moonPhase.name}</div>
          <div className={styles.description}>{moonPhase.description}</div>
        </div>
      </div>
    </div>
  );
}
