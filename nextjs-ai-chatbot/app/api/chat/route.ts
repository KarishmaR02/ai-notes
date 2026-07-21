// import { NextResponse } from "next/server";
// import ai from "@/lib/gemini";

// export async function GET() {
//   try {
//     const models = await ai.models.list();

//     return NextResponse.json(models);
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         error,
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import ai from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
      contents: message,
    });

    return NextResponse.json({
      reply: response.text,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}