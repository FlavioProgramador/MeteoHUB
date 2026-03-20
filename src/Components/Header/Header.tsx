import React from 'react';
import { CloudSun } from 'lucide-react';

export const Header = () => {
  return (
    <div className="logoContainer">
      <CloudSun size={64} className="logoIcon" />
      <h1 className="logoText">MeteoHub</h1>
    </div>
  );
};
