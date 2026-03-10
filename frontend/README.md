# Frontend - React + Vite + TypeScript

Modern React SPA for feedback submission and management with real-time filtering and AI-powered classification display.

## 📋 Overview

Interactive web application that:
- Submit feedback via modal form
- View all feedbacks in a card grid
- Filter by name, category, and priority
- Delete feedbacks
- Real-time sentiment indicators
- Responsive design for mobile/desktop

## 🏗️ Architecture

```
src/
├── components/
│   ├── FeedbackList.tsx    # Card grid display
│   ├── FeedbackModal.tsx   # Form modal
│   └── SearchFilters.tsx   # Filter controls
├── pages/
│   └── (handled in App.tsx)
├── api/
│   └── feedbackApi.ts      # Axios API client
├── types/
│   └── feedback.ts         # TypeScript interfaces
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
├── index.css               # Global styles
├── App.css                 # Component styles
└── vite.config.ts          # Vite configuration
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Starts at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

Build output: `dist/`

## 🎨 Features

### 1. Feedback Submission
- Name input (text)
- Email input (validated)
- Message textarea (min 10 characters)
- Real-time validation
- Loading state during submission
- Success notification

### 2. Feedback Display
- **Card Grid Layout**: Responsive (1-3 columns)
- **Sentiment Indicator**: Emoji (😊 😞 😐)
- **Priority Badge**: Color-coded (Red/Orange/Green)
- **Category Badge**: Blue
- **Team Badge**: Light blue
- **Timestamp**: Created date and time
- **Delete Button**: With confirmation

### 3. Search & Filtering
- **Name Search**: Case-insensitive partial match
- **Category Filter**: Dropdown (Bug, Feature Request, etc.)
- **Priority Filter**: Dropdown (Low, Medium, High)
- **Real-time**: Filters apply immediately

### 4. User Experience
- Modal overlay for form submission
- Empty state with helpful message
- Loading indicators
- Error messages with validation
- Hover effects on cards
- Responsive design for mobile

## 📦 API Integration

### Base Configuration
```typescript
const API_BASE_URL = '/api'
const client = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})
```

### Available Methods

```typescript
// Create feedback
feedbackApi.createFeedback({ name, email, message })

// Get all with filters
feedbackApi.getFeedbacks({ name?, category?, priority? })

// Get by ID
feedbackApi.getFeedbackById(id)

// Delete
feedbackApi.deleteFeedback(id)
```

## 🎯 Components

### FeedbackList
Displays feedbacks in a responsive card grid.

Props:
- `feedbacks: Feedback[]`
- `isLoading: boolean`
- `onDelete: (id: string) => Promise<void>`
- `isDeletingId?: string`

Features:
- Sentiment emoji indicators
- Priority color coding
- Category badges
- Team assignment display
- Delete with confirmation
- Formatted timestamps

### FeedbackModal
Form modal for submitting new feedback.

Props:
- `isOpen: boolean`
- `onClose: () => void`
- `onSubmit: (data) => Promise<void>`
- `isLoading?: boolean`

Validation:
- Name required
- Valid email format
- Message min 10 chars
- Real-time error display

### SearchFilters
Filter controls for feedback list.

Props:
- `nameValue: string`
- `categoryValue: string`
- `priorityValue: string`
- `onNameChange: (value) => void`
- `onCategoryChange: (value) => void`
- `onPriorityChange: (value) => void`

## 🎨 Styling

### Color Scheme
- **Primary**: #667eea (Purple)
- **Accent**: #764ba2 (Dark Purple)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Orange)
- **Error**: #dc2626 (Red)

### Responsive Breakpoints
- **Mobile**: < 768px (single column, full width)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

### CSS Features
- Gradient header background
- Backdrop blur effect
- Card hover animations
- Smooth transitions
- Shadow effects
- Focus states for accessibility

## 🔧 Configuration

### Vite Proxy
Configured in `vite.config.ts`:
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

Allows frontend to call `/api/*` without CORS issues during development.

### Environment Variables
Frontend uses API at relative path `/api`:
- Development: Vite proxy → `http://localhost:5000/api`
- Production: Same domain or configured via environment

## 📱 Mobile Optimization

- **Responsive Grid**: 1 column on mobile, scales up
- **Touch-friendly**: 48px+ touch targets
- **Readable Text**: Min 16px on mobile
- **Form Optimization**: Full-width inputs, large buttons
- **Modal Sizing**: Width auto, max 95% on mobile

## 🧪 Testing

### Create Feedback
1. Click "+ Submit Feedback"
2. Fill form with valid data
3. Submit
4. Check if feedback appears in list

### Filter Search
1. Enter name in search box
2. Select category from dropdown
3. Select priority from dropdown
4. List updates in real-time

### Delete
1. Find feedback card
2. Click delete button (🗑️)
3. Confirm deletion
4. Card removed from list

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-dom | ^18.2.0 | React rendering |
| axios | ^1.6.0 | HTTP client |
| vite | ^4.5.0 | Build tool |
| typescript | ^5.2.0 | Type safety |

## 🚀 Deployment

### Build
```bash
npm run build
```

Output: `dist/` folder with static files

### Vercel
1. Connect GitHub repo
2. Framework preset: Vite
3. Root directory: `frontend`
4. Deploy (auto-rebuilds)

### Netlify
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

### GitHub Pages
1. Add to `package.json`:
```json
"homepage": "https://username.github.io/repo-name"
```
2. Build and push
3. Enable Pages in repo settings

## 🌐 Environment Setup

### Local Development
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`
- Vite proxy handles API calls

### Production
Update `vite.config.ts` if backend URL differs:
```typescript
proxy: {
  '/api': {
    target: 'https://api.example.com',
    changeOrigin: true
  }
}
```

Or configure in build-time environment variables.

## 🔒 Security

- ✅ Input validation before submission
- ✅ Email format validation
- ✅ No sensitive data in localStorage
- ✅ CORS handled by backend
- ✅ TypeScript strict mode
- ✅ No hardcoded credentials

## 📈 Performance

- **Code Splitting**: Components lazy-loadable
- **Vite HMR**: Fast refresh during development
- **Optimized Build**: Tree-shaking, minification
- **CSS Modules**: Scoped styles (optional upgrade)
- **Image Optimization**: Auto by Vite

## ⚠️ Troubleshooting

### API Connection Errors
- Check backend running on port 5000
- Verify `FRONTEND_URL` in backend `.env`
- Clear browser cache

### Form Validation Issues
- Ensure message min 10 characters
- Use valid email format
- All fields required

### Styling Issues
- Clear `node_modules` and reinstall
- Check CSS file imports
- Verify CSS class names in HTML

## 🛠️ Development Tips

### Component Reuse
Components are highly reusable:
- Pass different data via props
- Handlers customizable per instance
- Styling can be extended

### State Management
Currently using React hooks:
- `useState` for local state
- `useCallback` for memoized handlers
- `useEffect` for side effects

### Adding Features
1. Create component in `src/components/`
2. Define types in `src/types/`
3. Add API calls to `src/api/feedbackApi.ts`
4. Import and use in `App.tsx`

---

**Need Help?** Check the main [README.md](/README.md)
