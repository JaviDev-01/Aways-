
import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-label="Aways+ Logo"
  >
    {/* Circle */}
    <motion.path 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      d="M85 50C85 71.5 68.5 92 50 92C28 92 10 75 10 50C10 28 25 8 50 8C78 8 92 28 88 50" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round"
      className="text-white"
    />
    {/* Letter A */}
    <motion.path 
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      d="M30 75L50 25L70 75M35 60H65" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="text-white"
    />
    {/* Plus Sign */}
    <motion.path 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 1, type: "spring" }}
      d="M75 35V55M65 45H85" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round"
      className="text-blue-200"
    />
  </svg>
);
