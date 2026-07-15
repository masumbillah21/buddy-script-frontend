# Appifylab Social Platform Client (Frontend)

This is the React-based frontend client for the Appifylab Social Platform, supplying a pixel-perfect user interface matching the original designer mockup template, dynamic API integration, full reactions systems, nested comment reply sections, and image fallbacks.

---

## 🌐 Production & Live Deployment Links

* **Live Web Application**: [http://buddy-script.masum-billah.com/](http://buddy-script.masum-billah.com/)
* **Live API Backend**: [http://buddy-api.masum-billah.com/](http://buddy-api.masum-billah.com/)
* **Interactive API Documentation**: [http://buddy-api.masum-billah.com/api/documentation](http://buddy-api.masum-billah.com/api/documentation)

---

## Tech Stack
* **Framework**: React 18, React Router 6
* **Styling**: Vanilla CSS (fully responsive matching design mockup grid systems)
* **CI/CD Pipeline**: GitHub Actions build & SSH SCP automated deployment to Namecheap Shared Hosting

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

### 1. Build and Run Local Server
```bash
npm install
npm start
```
The React frontend service will listen on [http://localhost:3000](http://localhost:3000).
