# Product Dashboard - React Native App

A modern, performant mobile application for browsing and searching products with a beautiful UI and smooth animations.

## 🚀 Features

- **User Authentication** - Secure login screen with form validation
- **Product Dashboard** - Browse 700+ products in a 3-column grid layout
- **Smart Search** - Real-time search with category filtering
- **Infinite Scroll** - Smooth pagination loading products in batches
- **Scroll Animations** - Auto-hiding tab bar and floating "Back to Top" button
- **High Performance** - Optimized with FlashList for smooth scrolling
- **Responsive Design** - Adapts to different screen sizes with safe area handling
- **Dark Mode Support** - Automatic theme switching based on system preferences

## 📱 Screenshots

<!-- Add screenshots here once you deploy -->

## 🛠️ Tech Stack

- **Framework:** React Native 0.81.5 with Expo SDK 54
- **Language:** TypeScript 5.3.3
- **Navigation:** Expo Router (file-based routing)
- **UI Components:** Custom components with Ionicons
- **Animations:** React Native Reanimated & Animated API
- **HTTP Client:** Axios
- **List Optimization:** @shopify/flash-list
- **Styling:** StyleSheet API with centralized theming

## 📋 Prerequisites

- Node.js >= 20
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd reactApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web Browser
```

## 📂 Project Structure

```
reactApp/
├── app/                    # File-based routes
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Dashboard (Home)
│   │   ├── search.tsx     # Search screen
│   │   ├── cart.tsx       # Shopping cart
│   │   └── profile.tsx    # User profile
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Login screen
├── components/            
│   ├── Card.tsx           # Product card component
│   ├── CustomTabBar.tsx   # Animated tab bar
│   └── ui/                # Reusable UI components
├── constants/
│   └── theme.ts           # Color palette & theme
├── context/
│   └── TabBarContext.tsx  # Tab bar state management
├── hooks/                 # Custom React hooks
├── styles/
│   └── common.ts          # Shared styles
└── assets/                # Images and static files
```

## 🎯 Key Features Explained

### Dashboard with Infinite Scroll
The home screen fetches products from the DummyJSON API and displays them in a high-performance grid using FlashList. Products load in batches of 21 items as you scroll.

### Smart Filtering
- **Search:** Real-time filtering by product title
- **Categories:** Filter by predefined categories (Smartphones, Laptops, etc.)
- Both filters can be combined for precise results

### Scroll-Based Animations
- Tab bar automatically hides when scrolling down for better content visibility
- Floating Action Button (FAB) appears after scrolling 300px to quickly jump to top
- Both animations are synchronized using React Context

### Performance Optimizations
- **FlashList:** 10x faster than FlatList for large datasets
- **Refs for data storage:** Prevents unnecessary re-renders
- **Batch rendering:** Only renders visible items + small buffer
- **Native-driven animations:** 60fps smooth animations

## 🎨 Theme System

The app supports light and dark modes with a centralized color palette based on Tailwind CSS colors:

```typescript
Colors.light.primary    // Deep Navy (#0f172a)
Colors.light.secondary  // Bright Blue (#3b82f6)
Colors.light.accent     // Warm Amber (#f59e0b)
```

Theme automatically switches based on system preferences.

## 📱 Screens Overview

1. **Login Screen** (`app/index.tsx`)
   - Form validation
   - Password visibility toggle
   - Simulated authentication with 1.5s delay

2. **Dashboard** (`app/(tabs)/index.tsx`)
   - Product grid (3 columns)
   - Search and category filters
   - Infinite scroll pagination
   - Animated header and tab bar

3. **Search, Cart, Profile** (Placeholder screens)
   - Ready for future implementation

## 🧪 Testing

```bash
# Run linter
npm run lint
```

## 🚢 Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📦 Dependencies

### Production
- `expo` - Expo framework
- `expo-router` - File-based navigation
- `react-native-reanimated` - Advanced animations
- `@shopify/flash-list` - High-performance lists
- `axios` - HTTP requests
- `expo-linear-gradient` - Gradient backgrounds

### Development
- `typescript` - Type safety
- `@types/react` - React type definitions

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome!

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 👤 Author

Created as a demonstration of React Native development skills.

## 🙏 Acknowledgments

- Product data from [DummyJSON API](https://dummyjson.com)
- Icons from [Expo Vector Icons](https://icons.expo.fyi)
- Built with [Expo](https://expo.dev)

---

**Note:** This is a demo application built for learning and interview purposes. The authentication is simulated and no real user data is stored.
