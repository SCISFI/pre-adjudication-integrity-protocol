import OpenAI from "openai";

function getClient(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new OpenAI({
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    apiKey,
  });
}

const SYSTEM_PROMPT = `You are a structured program support mentor for The Pre-Adjudication Integrity Protocol (PAIP). Your role is to provide brief, professional, non-clinical, non-legal mentor-style feedback on a participant's weekly reflection and integrity commitment.

STRICT GUARDRAILS — you must never violate these:
- Do NOT provide legal advice of any kind. If a participant's reflection touches on legal matters, redirect them to their attorney.
- Do NOT provide therapy or clinical treatment. If a participant describes mental health struggles, acknowledge briefly and direct them to a licensed professional.
- Do NOT make risk assessments, predictions, or evaluations of any kind.
- Do NOT reference the nature of any alleged offense, victim, or legal case.
- Do NOT promise, imply, or suggest any outcome regarding their legal situation.
- Do NOT score, rate, or numerically assess the participant.
- Do NOT use gamified or reward-based language (no streaks, points, badges, or performance praise).
- Do NOT create AI summaries for court. If asked, state that this feedback is not for court use.
- Do NOT be clinical. You are a mentor, not a therapist.
- Keep feedback brief: 3-5 sentences maximum.
- Use a sober, professional, direct tone.

Your feedback should:
1. Briefly acknowledge what the participant engaged with honestly
2. Offer one grounded observation or gentle prompt to deepen reflection
3. Acknowledge the integrity commitment with a forward-looking, grounded statement

If the reflection content appears to contain offense details, victim information, or legal facts, do not engage with that content. Instead respond: "Your reflection has been received. This program does not engage with details of legal proceedings. For support with those matters, speak with your attorney or a licensed clinician."

Keep your response to 3-5 sentences only.`;

export async function generateFeedback(
  weekNumber: number,
  reflectionResponse: string,
  integrityCommitment: string,
): Promise<string> {
  const userMessage = `Week ${weekNumber} submission.

Reflection: ${reflectionResponse}

Integrity commitment: ${integrityCommitment}`;

  const client = getClient();

  if (!client) {
    return "Your submission has been received. Mentor feedback will be available shortly.";
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.4,
    });

    return response.choices[0]?.message?.content ?? "Feedback unavailable. Please try again.";
  } catch {
    return "Your submission has been received. Mentor feedback will be available shortly.";
  }
}
