import { DataSource } from 'typeorm';
import { UserOrmEntity } from '../../infrastructure/persistence/typeorm/entities/user.orm-entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'banking-app',
  entities: [UserOrmEntity],
  synchronize: false,
});

async function seed() {
  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const userRepository = dataSource.getRepository(UserOrmEntity);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed');
      return;
    }

    // Create sample users
    const sampleUsers = [
      {
        username: 'john_doe',
        email: 'john.doe@example.com',
      },
      {
        username: 'jane_smith',
        email: 'jane.smith@example.com',
      },
    ];

    await userRepository.save(sampleUsers);
    console.log('Sample users created successfully');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed(); 