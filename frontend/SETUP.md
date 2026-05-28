# Frontend Environment Configuration

## Environment Variables

Create a `.env.local` file in the frontend root directory with the following:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Database
NEXT_PUBLIC_DB_HOST=localhost
NEXT_PUBLIC_DB_PORT=27017
```

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Access the Application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
frontend/
├── app/
│   ├── pages/              # Main admin pages
│   │   ├── business/       # Business/Tenant management
│   │   ├── staff/          # Staff/Users management
│   │   ├── clients/        # Clients/Students management
│   │   ├── attendance/     # Attendance tracking
│   │   ├── invoices/       # Invoice management
│   │   ├── assets/         # Asset management
│   │   ├── schedules/      # Schedule management
│   │   └── layout.tsx      # Pages layout with sidebar
│   ├── auth/               # Authentication pages
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── business/           # Business components
│   ├── staff/              # Staff components
│   ├── client/             # Client components
│   ├── attendance/         # Attendance components
│   ├── invoice/            # Invoice components
│   ├── asset/              # Asset components
│   ├── schedule/           # Schedule components
│   ├── shared/             # Shared UI components
│   │   ├── DataTable.tsx   # Reusable data table
│   │   ├── FormModal.tsx   # Form modal component
│   │   ├── FormField.tsx   # Form field component
│   │   └── Button.tsx      # Button component
│   └── layout/
│       └── Sidebar.tsx     # Navigation sidebar
├── libs/
│   ├── api/                # API hooks and client
│   │   ├── client.ts       # API client setup
│   │   ├── business.api.ts # Business API hooks
│   │   ├── staff.api.ts    # Staff API hooks
│   │   ├── client.api.ts   # Client API hooks
│   │   ├── attendance.api.ts
│   │   ├── invoice.api.ts
│   │   ├── asset.api.ts
│   │   └── schedule.api.ts
│   ├── types/              # TypeScript types
│   │   ├── business.types.ts
│   │   ├── staff.types.ts
│   │   ├── client.types.ts
│   │   ├── attendance.types.ts
│   │   ├── invoice.types.ts
│   │   ├── asset.types.ts
│   │   └── schedule.types.ts
│   └── validation/         # Zod schemas
└── provider/
    └── queryProvider.tsx   # React Query provider
```

## Key Features

### 1. **Type Safety**
- Full TypeScript support
- Zod validation schemas
- Type inference from API contracts

### 2. **Data Management**
- TanStack Query (React Query) for server state management
- Automatic caching and refetching
- Optimistic updates

### 3. **Form Handling**
- React Hook Form for efficient form management
- Validation at form level
- Error handling and display

### 4. **Modular Components**
- Reusable DataTable component with pagination
- FormModal for all create/edit operations
- FormField for consistent form inputs

### 5. **Responsive Design**
- Mobile-first approach
- Tailwind CSS for styling
- Responsive sidebar navigation

### 6. **API Integration**
- Centralized API client with axios
- Automatic token management
- Error handling and toast notifications

## Available Pages

### Business Management
- **Route**: `/pages/business`
- **Features**: Create, read, update, delete businesses
- **Fields**: Name, Slug, Plan, Modules, Branding

### Staff Management
- **Route**: `/pages/staff`
- **Features**: Manage staff members
- **Fields**: Name, Email, Phone, Role, Business Assignment

### Client/Student Management
- **Route**: `/pages/clients`
- **Features**: Manage clients and students
- **Fields**: Name, Phone, Photo, Documents, Tags

### Attendance Management
- **Route**: `/pages/attendance`
- **Features**: Record and track attendance
- **Fields**: Date, Check-in/Out times, User, Method (QR/Manual)

### Invoice Management
- **Route**: `/pages/invoices`
- **Features**: Create and manage invoices
- **Fields**: Client, Items, Amount, Status, Due Date

### Asset Management
- **Route**: `/pages/assets`
- **Features**: Track assets and equipment
- **Fields**: Name, Type, Identifier, Assigned To, Status

### Schedule Management
- **Route**: `/pages/schedules`
- **Features**: Create and manage schedules
- **Fields**: Title, Start/End Time, Staff/Client, Status

## API Integration

All components use TanStack Query hooks for data management:

```typescript
// Example: Getting all businesses
const { data: businesses, isLoading, error } = useGetAllBusinesses();

// Example: Creating a business
const createMutation = useCreateBusiness();
createMutation.mutate(data);

// Example: Updating a business
const updateMutation = useUpdateBusiness(businessId);
updateMutation.mutate(updatedData);

// Example: Deleting a business
const deleteMutation = useDeleteBusiness();
deleteMutation.mutate(businessId);
```

## Form Validation

All forms use Zod schemas for client-side validation:

```typescript
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  // ... more fields
});

const { register, handleSubmit, errors } = useForm({
  resolver: zodResolver(schema),
});
```

## Styling

- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Responsive**: Mobile-first design
- **Colors**: Blue-based theme with semantic colors (red for danger, green for success, etc.)

## Building for Production

```bash
npm run build
# or
pnpm build
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:4000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### Form Validation Not Working
- Ensure zod schema is correctly defined



- Check FormField component is connected to react-hook-form
- Verify form resolver is set correctly

### Data Not Loading
- Check React Query DevTools in browser
- Verify API endpoints match backend routes
- Check network tab in browser developer tools
