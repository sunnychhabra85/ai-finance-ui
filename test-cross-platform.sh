#!/bin/bash

# Cross-Platform Testing Script
# Run this to test your app on web and mobile

echo "🚀 AI Finance App - Cross-Platform Testing"
echo "==========================================="
echo ""
echo "Choose an option:"
echo "1) Run on Web (http://localhost:8081)"
echo "2) Run on Android"
echo "3) Run on iOS"
echo "4) Run in development mode (web)"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo "🌐 Starting web server..."
    npm run web
    ;;
  2)
    echo "📱 Starting Android emulator..."
    npm run android
    ;;
  3)
    echo "🍎 Starting iOS simulator..."
    npm run ios
    ;;
  4)
    echo "🔧 Starting dev mode..."
    npm start
    ;;
  *)
    echo "Invalid choice"
    ;;
esac
