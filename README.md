# Cloud-Native URL Intelligence Platform

An enterprise-grade, serverless URL shortener built on Cloudflare, featuring real-time traffic analytics and automated AI threat detection.

## Architecture

This project is built using modern cloud-native principles:
- **Frontend**: React, TypeScript, Tailwind CSS, Vite (Hosted on Cloudflare Pages).
- **Backend/API Layer**: Cloudflare Workers (using Hono framework).
- **Database Layer**: Cloudflare KV (Serverless Key-Value Storage).
- **Security Intelligence**: Cloudflare Workers AI (`@cf/huggingface/distilbert-sst-2-int8` model).
- **Infrastructure as Code**: Wrangler.

## Architecture Diagram

```mermaid
flowchart TD
    Client((User)) -->|Visits Dashboard| Pages[Cloudflare Pages]
    
    Client -->|API Requests| Worker[Cloudflare Worker]
    
    Worker -->|POST /api/shorten| H1(Shorten Handler)
    Worker -->|GET /{code}| H2(Redirect Handler)
    Worker -->|GET /api/analytics| H3(Analytics Handler)
    
    H1 <-->|NLP Threat Intel| AI[Cloudflare Workers AI]
    
    H1 -->|Write Mapping| KV[(Cloudflare KV)]
    H2 -->|Read Mapping & Write Telemetry| KV
    H3 -->|Query Analytics| KV
    
    classDef cf fill:#F38020,stroke:#232F3E,stroke-width:2px,color:white;
    class Pages,Worker,H1,H2,H3,AI,KV cf;
```

### Directory Structure
- `backend/`: Node.js Lambda functions handling URL generation, redirection, and analytics.
- `frontend/`: The React Dashboard application.
- `terraform/`: The Terraform configuration to provision the AWS infrastructure.

## Deployment

1. **Provision Infrastructure**:
   Ensure you have AWS credentials configured.
   ```bash
   cd terraform
   terraform init
   terraform apply
   ```
   *Note: This will output the `api_endpoint` which you will need to configure in the frontend.*

2. **Run Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## Features

- **Short Link Generation**: High-speed Base62 identifier generation.
- **AI Threat Detection**: Before shortening, URLs are passed through AWS Comprehend to scan for suspicious keywords, malicious intent, or high negative sentiment.
- **Latency-First Redirection**: 302 Found redirects driven directly by DynamoDB lookups.
- **Real-Time Telemetry**: Click tracking captures the timestamp, User-Agent, and Geolocation.
- **Analytics Dashboard**: Visualizes geographic click distribution, device configurations, and daily trajectories.
