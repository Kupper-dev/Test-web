# Barba.js Testing & Verification Guide

This guide is for the incoming LLM model to set up, test, and verify Barba.js page transitions in this repository using the Chrome DevTools MCP server.

---

## 1. Prerequisites / Verification Setup

1. **Verify Sandbox is Running**:
   - The Vite dev server runs locally at `http://localhost:5174/`.
   - Ensure the server is active. If not, start it using:
     ```bash
     npm run dev
     ```

2. **Select Page Context in Chrome DevTools**:
   - Call the `list_pages` tool to list open pages:
     ```json
     {
       "ServerName": "chrome-devtools",
       "ToolName": "list_pages",
       "Arguments": {}
     }
     ```
   - Identify the tab for `http://localhost:5174/` or `Kupper Sandbox`.
   - Select it as context using `select_page` (providing the correct numeric `pageId` from the list):
     ```json
     {
       "ServerName": "chrome-devtools",
       "ToolName": "select_page",
       "Arguments": {
         "pageId": 1
       }
     }
     ```

---

## 2. Testing Steps for Barba.js Page Transitions

### Step 1: Take an Initial Snapshot & Visual Capture
- Run `take_snapshot` to list elements and locate the **"Explore About Page"** link (`class="cta-button"`, `href="/about.html"`).
- Notice its unique `uid` (e.g. `20.1`).
- Optional: Take a screenshot (`take_screenshot`) to verify the starting state on the home page.

### Step 2: Trigger Page Transition
- Click the CTA button using the element's `uid`:
  ```json
  {
    "ServerName": "chrome-devtools",
    "ToolName": "click",
    "Arguments": {
      "uid": "CTA_BUTTON_UID_HERE"
    }
  }
  ```

### Step 3: Monitor Transition Sequence
- **Expected Transition Behaviors**:
  1. The navigation menu closes (if it was active).
  2. The black screen transition wipe `.transition` fades in (visibility/opacity transition via GSAP).
  3. The page URL changes to `http://localhost:5174/about.html` (verify using `list_pages`).
  4. The page scrolls smoothly back to the top.
  5. The transition wipe `.transition` fades out to reveal the About page content.

### Step 4: Verify Post-Transition State
- Call `list_pages` again to ensure the browser successfully navigated to `/about.html` without a full browser reload.
- Check the console logs using `list_console_messages` to verify that there are no JS errors thrown by Barba.js, Lenis, or GSAP:
  ```json
  {
    "ServerName": "chrome-devtools",
    "ToolName": "list_console_messages",
    "Arguments": {}
  }
  ```
- Take a new snapshot using `take_snapshot` and visually verify using `take_screenshot` that the About page content is correctly rendered and the persistent navbar is intact.

---

## 3. Key Transition Code Reference

The transition lifecycle and GSAP wipe animation timeline is defined in [src/main.js](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/main.js#L123-L193):
- **`leave`**: Closes navigation capsule and fades in `.transition`.
- **`beforeEnter`**: Updates navigation element attributes marked with `data-barba-update`.
- **`enter`**: Resets scroll to top via `lenis.scrollTo(0, { immediate: true })`, updates Lenis dimensions, and fades out `.transition`.
