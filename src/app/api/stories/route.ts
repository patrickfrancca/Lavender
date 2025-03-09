import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Story from "@/app/models/Story";

export async function GET(req: Request) {
  await connectToDatabase();

  const url = new URL(req.url);
  const theme = url.searchParams.get("theme");

  try {
    const stories = await Story.find(theme ? { theme } : {});
    return NextResponse.json({ stories });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Error fetching stories" }, { status: 500 });
  }
}
