import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
			'xsm': '375px',
			// => @media (min-width: 480px) { ... }

			'sm': '640px',
			// => @media (min-width: 640px) { ... }

			'md': '786px',
			// => @media (min-width: 786px) { ... }

			'lg': '1024px',
			// => @media (min-width: 1024px) { ... }

		},
    fontSize: {
      "heading1-bold": [
        "50px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "heading2-bold": [
        "30px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "heading3-bold": [
        "24px",
        {
          lineHeight: "100%",
          fontWeight: "600",
        },
      ],
      "heading3-base": [
        "24px",
        {
          lineHeight: "100%",
          fontWeight: "500",
        },
      ],
      "heading4-bold": [
        "20px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "body-bold": [
        "18px",
        {
          lineHeight: "100%",
          fontWeight: "700",
        },
      ],
      "body-semibold": [
        "18px",
        {
          lineHeight: "100%",
          fontWeight: "600",
        },
      ],
      "body-medium": [
        "18px",
        {
          lineHeight: "120%",
          fontWeight: "400",
        },
      ],
      "base-bold": [
        "16px",
        {
          lineHeight: "100%",
          fontWeight: "600",
        },
      ],
      "base-medium": [
        "16px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
      "small-bold": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "700",
        },
      ],
      "small-medium": [
        "14px",
        {
          lineHeight: "140%",
          fontWeight: "500",
        },
      ],
    },
    extend: {
      
      colors: {
        "red-1": "#FF0000",
        "grey-1": "#F7F7F7",
        "grey-2": "#8A8A8A",
      },
      keyframes: {
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				fadeIn: {
					'0%': { opacity: '0'},
					'100%': { opacity: '1' },
				},
			},
			animation: {
				fadeInUp: 'fadeInUp 0.4s ease-out forwards',
				fadeIn: 'fadeIn 0.7s ease-out forwards',
			},
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;

