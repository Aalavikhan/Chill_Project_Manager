import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Setup MongoDB In-Memory Server
let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model', () => {
  it('should create a user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: 1234567890
    };

    const user = new User(userData);
    await user.save();

    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.phone).toBe(userData.phone);
    expect(user.role).toBe('Member'); // Default role
  });

  it('should throw an error when required fields are missing', async () => {
    const userData = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
      phone: 9876543210
    };

    const userWithoutPhone = new User({ ...userData, phone: undefined });

    try {
      await userWithoutPhone.save();
    } catch (error) {
      expect(error.errors.phone).toBeDefined();
    }
  });

  it('should throw an error if email is not unique', async () => {
    const userData1 = {
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
      password: 'password123',
      phone: 1122334455
    };
    const userData2 = {
      name: 'Bob Johnson',
      email: 'alice.smith@example.com', // Same email as userData1
      password: 'password123',
      phone: 9988776655
    };

    const user1 = new User(userData1);
    await user1.save();

    const user2 = new User(userData2);

    try {
      await user2.save();
    } catch (error) {
      expect(error.code).toBe(11000); // Mongoose duplicate key error code
    }
  });

  it('should set default value for role when not provided', async () => {
    const userData = {
      name: 'Mark Turner',
      email: 'mark.turner@example.com',
      password: 'password123',
      phone: 1231231234
    };

    const user = new User(userData);
    await user.save();

    expect(user.role).toBe('Member');
  });

  it('should validate the role enum', async () => {
    const userData = {
      name: 'Tom Green',
      email: 'tom.green@example.com',
      password: 'password123',
      phone: 1112223333,
      role: 'Admin' // Invalid role, not in ['Manager', 'Member']
    };

    const user = new User(userData);

    try {
      await user.save();
    } catch (error) {
      expect(error.errors.role).toBeDefined();
    }
  });
});
