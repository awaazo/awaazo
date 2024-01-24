// pages/api/gpt-response.js
import { OpenAI } from "openai-streams/node";

export default async function handler(req, res) {
  const { userMessage } = req.body;

  const stream = await OpenAI(
    "completions",
    {
      model: "gpt-3.5-turbo", // replace with your desired model
      messages: [
        { role: "system", content: "Answer the question briefly and shortly" },
        { role: "user", content: userMessage },
      ],
    }
  );

  stream.pipe(res);
}
