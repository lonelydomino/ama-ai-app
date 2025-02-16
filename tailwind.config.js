module.exports = {
  // ... other config
  extend: {
    animation: {
      'fadeIn': 'fadeIn 1s ease-in',
      'spin-slow': 'spin 60s linear infinite',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(10px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
  },
} 