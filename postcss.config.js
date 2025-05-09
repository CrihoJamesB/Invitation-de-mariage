/* eslint-env node */

export default {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true
      }
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: false,
      }]
    } : false
  }
} 