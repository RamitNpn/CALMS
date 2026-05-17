# CALMS - Frontend Implementation Guide

## Overview

This document provides a comprehensive guide to the CALMS frontend implementation. The frontend is built with Next.js 16, React 19, TypeScript, TanStack Query, and React Hook Form.

## Architecture

### Technology Stack
- **Framework**: Next.js 16.2.4
- **Runtime**: React 19.2.4
- **Type Checking**: TypeScript 5
- **HTTP Client**: Axios
- **State Management**: TanStack Query (React Query)
- **Form Management**: React Hook Form
- **Validation**: Zod 4
- **UI Framework**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Store**: Zustand 5

### Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── pages/
│   │   ├── business/            # Business management
│   │   ├── staff/               # Staff/Users management
│   │   ├── clients/             # Clients/Students
│   │   ├── attendance/          # Attendance tracking
│   │   ├── invoices/            # Invoicing
│   │   ├── assets/              # Asset management
│   │   ├── schedules/           # Schedule management
│   │   └── layout.tsx           # Pages layout with sidebar
│   ├── auth/                    # Authentication pages
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/
│   ├── business/                # Business components
│   │   ├── BusinessPage.tsx     # Main container
│   │   ├── BusinessTable.tsx    # Data table
│   │   └── BusinessForm.tsx     # Form component
│   ├── staff/                   # Staff components
│   ├── client/                  # Client components
│   ├── attendance/              # Attendance components
│   ├── invoice/                 # Invoice components
│   ├── asset/                   # Asset components
│   ├── schedule/                # Schedule components
│   ├── shared/                  # Shared UI components
│   │   ├── DataTable.tsx        # Reusable pagination table
│   │   ├── FormModal.tsx        # Modal for forms
│   │   ├── FormField.tsx        # Form input field
│   │   ├── Button.tsx           # Button component
│   │   └── Pagination.tsx       # Pagination
│   └── layout/
│       └── Sidebar.tsx          # Navigation sidebar
├── libs/
│   ├── api/                     # API layer
│   │   ├── client.ts            # Axios client setup
│   │   ├── business.api.ts      # Business hooks
│   │   ├── staff.api.ts         # Staff hooks
│   │   ├── client.api.ts        # Client hooks
│   │   ├── attendance.api.ts    # Attendance hooks
│   │   ├── invoice.api.ts       # Invoice hooks
│   │   ├── asset.api.ts         # Asset hooks
│   │   └── schedule.api.ts      # Schedule hooks
│   ├── types/                   # TypeScript types
│   │   ├── business.types.ts
│   │   ├── staff.types.ts
│   │   ├── client.types.ts
│   │   ├── attendance.types.ts
│   │   ├── invoice.types.ts
│   │   ├── asset.types.ts
│   │   └── schedule.types.ts
│   └── validation/              # Validation schemas
└── provider/
    └── queryProvider.tsx        # React Query setup
```

## Key Components

### 1. DataTable Component
Reusable table component with pagination, sorting, and actions:

```typescript
<DataTable
  columns={columns}
  data={data}
  isLoading={isLoading}
  pageSize={10}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Features:**
- Server-side pagination
- Customizable columns
- Action buttons (edit, delete, view)
- Loading states
- Error handling
- Empty states

### 2. FormModal Component
Modal for displaying forms:

```typescript
<FormModal
  isOpen={isOpen}
  title="Create New Business"
  onClose={handleClose}
  size="lg"
>
  <BusinessForm onSubmit={handleSubmit} />
</FormModal>
```

**Features:**
- Responsive sizing (sm, md, lg, xl)
- Close button and overlay
- Sticky header
- Scrollable content

### 3. FormField Component
Unified form input component:

```typescript
<FormField
  label="Name"
  name="name"
  type="text"
  register={register}
  errors={errors}
  required
  placeholder="Enter name"
/>
```

**Features:**
- Input types: text, email, password, number, date, time, select, textarea
- Validation error display
- Help text
- Disabled state
- Required indicator

### 4. Button Component
Versatile button component:

```typescript
<Button variant="primary" size="md" isLoading={loading}>
  Save Changes
</Button>
```

**Variants:** primary, secondary, danger, outline
**Sizes:** sm, md, lg

## API Integration

### API Client Setup
```typescript
// libs/api/client.ts
const apiClient = new ApiClient();
// Handles:
// - Base URL configuration
// - Auth token injection
// - Error handling
// - CORS configuration
```

### Using React Query Hooks
```typescript
// Getting data
const { data, isLoading, error } = useGetAllBusinesses();

// Creating data
const mutation = useCreateBusiness();
mutation.mutate(data, {
  onSuccess: () => handleSuccess(),
  onError: () => handleError(),
});

// Updating data
const updateMutation = useUpdateBusiness(businessId);

// Deleting data
const deleteMutation = useDeleteBusiness();
```

### Features
- Automatic caching
- Automatic refetching on focus
- Optimistic updates
- Error toast notifications
- Success toast notifications
- Query invalidation on mutations

## Type Safety

### Zod Schemas
All forms have Zod validation schemas:

```typescript
export const createBusinessSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  plan: z.enum(["FREE", "BASIC", "PREMIUM"]).optional(),
});

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
```

### Benefits
- Type inference from schemas
- Server and client validation consistency
- Better IDE autocomplete
- Runtime validation

## Form Handling

### React Hook Form Setup
```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  watch,
} = useForm<CreateBusinessInput>({
  resolver: zodResolver(createBusinessSchema),
  defaultValues: initialData,
});
```

### Features
- Efficient re-renders
- Minimal bundle size
- Easy validation
- Built-in error handling

## State Management

### Server State (TanStack Query)
```typescript
// Automatic caching and synchronization
const { data } = useGetAllBusinesses();
```

### Client State (React Hooks)
```typescript
// Modal states, form states
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Optional: Zustand
For global client state (not used in current implementation but available):

```typescript
import { create } from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## Responsive Design

### Mobile-First Approach
```typescript
// Breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### Responsive Components
- Sidebar: Hamburger menu on mobile, full sidebar on desktop
- Tables: Horizontal scroll on mobile
- Forms: Full width on mobile, constrained on desktop
- Grid layouts: 1 column on mobile, multiple on desktop

## Error Handling

### Toast Notifications
```typescript
import toast from "react-hot-toast";

// Success
toast.success("Business created successfully!");

// Error
toast.error("Failed to create business");

// Custom
toast((t) => (
  <div>Custom notification</div>
));
```

### Error Boundaries
```typescript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Environment Configuration

### .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_API_TIMEOUT=30000
```

### Note
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never store secrets in NEXT_PUBLIC_ variables
- Use `.env.local` for local development
- Use `.env.production.local` for production

## Development Workflow

### 1. Create New Feature

```typescript
// 1. Define types (libs/types/feature.types.ts)
export const featureSchema = z.object({...});

// 2. Create API hooks (libs/api/feature.api.ts)
export const useGetAllFeatures = () => {...};

// 3. Create components
// - FeatureForm.tsx
// - FeatureTable.tsx
// - FeaturePage.tsx

// 4. Create page route (app/pages/feature/page.tsx)
export default function Page() {
  return <FeaturePage />;
}
```

### 2. Add Form Validation

```typescript
import { zodResolver } from "@hookform/resolvers/zod";

const { register, errors } = useForm({
  resolver: zodResolver(featureSchema),
});
```

### 3. Handle API Calls

```typescript
const mutation = useCreateFeature();
const { data } = useGetAllFeatures();
```

## Performance Optimization

### Code Splitting
- Next.js automatically code-splits at route level
- Dynamic imports for heavy components

### Image Optimization
- Use Next.js Image component for images
- Automatic lazy loading

### Query Optimization
- React Query caches by default
- Manual invalidation when needed
- Stale-while-revalidate

## Accessibility

### ARIA Labels
```typescript
<button aria-label="Close modal">
  <X />
</button>
```

### Keyboard Navigation
- Tab through form fields
- Escape to close modals
- Enter to submit forms

### Color Contrast
- Text: WCAG AA compliant
- Status indicators use text + color

## Testing

### Unit Tests (Jest + React Testing Library)
```typescript
describe("BusinessForm", () => {
  it("should submit form", () => {
    // Test implementation
  });
});
```

### E2E Tests (Playwright)
```typescript
test("should create business", async ({ page }) => {
  // Test implementation
});
```

## Deployment

### Build
```bash
npm run build
```

### Start
```bash
npm start
```

### Vercel
- Connect GitHub repository
- Auto-deploy on push
- Environment variables in Vercel dashboard

## Troubleshooting

### 1. API Not Connecting
```
Check:
- Backend is running on http://localhost:4000
- NEXT_PUBLIC_API_URL is correct
- CORS is configured on backend
- Network tab in browser dev tools
```

### 2. Data Not Loading
```
Check:
- React Query DevTools (installed automatically)
- API call in network tab
- Console for errors
- API endpoint paths are correct
```

### 3. Form Validation Not Working
```
Check:
- Zod schema is correctly defined
- zodResolver is passed to useForm
- FormField is connected to register
- Error object has correct path
```

### 4. Styling Issues
```
Check:
- Tailwind CSS build is working
- globals.css imports are correct
- No CSS conflicts
- Browser cache (hard refresh)
```

## Best Practices

✅ **Do:**
- Keep components small and focused
- Use React Query for server state
- Validate on both client and server
- Use TypeScript strictly
- Keep API logic separate from components
- Use semantic HTML

❌ **Don't:**
- Fetch data in components (use hooks)
- Mix server and client state
- Store sensitive data in localStorage
- Use inline styles
- Create very large components
- Ignore TypeScript errors
