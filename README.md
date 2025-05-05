# Assignment 1[DevOps] - To-Do App Deployment

## Overview

This report documents the implementation of Continuous Integration and Continuous Deployment (CI/CD) practices for a full-stack To-Do application. The project demonstrates containerization with Docker, automated deployment using Render.com, and integration with GitHub for continuous deployment workflows.

## Architecture & Technology Stack

- **Frontend:** React
- **Backend:** Node.js with Hono
- **Database:** Sqlite for local development and PostgreSQL(render db) for production.

### Environment Configuration

Environment variables were properly implemented to separate configuration from code:

- **Backend `.env` (External DB URL):**
  ```env
    DATABASE_URL="postgresql://wangpo_user:e2zHSNcdJidtN4JzR0yU372JIRKHxf6S@dpg-d0aejtidbo4c73edfoig-a.oregon-postgres.render.com/wangpo"
  PORT=4000
  ```
- **Frontend `.env`:**
  `    REACT_APP_API_URL=http://localhost:4000
   `
  **Note**: Used Port 4000 because port 5000 is already used by other processes.

### For the loacal testing:

- **Backend:**

  - Navigate to the `backend` directory (rdb_server).
  - Run `npm i` and `npm run dev`.

- **Frontend:**
  - Navigate to the `frontend` directory.
  - Run `npm i` and `npm run dev`.

## Part A: Dockerizing and Pushing to Docker Hub

### Docker Build

To build the Docker images for both frontend and backend application, we create dockerfiles in their respective directories by using the image tagged as the student ID.

### Dockerfile for the backend:

![alt text](images/dockerfile-backend.png)

### Sample Frontend Dockerfile:

![alt text](<images/dockerfile-frontend .png>)

### Docker Build and Push

#### Backend

```
docker build -t wangpo1642/be-todo:02230311 .
```

![alt text](images/build-backend.png)

```
docker push wangpo1642/be-todo:02230311
```

![alt text](<images/dockerpush-backend .png>)

### Frontend

```
docker build -t wangpo1642/fe-todo:02230311 .
```

![alt text](<images/dockerbuild-frontend .png>)

```
docker push wangpo1642/fe-todo:02230311
```
![alt text](<images/dockerpush-frontend .png>)

## Part A: Deploying to Render

### Backend Web Service

Now in this section, we will deploy the backend and frontend applications to Render.com.

Image: `wangpo1642/be-todo:02230311`

![alt text](images/parta-deployment-to-render.png)
![alt text](images/parta-img2.png)

Create a Postgres database on `render.com`

![alt text](images/db-render.png)
![alt text](images/db-render2.png)
Environment Variables on `render.com`:

```
DB_HOST=dpg-d0aejtidbo4c73edfoig-a
DB_USER=wangpo_user
DB_PASSWORD=e2zHSNcdJidtN4JzR0yU372JIRKHxf6S
DB_NAME=wangpo
DB_PORT=5432
PORT=5000
```

### Frontend Web Service

Now we will deploy the frontend application to Render.com.

Image: `wangpo1642/fe-todo:02230311`

![alt text](<images/frontend-render .png>)

Environment Variables on `render.com`(same process but set):

```
REACT_APP_API_URL=https://be-todo-02230311-1.onrender.com
```

![](images/15.png)

## Part B: Automated image build and deployment

### Updated Structure

```
todo-app/
  ├── frontend/
  │   └── Dockerfile
  ├── backend/
  │   └── Dockerfile
  └── render.yaml
```

### render.yaml

```
services:
  - type: web
    name: be-todo
    env: docker
    dockerfilePath: ./backend/Dockerfile
    envVars:
      - key: DATABASE_URL
        value: https://be-todo-02230311-1.onrender.com
      - key: PORT
        value: 5000
    disk:
      name: fe-todo
      mountPath: /app/data
      sizeGB: 1
    healthCheckPath: /api/health

  - type: web
    name: fe-todo
    env: docker
    dockerfilePath: ./frontend/Dockerfile
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://be-todo.onrender.com
```

![alt text](images/finalimg.png)


