# RMS-Frontend


# 🚀 RMS - Resource Management System

**RMS** is a full-stack web application designed to streamline team and project management for tech organizations. It enables **Managers** to efficiently assign engineers to projects based on capacity, skills, and availability, while **Engineers** can view and manage their assignments.

---

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

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```


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
function getAvailableCapacity(engineerId) {
  const engineer = getEngineer(engineerId);
  const activeAssignments = getActiveAssignments(engineerId);
  const totalAllocated = activeAssignments.reduce((sum, a) => sum + a.allocationPercentage, 0);
  return engineer.maxCapacity - totalAllocated;
}
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
```env
MONGODB=your_mongo_uri
JWT_SECRET=your_secret_key
PORT=5000
```

3. Run backend:
```bash
npm start
```

### Frontend

1. Navigate to frontend directory:
```bash
cd client
npm install
```

2. Run React app:
```bash
npm run dev
```

---
