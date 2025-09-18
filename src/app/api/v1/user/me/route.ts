import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle"; // your drizzle instance
import { users, accounts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { verifyJWT } from "@/util/verify-token";
import type { TMe } from "@/modules/auth/user/actions"; // import your type if you have it

export async function GET(req: NextRequest) {
  console.log("➡️ Incoming /api/v1/user/me request");

  try {
    const authHeader = req.headers.get("authorization");
    console.log("🔍 Authorization header:", authHeader);

    if (!authHeader?.startsWith("Bearer ")) {
      console.warn("❌ Missing or malformed Authorization header");
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔑 Extracted JWT:", token);

    const payload = await verifyJWT(token);
    console.log("📦 Decoded payload:", payload);

    if (!payload) {
      console.warn("❌ Invalid or expired token");
      return NextResponse.json(errorResponse("Invalid or expired token"), {
        status: 401,
      });
    }

    console.log("🛠 Fetching user with ID:", payload.userId);
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    console.log("👤 User query result:", user);

    if (!user) {
      console.warn("❌ User not found in DB");
      return NextResponse.json(errorResponse("User not found"), {
        status: 404,
      });
    }

    console.log("🛠 Fetching account for user ID:", user.id);
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.id))
      .limit(1);

    console.log("🏦 Account query result:", account);

    if (!account) {
      console.warn("❌ Account not found for user");
      return NextResponse.json(errorResponse("Account not found"), {
        status: 404,
      });
    }

    // 🔹 Shape into TMe
    const responseData: TMe = {
      user: {
        email: user.email,
        emailVerified: user.emailVerified,
        accountVerified: user.accountVerified,
      },
      account: {
        id: account.id,
        accountType: account.accountType as "individual" | "business",
        firstName: account.firstName,
        lastName: account.lastName,
        phoneNumber: account.phoneNumber,
        contactMedium: account.contactMedium as "email" | "phone",
      },
    };

    console.log("✅ Successfully shaped user and account into TMe");

    return NextResponse.json(
      successResponse(responseData, "Fetched user and account successfully"),
      { status: 200 },
    );
  } catch (err) {
    console.error("💥 Unexpected error in /api/v1/user/me:", err);
    return NextResponse.json(errorResponse("Internal server error"), {
      status: 500,
    });
  }
}
