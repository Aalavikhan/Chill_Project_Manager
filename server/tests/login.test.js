import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import supertest from "supertest";
import { app } from "../app.js";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import * as jwtConfig from "../utils/jwtConfig.js";


vi.mock("bcryptjs");
vi.mock("../models/userModel.js");
vi.mock("../utils/jwtConfig.js");

describe("POST /api/auth/login", () => {
  let request;
  
  beforeEach(() => {
    request = supertest(app);
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it("should return 400 if credentials are missing", async () => {
    // missing pass
    const responseNoPassword = await request.post("/api/auth/login").send({
      email: "test@example.com"
    });
    
    expect(responseNoPassword.status).toBe(400);
    expect(responseNoPassword.body.msg).toBe("Invalid credentials");
    
    // missing email
    const responseNoEmail = await request.post("/api/auth/login").send({
      password: "password123"
    });
    
    expect(responseNoEmail.status).toBe(400);
    expect(responseNoEmail.body.msg).toBe("Invalid credentials");
  });
  
  it("should return 400 if account doesn't exist", async () => {
    // (user doesn't exist)
    User.findOne = vi.fn().mockResolvedValue(null);
    
    const response = await request.post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123"
    });
    
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Account doesn't exist");
    expect(User.findOne).toHaveBeenCalledWith({ email: "nonexistent@example.com" });
  });
  
  it("should return 400 if password is incorrect", async () => {
    // Mock a user with a password
    const mockUser = {
      _id: "userId123",
      email: "test@example.com",
      name: "Test User",
      role: "user",
      password: "hashedPassword"
    };
    
    // Mock User.findOne to return mock user
    User.findOne = vi.fn().mockResolvedValue(mockUser);
    
    // Mock bcrypt.compare to return false (password doesn't match)
    bcrypt.compare = vi.fn().mockResolvedValue(false);
    
    const response = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword"
    });
    
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Invalid credentials");
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedPassword");
  });
  
  it("should return 200 and user data on successful login", async () => {
    // Mock a user with a password
    const mockUser = {
      _id: "userId123",
      email: "test@example.com",
      name: "Test User",
      role: "user",
      password: "hashedPassword"
    };
    
    // Mock User.findOne 
    User.findOne = vi.fn().mockResolvedValue(mockUser);
    
    // Mock bcrypt.compare 
    bcrypt.compare = vi.fn().mockResolvedValue(true);
    
    // Mock generateJWT function
    jwtConfig.generateJWT = vi.fn().mockImplementation((userId, res) => {
      res.cookie("jwt", "mock-token", {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict", 
        secure: false
      });
      return "mock-token";
    });
    
    const response = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123"
    });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: mockUser._id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role
    });
    
    // Verify  mocks were called correctly
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
    expect(jwtConfig.generateJWT).toHaveBeenCalledWith(mockUser._id, expect.any(Object));
  });
  
  it("should return 500 if an error occurs during login", async () => {
    // Mock User.findOne to throw an error
    User.findOne = vi.fn().mockRejectedValue(new Error("DB error"));
    
    const response = await request.post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123"
    });
    
    expect(response.status).toBe(500);
    expect(response.body.msg).toBe("internal server error");
  });
});