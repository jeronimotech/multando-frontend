// Default to mock data ONLY if explicitly set to "true"
// In production (Railway), NEXT_PUBLIC_USE_MOCK_DATA is not set -> defaults to false
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
