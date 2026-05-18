# Functional Requirements Document (FRD)
**Project Name:** ERFlow
**Document Version:** 1.0
**Target Audience:** Developers, Technical Architects, QA Engineers

---

## 1. Introduction & Architecture
This document details the functional specifications for the ERFlow application. 

### 1.1 Tech Stack
- **Frontend / Framework:** Next.js (App Router), React, Tailwind CSS
- **Backend / API:** Next.js Route Handlers
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) via `httpOnly` cookies

### 1.2 Architectural Highlights
- **Proxy Middleware (`proxy.js`):** Enforces strict server-side Role-Based Access Control (RBAC). Intercepts all page requests to validate JWTs and reroute unauthorized access before rendering.
- **Atomic Database Operations:** Unified creation flows (e.g., creating a User and Doctor profile simultaneously) to ensure database integrity.

## 2. Role-Based Access Control (RBAC) Matrix

| Feature / Route | Administrator | Receptionist | Doctor |
| :--- | :---: | :---: | :---: |
| **Login / Logout** | ✅ | ✅ | ✅ |
| **Change Password** | ✅ | ✅ | ✅ |
| **`/dashboard` (Global Stats)** | ✅ | ✅ | ❌ (Redirected) |
| **`/doctor-dashboard` (Personal)**| ❌ | ❌ | ✅ |
| **`/patients` (Registry)** | ✅ (All) | ✅ (All) | ✅ (Only Assigned) |
| **`/equipment` (Inventory)** | ✅ | ✅ | ❌ |
| **`/doctors` (Registry)** | ✅ | ❌ | ❌ |
| **`/staff` (User Mgmt)** | ✅ | ❌ | ❌ |
| **`/departments`** | ✅ | ❌ | ❌ |

## 3. Core Functional Modules

### 3.1 Authentication & Security
- **FR-AUTH-01:** Login API must issue a JWT stored in an `httpOnly`, `secure`, and `sameSite='lax'` cookie.
- **FR-AUTH-02:** The `proxy.js` middleware must validate the JWT on every page transition (excluding `/api` and static assets).
- **FR-AUTH-03:** All users must have the ability to update their passwords via a secure modal (`ChangePasswordModal`).

### 3.2 Unified Staff Onboarding (Admin Only)
- **FR-STAFF-01:** The `/staff` page provides an `AddStaffModal`.
- **FR-STAFF-02:** If the "Doctor" role is selected, the UI must dynamically require `Specialization`, `Department`, and `Room Number`.
- **FR-STAFF-03:** Submitting a Doctor creation request must atomically create a `User` record (for login) and a `Doctor` record (for the hospital directory), permanently linking them via a `userId` reference.

### 3.3 Patient Management
- **FR-PAT-01:** The `/patients` registry must allow filtering by Priority (Critical, High, Medium, Low) and Status.
- **FR-PAT-02:** When a Doctor views the `/patients` registry, the backend/frontend logic must strictly filter the list using their `userId` so they only see their assigned patients.
- **FR-PAT-03:** Receptionists and Admins can assign multiple doctors and multiple equipment items to a single patient.

### 3.4 Doctor Dashboard
- **FR-DOC-01:** Doctors access a specialized `/doctor-dashboard`.
- **FR-DOC-02:** The dashboard must display total assigned patients, categorized by priority.
- **FR-DOC-03:** Doctors must be able to manually toggle their status (Available, On Break) from their dashboard or the global header.

### 3.5 Equipment Inventory Management
- **FR-EQ-01:** Equipment is tracked globally with an `inventory` count.
- **FR-EQ-02:** Assigning equipment to a patient decrements the inventory by 1 and updates the item's status to "In Use".
- **FR-EQ-03:** Unassigning equipment increments the inventory by 1 and returns status to "Available".

## 4. Data Models (Mongoose Schemas)

### 4.1 User Schema
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed via bcrypt)
- `position` (Enum: Admin, Doctor, Receptionist)
- `isAdmin` (Boolean)

### 4.2 Doctor Schema
- `userId` (ObjectId, ref: 'User') - *Strict link to authentication account*
- `name` (String)
- `specialization` (String)
- `department` (String)
- `roomNumber` (String)
- `status` (Enum: Available, busy, On Break)
- `patients` (Array of ObjectIds, ref: 'Patient')

### 4.3 Patient Schema
- `name`, `age`, `gender`, `symptoms`
- `status` (Enum: Waiting, In treatment, Completed)
- `priority` (Enum: Critical, High, Medium, Low)
- `department` (String)
- `doctor` (Array of ObjectIds, ref: 'Doctor')
- `equipment` (Array of ObjectIds, ref: 'Equipment')

### 4.4 Equipment Schema
- `name`, `category`, `roomNumber`
- `inventory` (Number)
- `status` (Enum: Available, In Use, Maintenance)
- `assignedPatient` (ObjectId, ref: 'Patient')

---
