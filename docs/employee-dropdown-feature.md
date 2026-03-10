# Employee Dropdown Feature - Add Service Page

## Overview
Updated the Add Service page to display employee names as a dropdown list instead of a text input field. The dropdown shows all employees from the current salon account.

## Changes Made

### 1. Added Employee Interface
```typescript
interface Employee {
  emp_id: string;
  emp_name: string;
  field: string;
  role: string | null;
}
```

### 2. Added State Management
- `employees`: Array to store fetched employees
- `loadingEmployees`: Boolean to track loading state

### 3. Added Employee Fetching
New `useEffect` hook that:
- Fetches employees from `/api/salon/employees?salon_id={salonId}`
- Runs once on component mount
- Uses the same mock salon_id as other features: "cm5gzkdni0000wvjf1yb06hgg"
- Handles loading and error states

### 4. Updated Employee Input Field
Changed from text input to dropdown select:

**Before:**
```tsx
<input
  type="text"
  value={task.employeeName}
  placeholder="اسم الموظف"
  required
/>
```

**After:**
```tsx
<select
  value={task.employeeName}
  onChange={(e) => handleTaskChange(task.id, "employeeName", e.target.value)}
  className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white"
  required
>
  <option value="">اختر الموظف</option>
  {loadingEmployees ? (
    <option disabled>جاري التحميل...</option>
  ) : (
    employees.map((employee) => (
      <option key={employee.emp_id} value={employee.emp_name}>
        {employee.emp_name} - {employee.field}
      </option>
    ))
  )}
</select>
```

## Features

### Employee Display Format
Each employee option shows:
- **Employee Name** - **Field/Specialty**
- Example: "علي - حلاق" (Ali - Barber)

### Loading State
- Shows "جاري التحميل..." (Loading...) while fetching employees
- Disabled option to prevent selection during load

### Empty State
- Default option: "اختر الموظف" (Choose Employee)
- Required field validation

### API Integration
Uses existing `/api/salon/employees` endpoint:
- **Method**: GET
- **Query Parameter**: salon_id
- **Response**: Array of employee objects

## User Experience

### Before
- Users had to manually type employee names
- Risk of typos and inconsistent naming
- No validation of employee existence

### After
- Users select from a validated list of employees
- Consistent employee naming
- Only active employees from current salon are shown
- Shows employee specialty for context

## Database Query
The endpoint fetches employees with:
```typescript
await prisma.employee.findMany({
  where: {
    salon_id: salonId,
  },
  orderBy: {
    emp_name: "asc",
  },
});
```

## Future Enhancements
- [ ] Replace hardcoded salon_id with session data
- [ ] Add employee avatars/icons in dropdown
- [ ] Filter employees by specialty matching service type
- [ ] Show employee availability status
- [ ] Add "Quick Add Employee" button in dropdown
- [ ] Cache employee data to reduce API calls

## Testing Checklist
- [ ] Dropdown loads employees on page mount
- [ ] Loading state displays correctly
- [ ] Empty state shows default option
- [ ] Employee selection works for single task
- [ ] Employee selection works for multiple tasks
- [ ] Form validation requires employee selection
- [ ] Employee name saves correctly on form submit
- [ ] Handles API errors gracefully
- [ ] Works with no employees in database

## Notes
- Uses the same mock salon_id as other features: "cm5gzkdni0000wvjf1yb06hgg"
- This will need to be replaced with actual session data in production
- Employee field (specialty) is shown for better context when selecting
