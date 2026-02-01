# Testing Guide - Apna Video Call

## ✅ Pre-Testing Checklist

Before running the application, ensure:
- [x] MongoDB connection string is valid in `backend/.env`
- [x] All dependencies are installed
- [x] Both backend and frontend are ready to start

---

## 🚀 Starting the Application

### Step 1: Start Backend Server

```bash
cd backend
npm install  # If not already installed
npm run dev  # or npm start
```

**Expected Output:**
```
Server is running on port 8000
Database connected to [your-mongodb-host]
```

### Step 2: Start Frontend (New Terminal)

```bash
cd frontend
npm install  # If not already installed
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🧪 Testing Workflow

### 1. Landing Page Test
- **URL**: `http://localhost:5173/`
- **Check**:
  - ✅ Modern gradient background
  - ✅ Navigation bar with logo
  - ✅ Hero section with gradient text
  - ✅ 6 feature cards displayed
  - ✅ Feature cards animate on hover
  - ✅ "Get Started" button works

### 2. Authentication Test

#### Register New User
1. Click "Register" or "Get Started"
2. Toggle to "Sign Up" tab
3. Fill in:
   - Name: `Test User`
   - Username: `testuser`
   - Password: `Test@123`
4. Click "Register"
5. **Expected**: Success message, auto-switch to Sign In

#### Login
1. Use same credentials
2. Click "Login"
3. **Expected**: Redirect to `/home`

### 3. Home Page Test
- **Check**:
  - ✅ Navbar appears with user avatar
  - ✅ "Apna Video Call" logo
  - ✅ Home and History buttons
  - ✅ Logout button
  - ✅ Meeting code input field
  - ✅ Join button

### 4. Create/Join Meeting Test

#### Option A: Create New Meeting
1. Enter any meeting code (e.g., `test123`)
2. Click "Join"
3. **Expected**: Redirect to `/test123`

#### Option B: Guest Join
1. Navigate to `http://localhost:5173/anycode`
2. **Expected**: Direct to lobby

### 5. Video Meeting Lobby Test
- **Check**:
  - ✅ "Enter into Lobby" heading
  - ✅ Username input field
  - ✅ Local video preview (camera permission)
  - ✅ Connect button
  - ✅ Camera/microphone permissions requested

### 6. Video Call Interface Test

After clicking "Connect":
- **Check**:
  - ✅ Control buttons at bottom:
    - Camera toggle
    - Microphone toggle
    - Screen share
    - Chat
    - End call (red)
  - ✅ Local video in bottom-right corner
  - ✅ Conference view for remote participants
  - ✅ Chat sidebar (click chat icon)

### 7. Multi-User Test

**Open in Incognito/Another Browser:**
1. Navigate to same meeting code
2. Enter different username
3. Click "Connect"
4. **Expected**:
   - See other participant's video
   - Both users see each other
   - Chat messages sync

### 8. Chat Test
1. Click chat icon
2. Type a message
3. Click "Send"
4. **Expected**:
   - Message appears in chat
   - Other participants see it
   - Message shows sender name

### 9. Meeting History Test
1. End the call (red button)
2. Navigate to History from navbar
3. **Expected**:
   - See meeting in history
   - Shows meeting code
   - Shows date and time

### 10. Logout Test
1. Click logout icon in navbar
2. **Expected**: Redirect to `/auth`

---

## 🐛 Common Issues & Solutions

### Backend Issues

**Issue**: `Cannot find module`
```bash
# Solution: Install missing dependencies
cd backend
npm install
```

**Issue**: `MongoDB connection failed`
- Check `backend/.env` has correct `MONGODB_URL`
- Ensure MongoDB Atlas IP whitelist includes your IP
- Test connection string in MongoDB Compass

**Issue**: `Port 8000 already in use`
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Alternative: Change port in backend/.env
PORT=8001
```

### Frontend Issues

**Issue**: `Cannot find module` errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Blank page or white screen
- Check browser console (F12)
- Ensure backend is running
- Check for CORS errors

**Issue**: Camera/Microphone not working
- Grant permissions when prompted
- Use HTTPS in production (HTTP works on localhost)
- Check browser compatibility (use Chrome/Edge)

### Video Call Issues

**Issue**: Can't see other participants
- Check both users are in same meeting code
- Verify WebRTC connection (check browser console)
- Ensure firewall allows WebRTC

**Issue**: No audio/video
- Check device permissions
- Verify correct device selected
- Test in browser settings first

---

## 📱 Mobile Testing

### Responsive Design Check
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test at:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

**Check**:
- ✅ Navigation collapses
- ✅ Feature cards stack
- ✅ Video controls remain accessible
- ✅ Chat sidebar becomes full-width

---

## 🎯 Production Checklist

Before deploying:

### Backend
- [ ] Update `MONGODB_URL` to production database
- [ ] Set secure `PORT` value
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for all secrets
- [ ] Set up logging
- [ ] Add rate limiting

### Frontend
- [ ] Update server URLs in:
  - `src/contexts/AuthContext.jsx` (line 6)
  - `src/pages/VideoMeet.jsx` (line 16)
- [ ] Build production bundle: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Configure HTTPS (required for WebRTC)

### Deployment
- [ ] Backend: Deploy to Render, Railway, or Heroku
- [ ] Frontend: Deploy to Vercel, Netlify, or Cloudflare Pages
- [ ] Update environment variables on hosting platform
- [ ] Test CORS between deployed frontend and backend

---

## 📊 Performance Metrics

**Expected Performance:**
- Landing page load: < 2s
- Authentication: < 1s
- Meeting join: < 3s
- Video connection: < 5s
- Chat latency: < 100ms

---

## ✨ All Systems Ready!

Your video conferencing application is fully functional and ready for testing. Follow this guide to ensure everything works perfectly! 🚀

For issues or questions, check the [README.md](file:///d:/major%20project/meetup/README.md) or review the [walkthrough.md](file:///C:/Users/h2307/.gemini/antigravity/brain/061c1e60-6545-4c1f-adc6-8dc2d14f2805/walkthrough.md).
