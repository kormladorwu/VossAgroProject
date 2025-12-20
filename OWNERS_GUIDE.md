# VossAgro - Project Owner's Guide

Welcome to the VossAgro Project! This document serves as a comprehensive guide to understanding the platform's architecture, user roles, features, and technical management.

---

## 1. Platform Overview
VossAgro is an all-in-one agricultural ecosystem designed for Ghana. It connects farmers, buyers, and investors through a centralized marketplace, funding hub, and land access system, all enhanced by AI-driven insights.

---

## 2. User Groups & Personas

The platform supports four distinct user roles. Here is how each group interacts with the system:

### 🌱 The Farmer (e.g., "Kofi Mensah")
*   **Goal**: Sell his maize harvest and find funding for a new irrigation system.
*   **Actions**:
    *   Registers as a **Farmer**.
    *   Goes to **Marketplace** -> **List New Produce** to add his maize.
    *   Goes to **Funding Hub** to find a grant for irrigation and clicks **Apply**.
    *   Checks **AI Insights** for the Ashanti region to see if maize prices are expected to rise.
    *   Uses **Land Access** to list a small portion of his land for lease to other farmers.

### 🛒 The Buyer (e.g., "Ama Serwaa")
*   **Goal**: Buy fresh vegetables for her restaurant in Accra.
*   **Actions**:
    *   Registers as a **Buyer**.
    *   Uses the **Home Page Search** to filter for "Greater Accra" region.
    *   Browses the **Marketplace**, adds tomatoes and peppers to her **Cart**.
    *   Proceeds to **Checkout** to finalize her order.
    *   Uses **My Inquiries** to track her interest in farmland for a future home garden.

### 💰 The Investor (e.g., "Dr. Yaw Boateng")
*   **Goal**: Provide grants to promising young farmers.
*   **Actions**:
    *   Registers as an **Investor**.
    *   Goes to **Add Funding** to create a new "Young Farmer Grant" program.
    *   Accesses the **Investor Dashboard** to see a list of farmers who applied.
    *   Reviews applications and clicks **Approve** for the best candidates.

### 🛡️ The Admin (e.g., "VossAgro Support")
*   **Goal**: Monitor system health and manage users.
*   **Actions**:
    *   Logins via `/admin/login`.
    *   Monitors **System Stats** (Total users, revenue) on the dashboard.
    *   Goes to **Users** to verify a new farmer's identity or deactivate a suspicious account.
    *   Uses **Settings** to invite a new moderator to help manage the platform.

---

## 3. Admin Management

### How to Access the Admin Panel
1.  Navigate to `http://localhost:5173/admin/login`.
2.  Enter your admin email and password.
3.  Upon successful login, you will be redirected to the Admin Dashboard (`/admin`).

### How to Create the First Admin (via Script)
If you are setting up the project for the first time, you can create an admin account using the provided script:

1.  Open your terminal in the `server` directory.
2.  Run the following command:
    ```bash
    node scripts/createAdmin.js admin@vossagro.com MySecurePassword123 "VossAgro Admin"
    ```
3.  You can now log in at `/admin/login` with these credentials.

### How to Add More Admins (via Dashboard)
Once logged in as an admin, you can navigate to **Settings** -> **Invite Admin** to create additional accounts for your team.

---

## 4. Technical Setup & Deployment

### Prerequisites
*   **Node.js** (v16 or higher)
*   **PostgreSQL** (Installed and running)
*   **NPM** (Comes with Node.js)

### Environment Variables (`.env`)
Your `.env` file in the `server` directory should look like this:
```env
PORT=5000
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_DATABASE=vossagro_development
DB_DATABASE_TEST=vossagro_test
DB_DATABASE_PRODUCTION=vossagro_production
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_secret_key_here
```

> [!TIP]
> **JWT_SECRET**: This is a secret string used to sign security tokens. If it's missing from your `.env`, the system uses a default value (`secret_key_change_me`).
> 
> **How to get/add one**:
> *   **Option 1 (Easiest)**: Just type a long, random string of letters, numbers, and symbols directly into your `.env` file (e.g., `JWT_SECRET=my_very_long_random_string_123!`).
> *   **Option 2 (Professional)**: Run this command in your terminal to generate a secure random key:
>     ```bash
>     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
>     ```
>     Copy the output and paste it into your `.env` file.

### Installation & Running
1.  **Database Setup**:
    *   Create the databases in PostgreSQL: `vossagro_development`, `vossagro_test`, and `vossagro_production`.
    *   In the `server` folder, run: `npx sequelize-cli db:migrate`
2.  **Running the Backend**:
    *   `cd server`
    *   `npm install`
    *   `npm run dev` (Starts the server on port 5000)
3.  **Running the Frontend**:
    *   `cd client`
    *   `npm install`
    *   `npm run dev` (Starts the web app on port 5173)

---

## 5. Security & Authentication
The platform uses **JWT (JSON Web Tokens)** for secure communication. 
*   **User Tokens**: Stored as `user_token` in local storage.
*   **Admin Tokens**: Stored as `admin_token` in local storage.
*   The system automatically detects the active session and applies the correct permissions based on the `active_role` stored in the browser.

---

## 6. Support & Maintenance
*   **Logs**: Server logs are visible in the terminal where the backend is running.
*   **Database Management**: Use tools like **pgAdmin** or **DBeaver** to manage the PostgreSQL database directly.
