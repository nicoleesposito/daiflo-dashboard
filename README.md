# Daiflo

## Project Description
Daiflo is a personal productivity dashboard that brings essential daily tools into one place. Users can check the weather, manage a to-do list, read the latest news, and write notes all from a single interface. The app supports both guest mode with localStorage and full account login with cloud data sync through Firebase.

---

## Technologies Used
- React <br>
- Vite <br>
- Firebase Authentication <br>
- Firebase Firestore <br>
- OpenWeatherMap API <br>
- RSS2JSON API <br>
- CSS3 <br>

---

## Setup Instructions
1. Clone the repository <br>
2. Run "npm install" <br>
3. Create a ".env" file in the project root and add values for the following variables: <br>
- VITE_FIREBASE_API_KEY <br>
- VITE_FIREBASE_AUTH_DOMAIN <br>
- VITE_FIREBASE_PROJECT_ID <br>
- VITE_FIREBASE_STORAGE_BUCKET <br>
- VITE_FIREBASE_MESSAGING_SENDER_ID <br>
- VITE_FIREBASE_APP_ID <br>
- VITE_WEATHER_API_KEY <br>

4. Run "npm run dev" to start the development server <br>

---

## Architecture Overview

### Frontend
- React and Vite app with state-based navigation
- "AuthProvider" manages Firebase auth state across the app
- "PreferencesProvider" manages dark mode toggle and persistence
- The "useStoredData" hook routes widget data to Firestore for logged-in users and localStorage for guests
- Weather data is fetched from the OpenWeatherMap API
- News feed is fetched from the RSS2JSON API

### Backend
- Firebase Authentication handles sign up, login, and session persistence
- Firebase Firestore stores per-user data
- Firebase is called directly from the browser through the Firebase JS SDK
- Hosted on Netlify with Firebase credentials supplied as environment variables

### Database Structure

Firestore stores one document per user under "users/{uid}" with the following fields:

- "firstName" - account first name
- "lastName" - account last name
- "zip" - weather widget zip code
- "tempUnit" - temperature unit, either "F" or "C"
- "newsCategory" - selected news category (e.g. "technology")
- "todos" - array of to-do items "{ id, text, done }"
- "notes" - array of notes "{ id, title, body }"

Guest users have no Firestore document. Their data is stored in localStorage.

---

## Known Bugs & Limitations
- The weather widget only supports US zip codes. <br>
- New OpenWeatherMap API keys can take up to 2 hours to activate, so the weather widget will show an error until the key is live. <br>
- Dark mode does not apply to the landing page by design, but the toggle state still persists across sessions. <br>

---

## What I Learned
Working with AI as a development tool taught me that the quality of what gets built depends a lot on how clearly you can describe what you want before any code is written. I got better results by planning features out loud first and only asking for code once the approach was agreed on. I also learned that testing each feature right after it was built was important because a few bugs only showed up when the features were used together, like dark mode affecting pages it wasn't supposed to, or user data not switching to the cloud after login. The biggest shift was learning to treat AI output as a starting point rather than a finished answer, which meant actually reading and testing what was generated instead of just moving on.
