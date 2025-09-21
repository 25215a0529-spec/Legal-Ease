import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Get the Gemini Pro model
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-pro' })
}

// Helper function to generate content with error handling
export const generateContent = async (prompt) => {
  try {
    const model = getGeminiModel()
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    
    // Handle specific error types
    if (error.message?.includes('API_KEY')) {
      throw new Error('AI Service Configuration Error')
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      throw new Error('AI Service Temporarily Unavailable')
    } else {
      throw new Error('AI Analysis Service Unavailable')
    }
  }
}

// Helper function to validate API key
export const validateGeminiKey = async () => {
  try {
    const model = getGeminiModel()
    await model.generateContent('Test')
    return true
  } catch (error) {
    return false
  }
}
