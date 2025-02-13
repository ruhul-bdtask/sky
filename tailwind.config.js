/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "600px",
        // => @media (min-width: 600px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }

        "3xl": "1680px",
        // => @media (min-width: 1600px) { ... }
        "4xl": "1700px",
        // => @media (min-width: 1600px) { ... }
      },
      backgroundImage: {
        travelBg: "url('../public/images/travelBg.jpg')",
      },
      keyframes: {
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-in",
      },

      boxShadow: {
        custom_shadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
      },
    },
  },
  variants: {
    extend: {
      transform: ["responsive", "hover", "focus"],
      translate: ["responsive", "hover", "focus"],
      opacity: ["responsive", "hover", "focus"],
    },
  },
  plugins: [require("tailwindcss-animate")],
};
