import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/lib/models/Waitlist";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingEntry = await Waitlist.findOne({ email: email.toLowerCase() });
    if (existingEntry) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    await Waitlist.create({ email });

    return NextResponse.json(
      { message: "Successfully joined the waitlist!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
