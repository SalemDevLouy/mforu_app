# نظام نسب الفئات - Category Rates System

## المفهوم الأساسي

كل صالون يحدد نسبة مختلفة لكل فئة خدمة. هذه النسبة تحدد كم سيحصل الموظف من سعر الخدمة.

## أمثلة على النسب

- **قص شعر**: 1/3 (0.33)
- **صبغة**: 1/4 (0.25)
- **حلاقة ذقن**: 1/2 (0.5)
- **فرد شعر**: 1/5 (0.2)

## كيفية الحساب

### حالة 1: موظف واحد
```
سعر الخدمة = 3000 دج
النسبة للفئة (قص شعر) = 1/3
دخل الموظف = 3000 × 0.33 = 1000 دج
```

### حالة 2: موظفان (تقسيم متساوي)
```
سعر الخدمة = 3000 دج
النسبة للفئة (قص شعر) = 1/3
إجمالي للموظفين = 3000 × 0.33 = 1000 دج
لكل موظف = 1000 ÷ 2 = 500 دج
```

### حالة 3: ثلاثة موظفين
```
سعر الخدمة = 6000 دج
النسبة للفئة (صبغة) = 1/4
إجمالي للموظفين = 6000 × 0.25 = 1500 دج
لكل موظف = 1500 ÷ 3 = 500 دج
```

## جدول CategoryRate

```prisma
model CategoryRate {
  rate_id     String   @id @default(uuid())
  salon_id    String
  cat_id      String
  rate        Float    // النسبة من 0 إلى 1
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  salon       Salon      @relation(...)
  category    Categories @relation(...)

  @@unique([salon_id, cat_id])
}
```

## مثال عملي في الكود

```typescript
// عند إنشاء خدمة جديدة مع موظفين

// 1. جلب النسبة للفئة في هذا الصالون
const categoryRate = await prisma.categoryRate.findUnique({
  where: {
    salon_id_cat_id: {
      salon_id: "salon_id_here",
      cat_id: "category_id_here"
    }
  }
});

// 2. حساب إجمالي المبلغ للموظفين
const totalForEmployees = servicePrice * (categoryRate?.rate || 0);

// 3. تقسيم على عدد الموظفين
const employeeIds = ["emp1", "emp2"];
const amountPerEmployee = totalForEmployees / employeeIds.length;

// 4. إنشاء SubTask لكل موظف
for (const emp_id of employeeIds) {
  await prisma.subTask.create({
    data: {
      service_id: serviceId,
      emp_id: emp_id,
      cat_id: categoryId,
      sub_price: amountPerEmployee
    }
  });
}
```

## API Endpoints

### GET /api/admin/category-rates?salon_id=xxx
جلب جميع النسب لصالون معين

### POST /api/admin/category-rates
إضافة نسبة جديدة
```json
{
  "salon_id": "xxx",
  "cat_id": "xxx",
  "rate": 0.33
}
```

### PUT /api/admin/category-rates
تحديث نسبة موجودة
```json
{
  "rate_id": "xxx",
  "rate": 0.5
}
```

### DELETE /api/admin/category-rates?rate_id=xxx
حذف نسبة

## واجهة المستخدم

الصفحة: `/admin/dashboard/category-rates`

**الميزات:**
- اختيار الصالون
- عرض جميع النسب المحددة
- إضافة/تعديل/حذف النسب
- عرض النسب كأرقام عشرية وككسور (1/3، 1/4، إلخ)
- تنبيهات وملاحظات توضيحية

## الأمان

- فقط admin of system يمكنه إدارة النسب
- كل صالون له نسب خاصة به
- النسبة يجب أن تكون بين 0 و 1
- لا يمكن تكرار نسبة لنفس الصالون ونفس الفئة (unique constraint)
