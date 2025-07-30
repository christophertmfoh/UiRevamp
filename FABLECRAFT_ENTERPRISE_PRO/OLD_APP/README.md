# FableCraft - Professional Creative Writing Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.11-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-green.svg)](#testing)

> Creative writing platform optimized for Replit development with AI integration, intuitive project management, and collaborative features.

## 🚀 **Overview**

FableCraft is a creative development environment designed for writers, storytellers, and creative teams. Built with modern Replit-native architecture, it provides intuitive tools for novel writing, screenplay development, character management, and collaborative storytelling.

### **Key Features**

- 🎭 **Advanced Project Management** - Multi-format support (novels, screenplays, short stories)
- 🤖 **AI-Powered Writing Assistant** - Integrated content generation and creative support
- 👥 **Character Development System** - Comprehensive character profiles with relationship mapping
- 📖 **Story Structure Tools** - Outline management and narrative architecture
- 🎨 **Professional Theming** - 7 custom themes optimized for writing environments
- 📊 **Progress Tracking** - Goals, metrics, and productivity analytics
- 🔒 **Development Security** - Secure authentication and data protection for creative workflow

## 🏗️ **Architecture**

### **Technology Stack**

```
Frontend:  React 18 + TypeScript + Vite + Tailwind CSS
Backend:   Node.js + Express + TypeScript
Database:  PostgreSQL + Drizzle ORM
State:     Zustand + React Query
Testing:   Vitest + Testing Library + Supertest
AI:        Google Generative AI + OpenAI Integration
```

### **Project Structure**

```
fablecraft/
├── src/                    # Frontend application
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   └── __tests__/         # Frontend tests
├── server/                # Backend API
│   ├── routes/            # API endpoints
│   ├── storage/           # Data layer abstraction
│   └── __tests__/         # Backend tests
├── shared/                # Shared types and schemas
├── docs/                  # Documentation
│   ├── api/               # API documentation
│   ├── deployment/        # Deployment guides
│   └── development/       # Development guides
└── scripts/               # Automation scripts
```

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ and npm 8+
- PostgreSQL 14+ (or use development mock storage)
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/christophertmfoh/UiRevamp.git
cd fablecraft

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

The application will be available at `http://localhost:5000`

### **Development Setup**

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Pre-commit checks
npm run pre-commit
```

## 📚 **Documentation**

### **For Developers**
- [Development Setup Guide](docs/development/setup.md)
- [API Documentation](docs/api/README.md)
- [Testing Guide](docs/development/testing.md)
- [Contributing Guidelines](docs/development/contributing.md)

### **For DevOps/Deployment**
- [Deployment Guide](docs/deployment/README.md)
- [Environment Configuration](docs/deployment/environment.md)
- [Security Guidelines](docs/deployment/security.md)

### **For Business/Product**
- [Feature Overview](docs/features.md)
- [User Guide](docs/user-guide.md)
- [API Reference](docs/api/reference.md)

## 🧪 **Testing**

### **Test Coverage**

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User journey validation
- **Performance Tests**: Load and response time testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Generate coverage reports
npm run test:coverage

# View coverage report
npx vite preview --outDir coverage
```

### **Quality Assurance**

- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Pre-commit hooks
- **Vitest**: Fast testing framework

## 🚀 **Development & Deployment**

### **Replit Development Environment**

```bash
# Quick development setup
npm run dev

# Performance-optimized development
npm run dev:performance

# Build for testing
npm run build
```

### **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (Production) |
| `GEMINI_API_KEY` | Google AI API key | No |
| `OPENAI_API_KEY` | OpenAI API key | No |
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 5000) | No |

### **Replit Development**

```bash
# One-command setup for Replit
npm run replit:setup

# Optimized development with performance monitoring
npm run dev:performance

# Clean slate optimization
npm run replit:optimize
```

## 🔒 **Security**

- **Authentication**: Secure session management
- **Data Validation**: Input sanitization and validation
- **API Security**: Rate limiting and CORS protection  
- **Dependency Scanning**: Automated vulnerability checks
- **Environment Isolation**: Secure configuration management

## 📈 **Performance**

- **Bundle Optimization**: Code splitting and tree shaking
- **Caching Strategy**: Intelligent API and asset caching
- **Database Optimization**: Query optimization and indexing
- **CDN Ready**: Static asset optimization
- **Monitoring**: Performance metrics and alerting

## 🤝 **Contributing**

We welcome contributions from the community! Please read our [Contributing Guidelines](docs/development/contributing.md) before submitting pull requests.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run pre-commit`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📋 **Roadmap**

### **Current Version (v1.0.0)**
- ✅ Core writing platform
- ✅ Character management system
- ✅ AI integration
- ✅ Professional theming
- ✅ Enterprise testing framework

### **Upcoming Features**
- 🚧 Real-time collaboration
- 🚧 Advanced AI features
- 🚧 Mobile application
- 🚧 Publishing integration
- 🚧 Team management

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check our [docs](docs/) directory
- **Issues**: Report bugs via [GitHub Issues](https://github.com/christophertmfoh/UiRevamp/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/christophertmfoh/UiRevamp/discussions)

## 📊 **Stats**

- **Lines of Code**: 50,000+
- **Test Coverage**: 80%+
- **Components**: 100+
- **API Endpoints**: 50+
- **Supported Themes**: 7
- **Languages**: TypeScript, JavaScript, CSS

---

**Built with ❤️ by the FableCraft team**

*Professional creative writing platform for the modern age.*