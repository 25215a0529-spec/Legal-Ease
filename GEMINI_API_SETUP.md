# Gemini API Key Setup Guide

## 🚨 **IMPORTANT: API Key Required for AI Analysis**

Your LegalEase application is currently showing "API key not valid" errors because the Gemini API key is not properly configured. Follow these steps to enable AI-powered analysis:

## 📋 **Step 1: Get Your Gemini API Key**

1. **Visit Google AI Studio:**
   - Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Select your project or create a new one
   - Copy the generated API key (starts with `AIza...`)

## 🔧 **Step 2: Configure Environment Variables**

### **For Local Development:**

1. **Create/Update `.env.local` file:**
   ```bash
   # In your project root: c:\Users\mdfar\OneDrive\Desktop\next\
   GEMINI_API_KEY=AIzaSyC-your-actual-api-key-here
   ```

2. **Restart Development Server:**
   ```bash
   npm run dev
   ```

### **For Production/Vercel Deployment:**

1. **Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your-api-key`

2. **Redeploy:**
   - Trigger a new deployment after adding the key

## ✅ **Step 3: Verify Setup**

1. **Check Console Logs:**
   - Upload a document
   - Look for "Gemini Comprehensive Analysis" in browser console
   - Should see detailed AI analysis results

2. **Expected Behavior:**
   - Risk scores vary realistically (not always 100)
   - Detailed clause analysis appears
   - Professional recommendations provided

## 🔄 **Fallback System**

**Without API Key:**
- System uses pattern-based analysis
- Basic risk assessment works
- Limited intelligence compared to AI

**With Valid API Key:**
- Full Gemini AI analysis
- Intelligent document understanding
- Professional-grade legal insights
- Accurate risk assessment

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"API key not valid" Error:**
   - Verify API key is correct (starts with `AIza`)
   - Check environment variable name: `GEMINI_API_KEY`
   - Restart development server after adding key

2. **"Quota Exceeded" Error:**
   - Check your Google Cloud billing
   - Monitor API usage limits
   - Consider upgrading your plan

3. **Network/Timeout Errors:**
   - Check internet connection
   - Verify firewall settings
   - Try again in a few minutes

### **Debug Steps:**

1. **Check Environment:**
   ```javascript
   console.log('API Key exists:', !!process.env.GEMINI_API_KEY)
   ```

2. **Test API Connection:**
   - Use the `/api/health` endpoint
   - Should return Gemini API status

3. **Monitor Console:**
   - Watch for "Gemini" prefixed logs
   - Check for fallback messages

## 🎯 **Benefits of Proper Setup**

### **With Gemini AI:**
- **Intelligent Analysis:** Context-aware legal document review
- **Accurate Scoring:** Realistic risk assessment (20-95 scale)
- **Detailed Insights:** Clause-by-clause analysis with explanations
- **Professional Quality:** Lawyer-level document understanding
- **Industry Awareness:** Sector-specific compliance considerations

### **Without API Key (Fallback):**
- **Basic Analysis:** Pattern-matching based assessment
- **Limited Intelligence:** No context understanding
- **Generic Scoring:** May show unrealistic scores
- **Standard Insights:** Template-based recommendations

## 🔐 **Security Best Practices**

1. **Never Commit API Keys:**
   - Add `.env.local` to `.gitignore`
   - Use environment variables only

2. **Restrict API Key:**
   - Limit to specific services in Google Cloud
   - Set usage quotas and alerts

3. **Monitor Usage:**
   - Track API calls and costs
   - Set up billing alerts

## 📞 **Support**

If you continue experiencing issues:
1. Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Check the browser console for detailed error messages
3. Ensure your development server is restarted after adding the key

**Once configured properly, your LegalEase application will provide professional-grade AI-powered legal analysis!** ✨
