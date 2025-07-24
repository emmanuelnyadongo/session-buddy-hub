# Complete Deployment Guide - Phase 2

## Prerequisites Installation

### 1. Install Required Tools
- **Terraform**: Download from https://learn.hashicorp.com/tutorials/terraform/install-cli
- **Azure CLI**: Download from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli  
- **Docker Desktop**: Download from https://www.docker.com/products/docker-desktop

### 2. Verify Installations
```bash
terraform --version
az --version
docker --version
```

## Step 1: Azure Login and Setup

### 1.1 Login to Azure
```bash
az login
```
- This will open a browser window for authentication
- Sign in with your Azure account

### 1.2 Set Azure Subscription (if you have multiple)
```bash
az account list --output table
az account set --subscription "YOUR_SUBSCRIPTION_NAME"
```

## Step 2: Provision Azure Infrastructure

### 2.1 Navigate to Terraform Directory
```bash
cd terraform
```

### 2.2 Initialize Terraform
```bash
terraform init
```

### 2.3 Review the Plan
```bash
terraform plan
```
- Review what resources will be created
- Make sure the names are unique (especially ACR and Web App names)

### 2.4 Apply Terraform Configuration
```bash
terraform apply
```
- Type `yes` when prompted
- **TAKE SCREENSHOT**: Capture the successful Terraform output

### 2.5 Get Resource Information
```bash
terraform output
```
- **SAVE THIS OUTPUT**: You'll need these values for the next steps

## Step 3: Build and Push Docker Image

### 3.1 Login to Azure Container Registry
```bash
az acr login --name sbhubacr2024
```

### 3.2 Build Docker Image
```bash
cd ..
docker build -t sbhubacr2024.azurecr.io/session-buddy-hub:latest .
```

### 3.3 Push Image to ACR
```bash
docker push sbhubacr2024.azurecr.io/session-buddy-hub:latest
```
- **TAKE SCREENSHOT**: Show the image in Azure Container Registry

## Step 4: Configure and Deploy Web App

### 4.1 Get Database Connection String
From your Terraform output, construct the database connection string:
```
postgresql://pgadmin:SessionBuddyHub2024!@sbhub-db.postgres.database.azure.com:5432/session_buddy_hub
```

### 4.2 Configure Web App Environment Variables
1. Go to Azure Portal
2. Navigate to your Web App (sbhubwebapp2024)
3. Go to Settings > Configuration
4. Add these Application Settings:
   - `NODE_ENV` = `production`
   - `DB_HOST` = `sbhub-db.postgres.database.azure.com`
   - `DB_PORT` = `5432`
   - `DB_NAME` = `session_buddy_hub`
   - `DB_USER` = `pgadmin`
   - `DB_PASSWORD` = `SessionBuddyHub2024!`
   - `JWT_SECRET` = `your-super-secret-jwt-key-here-make-it-long-and-random`
   - `FRONTEND_URL` = `https://sbhubwebapp2024.azurewebsites.net`

### 4.3 Set Container Image
1. In the Web App, go to Settings > Configuration > General settings
2. Set "Stack settings" to "Docker"
3. Set "Image source" to "Azure Container Registry"
4. Set "Registry" to your ACR
5. Set "Image" to `session-buddy-hub:latest`
6. Set "Tag" to `latest`

### 4.4 Deploy
1. Save all configuration changes
2. Restart the Web App
3. **TAKE SCREENSHOT**: Show the Web App running successfully

## Step 5: Test Your Deployment

### 5.1 Get Your Live URL
Your app will be available at: `https://sbhubwebapp2024.azurewebsites.net`

### 5.2 Test the Application
1. Visit the URL in your browser
2. Test registration/login functionality
3. **TAKE SCREENSHOT**: Show your app running successfully

## Step 6: Complete Submission

### 6.1 Update phase.md
Fill in the `phase.md` file with:
- Your live URL: `https://sbhubwebapp2024.azurewebsites.net`
- Screenshots of:
  - Terraform successful deployment
  - Azure Container Registry with your image
  - Azure Web App running
  - Your application working in the browser
- Peer review link (you'll get this from your instructor)
- Reflection on the deployment process

### 6.2 Commit and Push Changes
```bash
git add .
git commit -m "Complete Phase 2: Containerization and Azure deployment"
git push origin develop
```

## Troubleshooting

### Common Issues:
1. **ACR name not unique**: Change `acr_name` in terraform.tfvars
2. **Web App name not unique**: Change `webapp_name` in terraform.tfvars
3. **Database connection issues**: Check firewall rules in Azure Portal
4. **Container not starting**: Check Web App logs in Azure Portal

### Useful Commands:
```bash
# Check Web App logs
az webapp log tail --name sbhubwebapp2024 --resource-group sbhub-rg

# List ACR repositories
az acr repository list --name sbhubacr2024

# Check Terraform state
terraform show
```

## Screenshots Checklist
- [ ] Terraform successful deployment
- [ ] Azure Resource Group with all resources
- [ ] Azure Container Registry with your image
- [ ] Azure Web App configuration
- [ ] Your application running in browser
- [ ] Database connection working 