# Metflix APK Build Guide

## Step 1: Deploy Backend to Vercel (Do This First!)

The APK needs a live backend to call. Deploy your GitHub repo to Vercel:

1. Go to **https://vercel.com** and sign in with your GitHub account
2. Click **"New Project"**
3. Import your `metflix` repo from GitHub
4. Leave all settings as default and hit **Deploy**
5. Once deployed, note your URL (e.g. `https://metflix-xxx.vercel.app`)

> Update `app/lib/capacitor-bridge.js` if your Vercel URL is different from `https://metflix.vercel.app`

---

## Step 2: Build the Static Site

```bash
npm run build
```

This creates the `out/` folder — the web bundle Capacitor will package.

---

## Step 3: Initialize Capacitor & Add Android

```bash
npx cap init Metflix com.metflix.app --web-dir out
npx cap add android
```

---

## Step 4: Sync Web Assets

```bash
npx cap sync android
```

---

## Step 5: Build the APK

### Option A — Command Line (after setting ANDROID_HOME):
```bash
$env:ANDROID_HOME = "C:\Users\MONKEY_D\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\build-tools\34.0.0"
cd android
.\gradlew assembleDebug
```

APK output: `android\app\build\outputs\apk\debug\app-debug.apk`

### Option B — Open in Android Studio:
```bash
npx cap open android
```
Then click **Build → Build Bundle(s)/APK(s) → Build APK(s)**

---

## Step 6: Install on Your Phone

Connect your phone via USB with Developer Mode + USB Debugging ON, then:
```bash
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

Or just copy the APK file to your phone and open it!
