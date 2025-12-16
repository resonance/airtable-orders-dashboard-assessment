import { ReactNode } from "react";

interface CardProps {
  title?: string;
  value?: string | number;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

function Card({ title, value, subtitle, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${className}`}
    >
      {title && (
        <div className="text-sm font-medium text-gray-500 mb-1">{title}</div>
      )}
      {value !== undefined && (
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      )}
      {subtitle && <div className="text-sm text-gray-400 mt-1">{subtitle}</div>}
      {children}
    </div>
  );
}

export default Card;
