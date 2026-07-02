# Requirements Document

## Introduction

This feature adds a mobile-first top header bar to the Profile Page (`/profile/:username`). On mobile screens (≤768px), the global app header does not provide back navigation for the profile page. This new header component solves that by rendering a compact bar that shows a back button on the left and the profile's username centered. On larger screens, the header hides so it does not duplicate the existing global top bar navigation.

## Glossary

- **Profile_Page_Header**: The mobile-oriented top header bar rendered at the top of the Profile Page.
- **Profile_Page**: The React page component at `/profile/:username` that displays a user's profile.
- **Back_Button**: An icon button on the left side of the Profile_Page_Header that triggers backward navigation.
- **Smart_Back**: The navigation behavior that goes back one step in history if a prior app route exists, or redirects to `/home` as a fallback.
- **Profile_Username**: The username string extracted from the route parameter `:username` and passed as a prop to Profile_Page_Header.
- **Mobile_Breakpoint**: Screen widths of 768px or less, as defined by the existing responsive breakpoints in the project.

---

## Requirements

### Requirement 1: Render the Profile Page Header on Mobile

**User Story:** As a mobile user, I want a header bar at the top of the profile page, so that I can see whose profile I am viewing and navigate back easily.

#### Acceptance Criteria

1. WHEN the Profile_Page renders on a screen width of 768px or less, THE Profile_Page_Header SHALL be rendered in the DOM and occupy layout space at the top of the page content.
2. WHEN the Profile_Page renders on a screen width greater than 768px, THE Profile_Page_Header SHALL be hidden with `display: none` so it occupies no layout space and does not overlap the global app header.
3. WHEN the Profile_Page renders on a screen width of 768px or less, THE Profile_Page_Header SHALL be the first element in DOM order within the Profile_Page layout so it appears above all other profile content.

---

### Requirement 2: Display the Back Button

**User Story:** As a mobile user, I want a back button on the left side of the header, so that I can navigate to the previous page or to the home page if there is no prior route.

#### Acceptance Criteria

1. THE Profile_Page_Header SHALL render a Back_Button as the first interactive element, aligned to the left side of the header bar using CSS flexbox.
2. WHEN a user taps the Back_Button and `window.history.length` is greater than 1, THE Profile_Page_Header SHALL call `navigate(-1)` to move the user back one step in the browser history.
3. WHEN a user taps the Back_Button and `window.history.length` is 1 or less, THE Profile_Page_Header SHALL call `navigate('/home')` to redirect the user to the home page.
4. THE Back_Button SHALL have an `aria-label` attribute with the value `"Go back"`.
5. THE Back_Button SHALL display a left-pointing chevron or arrow SVG icon and have a minimum tap target size of 44×44px enforced via CSS `min-width` and `min-height`.
6. THE Back_Button SHALL be keyboard focusable and activatable via the Enter and Space keys, matching standard `<button>` element behavior.

---

### Requirement 3: Display the Profile Username

**User Story:** As a mobile user, I want to see the profile username centered in the header, so that I always know whose profile I am viewing.

#### Acceptance Criteria

1. THE Profile_Page_Header SHALL always render a username element centered horizontally within the header bar, regardless of whether a Profile_Username prop value is provided.
2. WHEN the Profile_Username prop is a non-empty string, THE Profile_Page_Header SHALL display that string as the centered text.
3. WHEN the Profile_Username prop is null, undefined, or an empty string, THE Profile_Page_Header SHALL display a non-breaking space or placeholder so the header height does not collapse.
4. WHEN the Profile_Username text exceeds the available horizontal space, THE Profile_Page_Header SHALL truncate the text with an ellipsis (`text-overflow: ellipsis`) and prevent it from wrapping to a second line (`white-space: nowrap; overflow: hidden`).
5. THE Profile_Page_Header SHALL receive the Profile_Username as a prop and the username element SHALL be constrained so it cannot push the Back_Button out of its left-aligned position.

---

### Requirement 4: Mobile-First Responsive Design

**User Story:** As a developer, I want the header styled with CSS Modules in a mobile-first approach, so that it integrates consistently with the existing project styling conventions.

#### Acceptance Criteria

1. THE Profile_Page_Header SHALL be implemented as a standalone React component (`ProfilePageHeader.jsx`) with a dedicated CSS Module file (`ProfilePageHeader.module.css`) located in `src/components/profile/`.
2. THE Profile_Page_Header SHALL use only CSS custom properties (CSS variables) already defined in the project's global stylesheet for colors, fonts, and spacing — no hardcoded hex, rgb, or pixel values for theme tokens.
3. THE Profile_Page_Header SHALL have a fixed height of 56px so it does not reflow when the username length changes.
4. THE Profile_Page_Header SHALL visually separate itself from the content below using a bottom border styled with `var(--color-border-light)` or a subtle shadow using `var(--shadow-sm)`, matching the pattern used by existing app header components.
5. WHERE the device supports `prefers-reduced-motion: reduce`, THE Profile_Page_Header SHALL suppress any slide-in or fade-in CSS transitions or animations on the header bar.
6. THE CSS Module for Profile_Page_Header SHALL define base styles that apply at the Mobile_Breakpoint (≤768px) and SHALL use a `@media (min-width: 769px)` block to apply the `display: none` override for larger screens, following the project's mobile-first authoring convention.
