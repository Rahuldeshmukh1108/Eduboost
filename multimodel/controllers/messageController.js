import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { enhanceResponse } from "../utils/responseEnhancer.js"
import { translateText } from "../utils/translator.js"

export const processMessage = async (req, res) => {
  try {
    const { message, model = "llama-3.1-8b-instant", language = "en", fileContent = null } = req.body

    console.log(`Processing message with model: ${model}, language: ${language}`)

    // Prepare context based on file content
    let context = ""
    if (fileContent) {
      context = `The user has shared the following content with you:\n\n`

      if (fileContent.text) {
        context += `Text content: ${fileContent.text}\n\n`
      }

      if (fileContent.metadata) {
        context += `Metadata: ${JSON.stringify(fileContent.metadata)}\n\n`
      }

      context += `Please consider this information when responding to their message.\n\n`
    }

    // Prepare system prompt based on language
    const systemPrompt = getSystemPrompt(language)

    // Generate response using Groq
    const { text } = await generateText({
      model: groq(model),
      messages: [
        { role: "system", content: systemPrompt },
        ...(context ? [{ role: "system", content: context }] : []),
        { role: "user", content: message },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    // Enhance response with additional content (references, images, etc.)
    const enhancedResponse = enhanceResponse(text)

    // Translate response if needed (for non-English languages)
    let finalResponse = enhancedResponse
    if (language !== "en") {
      finalResponse = await translateText(enhancedResponse, language)
    }

    res.status(200).json({ response: finalResponse })
  } catch (error) {
    console.error("Error processing message:", error)
    res.status(500).json({
      error: "Failed to process message",
      details: error.message,
    })
  }
}

// Helper function to get system prompt based on language
function getSystemPrompt(language) {
  const basePrompt = `You are an AI Tutor designed to help users learn about any subject. 
Be helpful, informative, and educational in your responses. 
If you don't know something, admit it rather than making up information.
When appropriate, provide examples to illustrate concepts.`

  // For non-English languages, add instruction to respond in that language
  const languageMap = {
    es: "Spanish",
    fr: "French",
    de: "German",
    hi: "Hindi",
    mr: "Marathi",
    gu: "Gujarati",
    ta: "Tamil",
    ml: "Malayalam",
    zh: "Chinese",
    ja: "Japanese",
    ar: "Arabic",
    ru: "Russian",
  }

  if (language !== "en" && languageMap[language]) {
    return `${basePrompt}\nPlease respond in ${languageMap[language]}.`
  }

  return basePrompt
}
