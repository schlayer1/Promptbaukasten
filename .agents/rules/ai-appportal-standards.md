# AI Integration Standards for Heimbürgeschule Appportal Projects

## 1. Provider Scope (Gemini by Default)
- Unless explicitly instructed by the user to include alternative providers like Mistral, Groq, or OpenRouter, configure the application exclusively with **Google Gemini**.
- Avoid adding unnecessary UI tabs, multi-provider selectors, or third-party credential dialogs. Keep it clean and accessible for teachers and students.

## 2. Robust Cascade Integration (Flash Models)
- Always implement the multi-model cascade pattern (`executeWithCascade`) across active Flash models:
  1. `gemini-flash-lite-latest`
  2. `gemini-3-flash-preview`
  3. `gemini-flash-latest`
  4. `gemini-3.6-flash` / `gemini-3.7-flash` / `gemini-3.8-flash`
  5. `gemini-3.5-flash`
- Strictly forbid and filter out deprecated or unavailable models (`1.5`, `2.0`, `2.5`).
- Ensure the 3-stage key resolution is in place:
  1. User BYOK (`localStorage`)
  2. Vercel environment variable (`import.meta.env.VITE_GEMINI_API_KEY`)
  3. Default school base64 fallback key.

## 3. Mandatory Vercel Setup Handover
- Immediately upon completing the technical implementation of an AI integration in any Appportal project, proactively prompt the user:
  1. Ask if they want to enter their own Gemini API key or need help setting it up on Vercel.
  2. Provide the clear instructions for adding `VITE_GEMINI_API_KEY` in Vercel project settings (*Settings* -> *Environment Variables*) and redeploying.
