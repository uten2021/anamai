# LTC Management System 🏥

A luxurious, modern, and professional **Long Term Care (LTC) Management Web Application** built with Next.js 14, TypeScript, and Tailwind CSS. Features seamless Google Sheets and Google Drive integration for data storage and image management.

## ✨ Features

### 🎨 **Modern Luxury UI/UX**
- Clean, futuristic design with luxury aesthetic
- Responsive layout (desktop/tablet/mobile)
- Smooth animations and transitions
- Material Design 3 inspired components
- Thai and English language support

### 📊 **Comprehensive Management**
- **LTC Patient Profiles**: Complete patient information management
- **Care Giver (CG) Management**: Caregiver assignment and tracking
- **Care Manager (CM) Management**: Manager oversight and coordination
- **Schedule Management**: Visit scheduling and tracking
- **Visit Logs**: Detailed visit records with health metrics
- **User Management**: Role-based access control (Admin, CG, CM)

### 🔗 **Google Integration**
- **Google Sheets as Database**: All data stored in Google Sheets
- **Google Drive for Images**: Automatic image upload and URL generation
- **Real-time Sync**: Changes reflected immediately

### 🔐 **Security**
- OAuth 2.0 authentication
- Role-based access control
- Secure API endpoints
- Protected file uploads

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom luxury theme
- **UI Components**: Custom component library with shadcn/ui patterns
- **Icons**: Lucide React
- **Database**: Google Sheets API
- **File Storage**: Google Drive API
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18.17 or later
- npm or yarn package manager
- A Google Cloud Project
- Google Service Account credentials

## 🚀 Installation

### 1. Clone the Repository

```bash
cd ltc-management
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Google Cloud Project

#### Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API

#### Create Service Account
1. Go to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Name it (e.g., "ltc-management-service")
4. Grant it the **Editor** role
5. Click **Done**

#### Generate Service Account Key
1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Choose **JSON** format
5. Download the key file

### 4. Set Up Google Sheets

#### Create Your Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet named "LTC Management Database"
3. Copy the Spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit
   ```

#### Create the Following Sheets (tabs):

**1. LTC Sheet**
Headers: `LTC_ID | Prefix | FirstName | LastName | DOB | HouseNo | VillageNo | Phone | Diseases | ADLScore | Weight | Height | HomeCareGiver | CG_ID | PhotoURL`

**2. CG Sheet**
Headers: `CG_ID | Prefix | FirstName | LastName | DOB | HouseNo | VillageNo | Phone | CM_ID | PhotoURL`

**3. CM Sheet**
Headers: `CM_ID | Prefix | FirstName | LastName | Phone | PhotoURL`

**4. CG_Schedule Sheet**
Headers: `Visit_ID | LTC_ID | CG_ID | Date | Status | Note`

**5. Visit Sheet**
Headers: `Date | CG_ID | LTC_ID | HouseNo | VillageNo | Phone | Age | Weight | Height | BMI | BMIResult | Waistline | Temperature | BloodPressure | Pulse | Respiration | SymptomSummary | HomeCareGiver | ADLScore | StartTime | EndTime | Duration | CareActivities | ActivityPhotoURL`

**6. User Sheet**
Headers: `User_ID | Prefix | FirstName | LastName | Email | Username | Password | Role`

#### Share the Spreadsheet
1. Click **Share** button
2. Add the service account email (from the JSON key file)
3. Grant **Editor** access

### 5. Set Up Google Drive Folders

1. Create 4 folders in Google Drive:
   - `LTC Photos`
   - `CG Photos`
   - `CM Photos`
   - `Visit Photos`

2. Share each folder with the service account email with **Editor** access

3. Get each folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/YOUR_FOLDER_ID
   ```

### 6. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_actual_spreadsheet_id
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key\n-----END PRIVATE KEY-----\n"

# Google Drive Folder IDs
GOOGLE_DRIVE_LTC_FOLDER_ID=your_ltc_folder_id
GOOGLE_DRIVE_CG_FOLDER_ID=your_cg_folder_id
GOOGLE_DRIVE_CM_FOLDER_ID=your_cm_folder_id
GOOGLE_DRIVE_VISIT_FOLDER_ID=your_visit_folder_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run_this_command_openssl_rand_base64_32

# Application Configuration
NODE_ENV=development
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

### 7. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ltc-management/
├── app/                        # Next.js App Router pages
│   ├── dashboard/             # Dashboard page
│   ├── ltc/                   # LTC patient pages
│   ├── caregivers/            # Care Giver pages
│   ├── caremanagers/          # Care Manager pages
│   ├── schedule/              # Schedule management
│   ├── visits/                # Visit logs
│   ├── users/                 # User management
│   ├── api/                   # API routes
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (redirects to dashboard)
│   └── globals.css            # Global styles
├── components/                 # React components
│   ├── ui/                    # UI components (Button, Card, Input, etc.)
│   ├── forms/                 # Form components
│   └── layout/                # Layout components (Sidebar, Navbar)
├── lib/                       # Utility libraries
│   ├── google-sheets.ts       # Google Sheets API integration
│   ├── google-drive.ts        # Google Drive API integration
│   └── utils.ts               # Helper functions
├── types/                     # TypeScript type definitions
│   └── index.ts               # All type definitions
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── .env.local                 # Your local environment variables (create this)
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## 🎨 Design System

### Color Palette

**Primary Colors:**
- Primary Blue: `#0ea5e9` (Healthcare professional)
- Luxury Gold: `#D4AF37` (Premium accent)
- Navy: `#1e3a8a` (Trust and stability)

**Status Colors:**
- Success: `#22c55e`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#0ea5e9`

### Typography
- **Sans-serif**: Inter (body text)
- **Display**: Playfair Display (headings)

## 🔒 User Roles

### Admin
- Full access to all features
- User management
- System settings

### Care Manager (CM)
- Manage care givers
- View all LTC patients
- Schedule management
- Visit logs

### Care Giver (CG)
- View assigned LTC patients
- Record visits
- Update patient information
- View schedule

## 📊 Database Schema

All data is stored in Google Sheets with the following structure:

### LTC Table
Patient information including demographics, health metrics, and assigned caregivers.

### CareGiver (CG) Table
Caregiver profiles with contact information and assigned manager.

### CareManager (CM) Table
Care manager profiles overseeing multiple caregivers.

### CG_Schedule Table
Scheduled visits linking caregivers to patients.

### Visit Table
Detailed visit records including health measurements and care activities.

### User Table
Application users with authentication credentials and role assignments.

## 🖼 Image Upload Flow

1. User selects image file
2. Frontend validates file type and size
3. Image uploaded to designated Google Drive folder
4. Drive returns public URL
5. URL saved to corresponding Google Sheets cell
6. Image displayed in UI using the URL

## 🌐 API Routes

### LTC Endpoints
- `GET /api/ltc` - Get all LTC patients
- `GET /api/ltc/[id]` - Get specific patient
- `POST /api/ltc` - Create new patient
- `PUT /api/ltc/[id]` - Update patient
- `DELETE /api/ltc/[id]` - Delete patient

### Care Giver Endpoints
- `GET /api/caregivers` - Get all caregivers
- `POST /api/caregivers` - Create new caregiver
- `PUT /api/caregivers/[id]` - Update caregiver

### Visit Endpoints
- `GET /api/visits` - Get all visits
- `POST /api/visits` - Create visit record

### Upload Endpoints
- `POST /api/upload/ltc` - Upload LTC photo
- `POST /api/upload/caregiver` - Upload CG photo
- `POST /api/upload/visit` - Upload visit photo

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to:
- Netlify
- Firebase Hosting
- AWS Amplify
- Self-hosted with Node.js

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful component names

### Component Guidelines
- Keep components small and focused
- Use TypeScript interfaces for props
- Implement error boundaries
- Use React hooks appropriately

### State Management
- Use React hooks for local state
- Consider Context API for shared state
- Keep state close to where it's used

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic CRUD operations
- ✅ Dashboard with analytics
- ✅ LTC patient management
- ⏳ Care Giver management
- ⏳ Visit logging

### Phase 2
- [ ] Advanced filtering and search
- [ ] Reports and analytics
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] PDF export

### Phase 3
- [ ] AI-powered insights
- [ ] Telemedicine integration
- [ ] Medication management
- [ ] Family portal

## 📞 Contact

**Project Lead**: Your Name
**Email**: your.email@example.com
**Organization**: Luxury Healthcare

---

**Built with ❤️ for better healthcare management**
