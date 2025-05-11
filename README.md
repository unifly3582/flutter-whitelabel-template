# [Your Project Name] - Whitelabel SaaS Template

This project is a template for a whitelabel SaaS application (website + app).
It's designed to be configurable for different clients, allowing changes to theme, fonts, and frontpage appearance.

## Tech Stack

*   **Frontend:** React (using Vite)
*   **Styling:** Tailwind CSS
*   **Backend & PaaS:** Firebase
    *   Firebase Authentication (OTP Login)
    *   Firestore (Database)
    *   Firebase Hosting (Web Deployment)
    *   Firebase Cloud Functions (Server-side Logic)
*   **Version Control:** Git
*   **Repository:** [Link to your GitHub/GitLab repo]
*   **Development Assistance:** Cursor.ai

## Project Goal

To create a generalized source code and backend setup that can be sold and customized for multiple clients.

## Firebase Setup

This project uses Firebase for its backend services including Authentication and Firestore Database.

### Configuration

Firebase project configuration details are stored in environment variables.

1. **.env.local (DO NOT COMMIT)**: This file holds the actual Firebase API keys and project details for your local development environment. Create this file in the project root and populate it with your Firebase project credentials:
   ```env
   VITE_FIREBASE_API_KEY="YOUR_API_KEY"
   VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
   VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
   VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
   VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
   VITE_FIREBASE_APP_ID="YOUR_APP_ID"
   VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional
   ```
   *Note: The `VITE_` prefix is required by Vite to expose these variables to the client-side application.*

2. **.env.example (Commit this file)**: This file serves as a template showing the required environment variables. Copy this file to `.env.local` and fill in your actual credentials for local development:
   ```env
   VITE_FIREBASE_API_KEY="YOUR_API_KEY_HERE"
   VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN_HERE"
   VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID_HERE"
   VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET_HERE"
   VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID_HERE"
   VITE_FIREBASE_APP_ID="YOUR_APP_ID_HERE"
   VITE_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID_HERE" # Optional
   ```

### Initialization

The Firebase app is initialized in `src/firebase.js`. This file imports the necessary Firebase SDKs and exports initialized instances of services like Auth and Firestore.

```javascript
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, // Optional
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app);

export default app;
```

## Project Structure (Frontend - src/)

- `src/assets/`: Static assets like images and fonts.
- `src/components/`: Reusable UI components.
  - `components/common/`: Very generic components (e.g., Button, InputField).
  - `components/layout/`: Structural components (e.g., Navbar, Footer).
- `src/config/`: Client-specific configuration (themes, content).
- `src/contexts/`: React Context providers (e.g., AuthContext).
- `src/hooks/`: Custom React hooks (e.g., useAuth).
- `src/pages/`: Top-level page components (e.g., HomePage, LoginPage).
- `src/services/`: Modules for Firebase interactions or API calls.
- `src/utils/`: Utility functions and helpers.
- `src/routes/`: Route definitions (e.g., using React Router).
- `src/firebase.js`: Firebase initialization and exports.
- `src/main.jsx`: App entry point.
- `src/index.css`: Global styles and Tailwind imports.

## Core Features

### 1. OTP Login (Firebase Authentication)

*   **Implemented In:**
    *   `src/contexts/AuthContext.jsx`: Provides global authentication state (`currentUser`, `loading`, `logout` function) using React Context and Firebase's `onAuthStateChanged`.
    *   `src/pages/LoginPage.jsx`: Contains the UI and logic for phone number input, reCAPTCHA verification, sending OTP, and verifying OTP using Firebase Authentication.
    *   `src/main.jsx`: Wraps the root `<App />` component with `<AuthProvider>` to make auth state available globally.
    *   `src/App.jsx`: (Temporarily) Renders `LoginPage` for testing.
*   **Functionality:**
    *   User enters their phone number (country code recommended).
    *   An invisible reCAPTCHA (`RecaptchaVerifier`) is initialized and displayed (usually as a badge or can be truly invisible if configured for background verification flow).
    *   `signInWithPhoneNumber(auth, phoneNumber, appVerifier)` is called to send an OTP to the user's phone.
    *   User receives the OTP, enters it into an input field.
    *   The `confirmationResult.confirm(otp)` method is called to verify the OTP.
    *   Upon successful verification, the user's session is established, and `currentUser` in `AuthContext` is updated.
    *   Handles loading states and displays errors.
*   **Firebase Setup (Authentication > Sign-in method):**
    *   Ensure the "Phone" sign-in provider is **enabled** in your Firebase project.
    *   **Authorized Domains:** For local development with reCAPTCHA, ensure `localhost` is added to the authorized domains list in Firebase Console (Authentication -> Settings -> Authorized domains).
    *   **Test Phone Numbers:** To avoid SMS costs and for easier testing during development, add test phone numbers and their corresponding OTPs in the Firebase Console (Authentication -> Settings -> Phone numbers for testing). For example, phone: `+11234567890`, OTP: `123456`.
    *   The `div` with `id="recaptcha-container"` in `LoginPage.jsx` is crucial for the `RecaptchaVerifier` to work.

**How to Test OTP Login:**
1.  Ensure your Firebase project has Phone Auth enabled and (optionally) test phone numbers configured.
2.  Ensure `localhost` is an authorized domain for Firebase Auth.
3.  Start the development server (`npm run dev`).
4.  Open the application in your browser. You should see the Login Page.
5.  Enter a test phone number (including country code, e.g., `+11234567890`).
6.  Click "Send OTP". The reCAPTCHA should process (you might see a badge or brief challenge if not fully invisible).
    *   Check browser console for any errors if OTP sending fails. Common issues include misconfigured authorized domains or incorrect phone number format.
7.  If OTP sending is successful, an OTP input field will appear. Enter the test OTP (e.g., `123456`).
8.  Click "Verify OTP".
9.  Upon successful verification, the page should update (e.g., show a welcome message or your user's phone number from `currentUser` in `App.jsx`), and you should see a success message/user object in the console.
10. Test the logout button. 