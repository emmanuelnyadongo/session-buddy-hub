# Monitoring and Observability Dashboard

## Overview
This document outlines the monitoring and observability setup for Session Buddy Hub, including logging, health checks, and operational alarms.

## Health Check Endpoints

### Production Environment
- **URL**: https://sbhubwebapp2024.azurewebsites.net/api/health
- **Method**: GET
- **Response**: JSON with status, timestamp, and environment info

### Staging Environment
- **URL**: https://sbhubwebapp2024-staging.azurewebsites.net/api/health
- **Method**: GET
- **Response**: JSON with status, timestamp, and environment info

## Application Logging

### Log Levels
- **Development**: Detailed logging with morgan middleware
- **Production**: Combined logging format for better performance

### Log Categories
1. **Authentication Logs**: Login attempts, registration, password resets
2. **Session Management**: Session creation, updates, deletions
3. **User Activity**: Profile updates, search queries
4. **Error Logs**: Application errors, database connection issues
5. **Performance Logs**: Response times, database query performance

### Log Format
```json
{
  "timestamp": "2024-07-XXTXX:XX:XX.XXXZ",
  "level": "info|error|warn|debug",
  "message": "Log message",
  "userId": "user-id-if-applicable",
  "sessionId": "session-id-if-applicable",
  "ip": "client-ip",
  "userAgent": "browser-info"
}
```

## Monitoring Dashboard

### Azure Application Insights
- **Resource**: sbhub-app-insights (to be created)
- **Features**:
  - Real-time application performance monitoring
  - Error tracking and alerting
  - User behavior analytics
  - Custom metrics and dashboards

### Key Metrics
1. **Response Time**: Average API response time
2. **Error Rate**: Percentage of failed requests
3. **Throughput**: Requests per minute
4. **Database Performance**: Query execution times
5. **Memory Usage**: Application memory consumption
6. **CPU Usage**: Server CPU utilization

## Operational Alarms

### Critical Alarms
1. **High Error Rate**
   - **Trigger**: Error rate > 5% over 5 minutes
   - **Action**: Email notification to DevOps team
   - **Severity**: Critical

2. **High Response Time**
   - **Trigger**: Average response time > 2000ms over 5 minutes
   - **Action**: Email notification and Slack alert
   - **Severity**: Warning

3. **Database Connection Issues**
   - **Trigger**: Database connection failures > 3 in 1 minute
   - **Action**: Immediate email and SMS notification
   - **Severity**: Critical

4. **Application Unavailable**
   - **Trigger**: Health check endpoint returns non-200 status
   - **Action**: Immediate notification and auto-scaling trigger
   - **Severity**: Critical

### Warning Alarms
1. **High Memory Usage**
   - **Trigger**: Memory usage > 80% for 10 minutes
   - **Action**: Email notification
   - **Severity**: Warning

2. **Low Disk Space**
   - **Trigger**: Available disk space < 20%
   - **Action**: Email notification
   - **Severity**: Warning

## Dashboard Views

### Production Dashboard
- **Overview**: Key metrics at a glance
- **Performance**: Response times and throughput
- **Errors**: Error rates and types
- **Users**: Active users and session data
- **Infrastructure**: Server resources and health

### Staging Dashboard
- **Deployment Status**: Latest deployment information
- **Test Results**: Automated test outcomes
- **Performance**: Staging environment metrics
- **Security**: Security scan results

## Alert Channels
1. **Email**: Primary notification channel
2. **Slack**: Real-time team notifications
3. **SMS**: Critical alerts only
4. **Webhook**: Integration with external systems

## Maintenance Windows
- **Scheduled Maintenance**: Sundays 2:00-4:00 AM UTC
- **Emergency Maintenance**: As needed with 1-hour notice
- **Deployment Windows**: Weekdays 9:00-11:00 AM UTC

## Troubleshooting Guide

### Common Issues
1. **High Response Times**
   - Check database connection pool
   - Review slow queries
   - Monitor server resources

2. **Authentication Failures**
   - Verify JWT token configuration
   - Check database connectivity
   - Review rate limiting settings

3. **Database Connection Issues**
   - Check Azure PostgreSQL service status
   - Verify connection string configuration
   - Review connection pool settings

### Escalation Procedures
1. **Level 1**: Automated monitoring and basic alerts
2. **Level 2**: DevOps team notification and investigation
3. **Level 3**: Emergency response team activation
4. **Level 4**: Management escalation and external support

## Security Monitoring

### Security Alerts
1. **Failed Login Attempts**
   - **Trigger**: > 10 failed attempts from same IP in 5 minutes
   - **Action**: IP blocking and security team notification

2. **Suspicious Activity**
   - **Trigger**: Unusual access patterns or data access
   - **Action**: Account suspension and investigation

3. **Vulnerability Detection**
   - **Trigger**: Security scan detects new vulnerabilities
   - **Action**: Immediate patch deployment planning

### Compliance Monitoring
- **Data Access Logs**: Track all data access and modifications
- **User Consent**: Monitor user consent and privacy settings
- **Data Retention**: Ensure compliance with data retention policies 