# 🚌 Smart Bus Portal

A modern, full-stack web application for smart bus transportation management, built with Next.js and NestJS. This platform provides seamless experiences for passengers and drivers with real-time features and intuitive interfaces.

## 🌟 Features

### Core Features
- **Smart Bus Booking System**: Easy ticket booking and reservation management
- **Real-time Notifications**: Live updates using PusherJS for driver status changes
- **Driver Management**: Comprehensive driver dashboard with login/signup functionality
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation for better code quality

### User Roles
- **Passengers**: Book tickets, track buses, manage reservations
- **Drivers**: Access dashboard, manage routes, real-time updates
- **Admin**: System management and oversight

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.5.2](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Real-time**: PusherJS

### Backend Integration
- **API**: NestJS backend (separate repository)
- **File Upload**: Multer support
- **Real-time Communication**: Pusher integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart_bus_portal
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and configure the following variables:
```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

### 4. Configure Real-time Features
Follow the setup instructions in [PUSHER_SETUP.md](./PUSHER_SETUP.md) to configure PusherJS for real-time notifications.

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
smart_bus_portal/
├── app/                      # Next.js App Router
│   ├── components/           # Reusable components
│   │   ├── header.tsx
│   │   ├── navbar.tsx
│   │   └── titlebar.tsx
│   ├── driver/              # Driver-specific pages
│   │   ├── dashboard/       # Driver dashboard
│   │   ├── login/           # Driver authentication
│   │   └── signup/
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── services/            # Services page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.ts           # Next.js configuration
└── README.md                # This file
```

## 🎯 Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production with Turbopack
- `npm run start` - Start the production server

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with PostCSS configuration. Customize styles in `globals.css` and component files.

### TypeScript
Full TypeScript support with strict type checking enabled. Configuration in `tsconfig.json`.

### Next.js
Uses the App Router with Turbopack for faster development builds.

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to a Git repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy automatically

### Other Platforms
The application can be deployed on any platform that supports Node.js applications:
- Netlify
- Railway
- Heroku
- AWS
- DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:
1. Check the [documentation](./docs/)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information
4. Contact the development team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Pusher](https://pusher.com/) for real-time functionality
- [Vercel](https://vercel.com/) for hosting and deployment

---

**Happy Coding! 🚀**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
