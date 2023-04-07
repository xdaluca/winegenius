// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string,
  wineRecommendationPrompt: any,
  recommendations: any,
}

type Error = {
  message: string,
}

const GPT_KEY = process.env.GPT_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${GPT_KEY}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
const preferences = req.body.preferences;

  const parts = preferences.split(' ')

  if (parts.length > 5) {
    throw new Error('please reduce size of request')
  }

  let basePrompt = `As a sommelier, recommend 5 wines based on these preferences: ${preferences}. Include a brief description and a reason for recommending each wine.`

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'ada',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550
      })
    })
    const recommendations = await response.json()
    const wineRecommendationPrompt = 'Extract the wine recommendations and descriptions out of this text, with no additional words, separated by line breaks: ' + recommendations.choices[0].text

    res.status(200).json({
      message: 'success',
      wineRecommendationPrompt,
      recommendations: recommendations.choices[0].text
    })

  } catch (err) {
    console.log('error: ', err)
  }
}
