import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as readline from 'readline';

const prisma = new PrismaClient();

async function updateFullClassNames(filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const [className, fullClassName] = line.split(':').map(part => part.trim());
    if (className && fullClassName) {
      try {
        await prisma.class.update({
          where: { className },
          data: { fullClassName },
        });
        console.log(`Updated ${className} with fullClassName: ${fullClassName}`);
      } catch (error) {
        console.error(`Error updating ${className}:`, error);
      }
    }
  }

  await prisma.$disconnect();
}

// Run the function
updateFullClassNames('fullClassNames.txt');