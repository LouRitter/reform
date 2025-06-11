# 📦 ReForm — Content Reformation Tool

ReForm is an AI-powered platform that transforms raw content (documents, slides, transcripts) into repackaged formats like blog posts, social media threads, newsletters, and slide decks — instantly and intelligently.

---

## 🚀 Features

- 🗂 Upload DOCX, TXT, PDF, and more
- 🧹 Automatic text extraction & cleanup
- 🧠 Smart content transformation via OpenAI (multi-step):
  - Blog post
  - Slide deck
  - LinkedIn post
  - Twitter (X) thread
  - Email newsletter
- 🎛 Custom tone, length, and audience settings
- 📤 One-click sharing to Twitter and LinkedIn
- 💾 Designed to be extended for image generation, post scheduling, or export

---

## 🧱 Project Structure

```
/content-reform-ui    # Next.js + Tailwind frontend
/content-reform-backend     # Express.js + OpenAI backend
```

---

## 🛠 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/your-username/reform
cd reform
```

---

### 2. Frontend Setup (`/content-reform-ui`)

```bash
cd content-reform-ui
npm install
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

### 3. Backend Setup (`/content-reform-backend`)

```bash
cd content-reform-backend
npm install
```

Create a `.env` file:

```env
PORT=4000
OPENAI_API_KEY=your_openai_key_here
```

Then run:

```bash
npm run dev
```

API runs on: [http://localhost:4000](http://localhost:4000)

---

## 🔌 Key Endpoints

| Method | Endpoint            | Description                         |
|--------|---------------------|-------------------------------------|
| POST   | `/api/upload`       | Upload & extract file content       |
| POST   | `/api/transform`    | Transform content into new format   |
| GET    | `/`                 | Backend health check                |

---

## ⚙️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Express.js, OpenAI GPT-4
- **Parsing**: pdf-parse, mammoth
- **AI**: Multi-step summarization → formatting → polishing
- **Social Sharing**: Pre-filled intent URLs for Twitter & LinkedIn

---

## 📌 Roadmap

- 🧵 Native Twitter/X thread publishing (OAuth)
- 🖼 Image generation for blog & post visuals
- 🔗 Public shareable links (`/share/:id`)
- 💬 Brand voice presets
- 📝 Editable rich text output
- 📥 Download as DOCX, PDF, or PPTX

---

## 📄 License

MIT