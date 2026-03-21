import { HelpCircle } from 'lucide-react';
import styles from './InfoTooltip.module.css';
import type { ReactNode } from 'react';

interface InfoTooltipProps {
  content: string | ReactNode;
}

export function InfoTooltip({ content }: InfoTooltipProps) {
  return (
    <div className={styles.tooltipContainer}>
      <HelpCircle className={styles.icon} size={16} />
      <div className={styles.tooltipContent}>
        {content}
      </div>
    </div>
  );
}
