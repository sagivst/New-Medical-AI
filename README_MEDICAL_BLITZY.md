# Medical Blitzy AI - Integrated Health Navigator

A comprehensive healthcare platform that provides AI-powered provider matching, document processing, insurance navigation, and multi-language communication support.

## Features

- **Document Processing Engine**: OCR, NLP, and FHIR conversion of medical documents
- **AI Provider Matching**: Machine learning system to match patients with appropriate healthcare providers
- **Insurance Navigation**: Automated claim processing, appeals generation, and coverage analysis
- **Multi-language Communication**: Support for 20+ languages including Hebrew RTL support
- **Medical Tourism Integration**: Travel coordination and cross-border payment processing
- **Pharmaceutical Integration**: Patient assistance programs and compassionate use programs
- **FHIR Compliance**: Full HL7 FHIR R4 implementation for healthcare data interoperability

## Architecture

- **Frontend**: React/TypeScript with Tailwind CSS and shadcn/ui
- **Backend**: FastAPI microservices
- **Database**: PostgreSQL and DocumentDB
- **Infrastructure**: AWS EKS with HIPAA compliance
- **CI/CD**: GitOps with ArgoCD

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12+
- Docker
- AWS CLI (for deployment)

### Development Setup

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run the development servers

See individual service README files for detailed setup instructions.

## Project Structure

```
medical-blitzy-ai/
├── frontend/                 # React TypeScript frontend
├── backend/                  # FastAPI backend services
├── infrastructure/           # Terraform and Kubernetes manifests
├── docs/                     # Documentation
└── scripts/                  # Development and deployment scripts
```

## Compliance

This system is designed to be HIPAA-compliant and follows healthcare industry best practices for data security and privacy.

## License

Proprietary - Medical Blitzy AI System
