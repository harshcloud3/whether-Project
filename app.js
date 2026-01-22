// Weather API integration logic

// Configuration
const CONFIG = {
    API_KEY: '4940adb2aad947ef84256c41bd057a84', // OpenWeatherMap API Key
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    UNITS: 'metric',
    DEFAULT_CITY: 'Delhi',
    USE_MOCK_DATA: false // Set to true for testing without API
};

// State Management
let appState = {
    currentCity: CONFIG.DEFAULT_CITY,
    temperatureUnit: 'celsius',
    recentCities: [],
    currentWeather: null,
    forecastData: null
};

// DOM Elements
let elements = {};

// Weather Icon Mapping
const WEATHER_ICONS = {
    '01d': { icon: 'fas fa-sun', emoji: '☀️', color: 'text-yellow-500' },
    '01n': { icon: 'fas fa-moon', emoji: '🌙', color: 'text-indigo-400' },
    '02d': { icon: 'fas fa-cloud-sun', emoji: '⛅', color: 'text-amber-400' },
    '02n': { icon: 'fas fa-cloud-moon', emoji: '☁️🌙', color: 'text-indigo-300' },
    '03d': { icon: 'fas fa-cloud', emoji: '☁️', color: 'text-gray-400' },
    '03n': { icon: 'fas fa-cloud', emoji: '☁️', color: 'text-gray-400' },
    '04d': { icon: 'fas fa-cloud', emoji: '☁️☁️', color: 'text-gray-500' },
    '04n': { icon: 'fas fa-cloud', emoji: '☁️☁️', color: 'text-gray-500' },
    '09d': { icon: 'fas fa-cloud-rain', emoji: '🌧️', color: 'text-blue-500' },
    '09n': { icon: 'fas fa-cloud-rain', emoji: '🌧️', color: 'text-blue-500' },
    '10d': { icon: 'fas fa-cloud-sun-rain', emoji: '🌦️', color: 'text-sky-400' },
    '10n': { icon: 'fas fa-cloud-moon-rain', emoji: '🌧️🌙', color: 'text-sky-400' },
    '11d': { icon: 'fas fa-bolt', emoji: '⚡', color: 'text-yellow-600' },
    '11n': { icon: 'fas fa-bolt', emoji: '⚡', color: 'text-yellow-600' },
    '13d': { icon: 'fas fa-snowflake', emoji: '❄️', color: 'text-blue-200' },
    '13n': { icon: 'fas fa-snowflake', emoji: '❄️', color: 'text-blue-200' },
    '50d': { icon: 'fas fa-smog', emoji: '🌫️', color: 'text-gray-300' },
    '50n': { icon: 'fas fa-smog', emoji: '🌫️', color: 'text-gray-300' }
};

// Weather Tips for India
const WEATHER_TIPS = {
    'Clear': [
        "Apply sunscreen - Indian sun can be harsh ☀️",
        "Stay hydrated, drink plenty of water 💧",
        "Perfect day for outdoor activities",
        "Wear light cotton clothes 👕"
    ],
    'Clouds': [
        "Might rain later, carry an umbrella ☔",
        "Good day for indoor activities",
        "Cloudy skies can still produce great photos! 📸",
        "Check humidity levels - can feel muggy"
    ],
    'Rain': [
        "Don't forget your umbrella! ☔",
        "Perfect weather for chai and pakoras ☕",
        "Roads might be slippery, drive carefully 🚗",
        "Monsoon season: watch for waterlogging"
    ],
    'Thunderstorm': [
        "Stay indoors if possible 🏠",
        "Unplug electronic devices 🔌",
        "Avoid open fields and tall trees 🌳",
        "Common during monsoon season"
    ],
    'Snow': [
        "Dress in warm layers! 🧥",
        "Be careful on icy roads in hill stations ⛰️",
        "Great day for hot chocolate! ☕",
        "Northern regions may experience snowfall"
    ],
    'Drizzle': [
        "Light rain expected, carry an umbrella 🌦️",
        "Pleasant weather for a walk",
        "Plants will love this weather 🌿"
    ],
    'Mist': [
        "Low visibility, drive carefully 🚗",
        "Common in northern plains during winter",
        "Beautiful for morning photography 📸"
    ],
    'Haze': [
        "Check AQI levels in metro cities 📊",
        "Limit outdoor activities if sensitive",
        "Wear mask if going out 😷"
    ],
    'default': [
        "Check AQI levels in metro cities",
        "Stay hydrated throughout the day",
        "Dress according to regional climate",
        "Be prepared for sudden weather changes"
    ]
};

// Initialize App
function init() {
    // Initialize DOM elements
    initializeElements();
    
    // Load data and setup
    loadRecentCities();
    setupEventListeners();
    setCurrentDate();
    
    // Pre-populate with Indian cities if no recent searches
    if (appState.recentCities.length === 0) {
        appState.recentCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'];
        saveRecentCities();
    }
    
    // Set random status message
    const statusMessages = [
        "Monitoring Indian weather patterns 🇮🇳",
        "All systems operational ☁️",
        "Ready to forecast! ⚡",
        "Serving all Indian cities 🌆",
        "जय हिन्द! Weather tracking active 🇮🇳"
    ];
    
    if (elements.appStatus) {
        elements.appStatus.textContent = statusMessages[Math.floor(Math.random() * statusMessages.length)];
    }
    
    // Load default city weather after a short delay
    setTimeout(() => {
        fetchWeather(CONFIG.DEFAULT_CITY);
    }, 800);
}

// Initialize all DOM elements
function initializeElements() {
    elements = {
        cityInput: document.getElementById('city-input'),
        searchBtn: document.getElementById('search-btn'),
        locationBtn: document.getElementById('location-btn'),
        recentCitiesDropdown: document.getElementById('recent-cities-dropdown'),
        currentWeather: document.getElementById('current-weather'),
        weatherIcon: document.getElementById('weather-icon'),
        currentTemp: document.getElementById('current-temp'),
        weatherDesc: document.getElementById('weather-desc'),
        locationName: document.getElementById('location-name'),
        currentDate: document.getElementById('current-date'),
        windSpeed: document.getElementById('wind-speed'),
        humidity: document.getElementById('humidity'),
        feelsLike: document.getElementById('feels-like'),
        pressure: document.getElementById('pressure'),
        forecastContainer: document.getElementById('forecast-container'),
        weatherAlert: document.getElementById('weather-alert'),
        weatherTips: document.getElementById('weather-tips'),
        loading: document.getElementById('loading'),
        celsiusBtn: document.getElementById('celsius-btn'),
        fahrenheitBtn: document.getElementById('fahrenheit-btn'),
        lastUpdated: document.getElementById('last-updated'),
        appStatus: document.getElementById('app-status')
    };
    
    //  Check if all elements are found
    Object.keys(elements).forEach(key => {
        if (!elements[key] && key !== 'weatherAlert') {
            console.warn(`Element not found: ${key}`);
        }
    });
}

// Set current date
function setCurrentDate() {
    try {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        if (elements.currentDate) {
            elements.currentDate.textContent = now.toLocaleDateString('en-IN', options);
        }
        if (elements.lastUpdated) {
            elements.lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString('en-IN', {hour: '2-digit', minute:'2-digit'})}`;
        }
    } catch (error) {
        console.error('Error setting date:', error);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Search button
    if (elements.searchBtn && elements.cityInput) {
        elements.searchBtn.addEventListener('click', handleSearch);
        
        // Enter key in input
        elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
        
        // Recent cities dropdown
        elements.cityInput.addEventListener('focus', showRecentCities);
        elements.cityInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (elements.recentCitiesDropdown) {
                    elements.recentCitiesDropdown.classList.add('hidden');
                }
            }, 200);
        });
    }
    
    // Current location button
    if (elements.locationBtn) {
        elements.locationBtn.addEventListener('click', getCurrentLocationWeather);
    }
    
    // Unit toggle buttons
    if (elements.celsiusBtn && elements.fahrenheitBtn) {
        elements.celsiusBtn.addEventListener('click', () => switchTemperatureUnit('celsius'));
        elements.fahrenheitBtn.addEventListener('click', () => switchTemperatureUnit('fahrenheit'));
    }
}

// Handle search
function handleSearch() {
    const city = elements.cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        elements.cityInput.value = '';
        if (elements.recentCitiesDropdown) {
            elements.recentCitiesDropdown.classList.add('hidden');
        }
    } else {
        showError('Please enter a city name');
    }
}
// Current location weather feature

// Get Weather by Current Location
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading(true);
    if (elements.locationBtn) {
        elements.locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
        elements.locationBtn.disabled = true;
    }
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                // Use geocoding to get city name
                const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${CONFIG.API_KEY}`;
                const geoResponse = await fetch(geoUrl);
                
                if (!geoResponse.ok) {
                    throw new Error('Location service error');
                }
                
                const geoData = await geoResponse.json();
                if (geoData.length > 0) {
                    const cityName = geoData[0].name + ', ' + geoData[0].country;
                    fetchWeather(cityName);
                } else {
                    throw new Error('Location not found');
                }
                
            } catch (error) {
                showError('Unable to get your location weather');
                console.error('Geolocation error:', error);
            } finally {
                if (elements.locationBtn) {
                    elements.locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> My Location';
                    elements.locationBtn.disabled = false;
                }
                showLoading(false);
            }
        },
        (error) => {
            showError('Unable to retrieve your location. Please enable location services.');
            console.error('Geolocation permission error:', error);
            if (elements.locationBtn) {
                elements.locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> My Location';
                elements.locationBtn.disabled = false;
            }
            showLoading(false);
        },
        { timeout: 10000 }
    );
}

// Fetch Weather Data
async function fetchWeather(city) {
    showLoading(true);
    appState.currentCity = city;
    
    // Use mock data for testing
    if (CONFIG.USE_MOCK_DATA) {
        await simulateAPIDelay();
        const mockData = generateMockWeatherData(city);
        updateUIWithWeatherData(mockData);
        addToRecentCities(city);
        showLoading(false);
        return;
    }
    
    // Real API call
    try {
        const currentUrl = `${CONFIG.BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${CONFIG.UNITS}&appid=${CONFIG.API_KEY}`;
        console.log('Fetching from:', currentUrl.replace(CONFIG.API_KEY, 'HIDDEN'));
        
        const currentResponse = await fetch(currentUrl);
        
        if (!currentResponse.ok) {
            if (currentResponse.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
            } else if (currentResponse.status === 404) {
                throw new Error(`City "${city}" not found. Check spelling.`);
            } else {
                throw new Error(`API Error: ${currentResponse.status}`);
            }
        }
        
        const currentData = await currentResponse.json();
        
        // Fetch forecast
        const forecastUrl = `${CONFIG.BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${CONFIG.UNITS}&appid=${CONFIG.API_KEY}`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (!forecastResponse.ok) {
            throw new Error('Forecast data unavailable');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Update state and UI
        appState.currentWeather = currentData;
        appState.forecastData = forecastData;
        
        updateUIWithWeatherData({ current: currentData, forecast: forecastData });
        addToRecentCities(city);
        
    } catch (error) {
        console.error('Weather fetch error:', error);
        showError(error.message || `Unable to fetch weather for ${city}`);
        
        // Fallback to mock data on error
        await simulateAPIDelay();
        const mockData = generateMockWeatherData(city);
        updateUIWithWeatherData(mockData);
        addToRecentCities(city);
        
    } finally {
        showLoading(false);
    }
}

// Update UI with weather data
function updateUIWithWeatherData(data) {
    if (data.current) {
        updateCurrentWeather(data.current);
        updateBackground(data.current.weather[0].main);
        checkExtremeTemperatures(data.current.main.temp);
        updateWeatherTips(data.current.weather[0].main);
    }
    
    if (data.forecast) {
        updateForecast(data.forecast);
    }
    
    setCurrentDate();
}

// Update Current Weather Display
function updateCurrentWeather(data) {
    if (!data || !data.main) return;
    
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;
    const weather = data.weather[0];
    const city = `${data.name}, ${data.sys?.country || 'IN'}`;
    
    // Update temperature based on unit
    const displayTemp = appState.temperatureUnit === 'celsius' ? temp : celsiusToFahrenheit(temp);
    const displayFeelsLike = appState.temperatureUnit === 'celsius' ? feelsLike : celsiusToFahrenheit(feelsLike);
    const unitSymbol = appState.temperatureUnit === 'celsius' ? '°C' : '°F';
    
    // Update DOM
    if (elements.currentTemp) elements.currentTemp.textContent = `${displayTemp}${unitSymbol}`;
    if (elements.weatherDesc) elements.weatherDesc.textContent = weather.description;
    if (elements.locationName) elements.locationName.textContent = city;
    if (elements.windSpeed) elements.windSpeed.textContent = `${windSpeed} km/h`;
    if (elements.humidity) elements.humidity.textContent = `${humidity}%`;
    if (elements.feelsLike) elements.feelsLike.textContent = `${displayFeelsLike}${unitSymbol}`;
    if (elements.pressure) elements.pressure.textContent = `${pressure} hPa`;
    
    // Update weather icon
    if (elements.weatherIcon) {
        const iconData = WEATHER_ICONS[weather.icon] || WEATHER_ICONS['01d'];
        elements.weatherIcon.innerHTML = `<i class="${iconData.icon} ${iconData.color} animate-float"></i>`;
    }
    
    // Add temperature color class
    updateTemperatureColor(temp);
}

// Update Forecast Display
function updateForecast(data) {
    if (!elements.forecastContainer || !data.list) return;
    
    // Clear existing forecast
    elements.forecastContainer.innerHTML = '';
    
    // Group forecast by day (next 5 days)
    const dailyForecasts = {};
    const today = new Date().toDateString();
    
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        // Skip today
        if (dayKey === today) return;
        
        if (!dailyForecasts[dayKey]) {
            dailyForecasts[dayKey] = {
                date: date,
                temps: [],
                weather: item.weather[0],
                icon: item.weather[0].icon
            };
        }
        
        dailyForecasts[dayKey].temps.push(item.main.temp);
    });
    
    // Get next 5 unique days
    const forecastDays = Object.values(dailyForecasts).slice(0, 5);
    
    forecastDays.forEach((forecast, index) => {
        const date = forecast.date;
        const dayName = date.toLocaleDateString('en-IN', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        
        const highTemp = Math.round(Math.max(...forecast.temps));
        const lowTemp = Math.round(Math.min(...forecast.temps));
        
        const displayHigh = appState.temperatureUnit === 'celsius' ? highTemp : celsiusToFahrenheit(highTemp);
        const displayLow = appState.temperatureUnit === 'celsius' ? lowTemp : celsiusToFahrenheit(lowTemp);
        
        const iconData = WEATHER_ICONS[forecast.icon] || WEATHER_ICONS['01d'];
        
        const forecastElement = document.createElement('div');
        forecastElement.className = 'forecast-day';
        forecastElement.innerHTML = `
            <div class="day-info">
                <div class="day">${dayName}</div>
                <div class="date">${dateStr}</div>
            </div>
            <div class="weather-icon ${iconData.color}">
                <i class="${iconData.icon}"></i>
            </div>
            <div class="temps">
                <span class="high font-bold">${displayHigh}°</span>
                <span class="low text-gray-500 ml-2">${displayLow}°</span>
            </div>
        `;
        
        elements.forecastContainer.appendChild(forecastElement);
    });
}

// Update Background based on Weather
function updateBackground(weatherCondition) {
    const body = document.body;
    const weatherBg = document.getElementById('weather-bg');
    
    if (!body || !weatherBg) return;
    
    // Reset classes
    body.className = body.className.replace(/weather-bg-\w+/g, '') + ' min-h-screen font-[\'Poppins\'] transition-all duration-500';
    weatherBg.className = 'fixed inset-0 z-0 opacity-30 transition-all duration-1000';
    
    // Add appropriate class for Indian context
    let bgClass = 'weather-bg-sunny';
    
    if (weatherCondition.includes('Rain') || weatherCondition.includes('Drizzle')) {
        bgClass = 'weather-bg-monsoon';
        createRainAnimation();
    } else if (weatherCondition.includes('Cloud')) {
        bgClass = 'weather-bg-cloudy';
    } else if (weatherCondition.includes('Thunderstorm')) {
        bgClass = 'weather-bg-stormy';
    } else if (weatherCondition.includes('Haze') || weatherCondition.includes('Mist') || weatherCondition.includes('Fog') || weatherCondition.includes('Smoke')) {
        bgClass = 'weather-bg-haze';
    } else if (weatherCondition.includes('Clear')) {
        bgClass = 'weather-bg-sunny';
    } else if (weatherCondition.includes('Snow')) {
        bgClass = 'weather-bg-cloudy';
    }
    
    body.classList.add(bgClass);
    
    // Remove rain animation if not rainy
    if (!weatherCondition.includes('Rain') && !weatherCondition.includes('Drizzle')) {
        const rainAnimation = document.querySelector('.rain-animation');
        if (rainAnimation) {
            rainAnimation.remove();
        }
    }
}

// Create rain animation
function createRainAnimation() {
    if (document.querySelector('.rain-animation')) return;
    
    const rain = document.createElement('div');
    rain.className = 'rain-animation fixed inset-0 z-0 pointer-events-none';
    
    for (let i = 0; i < 40; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        rain.appendChild(drop);
    }
    
    document.body.appendChild(rain);
}

// Check for Extreme Temperatures (Indian context)
function checkExtremeTemperatures(tempCelsius) {
    if (!elements.weatherAlert) return;
    
    const temp = appState.temperatureUnit === 'celsius' ? tempCelsius : celsiusToFahrenheit(tempCelsius);
    const unit = appState.temperatureUnit === 'celsius' ? '°C' : '°F';
    
    let alertMessage = '';
    let alertClass = '';
    
    // Adjusted for Indian climate
    if (tempCelsius > 45) {
        alertMessage = `🔥 Extreme Heat Wave! ${temp}${unit}. Avoid going out, stay hydrated.`;
        alertClass = 'alert-hot';
    } else if (tempCelsius > 40) {
        alertMessage = `🌡️ Severe Heat! ${temp}${unit}. Stay indoors during peak hours (12-4 PM).`;
        alertClass = 'alert-hot';
    } else if (tempCelsius > 35) {
        alertMessage = `☀️ Hot Day! ${temp}${unit}. Wear light cotton clothes, use sunscreen.`;
        alertClass = 'alert-hot';
    } else if (tempCelsius < 5) {
        alertMessage = `❄️ Extreme Cold! ${temp}${unit}. Dress in layers, avoid morning fog.`;
        alertClass = 'alert-cold';
    } else if (tempCelsius < 10) {
        alertMessage = `🧥 Chilly! ${temp}${unit}. Wear warm clothes, especially in North India.`;
        alertClass = 'alert-cold';
    }
    
    if (alertMessage) {
        elements.weatherAlert.innerHTML = `
            <div class="alert ${alertClass}">
                <i class="fas fa-exclamation-triangle"></i>
                <span class="text-sm md:text-base">${alertMessage}</span>
            </div>
        `;
        elements.weatherAlert.classList.remove('hidden');
        
        // Auto-hide alert after 15 seconds
        setTimeout(() => {
            elements.weatherAlert.classList.add('hidden');
        }, 15000);
    } else {
        elements.weatherAlert.classList.add('hidden');
    }
}

// Update temperature color
function updateTemperatureColor(tempCelsius) {
    if (!elements.currentTemp) return;
    
    // Remove existing color classes
    const colorClasses = ['temp-hot', 'temp-warm', 'temp-mild', 'temp-cool', 'temp-cold'];
    elements.currentTemp.classList.remove(...colorClasses);
    
    // Add appropriate color class
    if (tempCelsius > 35) {
        elements.currentTemp.classList.add('temp-hot');
    } else if (tempCelsius > 25) {
        elements.currentTemp.classList.add('temp-warm');
    } else if (tempCelsius > 15) {
        elements.currentTemp.classList.add('temp-mild');
    } else if (tempCelsius > 5) {
        elements.currentTemp.classList.add('temp-cool');
    } else {
        elements.currentTemp.classList.add('temp-cold');
    }
}

// Get Indian Seasonal Tips
function getIndianSeasonalTips() {
    const month = new Date().getMonth() + 1;
    const tips = [];
    
    if (month >= 3 && month <= 5) {
        tips.push("Summer: Stay hydrated, avoid midday sun");
        tips.push("Mango season is here! Enjoy local varieties 🥭");
    } else if (month >= 6 && month <= 9) {
        tips.push("Monsoon: Carry umbrella, watch for mosquitoes");
        tips.push("Perfect weather for hot chai and pakoras ☕");
    } else if (month >= 10 && month <= 11) {
        tips.push("Autumn: Pleasant weather for travel ✈️");
        tips.push("Festival season! Diwali, Dussehra 🪔");
    } else {
        tips.push("Winter: Layer up, especially in North India");
        tips.push("Fog may affect travel in some regions");
    }
    
    return tips;
}

// Update Weather Tips
function updateWeatherTips(weatherCondition) {
    if (!elements.weatherTips) return;
    
    const tips = WEATHER_TIPS[weatherCondition] || WEATHER_TIPS['default'];
    const seasonalTips = getIndianSeasonalTips();
    
    // Combine weather and seasonal tips (max 4 tips)
    const allTips = [...tips.slice(0, 2), ...seasonalTips.slice(0, 2)];
    
    elements.weatherTips.innerHTML = allTips.map(tip => `<p class="text-sm">• ${tip}</p>`).join('');
}
// Celsius to Fahrenheit toggle

// Temperature Unit Conversion
function switchTemperatureUnit(unit) {
    if (appState.temperatureUnit === unit) return;
    
    appState.temperatureUnit = unit;
    
    // Update button states
    if (elements.celsiusBtn && elements.fahrenheitBtn) {
        if (unit === 'celsius') {
            elements.celsiusBtn.classList.add('active');
            elements.fahrenheitBtn.classList.remove('active');
        } else {
            elements.fahrenheitBtn.classList.add('active');
            elements.celsiusBtn.classList.remove('active');
        }
    }
    
    // Update temperatures if data exists
    if (appState.currentWeather) {
        updateCurrentWeather(appState.currentWeather);
    }
    
    if (appState.forecastData) {
        updateForecast(appState.forecastData);
    }
}

function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}
// Store recent searched cities

// Recent Cities Management
function loadRecentCities() {
    try {
        const recent = localStorage.getItem('mausamwatch_recent_cities');
        if (recent) {
            appState.recentCities = JSON.parse(recent);
        }
    } catch (error) {
        console.error('Error loading recent cities:', error);
        appState.recentCities = [];
    }
}

function saveRecentCities() {
    try {
        localStorage.setItem('mausamwatch_recent_cities', JSON.stringify(appState.recentCities));
    } catch (error) {
        console.error('Error saving recent cities:', error);
    }
}

function addToRecentCities(city) {
    // Remove if already exists
    appState.recentCities = appState.recentCities.filter(c => c.toLowerCase() !== city.toLowerCase());
    
    // Add to beginning
    appState.recentCities.unshift(city);
    
    // Keep only last 5
    if (appState.recentCities.length > 5) {
        appState.recentCities = appState.recentCities.slice(0, 5);
    }
    
    saveRecentCities();
    updateRecentCitiesDropdown();
}

function updateRecentCitiesDropdown() {
    if (!elements.recentCitiesDropdown) return;
    
    if (appState.recentCities.length === 0) {
        elements.recentCitiesDropdown.innerHTML = `
            <div class="recent-city-item text-gray-500">
                <i class="fas fa-history"></i>
                <span>No recent searches</span>
            </div>
        `;
        return;
    }
    
    elements.recentCitiesDropdown.innerHTML = appState.recentCities.map(city => `
        <div class="recent-city-item" data-city="${city}">
            <i class="fas fa-history"></i>
            <span>${city}</span>
        </div>
    `).join('');
    
    // Add click event to recent cities
    document.querySelectorAll('.recent-city-item[data-city]').forEach(item => {
        item.addEventListener('click', () => {
            const city = item.getAttribute('data-city');
            fetchWeather(city);
            if (elements.recentCitiesDropdown) {
                elements.recentCitiesDropdown.classList.add('hidden');
            }
        });
    });
}

function showRecentCities() {
    if (elements.recentCitiesDropdown && appState.recentCities.length > 0) {
        updateRecentCitiesDropdown();
        elements.recentCitiesDropdown.classList.remove('hidden');
    }
}

// Loading State
function showLoading(show) {
    if (!elements.loading) return;
    
    if (show) {
        elements.loading.classList.remove('hidden');
    } else {
        elements.loading.classList.add('hidden');
    }
}
// Handle invalid input and API errors

// Error Handling
function showError(message) {
    // Create error toast
    const errorToast = document.createElement('div');
    errorToast.className = 'fixed top-6 right-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg z-50 animate-fade-in max-w-sm';
    errorToast.innerHTML = `
        <div class="flex items-start">
            <i class="fas fa-exclamation-circle text-red-500 mr-3 mt-0.5"></i>
            <div class="flex-1">
                <p class="font-medium">Oops!</p>
                <p class="text-sm mt-1">${message}</p>
            </div>
            <button class="ml-2 text-red-400 hover:text-red-600" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorToast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorToast.parentElement) {
            errorToast.remove();
        }
    }, 5000);
}

// Mock data for testing
function generateMockWeatherData(city) {
    const mockCurrent = {
        main: { 
            temp: 24 + Math.floor(Math.random() * 15), 
            feels_like: 26 + Math.floor(Math.random() * 5), 
            humidity: 40 + Math.floor(Math.random() * 40), 
            pressure: 1000 + Math.floor(Math.random() * 20) 
        },
        wind: { speed: 2 + Math.random() * 5 },
        weather: [{ 
            main: ['Clear', 'Clouds', 'Rain', 'Haze'][Math.floor(Math.random() * 4)], 
            description: ['Sunny', 'Partly Cloudy', 'Light Rain', 'Hazy'][Math.floor(Math.random() * 4)],
            icon: '01d'
        }],
        name: city.split(',')[0],
        sys: { country: 'IN' }
    };
    
    const mockForecast = {
        list: Array(8).fill().map((_, i) => ({
            dt: Date.now()/1000 + i*21600,
            main: { temp: 20 + Math.random() * 10 },
            weather: [{ icon: i % 2 ? '01d' : '02d' }]
        }))
    };
    
    return { current: mockCurrent, forecast: mockForecast };
}

function simulateAPIDelay() {
    return new Promise(resolve => setTimeout(resolve, 800));
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);