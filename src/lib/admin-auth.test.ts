import { describe, expect, test } from "bun:test";
import { isAdminRole, sanitizeRedirectPath } from "./admin-auth";

describe("isAdminRole", () => {
  test("accepts only the admin role", () => {
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("farmer")).toBe(false);
    expect(isAdminRole("moderator")).toBe(false);
    expect(isAdminRole(null)).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });
});

describe("sanitizeRedirectPath", () => {
  test("keeps same-origin relative paths", () => {
    expect(sanitizeRedirectPath("/rates")).toBe("/rates");
    expect(sanitizeRedirectPath("/farmers/f1?tab=quality")).toBe("/farmers/f1?tab=quality");
  });

  test("falls back to the dashboard for missing or unsafe values", () => {
    expect(sanitizeRedirectPath(undefined)).toBe("/");
    expect(sanitizeRedirectPath(null)).toBe("/");
    expect(sanitizeRedirectPath("")).toBe("/");
    expect(sanitizeRedirectPath("//evil.example")).toBe("/");
    expect(sanitizeRedirectPath("https://evil.example/login")).toBe("/");
    expect(sanitizeRedirectPath("rates")).toBe("/");
  });
});
