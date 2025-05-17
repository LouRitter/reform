const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async (req, res) => {
  const { content, format, options } = req.body;

  if (!content || !format) {
    return res.status(400).json({ error: 'Missing content or format' });
  }

  try {
    // Step 1 – Summarize
    const summaryPrompt = `Summarize this into 3-5 bullet points with key insights:\n\n${content}`;
    const summaryResponse = await openai.chat.completions.create({
      messages: [{ role: 'user', content: summaryPrompt }],
      model: 'gpt-4',
    });
    const summary = summaryResponse.choices[0].message.content;

    // Step 2 – Repackage
    let formatPrompt;

    if (format === 'Social Media Post') {
      formatPrompt = `Create a social media post for LinkedIn and Twitter using the following bullet points.
      It should include a strong hook, clear value, and a soft CTA.
      Use a tone of voice: ${options?.tone || 'Professional'}.
      Audience: ${options?.audience || 'Founders and Creators'}.
      Bullet Points:
      ${summary}`;
    } else if (format === 'LinkedIn Post') {
      formatPrompt = `
      Using the bullet points below, write a LinkedIn post with a ${options?.length || 'Medium'} length.
      - ${options.length === 'Short' ? 'Limit to 100–150 words.' : options.length === 'Long' ? 'Expand to 300–500 words.' : 'Keep it around 150–300 words.'}
      - Use a ${options?.tone || 'Professional'} tone for ${options?.audience || 'a general audience'}.
      - Include a strong hook, concise paragraphs, and a soft CTA.
      Bullet Points:
      ${summary}
      `;
    } else if (format === 'X Post') {
      formatPrompt = `
      You are writing a Twitter (X) thread for ${options?.audience || 'founders'}.

      - Format as ${options.length === 'Short' ? '**one single tweet**' : options.length === 'Long' ? '**a 6-post thread**' : '**a 3-post thread**'}
      - **Each post must be 280 characters or less — do NOT exceed.**
      - Use a hook in the first post, insights in the middle, and a CTA or punchline at the end.
      - Keep posts concise, skimmable, and split across multiple posts if needed.
      - Use ${options?.tone || 'Friendly'} tone.
      - Emojis or light formatting welcome.

      Here are the bullet points to base your posts on:
      ${summary}
      `;
    } else {
      formatPrompt = `Turn the following bullet points into a ${format.toLowerCase()}.
      Tone: ${options?.tone || 'Neutral'}.
      Audience: ${options?.audience || 'General'}.
      Length: ${options?.length || 'Medium'}.

      Bullet Points:
      ${summary}`;
    }
    const formatResponse = await openai.chat.completions.create({
      messages: [{ role: 'user', content: formatPrompt }],
      model: 'gpt-4',
    });
    const formattedOutput = formatResponse.choices[0].message.content;

    // Step 3 – Polish
    const polishPrompt = `Polish this content for clarity, tone, and readability:\n\n${formattedOutput}`;
    const polishResponse = await openai.chat.completions.create({
      messages: [{ role: 'user', content: polishPrompt }],
      model: 'gpt-4',
    });
    const polished = polishResponse.choices[0].message.content;

    res.json({ result: polished });
  } catch (err) {
    console.error('Error during transformation:', err);
    res.status(500).json({ error: 'Transformation failed.' });
  }
});

module.exports = router;
