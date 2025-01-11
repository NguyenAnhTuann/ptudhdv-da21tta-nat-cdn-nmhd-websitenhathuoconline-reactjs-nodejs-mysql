/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fall: {
          '0%': {
            transform: 'translateX(0) translateY(-100px) rotate(0deg)', // Bắt đầu
            opacity: '1',
          },
          '25%': {
            transform: 'translateX(-30px) translateY(25vh) rotate(90deg)', // Đổi hướng nhẹ
            opacity: '0.9',
          },
          '50%': {
            transform: 'translateX(50px) translateY(50vh) rotate(180deg)', // Đi ngang
            opacity: '0.8',
          },
          '75%': {
            transform: 'translateX(-20px) translateY(75vh) rotate(270deg)', // Đổi hướng gió
            opacity: '0.5',
          },
          '100%': {
            transform: 'translateX(100px) translateY(100vh) rotate(360deg)', // Kết thúc
            opacity: '0',
          },
        },
      },

      animation: {
        fall: 'fall var(--fall-duration) linear var(--fall-delay) infinite', // Sử dụng biến để tùy chỉnh
      },
    },
    safelist: [
      "slick-active", // Đảm bảo Tailwind không lọc bỏ lớp này
      "bg-blue-500",
      "bg-gray-300",
    ],
  },
  plugins: [],
};
