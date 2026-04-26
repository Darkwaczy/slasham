import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React from "react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export default function AdminModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children,
  maxWidth,
  size = 'md'
}: AdminModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-[95vw]'
  };

  const resolvedMaxWidth = maxWidth || sizeClasses[size];
  // Close on ESC
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full ${resolvedMaxWidth} bg-white rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh]`}
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 flex items-start justify-between shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm font-medium text-slate-500 max-w-md">
                    {description}
                  </p>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
