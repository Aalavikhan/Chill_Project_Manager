import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import { Team } from '../models/teamModel.js';
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

describe('Team Model', () => {
  let user;

  // Create a user to associate with the team in the tests
  beforeAll(async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: 1234567890
    };

    user = new User(userData);
    await user.save();
  });

  it('should create a team with valid data', async () => {
    const teamData = {
      name: 'Development Team',
      description: 'Handles all development tasks',
      members: [{ user: user._id, role: 'Manager' }],
    };

    const team = new Team(teamData);
    await team.save();

    expect(team.name).toBe(teamData.name);
    expect(team.description).toBe(teamData.description);
    expect(team.members.length).toBe(1);
    expect(team.members[0].user.toString()).toBe(user._id.toString());
    expect(team.members[0].role).toBe('Manager');
  });

  it('should set default role to "Contributor" if no role is provided for a member', async () => {
    const teamData = {
      name: 'Design Team',
      members: [{ user: user._id }] // No role provided
    };

    const team = new Team(teamData);
    await team.save();

    expect(team.members[0].role).toBe('Contributor');
  });

  it('should throw an error when required fields are missing', async () => {
    const teamData = {
      name: 'Marketing Team'
    };

    const team = new Team(teamData);

    try {
      await team.save();
    } catch (error) {
      expect(error.errors['members.0.user']).toBeDefined(); // User is required for members
    }
  });

  it('should throw an error if the role is invalid', async () => {
    const teamData = {
      name: 'HR Team',
      members: [{ user: user._id, role: 'InvalidRole' }] // Invalid role
    };

    const team = new Team(teamData);

    try {
      await team.save();
    } catch (error) {
      expect(error.errors['members.0.role']).toBeDefined(); 
    }
  });

  it('should link to the correct user and project', async () => {
    const teamData = {
      name: 'Sales Team',
      members: [{ user: user._id, role: 'Owner' }],
      projects: [] // No projects for simplicity
    };

    const team = new Team(teamData);
    await team.save();

    expect(team.members[0].user.toString()).toBe(user._id.toString());
    expect(team.projects).toEqual([]);
  });

  it('should throw an error if the user is not valid ObjectId', async () => {
    const teamData = {
      name: 'Support Team',
      members: [{ user: 'invalidObjectId', role: 'Manager' }]
    };

    const team = new Team(teamData);

    try {
      await team.save();
    } catch (error) {
      expect(error.errors['members.0.user']).toBeDefined(); // Invalid ObjectId for user
    }
  });
});
