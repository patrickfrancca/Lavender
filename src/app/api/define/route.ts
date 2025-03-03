import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { word } = await req.json();

    if (!word) {
      return NextResponse.json({ error: "No word provided" }, { status: 400 });
    }

    // Fazendo requisição para a OpenAI (ou outra API de dicionário)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "system", content: `Give a short, 5-word definition of "${word}".` }],
      }),
    });

    const data = await response.json();
    const definition = data.choices?.[0]?.message?.content || "Definition not found.";

    return NextResponse.json({ definition }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
