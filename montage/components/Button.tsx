
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, ...props }) => {
  const baseClasses = "px-4 py-2.5 rounded-lg font-bold cursor-pointer transition-transform active:translate-y-px focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-accent hover:bg-accent-dark text-gray-900 focus:ring-yellow-500",
    secondary: "bg-gray-800 hover:bg-gray-900 text-white focus:ring-gray-500"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`} {...props}>
      {children}
    </button>
  );
};
