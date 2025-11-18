import { db } from "./index";
import { users, products, orders } from "./schema";
import bcrypt from "bcryptjs";

/**
 * Seed script to populate the database with sample data
 * Run with: node --loader tsx server/db/seed.ts
 */

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(orders);
    await db.delete(products);
    await db.delete(users);

    // Create sample users (sellers)
    console.log("Creating sample users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const [user1] = await db
      .insert(users)
      .values({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: hashedPassword,
        phone: "0812345678",
        createdAt: new Date(),
      })
      .returning();

    const [user2] = await db
      .insert(users)
      .values({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: hashedPassword,
        phone: "0823456789",
        createdAt: new Date(),
      })
      .returning();

    console.log(`✅ Created ${2} users`);

    // Create sample products
    console.log("Creating sample products...");
    const sampleProducts = [
      {
        sellerId: user1.id,
        name: "Wireless Bluetooth Headphones",
        description:
          "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        price: 2499.0,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sellerId: user1.id,
        name: "Smart Watch Pro",
        description:
          "Feature-rich smartwatch with fitness tracking, heart rate monitor, and GPS.",
        price: 8999.0,
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sellerId: user2.id,
        name: "Portable Power Bank 20000mAh",
        description:
          "High-capacity power bank with fast charging support for all devices.",
        price: 899.0,
        imageUrl:
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500",
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sellerId: user2.id,
        name: "Mechanical Gaming Keyboard",
        description:
          "RGB backlit mechanical keyboard with customizable keys and macro support.",
        price: 3499.0,
        imageUrl:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sellerId: user1.id,
        name: "USB-C Hub 7-in-1",
        description:
          "Multi-port USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery.",
        price: 1299.0,
        imageUrl:
          "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500",
        stock: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const insertedProducts = await db
      .insert(products)
      .values(sampleProducts)
      .returning();
    console.log(`✅ Created ${insertedProducts.length} products`);

    // Create sample orders
    console.log("Creating sample orders...");
    const sampleOrders = [
      {
        productId: insertedProducts[0].id,
        customerName: "Alice Johnson",
        customerEmail: "alice@example.com",
        customerPhone: "0812345678",
        quantity: 1,
        totalAmount: insertedProducts[0].price,
        status: "pending" as const,
        createdAt: new Date(),
      },
      {
        productId: insertedProducts[1].id,
        customerName: "Bob Wilson",
        customerEmail: "bob@example.com",
        customerPhone: "0823456789",
        quantity: 2,
        totalAmount: insertedProducts[1].price * 2,
        status: "verified" as const,
        paymentSlipUrl: "https://example.com/slip1.jpg",
        verifiedAt: new Date(),
        verifiedBy: user1.id,
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        productId: insertedProducts[2].id,
        customerName: "Charlie Brown",
        customerEmail: "charlie@example.com",
        customerPhone: "0834567890",
        quantity: 3,
        totalAmount: insertedProducts[2].price * 3,
        status: "pending" as const,
        paymentSlipUrl: "https://example.com/slip2.jpg",
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
    ];

    const insertedOrders = await db
      .insert(orders)
      .values(sampleOrders)
      .returning();
    console.log(`✅ Created ${insertedOrders.length} orders`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\nSample credentials:");
    console.log("Email: john@example.com");
    console.log("Email: jane@example.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seed();
