
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = (props) => {
  const baseClasses = "w-full box-border rounded-lg p-2.5 border border-gray-300 bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:bg-gray-100 disabled:cursor-not-allowed";
  return <input className={baseClasses} {...props} />;
};
