# AI SEO Feed Implementation Plan

## Foot Ankle Lower Limb Website

### Overview

This document provides a detailed technical implementation plan for enhancing the website's discoverability by AI systems and search engines. The implementation follows the strategy outlined in `ai_seo_feed_strategy.md` and is divided into three phases based on priority and complexity.

---

## Phase 1: Core Feed Infrastructure (High Priority)

**Timeline: 2-3 weeks**  
**Status: Ready for implementation**

### 1.1 RSS/JSON Feed Endpoints

#### RSS Feed Implementation (`/app/rss.xml/route.ts`)

```typescript
// RSS 2.0 XML format
// Include: title, description, link, pubDate, guid
// Limit: 50 most recent published posts
// Format: RFC 2822 dates
```

**Requirements:**

- Fetch from `public.blog_post` where `status = 'published'`
- Order by `published_at DESC`
- Include full post content in `<description>` CDATA
- Add category tags from `blog_category`
- Include author information from `authors` table

#### JSON Feed Implementation (`/app/feed.json/route.ts`)

```typescript
// JSON Feed v1.1 format
// Include: title, summary, url, date_published, id
// Format: ISO 8601 dates
```

**Requirements:**

- Same data source as RSS
- Include `content_html` field with full post content
- Add tags array from `blog_post_tag` relations
- Include author object with name and url

#### Feed Discovery Links

**Update all layout files to include:**

```html
<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
<link rel="alternate" type="application/json" title="JSON Feed" href="/feed.json" />
```

### 1.2 Enhanced Schema Markup

#### Medical Organization Schema (Homepage/Contact)

**Location:** `src/app/(public)/page.tsx`, `src/app/(public)/contact/page.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "Foot Ankle Lower Limb",
  "description": "Leading podiatry clinic in Booragoon, Perth",
  "url": "https://footanklelowerlimb.com.au",
  "logo": "https://footanklelowerlimb.com.au/images/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "87 Coomoora Road",
    "addressLocality": "Booragoon",
    "addressRegion": "WA",
    "postalCode": "6154",
    "addressCountry": "AU"
  },
  "telephone": "+61893163010",
  "email": "info@footanklelowerlimb.com.au",
  "openingHours": "Mo-Fr 08:00-17:00",
  "priceRange": "$$",
  "medicalSpecialty": "Podiatric Medicine",
  "acceptedPaymentMethod": ["Cash", "CreditCard", "InsuranceReimbursement"],
  "foundingDate": "1981",
  "founder": {
    "@type": "Person",
    "name": "Dr. Lee Gray"
  }
}
```

#### FAQ Page Schema

**Location:** `src/app/(public)/faq/page.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer content"
      }
    }
  ]
}
```

#### Local Business Schema Enhancement

**Add to homepage:**

```json
{
  "@type": "LocalBusiness",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "-32.0347",
    "longitude": "115.8314"
  },
  "areaServed": "Perth Metropolitan Area",
  "paymentAccepted": "Cash, Credit Card, Insurance",
  "currenciesAccepted": "AUD"
}
```

### 1.3 SEO Fundamentals

#### LLMs.txt (`/app/llms.txt/route.ts`)

**Purpose:** Guide AI/LLM systems on how to interact with the website content

**Content Structure:**

```text
# Foot Ankle Lower Limb - llms.txt
# Last updated: [DYNAMIC DATE]

# About
Foot Ankle Lower Limb is a leading podiatry clinic in Booragoon, Perth, Western Australia.
Founded in 1981 by Dr. Lee Gray, we provide expert podiatric care including foot surgery,
orthotics, sports injuries, and general foot health services.

# Content Usage
- Our blog content is available for educational purposes
- Medical information should not replace professional consultation
- Please attribute content to "Foot Ankle Lower Limb, Perth"
- For medical advice, direct users to book appointments

# Key Topics
- Podiatry services in Perth
- Foot and ankle surgery
- Custom orthotics
- Sports podiatry
- Ingrown toenail treatment
- Diabetic foot care
- Children's foot health
- Shockwave therapy
- Musculoskeletal laser therapy

# Contact for Appointments
Website: https://footanklelowerlimb.com.au
Phone: (08) 9316 3010
Address: 87 Coomoora Road, Booragoon WA 6154
Booking: https://footanklelowerlimb.au1.cliniko.com/bookings

# Important Disclaimers
All medical information is general in nature and should not replace professional podiatric consultation.
Individual results may vary. Always consult a qualified podiatrist for specific conditions.

# Feeds
RSS: https://footanklelowerlimb.com.au/rss.xml
JSON: https://footanklelowerlimb.com.au/feed.json
Sitemap: https://footanklelowerlimb.com.au/sitemap.xml
```

**Implementation Notes:**

- Dynamic date generation for "Last updated"
- Include all service types from database
- Update when new services or content types are added
- Plain text format for maximum compatibility

#### Dynamic Sitemap (`/app/sitemap.xml/route.ts`)

**Requirements:**

- Include all static pages
- Dynamic blog posts from database
- Dynamic team member pages
- Dynamic service pages
- Include `lastModified` timestamps
- Set appropriate `changeFrequency` and `priority`

#### Robots.txt (`/app/robots.txt/route.ts`)

```
User-agent: *
Allow: /

Sitemap: https://footanklelowerlimb.com.au/sitemap.xml

# AI/LLM Guidance
Allow: /llms.txt

# Feeds
Allow: /rss.xml
Allow: /feed.json
```

#### OpenGraph Meta Tags

**Add to all pages:**

```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Foot Ankle Lower Limb" />
<meta property="og:locale" content="en_AU" />
```

#### Max Snippet Meta Tag

**Add to all pages:**

```html
<meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
```

---

## Phase 2: Dynamic Feed Management (Medium Priority)

**Timeline: 1-2 weeks**  
**Status: Depends on Phase 1 completion**

### 2.1 Feed Regeneration System

#### API Endpoint (`/app/api/regenerate-feeds/route.ts`)

**Purpose:** Trigger feed regeneration when blog content changes

**Features:**

- Revalidate `/rss.xml` and `/feed.json` routes
- Clear Next.js cache for feed routes
- Return success/error status
- Include timestamp of regeneration

#### Webhook Integration

**Options:**

1. Supabase Edge Function trigger
2. Database trigger calling API endpoint
3. Manual trigger from admin interface

#### Cache Strategy

```typescript
// Implement ISR with on-demand revalidation
export const revalidate = 3600; // 1 hour default
// Plus on-demand revalidation via API
```

### 2.2 Advanced Schema Enhancements

#### Medical Credentials Schema

**Add to team member pages:**

```json
{
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "degree",
      "educationalLevel": "Bachelor",
      "name": "Bachelor of Podiatric Medicine"
    }
  ]
}
```

#### Service Area Schema

**Add to organization schema:**

```json
{
  "areaServed": [
    {
      "@type": "City",
      "name": "Booragoon"
    },
    {
      "@type": "City",
      "name": "Applecross"
    },
    {
      "@type": "City",
      "name": "Mount Pleasant"
    }
  ]
}
```

#### Breadcrumb Schema

**Add to detail pages:**

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

---

## Phase 3: AI Optimization & Monitoring (Future)

**Timeline: Ongoing**  
**Status: Post-implementation enhancement**

### 3.1 AI-Specific Features

#### Enhanced Feed Content

- Include full article content in feeds
- Add medical topic categorization
- Include related article suggestions
- Add content freshness indicators

#### Medical Disclaimers

**Structured format:**

```json
{
  "disclaimer": {
    "@type": "Text",
    "text": "This information is for educational purposes only and does not constitute medical advice."
  }
}
```

#### Content Licensing

```html
<meta name="copyright" content="© 2024 Foot Ankle Lower Limb" />
<meta name="license" content="All rights reserved" />
```

### 3.2 Analytics & Validation

#### Monitoring Tools Setup

1. Google Search Console integration
2. Schema markup validation automation
3. Feed validation monitoring
4. AI referral traffic tracking

#### Performance Metrics

- Rich results appearance rate
- AI-sourced traffic percentage
- Feed subscriber count
- Content extraction accuracy

---

## Technical Implementation Notes

### Database Considerations

- No schema changes required for Phase 1
- May need `blog_post.updated_at` for feed freshness
- Consider indexing for feed query performance

### Performance Considerations

- Cache feed responses (1-hour TTL)
- Use ISR for sitemap generation
- Optimize database queries for feed endpoints

### Security Considerations

- Rate limiting on feed endpoints
- Validate webhook signatures
- Sanitize content in feeds

### Testing Strategy

- Unit tests for feed generation
- Integration tests for schema validation
- Manual testing with Google Rich Results Test
- Feed validation with external tools

---

## Success Metrics

### Phase 1 Success Criteria

- ✅ RSS/JSON feeds accessible and valid
- ✅ All pages include enhanced schema markup
- ✅ LLMs.txt file guiding AI interactions
- ✅ Sitemap and robots.txt generate correctly
- ✅ Feed discovery links present on all pages

### Phase 2 Success Criteria

- ✅ Feeds update automatically when content changes
- ✅ Advanced schema markup passes validation
- ✅ API endpoints respond reliably

### Phase 3 Success Criteria

- ✅ Increased AI referral traffic
- ✅ Higher rich results appearance rate
- ✅ Improved content extraction accuracy

---

## Implementation Order

1. **RSS/JSON feed routes** - Core functionality
2. **LLMs.txt file** - AI guidance and context
3. **Schema markup enhancements** - SEO benefits
4. **Sitemap/robots.txt** - Discovery optimization
5. **Feed regeneration API** - Dynamic updates
6. **Advanced schema features** - Rich results
7. **AI-specific optimizations** - Future-proofing

This plan provides a structured approach to implementing comprehensive AI SEO optimization while maintaining site performance and user experience.
