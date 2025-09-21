# LegalEase - AI-Powered Legal Document Analysis

A comprehensive legal document analysis platform that combines Next.js 14 frontend with Node.js/Express backend, powered by Google's Gemini AI for intelligent document processing and risk assessment.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion + Custom CSS animations
- **State Management**: TanStack Query
- **Theme**: next-themes (dark/light mode)
- **Icons**: Lucide React
- **Development**: ESLint, Prettier, TypeScript

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI Integration**: Google Gemini AI
- **File Processing**: Multer, PDF2JSON, Mammoth, Tesseract.js
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Development**: Nodemon, ESLint

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Main dashboard pages
│   └── analysis/          # Analysis workflow pages
├── backend/               # Node.js/Express API server
│   ├── routes/           # API route handlers
│   │   ├── analyze.js    # Document analysis endpoints
│   │   ├── chat.js       # AI chat endpoints
│   │   └── health.js     # Health check endpoints
│   ├── services/         # Business logic services
│   │   ├── geminiClient.js    # Gemini AI integration
│   │   ├── fileProcessor.js   # Document processing
│   │   └── analysisValidator.js # Analysis validation
│   ├── utils/            # Backend utilities
│   └── server.js         # Express server setup
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui + custom components
│   │   ├── scan-loader.tsx    # Custom scan animation
│   │   └── circular-risk-meter.tsx # Risk visualization
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard-specific components
├── lib/                  # Frontend utilities
│   ├── utils.ts          # Utility functions
│   └── api-client.ts     # Backend API client
├── hooks/                # Custom React hooks
├── styles/               # Additional stylesheets
└── public/               # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Blue to Purple gradient (`from-blue-600 to-purple-600`)
- **Background**: Dynamic light/dark themes
- **Accent**: Subtle grays with high contrast text
- **Status Colors**: Green (success), Yellow (warning), Red (destructive)

### Typography
- **Font**: Inter (Google Fonts)
- **Scale**: Consistent sizing with Tailwind classes
- **Weight**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing & Layout
- **Container**: Max-width with responsive padding
- **Grid**: CSS Grid and Flexbox for layouts
- **Spacing**: Consistent 4px base unit (Tailwind spacing scale)

### Shadows & Effects
- **Linear Shadow**: Custom `shadow-linear` utility
- **Glass Morphism**: Backdrop blur with transparency
- **Gradients**: Subtle background gradients

## 🧩 Component Library

### UI Primitives
- `Button` - Multiple variants with consistent styling
- `Input` - Form inputs with focus states
- `Textarea` - Multi-line text inputs
- `Badge` - Status indicators and labels
- `Card` - Content containers with shadows
- `Dialog` - Modal overlays and popups
- `Tabs` - Navigation between content sections
- `Progress` - Loading and completion indicators
- `Alert` - Notifications and status messages
- `Avatar` - User profile images
- `Separator` - Visual content dividers
- `Skeleton` - Loading state placeholders
- `ScrollArea` - Custom scrollbars
- `DropdownMenu` - Context menus and actions

### Layout Components
- `Navbar` - Top navigation with theme toggle
- `Sidebar` - Collapsible side navigation
- `MainLayout` - Complete layout wrapper

### Dashboard Components
- `FileUploadZone` - Drag & drop file upload with text analysis
- `AnalysisResults` - Comprehensive risk assessment display
- `ChatInterface` - AI assistant chat with context awareness

### Custom Components
- `ScanLoader` - Animated scanning effect with red beam
- `CircularRiskMeter` - Interactive risk visualization with percentage display
- `RiskBreakdown` - Detailed risk category analysis

## 🔧 Configuration

### Tailwind CSS
Custom configuration with:
- Linear-inspired color palette
- Custom animations and transitions
- Typography scale and font families
- Shadow utilities
- Responsive breakpoints

### TypeScript
Strict type checking with:
- Path mapping (`@/*` aliases)
- Component prop interfaces
- API response types
- Utility type definitions

### Next.js
Optimized configuration:
- App Router for modern routing
- Image optimization
- Font optimization (Inter)
- Bundle analysis ready

## 🎯 Key Features

### Accessibility
- ARIA roles and labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- High contrast ratios

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Adaptive navigation

### Performance
- Code splitting and lazy loading
- Optimized images and fonts
- Efficient re-renders with React 18
- Bundle size optimization

### Theme System
- System preference detection
- Smooth theme transitions
- Persistent user preferences
- CSS variable-based theming

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd next

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend (.env)
```env
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

### Development Scripts

#### Frontend
```bash
npm run dev          # Start Next.js development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

#### Backend
```bash
cd backend
npm run dev          # Start Express server with nodemon (port 8000)
npm start            # Start production server
npm run lint         # Run ESLint
```

#### Full Stack Development
```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
npm run dev
```

## 📱 Usage

### Analysis Workflow
1. **Upload Document**: Drag & drop or select files (PDF, Word, Text)
2. **AI Processing**: Gemini AI analyzes document structure and content
3. **Risk Assessment**: View comprehensive risk breakdown with visual meters
4. **Interactive Results**: Explore findings, recommendations, and risk categories
5. **Chat Assistant**: Ask questions about your document analysis

### Key Features
- **Real-time Analysis**: Instant document processing with animated feedback
- **Visual Risk Meters**: Circular progress indicators showing risk percentages
- **Comprehensive Reporting**: Detailed analysis with actionable insights
- **Multi-format Support**: PDF, Word documents, and plain text
- **Responsive Design**: Works seamlessly on desktop and mobile devices


## 🎨 Customization

### Adding New Components
1. Create component in appropriate directory
2. Follow naming conventions (`PascalCase`)
3. Include TypeScript interfaces
4. Add to component exports

### Styling Guidelines
- Use Tailwind utility classes
- Follow Linear design principles
- Maintain consistent spacing
- Use CSS variables for theming

### Animation Patterns
- Subtle micro-interactions
- Smooth page transitions
- Loading state animations
- Hover and focus effects

## 🔌 API Integration

### Backend Endpoints
- `POST /analyze-document` - Upload and analyze documents (PDF, Word, Text)
- `POST /analyze-text` - Analyze raw text input
- `POST /chat` - AI-powered chat with document context
- `GET /health` - API health check and status

### AI Features
- **Document Processing**: Supports PDF, Word, and text files
- **Risk Assessment**: Multi-dimensional risk scoring (0-100%)
- **Risk Breakdown**: Financial, Legal, Operational, Compliance, Reputational
- **Clause Analysis**: Individual clause risk evaluation
- **Smart Recommendations**: Actionable insights and mitigation strategies

### Type Safety
All API responses are typed with TypeScript interfaces for:
- Analysis results
- Risk assessments
- Chat messages
- Error handling

## 🧪 Testing

### Component Testing
- Unit tests with Jest
- Component tests with React Testing Library
- Accessibility testing with axe-core

### E2E Testing
- Playwright for end-to-end tests
- User journey testing
- Cross-browser compatibility

## 📦 Deployment

### Build Optimization
```bash
npm run start
```

### Environment Setup
- Configure environment variables
- Set up database connections
- Configure CDN for assets

### Performance Monitoring
- Core Web Vitals tracking
- Error boundary implementation
- Analytics integration ready

## 🤝 Contributing

### Development Guidelines
- Follow ESLint configuration for both frontend and backend
- Use Prettier for consistent code formatting
- Maintain TypeScript strict mode
- Write comprehensive error handling
- Test AI integrations thoroughly

### Adding New Features
1. **Frontend**: Create components in appropriate directories
2. **Backend**: Add routes in `backend/routes/`
3. **AI Integration**: Extend Gemini client in `backend/services/`
4. **Types**: Update TypeScript interfaces in `lib/api-client.ts`

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review component examples
- Submit issues on GitHub
- Contact the development team

---

## API Integration Documentation

### Overview

The LegalEase platform integrates with a backend API to provide document analysis, AI-powered chat assistance, and template management. This documentation outlines the expected API endpoints, request and response formats, and error handling.

### API Endpoints

#### Document Analysis

**`POST /analyze-document`**
- Analyzes uploaded documents using Gemini AI
- Supports PDF, Word (.doc/.docx), and text files
- Returns comprehensive risk assessment

**Request**: Multipart form data with file upload

**Response**:
```json
{
  "summary": "Document analysis summary",
  "overall_risk_score": 7.5,
  "risk_confidence": 85,
  "document_type": "contract",
  "risk_breakdown": {
    "financial_risk": 8.2,
    "legal_risk": 7.1,
    "operational_risk": 6.5,
    "compliance_risk": 7.8,
    "reputational_risk": 5.9
  },
  "key_findings": ["Finding 1", "Finding 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "critical_issues": [],
  "clauses": []
}
```

**`POST /analyze-text`**
- Analyzes raw text input
- Same response format as document analysis

#### AI Chat

**`POST /chat`**
- Context-aware chat with document analysis
- Powered by Gemini AI

**Request**:
```json
{
  "message": "What are the main risks in this contract?",
  "conversationId": "optional-conversation-id"
}
```

**Response**:
```json
{
  "response": "Based on the analysis, the main risks include...",
  "conversationId": "generated-or-provided-id"
}
```

#### Health Check

**`GET /health`**
- API status and health monitoring
- Returns server status and Gemini AI connectivity

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "gemini_ai": "connected",
    "file_processing": "operational"
  }
}
```

## 🔧 Configuration

### Gemini AI Setup
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to backend `.env` file as `GEMINI_API_KEY`
3. Configure model settings in `backend/services/geminiClient.js`

### File Processing
- **PDF**: Uses pdf2json for text extraction
- **Word**: Uses mammoth for .docx processing
- **Images**: OCR with Tesseract.js
- **Security**: File type validation and size limits

### Error Handling

Standardized error responses across all endpoints:

**Error Codes**:
- `400` - Invalid request data or file format
- `401` - Invalid API key or authentication failure
- `429` - Rate limit exceeded
- `500` - Server error or AI service unavailable

**Error Response Format**:
```json
{
  "error": {
    "message": "AI Service Configuration Error",
    "details": "Invalid API key or service unavailable",
    "code": 401
  }
}
```

### API Client

Type-safe API client with comprehensive error handling:

```typescript
import { apiClient } from '@/lib/api-client';

// Document analysis
const result = await apiClient.analyzeDocument(file);
const textResult = await apiClient.analyzeText(textContent);

// AI chat
const chatResponse = await apiClient.sendChatMessage(message);

// Health check
const health = await apiClient.checkHealth();
```

## 🚀 Deployment

### Frontend Deployment
- **Recommended**: Vercel, Netlify, or similar static hosting
- Build command: `npm run build`
- Output directory: `.next`

### Backend Deployment
- **Recommended**: Railway, Render, or similar Node.js hosting
- Start command: `npm start`
- Environment variables: `GEMINI_API_KEY`, `PORT`

### Environment Configuration
- Set `NEXT_PUBLIC_API_URL` to your deployed backend URL
- Configure CORS settings for your frontend domain
- Set up proper rate limiting for production use
