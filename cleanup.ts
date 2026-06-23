import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  console.log("Removing seeded professionals...");
  const emails = [
    "juandelacruz@example.com", "mariasantos@example.com", "antonioluna@example.com", 
    "joserizal@example.com", "andresbonifacio@example.com", "emilioaguinaldo@example.com", 
    "gabrielasilang@example.com", "apolinariomabini@example.com", "melchoraaquino@example.com", 
    "marcelohdelpilar@example.com", "lapulapu@example.com", "diegosilang@example.com", "sultankudarat@example.com"
  ];
  
  await prisma.user.deleteMany({
    where: { email: { in: emails } }
  });
  
  console.log("Cleanup complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
