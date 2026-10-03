# Srimati Jewelers --- Client-Side Product Requirements Document (PRD)

**Document Type:** Client Website Architecture & Product Requirements\
**Project:** Srimati Jewelers Digital Jewelry Catalog\
**Primary Owner:** Client-Side / Product Architecture\
**Technology:** React + JavaScript + Plain CSS + Supabase\
**Version:** 1.0

------------------------------------------------------------------------

# 1. Project Overview

Srimati Jewelers is a premium digital jewelry catalog designed to give
customers a modern way to explore the shop's jewelry collection online.

The website is **not an e-commerce checkout platform** in the current
phase. Its primary purpose is to:

-   Showcase jewelry designs professionally.
-   Allow customers to browse collections and categories.
-   Make product discovery fast and visually engaging.
-   Present product details such as purity, weight and HUID where
    applicable.
-   Build trust through the brand story, store information and contact
    details.
-   Convert interested visitors into enquiries.

The website should feel like a **digital showroom**, not like a
conventional online shopping marketplace.

The client-side experience is the primary architectural reference for
the project. The admin panel must be designed to support this
client-side flow rather than introducing a separate or conflicting
product structure.

------------------------------------------------------------------------

# 2. Product Vision

The website should communicate:

> **Luxury + Trust + Craftsmanship + Simplicity**

The customer should be able to enter the website, immediately understand
the brand, discover jewelry collections, filter/browse products, open a
product and enquire about it without confusion.

The interface should prioritize:

1.  Large visual presentation.
2.  High-quality jewelry photography/video.
3.  Minimal but useful text.
4.  Smooth browsing.
5.  Mobile responsiveness.
6.  Fast navigation.
7.  Premium typography and spacing.
8.  Clear product information.
9.  Easy enquiry/contact flow.

------------------------------------------------------------------------

# 3. Scope

## 3.1 In Scope

### Customer-facing website

-   Home page
-   Collections page
-   Category browsing
-   Subcategory browsing
-   Product listing
-   Product detail page
-   Product image gallery
-   Product information
-   Product filtering/search
-   Featured products/collections
-   About Us page
-   Contact Us page
-   Enquiry CTA
-   WhatsApp/contact integration if approved
-   Responsive mobile/tablet/desktop layouts
-   Supabase-powered dynamic catalog

### Admin-connected functionality

The client website will consume catalog data managed through the admin
panel.

The admin system must support:

-   Categories
-   Subcategories
-   Products
-   Product images
-   Product metadata
-   Featured products
-   Product availability/status
-   Product ordering/visibility

## 3.2 Out of Scope for Current Version

Unless separately approved:

-   Online payment
-   Shopping cart
-   Checkout
-   Shipping calculation
-   Order management
-   Customer accounts
-   Wishlist
-   Reviews/ratings
-   Automated jewellery price calculation
-   Inventory/stock accounting
-   GST invoice generation
-   POS integration

The website is a **catalog + enquiry platform**.

------------------------------------------------------------------------

# 4. Core Information Architecture

The most important architectural decision is to keep the customer-facing
category system simple.

The website will use a **two-level category hierarchy**:

``` text
Parent Category
      ↓
Child Category
      ↓
Products
```

## Parent Categories

The initial parent categories are:

-   Gold
-   Silver

Additional parent categories such as Diamond may be added later if
required by the business, but the architecture should support them
without requiring a frontend redesign.

## Child Categories

Child categories represent the **type of jewelry**.

Examples:

-   Necklace
-   Ring
-   Earrings
-   Chain
-   Pendant
-   Bangle
-   Bracelet
-   Anklet
-   Nose Pin
-   Mangalsutra
-   etc.

The exact child-category list must remain **admin configurable**.

The developer must not hard-code the complete list into the frontend.

------------------------------------------------------------------------

# 5. Category Philosophy

The catalog intentionally does **not** create deep category trees.

Avoid structures such as:

``` text
Gold
 └── Chains
      └── Sachin Gems
           └── Mixed
                └── Highly Polished
                     └── Product
```

Instead:

``` text
Gold
 └── Chain
      └── Product
```

Additional characteristics such as:

-   Collection name
-   Design name
-   Polish/finish
-   Purity
-   Weight
-   HUID

should be represented as **product-level information/attributes**, where
applicable.

This keeps the customer experience clean and allows the shop owner to
introduce new designs and terminology without requiring a new website
structure.

------------------------------------------------------------------------

# 6. Example Product Classification

A product could be represented as:

``` text
Parent Category: Gold
Child Category: Chain

Product Name:
Sachin Gems Mixed Chain

Collection:
Sachin Gems

Design/Style:
Mixed Chain

Finish:
Highly Polished

Purity:
22K

Weight:
12.45 g

HUID:
XXXXXXXXXX
```

The customer does not need to navigate through every one of these
values.

Instead, the customer sees:

``` text
Gold
→ Chains
→ Product
```

and the product page presents the relevant attributes.

------------------------------------------------------------------------

# 7. Website Structure

The client website will contain the following major sections:

``` text
Home
Collections
    ├── Gold
    │    ├── Necklace
    │    ├── Ring
    │    ├── Earrings
    │    ├── Chain
    │    └── ...
    │
    └── Silver
         ├── Necklace
         ├── Ring
         ├── Earrings
         ├── Chain
         └── ...

Product Details

About Us

Contact Us
```

------------------------------------------------------------------------

# 8. Homepage

The homepage is the primary brand experience.

It should feel like entering a premium physical jewelry showroom.

## 8.1 Hero Section

The hero should occupy approximately the full viewport.

### Content

-   Full-screen video background
-   Dark/soft overlay where required for readability
-   Srimati Jewelers logo
-   Short premium headline
-   Supporting one-line description
-   Primary CTA: `Explore Collections`
-   Optional secondary CTA: `Contact Us`

### Example hierarchy

``` text
[Full-screen Jewelry Video]

             SRIMATI JEWELERS

       Timeless Craft. Modern Elegance.

          [ Explore Collections ]
```

The video should be optimized for web performance.

Requirements:

-   Muted
-   Autoplay
-   Loop
-   Plays inline on mobile
-   Optimized/compressed
-   Poster image fallback
-   Does not block page loading

------------------------------------------------------------------------

# 9. Featured Section

Immediately after the hero, the homepage should introduce selected
products or collections.

Possible layout:

``` text
Featured Collection

[ Product ] [ Product ] [ Product ] [ Product ]
```

Each card should contain:

-   Product image
-   Product name
-   Category
-   Optional short attribute
-   CTA / clickable area

The featured section must be dynamically manageable from the admin
panel.

------------------------------------------------------------------------

# 10. Browse Categories Section

The homepage should provide a visual entry point into the catalog.

Example:

``` text
Explore Our Collections

[ Gold ]
[ Silver ]
```

or, depending on the final visual design:

``` text
Gold
  [ Rings ] [ Chains ] [ Earrings ] [ Necklaces ]

Silver
  [ Rings ] [ Chains ] [ Earrings ] [ Necklaces ]
```

Category cards should preferably use representative jewelry photography.

------------------------------------------------------------------------

# 11. Brand / About Preview

The homepage should include a short brand-story section.

Purpose:

-   Establish trust.
-   Introduce Srimati Jewelers.
-   Communicate craftsmanship and heritage.
-   Lead users to the complete About Us page.

Example:

``` text
Crafted With Tradition.
Designed For Today.

A short brand description...

[ Discover Our Story ]
```

------------------------------------------------------------------------

# 12. Newsletter / Updates Section

A lightweight newsletter/update section may be placed toward the lower
part of the homepage.

Purpose:

-   New collection announcements
-   Store updates
-   Occasional promotional communication

If newsletter infrastructure is not required in the first release, the
UI can instead function as a simple:

``` text
Stay Connected

Discover new arrivals and latest collections.

[ Contact Us ]
```

The feature should not create unnecessary backend complexity unless the
client specifically requires email collection.

------------------------------------------------------------------------

# 13. Footer

The footer should include:

### Brand

-   Srimati Jewelers logo
-   Short brand statement

### Navigation

-   Home
-   Collections
-   About Us
-   Contact Us

### Contact

-   Phone
-   Address
-   Email, if applicable
-   WhatsApp, if applicable

### Social

-   Instagram
-   Facebook
-   Other approved platforms

### Legal/utility

-   Privacy Policy, if required
-   Terms, if required

------------------------------------------------------------------------

# 14. Collections Page

The Collections page is the core catalog experience.

It should allow customers to browse the complete jewelry collection.

## 14.1 Top-Level Selection

The first classification should be:

``` text
Gold
Silver
```

These can be displayed as large visual tabs/cards.

------------------------------------------------------------------------

# 15. Child Category Navigation

After selecting a parent category, the customer should see its child
categories.

Example:

``` text
GOLD

[ All ]
[ Rings ]
[ Earrings ]
[ Chains ]
[ Necklaces ]
[ Pendants ]
[ Bangles ]
[ Bracelets ]
```

The exact categories are dynamically loaded from Supabase.

Do not assume every parent category has the same child categories.

For example:

``` text
Gold
 ├── Rings
 ├── Chains
 ├── Earrings
 └── Necklaces

Silver
 ├── Rings
 ├── Earrings
 └── Anklets
```

This is valid.

------------------------------------------------------------------------

# 16. Product Grid

Products should be presented in a premium responsive grid.

Desktop example:

``` text
[ Product ] [ Product ] [ Product ] [ Product ]
[ Product ] [ Product ] [ Product ] [ Product ]
```

Tablet:

``` text
[ Product ] [ Product ] [ Product ]
[ Product ] [ Product ] [ Product ]
```

Mobile:

``` text
[ Product ]
[ Product ]
[ Product ]
```

or a two-column layout if the final design supports sufficient image
clarity.

------------------------------------------------------------------------

# 17. Product Card

Every product card should prioritize the jewelry image.

Recommended information:

``` text
[ IMAGE ]

Sachin Gems Mixed Chain

Gold • Chain

22K Gold

[ View Details ]
```

Do not overload cards with technical information.

Detailed attributes belong on the product page.

------------------------------------------------------------------------

# 18. Swipe-Based Browsing

The product discovery experience should support horizontal/swipe
interaction where appropriate.

This is especially useful on mobile.

Possible implementations:

### Category carousel

``` text
← Rings | Chains | Earrings | Necklaces →
```

### Featured products

``` text
← Product | Product | Product →
```

### Mobile collections

Horizontal scrolling should feel natural rather than forcing users
through multiple full-page navigations.

Important:

-   Use native touch scrolling where possible.
-   Avoid excessive animation.
-   Maintain accessibility.
-   Ensure horizontal sections have clear visual affordance.

------------------------------------------------------------------------

# 19. Product Detail Page

The product detail page is the most important conversion page after the
collections page.

## 19.1 Image Gallery

Support:

-   Main image
-   Multiple product images
-   Thumbnail navigation
-   Swipe gestures on mobile
-   Full-screen image viewing if appropriate

Potential future support:

-   Product video
-   360° view

------------------------------------------------------------------------

# 20. Product Information

The product page should contain:

### Required / Recommended Fields

-   Product name
-   Parent category
-   Child category
-   Product images
-   Description
-   Purity
-   Weight
-   HUID, where applicable
-   Collection/design name, where applicable
-   Finish/polish, where applicable
-   Availability/status

### Example

``` text
Sachin Gems Mixed Chain

Gold
Chain

22K Gold
Weight: 12.45 g
HUID: XXXXXXXX

A finely crafted mixed chain...

[ Enquire About This Piece ]
```

------------------------------------------------------------------------

# 21. Purity

Purity should be stored as structured product data.

Examples:

-   24K
-   22K
-   20K
-   18K
-   14K
-   Other values provided by the business

The admin should ideally select purity from a controlled value/list
rather than repeatedly typing inconsistent values.

However, the database should remain flexible enough to support future
purity values.

For silver, the business may use different purity standards; therefore
the field should not be hard-coded as gold-only.

------------------------------------------------------------------------

# 22. Weight

Weight should be stored as a numeric value with a consistent unit.

Recommended:

``` text
weight_value: 12.45
weight_unit: "g"
```

The frontend should display:

``` text
Weight: 12.45 g
```

Do not store `"12.45 grams"` as the only database value.

This allows future filtering/sorting and consistent formatting.

------------------------------------------------------------------------

# 23. HUID

HUID should be an optional field.

Example:

``` text
HUID: XXXXXXXX
```

Not every product should be assumed to have a HUID value.

Frontend behavior:

-   If HUID exists → display it.
-   If HUID is empty/null → do not display an empty HUID section.

The admin should be able to enter/update HUID where applicable.

------------------------------------------------------------------------

# 24. Pricing Strategy

The current product is a **digital catalog**, not a transactional
e-commerce system.

Therefore exact online checkout pricing is not required.

Possible product presentation:

``` text
Price
Price on Request
```

or:

``` text
Approx. Price
₹XX,XXX
Market-linked / subject to current gold rate
```

The final display should be decided with the client.

If prices are stored in Supabase, the frontend should treat them as
display information and not as checkout-authoritative transaction
values.

------------------------------------------------------------------------

# 25. Enquiry Flow

The primary conversion action should be:

> **Enquire About This Piece**

Possible flow:

``` text
Product Detail
      ↓
Enquire
      ↓
Contact / WhatsApp / Enquiry Form
      ↓
Customer communicates with Srimati Jewelers
```

The enquiry should ideally carry product context.

For example:

``` text
I am interested in:
Sachin Gems Mixed Chain
Product ID: SJ-GOLD-001
```

This makes it easier for the shop owner to identify the requested piece.

------------------------------------------------------------------------

# 26. Search

The collections experience should support product search.

Search can initially operate on:

-   Product name
-   Product code
-   Collection/design name
-   Category
-   Relevant searchable metadata

Example:

``` text
Search "Sachin"

→ Sachin Gems Mixed Chain
→ Sachin Gold Necklace
→ Sachin Pattern Ring
```

Search should not expose internal database IDs to customers.

------------------------------------------------------------------------

# 27. Filtering

Filters should remain simple.

Potential filters:

### Category

-   Gold
-   Silver

### Jewelry Type

-   Ring
-   Chain
-   Necklace
-   Earrings
-   etc.

### Purity

-   22K
-   18K
-   etc.

### Weight

Optional range filter if the catalog size justifies it.

### Collection

Optional.

### Availability

-   Available
-   Not Available

The frontend should only show filters that are useful for the current
catalog.

------------------------------------------------------------------------

# 28. Sorting

Optional sorting:

-   Featured
-   Newest
-   Name
-   Weight, if required

The default should be **curated/featured order**, not necessarily
alphabetical.

This allows the shop to control the visual presentation.

------------------------------------------------------------------------

# 29. About Us Page

The About page should communicate the brand rather than becoming a long
text document.

Suggested structure:

``` text
Hero / Brand Introduction

Our Story

Our Craftsmanship

Our Values

Why Customers Trust Us

Store / Brand Images

Call to Action
```

Potential content:

-   Business history
-   Family heritage
-   Craftsmanship
-   Quality standards
-   Customer relationships
-   Location
-   Brand philosophy

All copy should come from the client.

------------------------------------------------------------------------

# 30. Contact Us Page

The Contact page should include:

-   Store name
-   Address
-   Phone
-   WhatsApp
-   Email, if available
-   Opening hours
-   Google Maps/location
-   Contact/enquiry form, if required
-   Social links

The page should prioritize mobile users.

A direct:

> **Get Directions**

button should be provided if a verified map location is available.

------------------------------------------------------------------------

# 31. Responsive Design

The website must be designed mobile-first.

## Mobile

Priority:

-   Hero video/image
-   Easy navigation
-   Swipe gestures
-   Large product imagery
-   Sticky/accessible enquiry CTA
-   Fast loading

## Tablet

-   Two/three-column product layouts
-   Larger category cards

## Desktop

-   Full-width visual storytelling
-   Multi-column catalog
-   Large product gallery
-   Premium whitespace
-   Hover interactions where appropriate

------------------------------------------------------------------------

# 32. Visual Design Direction

The website should communicate a premium jewelry brand.

Design principles:

-   Elegant
-   Minimal
-   Luxurious
-   Spacious
-   Editorial
-   Image-focused

Avoid:

-   Excessive gradients
-   Overloaded cards
-   Too many buttons
-   Dense dashboards on the customer website
-   Generic e-commerce styling
-   Excessive animation

Animations should support the premium experience rather than distract
from jewelry photography.

------------------------------------------------------------------------

# 33. Technology Stack

## Frontend

-   React
-   Vite
-   JavaScript
-   Plain CSS

### Explicitly excluded

-   TypeScript
-   Tailwind CSS

The frontend should use reusable React components and modular CSS.

------------------------------------------------------------------------

# 34. Backend / Database

## Supabase

Supabase will provide:

-   PostgreSQL database
-   Product data
-   Category data
-   Product images/storage
-   Dynamic content
-   Admin-connected catalog data

The frontend should retrieve catalog data dynamically rather than
storing product/category data directly inside React source code.

------------------------------------------------------------------------

# 35. Suggested Frontend Component Architecture

Example:

``` text
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Hero.jsx
│   ├── FeaturedProducts.jsx
│   ├── CategoryCard.jsx
│   ├── CategoryTabs.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── ProductGallery.jsx
│   ├── ProductInfo.jsx
│   ├── FilterBar.jsx
│   ├── SearchBar.jsx
│   ├── EnquiryButton.jsx
│   └── ...
│
├── pages/
│   ├── Home.jsx
│   ├── Collections.jsx
│   ├── ProductDetails.jsx
│   ├── About.jsx
│   └── Contact.jsx
│
├── lib/
│   └── supabase.js
│
├── services/
│   ├── products.js
│   ├── categories.js
│   └── ...
│
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── ...
│
└── App.jsx
```

The exact structure may change during implementation, but the separation
of UI, data access and page-level logic should remain.

------------------------------------------------------------------------

# 36. Suggested Database Relationship

The core catalog relationship should be:

``` text
parent_categories
        │
        │ 1:N
        ↓
child_categories
        │
        │ 1:N
        ↓
products
        │
        │ 1:N
        ↓
product_images
```

Example:

``` text
Gold
 ├── Ring
 │    ├── Product A
 │    ├── Product B
 │    └── Product C
 │
 ├── Chain
 │    ├── Product D
 │    └── Product E
 │
 └── Earrings
      └── Product F
```

------------------------------------------------------------------------

# 37. Product Data Model --- Conceptual

A product should conceptually contain:

``` text
Product
├── id
├── product_code
├── name
├── description
├── parent_category_id
├── child_category_id
├── collection_name
├── design_name
├── finish
├── purity
├── weight_value
├── weight_unit
├── huid
├── price
├── price_type
├── is_featured
├── is_available
├── display_order
├── created_at
└── updated_at
```

Not every field is mandatory.

The principle is:

> **Required fields should be minimal; optional attributes should remain
> flexible.**

------------------------------------------------------------------------

# 38. Product Images

Products should support multiple images.

Example:

``` text
Product
 ├── Main Image
 ├── Image 2
 ├── Image 3
 └── Image 4
```

Recommended image metadata:

``` text
image_url
product_id
display_order
is_primary
alt_text
```

The frontend should always know which image is the primary image.

------------------------------------------------------------------------

# 39. Admin Dependency

The client website is dynamic.

Therefore the admin system must provide reliable data in the structure
expected by the frontend.

The admin panel is **not responsible for deciding the customer UX**.

The client-side architecture defined in this document is the source of
truth for how catalog data is consumed.

------------------------------------------------------------------------

# 40. ADMIN NEEDFUL --- Developer Handoff

This section is specifically for the developer building the admin panel.

The admin panel must be built around the following architecture.

## 40.1 Category Management

Admin must be able to:

-   Create parent category
-   Edit parent category
-   Enable/disable parent category
-   Create child category
-   Edit child category
-   Assign child category to a parent category
-   Enable/disable child category
-   Set display order
-   Upload category image if the frontend uses category imagery

### Parent example

``` text
Gold
Silver
```

### Child example

``` text
Gold
 ├── Rings
 ├── Chains
 ├── Earrings
 ├── Necklaces
 └── Bangles
```

The child category must belong to exactly one parent category in the
standard implementation.

------------------------------------------------------------------------

# 41. Admin Must NOT Hard-Code Category Lists

The admin developer must not assume that:

``` text
Gold always has 10 categories.
Silver always has 8 categories.
```

The shop owner may add:

``` text
Gold → New Category
```

later.

The frontend should automatically reflect the new category.

This is a core requirement.

------------------------------------------------------------------------

# 42. Product Creation Form

The product creation form should contain at minimum:

## Basic Information

-   Product Name
-   Product Code / SKU
-   Description

## Classification

-   Parent Category
-   Child Category
-   Collection Name
-   Design Name
-   Finish / Polish

## Jewelry Information

-   Purity
-   Weight
-   Weight Unit
-   HUID

## Commercial Information

-   Price / Approximate Price
-   Price Type
-   Availability

## Presentation

-   Product Images
-   Primary Image
-   Featured toggle
-   Display Order

------------------------------------------------------------------------

# 43. Parent → Child Selection

The admin form must use dependent selection.

Example:

``` text
Parent Category
[ Gold ▼ ]

Child Category
[ Chain ▼ ]
```

If the admin changes:

``` text
Gold → Silver
```

the child-category list must update to show only Silver's child
categories.

This prevents incorrect classification.

------------------------------------------------------------------------

# 44. Flexible Product Attributes

The shop may use terms such as:

-   Sachin Gems
-   Mixed
-   Highly Polished
-   Less Polished
-   Special Design
-   Other internal collection/design terminology

These should **not automatically become database category levels**.

Where applicable, store them as:

``` text
collection_name
design_name
finish
```

or another clearly named product attribute.

This keeps the category hierarchy stable.

------------------------------------------------------------------------

# 45. Admin Product Edit

Admin must be able to edit every product field.

At minimum:

-   Name
-   Description
-   Category
-   Subcategory
-   Collection
-   Design
-   Finish
-   Purity
-   Weight
-   HUID
-   Price
-   Images
-   Featured status
-   Availability
-   Display order

Changes should be reflected on the client website without requiring
frontend code changes.

------------------------------------------------------------------------

# 46. Product Visibility

Products should support a visibility/availability state.

Suggested states:

``` text
Published
Draft
Unavailable
Archived
```

Only products marked appropriately for public display should appear on
the client website.

For a simpler first implementation, this can be reduced to:

``` text
is_published
is_available
```

------------------------------------------------------------------------

# 47. Featured Products

Admin should have a simple control:

``` text
[✓] Featured
```

and optionally:

``` text
Display Order: 1
```

The client homepage can then query:

``` text
is_featured = true
```

and sort by display order.

------------------------------------------------------------------------

# 48. Product Image Management

Admin must be able to:

-   Upload multiple images.
-   Set primary image.
-   Reorder images.
-   Delete/replace images.
-   Associate images with the correct product.

Images should be stored using Supabase Storage or the agreed
image-storage layer.

The client frontend should receive public/optimized image URLs.

------------------------------------------------------------------------

# 49. Data Validation

The admin panel must validate:

### Required

-   Product name
-   Parent category
-   Child category
-   At least one product image
-   Availability/publication state

### Optional

-   Description
-   Collection
-   Design
-   Finish
-   Purity
-   Weight
-   HUID
-   Price

The exact required fields can be adjusted after confirmation with
Srimati Jewelers.

------------------------------------------------------------------------

# 50. Important Admin → Frontend Contract

The admin developer must understand:

> **Anything created or modified in the admin panel must be consumable
> by the client website without code changes.**

For example, if admin creates:

``` text
Parent:
Gold

Child:
Temple Jewelry
```

the client website should automatically be capable of showing:

``` text
Gold
→ Temple Jewelry
```

without the frontend developer manually adding `"Temple Jewelry"` to
React code.

------------------------------------------------------------------------

# 51. Supabase Security

The database must use appropriate Row Level Security policies.

Public client website should only be able to read data intended for
public display.

Admin operations must require appropriate authentication/authorization.

The public client should not have permission to:

-   Create products
-   Edit products
-   Delete products
-   Modify categories
-   Modify prices
-   Modify HUID
-   Modify product images

The exact authentication implementation belongs to the admin/backend
architecture, but the separation of public read access and admin write
access is mandatory.

------------------------------------------------------------------------

# 52. Frontend Data Rules

The frontend should never depend on assumptions such as:

``` javascript
if (category === "Gold") ...
```

Instead, it should query category relationships.

Likewise, do not hard-code:

``` javascript
const categories = [
  "Ring",
  "Chain",
  "Earrings"
];
```

The categories should come from Supabase.

Hard-coded UI labels may be used for static navigation such as:

``` text
Home
Collections
About
Contact
```

but catalog categories should be dynamic.

------------------------------------------------------------------------

# 53. Performance Requirements

The website should prioritize fast loading despite using high-quality
jewelry imagery and video.

Requirements:

-   Lazy-load product images.
-   Optimize image dimensions.
-   Use modern image formats where supported.
-   Lazy-load below-the-fold sections.
-   Compress hero video.
-   Avoid loading the complete product catalog unnecessarily.
-   Use pagination/infinite loading for large catalogs.
-   Cache appropriate static/dynamic data.
-   Avoid unnecessary Supabase requests.

------------------------------------------------------------------------

# 54. SEO Requirements

The client website should have basic SEO support.

Each product page should ideally have:

-   Unique page title
-   Meta description
-   Product name
-   Category context
-   Clean URL

Example:

``` text
/collections/gold/chains
```

Product:

``` text
/products/sachin-gems-mixed-chain
```

The final URL strategy can change, but URLs should remain
human-readable.

------------------------------------------------------------------------

# 55. Accessibility

The website should support:

-   Keyboard navigation
-   Proper button semantics
-   Alt text for jewelry images
-   Sufficient text contrast
-   Visible focus states
-   Accessible navigation
-   Reduced-motion consideration

Important visual animations must not prevent normal navigation.

------------------------------------------------------------------------

# 56. Error & Empty States

The website should gracefully handle:

### No products

``` text
No pieces found in this collection.
```

### Search with no result

``` text
We couldn't find a matching piece.
Try another search or explore our collections.
```

### Supabase/API failure

Show a clean customer-facing error state rather than exposing technical
errors.

------------------------------------------------------------------------

# 57. Loading States

Use elegant loading states.

Recommended:

-   Skeleton product cards
-   Image placeholders
-   Soft loading transitions

Avoid showing a generic browser-like spinner for every interaction.

------------------------------------------------------------------------

# 58. Analytics --- Optional

If approved, basic analytics may track:

-   Homepage visits
-   Collection visits
-   Category clicks
-   Product views
-   Enquiry button clicks
-   WhatsApp clicks
-   Contact clicks

Analytics should not interfere with the core website experience.

------------------------------------------------------------------------

# 59. Final User Journey

The ideal customer journey is:

``` text
LANDING
   ↓
Hero Video
   ↓
Explore Collections
   ↓
Gold / Silver
   ↓
Jewelry Type
   ↓
Product Grid
   ↓
Product
   ↓
Product Details
   ↓
Enquire
   ↓
Contact / WhatsApp
```

Alternative journey:

``` text
LANDING
   ↓
Featured Product
   ↓
Product Details
   ↓
Enquire
```

The user should never be forced through unnecessary pages.

------------------------------------------------------------------------

# 60. Architecture Summary

The final architecture is intentionally simple:

``` text
                    SRIMATI JEWELERS
                           │
          ┌────────────────┼────────────────┐
          │                │                │
        HOME         COLLECTIONS        ABOUT US
                           │
                    ┌──────┴──────┐
                    │             │
                   GOLD          SILVER
                    │             │
             ┌──────┼──────┐   ┌──┼──────┐
             │      │      │   │  │       │
           Rings  Chains Earrings ...    ...
             │
             ↓
          PRODUCTS
             │
             ↓
       PRODUCT DETAILS
             │
             ↓
          ENQUIRY
```

The database structure remains flexible:

``` text
Parent Category
      ↓
Child Category
      ↓
Product
      ↓
Product Attributes
      ↓
Product Images
```

This gives Srimati Jewelers a catalog that can grow without requiring
architectural changes every time the shop adds a new jewelry design,
collection or category.

------------------------------------------------------------------------

# 61. Definition of Done

The client-side implementation will be considered complete when:

-   [ ] Homepage hero video works responsively.
-   [ ] Homepage has featured content.
-   [ ] Categories load dynamically.
-   [ ] Parent categories work dynamically.
-   [ ] Child categories work dynamically.
-   [ ] Product grid works responsively.
-   [ ] Product search works.
-   [ ] Product filtering works where enabled.
-   [ ] Product detail pages work.
-   [ ] Multiple product images work.
-   [ ] Product attributes display conditionally.
-   [ ] Purity displays correctly.
-   [ ] Weight displays correctly.
-   [ ] HUID displays only when available.
-   [ ] Enquiry flow carries product context.
-   [ ] About page is complete.
-   [ ] Contact page is complete.
-   [ ] Navigation is responsive.
-   [ ] Supabase data is consumed dynamically.
-   [ ] No catalog category is hard-coded into the frontend.
-   [ ] Loading states exist.
-   [ ] Empty/error states exist.
-   [ ] Basic SEO is implemented.
-   [ ] Mobile experience is polished.
-   [ ] Public users cannot modify catalog data.

------------------------------------------------------------------------

# 62. Final Architectural Principle

The entire project should follow one central principle:

> **Keep the customer experience simple while keeping the catalog data
> flexible.**

The customer should see:

``` text
Gold
→ Chains
→ Jewelry
```

while the shop owner can maintain richer information behind the scenes:

``` text
Gold
Chain
Sachin Gems
Mixed Design
Highly Polished
22K
12.45 g
HUID
```

This separation allows the website to remain **premium and easy to
browse**, while the admin system remains **powerful and flexible enough
for the actual jewelry business**.

------------------------------------------------------------------------

# 63. Developer Ownership Boundary

## Client-Side Developer

Owns:

-   Customer UX
-   Page architecture
-   Navigation
-   Catalog discovery
-   Product presentation
-   Responsive design
-   Product detail experience
-   Enquiry experience
-   Frontend Supabase integration
-   Performance
-   SEO
-   Accessibility

## Admin Developer

Owns:

-   Admin authentication
-   Category CRUD
-   Product CRUD
-   Product image management
-   Product metadata management
-   Featured/visibility controls
-   Admin-side validation
-   Supabase write operations
-   Admin permissions/security

## Shared Contract

Both developers must agree on:

-   Database schema
-   Category relationships
-   Product fields
-   Image structure
-   Public/private data rules
-   Product publication status
-   Supabase RLS policies
-   Naming conventions

The client-side PRD is the **customer-experience source of truth**,
while the admin panel is the operational tool used to maintain the data
that powers it.

------------------------------------------------------------------------

**End of PRD**
