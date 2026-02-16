# Deployment Guide - AI Data Steward

## Pre-Deployment Checklist

### Infrastructure

- [ ] Server/Cloud resources provisioned
- [ ] Domain name configured
- [ ] SSL certificates obtained
- [ ] Database backups configured
- [ ] Monitoring tools set up

### Environment Variables

- [ ] `.env` configured with production values
- [ ] Secrets stored in secure vault (not in files)
- [ ] Database credentials rotated
- [ ] API keys for LLM providers configured
- [ ] CORS origins updated for production domain

### Security

- [ ] Security headers configured (Helmet)
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Database encrypted at rest
- [ ] Backup encryption enabled
- [ ] Firewall rules configured
- [ ] DDoS protection enabled

### RGPD Compliance

- [ ] Privacy policy published
- [ ] Data retention policy configured
- [ ] Consent mechanisms implemented (if applicable)
- [ ] Data Processing Agreement with LLM provider
- [ ] DPIA completed for AI features

## Deployment Options

### Option 1: Docker Compose (Simple)

**Best for**: Small teams, single server deployments

```bash
# 1. Clone repository
git clone <repo-url>
cd ai-data-steward

# 2. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 3. Build and start
docker compose -f docker-compose.prod.yml up -d

# 4. Verify
curl https://your-domain.com/health
```

### Option 2: Kubernetes (Scalable)

**Best for**: High traffic, multi-region deployments

```yaml
# kubernetes/deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: steward-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: steward-api
  template:
    metadata:
      labels:
        app: steward-api
    spec:
      containers:
      - name: api
        image: your-registry/steward-api:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: steward-secrets
              key: database-url
```

### Option 3: Serverless (Future)

**Best for**: Variable traffic, cost optimization

- Deploy API as AWS Lambda / Google Cloud Functions
- Use managed PostgreSQL (RDS, Cloud SQL)
- Use managed Redis (ElastiCache, Memorystore)

## Database Setup

### PostgreSQL

```bash
# Create database
createdb stewarddb

# Run migrations (future)
pnpm --filter @demolab/api migrate:up

# Seed sample data (optional)
make seed
```

### Backups

```bash
# Automated daily backup
0 2 * * * pg_dump stewarddb | gzip > /backups/stewarddb-$(date +\%Y\%m\%d).sql.gz
```

## Monitoring

### Health Checks

```yaml
# docker-compose.prod.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Logging

- Centralized logging with ELK stack or Cloud Logging
- Log retention: 90 days
- Alert on ERROR level logs

### Metrics

Monitor:
- Request rate
- Response times
- Error rate
- Database connections
- Cache hit rate
- LLM API usage and costs

## Scaling

### Horizontal Scaling

```bash
# Scale API replicas
docker compose up -d --scale api=3

# Kubernetes
kubectl scale deployment steward-api --replicas=5
```

### Database Scaling

- Read replicas for queries
- Connection pooling (PgBouncer)
- Query optimization with indexes

## Rollback Plan

```bash
# Rollback to previous version
docker compose down
git checkout v1.2.3
docker compose up -d

# Kubernetes
kubectl rollout undo deployment/steward-api
```

## Post-Deployment

- [ ] Smoke tests passed
- [ ] Performance tests passed
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Team notified
- [ ] Monitoring alerts configured
- [ ] Backup verified

## Troubleshooting

### High Memory Usage

```bash
# Check container stats
docker stats

# Restart containers
docker compose restart api
```

### Database Connection Issues

```bash
# Check PostgreSQL logs
docker compose logs postgres

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Port Conflicts

```bash
# Check what's using port
lsof -i :8080

# Use different port in .env
PORT_API=8081
```

## Support

For deployment issues, contact: devops@demolab.com
