import { connectDB } from "../utils/dbConfig";
import mongoose from "mongoose";
import { describe, it, expect, vi } from "vitest";

vi.mock("mongoose");

describe("connectDB", () => {
  it("logs success on successful DB connection", async () => {
    mongoose.connect.mockResolvedValue({ connection: { host: "mock-host" } });
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Database connection successfull. Host: mock-host"
    );
  });

  it("logs error on failed DB connection", async () => {
    const error = new Error("fail");
    mongoose.connect.mockRejectedValue(error);
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await connectDB();

    expect(consoleSpy).toHaveBeenCalledWith("Database error : ", error);
  });
});
