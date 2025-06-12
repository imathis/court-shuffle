export default {
  plugins: [
    // Enable default preset with aggressive optimizations
    'preset-default',
    
    // Additional optimizations for playing cards
    {
      name: 'removeViewBox',
      active: false // Keep viewBox for proper scaling
    },
    {
      name: 'removeDimensions',
      active: true // Remove width/height, use viewBox instead
    },
    {
      name: 'removeUselessStrokeAndFill',
      active: true
    },
    {
      name: 'removeEmptyAttrs',
      active: true
    },
    {
      name: 'removeEmptyContainers',
      active: true
    },
    {
      name: 'removeUnusedNS',
      active: true
    },
    {
      name: 'removeUselessDefs',
      active: true
    },
    {
      name: 'cleanupNumericValues',
      active: true,
      params: {
        floatPrecision: 2 // Reduce precision for smaller files
      }
    },
    {
      name: 'convertPathData',
      active: true,
      params: {
        floatPrecision: 2,
        transformPrecision: 2
      }
    },
    {
      name: 'mergePaths',
      active: true
    },
    {
      name: 'removeMetadata',
      active: true
    },
    {
      name: 'removeComments',
      active: true
    },
    {
      name: 'removeEditorsNSData',
      active: true
    },
    {
      name: 'cleanupIds',
      active: true,
      params: {
        minify: true
      }
    },
    {
      name: 'collapseGroups',
      active: true
    }
  ]
};