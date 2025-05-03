import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import supertest from "supertest";
import { app } from "../app.js";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import * as jwtConfig from "../utils/jwtConfig.js";

vi.mock("bcryptjs");
vi.mock("../models/userModel.js");
vi.mock("../utils/jwtConfig.js");

describe("POST /api/auth/signup", () => {
  let request;
  
  beforeEach(() => {
    request = supertest(app);
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it("should return 400 if required fields are missing", async () => {
    const response = await request.post("/api/auth/signup").send({
      email: "test@example.com",
      password: "password123",
      phone: "1234567890"
    });
    
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("All fields are required");
  });
  
  it("should return 400 if password is too short", async () => {
    const response = await request.post("/api/auth/signup").send({
      email: "test@example.com",
      name: "Test User",
      password: "123",
      phone: "1234567890"
    });
    
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Password length must be at least 6 characters or more");
  });
  
  it("should return 400 if user already exists", async () => {
   
    User.findOne = vi.fn().mockResolvedValue({ _id: "existingUserId" });
    
    const response = await request.post("/api/auth/signup").send({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
      phone: "1234567890"
    });
    
    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("User already exists");
  });
  
  it("should return 200 and user data on successful signup", async () => {
    
    User.findOne = vi.fn().mockResolvedValue(null);
    
    
    bcrypt.genSalt = vi.fn().mockResolvedValue("salt");
    bcrypt.hash = vi.fn().mockResolvedValue("hashedPassword");
    

    const mockUser = {
      _id: "newUserId",
      email: "test@example.com",
      name: "Test User",
      role: "user",
      password: "hashedPassword",
      phone: "1234567890",
      save: vi.fn().mockResolvedValue(true)
    };
    
    
    User.mockImplementation(() => mockUser);
    
    
    jwtConfig.generateJWT = vi.fn().mockImplementation((userId, res) => {
      res.cookie("jwt", "mock-token", {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict", 
        secure: false
      });
      return "mock-token";
    });
    
    const response = await request.post("/api/auth/signup").send({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
      phone: "1234567890"
    });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: mockUser._id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role
    });
    
   
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", "salt");
    expect(jwtConfig.generateJWT).toHaveBeenCalledWith(mockUser._id, expect.any(Object));
    expect(mockUser.save).toHaveBeenCalled();
  });
  
  it("should return 500 if an error occurs during signup", async () => {
   
    User.findOne = vi.fn().mockRejectedValue(new Error("DB error"));
    
    const response = await request.post("/api/auth/signup").send({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
      phone: "1234567890"
    });
    
    expect(response.status).toBe(500);
    expect(response.body.msg).toBe("Internal server error");
  });
});