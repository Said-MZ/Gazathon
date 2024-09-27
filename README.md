# GazaDon

GazaDon is a platform designed to help hospitals in Gaza by facilitating donations of medical supplies and equipment. It provides an easy way for people to contribute to the cause and make a difference.

## Project Overview

GazaDon aims to address the urgent need for medical supplies in Gaza hospitals. The platform connects hospitals and medical centers in Gaza with each other, they can request the needed medical supplies and equipment and hospitals in Gaza can donate the needed medical supplies and equipment. they can access data about supplies and equipment that are needed and the amount of supplies and equipment at each others inventory.

## Features

- Fully functional authentication system (Login, Register, Forgot Password, 2FA, change password, change email, roles)
- Responsive design for various screen sizes
- Dark mode support
- Donation options for money and medical supplies
- Interactive UI components (e.g., animated counters, FAQ accordion)
- Form validation for donation inputs
- Toast notifications for successful donations

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Auth.JS
- Framer Motion (for animations)
- React Hook Form (for form handling)
- Zod (for schema validation)
- Sonner (for toast notifications)
- Lucide React (for icons)

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/your-username/gazathon.git
   ```

2. Navigate to the project directory:

   ```
   cd gazathon
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Run the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

6. notes

- user roles are Admin, which will have full access to everyhing, and User, which will be the hospital or medical, there is a table called userPermissions that will have the permissions for each user, and a table called, the functionality for userPermissions is not implemented yet, but the infastructure is ready for it.
- you need to have add some env variables to the .env file, and the variables are in the .env.example file.

DATABASE_URL=''
this is the database url, you can get it from the neon.tech dashboard

AUTH_SECRET=''
this is the secret for the auth.js, you can generate it with
openssl rand -base64 32

RESEND_API_KEY=''
this is the api key for the resend, you can get it from the resend. resend is the email service that is used to send the emails for the forgot password and the email change functionality.

WEBSITE_URL=''
this is the base url of the website, it is used to send the emails for the forgot password and the email change functionality.

## Project Structure
