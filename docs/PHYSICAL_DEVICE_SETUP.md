# Running on Physical Device

This guide helps you run the app on a physical Android or iOS device.

## Problem

When running on a physical device, the app cannot connect to your backend services using `localhost` or `10.0.2.2` (which only works for Android emulator). You'll see errors like:

```
ERROR API Error Details: {"message": "Aborted", "name": "AbortError", "platform": "android", "url": "http://10.0.2.2:3001/api/v1/auth/login"}
```

## Solution

You need to configure the app to use your computer's local network IP address.

### Step 1: Find Your Computer's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (WiFi or Ethernet)
Example: `192.168.1.100`

**Mac:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Or for WiFi specifically:
```bash
ipconfig getifaddr en0
```
Example: `192.168.1.100`

**Linux:**
```bash
ip addr show
```
Or:
```bash
hostname -I
```
Example: `192.168.1.100`

### Step 2: Configure the Environment Variable

**Option A: Using .env file (Recommended)**

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update `EXPO_PUBLIC_API_HOST` with your IP:
   ```
   EXPO_PUBLIC_API_HOST=192.168.1.100
   ```

3. Restart your Expo development server:
   ```bash
   npx expo start --clear
   ```

**Option B: Direct code modification**

Edit `services/api.ts` and change this line:
```typescript
const DEVICE_IP = process.env.EXPO_PUBLIC_API_HOST || '10.0.2.2';
```
To:
```typescript
const DEVICE_IP = process.env.EXPO_PUBLIC_API_HOST || '192.168.1.100'; // Your IP
```

### Step 3: Ensure Backend Services Are Accessible

1. Make sure all your backend services are running:
   - Auth Service: http://YOUR_IP:3001
   - Upload Service: http://YOUR_IP:3002
   - Analytics Service: http://YOUR_IP:3004
   - Notification Service: http://YOUR_IP:3005

2. Your backend services must bind to `0.0.0.0` (not `127.0.0.1`) to be accessible from other devices:
   ```javascript
   // Node.js/Express example
   app.listen(3001, '0.0.0.0', () => {
     console.log('Server running on 0.0.0.0:3001');
   });
   ```

3. Make sure your firewall allows incoming connections on these ports

### Step 4: Test Connection

1. Open a browser on your phone
2. Navigate to: `http://YOUR_IP:3001/api/v1/health` (or similar endpoint)
3. If you can access it, the configuration is correct

### Step 5: Run the App

```bash
npx expo start
```

Scan the QR code with Expo Go app on your physical device.

## Quick Reference

| Device Type | IP to Use |
|-------------|-----------|
| Android Emulator | `10.0.2.2` |
| iOS Simulator | `localhost` or `127.0.0.1` |
| Physical Device | Your computer's local network IP (e.g., `192.168.1.100`) |

## Troubleshooting

### "Network request failed" or "Aborted"

- ✅ Check that your phone and computer are on the same WiFi network
- ✅ Verify your IP address hasn't changed (some routers assign dynamic IPs)
- ✅ Check firewall settings on your computer
- ✅ Ensure backend services are running and bound to `0.0.0.0`
- ✅ Restart Expo dev server after changing .env file

### "Cannot connect to server"

- Test the URL directly in your phone's browser
- Ping your computer from another device on the network
- Check if VPN or network security is blocking connections

### Backend not accessible

If your backend is running with services like Docker, ensure port mapping is configured correctly:
```bash
docker run -p 3001:3001 your-service
```

## Environment Variables

The app supports these environment variables (set in `.env`):

- `EXPO_PUBLIC_API_HOST` - The IP address of your development machine
- `REACT_APP_API_BASE` - Full URL for Auth Service (optional, overrides host)
- `REACT_APP_UPLOAD_API_BASE` - Full URL for Upload Service (optional)
- `REACT_APP_ANALYTICS_API_BASE` - Full URL for Analytics Service (optional)
- `REACT_APP_NOTIFICATION_API_BASE` - Full URL for Notification Service (optional)
