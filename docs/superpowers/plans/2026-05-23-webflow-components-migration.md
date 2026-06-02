# Webflow persistent capsule navbar: Navbar Link migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the persistent capsule navigation system from the sandbox to Webflow, starting with a clean `Navbar Link` component.

**Architecture:** We will delete the legacy "Nav bar link" component, create a new blank component, insert its elements and CSS styles via WHTML Builder, define the input properties, bind them to the elements, and verify the component with element snapshots.

**Tech Stack:** Webflow Designer API (MCP), Webflow CSS styling variables.

---

### Task 1: Recreate Navbar Link Component

**Files:**
- Modify: Webflow Component library (recreate `Navbar Link`)
- Verify: Home Page (`695c194f86d5e76167047dc5`)

- [ ] **Step 1: Delete the legacy component**

Call `de_component_tool > unregister_component` with the ID of the legacy component.
ID: `415af538-740d-ae7c-4818-ddfe31e41e08`

- [ ] **Step 2: Create a blank component**

Call `de_component_tool > create_blank_component` to register a clean component.
Name: `Navbar Link`

- [ ] **Step 3: Open the component canvas**

Call `de_component_tool > open_canvas` with the new component's ID (returned in Step 2) to enter its canvas editor context.

- [ ] **Step 4: Insert elements via WHTML Builder**

Call `whtml_builder` to insert the HTML structure and CSS classes into the root of the component.
Anchor: The blank component canvas root.
HTML:
```html
<li class="nav-bar__big-li">
  <a data-hover="" href="#" class="nav-bar__big-a">
    <span data-underline-link="" class="nav-bar__big-span">The Vault</span>
    <span class="nav-bar__big-span-number">180</span>
    <div class="nav-bar__a-tag">
      <div class="tag">
        <div data-wf--button-theme--variant="purple" class="button-bg"></div>
        <span class="eyebrow is--relative">NEW</span>
      </div>
    </div>
  </a>
  <div class="line is--nav-transparent"></div>
</li>
```

CSS:
```css
.nav-bar__big-li {
  width: 100%;
  position: relative;
}

.nav-bar__big-a {
  display: flex;
  align-items: center;
  width: 100%;
  padding-top: 1.0625em;
  padding-bottom: 1.125em;
  color: var(--_nav-theme-tokens---neutral-200);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-bar__big-a:hover {
  color: #ffffff;
}

.nav-bar__big-span {
  font-size: 1.5em;
  line-height: 1;
}

.nav-bar__big-span-number {
  color: var(--_nav-theme-tokens---neutral-500);
  margin-top: -0.75em;
  margin-left: 0.25em;
  font-size: 0.75em;
  line-height: 1;
  display: block;
  position: relative;
}

.nav-bar__a-tag {
  padding-top: 0.25em;
  padding-left: 0.625em;
  display: flex;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25em 0.625em;
  border-radius: 100em;
  position: relative;
  color: #ffffff;
  overflow: hidden;
}

.button-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  transition: background-color 0.2s ease;
}

.line {
  width: 100%;
  height: 1px;
  background-color: var(--_nav-theme-tokens---neutral-600);
}

.line.is--nav-transparent {
  opacity: 0.3;
}
```

- [ ] **Step 5: Define component properties**

Call `de_component_tool > create_prop` to define the 8 properties for the `Navbar Link` component:
Props Payload:
```json
[
  {
    "type": "textContent",
    "name": "Link Text",
    "default_text": { "value": "Link Title" }
  },
  {
    "type": "link",
    "name": "Link URL",
    "default_link": { "mode": "url", "to": "#" }
  },
  {
    "type": "boolean",
    "name": "Show Number",
    "default_boolean": { "value": false }
  },
  {
    "type": "textContent",
    "name": "Number Text",
    "default_text": { "value": "0" }
  },
  {
    "type": "boolean",
    "name": "Show Tag",
    "default_boolean": { "value": false }
  },
  {
    "type": "textContent",
    "name": "Tag Text",
    "default_text": { "value": "NEW" }
  },
  {
    "type": "string",
    "name": "Tag Variant",
    "default_text": { "value": "purple" }
  },
  {
    "type": "boolean",
    "name": "Show Divider",
    "default_boolean": { "value": true }
  }
]
```

- [ ] **Step 6: Retrieve element IDs for binding**

Call `element_tool > get_all_elements` to inspect the newly inserted elements tree and locate the exact element IDs for the following target elements:
* Root list item (`nav-bar__big-li`)
* Link Block (`nav-bar__big-a`)
* Title Span (`nav-bar__big-span`)
* Number Span (`nav-bar__big-span-number`)
* Tag Wrapper (`nav-bar__a-tag`)
* Tag Text Span (`eyebrow is--relative`)
* Tag Background (`button-bg`)
* Divider Line (`line is--nav-transparent`)

- [ ] **Step 7: Bind properties to elements**

Call `element_tool > set_settings` to bind the properties to the settings of the respective elements:
* Bind `Link Text` to `textContent` of the Title Span (`nav-bar__big-span`)
* Bind `Link URL` to `href` of the Link Block (`nav-bar__big-a`)
* Bind `Show Number` to `visibility` of the Number Span (`nav-bar__big-span-number`)
* Bind `Number Text` to `textContent` of the Number Span (`nav-bar__big-span-number`)
* Bind `Show Tag` to `visibility` of the Tag Wrapper (`nav-bar__a-tag`)
* Bind `Tag Text` to `textContent` of the Tag Text Span (`eyebrow is--relative`)
* Bind `Tag Variant` to the attribute `data-wf--button-theme--variant` of the Tag Background (`button-bg`)
* Bind `Show Divider` to `visibility` of the Divider Line (`line is--nav-transparent`)

- [ ] **Step 8: Close component canvas**

Call `de_component_tool > open_canvas` with page_id `695c194f86d5e76167047dc5` to exit component view and return to the Home page.

- [ ] **Step 9: Verify component rendering**

Call `de_component_tool > insert_component_instance` to insert an instance of the newly created component on the Home page canvas (as a test child).
Call `de_component_tool > set_component_instance_prop_values` to configure test properties (e.g. set `Link Text` to `"Test Link"`, `Show Number` to `true`, `Number Text` to `"99"`).
Call `element_snapshot_tool` on the component instance's element ID to verify that it renders correctly.

- [ ] **Step 10: Commit progress**

```bash
git add docs/superpowers/plans/2026-05-23-webflow-components-migration.md
git commit -m "plan: add Webflow components bottom-up migration implementation plan"
```
