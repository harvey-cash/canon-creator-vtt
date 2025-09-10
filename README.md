# **Project "Canon Creator": Engineering Overview**

This document outlines the vision, features, architecture, and development principles for Project Canon Creator, a modern, AI-enhanced virtual tabletop (VTT) application.

## **1\. Vision & Sales Pitch**

Canon Creator is a next-generation virtual tabletop designed to create a seamless, intuitive, and immersive experience for TTRPG players. It addresses the core pain points of existing platforms by offering a minimal, mobile-first UI, reliable integrated services, and powerful, in-session AI tools that keep everyone in the game.

Our goal is to eliminate friction by unifying communication, lightweight gameplay mechanics, and AI-driven assistance into a single, elegant web application. The name reflects our goal of creating a tool that helps GMs and players collaboratively build their game's canon, supported by AI-driven tools for summarization and content generation.

## **2\. MVP Features**

The Minimum Viable Product will focus on delivering a system-agnostic and immersive experience.

### **Core Canvas & Gameplay**

* **Layered Canvas:** A shared, real-time canvas with three distinct layers: a background layer for maps, a token layer for characters, and a GM-only hidden layer for secrets and notes.  
* **Token Management:** Support for creating, moving, and managing character and NPC tokens on the canvas.

### **Character & Token Features**

* **Generic Token Attributes:** Tokens will have a simple, configurable key-value system for tracking attributes like Health, Armor Class, or custom "Charges."  
* **Generic Statuses:** A flexible system for applying and displaying visual status effects on tokens (e.g., Prone, Grappled, Unconscious, Dead).  
* **Lightweight Character Bio:** A simple profile page per character containing:  
  * A profile image and text description.  
  * A simple text-based token inventory.  
  * A link to their token on the active canvas.  
  * Configurable **Ability Buttons** that can be set up with custom dice rolls (e.g., 2d6+3) with results sent directly to the text chat.

### **Communication & Immersion**

* **Integrated Voice & Video:** High-quality, reliable, in-app voice and video chat.  
* **Multi-Channel Text Chat:** A robust text chat system with support for multiple channels, image uploads, and a persistent log.  
* **Background Music Player:** A synchronized music and ambient sound player that works consistently for all participants.

### **Core AI Suite**

* **Streaming Transcription:** Live transcription of the voice chat to provide a searchable session log and feed context to other AI features.  
* **On-Demand Summarization:** Player-triggered LLM summaries of the recent conversation.  
* **AI Background Image Generation:** An in-app tool for the GM to generate and immediately display atmospheric background art on the canvas.  
* **AI Token Image Generation:** An in-app tool for the GM to generate character and monster portraits for use as tokens.

## **3\. Application Architecture**

The application will be built as a **structured monolith** following the **Hexagonal (Ports & Adapters) Architecture**.

* **Core Logic (The Hexagon):** Contains all pure, dependency-free business logic (game rules, session state, permissions). This core is agnostic of any framework, database, or third-party service. It defines ports (interfaces) for the functionality it needs from the outside world.  
* **Adapters (The Outside World):** Concrete implementations of the ports that interact with external services. This is where all third-party dependencies (Prisma, Firebase, Google GenAI) live. This structure allows any service to be swapped out without affecting the core logic.  
* **API Communication (tRPC):** Communication between the frontend and backend will be handled by tRPC. This allows the frontend to call backend procedures as if they were local functions, providing full, compile-time, end-to-end type safety. This eliminates the need for separate API contract definitions and prevents integration bugs.  
* **Frontend State Management:** The React frontend will use a **centralized state management library (Zustand)** to decouple application logic from the UI. UI components will be "dumb," reading their state from the store and dispatching actions. This creates a predictable, one-way data flow and allows the UI to be refactored independently of the logic.  
* **Logic Distribution:**  
  * **Backend (Authoritative):** Enforces all business rules, security, permissions, and data persistence. It is the single source of truth.  
  * **Frontend (UI State):** Manages the presentation layer, user interactions, and optimistic updates for a fluid user experience.

## **4\. Full Tech Stack**

| Category | Technology | Rationale |
| :---- | :---- | :---- |
| **Language** | **TypeScript** | End-to-end static typing for safety, refactorability, and superior developer experience. |
| **API Style** | **tRPC** | Provides end-to-end type safety between client and server with zero schemas or code generation, leveraging the TypeScript monorepo for a superior developer experience. |
| **Backend** | **NestJS** | A TypeScript-first framework with built-in support for dependency injection, ideal for the Hexagonal Architecture. |
| **Frontend** | **React (with Vite)** | A powerful UI library with a mature ecosystem. Vite provides a fast, zero-configuration development environment for TypeScript. |
| **Frontend State** | **Zustand** | A minimal, unopinionated state management library to cleanly separate UI from application logic. |
| **Database ORM** | **Prisma** | A modern, type-safe ORM that generates TypeScript types from the database schema, ensuring data access is robust and error-free. |
| **Testing** | **Vitest** | A modern, fast test runner with a unified API for both backend and frontend unit/integration testing. |
| **Authentication** | **Firebase Authentication** | A secure, managed service to handle all user authentication, saving significant development time. |
| **File Storage** | **Firebase Storage (GCS)** | A managed object storage solution with simple SDKs and integrated security, living in the same GCP project as AI services. |
| **GenAI APIs** | **Google Cloud AI** | For all LLM and image generation tasks, centralizing AI features within a single cloud provider. |

## **5\. Deployment Strategy**

The entire application will be deployed using a combination of **Render** for the core application stack and **Google Cloud** for specialized services.

* **Frontend (Render Static Site):** The React application will be built into static files and served globally via Render's CDN.  
* **Backend (Render Web Service):** The NestJS application will run as a managed web service on Render. It will use Render's "spin down" feature on the free tier to minimize costs during idle periods.  
* **Database (Render PostgreSQL):** A managed PostgreSQL instance on Render will serve as the primary database. It connects to the backend via a secure, low-latency internal network.  
* **Specialized Services (Google Cloud):** All authentication, file storage, and AI API calls will be managed through a single Google Cloud project for unified billing and administration.

## **6\. Software Development Principles**

1. **Test-Driven Development (TDD):** Business logic in the application core will be written test-first. A high-coverage unit test suite will serve as a safety net, enabling ambitious refactoring and feature development without fear of regressions.  
2. **Service Agnosticism:** All third-party services (database, auth, AI) will be hidden behind interfaces (ports) defined by the core application. This allows any service to be mocked for testing or replaced entirely without impacting the business logic.  
3. **Simplicity First:** The architecture is a monolith designed for a small number of concurrent users. Decisions will prioritize a simple, maintainable system for the current scale over premature optimization for massive, hypothetical future scale.  
4. **Static Typing as a Contract:** TypeScript will be used across the entire stack. Types and interfaces, particularly those shared between the frontend and backend, will serve as a binding contract to ensure data consistency and prevent integration bugs.