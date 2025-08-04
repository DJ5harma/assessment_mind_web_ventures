# Assessment Mind Web Ventures

This project is a dashboard interface built with Next.js and TypeScript. It visualizes dynamic data over a map and a timeline, supports polygon creation, and color-codes data display based on selected datasets. The main data source is the Open-Meteo API.

## Features
- Timeline slider (single and range) for hourly data across a 30-day window
- Interactive map (Leaflet) with polygon drawing (3-12 points)
- Sidebar for data source selection and color rules
- Fetches and displays data from Open-Meteo API
- Color-codes polygons based on user-defined rules
- Dynamic updates on timeline change
- Charting, polygon editing, state persistence, and more

## Tech Stack
- Next.js (React, TypeScript)
- Leaflet (mapping)
- Recharts (charting)
- Context API (state management)
- Tailwind CSS (styling)

## Getting Started

### Prerequisites
- Node.js (v18 or above recommended)
- npm or yarn

### Local installation (if needed):
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd assessment_mind_web_ventures
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

### API Keys
- **Open-Meteo API** does not require an API key. All requests are public. So no .env required

### Project Structure
- `/pages` - Next.js pages
- `/components` - React components
- `/context` - State management
- `/utils` - API and helper functions
- `/styles` - Global styles and Tailwind config