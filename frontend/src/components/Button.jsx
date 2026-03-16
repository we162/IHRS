import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
  const baseStyles = "px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-accent hover:bg-accent-light text-white shadow-[0_0_15px_rgba(255,107,0,0.4)] hover:shadow-[0_0_25px_rgba(255,107,0,0.6)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:shadow-none",
    outline: "border border-accent text-accent hover:bg-accent hover:text-white disabled:opacity-70 disabled:cursor-not-allowed",
    ghost: "text-white hover:text-accent font-medium px-4 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
  };

  return (
    <motion.button
      whileHover={props.disabled ? {} : { scale: 1.05 }}
      whileTap={props.disabled ? {} : { scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
