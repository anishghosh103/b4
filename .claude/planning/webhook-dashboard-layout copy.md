# Plan: Replicate Dashboard Demo in Webhook Layout

## Overview
Replicate the dashboard layout structure into the webhook layout, with:
- Extracted reusable header component
- Webhook layout with sidebar + main content area (no card/glow)
- Different header content for dashboard vs webhook views

## Key Files

### Source (Reference)
- `app/page.tsx` (lines 469-755) - DashboardSection visual design
- `app/(app)/layout.tsx` - Current header to extract
- `components/features/event-stream.tsx` - DashboardEvent component (reuse)

### Target (To Modify/Create)
- `components/features/app-header.tsx` - **NEW** - Extracted header component
- `app/(app)/layout.tsx` - Simplify (remove header, keep shell)
- `app/(app)/dashboard/page.tsx` - Add header with current content
- `app/(app)/webhook/[id]/layout.tsx` - Add header + sidebar + main content
- `app/(app)/webhook/[id]/events/page.tsx` - Transform stub to use real data

## Implementation Steps

### 1. Create AppHeader Component
**File:** `components/features/app-header.tsx`

Reusable header with slots for left/right content:
```tsx
interface AppHeaderProps {
  left: ReactNode;   // Logo or webhook name
  right?: ReactNode; // Actions (theme switcher, user menu, etc.)
}
```

### 2. Update App Layout
**File:** `app/(app)/layout.tsx`

Remove the header, keep only the shell:
```tsx
export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background grid-bg mesh-gradient">
      {children}
    </div>
  );
}
```

### 3. Update Dashboard Page
**File:** `app/(app)/dashboard/page.tsx`

Add header with current content (logo, theme switcher, user menu):
```tsx
<>
  <AppHeader
    left={<Logo />}
    right={<><ThemeSwitcher /><UserMenu /></>}
  />
  <main className="max-w-6xl mx-auto px-6 py-8">
    <DashboardClient ... />
  </main>
</>
```

### 4. Update Webhook Layout (Main Change)
**File:** `app/(app)/webhook/[id]/layout.tsx`

Transform to have sidebar + main content:
- Fetch webhook data (server component)
- Header with webhook name + URL badge
- Sidebar (Events, Settings tabs)
- Main content area for children

```
WebhookLayout (server)
├── AppHeader
│   ├── left: Webhook name + divider
│   └── right: URL badge (success, pulse) + ThemeSwitcher + UserMenu
└── Flex Container (max-w-6xl mx-auto)
    ├── Sidebar (w-52, border-r, hidden on mobile)
    │   ├── Events tab (link to /webhook/[id]/events)
    │   └── Settings tab (disabled)
    └── Main Content Area (flex-1, p-6)
        └── {children}
```

### 5. Update Events Page
**File:** `app/(app)/webhook/[id]/events/page.tsx`

Fetch and display events using DashboardEvent:
```tsx
export default async function WebhookEventsPage({ params }) {
  // Fetch events for this webhook
  // Render event list with header "Recent Events" + Filter button
}
```

### 6. Data Mapping (Events)
| Event Model | DashboardEvent Prop | Transform |
|-------------|---------------------|-----------|
| `name` | `event` | Direct |
| webhook.name | `source` | From layout context |
| `createdAt` | `time` | Relative time |
| `responseStatus` | `status` | `< 400 ? 'success' : 'error'` |

## Component Structure

```
app/(app)/layout.tsx (shell only)
└── dashboard/page.tsx
    ├── AppHeader (logo, theme, user)
    └── DashboardClient

└── webhook/[id]/layout.tsx
    ├── AppHeader (webhook name, URL badge, theme, user)
    └── Flex Container
        ├── Sidebar (Events, Settings)
        └── Main Content → {children}
            └── events/page.tsx (event list)
```

## Files Changed Summary

| File | Action |
|------|--------|
| `components/features/app-header.tsx` | Create |
| `components/features/index.ts` | Add export |
| `app/(app)/layout.tsx` | Simplify (shell only) |
| `app/(app)/dashboard/page.tsx` | Add header |
| `app/(app)/webhook/[id]/layout.tsx` | Major update (header + sidebar) |
| `app/(app)/webhook/[id]/events/page.tsx` | Fetch real events |
