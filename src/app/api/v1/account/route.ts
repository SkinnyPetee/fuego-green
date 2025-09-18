// app/api/v1/account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { successResponse, errorResponse } from "@/lib/apiResponse";
import { formatZodErrors } from "@/db/validation/sendOtp";
import { createAccountSchema } from "@/db/validation/create-account";
import { verifyJWT } from "@/util/verify-token";

export async function POST(req: NextRequest) {
  try {
    console.log("Account creation request received");

    // Extract JWT token from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Missing or invalid authorization header");
      return NextResponse.json(errorResponse("Authorization token required"), {
        status: 401,
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT and extract user info
    const jwtPayload = await verifyJWT(token);
    console.log(`JWT verified for user: ${jwtPayload.email}`);

    // Parse request body
    const body = await req.json();
    console.log("Request body received:", {
      accountType: body.accountType,
      email: jwtPayload.email,
    });

    // Validate input data
    const parsed = createAccountSchema.safeParse(body);
    if (!parsed.success) {
      console.log("Validation failed:", parsed.error.issues);
      const fieldErrors = formatZodErrors(parsed.error.issues);
      return NextResponse.json(
        errorResponse("Validation failed", fieldErrors),
        { status: 400 },
      );
    }

    const accountData = parsed.data;
    console.log(`Creating account for user: ${jwtPayload.userId}`);

    // Check if user exists and is verified
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, jwtPayload.email))
      .limit(1);

    if (user.length === 0) {
      console.log(`User not found: ${jwtPayload.email}`);
      return NextResponse.json(errorResponse("User not found"), {
        status: 404,
      });
    }

    if (!user[0].emailVerified) {
      console.log(`User email not verified: ${jwtPayload.email}`);
      return NextResponse.json(errorResponse("User email not verified"), {
        status: 403,
      });
    }

    // Check if account already exists for this user
    const existingAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, user[0].id)) // Assuming user.id links to account
      .limit(1);

    if (existingAccount.length > 0) {
      console.log(`Account already exists for user: ${jwtPayload.email}`);
      return NextResponse.json(
        errorResponse("Account already exists for this user"),
        { status: 409 },
      );
    }

    // Create new account
    const newAccount = await db
      .insert(accounts)
      .values({
        // Note: You might need to link this to the user table
        // This assumes accounts.id should match users.id or you have a userId field
        accountType: accountData.accountType,
        organizationName: accountData.organizationName || null,
        organizationType: accountData.organizationType || null,
        title: accountData.title,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        address: accountData.address,
        phoneNumber: accountData.phoneNumber,
        contactMedium: accountData.contactMedium,
        userId: user[0].id,
      })
      .returning();

    console.log(`Account created successfully with ID: ${newAccount[0].id}`);

    // TODO: You might want to update the users table to link to the account
    // or create a separate user-account relationship

    // Return success response
    return NextResponse.json(
      successResponse(
        {
          accountId: newAccount[0].id,
          accountType: newAccount[0].accountType,
          email: jwtPayload.email,
          firstName: newAccount[0].firstName,
          lastName: newAccount[0].lastName,
        },
        "Account created successfully",
      ),
      { status: 201 },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Account creation error:", error);
    console.error("Error stack:", error.stack);

    // Handle specific error types
    if (
      error.message === "Invalid or expired token" ||
      error.message === "User email not verified"
    ) {
      return NextResponse.json(errorResponse(error.message), { status: 401 });
    }

    // Handle database constraint violations
    if (error.code === "23505") {
      // Unique violation
      return NextResponse.json(
        errorResponse("Account with this information already exists"),
        { status: 409 },
      );
    }

    if (error.code === "23514") {
      // Check constraint violation
      return NextResponse.json(
        errorResponse(
          "Invalid data: business accounts require organization details",
        ),
        { status: 400 },
      );
    }

    // Development error details
    if (process.env.NODE_ENV === "development") {
      console.error("Full error object:", JSON.stringify(error, null, 2));
    }

    return NextResponse.json(
      errorResponse(
        process.env.NODE_ENV === "development"
          ? `Error: ${error.message}`
          : "Account creation failed. Please try again.",
      ),
      { status: 500 },
    );
  }
}
