/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle"; // your drizzle instanc accounts, businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { verifyJWT } from "@/util/verify-token";
import { createBusinessSchema } from "@/db/validation/businesses/create-business";
import { formatZodErrors } from "@/db/validation/sendOtp";
import { accounts, businesses } from "@/db/schema";

// Zod schema for validation

export async function POST(req: NextRequest) {
  console.log("➡️ [API] /api/v1/businesses POST called");

  try {
    // 1. Extract and verify Authorization header
    const authHeader = req.headers.get("authorization");
    console.log("🔑 Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Missing or invalid token");
      return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log("✅ Extracted token:", token);

    let jwtPayload;
    try {
      jwtPayload = await verifyJWT(token);
      console.log("✅ JWT verified, payload:", jwtPayload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (jwtError: any) {
      console.log("❌ JWT verification failed:", jwtError.message);
      return NextResponse.json(errorResponse(jwtError.message), {
        status: 401,
      });
    }

    // 2. Parse request body
    const body = await req.json();
    console.log("📦 Raw request body:", body);

    // Validate input data
    const parsed = createBusinessSchema.safeParse(body);
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.issues);
      const fieldErrors = formatZodErrors(parsed.error.issues);
      return NextResponse.json(
        errorResponse("Validation failed", fieldErrors),
        { status: 400 },
      );
    }

    const data = parsed.data;
    console.log("✅ Parsed data:", data);

    // 4. Ensure account exists
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, data.accountId))
      .limit(1);

    console.log("🔍 Account lookup result:", account);

    if (!account) {
      console.log("❌ Account not found:", data.accountId);
      return NextResponse.json(errorResponse("Account not found"), {
        status: 404,
      });
    }

    // 5. Insert business
    console.log("📝 Inserting business into DB...");

    let primaryBusiness = false;

    const businessesData = await db.select().from(businesses).limit(1);

    // check if this is first business
    console.log("📝 checking if this is first business");

    if (businessesData.length === 0) {
      primaryBusiness = true;
    }

    const [newBusiness] = await db
      .insert(businesses)
      .values({
        accountId: data.accountId,
        businessName: data.businessName,
        pan: data.pan,
        phone: data.phoneNumber,
        businessEmail: data.businessEmail,
        registrationNumber: data.registrationNumber,
        businessAddress: data.address,
        businessSize: data.businessSize,
        tan: data.tan,
        gstin: data.gstin,
        primary: primaryBusiness,
      })
      .returning();

    console.log("✅ Business inserted:", newBusiness);

    // 6. Respond with created business
    return NextResponse.json(
      successResponse(newBusiness, "Business created successfully"),
      { status: 201 },
    );
  } catch (err: any) {
    console.error("🔥 Unexpected error in /api/v1/businesses:", err);
    return NextResponse.json(errorResponse("Internal server error"), {
      status: 500,
    });
  }
}
