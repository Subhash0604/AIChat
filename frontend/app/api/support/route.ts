import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json();

    if (!message || message.trim() === "") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-2.5-flash-preview-09-2025";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const context = `FAQ:
- Our working hours are 9am-5pm.
- Refunds take 3-5 business days.
- Support email: support@example.com`;

    const prompt = `
User message: ${message}

Use the context above to provide a helpful, concise, and professional response.
${context}
`;

    const systemInstruction = `
You are a helpful support assistant. Provide clear, concise, and context-aware answers. Always refer to company policies when applicable.
`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    const MAX_RETRIES = 3;
    let data: any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      data = await response.json();
      console.log("Gemini API response:", data);

      if (response.ok && data?.candidates?.length) break;
      else if (attempt < MAX_RETRIES - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        return NextResponse.json(
          { error: data?.error?.message || "API call failed" },
          { status: data?.error?.code || 500 }
        );
      }
    }

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!aiText) {
      return NextResponse.json({ error: "No content returned from API" }, { status: 500 });
    }

    return NextResponse.json({
      reply: aiText,
      conversationId: conversationId || null,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
