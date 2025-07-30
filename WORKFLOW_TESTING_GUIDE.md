# Workflow Testing Guide

## Overview
This guide helps you verify that both CI and CD workflows are working properly in the Session Buddy Hub project.

## Workflow Files
- **CI Workflow**: `.github/workflows/ci.yml` - Runs on push/PR to main/develop
- **CD Workflow**: `.github/workflows/cd.yml` - Runs on push to main/develop

## Testing Strategy

### 1. CI Workflow Testing

#### What CI Does:
- **Frontend CI**: Lint, type check, test, build, audit dependencies
- **Backend CI**: Lint, setup test DB, run migrations, test, audit dependencies

#### How to Test:
1. **Create a test commit** (any small change)
2. **Push to develop branch** to trigger CI
3. **Check GitHub Actions** for:
   - ✅ Frontend CI job completes
   - ✅ Backend CI job completes
   - ✅ All linting passes
   - ✅ All tests pass
   - ✅ Security audits complete

#### Expected Results:
```
✅ Frontend CI
  ✅ Install dependencies
  ✅ Lint frontend
  ✅ Type check frontend
  ✅ Test frontend
  ✅ Build frontend
  ✅ Audit frontend dependencies

✅ Backend CI
  ✅ Install dependencies
  ✅ Lint backend
  ✅ Setup test environment
  ✅ Run migrations
  ✅ Test backend
  ✅ Audit backend dependencies
```

### 2. CD Workflow Testing

#### What CD Does:
1. **Security Scan**: npm audit, CodeQL SAST
2. **Build & Test**: Lint, test, build application
3. **Container Build**: Build Docker image, Trivy scan
4. **Deploy Staging**: Deploy to staging environment (develop branch)
5. **Deploy Production**: Deploy to production (main branch)
6. **Monitoring**: Health checks and notifications

#### How to Test:

##### Test Staging Deployment:
1. **Make a change** to trigger CD pipeline
2. **Push to develop branch**
3. **Monitor GitHub Actions** for:
   - ✅ Security & Quality Scan
   - ✅ Build and Test
   - ✅ Build and Scan Container
   - ✅ Deploy to Staging
   - ✅ Monitoring Check

##### Test Production Deployment:
1. **Merge develop into main**
2. **Monitor GitHub Actions** for:
   - ✅ All stages above
   - ✅ Deploy to Production
   - ✅ CHANGELOG update

#### Expected Results:
```
✅ Security & Quality Scan
  ✅ npm audit (frontend & backend)
  ✅ CodeQL SAST scan
  ✅ Upload security results

✅ Build and Test
  ✅ Install dependencies
  ✅ Run linting
  ✅ Run type checking
  ✅ Setup test environment
  ✅ Run backend tests
  ✅ Run frontend tests
  ✅ Build application
  ✅ Upload build artifacts

✅ Build and Scan Container
  ✅ Download build artifacts
  ✅ Login to Azure Container Registry
  ✅ Build and push container image
  ✅ Run Trivy vulnerability scanner
  ✅ Upload Trivy scan results

✅ Deploy to Staging (develop branch only)
  ✅ Deploy to Azure Web App (Staging)
  ✅ Health check staging deployment

✅ Deploy to Production (main branch only)
  ✅ Deploy to Azure Web App (Production)
  ✅ Health check production deployment
  ✅ Update CHANGELOG
  ✅ Commit CHANGELOG update

✅ Monitoring Check
  ✅ Check application health
  ✅ Send deployment notification
```

## Manual Testing Steps

### Step 1: Test CI Workflow
```bash
# Make a small change
echo "# Test CI" >> test-ci.md
git add test-ci.md
git commit -m "test: verify CI workflow"
git push origin develop
```

### Step 2: Test CD Workflow (Staging)
```bash
# Make a visible change
echo "// Test CD Pipeline" >> src/pages/Index.tsx
git add src/pages/Index.tsx
git commit -m "feat: test CD pipeline deployment"
git push origin develop
```

### Step 3: Test CD Workflow (Production)
```bash
# Merge to main to trigger production deployment
git checkout main
git merge develop
git push origin main
```

## Verification Checklist

### CI Workflow ✅
- [ ] Frontend CI job runs successfully
- [ ] Backend CI job runs successfully
- [ ] All linting passes
- [ ] All type checking passes
- [ ] All tests pass
- [ ] Security audits complete
- [ ] No critical vulnerabilities found

### CD Workflow ✅
- [ ] Security scans complete
- [ ] Build and test stages pass
- [ ] Container builds successfully
- [ ] Container security scan passes
- [ ] Staging deployment succeeds
- [ ] Production deployment succeeds
- [ ] Health checks pass
- [ ] CHANGELOG updates automatically

### Infrastructure ✅
- [ ] Azure Container Registry accessible
- [ ] Azure Web Apps configured
- [ ] Database connections working
- [ ] Environment variables set
- [ ] Secrets configured in GitHub

## Troubleshooting

### Common Issues:
1. **CI fails on backend tests**: Check Jest configuration and ES modules
2. **CD fails on container build**: Verify ACR credentials
3. **Deployment fails**: Check Azure Web App configuration
4. **Health checks fail**: Verify application startup and health endpoint

### Debug Commands:
```bash
# Check workflow status
gh run list

# View workflow logs
gh run view <run-id>

# Check Azure resources
az webapp list --resource-group sbhub-rg
az acr repository list --name sbhubacr2024
```

## Success Criteria
- ✅ Both workflows run without errors
- ✅ All security scans pass
- ✅ Applications deploy successfully
- ✅ Health checks return 200 OK
- ✅ Monitoring and alerts work
- ✅ CHANGELOG updates automatically 