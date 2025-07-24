# Phase 2 Submission

## Live Public URL

**https://sbhubwebapp2024.azurewebsites.net**

---

## Screenshots of Provisioned Resources

**Required Screenshots:**
1. Azure Resource Group showing all resources (Database, Container Registry, Web App)
2. Azure Container Registry with your Docker image
3. Azure Web App configuration and settings
4. Your application running in browser at the live URL
5. Database connection working (if you can show this)

**Azure Resources Overview:**
![Azure All Resources](azure-resources-screenshot.png)

*This screenshot shows all provisioned Azure resources including:*
- **sbhub-db**: PostgreSQL Flexible Server (Database)
- **sbhubacr2024**: Azure Container Registry 
- **sbhubwebapp2024**: Web App for Containers
- **sbhub-app-service-plan**: App Service Plan
- All resources in **sbhub-rg** resource group, **Spain Central** region

**Additional Screenshots Needed:**
- [ ] Screenshot 2: Azure Container Registry with Docker image
- [ ] Screenshot 3: Azure Web App configuration
- [ ] Screenshot 4: Live Application running in browser
- [ ] Screenshot 5: Database Connection (optional)

---

## Peer Review Link

**Instructions:** Review a peer's pull request and paste the link here.

**Peer Review Link:** [Add your peer review link here]

---

## Reflection

**Instructions:** Write a brief reflection (2-3 paragraphs) about your experience with Terraform (IaC) and the manual deployment process.

**Your Reflection:**

My experience with Infrastructure as Code (IaC) using Terraform and the manual deployment process has been both challenging and enlightening. Initially, I found the concept of defining infrastructure through code to be quite abstract, but as I worked through the process, I began to appreciate its power and efficiency.

The biggest challenges I encountered were related to Azure-specific configurations and regional restrictions. I learned that Azure has strict policies about which regions can be used, and I had to adapt my Terraform configuration from the default region to `spaincentral` to comply with Azure's policy requirements. This taught me the importance of understanding cloud provider constraints and the value of IaC in quickly adapting to such requirements. Additionally, I faced issues with Node.js module systems when transitioning from CommonJS to ES modules, which required significant debugging and code refactoring to ensure compatibility with the containerized environment.

The manual deployment process revealed the complexity of modern application deployment. I learned that containerization with Docker is not just about packaging an application, but also about understanding the runtime environment, file paths, and static asset serving. The most valuable lesson was the importance of iterative debugging - each issue we encountered (CORS configuration, static file serving, trust proxy settings) required careful analysis of logs and systematic problem-solving. This experience has given me a much deeper appreciation for DevOps practices and the importance of proper infrastructure management in modern software development. I would approach future deployments with more thorough testing of the containerized application locally before pushing to production, and I would implement better logging and monitoring from the start to facilitate debugging. 