# Database Setup Guide

## MySQL Setup (Recommended)

### 1. Install MySQL
```bash
# On macOS with Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# On Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Create Database
```sql
mysql -u root -p
CREATE DATABASE college_management;
EXIT;
```

### 3. Update Application Properties
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/college_management?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update
```

### 4. Enable DataInitializer
Edit `backend/src/main/java/com/college/config/DataInitializer.java`:
```java
@Component  // Uncomment this line
public class DataInitializer implements CommandLineRunner {
```

### 5. Run the Application
```bash
cd backend && mvn spring-boot:run
```

---

## H2 Database Setup (Quick Development)

### 1. Update Application Properties
Edit `backend/src/main/resources/application.properties`:
```properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### 2. Add H2 Dependency to pom.xml
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 3. Run the Application
```bash
cd backend && mvn spring-boot:run
```

### 4. Access H2 Console
Open: http://localhost:8080/api/h2-console
- JDBC URL: jdbc:h2:mem:testdb
- Username: sa
- Password: (leave empty)

---

## SQLite Database Setup (Simple File-based)

### 1. Update Application Properties
Edit `backend/src/main/resources/application.properties`:
```properties
# SQLite Database Configuration
spring.datasource.url=jdbc:sqlite:college_management.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
```

### 2. Add SQLite Dependency to pom.xml
```xml
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.45.1.0</version>
</dependency>
<dependency>
    <groupId>org.hibernate.dialect</groupId>
    <artifactId>hibernate-community-dialects</artifactId>
    <version>6.4.0.Final</version>
</dependency>
```

### 3. Run the Application
```bash
cd backend && mvn spring-boot:run
```

---

## Default Admin Credentials

Once the application starts with database connected:

- **Email:** admin@college.com
- **Password:** Admin@123

---

## Data Storage Locations

- **MySQL:** Data stored in MySQL server
- **H2:** In-memory (lost on restart) or file-based with URL change
- **SQLite:** `college_management.db` file in project root
