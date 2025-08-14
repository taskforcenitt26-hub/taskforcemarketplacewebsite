# 🚲 Cycle Marketplace

A modern, full-featured e-commerce platform for bicycles built with React and Supabase. Experience seamless bicycle shopping with real-time inventory management, customer hold system, and comprehensive admin dashboard.

## ✨ Features

### 🛍️ Customer Experience
- **Browse & Discover**: Explore premium bicycle collection with high-quality images
- **Smart Filtering**: Advanced filters by type, brand, price range, and specifications
- **15-Minute Hold System**: Reserve bicycles while making purchase decisions
- **Contact Support**: Direct communication channel for inquiries and support
- **Mobile-First Design**: Optimized experience across all devices
- **Real-time Updates**: Live inventory and availability updates

### ⚙️ Admin Management
- **Inventory Control**: Complete CRUD operations for bicycle management
- **Hold Monitoring**: Real-time tracking with automatic expiration
- **Customer Communications**: Manage and respond to customer inquiries
- **Secure Authentication**: Protected admin routes with Supabase Auth
- **Analytics Dashboard**: Overview of sales, inventory, and customer interactions
- **Responsive Admin Panel**: Full functionality on desktop and mobile

### 🚀 Technical Excellence
- **Real-time Synchronization**: Live data updates using Supabase subscriptions
- **Professional UI/UX**: Clean, modern interface with Tailwind CSS
- **Optimized Performance**: Fast loading with skeleton states and efficient data fetching
- **Robust Database**: PostgreSQL with proper indexing and RLS policies
- **Scalable Architecture**: Modular component structure for easy maintenance

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router 6, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom components

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn** package manager
- **Supabase** account (free tier available)

### Installation

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd cycle-marketplace
   npm install
   ```

2. **Supabase Configuration**
   - Create project at [supabase.com](https://supabase.com)
   - Navigate to Settings → API
   - Copy your Project URL and anon public key

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials to `.env.local`:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Open Supabase SQL Editor
   - Run the complete `database.sql` script
   - Verify all tables and policies are created

5. **Launch Application**
   ```bash
   npm start
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🗄️ Database Schema

The `database.sql` file includes complete setup for:

### 📋 Tables Structure

| Table | Purpose | Key Features |
|-------|---------|-------------|
| `cycles` | Bicycle inventory | JSONB specs, array features, stock tracking |
| `cycle_holds` | 15-minute reservations | Auto-expiration, customer details |
| `cycle_reviews` | Customer feedback | Rating system, linked to cycles |
| `contacts` | Customer inquiries | Status tracking, admin management |

### 🔒 Security Features
- **Row Level Security (RLS)** enabled on all tables
- **Public access** for browsing and creating holds
- **Authenticated access** for admin operations
- **Automatic policy setup** included in database.sql

### 📊 Performance Optimizations
- Strategic indexes on frequently queried columns
- Efficient foreign key relationships
- Automatic hold expiration function

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── Layout/
│   │   ├── Header.js       # Navigation with auth state
│   │   └── Footer.js       # Site footer
│   ├── CycleCard.js        # Product display component
│   ├── HoldModal.js        # Hold creation form
│   ├── SellerCodeModal.js  # Purchase verification
│   ├── ProtectedRoute.js   # Admin route protection
│   └── SimpleLoaders.js    # Loading state components
├── contexts/
│   └── AuthContext.js      # Authentication state management
├── hooks/                  # Custom React hooks
│   ├── useCycles.js        # Cycle data operations
│   ├── useHolds.js         # Hold system management
│   ├── useContacts.js      # Contact form handling
│   └── usePageTitle.js     # Dynamic page titles
├── pages/
│   ├── admin/              # Admin dashboard
│   │   ├── AdminDashboard.js
│   │   ├── CycleManagement.js
│   │   ├── HoldManagement.js
│   │   ├── ContactManagement.js
│   │   ├── AddCycleModal.js
│   │   └── EditCycleModal.js
│   ├── Home.js             # Homepage with featured cycles
│   ├── Cycles.js           # Browse all inventory
│   ├── Contact.js          # Customer support form
│   ├── Login.js            # Authentication
│   ├── Register.js         # Account creation
│   ├── Payment.js          # Purchase processing
│   └── PaymentSuccess.js   # Order confirmation
└── lib/
    └── supabase.js         # Database client configuration
```

## 🔐 Admin Access Setup

### Method 1: Self-Registration
1. Navigate to `/register`
2. Create your admin account
3. Login at `/login`
4. Access admin panel at `/admin`

### Method 2: Database Direct Access
1. Create account through registration
2. In Supabase Dashboard → Authentication → Users
3. Note your User ID
4. Grant admin privileges as needed

## 🎯 Key Features Deep Dive

### 🕒 15-Minute Hold System
- **Smart Reservations**: Customers can hold any available cycle
- **Automatic Expiration**: Holds release after exactly 15 minutes
- **Real-time Tracking**: Admin dashboard shows live countdown timers
- **Conflict Prevention**: Multiple holds on same cycle automatically managed
- **Customer Details**: Contact information collected for hold confirmation

### 📱 Real-time Updates
- **Live Inventory**: Stock levels update across all sessions
- **Hold Status**: Real-time hold creation and expiration
- **Admin Notifications**: Instant updates on customer actions
- **Conflict Resolution**: Automatic handling of simultaneous actions

### 🎨 Professional UI/UX
- **Clean Design**: Modern, minimalist interface
- **Responsive Layout**: Seamless experience on all devices
- **Loading States**: Professional spinners and skeleton screens
- **Error Handling**: User-friendly error messages and recovery
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Deployment Guide

### Vercel Deployment (Recommended)
1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vercel Setup**
   - Connect GitHub repository to Vercel
   - Configure environment variables:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
   - Deploy automatically

### Netlify Deployment
1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Upload `build` folder to Netlify
   - Configure environment variables in Netlify dashboard
   - Setup custom domain if needed

### Environment Variables for Production
```env
REACT_APP_SUPABASE_URL=your_production_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_production_anon_key
```

## 🧪 Testing & Development

### Available Scripts
```bash
npm start          # Development server (localhost:3000)
npm run build      # Production build
npm run eject      # Eject from Create React App (irreversible)
```

### Development Tips
- Use browser DevTools for debugging
- Check Supabase logs for database issues
- Monitor network tab for API calls
- Use React Developer Tools extension

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Database Connection Problems
```
Error: Invalid API URL or Key
```
**Solution:**
- Verify `.env.local` file exists with correct credentials
- Check Supabase project is active
- Ensure no extra spaces in environment variables

#### RLS Policy Errors
```
Error: new row violates row-level security policy
```
**Solution:**
- Confirm `database.sql` script ran completely
- Check policies exist in Supabase Dashboard → Authentication → Policies
- Verify user authentication status

#### Hold System Issues
```
Error: Failed to create hold
```
**Solution:**
- Check cycle availability in real-time
- Verify no existing active holds on the cycle
- Confirm database connection is stable

#### Build/Deployment Errors
```
Error: Environment variables not found
```
**Solution:**
- Ensure environment variables are set in deployment platform
- Use `REACT_APP_` prefix for all custom variables
- Check for typos in variable names

### Performance Optimization
- **Database**: Ensure proper indexing (included in database.sql)
- **Frontend**: Use React.memo for expensive components
- **Images**: Optimize bicycle images for web
- **Network**: Implement proper error boundaries

## 📞 Support & Contributing

### Getting Help
- **Issues**: Create GitHub issue with detailed description
- **Questions**: Use discussion section for general questions
- **Bugs**: Include browser console errors and steps to reproduce

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request with detailed description

### Code Style
- Follow existing code patterns
- Use meaningful variable names
- Add comments for complex logic
- Ensure responsive design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for excellent backend-as-a-service platform
- **React Team** for the robust frontend framework
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icon set
- **Unsplash** for high-quality bicycle images

---

**Built with ❤️ for the cycling community**