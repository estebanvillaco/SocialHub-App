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
   `#https://www.docker.com/products/docker-desktop`

2. **Start Keycloak Server**

   ```bash
   docker run -p 8180:8180      -e KEYCLOAK_ADMIN=admin      -e KEYCLOAK_ADMIN_PASSWORD=admin      quay.io/keycloak/keycloak:22.0.1 start-dev
   ```

3. **Access Admin Console**  
   `# http://localhost:8180/admin`  
   - Username: `admin`  
   - Password: `admin`

4. **Create the `socialhub` realm**  
   Manually configure or import a realm JSON file if available.

---

## 🏰 Keycloak Realm Configuration

**Realm Name:** `socialhub`

### 🔐 Login Screen Settings

| Feature            | Status |
|--------------------|--------|
| User Registration  | ✅ On  |
| Forgot Password    | ✅ On  |
| Remember Me        | ✅ On  |

### 📧 Email Settings

| Feature            | Status |
|--------------------|--------|
| Email as Username  | ❌ Off |
| Login with Email   | ✅ On  |
| Duplicate Emails   | ❌ Off |
| Verify Email       | ✅ On  |

### 👤 User Info Settings

| Feature         | Status |
|-----------------|--------|
| Edit Username   | ✅ On  |

---

## ⚙️ Keycloak Clients

### 1. `spring-boot-backend`

| Setting                            | Value                                 |
|------------------------------------|---------------------------------------|
| Client ID                          | `spring-boot-backend`                 |
| Name                               | `socialhub-backend`                   |
| Valid Redirect URIs                | `/*http://localhost:8180/admin/*`     |
| Front Channel Logout               | ✅ On                                  |
| Backchannel Logout Session Required| ✅ On                                  |
| Client Authentication              | ❌ Off                                 |
| Authorization                      | ❌ Off                                 |

---

### 2. `keycloak-react-client`

| Setting                            | Value                     |
|------------------------------------|---------------------------|
| Client ID                          | `keycloak-react-client`  |
| Name                               | `keycloak_react_client`  |
| Valid Redirect URIs                | `http://localhost:3000/*`|
| Web Origins                        | `http://localhost:3000`  |
| Front Channel Logout               | ✅ On                     |
| Backchannel Logout Session Required| ✅ On                     |

---

## 💾 Database Setup – PostgreSQL 17

### 📥 Download PostgreSQL 17  
`# https://www.postgresql.org/download/`

After installation, create a database named `socialhub`:

```bash
createdb -U postgres socialhub
```

> 💡 **Note**: Save your PostgreSQL password — you'll need it in the configuration below.

---

## ⚙️ Backend Configuration

Before running the backend, open the file:

```bash
src/main/resources/application.properties
```

And update the following:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/socialhub
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password_here
spring.jpa.hibernate.ddl-auto=update
```

- Replace `your_postgres_password_here` with your actual password.
- Adjust the `username` if your PostgreSQL user is different from `postgres`.

---

## 🌐 Frontend Setup – Node.js & React

### 📥 Download Node.js  
`# https://nodejs.org/` (Use the LTS version)

Then run:

```bash
cd SocialHubFrontend
npm install
npm start
```

App will be available at:  
`# http://localhost:3000`

---

## 🖥️ Backend Setup – Spring Boot

### 🧰 Recommended Java IDEs

- IntelliJ IDEA (Recommended)  
  `# https://www.jetbrains.com/idea/`
- Eclipse  
  `# https://www.eclipse.org/`
- VS Code (with Java Extension Pack)  
  `# https://code.visualstudio.com/`

### ▶️ Run the Backend

```bash
cd socialhub-backend
./mvnw spring-boot:run
```

Or use **Run > Spring Boot Application** in your IDE.

---
### Link to Swagger to test the backend

```bash
http://localhost:8080/swagger-ui/index.html
```

## 🧠 Tech Stack

- **Frontend**: React  
- **Backend**: Spring Boot (Java)  
- **Database**: PostgreSQL 17  
- **Authentication**: Keycloak  
- **Containerization**: Docker  

---

## 📝 License

MIT License – see `LICENSE`

---

## 🙋 Contact

For questions or feedback, open a GitHub Issue or start a Discussion.
