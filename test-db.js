const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  try {
    const prisma = new PrismaClient();

    // Test the connection
    console.log('Testing database connection...');
    const users = await prisma.user.findMany();
    console.log('✅ Connection successful!');
    console.log(`Found ${users.length} users in the database`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
