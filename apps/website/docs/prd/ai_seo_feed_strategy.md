# Content Discoverability and AI/SEO Optimization Implementation Plan

This document outlines the requirements for making our website content more accessible to search engines, AI assistants, and feed consumers. This includes structured data (schema markup), machine-readable feeds (JSON and RSS), and update strategies.

---

## 1. Schema Markup Strategy

### A. Objectives

- Help search engines and AI systems better understand our content
- Enable rich results in Google Search (e.g., stars, author, FAQ)
- Increase extractability by AI models (ChatGPT, Perplexity, etc.)
- Establish trust and credibility via structured metadata

### B. General Guidelines

- Use `JSON-LD` format for all structured data
- Embed schema in the `<head>` of each page or near the top of the `<body>`
- Ensure all structured data reflects visible content
- Follow both [Schema.org](https://schema.org) and [Google's structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/intro)

### C. Page Types and Schema Definitions

#### Blog Post Pages

- Schema Type: `BlogPosting`
- Required Fields:
  - `headline`
  - `author.name`
  - `datePublished`
  - `url`
  - `image` (if available)
- Optional but recommended:
  - `description`
  - `publisher`
  - `dateModified`

#### Team Page / Clinician Profiles

- Schema Type: `Person`
- Required Fields per person:
  - `name`
  - `jobTitle`
  - `worksFor.name`
- Optional:
  - `url`, `sameAs` (social links)

#### Practice Info / Contact Page

- Schema Type: `Organization` or `MedicalClinic` (if appropriate)
- Required:
  - `name`
  - `url`
  - `logo`
  - `address`
  - `telephone`
- Optional:
  - `founder`, `sameAs`, `description`

#### FAQ Page (if applicable)

- Schema Type: `FAQPage`
- Format: Array of Q&A objects with `@type: "Question"` and `acceptedAnswer`

---

## 2. JSON and RSS Feed Implementation

### A. Feed Objectives

- Provide a machine-readable summary of blog content
- Ensure discoverability by AI platforms and aggregators
- Serve as a public record of new or updated content

### B. Feed Endpoints

- RSS: `/rss.xml`
- JSON Feed (per https://jsonfeed.org): `/feed.json`
- Link in HTML `<head>` of all pages:

```html
<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/rss.xml" />
<link rel="alternate" type="application/json" title="JSON Feed" href="/feed.json" />
```

### C. Feed Content Requirements

- Limit to the 50 most recent published blog posts
- For each item/post include:
  - `title`
  - `url`
  - `summary` or short description
  - `datePublished`
  - `id` (unique identifier — e.g., post ID or slug)

For RSS:

- Use standard RSS 2.0 XML format
- Format `pubDate` as RFC 2822

For JSON:

- Use JSON Feed v1.1 format
- Format `date_published` as ISO 8601

---

## 3. Feed Regeneration Strategy

- Feeds should be **re-generated automatically** whenever a blog post is:
  - Created
  - Updated
  - Published or unpublished
- Options for regeneration:
  - Server-side API endpoint `/api/generate-feed` called from CMS or webhook
  - Supabase Edge Function or webhook to trigger a Next.js revalidation
  - Alternatively: generate feeds during Next.js build process if publish workflow is tied to build

---

## 4. Validation & Monitoring

- Use these tools to validate and test:
  - Google Rich Results Test: https://search.google.com/test/rich-results
  - Schema.org Validator: https://validator.schema.org
  - JSON Feed Validator: https://jsonfeedvalidator.org
  - RSS Feed Validator: https://validator.w3.org/feed/

---

## 5. Future-Proofing

- Ensure schema and feeds are accessible without login or rate limiting
- Keep structured data updated as the site evolves (e.g., new authors, new schema types)
- Review Google’s structured data updates quarterly

---

## 6. Optional Enhancements

- Add `<meta name="robots" content="max-snippet:-1, max-image-preview:large">`
- Add copyright/license metadata
- Provide a `sitemap.xml` and ensure feeds are linked from `robots.txt`

---
