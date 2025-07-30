# Video Demonstration Script - Phase 3 Assessment

## Overview
This script follows the exact 5-stage sequence required for the Phase 3 video demonstration. Total time: 10 minutes maximum.

## Pre-Recording Setup
1. **Prepare your environment**:
   - Have both staging and production URLs ready
   - Ensure GitHub repository is accessible
   - Have a feature branch ready for demonstration
   - Test the complete pipeline beforehand

2. **Recording requirements**:
   - High-quality screen recording (minimum 720p)
   - Clear audio narration
   - Supported format: MP4, MOV, or AVI
   - Maximum file size: 500MB

## Stage 1: Initial State (1 minute)

### Script:
"Hello, my name is [Your Name], and I'm demonstrating the Phase 3 Continuous Deployment implementation for Session Buddy Hub. Let me start by showing you the currently deployed production application."

### Actions:
1. **Open browser** and navigate to: `https://sbhubwebapp2024.azurewebsites.net`
2. **Demonstrate functionality**:
   - Show the login page
   - Navigate through the application
   - Confirm it's live and functional
3. **State clearly**: "This is our production environment, currently running version [current version]"

### Key Points:
- Application is live and functional
- Clear identification of production environment
- Professional presentation

---

## Stage 2: Code Modification (2 minutes)

### Script:
"Now I'll demonstrate the automated deployment process by making a small, visible code change and pushing it through our CI/CD pipeline."

### Actions:
1. **Open your code editor** and navigate to a visible UI component
2. **Make a small change** (e.g., modify text in a component):
   ```jsx
   // Example: Change a heading or button text
   <h1>Welcome to Session Buddy Hub - Updated!</h1>
   ```
3. **Commit using conventional commit format**:
   ```bash
   git add .
   git commit -m "feat: update welcome message for demo"
   git push origin feature/demo-update
   ```
4. **Show the commit in repository**:
   - Navigate to GitHub repository
   - Show the commit history
   - Point out the conventional commit format

### Key Points:
- Use conventional commit format
- Make a visible, demonstrable change
- Show the commit in the repository

---

## Stage 3: Staging Deployment (3 minutes)

### Script:
"Now I'll create a pull request to merge into the develop branch, which will trigger our automated staging deployment. Let me walk you through the pipeline execution."

### Actions:
1. **Create pull request**:
   - Go to GitHub repository
   - Create PR from feature branch to develop
   - Show the PR creation process

2. **Explain pipeline execution** (while it runs):
   - **Security Scanning**: "First, our pipeline runs security scans including dependency vulnerability scanning and container image scanning with Trivy."
   - **Build Process**: "Next, it builds the application and runs our comprehensive test suite."
   - **Testing**: "We have automated tests for both frontend and backend components."
   - **Container Build**: "The pipeline then builds a Docker container and scans it for vulnerabilities."

3. **Show staging deployment**:
   - Wait for pipeline completion
   - Navigate to: `https://sbhubwebapp2024-staging.azurewebsites.net`
   - Show the updated change on staging
   - Point out: "Notice how the change is now live on staging, but not yet on production."

### Key Points:
- Explain each pipeline stage clearly
- Show real-time pipeline execution
- Demonstrate staging environment
- Highlight the separation between staging and production

---

## Stage 4: Production Release (2 minutes)

### Script:
"Now I'll merge the changes into the main branch, which will trigger our production deployment with manual approval."

### Actions:
1. **Merge to main**:
   - Create PR from develop to main
   - Show the manual approval step
   - Explain: "Production deployments require manual approval for safety."

2. **Explain monitoring dashboard**:
   - Show monitoring configuration
   - Point out health check endpoints
   - Explain alarm configuration:
     - "We have alarms set up for high error rates, response times, and database issues."
     - "Our health check endpoint monitors application status."

3. **Show production deployment**:
   - Wait for deployment completion
   - Navigate to production URL
   - Show the change is now live

### Key Points:
- Emphasize manual approval for production
- Explain monitoring and alerting
- Show successful production deployment

---

## Stage 5: Verification (2 minutes)

### Script:
"Finally, let me verify the successful deployment and show you our updated documentation."

### Actions:
1. **Refresh production URL**:
   - Navigate to: `https://sbhubwebapp2024.azurewebsites.net`
   - Show the updated change is live
   - Confirm application is fully functional

2. **Show updated CHANGELOG.md**:
   - Open CHANGELOG.md in repository
   - Point out the new entry for the deployment
   - Explain: "Our pipeline automatically updates the changelog with deployment information."

3. **Summary**:
   - "We've successfully demonstrated a complete automated deployment from code change to production."
   - "The pipeline includes security scanning, testing, and monitoring."
   - "Staging provides a safe environment for testing before production deployment."

### Key Points:
- Confirm successful deployment
- Show automated documentation updates
- Provide clear summary of the process

---

## Technical Talking Points (Prepare for Oral Viva)

### DevOps Principles:
- **Continuous Integration**: "We integrate code changes frequently and automatically test them."
- **Continuous Deployment**: "We automate the deployment process while maintaining safety controls."
- **Infrastructure as Code**: "Our Azure resources are defined in Terraform for consistency and version control."

### Security Implementation:
- **Dependency Scanning**: "We scan for known vulnerabilities in our dependencies."
- **Container Scanning**: "We scan our Docker images for security issues before deployment."
- **SAST**: "We use CodeQL for static application security testing."

### Monitoring Strategy:
- **Health Checks**: "We have automated health checks to ensure application availability."
- **Alerts**: "We have configured alerts for critical issues like high error rates."
- **Logging**: "We have comprehensive logging for troubleshooting and monitoring."

### Technical Decisions:
- **Branch Strategy**: "We use develop for staging and main for production to separate concerns."
- **Manual Approval**: "Production deployments require manual approval to prevent accidental deployments."
- **Containerization**: "We use Docker for consistent deployment across environments."

## Recording Tips

1. **Practice the flow** before recording
2. **Have all URLs bookmarked** for quick access
3. **Speak clearly and professionally**
4. **Show confidence in your technical knowledge**
5. **Keep to the time limit** (10 minutes maximum)
6. **Ensure good video and audio quality**

## Post-Recording

1. **Upload video** to the learning management system
2. **Include video link** in repository README.md
3. **Ensure video is accessible** for the assessment period
4. **Prepare for oral viva** questions based on the demonstration 