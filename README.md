⁹# RMS-Frontend


# 🚀 RMS 

## 🛠 Tech Stack

### Frontend

- ⚛️ **React** with **TypeScript** for type-safe components
- 🌿 **Context API** for global state management
- 🎨 **Tailwind CSS** for modern utility-based styling
- 📋 **React Hook Form** for form handling and validation
- 📦 **Vite** or CRA (depending on setup)
## Author

- [@Karan-Bharti1](https://github.com/Karan-Bharti1)





## 🚀 About Me
Hi there! 👋.
I am currently learning Full Stack Web Development with a focus on the MERN stack (MongoDB, Express.js, React, and Node.js). I'm passionate about building dynamic, user-friendly web applications and continuously improving my skills.

l






### Backend

- 🧠 **Node.js + Express** for RESTful APIs
- 🗄️ **MongoDB + Mongoose** for database
- 🔐 JWT-based login with roles (`Manager`, `Engineer`)

---

## 🔐 Roles & Login System

- **Manager**: Can assign engineers, manage projects, track team capacity
- **Engineer**: Can view current/upcoming assignments and manage profile

---

## ✨ Key Features

### 👨‍💼 Manager Pages

- **Team Overview**: 
  - View engineers with current load (e.g., _“John: 80% allocated”_)
- **Create Assignment**:
  - Assign engineers to projects with allocation percentage
- **Project Management**:
  - Create/edit projects, define required skills & status

### 👨‍💻 Engineer Pages

- **My Assignments**:
  - View current and upcoming project allocations
- **Profile Management**:
  - Update skills, seniority, and basic info

---

## 🧮 Key Calculations

### 1. 🧠 Available Capacity

```ts

```

- Full-time engineers: 100% capacity
- Part-time engineers: 50% capacity

---

### 2. 👷‍♂️ Engineer Management

- Name, skills (React, Node.js, etc.), seniority level
- Employment type: Full-time / Part-time
- Current status: Available % and allocation

---

### 3. 🗂️ Project Management

- Project name, description, start/end dates
- Required team size and skills
- Project status: `Planning`, `Active`, `Completed`

---

### 4. 📌 Assignment System

- Assign engineers with allocation %
- View current engineer-project assignments
- Capacity tracker for each engineer

---

### 5. 📊 Dashboard Views

- **Manager Dashboard**:
  - Team overview, highlight overloaded/underutilized engineers
- **Engineer Dashboard**:
  - Personal assignments view and upcoming availability
- **Availability Planning**:
  - When engineers will be free

---

### 6. 🔍 Search & Analytics

- Filter engineers by skills
- Filter projects by status
- Analytics: team utilization via simple charts

---

## 🧠 AI-Assisted Development

This project proudly utilized **AI tools** for rapid and intelligent development. Specifically:

- **ChatGPT by OpenAI** helped with:
  - Writing API logic
  - React component structure
  - Form validation logic
  - Tailwind styling
  - README.md generation and documentation

AI was used as a **productivity booster**, not a replacement for understanding. All implementation was done with clear technical knowledge and intent.

```
![AI Assisted](https://img.shields.io/badge/AI%20Assisted-Yes-blue)
```

---

## 📂 Project Structure (Frontend)

```
src/
├── assets/                      # Static assets (images, icons, logos, etc.)
├── components/                 # Shared reusable UI components
│   ├── headers/                # Grouped header components
│   │   ├── EngineerHeader.tsx
│   │   └── ManagerHeader.tsx
│   ├── dashboards/             # Dashboard views
│   │   ├── EngineerDashboard.tsx
│   │   └── ManagerDashboard.tsx
│   └── common/                 # (Optional) buttons, modals, inputs, etc.
├── contexts/                   # React Contexts for global state
│   ├── assignmentContext.tsx
│   ├── projectContext.tsx
│   └── userContext.tsx
├── pages/                      # Route-level views
│   ├── auth/                   # Login/Register
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── engineer/               # Engineer-specific pages
│   │   ├── EngineerAssignments.tsx
│   │   └── Profile.tsx
│   └── manager/                # Manager-specific pages
│       ├── Assignments.tsx
│       ├── Engineers.tsx
│       └── Projects.tsx
├── types/                      # TypeScript interfaces & types
├── services/                   # API calls and backend integrations
├── utils/                      # Utility functions (formatters, validators, etc.)
├── App.tsx                     # Root component
└── main.tsx                    # Entry point

```

---

## ⚙️ Setup Instructions

### Backend

1. Clone and install dependencies:
```bash
npm install
```

2. Create a `.env`:


3. Run backend:
```bash
npm i



## 🚀 About Me
Hi there! 👋.
I am currently learning Full Stack Web Development with a focus on the MERN stack (MongoDB, Express.js, React, and Node.js).
