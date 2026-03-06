import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-4 rounded-xl shadow bg-white flex items-center justify-between">
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>

      {icon && (
        <div className="text-3xl text-blue-500">
          {icon}
        </div>
      )}
    </div>
  );
};

export default MetricCard;