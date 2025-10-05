# Cloudinary Migration Guide

## Overview
This project has been migrated from local file storage using Multer to cloud-based storage using Cloudinary. File uploads are now restricted to images only (JPG, JPEG, PNG, GIF, WEBP).

## Changes Made

### Backend Changes
1. **Replaced Multer disk storage with memory storage** - Files are now processed in memory before uploading to Cloudinary
2. **Added Cloudinary configuration** - `/server/config/cloudinary.js`
3. **Updated all form routes** to use Cloudinary upload
4. **Modified database models** to include `documentUrl` field for Cloudinary URLs
5. **Updated file restrictions** to allow only image files

### Frontend Changes
1. **Updated accept attributes** in all file inputs to only accept image formats
2. **Changed labels** from "Upload Documents" to "Upload Images"
3. **File validation** now restricts uploads to images only

### Files Modified

#### Backend
- `/server/config/cloudinary.js` (NEW)
- `/server/middleware/upload.js` (NEW)
- `/server/routes/Forms/businessForms.js`
- `/server/routes/Forms/gstForms.js`
- `/server/routes/Forms/itrForms.js`
- `/server/routes/Forms/taxForms.js`
- `/server/routes/Forms/trademarkForms.js`
- `/server/routes/testimonials.js`
- `/server/models/BusinessAdvisory.js`
- `/server/models/GST.js`
- `/server/models/ITR.js`
- `/server/models/TaxPlanning.js`
- `/server/models/Trademark.js`
- `/server/utils/testimonialUpload.js` (REMOVED)

#### Frontend
- All form components in `/client/src/pages/services/` subdirectories

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install cloudinary
npm uninstall multer  # Optional: Remove if not used elsewhere
```

### 2. Configure Environment Variables
Add these variables to your `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Get Cloudinary Credentials
1. Sign up at https://cloudinary.com/
2. Get your credentials from the Dashboard
3. Add them to your `.env` file

### 4. Clean Up Old Uploads (Optional)
You can remove the old upload directories:
```bash
rm -rf server/uploads/
```

## Benefits

### Dynamic Document Management
- **Automatic optimization** - Images are automatically optimized for web delivery
- **CDN delivery** - Fast global content delivery
- **Transformations** - On-the-fly image transformations (resize, crop, format conversion)
- **Cloud storage** - No server disk space concerns
- **Backup & redundancy** - Cloudinary handles backups automatically

### Security & Performance
- **File type validation** - Only image files are accepted
- **Size limits** - 5MB maximum file size
- **Secure URLs** - All images served over HTTPS
- **Access control** - Cloudinary provides additional security options

## Image Upload Restrictions

### Allowed Formats
- JPG/JPEG
- PNG
- GIF
- WEBP

### File Size Limit
- Maximum: 5MB per file

### Folder Structure in Cloudinary
Files are organized in folders based on service type:
- `tax-marks-advisors/business/startup/`
- `tax-marks-advisors/business/incorporation/`
- `tax-marks-advisors/business/advisory/`
- `tax-marks-advisors/gst/registration/`
- `tax-marks-advisors/gst/return-filing/`
- `tax-marks-advisors/gst/resolution/`
- `tax-marks-advisors/itr/filing/`
- `tax-marks-advisors/itr/refund-notice/`
- `tax-marks-advisors/itr/document-prep/`
- `tax-marks-advisors/tax/personal-corporate/`
- `tax-marks-advisors/tax/year-round/`
- `tax-marks-advisors/tax/compliance/`
- `tax-marks-advisors/trademark/search/`
- `tax-marks-advisors/trademark/documentation/`
- `tax-marks-advisors/trademark/protection/`
- `tax-marks-advisors/testimonials/`

## API Response Changes

### Before (Multer)
```json
{
  "documentPath": "1234567890-filename.pdf"
}
```

### After (Cloudinary)
```json
{
  "documentPath": "tax-marks-advisors/business/startup/abc123def456",
  "documentUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/tax-marks-advisors/business/startup/abc123def456.jpg"
}
```

## Migration Notes

1. **Existing documents** in the old upload folders are not migrated automatically
2. **Database records** with old file paths will need manual migration if required
3. **PDF support removed** - Only image files are now supported
4. **File serving** - Images are now served directly from Cloudinary CDN

## Troubleshooting

### Common Issues
1. **Environment variables not set** - Ensure Cloudinary credentials are in `.env`
2. **File type rejected** - Only image files are allowed
3. **Upload fails** - Check network connectivity and Cloudinary quotas
4. **Large files rejected** - Maximum size is 5MB

### Testing
1. Test image uploads through each form
2. Verify images are accessible via Cloudinary URLs
3. Check Cloudinary dashboard for uploaded files
4. Test file type restrictions with non-image files

## Future Enhancements

### Possible Improvements
1. **Image transformations** - Automatic resizing for thumbnails
2. **Progressive loading** - Lazy loading for better performance
3. **Format optimization** - Automatic format selection based on browser support
4. **Advanced security** - Signed URLs for sensitive documents

This migration provides a robust, scalable solution for image management while improving performance and reducing server maintenance overhead.