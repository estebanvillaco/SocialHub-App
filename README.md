# 🌐 SocialHub

**SocialHub** is a lightweight social media platform that allows users to create profiles, share posts, and interact securely. It features a **React frontend**, **Spring Boot backend**, and uses **Keycloak** for identity and access management.

---

## 🚀 Features

- Secure login and user registration with Keycloak
- Email verification and password reset support
- Personalized feed and post creation
- PostgreSQL as the database
- Docker-based Keycloak for easy setup

---

## 🔧 Keycloak Setup with Docker

We use Docker to run Keycloak locally for development.

### 🐳 Quick Start

1. **Install Docker**  
   👉 [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

2. **Start Keycloak Server**
   ```bash
   docker run -p 8180:8180 \
     -e KEYCLOAK_ADMIN=admin \
     -e KEYCLOAK_ADMIN_PASSWORD=admin \
     quay.io/keycloak/keycloak:22.0.1 start-dev
Access Admin Console
http://localhost:8180/admin
Username: admin
Password: admin

Create the socialhub realm
Manually configure or import a realm JSON file if available.

🏰 Keycloak Realm Configuration
Realm Name
nginx
Copy
Edit
socialhub
🔐 Login Screen Settings
Feature	Status
User Registration	✅ On
Forgot Password	✅ On
Remember Me	✅ On

📧 Email Settings
Feature	Status
Email as Username	❌ Off
Login with Email	✅ On
Duplicate Emails	❌ Off
Verify Email	✅ On

👤 User Info Settings
Feature	Status
Edit Username	✅ On

⚙️ Keycloak Clients
1. spring-boot-backend
Setting	Value
Client ID	spring-boot-backend
Name	socialhub-backend
Valid Redirect URIs	/*http://localhost:8180/admin/*
Front Channel Logout	✅ On
Backchannel Logout Session Req	✅ On
Client Authentication	❌ Off
Authorization	❌ Off

2. keycloak-react-client
Setting	Value
Client ID	keycloak-react-client
Name	keycloak_react_client
Valid Redirect URIs	http://localhost:3000/*
Web Origins	http://localhost:3000
Front Channel Logout	✅ On
Backchannel Logout Session Req	✅ On

💾 Database Setup – PostgreSQL 17
📥 Download PostgreSQL 17
Visit: https://www.postgresql.org/download/

After installation, create a database called socialhub.

bash
Copy
Edit
createdb -U postgres socialhub
Note: Save your database password — you’ll need to add it in the configuration below.

⚙️ Backend Configuration
Before running the backend, edit the following file:

css
Copy
Edit
src/main/resources/application.properties
Example Configuration:
properties
Copy
Edit
spring.datasource.url=jdbc:postgresql://localhost:5432/socialhub
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password_here
spring.jpa.hibernate.ddl-auto=update
Replace your_postgres_password_here with your actual PostgreSQL password.

🌐 Frontend Setup – Node.js & React
📥 Download Node.js
Download and install Node.js (LTS):
👉 https://nodejs.org/

After installation:

bash
Copy
Edit
cd frontend
npm install
npm start
The app will launch at: http://localhost:3000

🖥️ Backend Setup – Spring Boot
🧰 Recommended Java IDEs
You can use any of these IDEs:

IntelliJ IDEA (Recommended) – https://www.jetbrains.com/idea/

Eclipse – https://www.eclipse.org/

VS Code (with Java Extension Pack) – https://code.visualstudio.com/

▶️ Run the Backend
bash
Copy
Edit
cd backend
./mvnw spring-boot:run
Or use Run > Spring Boot Application in your IDE.

🧠 Tech Stack
Frontend: React

Backend: Spring Boot (Java)

Database: PostgreSQL 17

Authentication: Keycloak

Containerization: Docker

📝 License
MIT License – see LICENSE

🙋 Contact
For questions or feedback, open a GitHub Issue or start a Discussion.
