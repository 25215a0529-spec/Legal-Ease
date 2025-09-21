# LegalEase Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Render (Recommended)
1. **Fork/Clone** this repository
2. **Connect to Render** using the `render.yaml` file
3. **Set Environment Variables**:
   - Backend: `GEMINI_API_KEY` (your Google Gemini API key)
   - Frontend: Auto-configured to connect to backend

### Option 2: Docker Compose (Local/VPS)
```bash
# Set your Gemini API key
export GEMINI_API_KEY=your_api_key_here

# Start both services
docker-compose up -d

# Access the app
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

### Option 3: Manual Deployment

#### Backend Deployment
```bash
cd backend
npm install
export GEMINI_API_KEY=your_api_key_here
export NODE_ENV=production
npm start
```

#### Frontend Deployment
```bash
npm install
npm run build
export NEXT_PUBLIC_API_URL=https://your-backend-url.com
npm start
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_TEMPLATES=true
NEXT_PUBLIC_ENABLE_ANALYSIS=true
```

### Backend (.env)
```env
NODE_ENV=production
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=info
```

## 📊 Health Monitoring

### Health Check Endpoints
- **Main Health**: `GET /api/health`
- **Readiness**: `GET /api/health/ready`
- **Liveness**: `GET /api/health/live`

### Health Response Example
```json
{
  "status": "healthy",
  "message": "LegalEase API is running",
  "timestamp": "2025-09-16T01:49:27.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "2.0.0",
  "memory": {
    "used": 45,
    "total": 128
  },
  "services": {
    "gemini": {
      "status": "healthy",
      "configured": true,
      "responsive": true
    },
    "fileProcessing": true,
    "cors": true
  }
}
```

## 🔒 Security Checklist

- ✅ Environment variables configured
- ✅ CORS origins restricted to frontend domain
- ✅ Rate limiting enabled (100 requests/15min)
- ✅ Helmet security headers
- ✅ File upload size limits (50MB)
- ✅ Error details hidden in production
- ✅ Health checks configured

## 📈 Performance Optimization

### Frontend
- ✅ Next.js production build optimization
- ✅ Static asset optimization
- ✅ Code splitting enabled
- ✅ Image optimization

### Backend
- ✅ Compression middleware
- ✅ Memory usage monitoring
- ✅ Request logging
- ✅ Graceful error handling

## 🐳 Docker Deployment

### Build Images
```bash
# Backend
cd backend
docker build -t legalease-backend .

# Frontend
cd ..
docker build -t legalease-frontend .
```

### Run Containers
```bash
# Backend
docker run -d \
  --name legalease-backend \
  -p 8000:8000 \
  -e GEMINI_API_KEY=your_key \
  -e NODE_ENV=production \
  legalease-backend

# Frontend
docker run -d \
  --name legalease-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  legalease-frontend
```

## 🔍 Troubleshooting

### Common Issues

1. **Gemini API Errors**
   - Check API key is set correctly
   - Verify API key has proper permissions
   - Check health endpoint: `/api/health`

2. **CORS Errors**
   - Update `CORS_ORIGIN` in backend env
   - Ensure frontend URL matches exactly

3. **File Upload Issues**
   - Check file size limits (50MB default)
   - Verify supported file types
   - Check disk space on server

4. **Memory Issues**
   - Monitor `/api/health` for memory usage
   - Consider upgrading server plan
   - Check for memory leaks in logs

### Logs Location
- **Development**: Console output
- **Production**: Winston logger (configurable)
- **Docker**: `docker logs container_name`

## 📞 Support

For deployment issues:
1. Check health endpoints
2. Review application logs
3. Verify environment variables
4. Test API endpoints manually

## 🔄 Updates

To update the application:
1. Pull latest code
2. Rebuild containers/redeploy
3. Run health checks
4. Monitor logs for issues

---

**Ready for Production!** 🎉

Your LegalEase application is now configured for deployment with:
- Production-optimized builds
- Comprehensive health monitoring
- Security best practices
- Docker containerization
- Multiple deployment options
