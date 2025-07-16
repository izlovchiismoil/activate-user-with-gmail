# User Email Activation API with Node.js, Sequelize, PostgreSQL & Docker

This project is a minimal authentication API built with **Node.js**, using **Sequelize ORM** and **PostgreSQL** as the database. It allows user registration and login via email, with account activation through **Gmail-based verification links**. The entire application is containerized using **Docker Compose**.

---

## 🚀 Features

- 📧 User registration with email
- ✅ Email-based account activation (Gmail)
- 🔐 Login only after email confirmation
- 🗃️ PostgreSQL database with Sequelize ORM
- 🐳 Docker + Docker Compose support
- 🌿 Environment-based configuration using `.env` file (not included)

---

## 📦 Tech Stack

- **Node.js** (Express.js)
- **Sequelize** ORM
- **PostgreSQL**
- **JWT** for authentication
- **Docker** & **Docker Compose**
- **Gmail SMTP** (via Nodemailer)

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name


## Run docker
docker-compose up --build

## API documentation URL by POSTMAN documentation
API documentation URL: https://documenter.getpostman.com/view/31631767/2sB34hH1kQ

## Activate user by link
<img width="1920" height="1024" alt="{BC7172EB-5588-411C-9C84-9D59FC88CAAE}" src="https://github.com/user-attachments/assets/2f956f13-4faf-49ab-a2f1-818c8e2085f7" />