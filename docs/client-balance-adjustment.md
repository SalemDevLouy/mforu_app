# Client Balance Adjustment System

## Overview
The client balance adjustment system allows salon managers to manage client finances by adding debts or processing payments. The system automatically handles debt reconciliation when payments are made.

## Features

### 1. Balance Adjustment Types

#### Credit (دفعة - تقليل الدين)
- Records a payment from the client
- Automatically pays off debts using FIFO (First In, First Out) strategy
- Pays oldest debts first
- Supports partial payments
- Creates credit balance if payment exceeds total debt

#### Debit (دين جديد - زيادة الدين)
- Adds a new debt entry for the client
- Can include optional expiry date
- Creates a pending debt record

### 2. Automatic Debt Reconciliation

When processing a credit payment:
1. System retrieves all pending debts for the client
2. Sorts debts by registration date (oldest first)
3. Applies payment to oldest debts until:
   - All debts are paid, OR
   - Payment amount is exhausted
4. If payment exceeds total debt:
   - Creates a negative debt record (credit balance)
   - Client can use this credit for future services

### 3. Balance Status Tracking

The system tracks three balance states:
- **Debtor (مدين)**: Client has outstanding debts (positive balance)
- **Creditor (دائن)**: Client has credit balance (negative balance)
- **Balanced (متوازن)**: No debts or credits (zero balance)

## API Endpoints

### POST /api/salon/clients/[client_id]/balance

Adjust client balance by adding debt or credit.

**Request Body:**
```json
{
  "amount": 100.00,
  "type": "credit" | "debit",
  "date_exp": "2024-12-31" // Optional, only for debits
}
```

**Response (Credit):**
```json
{
  "success": true,
  "message": "تم إضافة رصيد بنجاح",
  "paidDebts": [
    {
      "debt_id": "xxx",
      "amount": 50.00,
      "status": "paid"
    },
    {
      "debt_id": "yyy",
      "amount": 30.00,
      "status": "partially_paid",
      "remaining": 20.00
    }
  ],
  "paidAmount": 100.00,
  "remainingCredit": 20.00
}
```

**Response (Debit):**
```json
{
  "success": true,
  "message": "تم إضافة دين بنجاح",
  "debt": {
    "debt_id": "zzz",
    "amount": 100.00,
    "type": "debit"
  }
}
```

### GET /api/salon/clients/[client_id]/balance

Get client balance summary.

**Response:**
```json
{
  "success": true,
  "balance": {
    "total": 150.00,
    "pendingDebts": 150.00,
    "creditBalance": 0,
    "status": "debtor"
  }
}
```

## UI Features

### Balance Adjustment Modal

Location: `/app/salon/clients/page.tsx`

**Components:**
- Operation type selector (Credit/Debit)
- Amount input field
- Expiry date (for debits only)
- Current debt summary display
- Context-aware help text

**Access:**
- Button: "ضبط الرصيد" (Adjust Balance) in client table
- Color-coded submit button:
  - Green for credit payments
  - Orange for new debts

## Use Cases

### Scenario 1: Client Makes Payment
1. Client has 3 debts: 50 (Jan 1), 30 (Jan 5), 20 (Jan 10)
2. Manager adds credit of 60
3. System:
   - Pays 50 debt in full (Jan 1 debt)
   - Pays 10 of 30 debt (Jan 5 debt becomes 20)
   - Shows: paid 1 debt, partially paid 1 debt

### Scenario 2: Client Overpays
1. Client has 1 debt: 50
2. Manager adds credit of 100
3. System:
   - Pays 50 debt in full
   - Creates credit balance of 50
   - Future services can deduct from this credit

### Scenario 3: Add New Service Debt
1. Client receives service worth 75
2. Manager adds debit of 75
3. System creates pending debt
4. Optional: Set expiry date for payment

## Database Schema

### Debt Records
- **Positive debt_val**: Client owes money (pending)
- **Negative debt_val**: Client has credit (paid status)
- **Status**: "pending" (unpaid) or "paid" (paid/credit)

## Notes for Developers

### Mock IDs Currently Used
- `salon_id`: "cm5gzkdni0000wvjf1yb06hgg" (hardcoded)
- Replace with actual session data in production

### Future Enhancements
- Payment history log
- Receipt generation for payments
- SMS/Email notifications for payments
- Automatic debt reminders based on expiry dates
- Bulk payment processing
- Payment method tracking (cash/card/transfer)

## Testing Checklist

- [ ] Add credit to client with no debts (should create credit balance)
- [ ] Add credit equal to total debt (should clear all debts)
- [ ] Add credit less than total debt (should pay oldest debts first)
- [ ] Add credit more than total debt (should create credit balance)
- [ ] Add new debt with expiry date
- [ ] Add new debt without expiry date
- [ ] Verify balance status changes correctly
- [ ] Test with multiple pending debts
- [ ] Test partial payment scenarios
