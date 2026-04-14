# Daiflo — AI Summarization Feature

## What It Does

The Notepad widget includes a Summarize button that analyzes the note's content using three coordinated APIs:

OpenAI API streams a summary of the note progressively to the UI as chunks arrive using gpt-4o-mini. In the same prompt, it extracts the single most important named topic from the note (a person, place, technology, event, etc.). If no clear topic exists, the topic step is skipped entirely.
<br>
Wikipedia REST API fetches a short plain-English definition for the extracted topic and displays it as a small card beneath the summary with a link to the full article. If Wikipedia returns a bad result, the card doesn't display under the AI summary.
<br>
Firebase Firestore caches the full result (summary + Wikipedia card) keyed by a content hash of the note body. For logged-in users the cache lives in Firestore, and for guests it falls back to localStorage. Cache expires after 24 hours, and a cache hit skips both OpenAI and Wikipedia entirely.

---

## APIs / Services Used

- OpenAI API: summarization and topic extraction with streaming through gpt-4o-mini <br>
- Wikipedia REST API — topic definitions <br>
- Firebase Firestore — persistent summary cache <br>

---

## How to Run / Set up instructions

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

--

# Running API in Daiflo
To run the AI Summarization feature in Dailo, simply create a new note and then press the "Summarize" button to run the process. Here is an example note to test out full functionality of the feature:

- Title: CRISPER Notes <br>
- Body: Watched a lecture today about using CRISPR in treating sickle cell disease. The researcher mentioned they were able to edit the BCL11A gene to reactivate fetal hemoglobin production, essentially bypassing the defective adult hemoglobin. What's interesting is that this doesn't fully cure the disease but manages it — patients still need to monitor for complications. The trial results showed that around 90% of patients had no severe pain crises after treatment. Cost is still a massive barrier, estimated at $2 million per patient. Need to look into whether insurance covers any of this and what the regulatory timeline looks like for wider approval.
