# Design System Documentation

## Overview
This design system ensures consistent UI/UX across all pages in the Save Point application, following patterns established in the Habit Dashboard.

## Core Principles

### 1. Layout Structure
- **PageContainer**: Wraps entire page with `min-h-screen bg-dark-900`
- **MainContent**: Consistent padding (`pt-14 sm:pt-20 lg:pt-32 pb-16 lg:pb-12 px-3 sm:px-4 lg:px-6`) and max-width (`sm:max-w-7xl sm:mx-auto`)
- **PageHeader**: Standardized header with title, description, and action button
- **Section**: Glass-effect containers for content sections

### 2. Spacing
- Mobile: `px-3`, `gap-3`, `mb-4`
- Tablet: `sm:px-4`, `sm:gap-4`, `sm:mb-6`
- Desktop: `lg:px-6`, `lg:gap-6`, `lg:mb-8`

### 3. Typography
- Page Title: `text-2xl sm:text-3xl lg:text-4xl font-bold text-white`
- Section Title: `text-xl sm:text-2xl font-bold text-white`
- Body Text: `text-sm sm:text-base text-gray-400`
- Small Text: `text-xs sm:text-sm text-gray-500`

### 4. Colors & Visual States
- **Completed**: `bg-emerald-500` with checkmark
- **Missed**: `bg-rose-500/70`
- **Today/Pending**: `bg-amber-500` with ring highlight
- **Future**: `bg-dark-700/50` disabled
- **Selected**: `ring-2 ring-primary-400`
- **Not Created**: `bg-blue-500/20` disabled

### 5. Interactive Elements
- **Buttons**: 
  - Primary: `px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl`
  - Secondary: `px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl`
  - Icon: `w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10`
- **Touch Targets**: Minimum 44px × 44px
- **Hover States**: `hover:bg-white/10 transition-colors`
- **Active States**: `active:scale-95` for touch feedback

### 6. Cards & Containers
- **Glass Effect**: `glass` class (background, backdrop-filter, border)
- **Rounded Corners**: `rounded-xl` for cards, `rounded-lg` for buttons
- **Padding**: `p-4 sm:p-6` for cards

### 7. Scrollbars
- **Custom Scrollbar**: `.custom-scrollbar` class
- **Hidden Scrollbar**: `.hide-scrollbar` class for header containers
- Thin, rounded, dark theme with primary color thumb

### 8. Empty States
- Consistent icon, title, description, and action button
- Uses `EmptyState` component from `pageLayout.jsx`

### 9. Loading States
- Consistent spinner using `LoadingSpinner` component
- `w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin`

### 10. Error Messages
- `bg-red-500/10 border border-red-500/30 rounded-xl text-red-400`
- Uses `ErrorMessage` component

## Usage Examples

### Basic Page Structure
```jsx
import { PageContainer, MainContent, PageHeader, ErrorMessage, LoadingSpinner } from '../utils/pageLayout';

const MyPage = () => {
  if (loading) return <LoadingSpinner />;
  
  return (
    <PageContainer>
      <AppHeader />
      <AppNavigation />
      <MainContent>
        <PageHeader 
          title="My Page 📊"
          description="Page description"
          actionLabel="Add Item"
          actionOnClick={handleAdd}
        />
        <ErrorMessage message={error} />
        {/* Page content */}
      </MainContent>
    </PageContainer>
  );
};
```

### Empty State
```jsx
<EmptyState
  icon="📅"
  title="No items"
  description="Get started by adding your first item"
  actionLabel="Add Item"
  actionOnClick={handleAdd}
/>
```

## Responsive Breakpoints
- Mobile: Default (< 640px)
- Tablet: `sm:` (≥ 640px)
- Desktop: `lg:` (≥ 1024px)

## Accessibility
- Touch targets: Minimum 44px × 44px
- Focus states: Ring with primary color
- ARIA labels on interactive elements
- Semantic HTML structure
