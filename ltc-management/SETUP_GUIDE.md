# LTC Management System - Setup Guide 🚀

This guide will walk you through setting up the LTC Management System from scratch.

## Table of Contents
1. [Google Cloud Setup](#google-cloud-setup)
2. [Google Sheets Setup](#google-sheets-setup)
3. [Google Drive Setup](#google-drive-setup)
4. [Local Development Setup](#local-development-setup)
5. [Testing the Integration](#testing-the-integration)
6. [Troubleshooting](#troubleshooting)

---

## Google Cloud Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter project details:
   - **Project name**: `LTC Management`
   - **Organization**: (Your organization or leave as is)
5. Click **"Create"**

### Step 2: Enable Required APIs

1. In the Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for and enable the following APIs:
   - **Google Sheets API**
     - Click on the API
     - Click **"Enable"**
   - **Google Drive API**
     - Click on the API
     - Click **"Enable"**

### Step 3: Create a Service Account

1. Go to **"IAM & Admin"** > **"Service Accounts"**
2. Click **"Create Service Account"**
3. Fill in the details:
   - **Service account name**: `ltc-management-service`
   - **Service account description**: `Service account for LTC Management application`
4. Click **"Create and Continue"**
5. Grant the service account the **"Editor"** role
6. Click **"Continue"** then **"Done"**

### Step 4: Create and Download Service Account Key

1. Find your newly created service account in the list
2. Click on it to open details
3. Go to the **"Keys"** tab
4. Click **"Add Key"** > **"Create new key"**
5. Choose **JSON** format
6. Click **"Create"**
7. The key will download automatically - **Keep this file secure!**

### Step 5: Extract Credentials from JSON Key

Open the downloaded JSON file. You'll need:
- `client_email` - Your service account email
- `private_key` - Your private key (starts with `-----BEGIN PRIVATE KEY-----`)

---

## Google Sheets Setup

### Step 1: Create the Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **"Blank"** to create a new spreadsheet
3. Name it: **"LTC Management Database"**
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[COPY_THIS_PART]/edit
   ```

### Step 2: Create Sheet Tabs

Create 6 tabs (sheets) in your spreadsheet with exact names:

#### Tab 1: LTC
Add these headers in Row 1:
```
LTC_ID | Prefix | FirstName | LastName | DOB | HouseNo | VillageNo | Phone | Diseases | ADLScore | Weight | Height | HomeCareGiver | CG_ID | PhotoURL
```

**Sample data (Row 2):**
```
LTC0001 | นาย | สมชาย | ใจดี | 1950-05-15 | 123 | 5 | 0812345678 | เบาหวาน | 12 | 65 | 165 | นางสมหญิง ใจดี | CG0001 |
```

#### Tab 2: CG
Add these headers in Row 1:
```
CG_ID | Prefix | FirstName | LastName | DOB | HouseNo | VillageNo | Phone | CM_ID | PhotoURL
```

**Sample data (Row 2):**
```
CG0001 | นางสาว | มานี | ดีงาม | 1985-03-10 | 45 | 3 | 0823456789 | CM0001 |
```

#### Tab 3: CM
Add these headers in Row 1:
```
CM_ID | Prefix | FirstName | LastName | Phone | PhotoURL
```

**Sample data (Row 2):**
```
CM0001 | นาง | สุดา | ใจงาม | 0834567890 |
```

#### Tab 4: CG_Schedule
Add these headers in Row 1:
```
Visit_ID | LTC_ID | CG_ID | Date | Status | Note
```

**Sample data (Row 2):**
```
V00001 | LTC0001 | CG0001 | 2025-12-03 | Scheduled | Regular checkup
```

#### Tab 5: Visit
Add these headers in Row 1:
```
Date | CG_ID | LTC_ID | HouseNo | VillageNo | Phone | Age | Weight | Height | BMI | BMIResult | Waistline | Temperature | BloodPressure | Pulse | Respiration | SymptomSummary | HomeCareGiver | ADLScore | StartTime | EndTime | Duration | CareActivities | ActivityPhotoURL
```

**Sample data (Row 2):**
```
2025-12-03 | CG0001 | LTC0001 | 123 | 5 | 0812345678 | 75 | 65 | 165 | 23.88 | Normal | 85 | 36.5 | 120/80 | 72 | 18 | Stable condition | นางสมหญิง ใจดี | 12 | 09:00 | 09:45 | 45 | Health check, medication reminder |
```

#### Tab 6: User
Add these headers in Row 1:
```
User_ID | Prefix | FirstName | LastName | Email | Username | Password | Role
```

**Sample data (Row 2):**
```
U0001 | Mr. | Admin | User | admin@example.com | admin | hashed_password | Admin
```

### Step 3: Share with Service Account

1. Click the **"Share"** button in the top right
2. Paste your service account email (from the JSON key file)
   - Example: `ltc-management-service@project-id.iam.gserviceaccount.com`
3. Change permission to **"Editor"**
4. **Uncheck** "Notify people" (it's a service account)
5. Click **"Share"**

---

## Google Drive Setup

### Step 1: Create Folders

Create 4 folders in Google Drive:

1. **LTC Photos** - For LTC patient photos
2. **CG Photos** - For Care Giver photos
3. **CM Photos** - For Care Manager photos
4. **Visit Photos** - For activity photos during visits

### Step 2: Get Folder IDs

For each folder:
1. Open the folder
2. Copy the Folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/[COPY_THIS_PART]
   ```
3. Save these IDs - you'll need them for environment variables

### Step 3: Share Folders with Service Account

For each of the 4 folders:
1. Right-click the folder > **"Share"**
2. Paste your service account email
3. Change permission to **"Editor"**
4. **Uncheck** "Notify people"
5. Click **"Share"**

---

## Local Development Setup

### Step 1: Install Dependencies

```bash
cd ltc-management
npm install
```

### Step 2: Create Environment File

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

### Step 3: Configure Environment Variables

Edit `.env.local` with your values:

```env
# From Google Sheets URL
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# From service account JSON key file
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# From service account JSON key file (keep the quotes and \n characters)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"

# From Google Drive folder URLs
GOOGLE_DRIVE_LTC_FOLDER_ID=ltc_folder_id
GOOGLE_DRIVE_CG_FOLDER_ID=cg_folder_id
GOOGLE_DRIVE_CM_FOLDER_ID=cm_folder_id
GOOGLE_DRIVE_VISIT_FOLDER_ID=visit_folder_id

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret

# For local development
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

### Step 4: Generate NextAuth Secret

Run this command to generate a secret:
```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in `.env.local`

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Testing the Integration

### Test 1: View Dashboard

1. Navigate to [http://localhost:3000](http://localhost:3000)
2. You should see the dashboard with stats
3. Check browser console for any errors

### Test 2: Test Google Sheets Connection

1. Go to [http://localhost:3000/api/ltc](http://localhost:3000/api/ltc)
2. You should see JSON response with your LTC data from Google Sheets

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "LTC_ID": "LTC0001",
      "FirstName": "สมชาย",
      ...
    }
  ],
  "message": "Retrieved X LTC patients"
}
```

### Test 3: View LTC List

1. Navigate to [http://localhost:3000/ltc](http://localhost:3000/ltc)
2. You should see the table with your LTC patients
3. Click on "View" to see patient details

### Test 4: Test Image Upload

1. Create a test image upload form or use Postman
2. POST to `/api/upload` with:
   - `file`: Your image file
   - `type`: 'ltc'
3. Check Google Drive folder for the uploaded file

---

## Troubleshooting

### Error: "Permission denied" when accessing Sheets

**Solution:**
1. Verify service account email is correct in `.env.local`
2. Check that the spreadsheet is shared with the service account
3. Ensure the service account has "Editor" permission

### Error: "Invalid credentials"

**Solution:**
1. Check `GOOGLE_PRIVATE_KEY` format in `.env.local`
2. Ensure the key includes quotes and `\n` characters
3. Verify the key hasn't been modified or corrupted

### Error: "Spreadsheet not found"

**Solution:**
1. Verify `GOOGLE_SPREADSHEET_ID` is correct
2. Check that you copied the ID from the URL correctly
3. Ensure the spreadsheet is shared with the service account

### Error: "Cannot find module 'googleapis'"

**Solution:**
```bash
npm install googleapis
```

### Images not uploading

**Solution:**
1. Check that all 4 Drive folders are shared with service account
2. Verify folder IDs are correct in `.env.local`
3. Check browser console for detailed error messages

### Data not displaying from Sheets

**Solution:**
1. Verify sheet tab names match exactly:
   - `LTC`, `CG`, `CM`, `CG_Schedule`, `Visit`, `User`
2. Check that headers in Row 1 match the expected format
3. Ensure data starts from Row 2

### Port 3000 already in use

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev
```

Or kill the process using port 3000:
```bash
# On Mac/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Next Steps

After successful setup:

1. ✅ Add more sample data to your Google Sheets
2. ✅ Explore all features in the dashboard
3. ✅ Test creating new LTC patients
4. ✅ Try uploading images
5. ✅ Customize the theme in `tailwind.config.ts`
6. ✅ Add authentication (implement NextAuth.js)
7. ✅ Deploy to production (Vercel/Netlify)

---

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the code comments in `/lib/google-sheets.ts` and `/lib/google-drive.ts`
- Ensure all environment variables are set correctly
- Check browser console and terminal for error messages

**Happy coding! 🎉**
