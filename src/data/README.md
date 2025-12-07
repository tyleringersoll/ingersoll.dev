# Content Management

This directory contains the static content for the site, managed as JSON files.

## Content Structure

Content is defined in `content.json` and follows this structure:

```typescript
{
  content: {
    meta: {
      name: string,        // Site owner name
      tag: string          // Tagline HTML
    },
    navigation: Array<{
      name: string,        // Display name
      url: string          // Route URL
    }>,
    home: Array<Article>,
    development: Array<Article>,
    projects: Array<Article>,
    music: Array<Article>,
    icons: {
      close: string        // SVG markup for close icon
    },
    footer: {
      socialHeading: string,
      socialIcons: Array<{
        svg: string,       // SVG markup
        alt: string,       // Alt text
        url: string,       // Link URL
        title?: string    // Optional title
      }>,
      legal: Array<string> // Legal text paragraphs (can contain HTML)
    }
  }
}
```

### Article Structure

```typescript
{
  heading: string,         // Article heading
  headingLevel?: number,    // Heading level (1-6), defaults to 3
  content: Array<string>,   // Content paragraphs (can contain HTML)
  contentStyle?: string,   // Content style, e.g., 'inline'
  component?: string       // Optional component name to render
}
```

## Editing Content

1. Edit `content.json` directly
2. Content is validated on load - invalid structure will show errors in console
3. Changes are version controlled in Git
4. Deploy to see changes live

## Benefits of Local JSON

- ✅ **Performance**: Content is bundled at build time, no API calls
- ✅ **Simplicity**: No external dependencies or services
- ✅ **Version Control**: Full content history in Git
- ✅ **Cost**: No ongoing service fees
- ✅ **Reliability**: No external API dependencies
- ✅ **Build Optimization**: Content can be tree-shaken and optimized

## Content Validation

The store automatically validates content structure on load. Required fields:
- `meta.name`
- `navigation` (must be array)
- `footer.socialHeading`
- `footer.socialIcons` (must be array)

Invalid content will log errors and prevent the site from loading corrupted data.

