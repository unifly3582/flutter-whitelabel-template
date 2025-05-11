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
    *   **Billing Plan:** Phone Authentication requires your Firebase project to be on the Blaze (pay-as-you-go) plan for SMS delivery.
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
10. Test the logout button. Click "Logout". Verify the user is logged out, redirected to `/login`, and the Navbar updates accordingly.

### 3. Basic Navigation & Homepage (React Router)

*   **Implemented In:**
    *   `src/App.jsx`: Main router setup using `<BrowserRouter>`, `<Routes>`, `<Route>`.
    *   `src/pages/HomePage.jsx`: A simple placeholder homepage.
    *   `src/components/layout/Navbar.jsx`: Navigation bar with conditional links (Home, Login/Logout, Checkout) based on authentication state. Uses `<Link>` from `react-router-dom`.
    *   `src/components/layout/PageLayout.jsx`: A wrapper component that includes the `Navbar` and provides a consistent layout structure for pages.
    *   `src/components/common/ProtectedRoute.jsx`: A component to protect routes. If a user is not authenticated, they are redirected to `/login`, storing their intended destination to redirect back after login.
    *   `src/pages/LoginPage.jsx`: Updated to use `useNavigate` and `useLocation` to redirect the user after successful login, potentially back to a page they were trying to access before logging in.
*   **Dependencies:** `react-router-dom`
*   **Functionality:**
    *   **Routes Defined:**
        *   `/`: Displays `HomePage.jsx` (within `PageLayout`).
        *   `/login`: Displays `LoginPage.jsx`. If already logged in, redirects to `/`.
        *   `/checkout`: Displays `CheckoutPage.jsx` (within `PageLayout`). This route is protected by `ProtectedRoute`, redirecting to `/login` if the user is not authenticated.
    *   **Navbar:**
        *   Dynamically updates links based on `currentUser` from `AuthContext`.
        *   Provides navigation to Home, Checkout (if logged in), and Login/Logout.
    *   **Protected Routes:**
        *   The `/checkout` route is an example of a protected route. Access is only granted if `currentUser` exists in `AuthContext`.
*   **App Name & Logo in Navbar:**
    *   Currently placeholder text/no logo. These will be made configurable via `theme.js` and `content.js` in a later phase.

**How to Test Navigation:**
1.  Start the app (`npm run dev`).
2.  Open the app at the root URL (`/`). You should see `HomePage` and the `Navbar`.
3.  Navbar should show a "Login" link. Click it; verify it navigates to `/login`.
4.  Attempt to access `/checkout` directly by typing it in the URL bar. You should be redirected to `/login`.
5.  Log in via OTP.
6.  After successful login, you should be redirected (e.g., to `/` or to `/checkout` if that was your last attempted protected route).
7.  The Navbar should update to show "Checkout" and "Logout" links.
8.  Click the "Checkout" link. Verify it navigates to `/checkout`.
9.  Click the "Home" link. Verify it navigates to `/`.
10. Click "Logout". Verify the user is logged out, redirected to `/login`, and the Navbar updates accordingly.

## Phase 2: Generalization & Whitelabeling

The goal of this phase is to make the application template easily configurable for different clients, allowing changes to themes, content, and appearance without deep code modifications.

### Strategy Overview:

*   **Client-Specific Firebase Project:** Each client will utilize their own Firebase project for backend services, data isolation, and billing.
*   **Configuration Files in Codebase:** The template codebase includes dedicated configuration files (`src/config/`) that will be modified for each client before their instance is built and deployed.
    *   `src/config/theme.js`: Defines visual aspects (colors, fonts, logo URL, border radius, etc.).
    *   `src/config/content.js`: Defines text strings, titles, and specific content for UI elements (e.g., app name, homepage headlines).
    *   *(Future) `src/config/layoutConfig.js`: For selecting different pre-defined page layouts.*
    *   *(Future) `src/config/features.js`: To enable/disable certain features.*
*   **Deployment Process (Simplified):** For each new client, the template is cloned, configuration files are updated, client's Firebase environment variables are set, and the customized app is built and deployed to their Firebase Hosting.

### 2.1. Theming & Basic Content Customization

*   **Implemented In:**
    *   `src/config/theme.js`: Stores default theme variables (colors, fonts, logo URL, border radius).
    *   `src/config/content.js`: Stores default text content (appName, homepage texts).
    *   `src/hooks/useThemeApplier.js`: A React hook that reads `themeConfig` and dynamically applies its values as CSS custom properties to the HTML `:root` element on application load.
    *   `src/index.css`: Defines CSS custom properties (e.g., `--color-primary`, `--font-primary`) with fallback default values. The `body` element also gets base styles from these variables.
    *   `tailwind.config.js`: Extended to use these CSS custom properties (e.g., `colors: { primary: 'var(--color-primary)' }`), allowing Tailwind utility classes to reflect the dynamic theme.
    *   `public/index.html`: Updated to include links for web fonts specified in `theme.js` (e.g., Google Fonts).
    *   `src/App.jsx`: Calls `useThemeApplier()` to activate the theme.
    *   `src/components/layout/Navbar.jsx` and `src/pages/HomePage.jsx`: Updated to consume `appName`, `logoUrl`, and text content from `theme.js` and `content.js`. Other components (e.g., buttons in `LoginPage.jsx`) can now use theme-aware Tailwind classes like `bg-primary`.
*   **How it Works:**
    1.  `theme.js` and `content.js` serve as the source of truth for default customizable values.
    2.  `useThemeApplier` hook reads `themeConfig` on app startup.
    3.  The hook sets CSS custom properties (e.g., `--color-primary: # SOMEHEXCODE;`) on the `:root` element.
    4.  Tailwind CSS uses these CSS variables in its configuration, so utility classes like `bg-primary`, `text-text-primary`, `font-primary`, `rounded-lg` adapt to the theme defined in `theme.js`.
    5.  React components directly import and use values from `content.js` for displayable text and `theme.js` for things like the logo URL or specific app name.
*   **Logo:**
    *   A default logo `public/default-logo.png` is used as a placeholder. The `logoUrl` in `theme.js` points to this. For each client, this URL can be updated, or the `default-logo.png` can be replaced with the client's logo before their build.
*   **Fonts:**
    *   Font family strings are defined in `theme.js`.
    *   Corresponding web fonts must be loaded (e.g., via `<link>` tags in `public/index.html` or self-hosted and imported with `@font-face` in CSS).

**To Customize for a New Client (Theme & Content - Current Method):**
1.  **Modify `src/config/theme.js`:**
    *   Update `appName`, `logoUrl` (place new logo in `public/` or use an external URL).
    *   Change `colors` (primary, secondary, accent, background, textPrimary, textSecondary, etc.).
    *   Change `fontFamily` values (ensure the new fonts are linked in `index.html` or otherwise loaded).
    *   Adjust `borderRadius` values if needed.
2.  **Modify `src/config/content.js`:**
    *   Update `appName` (if used for display distinct from `themeConfig.appName`).
    *   Update `homePage.headline`, `homePage.subheadline`, `homePage.ctaButtonText`.
    *   Add/modify other text strings as the application grows.
3.  **Rebuild and deploy the application for that client.**
    *(Note: For true dynamic theming without rebuilds per client using the same codebase, a more advanced setup would be needed, like fetching theme/content from a client-specific Firestore document and applying it. For now, we are customizing at build time for each client deployment).*

### 2.2. Generalizing Frontpage Appearance (Layout Variants)

To allow for more significant variations in the homepage (and potentially other pages) beyond just text and color changes, a system for selecting different layout "variants" has been implemented.

*   **Implemented In:**
    *   `src/config/layoutConfig.js`: A configuration file where specific layout variants can be chosen for different parts of the application. Example: `{ homePageVariant: 'default' }`.
    *   `src/pages/home/`: A new directory created to house different homepage layout components.
        *   `HomePage_Default.jsx`: The original homepage component, now serving as the 'default' variant.
        *   `HomePage_VariantA.jsx`: An example of an alternative homepage layout component with different styling and structure.
    *   `src/App.jsx`:
        *   Modified to use `React.lazy()` for code-splitting different homepage variants. This ensures that only the code for the selected variant is loaded by the client's browser.
        *   Uses a `switch` statement (or similar logic) to read `layoutConfig.homePageVariant` and dynamically select and render the appropriate homepage component.
        *   Wraps the routes in `<Suspense>` to provide a fallback UI (e.g., "Loading page...") while a lazy-loaded component is being fetched.
*   **How it Works:**
    1.  Multiple distinct React components representing different homepage layouts (e.g., `HomePage_Default.jsx`, `HomePage_VariantA.jsx`) are created within `src/pages/home/`.
    2.  `src/config/layoutConfig.js` contains a setting (e.g., `homePageVariant`) that specifies which variant to use by its key (e.g., `'default'`, `'variantA'`).
    3.  The main application router in `App.jsx` reads this configuration value.
    4.  Based on the value, it dynamically imports (using `React.lazy`) and renders the corresponding homepage component.
    5.  Each layout variant component can still pull its specific text content from `content.js` (e.g., `content.js` could have sections for `homePageDefaultContent`, `homePageVariantAContent` if needed, or they can share common content).
*   **Benefits:**
    *   Allows for significantly different "looks and feels" for the homepage for different clients.
    *   Code-splitting improves initial load performance as only the necessary layout code is downloaded.

**To Customize Frontpage Appearance for a New Client (Layout Aspect):**
1.  **Simple Content Change (using existing layout):** Modify relevant texts in `content.js` that are used by the currently active homepage variant (as defined in `layoutConfig.js`).
2.  **Use a Different Pre-defined Layout:**
    *   Ensure the desired alternative layout component (e.g., `HomePage_VariantB.jsx`) exists in `src/pages/home/`.
    *   Ensure `App.jsx` is updated to include this new variant in its `React.lazy` imports and the `switch` statement.
    *   Modify `src/config/layoutConfig.js` to set `homePageVariant` to the key of the desired layout (e.g., `'variantB'`).
    *   Ensure `content.js` has any necessary text content structured for that chosen layout variant (if it uses different content keys).
3.  **Rebuild and deploy the application.**

### 2.3. Backend Settings Generalization (Firebase)

The primary backend for this application template is Firebase. Generalization of backend settings primarily involves ensuring that each client instance of the application connects to its own dedicated Firebase project. This ensures data isolation, independent scaling, and client-specific billing.

*   **Client-Side Firebase Configuration (Frontend):**
    *   The React application (running in the client's browser) is configured with Firebase project details (apiKey, authDomain, projectId, etc.) through environment variables.
    *   These variables are defined in an `.env.local` file (for local development) or directly as environment variables in the deployment environment (e.g., Firebase Hosting environment settings).
    *   All Firebase-related environment variables **must be prefixed with `VITE_`** (e.g., `VITE_FIREBASE_API_KEY`) for Vite to expose them to the client-side bundle.
    *   The `src/firebase.js` file reads these `import.meta.env.VITE_FIREBASE_...` variables to initialize the Firebase app.
    *   **For each new client deployment, these `VITE_FIREBASE_...` environment variables MUST be set to the specific credentials of that client's own Firebase project.**
    *   Refer to the `.env.example` file in the project root for a template of required Firebase environment variables.

*   **Firebase Cloud Functions (If Used in the Future):**
    *   If Cloud Functions are added to the template for backend logic (e.g., payment processing, complex operations):
    ```bash
    # Example: Set an API key for a 'paymentservice'
    firebase functions:config:set paymentservice.apikey="YOUR_CLIENT_SPECIFIC_API_KEY_HERE"
    firebase functions:config:set paymentservice.environment="production" 
    # firebase functions:config:get # To view current function config
    ```
    *   These configurations are then accessed within the Function code (e.g., in Node.js): `functions.config().paymentservice.apikey`.
    *   The template code for Functions should be written to expect these configurations to be present in the environment.
    *   Each client deployment would involve setting these function configurations for *their* Firebase project.

*   **Firebase Security Rules (Firestore, Storage):**
    *   The application template **must include generic but secure default security rules** for Firestore (`firestore.rules`) and Firebase Storage (`storage.rules`, if used).
    *   These rule files should be part of the template's codebase.
    *   During the deployment process for a new client, these security rules are deployed to the client's dedicated Firebase project using the Firebase CLI (`firebase deploy --only firestore:rules` or `firebase deploy --only storage:rules`).
    *   **CRITICAL:**
    *     Review and test security rules thoroughly. Default "test mode" rules (`allow read, write: if true;`) are INSECURE and MUST NOT be used in production.
    *     Start with restrictive rules (deny by default) and explicitly grant access only where necessary (e.g., authenticated users can only read/write their own data).
    *     Example `firestore.rules` starting point (adapt as collections are added):
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Users can only read/update their own user profile document
        match /users/{userId} {
          allow read, update, delete: if request.auth != null && request.auth.uid == userId;
          allow create: if request.auth != null; // Or more specific conditions for signup
        }

        // Example for 'orders' collection
        // Users can create orders for themselves, and only read/update their own orders
        match /orders/{orderId} {
          allow create: if request.auth != null && request.resource.data.userId == request.auth.uid
                          // Add further validation, e.g., required fields, status
                          && request.resource.data.status == 'pending'; 
          allow read, update: if request.auth != null && resource.data.userId == request.auth.uid;
          // Generally, disallow delete for orders; use a status field (e.g., 'cancelled') instead.
          // allow delete: if false; 
        }

        // Add rules for other collections (e.g., products, client_configs) as they are developed.
        // Ensure a default deny for unmatched paths.
      }
    }
    ```

*   **Firebase Indexes (Firestore):**
    *   As the application grows and complex queries are made to Firestore, Firestore might suggest creating composite indexes for performance.
    *   These index definitions are stored in a `firestore.indexes.json` file.
    *   This `firestore.indexes.json` file should also be part of the template codebase.
    *   During client deployment, these indexes are deployed via `firebase deploy --only firestore:indexes`.

**Client Onboarding - Backend Setup Summary:**
1.  A new, dedicated Firebase project is created for the client.
2.  Required Firebase services (Authentication, Firestore, Hosting, Functions if used) are enabled in this client project.
3.  The frontend application is configured with the client's Firebase project SDK keys via environment variables (for the `VITE_FIREBASE_...` settings).
4.  Secure `firestore.rules` (and `storage.rules`) from the template are deployed to the client's Firebase project.
5.  `firestore.indexes.json` (if any) from the template is deployed.
6.  (If using Functions) Any necessary Function environment configurations are set for the client's project.

## Phase 3: Core Feature Enhancement & Deployment Prep

### 3.1. Saving Orders to Firestore

The checkout process has been updated to save order details to Firestore and provide user feedback.

*   **Implemented In:**
    *   `src/pages/CheckoutPage.jsx`:
        *   The `handleSubmitOrder` function is now `async`.
        *   It constructs an `orderData` object containing `userId`, customer details, shipping address (from form data), phone number (from `currentUser`), initial `status: 'pending'`, placeholders for `items` and `totalAmount`, and a Firebase `serverTimestamp()` for `createdAt`.
        *   Uses `addDoc(collection(db, "orders"), orderData)` from the Firebase Firestore SDK to save the new order to an `orders` collection. `addDoc` automatically generates a unique document ID.
        *   Includes a loading state (`isSubmittingOrder`) for the "Place Order" button.
        *   Provides success/error messages to the user on the page or navigates to an order confirmation page.
        *   Basic client-side validation for required fields (name, address, pincode).
    *   `src/pages/OrderConfirmationPage.jsx` (Optional but Recommended):
        *   A new page to display a success message to the user after an order is placed.
        *   Can display the `orderId` if passed via URL parameters.
    *   `src/App.jsx`:
        *   If `OrderConfirmationPage` is implemented, a route (e.g., `/order-confirmation/:orderId`) is added for it, typically as a protected route.
    *   `firestore.rules`:
        *   Updated to include rules for the `orders` collection. These rules typically:
            *   Allow authenticated users to `create` orders for themselves (i.e., `request.resource.data.userId == request.auth.uid`).
            *   Enforce an initial `status` (e.g., 'pending') on creation.
            *   May include validation for the presence of required fields in the order data.
            *   Allow authenticated users to `read` and `update` only their own orders.
            *   Disallow `delete` operations on orders (preferring status changes like 'cancelled').

*   **Firestore Collection:** `orders` (A new top-level collection in Firestore).

*   **User Feedback:**
    *   The "Place Order" button shows a loading/submitting state.
    *   Success or error messages are displayed on the `CheckoutPage`, or the user is navigated to an `OrderConfirmationPage`.

**How to Test Order Saving:**
1.  Ensure your Firestore security rules (`firestore.rules`) have been deployed to your Firebase project (`firebase deploy --only firestore:rules`).
2.  Log in to the application.
3.  Navigate to the `/checkout` page.
4.  Fill in all required form fields.
5.  Click the "Place Order" button.
6.  Observe UI feedback (loading state, messages, or redirection to order confirmation).
7.  Check the Firebase Console -> Firestore Database.
    *   An `orders` collection should now exist (if it's the first order).
    *   A new document should be present in the `orders` collection with an auto-generated ID.
    *   Verify that the document data matches the information you entered, including `userId`, `createdAt` timestamp, and `status: 'pending'`.
8.  If `OrderConfirmationPage` is implemented, verify it displays correctly with the order ID.
9.  Test Firestore security rules by attempting (e.g., through browser console or another tool if possible) to read/write orders that don't belong to the logged-in user, or to create an order with an incorrect `userId`. These attempts should fail.

### 3.3. User Profile & Order History Page

A new page has been added to allow logged-in users to view their basic profile information and their past order history.

*   **Implemented In:**
    *   `src/pages/ProfilePage.jsx`:
        *   Fetches orders from the `orders` Firestore collection specifically for the `currentUser.uid`.
        *   The query filters by `userId` and orders results by `createdAt` timestamp in descending order.
        *   Displays basic user information (phone number, email if available, UID).
        *   Lists the fetched orders in a table format, showing Order ID, Date, Status, and Total Amount (if available in order data).
        *   Includes loading states and error handling for the order fetching process.
    *   `src/App.jsx`:
        *   A new route `/profile` has been added.
        *   This route is protected using `ProtectedRoute` and uses `PageLayout` to include the Navbar.
    *   `src/components/layout/Navbar.jsx`:
        *   A "My Profile" link is added to the navbar, visible only to authenticated users, leading to the `/profile` page.
*   **Firestore Interaction:**
    *   **Query:** Makes a Firestore query to `orders` collection: `query(collection(db, 'orders'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc'))`.
    *   **Index Requirement:** This type of query (filtering on one field, ordering on another) requires a composite index in Firestore.
        *   **Action during setup/testing:** If Firestore throws an error in the browser console stating "The query requires an index..." it will provide a direct link to create the necessary composite index (e.g., on `orders` collection for fields `userId ASC, createdAt DESC`). The developer/admin must create this index via the Firebase Console for the page to function correctly. The `firestore.indexes.json` file can be updated if you want to include this index definition in your template for future deployments, but index creation via console link is usually straightforward for initial setup.
    *   **Security Rules:** The existing Firestore security rules for the `orders` collection (`allow read: if request.auth != null && resource.data.userId == request.auth.uid;`) already permit users to read their own orders.

**How to Test User Profile & Order History:**
1.  Ensure you are logged in.
2.  (If first time testing this feature) Place one or more orders through the Checkout page.
3.  Click the "My Profile" link in the Navbar.
4.  Verify that the Profile page loads and displays your correct user information.
5.  Verify that your previously placed orders are listed in the table. Check if the displayed information (Order ID, Date, Status) is accurate.
6.  (If no orders placed) Verify that a "You haven't placed any orders yet." message is shown.
7.  If you encounter a Firestore error about a missing index, use the link provided in the browser console error message to create the composite index in your Firebase project's Firestore settings. After the index is built (a few minutes), refresh the Profile page.
8.  Log out and attempt to access `/profile` directly. You should be redirected to `/login`.

## Client Deployment Checklist

This checklist outlines the essential steps to configure and deploy a new, customized instance of this whitelabel application for a specific client.

**I. Pre-Deployment Preparations:**

1.  **[ ] Client Consultation & Asset Gathering:**
    *   Obtain client's branding guidelines: Logo (SVG/PNG), primary/secondary/accent colors, preferred fonts.
    *   Gather client-specific content: App name, homepage headline/subheadline/CTA text, any other custom text needed.
    *   Determine if a specific homepage layout variant is required (if multiple are available).

2.  **[ ] Your Template Codebase:**
    *   Ensure your main whitelabel template codebase is up-to-date, stable, and version-controlled (e.g., in your primary Git repository).
    *   Consider creating a new branch in your template repo for this client's initial setup if you anticipate significant template-level changes before merging back, or simply clone/copy the template to a new directory for this client's specific deployment.

**II. Client-Specific Firebase Project Setup:**

3.  **[ ] Create New Firebase Project for Client:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Create a **new Firebase project** dedicated solely to this client (e.g., `clientname-app-prod`).
    *   Record the **Project ID** and other SDK configuration details.
    *   Upgrade this new Firebase project to the **Blaze (pay-as-you-go) plan** to enable features like Phone Authentication.

4.  **[ ] Enable Firebase Services in Client's Project:**
    *   **Authentication:**
        *   Enable the "Phone" sign-in method.
        *   Under "Settings", add `localhost` to **Authorized domains** (for your testing during client setup). Later, Firebase Hosting domains are auto-authorized.
        *   (Optional) Add any specific test phone numbers requested by the client for their UAT.
    *   **Firestore Database:**
        *   Create a Firestore database.
        *   Choose the appropriate region.
        *   Start in **Test Mode** initially *only for setup convenience if absolutely necessary*, but plan to apply secure rules immediately.
    *   **Firebase Hosting:**
        *   "Get started" with Firebase Hosting.
    *   **Cloud Functions (If applicable):**
        *   Ensure Node.js version compatibility if you deploy functions.
    *   **Storage (If applicable):**
        *   Enable Firebase Storage if the client's app will use it.

5.  **[ ] Get Firebase SDK Configuration for Client's Web App:**
    *   In the client's Firebase project settings (General tab), find or add a Web App.
    *   Copy the `firebaseConfig` object (apiKey, authDomain, projectId, etc.).

**III. Codebase Customization & Configuration (for this specific client deployment):**

6.  **[ ] Prepare Client's Codebase Instance:**
    *   If not done in step 2, clone/copy your main template codebase to a new local directory dedicated to this client.
    *   Initialize Git in this new directory if it's a fresh copy not linked to your main template repo, or work on a client-specific branch if preferred.

7.  **[ ] Configure Environment Variables:**
    *   In the client's codebase directory, create/update the `.env.production` (or `.env.local` for testing connection to client's Firebase) file.
    *   Populate it with the **client's specific Firebase SDK configuration values** (from step 5), prefixed with `VITE_FIREBASE_`. Example:
        ```env
        VITE_FIREBASE_API_KEY="CLIENTS_API_KEY"
        VITE_FIREBASE_AUTH_DOMAIN="clients-project-id.firebaseapp.com"
        # ... and all other VITE_FIREBASE_ variables
        ```
    *   *(Note: For Firebase Hosting deployments, these `VITE_` variables can often be set directly in the Hosting environment settings instead of relying on a committed `.env.production` file, which is more secure).*

8.  **[ ] Customize Theme (`src/config/theme.js`):**
    *   Update `appName` (if it's the primary source for display name).
    *   Update `logoUrl` to point to the client's logo (e.g., `/client-logo.png`). Place the client's logo file in the `public/` directory.
    *   Set `colors` (primary, secondary, accent, background, textPrimary, etc.) according to client's branding.
    *   Set `fontFamily` values (ensure the chosen fonts are linked in `public/index.html` or otherwise loaded).
    *   Adjust `borderRadius` or other theme properties as needed.

9.  **[ ] Customize Content (`src/config/content.js`):**
    *   Update `appName` if distinct from `theme.js`.
    *   Update `homePage.headline`, `subheadline`, `ctaButtonText`.
    *   Update any other client-specific text strings throughout the application config.

10. **[ ] Select Layouts (`src/config/layoutConfig.js`):**
    *   If different layout variants are available and desired, update `homePageVariant` (and any other page variants) to the client's preferred layout key.

**IV. Backend Deployment to Client's Firebase Project:**

11. **[ ] Firebase CLI Setup for Client Project:**
    *   Open a terminal in the client's codebase directory.
    *   Log in to Firebase CLI: `firebase login` (ensure you're using an account with access to the client's Firebase project).
    *   Associate the local project with the client's Firebase project: `firebase use --add`, then select the client's Project ID and give it an alias (e.g., `clientname-prod`). Or, if already aliased, `firebase use clientname-prod`.
    *   (Alternatively) Modify `.firebaserc`'s `default` project to the client's project ID for this deployment instance if not using aliases.

12. **[ ] Deploy Firebase Rules:**
    *   Copy/ensure your template's `firestore.rules` and `storage.rules` are in the client's codebase root. **Critically review these rules for security before deploying to a client's production environment.**
    *   Deploy Firestore rules: `firebase deploy --only firestore:rules`
    *   Deploy Storage rules (if using Storage): `firebase deploy --only storage:rules`

13. **[ ] Deploy Firestore Indexes:**
    *   Copy/ensure `firestore.indexes.json` is present.
    *   Deploy indexes: `firebase deploy --only firestore:indexes`

14. **[ ] Deploy Cloud Functions (If applicable):**
    *   If your template uses Cloud Functions:
        *   Navigate to the functions directory (e.g., `cd functions`).
        *   Install dependencies (`npm install`).
        *   Set any client-specific function environment configurations:
            `firebase functions:config:set service.key="CLIENT_KEY" other.setting="VALUE"`
        *   Deploy functions: `firebase deploy --only functions` (from project root, or navigate back with `cd ..`).

**V. Frontend Application Build & Deployment:**

15. **[ ] Install Frontend Dependencies:**
    *   In the client's codebase root, run `npm install` (or `yarn install`).

16. **[ ] Build for Production:**
    *   Run `npm run build`. This will generate the static production assets in the `dist/` folder (or as configured in `firebase.json`'s `hosting.public` and Vite's `build.outDir`).

17. **[ ] Deploy to Firebase Hosting:**
    *   Run `firebase deploy --only hosting`.
    *   Note the Hosting URL provided after deployment.

**VI. Post-Deployment & Testing:**

18. **[ ] Thorough Testing on Client's Instance:**
    *   Access the client's live URL.
    *   Test ALL application features comprehensively:
        *   OTP Login/Logout.
        *   User data creation (if applicable, like profiles).
        *   Checkout process & Order placement.
        *   Verify order data in the client's Firestore.
        *   Confirm theme, logo, and content match client's specifications.
        *   Test on different devices/browsers for responsiveness.
        *   Check all navigation links and protected routes.

19. **[ ] Custom Domain (Optional):**
    *   If the client has a custom domain, configure it in their Firebase Hosting settings.

20. **[ ] Handover & Documentation:**
    *   Provide the client with necessary access or links.
    *   Document any client-specific configurations or operational notes.

This checklist should be treated as a living document and updated as the template application evolves. 