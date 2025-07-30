# CI Workflow Test

This is a test commit to verify the CI workflow is working properly.

## What the CI workflow should do:
1. Frontend CI:
   - Install dependencies
   - Lint frontend code
   - Type check frontend
   - Test frontend (if tests exist)
   - Build frontend
   - Audit frontend dependencies

2. Backend CI:
   - Install backend dependencies
   - Lint backend code
   - Setup test environment with PostgreSQL
   - Run backend migrations
   - Test backend (if RUN_BACKEND_TESTS is true)
   - Build backend (if applicable)
   - Audit backend dependencies

## Expected Results:
- Both frontend and backend jobs should complete successfully
- All linting, type checking, and testing should pass
- Security audits should complete without critical issues 