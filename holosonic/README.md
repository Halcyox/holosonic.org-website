# Holosonic Website

Official website for Holosonic - Shaping Matter with Sound.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Three Fiber** - 3D graphics library
- **@react-three/drei** - Useful helpers for React Three Fiber

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Opens at [http://localhost:3001](http://localhost:3001)

### Build

```bash
pnpm build
```

Output will be in `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
holosonic/
├── public/          # Static assets
├── src/             # Source code
│   ├── App.js      # Main app component
│   ├── App.css     # App styles
│   ├── index.js    # Entry point
│   └── index.css   # Global styles
├── index.html      # HTML template
└── vite.config.js  # Vite configuration
```

## Deployment

The project is configured for AWS Amplify. Build output goes to `dist/` directory.

## Features

- 3D particle swarm animation using React Three Fiber
- Responsive design
- SEO optimized
- Fast development experience with Vite
