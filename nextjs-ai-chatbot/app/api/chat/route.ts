import { streamText, convertToModelMessages } from "ai";
import { model } from "@/lib/ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate response",
      },
      {
        status: 500,
      }
    );
  }
}