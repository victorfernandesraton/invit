module.exports = {
  content: ['./src/**/*.njs', './src/**/*.jsx', './src/**/*.nts', './src/**/*.tsx'],
  theme: {
    extend: {},
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      mono: ['Prompt', 'SFMono-Regular'],

      'crete-round': ['Crete Round', 'sans-serif'],
    },
  },
  plugins: [require('tw-elements/dist/plugin')],
}
