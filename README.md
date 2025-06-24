# Court Shuffle

**🎾 Try it now: [courtshuffle.com](https://courtshuffle.com)**

Playing Tennis or Pickleball with a big group? Use CourtShuffle to randomly assign courts and partners.

## How It Works

1. **Choose Format** - Supports both singles and doubles play
2. **Select Courts** - Choose the court numbers you'll be playing on
3. **Add Players** - CourtShuffle creates a virtual deck of cards based on your setup
4. **Draw Cards** - Players draw cards to determine their court and partner assignments

### Card System

- **Court Number** - The card number (3, 4, 5, etc.) indicates which court to play on
- **Partner Matching** - Red suits (♦️♥️) pair together, black suits (♠️♣️) pair together

#### Examples:

- Players drawing **3♦️** and **3♥️** are **partners on court 3**
- Players drawing **4♠️** and **4♣️** are **partners on court 4**
- Players drawing **5♦️** and **5♠️** are **opponents on court 5**

### Multi-Device Sync

Got a really big group? Share the deck across multiple devices! Everything stays perfectly synchronized - no one will draw the same card twice.

**🚀 [Start playing now →](https://courtshuffle.com)**

---

A Progressive Web App (PWA) for managing court-based sports games through card-based player assignments. Built with React 19, TypeScript, and modern web technologies for a seamless mobile and desktop experience.

## Features

- **Card-based Player Assignment**: Dynamic court assignments using a deck of cards
- **Progressive Web App**: Installable, works offline, mobile-optimized
- **Real-time Sync**: Optional multi-device synchronization via Convex
- **Local-first Architecture**: Works perfectly offline with graceful degradation
- **Responsive Design**: Mobile-first with drawer/dialog adaptive UI
- **Court Management**: Flexible court configuration and player management
- **Game Formats**: Support for various court-based sports and formats

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with persistence
- **Backend**: Convex (optional real-time sync)
- **UI Components**: shadcn/ui + Radix UI
- **Mobile UI**: Vaul (drawer component)
- **Icons**: Lucide React
- **Testing**: Vitest + jsdom

## Prerequisites

- **Node.js**: Version 18 or higher
- **Package Manager**: Bun (recommended) or npm/yarn
- **Convex Account**: Optional, for real-time synchronization features

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/imathis/court-shuffle.git
   cd court-shuffle
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure Convex (Optional)**
   - Create a new project at [Convex Dashboard](https://dashboard.convex.dev)
   - Update `.env.local` with your Convex URL:
     ```
     VITE_CONVEX_URL="https://your-deployment-name.convex.cloud"
     CONVEX_DEPLOYMENT=dev:your-deployment-name
     ```
   - Initialize Convex:
     ```bash
     npx convex dev
     ```

## Development

### Project Structure

```
src/
├── components/ui/          # shadcn/ui base components
├── game/                   # Game-specific components
│   ├── config/            # Settings and configuration
│   └── play/              # Core gameplay components
├── store/                 # Zustand state management
├── helpers/               # Game logic utilities
├── hooks/                 # Custom React hooks
├── pages/                 # Route components
└── assets/               # SVG cards and static assets

convex/                    # Backend functions (optional)
├── game.ts               # Game synchronization logic
├── schema.ts             # Database schema
└── crons.ts              # Scheduled functions
```

## Usage

### Basic Gameplay

1. **Configure Game**: Set number of courts and add players
2. **Start Game**: Generate card deck based on configuration
3. **Draw Cards**: Players are assigned to courts via card draws
4. **Track Progress**: Navigate through rounds and manage court status

### Local vs. Synchronized Games

- **Local Mode**: Games are stored locally, work offline
- **Sync Mode**: Games can be shared across devices with real-time updates
- **Graceful Degradation**: App automatically falls back to local-only if sync fails

### Game Sharing

- Games can be shared via unique slugs when sync is enabled
- QR codes are generated for easy mobile sharing
- Multiple devices can connect to the same game session

## Deployment

### Standard Web Deployment

1. **Build the project**

   ```bash
   bun run build
   ```

2. **Deploy the `dist/` folder** to your preferred hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static hosting service

### PWA Installation

Users can install the app directly from their browser:

- **Chrome/Edge**: "Add to Home Screen" or "Install App"
- **Safari**: "Add to Home Screen"
- **Firefox**: "Install" option in address bar

### Convex Deployment (Optional)

If using real-time sync features:

1. **Deploy to Convex**

   ```bash
   npx convex deploy --prod
   ```

2. **Update production environment**
   Update your hosting service with production Convex URL

## Configuration

### Environment Variables

| Variable            | Description                  | Required |
| ------------------- | ---------------------------- | -------- |
| `VITE_CONVEX_URL`   | Convex deployment URL        | Optional |
| `CONVEX_DEPLOYMENT` | Convex deployment identifier | Optional |

### Game Configuration

- **Courts**: Configurable number of playing courts
- **Players**: Dynamic player list management
- **Formats**: Automatic format detection based on player/court ratio
- **Cards**: Custom card deck generation based on game parameters

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow existing code style and patterns
4. **Run tests**: `bun run test`
5. **Run linter**: `bun run lint`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use existing UI component patterns (shadcn/ui)
- Maintain mobile-first responsive design
- Write tests for new functionality
- Follow conventional commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Vite](https://vitejs.dev/) and [Tailwind CSS](https://tailwindcss.com/)
- Real-time features by [Convex](https://convex.dev/)
- Icons by [Lucide](https://lucide.dev/)
