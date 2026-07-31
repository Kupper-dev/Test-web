# IT Flow Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Embed the exact `it-flow-section` component into `devlink-test.jsx` **after** `HomeReel`, complete with ticket feeds, styles, and SVG path scroll animation.

**Architecture:** Create `src/styles/suite-section.css` and `src/devlink/ItFlowSection.jsx`, then mount inside `src/devlink-test.jsx`.

**Tech Stack:** React, CSS, Vanilla JS Scroll Handlers, Vite.

---

### Task 1: Create Stylesheet & `ItFlowSection` React Component

**Files:**
- Create: `src/styles/suite-section.css`
- Create: `src/devlink/ItFlowSection.jsx`

- [ ] **Step 1: Write `src/styles/suite-section.css`**
- [ ] **Step 2: Write `src/devlink/ItFlowSection.jsx` with scroll handlers**
- [ ] **Step 3: Commit**

```bash
git add src/styles/suite-section.css src/devlink/ItFlowSection.jsx
git commit -m "feat: create IT Flow section component and CSS"
```

---

### Task 2: Mount Component After HomeReel in DevLink Environment

**Files:**
- Modify: `src/devlink-test.jsx`

- [ ] **Step 1: Mount `<ItFlowSection />` after `<HomeReel />`**
- [ ] **Step 2: Run `npm run build` verification**
- [ ] **Step 3: Commit and Push**

```bash
git add src/devlink-test.jsx
git commit -m "feat: mount IT Flow section after HomeReel in DevLink"
git push origin main
```
