# VossAgro Color Scheme Documentation

This document outlines the color palette used throughout the VossAgro frontend application. Adhering to this scheme ensures visual consistency and maintains the brand identity.

---

## Primary Colors

These colors are derived from the `primary` definition in `tailwind.config.js` and are used for main interactive elements, branding, and key highlights.

-   **Primary Default (`primary`):**
    *   **HSL:** `hsl(142.1 76.2% 36.3%)`
    *   **Usage:** Default background for buttons, primary links, active states, and main branding elements. This is the core green color of the application.

-   **Primary Foreground (`primary-foreground`):**
    *   **HSL:** `hsl(0 0% 98%)`
    *   **Usage:** Text color that provides good contrast against the `Primary Default` background. Typically used for text on primary buttons.

---

## Green Palette (Tailwind Shades)

Various shades of green are used to create depth and visual hierarchy, often for backgrounds, text, and borders related to agricultural themes.

-   **`bg-green-50`:**
    *   **Usage:** Very light green, often used as a subtle background for sections or gradients.
-   **`bg-green-100`:**
    *   **Usage:** Light green, used for background sections, especially intro banners.
-   **`text-green-600`:**
    *   **Usage:** Medium green for icons, hover states on links, and secondary text emphasis.
-   **`text-green-700`:**
    *   **Usage:** Darker green for main headings and important text.
-   **`text-green-800`:**
    *   **Usage:** Very dark green for prominent headings.
-   **`border-green-400`:**
    *   **Usage:** Green shade for borders, especially around input fields and select boxes.
-   **`bg-green-900`:**
    *   **Usage:** Deep, dark green used primarily for footers and strong background elements.

---

## Grayscale Palette (Tailwind Shades)

These shades are used for general text, borders, and backgrounds to provide neutrality and readability.

-   **`text-gray-800`:**
    *   **Usage:** Main body text color for good readability.
-   **`text-gray-700`:**
    *   **Usage:** Secondary text, descriptions, and less prominent information.
-   **`text-gray-600`:**
    *   **Usage:** Tertiary text, subtle labels, and icons.
-   **`text-gray-500`:**
    *   **Usage:** Placeholder text, very subtle descriptions.
-   **`bg-white`:**
    *   **Usage:** Clean backgrounds for cards, headers, and general page areas.

---

## Accent Colors

Colors used for specific, attention-grabbing elements that stand out from the primary palette.

-   **`bg-yellow-500`:**
    *   **Usage:** Used for specific call-to-action buttons (e.g., "Order Foodstuffs Now" on the Home page) to draw immediate attention.
-   **`hover:bg-yellow-600`:**
    *   **Usage:** Hover state for `bg-yellow-500` buttons.
-   **`text-black`:**
    *   **Usage:** Text color for high contrast on yellow accent backgrounds.

---

## Overlays

-   **`bg-black/40`:**
    *   **Usage:** A semi-transparent black overlay, typically used on hero images to improve text readability.

---

**Note:** For any new UI elements or modifications, please refer to this color scheme to ensure consistency. If a new color is required, it should be added to `tailwind.config.js` and documented here.
