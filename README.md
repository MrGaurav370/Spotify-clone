
# 🎵 Lumina Music — AI-Powered Spotify Clone

Lumina Music is a high-fidelity, interactive music discovery platform that merges the familiar Spotify interface with advanced AI capabilities. Powered by **Google Gemini**, Lumina features an intelligent AI DJ that curates real-time playlists from the Spotify library based on your mood or "vibe."

## ✨ Key Features

- **AI DJ (Powered by Gemini):** Describe your mood (e.g., "Late night drive through Tokyo" or "Cyberpunk workout"), and the AI DJ will suggest real tracks from the Spotify library with personalized reasoning for each choice.
- **Spotify API Integration:** Live track searching and "New Releases" discovery using the official Spotify Web API.
- **Interactive Web Player:** A sleek, fully functional playback bar supporting 30-second previews, progress tracking, and volume control.
- **Authentication System:** Modern login and signup flows, including simulated social authentication popups (Google, Facebook, Apple).
- **Responsive Dashboard:** A dark-themed, glassmorphic UI designed for an immersive listening experience.
- **Live Connection Status:** Real-time monitoring of Spotify API token validity with a guided renewal flow.

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/)
- **AI Integration:** [Google GenAI SDK](https://github.com/google/generative-ai-js) (Gemini 3 Flash)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Font Awesome 6](https://fontawesome.com/)
- **Package Management:** [esm.sh](https://esm.sh/) (Serverless module resolution)

## 🚀 Getting Started

### Prerequisites

1.  **Gemini API Key:** You need an API key from [Google AI Studio](https://aistudio.google.com/).
2.  **Spotify Access Token:** To enable live search and real music playback, you'll need a temporary access token.
    -   Visit the [Spotify Developer Console](https://developer.spotify.com/documentation/web-api/reference/get-new-releases).
    -   Click "Try it" to generate a token (expires every 60 minutes).

### Installation

Since this project uses ESM imports directly in the browser via `index.html`, you can run it using any static file server:

```bash
# Example using serve
npx serve .
```

Ensure your environment variable `process.env.API_KEY` is set with your Google Gemini API key.

## 📂 Project Structure

- `App.tsx`: The main application orchestrator.
- `components/`:
    - `AIDJ.tsx`: Integration with Gemini for music recommendations.
    - `Dashboard.tsx`: Main content area, search results, and Spotify connection management.
    - `Login.tsx`: Multi-view authentication portal.
    - `Player.tsx`: Audio playback logic and UI controls.
    - `Sidebar.tsx`: Navigation and playlist management.
- `services/`:
    - `geminiService.ts`: Logic for prompting the Gemini model.
    - `spotifyService.ts`: Wrapper for Spotify Web API calls and token sanitization.
- `types.ts` & `constants.tsx`: TypeScript interfaces and fallback mock data.

## 🛡️ Security & Privacy

Lumina uses a "Bring Your Own Token" (BYOT) model for Spotify access. No user credentials or permanent tokens are stored on any backend; the temporary Bearer token is held only in your browser's local storage to facilitate client-side requests.

---

*Note: This is a developer demonstration tool. Spotify track previews are subject to availability via the Spotify Web API. No commercial distribution is intended.*
