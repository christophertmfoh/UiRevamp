# 🚀 Replit Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Run the Setup Script
```bash
./replit-setup.sh
```

### 2. Add Required Secrets
In Replit **Secrets** (🔒 icon):
```
DATABASE_URL=your_neon_database_url
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY=your_google_api_key
```

### 3. Start Optimized Server
```bash
npm run replit:dev
```

### 4. Test Endpoints
- **App**: Your Replit webview
- **Health**: `/health`  
- **Metrics**: `/metrics`

## 📊 Monitoring Commands

```bash
# Check health
npm run replit:health

# View metrics  
npm run replit:metrics

# Deploy to production
npm run replit:deploy
```

## 🎯 Key Optimizations Applied

✅ **Memory**: 512MB limit optimization  
✅ **Database**: 3-5 connection limit  
✅ **Caching**: AI responses cached  
✅ **Bundling**: Code splitting enabled  
✅ **Logging**: Performance-optimized  
✅ **Monitoring**: Health checks added  

## 🔧 Replit-Specific Settings

- **Max Memory**: 512MB
- **DB Connections**: 3 (dev) / 5 (prod)
- **Cache Duration**: 5 minutes
- **Garbage Collection**: Auto-enabled
- **Logging**: Minimal for performance

## 📈 Performance Targets

- **Response Time**: < 500ms
- **Memory Usage**: < 400MB
- **Error Rate**: < 1%
- **Uptime**: 99%+

## 🚨 Troubleshooting

**Memory Issues**: Check `/metrics` endpoint  
**DB Issues**: Verify `DATABASE_URL` secret  
**API Issues**: Check API key secrets  
**Build Issues**: Run `npm run build`

## 🎉 Success Indicators

✅ `/health` returns 200 status  
✅ Memory stays under 400MB  
✅ API responses under 500ms  
✅ No connection errors  

---

**Need help?** Check `REPLIT_IMPLEMENTATION.md` for detailed instructions!