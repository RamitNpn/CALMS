# CALMS Frontend - Quick Reference

## 📍 File Locations

### To Add a New Module (e.g., "Reports")

1. **Types** → `libs/types/reports.types.ts`
2. **API Hooks** → `libs/api/reports.api.ts`
3. **Form Component** → `components/reports/ReportsForm.tsx`
4. **Table Component** → `components/reports/ReportsTable.tsx`
5. **Page Component** → `components/reports/ReportsPage.tsx`
6. **Route Page** → `app/pages/reports/page.tsx`
7. **Add to Sidebar** → `components/layout/Sidebar.tsx`

---

## 🔧 Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

---

## 📝 Code Templates

### Creating a New Type File
```typescript
// libs/types/module.types.ts
import { z } from "zod";

export const moduleSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  // ... other fields
});

export type Module = z.infer<typeof moduleSchema>;

// Create and Update schemas
export const createModuleSchema = z.object({
  name: z.string().min(1),
  // ... fields without _id
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;
```

### Creating a New API Hook File
```typescript
// libs/api/module.api.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { Module, CreateModuleInput } from "@/libs/types/module.types";
import toast from "react-hot-toast";

const MODULE_QUERY_KEY = ["modules"];

export const useGetAllModules = () => {
  return useQuery({
    queryKey: MODULE_QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.getAllModules();
      return response as Module[];
    },
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateModuleInput) => {
      return await apiClient.createModule(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MODULE_QUERY_KEY });
      toast.success("Module created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create");
    },
  });
};

// ... similar for update and delete
```

### Creating a New Form Component
```typescript
// components/module/ModuleForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createModuleSchema, CreateModuleInput } from "@/libs/types/module.types";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";

interface ModuleFormProps {
  initialData?: any;
  isLoading: boolean;
  onSubmit: (data: CreateModuleInput) => void;
}

export function ModuleForm({
  initialData,
  isLoading,
  onSubmit,
}: ModuleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateModuleInput>({
    resolver: zodResolver(createModuleSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Name"
        name="name"
        placeholder="Enter name"
        register={register}
        errors={errors}
        required
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" type="reset">
          Reset
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading}>
          {initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
```

### Creating a New Table Component
```typescript
// components/module/ModuleTable.tsx
"use client";

import React from "react";
import { Module } from "@/libs/types/module.types";
import { DataTable, TableColumn } from "@/components/shared/DataTable";

interface ModuleTableProps {
  modules: Module[];
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (module: Module) => void;
  onDelete?: (module: Module) => void;
}

export function ModuleTable({
  modules,
  isLoading,
  error,
  onEdit,
  onDelete,
}: ModuleTableProps) {
  const columns: TableColumn<Module>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Created Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={modules}
      isLoading={isLoading}
      error={error}
      onEdit={onEdit}
      onDelete={onDelete}
      pageSize={10}
    />
  );
}
```

### Creating a New Page Component
```typescript
// components/module/ModulePage.tsx
"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  useGetAllModules,
  useCreateModule,
  useUpdateModule,
  useDeleteModule,
} from "@/libs/api/module.api";
import { Button } from "@/components/shared/Button";
import { FormModal } from "@/components/shared/FormModal";
import { ModuleForm } from "@/components/module/ModuleForm";
import { ModuleTable } from "@/components/module/ModuleTable";
import { Module, CreateModuleInput } from "@/libs/types/module.types";

export function ModulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const { data: modules = [], isLoading, error } = useGetAllModules();
  const createMutation = useCreateModule();
  const updateMutation = useUpdateModule(editingModule?._id || "");
  const deleteMutation = useDeleteModule();

  const handleOpenModal = (module?: Module) => {
    setEditingModule(module || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
  };

  const handleSubmit = (data: CreateModuleInput) => {
    if (editingModule) {
      updateMutation.mutate(data, {
        onSuccess: () => handleCloseModal(),
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => handleCloseModal(),
      });
    }
  };

  const handleDelete = (module: Module) => {
    if (confirm(`Are you sure?`)) {
      deleteMutation.mutate(module._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
          <p className="text-gray-600 mt-1">Manage all modules</p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="gap-2"
        >
          <Plus size={20} />
          New Module
        </Button>
      </div>

      <div className="bg-white rounded-lg p-6 border">
        <ModuleTable
          modules={modules}
          isLoading={isLoading}
          error={error?.message}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      <FormModal
        isOpen={isModalOpen}
        title={editingModule ? "Edit Module" : "Create New Module"}
        onClose={handleCloseModal}
        size="lg"
      >
        <ModuleForm
          initialData={editingModule}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </FormModal>
    </div>
  );
}
```

---

## 🎨 Component Props Reference

### DataTable Props
```typescript
interface TableProps<T> {
  columns: TableColumn<T>[];      // Column definitions
  data: T[];                       // Data rows
  isLoading?: boolean;             // Loading state
  error?: string | null;           // Error message
  pageSize?: number;               // Items per page (default: 10)
  onEdit?: (row: T) => void;       // Edit callback
  onDelete?: (row: T) => void;     // Delete callback
  onView?: (row: T) => void;       // View callback
  actions?: boolean;               // Show action buttons (default: true)
}
```

### FormField Props
```typescript
interface FormFieldProps {
  label: string;                   // Field label
  name: string;                    // Field name (for form)
  type?: string;                   // Input type (default: "text")
  placeholder?: string;            // Placeholder text
  register: UseFormRegister;       // React Hook Form register
  errors: FieldErrors;             // Form errors
  required?: boolean;              // Required indicator
  helpText?: string;               // Help text
  disabled?: boolean;              // Disabled state
  options?: Array<{value, label}>; // Select options
}
```

### Button Props
```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "outline"; // Style variant
  size?: "sm" | "md" | "lg";                                 // Size
  isLoading?: boolean;                                        // Loading state
  children: React.ReactNode;                                  // Button text
  onClick?: () => void;                                       // Click handler
  // ... standard HTML button props
}
```

### FormModal Props
```typescript
interface FormModalProps {
  isOpen: boolean;                              // Modal visibility
  title: string;                                // Modal title
  onClose: () => void;                          // Close callback
  children: React.ReactNode;                    // Modal content
  size?: "sm" | "md" | "lg" | "xl";             // Modal size
}
```

---

## 🔄 Mutation Usage Pattern

```typescript
// 1. Get the mutation hook
const mutation = useCreateBusiness();

// 2. Use the mutation
<Button
  onClick={() => mutation.mutate(formData)}
  isLoading={mutation.isPending}
>
  Create
</Button>

// 3. Alternative: With callbacks
mutation.mutate(formData, {
  onSuccess: (data) => {
    console.log("Success!", data);
    // Do something on success
  },
  onError: (error) => {
    console.log("Error!", error);
    // Handle error (toast already shown by hook)
  },
});
```

---

## 📊 Query Usage Pattern

```typescript
// 1. Get the query
const { data, isLoading, error, refetch } = useGetAllBusinesses();

// 2. Render based on state
if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;
if (!data) return <div>No data</div>;

// 3. Use the data
<DataTable data={data} isLoading={isLoading} error={error?.message} />

// 4. Manual refetch
<button onClick={() => refetch()}>Refresh</button>
```

---

## 🎨 Tailwind CSS Classes Reference

```typescript
// Colors
bg-blue-500, text-blue-600, border-blue-200
bg-red-500, text-red-600, border-red-200
bg-green-500, text-green-600, border-green-200
bg-gray-500, text-gray-600, border-gray-200

// Sizing
w-full, w-1/2, w-64, p-4, m-2, px-4, py-2

// Responsive
md:w-1/2, lg:flex, sm:hidden

// States
hover:bg-blue-600, focus:outline-none, disabled:opacity-50

// Layouts
flex, grid, grid-cols-3, gap-4, space-y-2
```

---

## 🐛 Debug Helpers

### React Query DevTools
Already installed. Use:
```typescript
// In browser
// Look for the floating React Query button to inspect queries and mutations
```

### Console Logging
```typescript
console.log("Data:", data);
console.log("Error:", error);
console.log("Is Loading:", isLoading);
```

### Network Tab
1. Open DevTools → Network
2. Perform action
3. Look for API calls
4. Check request/response

### Form Debugging
```typescript
// Add to form to debug values
console.log(watch());
```

---

## ✅ Checklist for Adding New Module

- [ ] Create types file with Zod schemas
- [ ] Create API client methods in `libs/api/client.ts`
- [ ] Create API hooks file
- [ ] Create Form component
- [ ] Create Table component
- [ ] Create Page component
- [ ] Create route page in `app/pages`
- [ ] Add to Sidebar navigation
- [ ] Test all CRUD operations
- [ ] Test validation
- [ ] Test responsive design
- [ ] Test error handling

---

## 🚀 Tips & Tricks

### Reuse Existing Components
```typescript
// Don't create new buttons, use the shared Button
import { Button } from "@/components/shared/Button";

// Don't create new tables, extend DataTable
import { DataTable } from "@/components/shared/DataTable";
```

### Keep Components Small
```typescript
// ❌ Bad: 500+ lines
export function HugeComponent() { ... }

// ✅ Good: 100-200 lines, split into smaller parts
export function ComponentContainer() { ... }
export function ComponentTable() { ... }
export function ComponentForm() { ... }
```

### Use TypeScript Strict Mode
```typescript
// Always define types explicitly
function handleSubmit(data: CreateBusinessInput): void { ... }

// Avoid any
// ❌ const data: any = ...
// ✅ const data: Business[] = ...
```

### Always Validate Input
```typescript
// Use Zod schemas for all forms
const schema = z.object({
  name: z.string().min(1, "Name required"),
});

// Don't skip validation
// ❌ No validation
// ✅ Always validate with schemas
```

---

## 📞 Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit

# Format code
npx prettier --write .

# Lint code
npm run lint
```

---

## 🎯 Performance Tips

1. Use `React.memo` for expensive components
2. Use `useCallback` for event handlers
3. Lazy load images with Next.js Image component
4. Enable code splitting with dynamic imports
5. Use React Query's built-in caching
6. Avoid inline styles (use Tailwind classes)

---

**Last Updated:** May 2026
**Version:** 1.0.0
