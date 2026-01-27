# 🛒 GoCart Marketplace Backend — API Documentation

## Base URL

```

http://localhost:4000/api

```

---

# 👥 Roles

| Role     | Capabilities                       |
| -------- | ---------------------------------- |
| CUSTOMER | Browse products, place orders      |
| VENDOR   | Manage products, view their orders |
| ADMIN    | Approve vendors, moderate products |

---

# 🔐 Authentication Flow

### Register → Login → JWT Token

Token format:

```
Authorization: Bearer <ACCESS_TOKEN>
```

Used for all protected routes.

---

# 📦 API ROUTES

---

## 🧾 AUTH

### Register

**POST** `/auth/register`

```json
{
  "email": "user@test.com",
  "password": "password123"
}
```

---

### Login

**POST** `/auth/login`

Returns JWT token.

---

### Refresh Token

**POST** `/auth/refresh`

---

### Logout

**POST** `/auth/logout`

---

# 🏪 VENDOR

(Requires JWT)

---

### Apply as Vendor

**POST** `/vendor/apply`

```json
{
  "name": "Cool Shop",
  "slug": "cool-shop"
}
```

---

### Get My Vendor Profile

**GET** `/vendor/me`

---

### Update Vendor Profile

**PATCH** `/vendor/me`

```json
{
  "name": "Cool Shop Updated"
}
```

---

# 📦 PRODUCTS

---

### Public Product List

**GET** `/products`

Optional query:

```
?q=shirt&minPrice=100&maxPrice=500
```

---

### Public Product by ID

**GET** `/products/:id`

---

### Create Product (Vendor)

**POST** `/vendor/products`

```json
{
  "title": "Blue Shirt",
  "description": "Premium cotton shirt",
  "sku": "SHIRT-001",
  "price": 599,
  "stock": 20
}
```

---

### My Products (Vendor)

**GET** `/vendor/products`

---

### Update Product

**PATCH** `/vendor/products/:id`

```json
{
  "price": 549,
  "stock": 30,
  "status": "ACTIVE"
}
```

---

### Delete Product

**DELETE** `/vendor/products/:id`

---

# 👑 ADMIN

(Requires ADMIN role)

---

### List Vendors

**GET** `/admin/vendors`

Optional:

```
?status=PENDING
```

---

### Approve Vendor

**PATCH** `/admin/vendors/:id/approve`

---

### Suspend Vendor

**PATCH** `/admin/vendors/:id/suspend`

---

### Activate Product

**PATCH** `/admin/products/:id/activate`

---

### Block Product

**PATCH** `/admin/products/:id/block`

---

# 🛒 ORDERS

---

### Create Order

**POST** `/orders`

```json
{
  "items": [
    { "productId": "PRODUCT_ID", "qty": 2 }
  ],
  "shippingAddressJson": {
    "name": "John Doe",
    "address": "Dhaka"
  },
  "notes": "Deliver fast"
}
```

---

### My Orders

**GET** `/orders/me`

---

### Order By ID

**GET** `/orders/:id`

---

### Vendor Order Items

**GET** `/vendor/orders/items`

---

# ❤️ HEALTH

### Server Check

**GET** `/health`

---

# 🧪 Correct Testing Order (Important)

```
1. Register
2. Login
3. Apply Vendor
4. Make user ADMIN (Prisma Studio)
5. Approve Vendor
6. Create Product
7. Activate Product
8. Public Products
9. Create Order
10. My Orders
```

---

# 🧠 System Data Flow

```
User → Vendor (optional)
Vendor → Products
Customer → Orders
Order → OrderItems → Vendors
Admin → Moderation
```

---

# 📬 Postman Tips

Variables used:

```
baseUrl = http://localhost:4000/api
token   = JWT access token
```

Login request auto saves token.

---

# 🏗 Tech Stack

| Layer   | Tech              |
| ------- | ----------------- |
| Backend | NestJS            |
| ORM     | Prisma            |
| DB      | PostgreSQL        |
| Auth    | JWT + Refresh     |
| API     | REST              |
| Docs    | Swagger + Postman |

---

# 📈 Future Use Cases (Easy to Add)

• Payments (Stripe/Bkash)
• Product reviews
• Shipping tracking
• Vendor analytics
• Refund system
• Admin dashboards

---
