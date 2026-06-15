# Fall-Website Implementation Priorities

_Generated: August 9, 2025_

## Next Session Action Items

### 🎯 HIGH PRIORITY - Week 1 Tasks

#### 1. Schema.org Structured Data Implementation

**Impact**: Critical for AI discoverability  
**Effort**: High  
**Files to Create**:

```
src/components/schema/
├── OrganizationSchema.tsx    # MedicalClinic schema for homepage
├── PersonSchema.tsx          # Team member profiles
├── ServiceSchema.tsx         # Medical procedures/services
├── BlogPostSchema.tsx        # Article/BlogPosting schema
└── FAQSchema.tsx            # FAQ page schema
```

**Implementation Strategy**:

- Create reusable JSON-LD components
- Add to page layouts via Next.js `<head>`
- Include all required schema.org fields
- Validate with Google Rich Results Test

#### 2. Page Metadata Optimization

**Impact**: High - Search engine visibility  
**Effort**: Medium  
**Files to Modify**:

```
src/app/(public)/
├── layout.tsx               # Root layout meta tags
├── page.tsx                # Homepage meta
├── about/page.tsx          # About page meta
├── services/page.tsx       # Services listing meta
├── services/[slug]/page.tsx # Individual service meta
├── team/page.tsx           # Team listing meta
├── team/[id]/page.tsx      # Individual team member meta
├── blog/page.tsx           # Blog listing meta
├── blog/[slug]/page.tsx    # Blog post meta
└── contact/page.tsx        # Contact page meta
```

**Meta Tag Requirements per Page**:

```typescript
// Example for service pages
export const metadata = {
  title: '[Service Name] - Professional Treatment | FALL Clinic',
  description:
    'Expert [service] treatment at Foot Ankle Lower Limb Clinic. [Brief benefit description] Book your consultation today.',
  openGraph: {
    title: '[Service Name] Treatment | FALL Clinic',
    description: '[Service description for social sharing]',
    url: 'https://footanklelowerlimb.com.au/services/[slug]',
    siteName: 'Foot Ankle Lower Limb Clinic',
    images: [
      {
        url: '/images/services/[service-image].jpg',
        width: 1200,
        height: 630,
        alt: '[Service name] treatment at FALL Clinic',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '[Service Name] Treatment | FALL Clinic',
    description: '[Service description for Twitter]',
    images: ['/images/services/[service-image].jpg'],
  },
};
```

#### 3. Image Accessibility Audit

**Impact**: High - Legal compliance + SEO  
**Effort**: Medium  
**Process**:

1. Run automated scan for missing alt text
2. Add descriptive alt text for:
   - Team member photos: "Dr. [Name], Podiatrist at FALL Clinic"
   - Service images: "[Service name] treatment procedure illustration"
   - Facility photos: "FALL Clinic reception area" / "Treatment room"
   - Blog images: Context-specific descriptions

#### 4. Public Feeds Creation

**Impact**: High - AI crawler access  
**Effort**: High  
**Files to Create**:

```
src/app/api/
├── rss.xml/route.ts         # RSS 2.0 feed generator
├── feed.json/route.ts       # JSON Feed generator
└── sitemap.xml/route.ts     # XML sitemap generator
```

**Feed Content Requirements**:

- Last 50 blog posts
- Service pages (static content)
- Team member pages
- Auto-regeneration on content updates
- Proper date formatting (RFC 2822 for RSS, ISO 8601 for JSON)

### 🔧 MEDIUM PRIORITY - Week 2 Tasks

#### 5. Google Tag Manager Migration & Analytics Integration

**Priority**: HIGH - Preserve existing tracking setup

**Migration Tasks**:

1. **Audit Current GTM Container**
   - Access existing GTM for old footanklelowerlimb.com.au site
   - Export container configuration
   - Document all tags, triggers, and variables
   - Note custom JavaScript and data layer implementations

2. **Clone to New Website**
   - Import/recreate GTM configuration
   - Update triggers for new site structure
   - Preserve all conversion tracking
   - Maintain GA4 and Meta Pixel setups

**Files to Create**:

```
src/components/analytics/
├── GoogleTagManager.tsx     # GTM container implementation
├── DataLayer.tsx           # Data layer push events
├── ConversionTracking.tsx  # Custom conversion events
└── AnalyticsProvider.tsx   # Unified tracking provider
```

**Events to Track** (via GTM):

- Contact form submissions
- Phone number clicks (tel: links)
- Booking button interactions (Cliniko)
- Service page engagement
- Newsletter signups

#### 6. Analytics Testing Strategy

**Testing Plan**:

1. **GTM Debug Mode** - Preview & test all tags
2. **GA4 DebugView** - Real-time event validation
3. **Meta Pixel Helper** - Facebook pixel verification
4. **Cross-browser Testing** - Multiple browsers/devices
5. **Data Validation** - Compare with old site metrics

**Required Tools**:

- GTM Preview mode
- GA4 DebugView
- Facebook Pixel Helper extension
- Google Tag Assistant
- Browser DevTools Network tab

#### 7. Performance Optimization

**Tasks**:

- Core Web Vitals audit
- Image format optimization (WebP)
- JavaScript bundle analysis
- Lazy loading implementation
- Critical resource preloading

### 📊 LOW PRIORITY - Week 3 Tasks

#### 8. Content Structure Enhancement

- Add TL;DR summaries to service pages
- Improve heading hierarchy consistency
- Internal linking between related content
- Topic cluster organization

#### 9. Trust Signal Implementation

- Professional credentials display
- Business verification badges
- Patient testimonial integration (if available)
- Professional association memberships

## Implementation Guidelines

### Code Quality Standards

1. **TypeScript**: Strict mode compliance
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Performance**: Core Web Vitals "Good" ratings
4. **SEO**: All markup validated
5. **Testing**: Schema and feed validation

### Component Patterns

```typescript
// Schema component example
interface SchemaProps {
  data: {
    name: string;
    description: string;
    // ... other required fields
  };
}

export function MedicalClinicSchema({ data }: SchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": data.name,
    "description": data.description,
    // ... complete schema implementation
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Validation Checklist

Before each deployment:

- [ ] Schema.org markup validated
- [ ] Google Rich Results test passing
- [ ] Feed validators confirm format
- [ ] Mobile-friendly test passing
- [ ] Core Web Vitals in green
- [ ] All images have alt text
- [ ] Meta descriptions under 160 characters

## Success Metrics

### Technical Metrics

- **Schema Coverage**: 100% of public pages
- **Meta Tag Compliance**: All pages have title/description
- **Image Accessibility**: 100% alt text coverage
- **Feed Validation**: RSS and JSON feeds error-free
- **Performance**: Core Web Vitals all "Good"

### Business Metrics (Post-Launch)

- **Contact Form Conversions**: Track submission rates
- **Phone Engagement**: Click-to-call tracking
- **Service Page Engagement**: Time on page, scroll depth
- **Local Search Visibility**: Google My Business insights
- **AI Citations**: Monitor mentions in AI tools

## Resource Requirements

### Development Time Estimates

- **Schema Implementation**: 8-12 hours
- **Meta Tag Optimization**: 4-6 hours
- **Image Audit**: 3-4 hours
- **Feed Creation**: 6-8 hours
- **Analytics Integration**: 4-6 hours
- **Testing & Validation**: 4-6 hours

**Total Estimated Time**: 29-42 hours across 3 weeks

### External Dependencies

- **GA4 Account Setup**: Client responsibility
- **Meta Business Account**: Client responsibility
- **Professional Images**: May need photography
- **Content Review**: Medical accuracy verification

## Risk Mitigation

### Technical Risks

- **Performance Impact**: Monitor Core Web Vitals during implementation
- **Schema Errors**: Validate all markup before deployment
- **Analytics Accuracy**: Test tracking in staging environment

### Business Risks

- **Medical Accuracy**: Review all content claims
- **Legal Compliance**: Ensure privacy policy covers new tracking
- **Patient Expectations**: Set appropriate service descriptions

## Next Session Prep

### Required Information

1. **GA4 Measurement ID** (if available)
2. **Meta Pixel ID** (if available)
3. **Business Information** verification (address, phone, hours)
4. **Professional Credentials** to highlight
5. **Service Pricing** (if to be displayed publicly)

### Recommended Tools Setup

- Google Search Console account
- Schema.org validator bookmarks
- Core Web Vitals testing setup
- Feed validation tools ready

This implementation plan prioritizes high-impact SEO and AI discoverability improvements while maintaining the website's current functionality and user experience.
