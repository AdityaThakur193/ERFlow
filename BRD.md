# Business Requirements Document (BRD)
**Project Name:** ERFlow
**Document Version:** 1.0
**Target Audience:** Business Stakeholders, Hospital Administration, Project Management

---

## 1. Executive Summary
ERFlow is a modern, responsive web application designed specifically for mid-sized urban hospitals to streamline emergency room (ER) operations. The primary objective is to replace fragmented, inefficient manual processes with a centralized digital dashboard. ERFlow provides real-time tracking of patient triage, doctor availability, and critical medical equipment to significantly improve operational efficiency and patient throughput.

## 2. Business Problem & Objectives

### 2.1 The Business Problem
Prior to ERFlow, the hospital struggled with bottlenecks in the emergency department. The lack of a unified, real-time system resulted in:
- Inefficient patient flow and excessive wait times.
- Difficulty in tracking doctor availability and current patient loads.
- Inefficiencies in locating and assigning critical medical equipment (e.g., ventilators, monitors) during emergencies.

### 2.2 Project Objectives
- **Smoother Patient Flow:** Digitally track patients from the waiting room to treatment and completion.
- **Reduce Wait Times:** Enable receptionists to quickly assign incoming patients to available doctors based on priority (Critical, High, Medium, Low).
- **Increase Operational Efficiency:** Provide hospital administrators with a bird's-eye view of total hospital capacity, staff status, and equipment inventory in real-time.

## 3. Project Scope

### 3.1 In-Scope
- **Role-Based Dashboards:** Distinct interfaces for Administrators, Doctors, and Receptionists.
- **Patient Triage & Assignment:** Ability to register patients, assign priority levels, and link them to specific doctors and equipment.
- **Staff Management:** A centralized portal for administrators to securely create and manage staff accounts.
- **Equipment Inventory:** Real-time tracking of medical equipment availability and assignment to specific patients.
- **Secure Authentication:** JWT-based secure login system with robust password management.

### 3.2 Out-of-Scope
- Direct integration with external Electronic Health Record (EHR) systems (e.g., Epic, Cerner) for this MVP phase.
- Patient-facing portals or mobile applications.
- Billing, invoicing, and insurance claim processing.

## 4. Stakeholder Analysis

| Stakeholder Role | Responsibilities & Needs |
| :--- | :--- |
| **Hospital Administrator** | Requires full oversight of the hospital. Needs the ability to manage all staff accounts, monitor global patient metrics, and track overall equipment inventory. |
| **Doctor** | Needs a distraction-free dashboard showing *only* their assigned patients. Requires the ability to update their status (Available, Busy, On Break) and manage patient treatment progress. |
| **Receptionist / Triage** | The frontline user. Needs a rapid-entry system to register new patients, assess priority, and immediately assign available doctors and equipment. |

## 5. High-Level Business Requirements

1. **BR-01: Centralized Authentication & Security**
   The system must strictly control access based on user roles. A user must only see data and perform actions relevant to their specific job function.
2. **BR-02: Unified Staff Onboarding**
   The system must allow administrators to seamlessly create login credentials and hospital directory profiles for medical staff simultaneously to prevent data entry errors.
3. **BR-03: Real-Time Patient Tracking**
   The system must allow staff to view the current status of all patients in the ER, filterable by priority level and assigned department.
4. **BR-04: Equipment Allocation**
   The system must maintain an accurate count of all medical equipment, preventing the assignment of equipment that is currently in use or under maintenance.
5. **BR-05: Doctor Availability**
   The system must provide visibility into which doctors are currently available to take new patients versus those who are at capacity.

---
