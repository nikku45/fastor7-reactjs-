# Fastor7 React Assessment --- Implementation Brief

## Product direction: Foodly --- warm, editorial restaurant discovery

**Purpose:** Build a polished React app from the supplied Postman
collection. The Figma file is inaccessible and API requests cannot
currently be sent from the candidate's Postman environment. This
document defines an independent UI direction and implementation plan,
while marking unknown API details for verification.

> Important: This is a proposed design, not a confirmed reproduction of
> the unavailable Figma. Do not invent backend response fields. Verify
> the real response schema when API access becomes available.

## 1. What the screenshots confirm

Base URL: `https://staging.fastor.ai`

### Register / request OTP

-   Method: `POST`
-   URL: `https://staging.fastor.ai/v1/pwa/user/register`
-   Body: `x-www-form-urlencoded`
-   Fields: `phone`, `dial_code` (screenshot shows `+91`)
-   Likely starts phone registration/OTP flow. Exact response is
    unknown.

### Login with OTP

-   Method: `POST`
-   URL: `https://staging.fastor.ai/v1/pwa/user/login`
-   Body: `x-www-form-urlencoded`
-   Fields: `phone`, `otp`, `dial_code`
-   Screenshot note says JWT is at `response.data.token`.
-   `123456` is shown as a default/test OTP; use only as a staging test
    value if accepted by the API.

### Fetch restaurants

-   Method: `GET`
-   URL shown: `https://staging.fastor.ai/v1/m/restaurant?city_id=118`
-   Query parameter: `city_id=118`
-   Screenshot note says JWT is required.
-   Exact authorization format, response schema, image fields,
    pagination and filters are unverified. Check the Postman
    Authorization/Headers tabs if possible.

## 2. UI direction

**Product concept:** Foodly --- Discover Great Food Near You.

Use a premium food-editorial style, not a generic blue dashboard: - Warm
ivory background `#F7F3EB` - Deep forest green primary `#123C32` -
Tangerine accent `#F97316` - Near-black text `#1F2925` - Muted sage
surfaces `#E6ECE4` - Food photography, clean typography, subtle borders
and shadows - Spacious layout; mobile-first but polished on desktop -
Avoid excessive gradients, neon colors, oversized pill controls and
unnecessary animation

### Proposed screens

These are provisional because Figma is unavailable. Build only what the
assessment requires.

1.  **Phone login:** brand mark, country code (default `+91`), phone
    input, validation, Continue button, loading/error states.
2.  **OTP verification:** masked phone number, six-digit OTP input,
    Verify button, error/loading state. Add resend only if the API
    supports it.
3.  **Restaurant discovery:** header/location label, restaurant cards,
    loading skeletons, empty state, retryable error state. Use
    `city_id=118` as shown in the collection.
4.  **Optional details view:** only if the task or data supports it. No
    detail endpoint is shown in the screenshots.

Search, cuisine chips, favorites, ratings and prices must not be
presented as real functionality/data unless the API or task supports
them. Visual-only controls should not mislead users.

### Responsive behaviour

-   Mobile: one-column restaurant list and touch-friendly controls.
-   Tablet: wider content container and comfortable card layout.
-   Desktop: centered max-width layout; optional two-column arrangement
    if useful.
-   Include visible focus states, labels and accessible contrast.

## 3. Recommended stack

Use the existing repo's stack if one exists. If starting from scratch: -
React + Vite - React Router if multiple screens are required - Axios or
native `fetch` - React Context for auth state - CSS Modules or global
CSS design tokens; Tailwind is fine if already installed -
`lucide-react` if icons are needed

Keep dependencies small. Inspect `package.json` before changing
anything.

## 4. Suggested folder structure

``` text
fastor-react-task/
├── src/
│   ├── api/
│   │   ├── client.js
│   │   ├── auth.js
│   │   └── restaurants.js
│   ├── components/
│   │   ├── AppHeader.jsx
│   │   ├── FormField.jsx
│   │   ├── RestaurantCard.jsx
│   │   ├── RestaurantList.jsx
│   │   ├── LoadingState.jsx
│   │   ├── EmptyState.jsx
│   │   └── ErrorState.jsx
│   ├── context/AuthContext.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── OtpPage.jsx
│   │   └── RestaurantsPage.jsx
│   ├── routes/ProtectedRoute.jsx
│   ├── styles/tokens.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

Adjust to the actual repository; do not overwrite unrelated files.

## 5. API integration

### Environment

For Vite, local `.env`:

``` env
VITE_API_BASE_URL=https://staging.fastor.ai
```

Commit `.env.example`, not tokens or secrets. `VITE_` variables are
public in the browser.

### Register

`POST ${BASE_URL}/v1/pwa/user/register`

Use URL-encoded form data, not JSON:

``` js
const body = new URLSearchParams({ phone, dial_code: dialCode });
const response = await fetch(`${BASE_URL}/v1/pwa/user/register`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body,
});
```

Check `response.ok`, parse the response safely, and proceed to OTP only
if the API indicates success. The success/error schema is unknown.

### Login

`POST ${BASE_URL}/v1/pwa/user/login`

``` js
const body = new URLSearchParams({ phone, otp, dial_code: dialCode });
const response = await fetch(`${BASE_URL}/v1/pwa/user/login`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body,
});
```

The collection note says the JWT is at `response.data.token`. Confirm
the actual parsed JSON shape before implementing the final extraction.
Handle non-2xx responses and missing tokens.

### Fetch restaurants

`GET ${BASE_URL}/v1/m/restaurant?city_id=118`

``` js
const response = await fetch(
  `${BASE_URL}/v1/m/restaurant?city_id=118`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  }
);
```

-   Verify the expected Authorization format from the collection; do not
    assume `Bearer` if the collection specifies something else.
-   Check `response.ok`.
-   Treat the response schema as unknown until a successful response is
    available.
-   Add a small adapter/normalizer after the real fields are known.
-   Do not fabricate restaurant names, ratings, prices or image URLs and
    show them as live data.
-   If API access is blocked, use clearly labelled mock data during UI
    development and keep it isolated in the API layer.

## 6. Authentication flow

1.  Validate phone number locally.
2.  Submit register request with URL-encoded form fields.
3.  On confirmed success, show OTP screen.
4.  Submit OTP login request.
5.  Read JWT from the confirmed response shape.
6.  Keep token in session state; `sessionStorage` is a simple assessment
    option but is less secure than an HttpOnly cookie.
7.  Fetch restaurant list with the token.
8.  On 401/403, show a useful message and return to login if
    appropriate.
9.  Never log OTPs, tokens or phone numbers.
10. Do not fake a resend OTP flow without a corresponding API.

## 7. Component responsibilities

-   `LoginPage`: phone/dial code, validation, request OTP and
    error/loading state.
-   `OtpPage`: OTP input, submit, error/loading state.
-   `RestaurantsPage`: fetch request and success/loading/empty/error UI.
-   `RestaurantCard`: display fields mapped from the real API response;
    fallback for missing images.
-   `RestaurantList`: render cards and list layout.
-   `LoadingState`: skeleton cards matching the final layout.
-   `EmptyState`: explain no results and offer retry where useful.
-   `ErrorState`: friendly message and retry.
-   `api/client.js`: base URL and common error handling.
-   `AuthContext`: token and auth state.

Keep components focused and avoid one giant page component.

## 8. Edge cases to handle

-   Empty/invalid phone number
-   Register request failure
-   Invalid OTP or login failure
-   Success response missing token
-   Restaurant request without token
-   Expired/invalid token (401/403)
-   Network/CORS failure
-   Malformed/unexpected JSON
-   Empty restaurant array
-   Missing optional restaurant image/name
-   Prevent duplicate submissions while loading
-   Retry failed requests without refreshing the whole app

Show safe API error messages where available; never expose stack traces.

## 9. Design tokens

``` css
:root {
  --color-bg: #F7F3EB;
  --color-surface: #FFFEFA;
  --color-primary: #123C32;
  --color-accent: #F97316;
  --color-text: #1F2925;
  --color-muted: #6F7972;
  --color-border: #E4E0D7;
  --color-sage: #E6ECE4;
  --radius-card: 18px;
  --radius-control: 12px;
  --shadow-card: 0 8px 24px rgba(31, 41, 37, 0.07);
}
```

Design rules: - Use an 8px spacing rhythm. - Let food imagery provide
visual interest instead of decorative gradients. - Keep clear
primary/secondary button hierarchy. - Aim for 44px or larger touch
targets. - Use proper icons rather than emoji as UI icons. - Use alt
text for informative images and respect reduced-motion settings.

## 10. Implementation sequence

### Phase A --- inspect

1.  Inspect repository and package scripts.
2.  Confirm whether the app already exists or needs scaffolding.
3.  Set up design tokens and API client.
4.  Confirm app starts.

### Phase B --- API layer

1.  Implement register/login helpers.
2.  Implement restaurant fetch helper.
3.  Add safe error handling.
4.  If API access is blocked, add clearly labelled mock mode without
    removing the real API path.

### Phase C --- UI

1.  Build phone login.
2.  Build OTP verification.
3.  Build restaurant list and cards.
4.  Add loading, empty and error states.
5.  Verify mobile and desktop layouts.

### Phase D --- verify

1.  Run from a clean terminal.
2.  Test invalid phone, failed OTP, missing token, API error and empty
    list.
3.  Confirm `city_id=118` and expected auth header.
4.  Map real response fields once access is available.
5.  Check browser console and terminal.
6.  Confirm README commands work.

## 11. Acceptance checklist

-   [ ] App installs and starts using documented commands.
-   [ ] Visual design is coherent, polished and responsive.
-   [ ] Register uses URL-encoded `phone` and `dial_code`.
-   [ ] Login uses URL-encoded `phone`, `otp`, and `dial_code`.
-   [ ] JWT extraction follows the actual response shape.
-   [ ] Restaurant fetch calls `/v1/m/restaurant?city_id=118`.
-   [ ] Authorization format is confirmed from Postman config.
-   [ ] Cards display actual API fields, not invented data.
-   [ ] Loading, empty and error states work.
-   [ ] No tokens/secrets are committed.
-   [ ] README and `.env.example` are included.
-   [ ] Mock mode is clearly labelled and replaceable.

## 12. Current blockers and assumptions

1.  **Figma unavailable:** this is an independent design direction, not
    pixel-perfect reproduction.
2.  **Requests cannot be sent:** endpoint paths and form fields are
    taken from screenshots; response schemas and live behaviour are
    unverified.
3.  **Restaurant schema unknown:** don't finalize field mapping until a
    response is available.
4.  **OTP behaviour unknown:** `123456` is shown as a default/test
    value; verify it works in staging.
5.  **Scope unknown:** implement the three shown APIs first. Add search,
    categories, favorites, details or bottom navigation only if the task
    requires them or time remains.

## 13. README summary

"Foodly is a responsive restaurant discovery React application built for
the Fastor7 assessment. It integrates the provided phone registration,
OTP login and authenticated restaurant-list APIs. It includes reusable
restaurant cards and loading, empty and error states. API response
mapping follows the actual staging response contract; any local mock
mode is explicitly identified."

## Final instruction for the coding agent

Start by inspecting the existing repository and package scripts. Do not
overwrite existing work. Implement the API layer before screens, use
endpoint/body details above, and isolate uncertain response mapping. If
APIs cannot be reached, finish the UI using clearly labelled mock data
and report exactly what could not be verified. Never claim successful
live integration without a successful real response.
