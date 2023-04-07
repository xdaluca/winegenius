import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string,
  wineRecommendationPrompt: any,
  recommendations: any,
};

type Error = {
  message: string,
};

const GPT_KEY = process.env.GPT_API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${GPT_KEY}`,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>,
) {
  const { preferences, budget, region, grapeVariety } = req.body;
  const dish = req.body.dish; // Get dish from the request body

  const parts = preferences.split(' ');

  if (parts.length > 5) {
    throw new Error('please reduce size of request');
  }

  // Include the dish in the basePrompt
  let basePrompt = `As a sommelier, recommend 5 wines based on these preferences: ${preferences}, budget: ${budget}, specific region: ${region}, and grape variety: ${grapeVariety}. For each wine, provide the name, region, price range, grape variety, and a brief description. Separate each piece of information with a semicolon (;) and each wine recommendation with a newline.\n`;

  try {
    const response = await fetch('https://api.openai.com/v1/completions',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550,
      }),
    });
    const rawRecommendations = await response.json();
    const wineRecommendations = rawRecommendations.choices[0].text.split('\n');
    
    const processedRecommendations = wineRecommendations
    .map((rec: string) => {
      const [wineName, region, priceRange, grapeVariety, description] = rec.split(';');
      return {
        wineName: wineName?.trim(),
        region: region?.trim(),
        priceRange: priceRange?.trim(),
        grapeVariety: grapeVariety?.trim(),
        description: description?.trim(),
      };
    })
    .filter((rec: any) => rec.wineName && rec.region && rec.priceRange && rec.grapeVariety && rec.description)
    .slice(0, 5);
    
    res.status(200).json({
      message: 'success',
      recommendations: processedRecommendations,
    });

  } catch (err) {
    console.log('error: ', err);
  }
}
