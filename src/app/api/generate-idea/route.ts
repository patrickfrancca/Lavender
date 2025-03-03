// src/app/api/generate-idea/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "You are a creative assistant. Provide a short help to a user who wants to write something, it could be a story idea, a song or even about their life.",
          },
          {
            role: "user",
            content: "Generate a short writing prompt starting with the following instruction: \"Write about\". The prompt should be simple, creative, and suitable for someone practicing a new language. Do not include any introductory phrases like \"Sure\". Just provide the instruction and example directly. Normal things.",
          },
        ],
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate idea", details: errorData },
        { status: 500 }
      );
    }

    const data = await response.json();
    const idea = data.choices[0].message.content.trim();
    return NextResponse.json({ idea });
  } catch (error) {
    console.error("Error generating idea:", error);
    return NextResponse.json(
      { error: "Failed to generate idea", details: error.message },
      { status: 500 }
    );
  }
}