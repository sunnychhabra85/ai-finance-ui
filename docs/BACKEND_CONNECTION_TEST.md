# Backend Connection Troubleshooting

You're seeing this error: `Request aborted - Backend not responding!`

This means the app cannot connect to your backend services. Follow these steps to fix it:

## ✅ Step 1: Check if Backend Services Are Running

Your app needs these backend services running:

1. **Auth Service** - Port 3001
2. **Upload Service** - Port 3002  
3. **Analytics Service** - Port 3004
4. **Notification Service** - Port 3005

### Check Backend Status

Open a terminal and verify each service is running:

**Windows (PowerShell):**
```powershell
# Check what's running on port 3001
netstat -ano | findstr :3001

# Check all backend ports
netstat -ano | findstr ":3001 :3002 :3004 :3005"
```

**Mac/Linux:**
```bash
# Check what's running on port 3001
lsof -i :3001

# Check all backend ports
lsof -i :3001 -i :3002 -i :3004 -i :3005
```

If nothing is running, you need to **start your backend services first!**

---

## ✅ Step 2: Test Backend Connectivity

### From Your Computer

Open a browser or use curl to test:

```bash
# Test auth service
curl http://localhost:3001/api/v1/health

# Or open in browser:
http://localhost:3001/api/v1/health
```

If this fails, your backend is not running or not accessible.

### From Android Emulator

The emulator uses `10.0.2.2` to reach your computer's `localhost`:

```bash
# Test from emulator using adb
adb shell curl http://10.0.2.2:3001/api/v1/health
```

If this fails:
- ✅ Make sure backend is listening on `0.0.0.0` (not just `127.0.0.1`)
- ✅ Check your firewall isn't blocking the connection

---

## ✅ Step 3: Verify Backend Configuration

Your backend services MUST listen on `0.0.0.0` to be accessible from emulator/device:

### Node.js/Express Example:
```javascript
// ❌ Wrong - only accessible from localhost
app.listen(3001, 'localhost');
app.listen(3001, '127.0.0.1');

// ✅ Correct - accessible from network
app.listen(3001, '0.0.0.0');
app.listen(3001); // defaults to 0.0.0.0
```

### Check Your Backend Code:
```bash
# Search for listen calls in your backend
cd D:\ai-expense-management  # Go to backend directory
grep -r "listen(" . --include="*.js" --include="*.ts"
```

---

## ✅ Step 4: Configure Frontend for Your Setup

### For Android Emulator (Default):
The app already uses `10.0.2.2` by default. No changes needed if using emulator.

### For Physical Android Device:

1. **Find your computer's IP:**
   ```bash
   ipconfig  # Windows - look for IPv4 Address
   ifconfig  # Mac/Linux
   ```
   Example: `192.168.1.100`

2. **Create `.env` file** in `D:\ai-expense-management\ai-finance-ui\`:
   ```env
   EXPO_PUBLIC_API_HOST=192.168.1.100
   ```

3. **Restart Expo:**
   ```bash
   npx expo start --clear
   ```

4. **Verify the IP in console:**
   Look for: `🌐 API Configuration: { deviceIP: "192.168.1.100", ... }`

---

## ✅ Step 5: Check Firewall

### Windows Firewall:
```powershell
# Allow Node.js through firewall
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -Protocol TCP -LocalPort 3001,3002,3004,3005 -Action Allow
```

### Or manually:
1. Open Windows Defender Firewall
2. Advanced Settings → Inbound Rules → New Rule
3. Port → TCP → Specific ports: `3001,3002,3004,3005`
4. Allow the connection

---

## ✅ Quick Test Script

Save this as `test-backend.js` in your backend directory:

```javascript
// test-backend.js
const http = require('http');

const ports = [3001, 3002, 3004, 3005];

ports.forEach(port => {
  http.get(`http://localhost:${port}/api/v1/health`, (res) => {
    console.log(`✅ Port ${port}: Status ${res.statusCode}`);
  }).on('error', (err) => {
    console.log(`❌ Port ${port}: ${err.message}`);
  });
});
```

Run it:
```bash
node test-backend.js
```

---

## 🔍 Still Not Working?

### Check the Console Logs

When you try to login, you should see:

```
🌐 API Configuration: {
  platform: "android",
  deviceIP: "10.0.2.2",
  authAPI: "http://10.0.2.2:3001/api/v1",
  ...
}

🚀 Making API request: { url: "http://10.0.2.2:3001/api/v1/auth/login", method: "POST" }
```

If you see `⏰ Request timeout after 30 seconds`, the backend is not responding.

### Common Issues:

1. **Backend not started** → Start your backend services
2. **Wrong port** → Verify services are on ports 3001, 3002, 3004, 3005
3. **Wrong IP** → For physical device, use your computer's local IP
4. **Firewall blocking** → Allow ports through firewall
5. **Different network** → Phone and computer must be on same WiFi
6. **Backend bound to 127.0.0.1** → Change to 0.0.0.0

---

## 📞 Need More Help?

1. Share the full error from console
2. Run `netstat -ano | findstr :3001` and share the output
3. Share your backend startup logs
4. Confirm if using emulator or physical device
