## Transcript Highlights

### 1. Planning the Todo feature before writing any code (Session 2, early)
Before building the Todo widget, I asked Claude to plan it out first instead of jumping straight into code. This made the build go smoothly since we already agreed on how it should work before anything was written.

### 2. Debugging the weather API error through multiple exchanges (Session 2, midway)
The weather widget was showing an error, so I asked Claude to show the root cause, which turned out to be that my API key hadn't activated yet and would take up to 2 hours. I decided to pause that feature and move on rather than wait to continue, which led to it eventually resolving on its own.

### 3. Dark mode landing page bug (Session 3, early)
After turning on dark mode I noticed it was changing the look of the landing page too, which it wasn't supposed to do. Testing it right after building it meant I caught the problem early instead of finding it much later.

### 4. Debugging the Firebase ESLint error chain (Session 3, midway)
I got an ESLint error after setting up Firebase, and fixing it revealed another one. After a few back and forth messages we found the issue was a leftover file from when I copied the Firebase setup code, not the actual file the app was using.

### 5. Noticing that user data wasn't persisting per account (Session 3, near the end)
After adding login I tested the app and saw that data wasn't saving per user, it was still acting like everything was in localStorage. I reported it and we built a fix that automatically saves to the cloud for logged in users and localStorage for guests.
