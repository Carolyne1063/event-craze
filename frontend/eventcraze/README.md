
#  Event Craze – Comprehensive Online  Event Management System for University.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Event Craze is a full-stack web platform built for universities to manage events, bookings, and analytics across different user roles like Admins, Event Managers, and Attendees. It supports event organization, ticket reservations, user authentication, and performance analytics.

---

##  Project Structure

```bash
event-craze/
├── backend/           # Node.js + Express + Prisma ORM
│   └── prisma/        # Prisma schema & migrations
├── frontend/          # Angular 18 + TailwindCSS
└── README.md
```

---

## 🛠 Tech Stack

| Layer         | Technology                    |
|---------------|-------------------------------|
| Frontend      | Angular 18, TailwindCSS       |
| Backend       | Node.js, Express.js           |
| ORM           | Prisma                        |
| Database      | Microsoft SQL Server          |
| Authentication| JWT-based Auth                |
| Styling       | TailwindCSS + University Theme|
| Testing       | Jasmine                       |

---

## 💾 Required Software

Install the following before setting up:

| Tool                             | Description                     |
|----------------------------------|---------------------------------|
| [Node.js](https://nodejs.org/)  | Backend runtime (v18+)          |
| [npm](https://www.npmjs.com/)   | Package manager                 |
| [Angular CLI](https://angular.io/cli) | Angular development CLI |
| [SQL Server](https://www.microsoft.com/sql-server/) | Database |
| [Prisma CLI](https://www.prisma.io/docs) | ORM CLI tool           |
| [Postman](https://www.postman.com/) | API Testing                |
| [Visual Studio Code](https://code.visualstudio.com/) | Recommended IDE |

---

## 📁 Environment Variables

Create a `.env` file in the `backend/` folder with:

```env
#  Database Configuration (Prisma ORM)
DATABASE_URL="sqlserver://<YOUR_SERVER_NAME>;database=eventcraze;user=sa;password=<YOUR_PASSWORD>;trustServerCertificate=true"

#  JWT Authentication Secret
JWT_SECRET=<YOUR_JWT_SECRET>

# 📧 SMTP Configuration for Sending Emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=<YOUR_EMAIL@gmail.com>
SMTP_PASS=<YOUR_APP_PASSWORD>
SMTP_FROM="EventCraze <no-reply@eventcraze.com>"

# 💰 M-PESA Integration (For Payment)
MPESA_PAYBILL=174379
MPESA_PASSKEY=<YOUR_MPESA_PASSKEY>
MPESA_CONSUMER_KEY=<YOUR_MPESA_CONSUMER_KEY>
MPESA_SECRET_KEY=<YOUR_MPESA_SECRET_KEY>

```

> Make sure your SQL Server is running and accepts TCP connections.

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Carolyne1063/event-craze.git
cd event-craze
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

- Run Prisma migration to generate tables from schema:
```bash
npx prisma migrate dev --name init
```

- Generate Prisma client:
```bash
npx prisma generate
```

- Start the backend server:
```bash
npm run build

npm start
```

---

### 3. Frontend Setup

```bash
cd ../frontend
cd ../eventcraze
npm install
ng serve -o
```

- The frontend will run at: `http://localhost:4200`

---

## 🌐 API Overview

Base URL: `http://localhost:3000/api/`

| Endpoint                  | Method | Description              |
|---------------------------|--------|--------------------------|
| `/auth/register`         | POST   | User registration        |
| `/auth/login`            | POST   | User login               |
| `/events`                | GET    | Get all events           |
| `bookings/:userId`       | GET    | Get bookings by user ID    |
| `/bookings/update/:bookingId`        | PUT    | Update a booking     |
| `/bookings//:bookingId` | DELETE   | Cancel a booking        |
| `/bookings/event/:eventId` | GET    | Get all bookings for a specific event        |


---

## 👤 User Roles & Access

- **Admin**: View all users, events, and analytics. Can manage everything.
- **Attendee**: Can browse events, book events, track bookings.

---

## 🧪 Testing

- **Frontend**: Run Jasmine tests with:
```bash
ng test
```

- **Backend**: Use Postman or REST Client to test endpoints. Unit tests can be set up using Jasmine or Jest.

---

## 🌟 Features

- Role-based login and dashboards
- Event creation and ticket booking
- Order tracking and cancellation
- Analytics for Admins 
- Fully styled with TailwindCSS (university theme)
- Responsive and accessible UI
- Prisma ORM for smooth DB management

---


## 👩🏽‍💻 Developed By

- **Carolyne Musenya** – Full-stack Developer  

---

## 📜 License

This project is for academic and educational use under the MIT License.
