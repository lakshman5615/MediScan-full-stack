const { Groq } = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getMedicineExplanation(text, imageUrl = null) {

    try {
        const messages = [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `
You are a helpful medical assistant for normal people (not doctors).

Explain the medicine in very simple and easy language so that anyone can understand.

Rules:
Carefully analyze the medicine image.
 Identify the MOST PROMINENT medicine name written on the strip/box/bottle.
 The medicine name is usually:
   - written in BIG or BOLD letters
   - brand name (example: Glycomet, Dolo, Crocin)

- Even if you are not 100% sure, RETURN THE BEST GUESS.
- If brand name is visible, use it.
- If only generic name is visible, use that.
- If multiple names are visible, choose the MOST PROMINENT one.
- Use simple words
- Do NOT use complex medical terms
- Explain like you are talking to a patient
- If something depends on person to person, clearly say:
  "Please consult a doctor before using"

Return ONLY valid JSON in this exact format:

{
  "medicine_name": "",
  "usage": "",
  "dosage": "",
  "warnings": "",
  "sideEffects": "",
  "expirydate": ""
}

Explanation style:

medicine_name:
- Write the medicine name clearly.

usage:
- Explain what this medicine is used for.
- Mention common problems it helps with.
- Example: fever, pain, infection, allergy, etc.

dosage:
- Explain when and how it is usually taken (morning/night/after food).
- If dosage is not sure, say:
  "Dosage depends on the patient, please consult a doctor."

warnings:
- Explain who should avoid this medicine.
- Mention important safety advice in simple words.
- Always include:
  "Do not take without doctor advice if you are unsure."

sideEffects:
- Mention common side effects in easy language.
- Example: stomach pain, nausea, dizziness.
- If side effects vary, say:
  "Side effects can be different for different people."

expirydate:
- If visible or known, mention it.
- Otherwise say:
  "Check the medicine strip for expiry date."

Medicine query:
${text}


Medicine name or query: ${text}
`
                    }
                ]
            }
        ];

        //  If image is provided (scan case)
        if (imageUrl) {
            messages[0].content.push({
                type: "image_url",
                image_url: { url: imageUrl }
            });
        }

        const completion = await groq.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages,
            temperature: 0.7,
            max_completion_tokens: 512
        });

        const rawResponse = completion.choices[0].message.content;

        //  IMPORTANT: Parse JSON safely
        const jsonStart = rawResponse.indexOf("{");
        const jsonEnd = rawResponse.lastIndexOf("}");
        const cleanJson = rawResponse.substring(jsonStart, jsonEnd + 1);

        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("Groq AI Error:", error);
        throw new Error("AI response failed");
    }
}

module.exports = { getMedicineExplanation };
