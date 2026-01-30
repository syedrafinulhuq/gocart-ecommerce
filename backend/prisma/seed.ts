import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Password for all seeded users
    const password = await bcrypt.hash("password123", 10);

    // 1️⃣ ADMIN
    const admin = await prisma.user.upsert({
        where: { email: "admin@gocart.com" },
        update: {},
        create: {
            email: "admin@gocart.com",
            role: "ADMIN",
            passwordHash: password,
        },
    });

    // 2️⃣ VENDOR USER
    const vendorUser = await prisma.user.upsert({
        where: { email: "vendor@gocart.com" },
        update: {},
        create: {
            email: "vendor@gocart.com",
            role: "VENDOR",
            passwordHash: password,
        },
    });

    // 3️⃣ VENDOR (APPROVED)
    // First, try to find the vendor by a unique field (e.g., slug or id). For this example, we'll use slug.
    const vendor = await prisma.vendor.upsert({
        where: { slug: "gocart-demo-vendor" },
        update: {
            status: "APPROVED",
        },
        create: {
            name: "GoCart Demo Vendor",
            slug: "gocart-demo-vendor",
            status: "APPROVED",
            ownerUserId: vendorUser.id,
        },
    });

    // 4️⃣ PRODUCT (ACTIVE)
    await prisma.product.create({
        data: {
            title: "Demo T-Shirt",
            description: "High quality cotton T-shirt",
            price: 1200,
            stock: 50,
            status: "ACTIVE",
            vendorId: vendor.id,
        },
    });

    console.log("✅ Seeding completed");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
