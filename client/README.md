# VossAgro - Frontend (Client)

Welcome to the frontend of the VossAgro platform. This is a modern React application built to provide a seamless experience for farmers, buyers, and investors in Ghana's agricultural ecosystem.

## 🌟 Project Overview
VossAgro is an all-in-one agricultural ecosystem designed for Ghana. It connects farmers, buyers, and investors through:
- **Marketplace**: Buy and sell fresh produce.
- **Funding Hub**: Access grants and investment opportunities.
- **Land Access**: Lease or list farmland.
- **AI Insights**: Region-specific agricultural data and price predictions.

---

## 🚀 Technical Evolution: From CRA to Vite
This project has a rich technical history. It was originally bootstrapped with **Create React App (CRA)** by the initial development team. 

To improve developer experience, build speeds, and overall performance, the project was migrated to **Vite**. 
- **Why?**: Vite provides near-instant Hot Module Replacement (HMR) and significantly faster build times compared to CRA's Webpack-based setup.
- **Process**: We maintained the original project structure and git history to honor the initial work while modernizing the underlying build tooling.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **NPM** (comes with Node.js)

### Installation
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts
In the `client` directory, you can run:

- **`npm run dev`**: Runs the app in development mode with Vite. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.
- **`npm run build`**: Builds the app for production to the `dist` folder.
- **`npm run preview`**: Locally preview the production build.
- **`npm run lint`**: Run ESLint to check for code quality issues.

---

## 📁 Project Structure
- `src/components`: Reusable UI components (using Tailwind CSS and Lucide icons).
- `src/pages`: Main page views (Marketplace, Dashboard, etc.).
- `src/context`: React Context for state management (Auth, Cart).
- `public`: Static assets like logos and icons.
- `tailwind.config.js`: Custom styling configuration.

---

## 🛡️ Authentication
The client uses **JWT (JSON Web Tokens)** for security.
- Tokens are stored in `localStorage` as `user_token` or `admin_token`.
- The application dynamically adjusts the UI based on the `active_role`.

---

## 📈 Future Roadmap
- **Cloud Storage**: Moving to AWS S3/Cloudinary for image uploads.
- **Payments**: Integrating Paystack/Flutterwave for MoMo and Card payments.
- **Mobile App**: Potential transition to a PWA or React Native.

For a deeper dive into the business logic and admin management, please refer to the [Owner's Guide](../OWNERS_GUIDE.md) in the root directory.
