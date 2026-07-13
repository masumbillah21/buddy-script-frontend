# Appifylab Social Platform Client (Frontend)

This is the React-based frontend client for the Appifylab Social Platform task, supplying a pixel-perfect user interface matching the original designer mockup template, dynamic API integration, full reactions systems, nested comment reply sections, and image fallbacks.

## Tech Stack
* **Framework**: React, React Router
* **Styling**: Vanilla CSS (fully responsive, matches original grid designs)
* **Production Build**: Compiles into `/app/build`, served using Alpine Nginx inside the frontend container.

---

## Key Features & UI Enhancements
1. **Interactive Post Feed**:
   * Displays dynamic lists of posts including text, photos, video controls, and events/articles.
   * Options to filter posts or set public/private visibility on submission.
2. **Reactions System**:
   * **Reactions Popover Picker**: Hovering over the "Like" button on any post or comment displays a floating picker to select a reaction (`Like`, `Love`, `Haha`, `Wow`, `Sad`, `Angry`).
   * Active state labels render matching vector SVGs or text emojis inline, dynamically styled with HSL colors matching the picker state.
3. **Grouped Reactions Modal**:
   * Clicking on any post or comment reaction count badge opens a modal that displays all reacting users.
   * Users are grouped into distinct tabs by reaction type (`All`, `Like`, `Love`, `Haha`, `Wow`, `Sad`, `Angry`) with counters next to each tab name.
4. **Clean Profile Image Fallbacks**:
   * Dynamically renders user avatars from the database.
   * If a user doesn't have an avatar, the system displays a circle with their first name's initial capitalized, styled with a background color dynamically hashed by their name (ensuring consistent user colors).
5. **Indented Nested Replies**:
   * Support for creating nested replies to parent comments.
   * The comment/reply inputs are aligned perfectly with the comment stream and indented by 40px to resolve empty padding gaps.

---

## Media Upload Validation (Client-Side)
To ensure optimal performance and avoid server errors, upload files are validated client-side before dispatching:
* **Images**: Limited to **< 10MB** file size.
* **Videos**: Limited to **< 50MB** file size.

---

## Local Setup & Development

### 1. Build and Run Container
Rebuild the frontend container image and spin it up on the Docker network:
```bash
docker compose up --build -d
```
The React frontend service will be compiled and listen on [http://localhost:3000](http://localhost:3000).

### 2. Port Configuration
* **React App**: Accessible on port `3000` (proxies `/api` requests to port `8000`).
* **API Endpoints**: Routed to backend listening on port `8000`.
