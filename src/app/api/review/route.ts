import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }

    const systemMessage = `You are a friendly and experienced language teacher who specializes in teaching beginners. Your goal is to provide clear, simple, and encouraging feedback to help students improve their language skills. Analyze the text and provide detailed feedback in this EXACT JSON format:
{
  "status": "PERFECT" | "ALMOST_THERE",
  "feedback": "Your detailed feedback here."
}

Rules:
1. Always use double quotes
2. Never include markdown
3. Escape special characters
4. Use simple and natural language, suitable for a beginner level.
5. Be friendly, encouraging, and supportive in your tone, as if you were talking to a friend in a casual conversation.
6. Provide detailed feedback with at least 2-3 sentences, explaining the strengths and areas for improvement.
7. If the text is perfect, explain why it is excellent in a positive and encouraging way, using a conversational tone.
8. If there are errors, use the status "ALMOST_THERE" and provide specific examples and suggestions for correction in a clear and simple way, as if you were explaining it to a friend.
9. Highlight the most important parts of the feedback (e.g., the cause of the error or how to fix it) by wrapping them in <span class="highlight"> tags. Example: "You should change <span class='highlight'>'their'</span> to <span class='highlight'>'there'</span>."

Example feedback for a beginner:
- Perfect: "You’re absolutely killing it with your writing! It’s super natural and easy to understand. The more you practice, the better you’ll get, and you're on the right track. Keep it going, you're doing amazing!

- I’m so proud of how far you’ve come! Your writing is clear, and it flows perfectly. You’re getting better every time, and that’s what matters most. Keep it up, you're doing great!"

- Almost There: "There's a small mistake. Instead of <span class='highlight'>'their'</span>, you should use <span class='highlight'>'there'</span>. Don't worry, this is a common mistake, and you're improving! This is just an example, use variations all the time."`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          { 
            role: "system", 
            content: systemMessage
          },
          { role: "user", content: text }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500 // Permite respostas mais longas
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      return NextResponse.json({ error: "Error from AI service" }, { status: 500 });
    }

    const data = await response.json();
    console.log("OpenAI Response:", data);

    const messageContent = data.choices?.[0]?.message?.content;
    if (!messageContent) {
      console.error("Missing or invalid response content:", data);
      return NextResponse.json({ error: "Invalid or empty response content from AI" }, { status: 500 });
    }

    // Verifica se o JSON está completo antes de fazer o parsing
    let parsedData;
    try {
      // Remove espaços extras e verifica se o JSON está completo
      const sanitizedContent = messageContent.trim();
      if (!sanitizedContent.endsWith("}")) {
        throw new Error("Incomplete JSON response");
      }
      parsedData = JSON.parse(sanitizedContent);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
      console.log("Message Content: ", messageContent);
      return NextResponse.json({ 
        error: "Invalid AI response format", 
        messageContent 
      }, { status: 500 });
    }

    // Verifica se o parsedData tem os campos esperados
    if (!parsedData.status || !parsedData.feedback) {
      console.error("Invalid response structure:", parsedData);
      return NextResponse.json({
        status: "ALMOST_THERE",
        feedback: "No detailed feedback available. Please check the input text or try again.",
      });
    }

    // Se o feedback for inadequado ou vazio, forneça uma resposta padrão
    if (!parsedData.feedback.trim()) {
      parsedData.feedback = "No detailed feedback available. Please check the input text or try again.";
    }

    return NextResponse.json({
      status: parsedData.status || "ALMOST_THERE",
      feedback: parsedData.feedback || "No feedback available.",
    });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}