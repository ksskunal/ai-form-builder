"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function generateForm(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const schema = z.object({
    description: z.string().min(1),
  });
  const parse = schema.safeParse({
    description: formData.get("description"),
  });

  if (!parse.success) {
    console.log(parse.error);

    return {
      message: "Failed to Parse data",
    };
  }
  if (!process.env.OPENAI_API_KEY) {
    return {
      message: "Open Ai Api key not found",
    };
  }

  const data = parse.data;
  const promptExplanation = `Based on the description, generate a survey with
questions array where every element has 2 fields: text and the fieldType and
fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch;
and return it in json format. For RadioGroup, and Select types also return
fieldOptions array with text and value fields. For example, for RadioGroup, and
Select types, the field options array can be [{text: 'Yes', value: 'yes'},
{text: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the field
options array can be empty. For example, for Input, Textarea, and Switch types,
the field options array can be []`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${data.description} ${promptExplanation}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const json = await response.json();

    revalidatePath("/");

    return {
      message: "success",
      data: json,
    };
  } catch (e) {
    console.log(e);
    return {
      message: "Failed to Create from!",
    };
  }
}

export async function generateFormWithGenAI() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
  const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 1000,
    temperature: 0.7,
    topP: 0.6,
    topK: 16,
  };
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig,
  });
}
