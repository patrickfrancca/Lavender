/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import Story from "@/app/models/Story";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await dbConnect();

  try {
    const story = await Story.findOne({ slug: params.slug });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ story });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
