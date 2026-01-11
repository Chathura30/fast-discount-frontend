# Fast Discount - Frontend

A modern e-commerce mobile application built with React Native and Expo, featuring AI-powered health analysis and seamless shopping experience.

## Tech Stack

- **Framework:** React Native
- **Navigation:** Expo Router (File-based routing)
- **Runtime:** Expo SDK 54
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Real-time Communication:** Socket.io Client
- **Push Notifications:** Expo Notifications & Firebase Cloud Messaging
- **UI Components:** React Native, Expo Vector Icons
- **Charts:** React Native Chart Kit
- **Image Handling:** Expo Image Picker
- **Language:** JavaScript/TypeScript

## Features

### User Features
- User authentication (Login/Register/Password Reset)
- Browse products with search and filters
- Product details with image gallery
- Shopping cart management
- Favorites/Wishlist
- Multiple payment methods (Cash on Delivery, Card Payment)
- Order tracking and history
- AI-powered health analysis
- Push notifications for order updates
- User profile and account management
- Help and support

### Admin Features
- Admin dashboard with analytics
- Product management (Add/Edit/Delete)
- Order management
- Sales tracking and reports
- User management


### Running the App

Start the development server:
```bash
npm start
```

Or use specific platform commands:

```bash
# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web
```

### Expo Go

Scan the QR code with:
- **iOS:** Camera app
- **Android:** Expo Go app

## Key Features Implementation

### Context API
- **CartContext:** Manages shopping cart state globally
- **FavoriteContext:** Manages user favorites/wishlist

### Navigation
Uses Expo Router for file-based routing, making navigation intuitive and organized.

### Real-time Updates
Socket.io integration for live order status updates and notifications.

### Push Notifications
- Expo Notifications for local and push notifications
- Firebase Cloud Messaging for reliable delivery
- Order updates and promotional notifications

### AI Health Analysis
Integrated AI-powered health analysis feature for product recommendations and health insights.

## Build for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

Or use EAS Build:
```bash
eas build --platform android
eas build --platform ios
```

## Environment Configuration

Make sure to configure the following in your code:
- Backend API URL
- Firebase configuration
- Socket.io server URL
- Any third-party API keys

## Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Dependencies Highlights

- **@react-navigation/native:** Navigation framework
- **@expo/vector-icons:** Icon library
- **axios:** HTTP requests
- **socket.io-client:** Real-time communication
- **expo-notifications:** Push notifications
- **@react-native-firebase:** Firebase integration
- **react-native-chart-kit:** Data visualization
- **expo-image-picker:** Image selection
- **@react-native-async-storage:** Local storage


## Author

Chathura30
