# Implementation Plan

## Overview

Add a mobile-only `ProfilePageHeader` component to the Profile Page that shows a back button on the left and the profile username centered. Hidden on screens wider than 768px.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1"] },
    { "wave": 2, "tasks": ["2"] }
  ]
}
```

## Notes

- Use the existing `useSmartBack` hook (already in `src/hooks/useSmartBack.js`) for back navigation
- Follow the pattern established by `CrewHeader.jsx`
- Use only existing CSS custom properties — no hardcoded values

## Tasks

- [ ] 1. Create ProfilePageHeader component
  - Create `src/components/profile/ProfilePageHeader.jsx` with back button (using `useSmartBack`) and centered username prop
  - Create `src/components/profile/ProfilePageHeader.module.css` with mobile-first styles: visible by default, `display: none` in `@media (min-width: 769px)`, fixed 56px height, bottom border, `prefers-reduced-motion` support
  - Back button: left-aligned, `aria-label="Go back"`, chevron SVG icon, 44×44px min tap target, keyboard accessible via standard `<button>`
  - Username: centered, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`, constrained width so it cannot push back button
  - Requirements: 1, 2, 3, 4

- [ ] 2. Integrate ProfilePageHeader into ProfilePage
  - Import `ProfilePageHeader` in `src/pages/ProfilePage.jsx`
  - Render `<ProfilePageHeader username={targetUsername} />` as the first child element inside `<main>`, before `profileSidebarFixed` div
  - Requirements: 1.3
