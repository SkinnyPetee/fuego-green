import jwt from "jsonwebtoken";

// JWT payload type
export interface JWTPayload {
  userId: string;
  email: string;
  verified: boolean;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // Additional validation
    if (!decoded.verified) {
      throw new Error("User email not verified");
    }

    if (decoded.iss !== "Fuego App") {
      throw new Error("Invalid token issuer");
    }

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}
