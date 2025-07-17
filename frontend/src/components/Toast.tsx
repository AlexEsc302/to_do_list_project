import React, { useEffect, useState } from 'react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const ToastItem: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const backgroundColor = type === 'error' ? '#f44336' 
    : type === 'success' ? '#4caf50' 
    : '#2196f3';

  return (
    <div
      style={{
        padding: '12px 24px',
        backgroundColor,
        color: 'white',
        borderRadius: '4px',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          marginLeft: '12px',
        }}
      >
        ✕
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Global toast function
let toastContainer: { addToast?: (message: string, type: 'success' | 'error' | 'info') => void } = {};

export const initToast = (addToastFn: (message: string, type: 'success' | 'error' | 'info') => void) => {
  toastContainer.addToast = addToastFn;
};

export const toast = {
  success: (message: string) => toastContainer.addToast?.(message, 'success'),
  error: (message: string) => toastContainer.addToast?.(message, 'error'),
  info: (message: string) => toastContainer.addToast?.(message, 'info'),
};
