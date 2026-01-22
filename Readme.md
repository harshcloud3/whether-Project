# 🌤️ MausamWatch - The Weather Buddy

Hey there! 👋 This is my weather app project I built for my JavaScript assignment. It's not just another weather app - I added some Indian spices to it! 🇮🇳

## What's This All About?

So, we had to build a weather app using JavaScript, HTML, and CSS. The assignment was pretty detailed - like 200 marks worth of stuff to do. I thought, why not make it actually useful for us in India? So I made "MausamWatch" (Mausam means weather in Hindi).

## What Can This Thing Actually Do?

### The Assignment Stuff (I did all of it, promise!):
- **Search any city** - Type "Mumbai" or "Delhi" and boom, weather!
- **Your location** - Click a button and it finds where you are (if you let it)
- **Recent cities** - Remembers where you searched (like your browser remembers passwords)
- **°C or °F** - Toggle between them (though who uses °F here anyway? 😅)
- **5-day forecast** - Plan your week ahead
- **Error messages** - If you type nonsense, it tells you nicely (no annoying popups!)

### My Extra Touches:
- **Indian weather alerts** - Warns you about heat waves (above 45°C) and cold waves
- **Monsoon mode** - Background changes when it's rainy
- **Chai & pakoras tip** - Suggests chai when it rains (because, obviously!)
- **Festival alerts** - Reminds you about Diwali season weather
- **Actually works on phones** - Tested on my friend's iPhone SE

## Okay, How Do I Make It Work?

### Step 1: Get the Magic Key 🔑
1. Go to [OpenWeatherMap](https://home.openweathermap.org) (it's free)
2. Sign up (takes 2 minutes)
3. Get your "API key" (fancy term for password to get weather data)
4. **IMPORTANT**: Wait like 10-60 minutes. The key needs to "activate" (annoying, I know)

### Step 2: Plug In the Key
1. Open the `app.js` file (right-click → open with Notepad or any editor)
2. Look for line that says: `API_KEY: '------'`
3. Replace `'--------'` with your actual key (keep the quotes!)
4. Save the file

### Step 3: Launch It!
1. Just double-click `index.html`
2. It opens in your browser
3. Start searching cities!

**Pro tip**: If you're in a hurry and don't want to get an API key, change `USE_MOCK_DATA: false` to `true` in `app.js`. It'll use fake data so you can at least see how it looks.

## Files in This Project (The Boring But Important Part)

I kept it simple - only 4 main files:
