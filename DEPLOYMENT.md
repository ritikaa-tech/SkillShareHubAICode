# Deployment Checklist

## Pre-deployment Checks

1. **Environment Variables**
   - [ ] Set up all required environment variables in production
   - [ ] Verify sensitive data is not hardcoded
   - [ ] Check all API keys and secrets are properly configured

2. **Database**
   - [ ] Ensure MongoDB connection string is properly configured
   - [ ] Verify database indexes are created
   - [ ] Check database backup strategy

3. **Security**
   - [ ] Enable CORS with proper origin
   - [ ] Set up rate limiting
   - [ ] Verify JWT secret is properly set
   - [ ] Check all API endpoints are properly secured

4. **Code Quality**
   - [ ] Run linting checks
   - [ ] Verify all case-sensitive file paths
   - [ ] Check for any hardcoded URLs
   - [ ] Ensure all API calls use the centralized API service

5. **Performance**
   - [ ] Enable compression
   - [ ] Set up proper caching headers
   - [ ] Verify static file serving
   - [ ] Check for any memory leaks

## Deployment Steps

1. **Server Setup**
   ```bash
   # Install dependencies
   npm install --production

   # Set environment variables
   export NODE_ENV=production
   export MONGODB_URI=your_mongodb_uri
   export JWT_SECRET=your_jwt_secret
   export RAZORPAY_KEY_ID=your_razorpay_key_id
   export RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   export CORS_ORIGIN=your_frontend_url

   # Start the server
   npm start
   ```

2. **Client Setup**
   ```bash
   # Install dependencies
   npm install --production

   # Build the application
   npm run build

   # Serve the built files
   serve -s build
   ```

## Post-deployment Verification

1. **API Endpoints**
   - [ ] Test all API endpoints
   - [ ] Verify authentication flow
   - [ ] Check file uploads
   - [ ] Test payment integration

2. **Frontend**
   - [ ] Verify all routes work
   - [ ] Check responsive design
   - [ ] Test form submissions
   - [ ] Verify error handling

3. **Monitoring**
   - [ ] Set up error logging
   - [ ] Configure performance monitoring
   - [ ] Set up uptime monitoring
   - [ ] Configure alerts

## Common Issues and Solutions

1. **CORS Issues**
   - Verify CORS_ORIGIN is set correctly
   - Check if API requests include proper headers

2. **Authentication Issues**
   - Verify JWT_SECRET is set correctly
   - Check token expiration settings
   - Verify token storage in localStorage

3. **File Upload Issues**
   - Check file size limits
   - Verify storage permissions
   - Check file type restrictions

4. **Performance Issues**
   - Enable compression
   - Set up proper caching
   - Optimize database queries
   - Use proper indexes

## Maintenance

1. **Regular Tasks**
   - Monitor error logs
   - Check database performance
   - Verify backup integrity
   - Update dependencies

2. **Security Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Regular security audits
   - Update SSL certificates

## Emergency Procedures

1. **Server Issues**
   - Check server logs
   - Verify resource usage
   - Check database connection
   - Verify environment variables

2. **Application Issues**
   - Check application logs
   - Verify API endpoints
   - Check frontend console
   - Verify database queries

3. **Data Issues**
   - Check database backups
   - Verify data integrity
   - Check for data corruption
   - Verify data consistency 