
import React from 'react';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select: React.FC<SelectProps> = (props) => {
  const baseClasses = "w-full box-border rounded-lg p-2.5 border border-gray-300 bg-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400";
  return <select className={baseClasses} {...props}>{props.children}</select>;
};
