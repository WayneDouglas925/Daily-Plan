
import React from 'react';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="glass rounded-3xl p-6 md:p-8 flex flex-col gap-4">
      <div>
        <h3 className="font-display text-xl font-bold text-white/90 uppercase tracking-wide">
          {title}
        </h3>
        {subtitle && (
          <p className="text-white/50 text-xs md:text-sm mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
