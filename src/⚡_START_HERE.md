# ⚡ START HERE - PAYMENT CALLBACK FIX

## 🎯 I CREATED EASY-TO-RUN SCRIPTS FOR YOU!

No need to memorize commands - just run these scripts!

---

## ✅ OPTION 1: ONE-CLICK SCRIPT (Recommended)

### **On Mac/Linux:**

```bash
chmod +x deploy-and-watch.sh
./deploy-and-watch.sh
```

### **On Windows:**

```bash
deploy-and-watch.bat
```

**Or just double-click the `.bat` file!**

---

## ✅ OPTION 2: VISUAL DASHBOARD (No Terminal!)

### **Step 1: Deploy diagnostic function**

```bash
npx supabase functions deploy diagnostic
```

### **Step 2: Open the dashboard**

Double-click this file: **`diagnostic-dashboard.html`**

It will open in your browser and show you:
- ✅ What FRONTEND_URL value is set
- ✅ If it's correct or not
- ✅ Recommendations to fix issues
- ✅ One-click test button

**Take a screenshot and send to me!**

---

## 📋 WHAT HAPPENS

### **Shell Script Does:**
1. Deploys updated Edge Function
2. Watches logs in real-time
3. Shows you what FRONTEND_URL value is
4. You try payment in browser
5. Logs show exactly what's wrong

### **Dashboard Shows:**
- Current FRONTEND_URL value
- If it's localhost or production
- If it has trailing slash
- If protocol is correct
- Color-coded status (green = good, red = bad)

---

## 🎯 WHICH ONE SHOULD I USE?

**Use the Shell Script if:**
- You want to see real-time logs
- You want to watch what happens during payment

**Use the Dashboard if:**
- You prefer visual interfaces
- You want to check config without trying payment
- You don't like terminal commands

**Both will work! Choose what's easier for you!**

---

## 🚀 THEN WHAT?

After running either:

**1. Send me:**
- Screenshot of dashboard, OR
- Copy of terminal logs

**2. I'll tell you:**
- What's wrong
- How to fix it
- Exact commands to run

---

## 📖 MORE INFO

See **`📦_SCRIPTS_README.md`** for detailed documentation!

---

## ⚡ JUST RUN ONE OF THESE:

```bash
# Option 1: Shell script
./deploy-and-watch.sh

# Option 2: Dashboard
npx supabase functions deploy diagnostic
# Then open diagnostic-dashboard.html
```

**That's it! Easy! 🎉**
