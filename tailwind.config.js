/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        contentColor: "#12101b",
        customColor1: "#217bfe",
        customColor2: "#e55571",
        getStartedButton: "#217bfe"
      },
      fontSize:{
        title: "128px",
        titleMobile: "64px"
      },

      animation: {
        slideBg: 'slideBg 8s ease-in-out infinite alternate',
        botAnimate: 'botAnimate 3s ease-in-out infinite alternate',
        rotateOrbital: '100s linear infinite rotateOrbital'

      },
      keyframes: {
        botAnimate: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '100%': { transform: 'scale(1.1) rotate(-5deg)' },
        },
        slideBg: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },

        rotateOrbital: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(60deg)' },
        },
      },
    },
  },
  plugins: [
    daisyui,
  ],
};
