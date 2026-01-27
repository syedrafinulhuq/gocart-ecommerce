# API Design

apps/
  api/
    src/
      main.ts
      app.module.ts

      config/
        env.validation.ts
        configuration.ts

      common/
        constants/
          roles.enum.ts
          vendor-status.enum.ts
          product-status.enum.ts
          order-status.enum.ts
        decorators/
          roles.decorator.ts
          current-user.decorator.ts
        filters/
          all-exceptions.filter.ts
        guards/
          jwt-auth.guard.ts
          roles.guard.ts
          vendor-scope.guard.ts
        interceptors/
          response-transform.interceptor.ts
        pipes/
          zod-validation.pipe.ts   (optional)
        utils/
          pagination.ts

      prisma/
        prisma.module.ts
        prisma.service.ts

      auth/
        auth.module.ts
        auth.controller.ts
        auth.service.ts
        dto/
          register.dto.ts
          login.dto.ts
        strategies/
          jwt.strategy.ts
        guards/
          jwt-refresh.guard.ts
        types/
          jwt-payload.type.ts

      users/
        users.module.ts
        users.service.ts

      vendors/
        vendors.module.ts
        vendors.controller.ts
        vendors.service.ts
        dto/
          vendor-apply.dto.ts
          vendor-update.dto.ts

      products/
        products.module.ts
        products.controller.ts
        products.service.ts
        dto/
          product-create.dto.ts
          product-update.dto.ts
          product-query.dto.ts

      orders/
        orders.module.ts
        orders.controller.ts
        orders.service.ts
        dto/
          order-create.dto.ts

      admin/
        admin.module.ts
        admin.controller.ts
        admin.service.ts

      uploads/                 (optional)
        uploads.module.ts
        uploads.controller.ts
        uploads.service.ts

      health/
        health.module.ts
        health.controller.ts

    prisma/
      schema.prisma
      migrations/
    test/
      auth.e2e-spec.ts
      products.e2e-spec.ts

packages/
  shared/                     (optional, monorepo)
    src/
      types/
      validators/
