# Phase 2 Submission Checklist

## ✅ Prerequisites
- [ ] Install Terraform
- [ ] Install Azure CLI
- [ ] Install Docker Desktop
- [ ] Have Azure account with credits/subscription

## ✅ Code Setup
- [ ] Backend .env file created (from env.example)
- [ ] All code changes committed to develop branch
- [ ] Dockerfile and docker-compose.yml working

## ✅ Azure Infrastructure (Terraform)
- [ ] Login to Azure CLI (`az login`)
- [ ] Navigate to terraform directory
- [ ] Run `terraform init`
- [ ] Run `terraform plan` (review output)
- [ ] Run `terraform apply` (type 'yes' when prompted)
- [ ] **SCREENSHOT**: Terraform successful deployment
- [ ] Save terraform output values

## ✅ Docker Image
- [ ] Login to Azure Container Registry
- [ ] Build Docker image locally
- [ ] Tag image for ACR
- [ ] Push image to ACR
- [ ] **SCREENSHOT**: Image in Azure Container Registry

## ✅ Azure Web App Deployment
- [ ] Configure Web App environment variables
- [ ] Set container image source to ACR
- [ ] Configure database connection
- [ ] Deploy and restart Web App
- [ ] **SCREENSHOT**: Web App running successfully

## ✅ Testing
- [ ] Visit live URL in browser
- [ ] Test application functionality
- [ ] Verify database connection
- [ ] **SCREENSHOT**: Application working in browser

## ✅ Documentation
- [ ] Update phase.md with live URL
- [ ] Add all required screenshots to phase.md
- [ ] Add peer review link to phase.md
- [ ] Write reflection in phase.md
- [ ] Commit and push all changes

## ✅ Final Submission
- [ ] Verify all files are committed to develop branch
- [ ] Submit repository link
- [ ] Submit phase.md file
- [ ] Complete peer review (if assigned)

## 🎯 Expected Live URL
`https://sbhubwebapp2024.azurewebsites.net`

## 📸 Required Screenshots
1. Terraform successful deployment
2. Azure Resource Group with all resources
3. Azure Container Registry with your image
4. Azure Web App configuration
5. Your application running in browser
6. Database connection working

## 🔧 If Something Goes Wrong
- Check Azure Portal for resource status
- Review Web App logs: `az webapp log tail --name sbhubwebapp2024 --resource-group sbhub-rg`
- Verify ACR login: `az acr login --name sbhubacr2024`
- Check Terraform state: `terraform show` 