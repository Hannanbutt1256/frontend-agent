# AuditAI - Intelligent Data Auditing Platform

AuditAI is a modern, high-performance web application designed for managing and monitoring AI agent auditing jobs. It allows users to upload datasets and run specialized agents to detect bias, data leakage, and quality issues, providing a comprehensive result dashboard for detailed analysis.

## 🚀 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend as a Service**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown) with Syntax Highlighting

## ✨ Key Features

- **Secure Authentication**: Integration with Supabase Auth for protected routes and user management.
- **Dataset Management**: Streamlined interface for uploading and managing datasets for auditing.
- **Job Monitoring**: Real-time tracking of running, completed, and failed agent jobs.
- **Intelligence Dashboard**: Advanced visualization of audit results, including:
  - **Bias Detection**: Identifying algorithmic bias in datasets.
  - **Leakage Analysis**: Detecting data leakage across training/testing sets.
  - **Data Quality**: High-level metrics on dataset health.
- **Modern UI/UX**: Premium aesthetic with grainy gradients, glow effects, and micro-animations.

## 🛠️ Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

Run the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## 📂 Project Structure

- `src/components`: Reusable UI components and layout structures.
- `src/context`: Auth and state management contexts.
- `src/lib`: Core library initializations (e.g., Supabase client).
- `src/pages`: Application views (Landing, Auth, Dashboard, etc.).
- `src/assets`: Static assets like images and fonts.

## 📄 License

[Insert License Type Here, e.g., MIT]
