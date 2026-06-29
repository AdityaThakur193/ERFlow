# ERFlow — Smart Emergency Room Priority Board

<p align="center">
  A modern hospital operations dashboard designed to help emergency rooms manage patients, equipment, and emergency workflows in real time.
</p>

---

## Demo Credentials

You can access and test the application instantly:
* **One-Click Demo**: Click the **"One-Click Demo Login"** button on the Login page to instantly log in as the Receptionist.
* **Credentials**:
  * **Email**: `receptionist@example.com`
  * **Password**: `password123`

---

## About The Project

ERFlow is a hospital emergency room management system built to simulate real-world emergency room operations.

The platform provides a centralized dashboard where hospital staff can:

- Monitor incoming emergency patients
- Prioritize critical cases
- Track emergency room activity
- Manage medical equipment
- Monitor operational statistics
- Organize emergency workflows

The application is designed for:

- Nurses
- Reception Staff
- Emergency Coordinators
- Hospital Administrators

---

# Current MVP Features

## Emergency Patient Management

- Add emergency patients
- Live emergency queue
- Priority-based patient tracking
- Patient status updates
- Emergency room monitoring dashboard

---

## Equipment Management

- Add emergency equipment
- Assign equipment to patients
- Track equipment availability
- Monitor equipment usage
- Equipment status management

---

## Dashboard Analytics

- Total active patients
- Critical patient overview
- Waiting patient monitoring
- Emergency room operational statistics

---

## Doctors Section

- Emergency doctors overview
- Doctor availability display
- Department visibility
- Staff monitoring interface

---

# Tech Stack

<div align="left">

| Technology | Usage |
|---|---|
| Next.js | Frontend Framework |
| React | UI Development |
| Tailwind CSS | Styling |
| MongoDB | Database |
| Mongoose | Database ODM |

</div>

---

# Project Status

> ERFlow is currently a work in progress.

The version available in this repository is the MVP (Minimum Viable Product) built to demonstrate:

- Emergency room workflow management
- Hospital operations dashboard architecture
- Real-time CRUD functionality
- Equipment-to-patient assignment systems
- Responsive admin dashboard design

---

# Planned Future Features

- Authentication & Role Management
- Real-Time Socket Updates
- Advanced Analytics
- Shift Scheduling
- Live Emergency Alerts
- Department Management
- Doctor Workflow Integration
- Real Hospital Data Integrations

---

# Goal of the Project

The goal of ERFlow is to build a scalable and modern emergency room management platform that helps hospitals:

- Reduce operational confusion
- Improve patient prioritization
- Organize emergency workflows
- Monitor emergency resources efficiently

---

# MVP Focus

This repository currently focuses on building the foundational MVP architecture for the system.

The current build emphasizes:

- Simplicity
- Scalability
- Realistic hospital workflow simulation
- Functional dashboard systems

---

# Developer Note

ERFlow was built as a fast-paced MVP project focused on creating a realistic healthcare operations dashboard within a short development timeline.

### Future Plans:
- Integrate email service (Resend/Nodemailer) for automated staff credential delivery<br>
- Implement Real-Time "Page Specialist" Emergency Pager System<br>
- Develop 3D/Parallax landing page for high-end marketing<br>
- Add real-time Recharts/Chart.js analytics to the Admin dashboard<br>
- Automate departments with aggregation pipelines<br>
- Improve UI/UX with micro-animations<br>

### Done in Recent Commits:
- **Security**: Replaced public registration with Admin-only secure staff onboarding flow<br>
- **Security**: Hardened routing with `proxy.js` middleware, enforcing strict server-side RBAC<br>
- **Features**: Implemented a dedicated "My Dashboard" for Doctors with priority statistics<br>
- **Features**: Added global password change functionality for all staff roles<br>
- **Architecture**: Unified User accounts and Doctor profiles with atomic database creation<br>
- **Bug Fixes**: Resolved patient visibility bleed by strictly linking doctors via `userId`<br>
- **Tooling**: Created `seed.js` and `reset.js` scripts for database management<br>
- **Demo Mode**: Built a dedicated `seed-demo.js` script to populate clinical data with only receptionist user access<br>
- **Demo Mode**: Added a beautiful "One-Click Demo Login" card on the Login screen for seamless user exploration<br>