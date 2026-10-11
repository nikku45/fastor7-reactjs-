# Foodly — Curated Restaurant Discovery

> **Fastor7 React Assessment**  
> Editorial, warm culinary discovery web application integrating Fastor7 staging APIs.

---

## 🍽️ Overview

**Foodly** is an editorial restaurant discovery application built with modern React 19 and Vite. Rejecting generic corporate dashboard aesthetics, Foodly implements a warm, tactile gastronomic design system inspired by Michelin Guide, Kinfolk, and Resy:
- **Warm Ivory Background:** `#F7F3EB`
- **Deep British Racing Green:** `#123C32`
- **Tangerine Accent:** `#F97316`
- **Pearly Surface Cards:** `#FFFEFA`
- **Muted Sage Details:** `#E6ECE4`
- **Modern Editorial Typography:** *Playfair Display* & *Plus Jakarta Sans*

---

## 🚀 Live API Integration Details

The app integrates with the live Fastor7 Staging backend:

| Action | Method | Staging Endpoint | Request Body / Headers | Verified Response Shape |
| :--- | :--- | :--- | :--- | :--- |
| **Request OTP** | `POST` | `/v1/pwa/user/register` | `x-www-form-urlencoded`<br>`phone`, `dial_code` | `{"status":"Success","status_code":200,"data":"otp sent"}` |
| **Verify OTP** | `POST` | `/v1/pwa/user/login` | `x-www-form-urlencoded`<br>`phone`, `otp`, `dial_code` | `{"status":"Success","data":{"token":"eyJ...", "user_name":"..."}}` |
| **Fetch Restaurants**| `GET` | `/v1/m/restaurant?city_id=118&page={page}` | `Authorization: Bearer <token>` | `{"status":"Success","data":{"results":[...], "meta":{"total_pages":3,"total_count":56}}}` |

### Verified Test Credentials
- **Phone:** `9999999999` (with Dial Code `+91`)
- **Staging OTP:** `123456`
- **City ID:** `118`

> 💡 **Quick Test Features:** One-click helpers are built directly into the UI ("Fill Fastor Test Number" & "Use Staging Default OTP") so evaluators can test the complete live flow in seconds.

---

## 📱 Mobile & Desktop Responsive Design

1. **Mobile Experience (360px – 480px):**
   - Single column card stack with 48px+ touch targets.
   - 6-digit individual numeric keypad boxes with auto-focus and backspace retreat.
   - Sticky header with location badge and city context.
2. **Desktop Experience (1024px+):**
   - Responsive multi-column editorial grid (2-column on tablet, 3-column on desktop).
   - Real-time client search, category filters, and sorting.
   - Built-in **Device Simulator Toggle** (top right icon) to switch between full desktop and mobile frame preview (iPhone frame) without resizing your browser window!
3. **Restaurant Detail Modal / Bottom Sheet:**
   - Full venue address, open hours, cuisine highlights, and table reservation CTA.

---

## 🛠️ Project Setup & Commands

### Prerequisites
- Node.js 18+ (tested on Node 20 / 22)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
A `.env.example` file is included in the project:
```bash
# .env
VITE_API_BASE_URL=https://staging.fastor.ai
```

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🛡️ Edge Cases & Resilience Handled

- **Individual 6-Digit OTP Box Input:** Full keyboard navigation, auto-focus transition, backspace rollback, and clipboard paste handling (pasting `123456` fills all 6 inputs automatically).
- **Session Persistence:** Authenticated session tokens are preserved in `sessionStorage` and restored on page refresh.
- **Graceful Image Fallback:** High-resolution food photography fallback if a restaurant's S3 logo is unavailable or broken.
- **Live Staging & Demo Mode Toggle:** Evaluators can toggle anytime between live staging and offline demo mode.
- **Pagination Support:** Seamless pagination over the 56 venues returned across 3 pages in City 118.
- **Loading, Empty, & Error States:** Complete skeleton shimmering animations, zero-result search resets, and retryable error cards.

---

## 📂 Architecture

```
src/
├── api/
│   ├── client.js          # Base API client, timeout, and error parsing
│   ├── auth.js            # Register & Login endpoint handlers
│   ├── restaurants.js     # Authenticated restaurant fetch & normalizer
│   └── mockData.js        # High-fidelity fallback dataset
├── components/
│   ├── AppHeader.jsx      # Sticky brand bar, city label, and preview toggles
│   ├── FormField.jsx      # Accessible form control wrapper
│   ├── OtpInput.jsx       # 6-box input with paste & arrow navigation
│   ├── RestaurantCard.jsx # Editorial card with verified API fields & favorites
│   ├── RestaurantDetailModal.jsx # Detail sheet with venue highlights & reserve CTA
│   ├── LoadingState.jsx   # Shimmer skeleton loader
│   ├── EmptyState.jsx     # Friendly zero-results illustration & reset
│   └── ErrorState.jsx     # Retryable error boundary state
├── context/
│   └── AuthContext.jsx    # Session, token, step navigation & mock switcher
├── pages/
│   ├── LoginPage.jsx      # Mobile input & dial code picker
│   ├── OtpPage.jsx        # Passcode verification & resend timer
│   └── RestaurantsPage.jsx# Discovery hero, search, filters & cards
├── styles/
│   ├── tokens.css         # Specified design tokens & color variables
│   └── app.css            # Responsive layout & component design system
├── App.jsx                # Step routing & responsive simulator shell
└── main.jsx               # Entry point
```
