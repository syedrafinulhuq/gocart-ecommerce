frontend/
  app/
    layout.tsx
    page.tsx
    product/[id]/page.tsx

    (auth)/
      login/page.tsx
      register/page.tsx

    (vendor)/
      vendor/layout.tsx
      vendor/dashboard/page.tsx
      vendor/products/page.tsx
      vendor/orders/page.tsx

    (admin)/
      admin/layout.tsx
      admin/dashboard/page.tsx
      admin/vendors/page.tsx
      admin/products/page.tsx

  components/
    Navbar.tsx
    Sidebar.tsx
    Protected.tsx
    ProductCard.tsx
    Toast.tsx

  lib/
    api.ts
    auth.ts
    types.ts

  hooks/
    useAuth.ts
