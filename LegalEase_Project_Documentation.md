# **LegalEase Project Documentation**

## **1. Project Overview**

### **1.1. Project Description**

LegalEase is a sophisticated, AI-powered legal document analysis application designed to demystify complex legal texts for non-lawyers. Users can upload legal documents in various formats (PDF, DOCX, images, or plain text), and the application leverages the Google Gemini AI to provide a comprehensive analysis. This includes simplifying legal jargon, identifying potential risks, summarizing key clauses, and offering actionable recommendations. The application features a modern, responsive, and highly interactive user interface that makes understanding legal doacuments intuitive and accessible.

### **1.2. Main Goals and Use Cases**

*   **Goals:**
    *   To make legal documents understandable to the average person.
    *   To identify and highlight potential risks, liabilities, and obligations within a legal text.
    *   To provide users with the confidence to make informed decisions (e.g., whether to sign a contract, negotiate terms, or seek professional legal counsel).
    *   To save users time and potential legal costs by providing an initial, high-level AI-driven review.

*   **Use Cases:**
    *   Reviewing employment contracts before signing.
    *   Understanding the terms and conditions of a rental or lease agreement.
    *   Analyzing freelance or service agreements.
    *   Getting a quick summary of lengthy privacy policies or terms of service.
    *   Comparing different versions of a contract to spot changes.

---

## **2. Technology Stack**

### **2.1. Frontend**

*   **Language:** TypeScript
*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Styling:** TailwindCSS with PostCSS
*   **Animation:** GSAP (GreenSock Animation Platform), Framer Motion
*   **Routing:** React Router
*   **State Management:** Zustand (lightweight state management)
*   **UI Components:** Headless UI, Radix UI (for accessible components like dialogs, dropdowns, etc.)
*   **Workers:** Web Workers for offloading intensive tasks like PDF and DOCX parsing.

### **2.2. Backend**

*   **Runtime:** Node.js (v18+)
*   **Framework:** Express.js
*   **Language:** JavaScript (ESM)
*   **AI/ML:** Google Gemini API (`@google/generative-ai`)
*   **File Handling:** Multer (for file uploads)
*   **Text Extraction:**
    *   `pdf2json`: For parsing text from PDF files.
    *   `mammoth`: For extracting raw text from DOCX (Word) files.
    *   `tesseract.js`: For Optical Character Recognition (OCR) to extract text from images.
*   **Security:** Helmet (for securing HTTP headers), `express-rate-limit` (for preventing abuse).
*   **Logging:** Winston

### **2.3. Development & Tooling**

*   **Linting:** ESLint
*   **Formatting:** Prettier
*   **Package Management:** npm
*   **Concurrent Task Running:** `concurrently` (to run frontend and backend servers simultaneously).

---

## **3. Folder & File Structure Explanation**

```
LegalEase-1/
├── backend/
│   ├── routes/
│   │   ├── analyze.js      # Defines the API route for the core document analysis.
│   │   ├── health.js       # Defines a health check endpoint for the backend.
│   │   └── summarize.js    # Defines API routes for file uploads and text summarization.
│   ├── services/
│   │   ├── fileProcessor.js # Handles text extraction from various file types (PDF, DOCX, images).
│   │   └── geminiClient.js  # Manages all interactions with the Google Gemini AI API.
│   ├── .env.example        # Example environment variables file.
│   ├── server.js           # The main Express.js server entry point.
│   └── package.json        # Backend dependencies and scripts.
├── src/
│   ├── components/         # Reusable React components used across the application.
│   ├── pages/
│   │   ├── LandingPage.tsx # The public-facing landing page of the application.
│   │   └── MainApp.tsx     # The core, single-page application interface after the user proceeds.
│   ├── utils/
│   │   ├── api.ts          # Frontend functions for making API calls to the backend.
│   │   └── gsapSafe.ts     # Utility for safely applying GSAP animations.
│   ├── workers/
│   │   ├── docxWorker.ts   # Web worker to handle DOCX file processing in a separate thread.
│   │   └── pdfWorker.ts    # Web worker to handle PDF file processing in a separate thread.
│   ├── App.tsx             # Main application component that sets up routing.
│   └── main.tsx            # The entry point for the React application.
├── .gitignore              # Specifies files and folders to be ignored by Git.
├── package.json            # Frontend dependencies and project scripts.
├── tailwind.config.js      # Configuration file for TailwindCSS.
└── vite.config.ts          # Configuration file for the Vite build tool.
```

---

## **4. Component/Module Explanation**

### **4.1. Frontend Components (`src/components`)**

*   **`ActionableRiskAlerts.tsx`**: Renders high-priority alerts for medium and high-risk clauses, providing generated or backend-provided actions.
*   **`AnimatedBackground.tsx`**: Creates a visually appealing, animated background with floating orbs and particles using GSAP.
*   **`BackendResults.tsx`**: Displays the main analysis results, including the summary and a filterable/sortable list of clauses.
*   **`BrandLoader.tsx`**: A branded, visually distinct loading spinner.
*   **`ChatInput.tsx`**: A sophisticated input component that handles text, file attachments, and drag-and-drop uploads.
*   **`ChecklistGenerator.tsx`**: Dynamically generates a pre-signing checklist for the user based on the detected clauses and risks.
*   **`EnhancedFileUpload.tsx`**: The primary user input interface on the main app screen, handling text pasting and file uploads.
*   **`ErrorBoundary.tsx`**: A React error boundary to catch and handle runtime errors gracefully.
*   **`FileUploader.tsx`**: A dedicated component for the drag-and-drop file upload area.
*   **`HistorySidebar.tsx`**: A sidebar that displays a list of past analyses, loaded from `localStorage`.
*   **`InteractiveGlossary.tsx`**: Displays a list of detected legal terms and their definitions, allowing users to search and filter.
*   **`LegalEaseLoader.tsx`**: A multi-stage loader that shows the current phase of the analysis (e.g., Uploading, Processing, Analyzing).
*   **`Navbar.tsx`**: The main navigation bar for the landing page.
*   **`QnAChat.tsx`**: An AI-powered chat interface allowing users to ask follow-up questions about their document.
*   **`QuickDecisionHelper.tsx`**: Provides a high-level recommendation (Sign, Don't Sign, Review) based on the risk analysis.
*   **`RiskDetector.tsx`**: A component focused on displaying a detailed breakdown of all identified risks.
*   **`RiskMeter.tsx`**: Renders a circular gauge to visualize the overall risk score of the document.
*   **`SummaryDashboard.tsx`**: The main overview tab, presenting key stats, red flags, and action items in a dashboard format.
*   **`TextPreview.tsx`**: Shows a preview of the extracted text from an uploaded document.

### **4.2. Backend Modules (`backend/`)**

#### **Routes (`backend/routes`)**

*   **`analyze.js`**:
    *   `POST /api/analyze`: The core endpoint. It receives a block of text, validates it using Joi, passes it to the `GeminiClient` for full analysis, and returns a structured JSON response containing the summary, clauses, risks, and recommendations.
*   **`health.js`**:
    *   `GET /health`: A simple endpoint to check if the API is running and if its key services (like the Gemini API key) are configured.
*   **`summarize.js`**:
    *   `POST /api/summarize-text`: Summarizes a given block of plain text.
    *   `POST /api/summarize-pdf`, `POST /api/summarize-image`, `POST /api/summarize-file`: These endpoints handle file uploads via `multer`. They use the `FileProcessor` service to extract text from the respective file type and then use `GeminiClient` to summarize it.

#### **Services (`backend/services`)**

*   **`fileProcessor.js`**: This service is a crucial utility for handling various document formats.
    *   `extractTextFromPDF()`: Uses `pdf2json` to parse and extract text content from PDF files.
    *   `extractTextFromImage()`: Uses `sharp` for image pre-processing (resizing, greyscale) and `tesseract.js` for OCR to extract text from images.
    *   `extractTextFromWord()`: Uses `mammoth` to extract raw text from `.docx` files.
    *   `processFile()`: A generic method that determines the file type and calls the appropriate extraction method.
*   **`geminiClient.js`**: This class is the sole interface to the Google Gemini API.
    *   `constructor()`: Initializes the Google Generative AI client with the API key from environment variables.
    *   `generateContent()`: A generic method to send a prompt to the Gemini model and return the text response. It handles API errors like invalid keys or quota issues.
    *   `analyzeDocument()`: Constructs a detailed, structured prompt asking the AI to act as a legal analyzer. It sends the document text and requests a specific JSON output format containing a summary, clause analysis, risk levels, and more.
    *   `summarizeText()`: Sends a simpler prompt to the AI asking it to summarize the provided text.

---

## **5. Function-Level Details**

### **`geminiClient.js: analyzeDocument(text)`**

*   **Purpose:** To perform a comprehensive legal analysis of a given text.
*   **Inputs:** `text` (string) - The full text of the legal document.
*   **Process:**
    1.  Constructs a highly detailed prompt that instructs the Gemini model to act as a "legal document analyzer."
    2.  The prompt specifies the exact JSON structure required for the output, including fields like `summary`, `decision_recommendation`, `clauses`, `legal_terms`, and `key_points`.
    3.  It sends this prompt along with the user's document text to the `generateContent` method.
    4.  It receives the raw text response from the AI.
    5.  It attempts to parse the JSON from the response. If successful, it returns the parsed JSON object. If not, it returns a fallback object containing just the raw response as the summary.
*   **Outputs:** A `Promise` that resolves to a structured object (`AnalyzeResponse`) containing the full document analysis.

### **`fileProcessor.js: processFile(buffer, mimeType)`**

*   **Purpose:** To extract plain text from a file buffer, regardless of its original format.
*   **Inputs:**
    *   `buffer` (Buffer): The raw file data.
    *   `mimeType` (string): The MIME type of the file (e.g., `application/pdf`).
*   **Process:**
    1.  It checks the `mimeType`.
    2.  If it's a PDF, it calls `extractTextFromPDF`.
    3.  If it's a Word document, it calls `extractTextFromWord`.
    4.  If it's a supported image type, it calls `extractTextFromImage`.
    5.  If it's plain text, it converts the buffer to a UTF-8 string.
    6.  If the type is unsupported, it throws an error.
*   **Outputs:** A `Promise` that resolves to a string containing the extracted text.

### **`api.ts: analyzeDocument(text)`**

*   **Purpose:** To provide a clean, typed function for the frontend to call the backend's analysis endpoint.
*   **Inputs:** `text` (string).
*   **Process:**
    1.  Makes a `fetch` call to `POST /api/analyze` on the backend server.
    2.  Sends the text in the JSON body.
    3.  Checks if the response is `ok`. If not, it parses the JSON error message from the backend and throws a new `Error`.
    4.  It includes a special check to provide a user-friendly error message if the fetch fails due to a connection error (i.e., the backend server is not running).
*   **Outputs:** A `Promise` that resolves to the `AnalyzeResponse` object from the backend.

---

## **6. Data Flow / Working Flow**

1.  **User Action:** The user either drags and drops a file (PDF, DOCX, image), selects a file using the file browser, or pastes text directly into the `EnhancedFileUpload` component on the `MainApp` page.
2.  **Frontend Handling:**
    *   The `handleFileUpload` or `handleTextInput` function in `MainApp.tsx` is triggered.
    *   The application state is set to `isLoading = true`, and the `LegalEaseLoader` component is displayed, showing the "Uploading" or "Processing" stage.
3.  **API Call:**
    *   If it's a file, the `summarizeFile` function from `utils/api.ts` is called. This sends the file to the appropriate backend endpoint (e.g., `/api/summarize-pdf`).
    *   If it's plain text, the `analyzeDocument` function from `utils/api.ts` is called, sending the text to the `/api/analyze` endpoint.
4.  **Backend Processing:**
    *   **File Upload:** The `summarize.js` route receives the file. `FileProcessor.js` extracts the text.
    *   The extracted text (or pasted text) is passed to `GeminiClient.js`.
5.  **AI Analysis:**
    *   `GeminiClient.js` sends the text to the Google Gemini API with the detailed legal analysis prompt.
    *   The Gemini API processes the request and returns the analysis in the requested JSON format.
6.  **Response to Frontend:**
    *   The backend server sends the structured JSON response back to the frontend.
7.  **Frontend State Update:**
    *   The `MainApp.tsx` component receives the data.
    *   It updates its state with the summary, clauses, risks, legal terms, and decision recommendation.
    *   The `isLoading` state is set to `false`, and `hasAnalyzed` is set to `true`.
8.  **UI Rendering:**
    *   The `LegalEaseLoader` is hidden.
    *   The results section is rendered, with the `SummaryDashboard` shown by default.
    *   The user can now click through the different tabs (`Risks`, `Decision`, `Glossary`, etc.) to view the different facets of the analysis, which are rendered by their respective components (`ActionableRiskAlerts`, `QuickDecisionHelper`, `InteractiveGlossary`).

---

## **7. Key Features & Functionalities**

*   **Multi-Format Document Upload:** Accepts PDF, DOCX, TXT, and image files (JPG, PNG, etc.).
*   **Direct Text Input:** Users can paste legal text directly for analysis.
*   **AI-Powered Summary:** Generates a concise, plain-language summary of the entire document.
*   **Clause-by-Clause Analysis:** Identifies individual clauses, simplifies them, and explains their meaning.
*   **Risk Assessment:** Assigns a "low," "medium," or "high" risk level to each clause and provides a detailed explanation for the rating.
*   **Overall Risk Score:** Calculates and displays an overall risk score for the document using a visual `RiskMeter`.
*   **Actionable Alerts:** Highlights high-risk items and provides concrete, recommended actions.
*   **Interactive Glossary:** Detects legal jargon and provides on-demand definitions and examples.
*   **Pre-Signing Checklist:** Automatically generates a checklist of items to review and questions to ask before signing.
*   **AI-Assisted Q&A:** A chat interface to ask follow-up questions about the document.
*   **Quick Decision Helper:** Gives a clear "Sign," "Don't Sign," or "Review First" recommendation based on the analysis.
*   **Analysis History:** Automatically saves analysis sessions to the browser's local storage for future reference.
*   **Premium UI/UX:** A modern, responsive, and aesthetically pleasing interface with smooth animations and a dark theme.
*   **Secure and Private:** Document content is processed for analysis and not stored on the server.

---

## **8. Future Improvements**

*   **Document Comparison:** Implement a feature to upload two versions of a document and have the AI highlight and explain the differences.
*   **Full-Fledged User Accounts:** Introduce user authentication to store analysis history in the cloud, accessible across devices.
*   **Team Collaboration:** Allow multiple users to view and comment on a single document analysis.
*   **Template Generation:** Add a feature where users can describe the contract they need, and the AI generates a draft template.
*   **Enhanced Language Support:** Expand beyond the default capabilities to offer more robust and tested support for languages other than English.
*   **Integration with E-Signature Platforms:** Allow users to proceed to sign a document via platforms like DocuSign or Adobe Sign directly from the app after a successful review.
*   **Real-time Co-pilot:** Develop a browser extension or plugin for Google Docs/Microsoft Word that provides real-time legal analysis as a user is writing or editing a document.
