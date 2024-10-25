# Bundle Analysis with rollup-plugin-visualizer

## Overview

The rollup-plugin-visualizer creates a visual representation of your application's bundle size and composition, helping developers:

- Identify large dependencies
- Analyze chunk splitting effectiveness
- Find opportunities for code splitting
- Track bundle size changes

## Usage

### Generate Bundle Analysis

Run the build with the ANALYZE flag:

```bash
# Generate bundle analysis
ANALYZE=true pnpm build

# The visualization will be generated at dist/stats.html
```

### Visualization Types

The plugin supports different visualization templates:

- `treemap`: (default) Shows hierarchical data using nested rectangles
- `sunburst`: Circular visualization of the hierarchy
- `network`: Force-directed graph showing dependencies
- `raw`: Raw data in JSON format

### Reading the Visualization

The visualization shows:

1. Total bundle size
2. Individual chunk sizes
3. Module composition within chunks
4. Dependencies between modules
5. Gzip and Brotli compressed sizes

### Example Analysis

```
vendor-react (250 KB)
├── react (40 KB)
├── react-dom (180 KB)
└── react-router-dom (30 KB)

utils-i18n (45 KB)
├── datetime-utils (15 KB)
├── number-utils (10 KB)
└── list-utils (20 KB)
```

## Configuration Options

- `filename`: Output file location
- `template`: Visualization type
- `gzipSize`: Show gzip size
- `brotliSize`: Show brotli size
- `open`: Auto-open in browser
