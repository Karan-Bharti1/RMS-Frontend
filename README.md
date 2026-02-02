⁸# RMS-Frontend


# 🚀 RMS 

## 🛠 Tech Stack

### Frontend

- ⚛️ **React** with **TypeScript** for type-safe components
- 🌿 **Context API** for global state management
- 🎨 **Tailwind CSS** for modern utility-based 
- 📦 **Vite** or CRA (depending on setup)
## Author

- [@Karan-Bharti1](https://github.com/Karan-Bharti1)





## 🚀 About Me
Hi there! 👋.
I am currently learning Full Stack Web Development with a focus on the MERN stack (MongoDB, Express.js, React, and 
## 🔐 Roles & Login 

## ✨ Key Features

### 👨‍💼 Manager Pages

- **Team Overview**: 
  - View engineers with current load (e.g., _“John: 80% allocated”_)
- **Create Assignment**:
  - Assign engineers to projects with allocation percentage


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


### 3. 🗂️ Project Management

- Project name, description, start/end dates
- Required team size and skills
- Project status: `Planning`, `Active`, `Completed`

---

### 4. 📌 Assignment System

- Assign engineers with allocation %
- View current engineer-project assignments
  
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
- Filter projects by 
---

## 🧠 AI-Assisted Development

This project proudly utilized **AI tools** for rapid and intelligent development. 


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



## 🚀 About Me
Hi there! 👋.
I am currently learning Full Stack Web Development with a focus on the MERN stack (MongoDB, Express.js, React, and Node.js).
