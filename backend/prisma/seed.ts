// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Find Harshil's account
  const harshil = await prisma.user.findUnique({
    where: { email: "patelharshil2005@gmail.com" },
  });

  if (!harshil) {
    throw new Error(
      "❌ Harshil account not found. Please sign up first before seeding."
    );
  }

  // Create multiple trips for Harshil
  const tripsData = [
    {
      name: "Backpacking Through Europe",
      description: "Exploring cities, culture, and food across Europe.",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-20"),
      coverPhoto: "https://example.com/europe.jpg",
      stops: {
        create: [
          {
            city: "Paris",
            country: "France",
            startDate: new Date("2025-09-01"),
            endDate: new Date("2025-09-05"),
            activities: {
              create: [
                {
                  name: "Eiffel Tower Visit",
                  category: "Sightseeing",
                  cost: 25,
                  duration: 120,
                },
                {
                  name: "Louvre Museum",
                  category: "Museum",
                  cost: 15,
                  duration: 180,
                },
              ],
            },
          },
          {
            city: "Rome",
            country: "Italy",
            startDate: new Date("2025-09-06"),
            endDate: new Date("2025-09-10"),
            activities: {
              create: [
                {
                  name: "Colosseum Tour",
                  category: "Sightseeing",
                  cost: 30,
                  duration: 90,
                },
                {
                  name: "Vatican Museums",
                  category: "Museum",
                  cost: 20,
                  duration: 150,
                },
              ],
            },
          },
        ],
      },
      budget: {
        create: {
          transportCost: 500,
          stayCost: 800,
          activitiesCost: 90,
          mealsCost: 300,
          totalCost: 1690,
        },
      },
    },
    {
      name: "Beach Getaway in Thailand",
      description: "Relaxing beaches, scuba diving, and night markets.",
      startDate: new Date("2025-12-05"),
      endDate: new Date("2025-12-15"),
      coverPhoto: "https://example.com/thailand.jpg",
      stops: {
        create: [
          {
            city: "Phuket",
            country: "Thailand",
            startDate: new Date("2025-12-05"),
            endDate: new Date("2025-12-08"),
            activities: {
              create: [
                {
                  name: "Scuba Diving",
                  category: "Adventure",
                  cost: 100,
                  duration: 240,
                },
                {
                  name: "Patong Beach Night Market",
                  category: "Shopping",
                  cost: 50,
                  duration: 180,
                },
              ],
            },
          },
          {
            city: "Krabi",
            country: "Thailand",
            startDate: new Date("2025-12-09"),
            endDate: new Date("2025-12-15"),
            activities: {
              create: [
                {
                  name: "Island Hopping Tour",
                  category: "Adventure",
                  cost: 80,
                  duration: 360,
                },
                {
                  name: "Railay Beach Sunset",
                  category: "Relaxation",
                  cost: 0,
                  duration: 120,
                },
              ],
            },
          },
        ],
      },
      budget: {
        create: {
          transportCost: 400,
          stayCost: 600,
          activitiesCost: 230,
          mealsCost: 250,
          totalCost: 1480,
        },
      },
    },
  ];

  for (const tripData of tripsData) {
    await prisma.trip.create({
      data: {
        userId: harshil.id,
        ...tripData,
      },
    });
  }

  console.log("✅ Seeding complete. Multiple trips with stops & activities added.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
