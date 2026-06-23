import 'dotenv/config';
import { Profession, VerificationStatus, Role } from '@prisma/client';
import { prisma } from './src/lib/prisma';

const professions = [
  "ARCHITECT",
  "CIVIL_ENGINEER",
  "STRUCTURAL_ENGINEER",
  "ELECTRICAL_ENGINEER",
  "MECHANICAL_ENGINEER",
  "CONTRACTOR",
  "INTERIOR_DESIGNER",
  "LANDSCAPE_ARCHITECT",
  "SURVEYOR",
  "QUANTITY_SURVEYOR",
  "PROJECT_MANAGER",
  "CONSTRUCTION_CONSULTANT",
  "BUILDING_INSPECTOR"
] as Profession[];

const names = [
  "Juan Dela Cruz", "Maria Santos", "Antonio Luna", "Jose Rizal", "Andres Bonifacio", 
  "Emilio Aguinaldo", "Gabriela Silang", "Apolinario Mabini", "Melchora Aquino", 
  "Marcelo H. del Pilar", "Lapu-Lapu", "Diego Silang", "Sultan Kudarat"
];

const cities = ["Makati", "Quezon City", "Taguig", "Pasig", "Cebu City", "Davao City", "Manila", "Pasay"];

async function main() {
  console.log("Seeding professionals...");

  for (let i = 0; i < professions.length; i++) {
    const prof = professions[i];
    const name = names[i];
    const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`;
    const city = cities[i % cities.length];
    const province = city === "Cebu City" ? "Cebu" : city === "Davao City" ? "Davao del Sur" : "Metro Manila";

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          role: Role.PROFESSIONAL,
          emailVerified: true,
        }
      });
      console.log(`Created user: ${name}`);
    }

    // Check if profile exists
    let profile = await prisma.professionalProfile.findUnique({
      where: { userId: user.id }
    });

    if (!profile) {
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          profession: prof,
          city,
          province,
          yearsExperience: Math.floor(Math.random() * 15) + 3,
          verificationStatus: VerificationStatus.APPROVED, // MUST BE APPROVED to show on landing page
          isPublic: true, // MUST BE TRUE to show on landing page
          totalRating: 4 + Math.random(),
          reviewCount: Math.floor(Math.random() * 50) + 5,
          completedProjects: Math.floor(Math.random() * 30) + 10,
          responseRate: Math.floor(Math.random() * 20) + 80, // 80-100%
          avgResponseHours: Math.floor(Math.random() * 12) + 1,
          aboutMe: `I am a highly experienced ${prof.replace('_', ' ').toLowerCase()} with a passion for delivering quality results.`,
        }
      });
      console.log(`Created professional profile for: ${prof}`);
    } else {
      // Update existing to ensure they show up
      await prisma.professionalProfile.update({
        where: { userId: user.id },
        data: {
          verificationStatus: VerificationStatus.APPROVED,
          isPublic: true,
        }
      });
      console.log(`Updated profile for: ${prof}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
