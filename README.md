# Wilson - Cockpit 🚀

You are aboard the Eleven shuttle heading to the planetary system. Your co-pilot Wilson, the creator of the application
that controls the shuttle, didn't wake up this morning and missed the launch.
Therefore, you are the sole pilot responsible for recruiting astronauts on the various habitable planets of the system.

Along the way, you realize that Wilson left several more or less visible, even catastrophic bugs in the code, preventing
you from reaching your destinations without risking the imminent explosion of your ship.

You will need to review the code and fix anything that displeases you: you will have to fix bugs, add behaviors, and
improve the code to conform to the screenshots provided.

## Wilson's Backlog to Guide You:

Your work should be submitted in a GitHub project with commits showing the changes you made to the code. This project
must be submitted at least 24 hours before your interview so that it can be reviewed by your technical recruiters.

## Stack:

- **Front-end**: React + Vite + TypeScript
- **Back-end**: Node + Express + TypeScript + Knex

### Additional Guidelines:

- Read the code and any comments carefully.
- Feel free to improve the code as you see fit. If you don't catch everything, don't stress; it will be discussed live
  during the interview.
- You cannot and should not install additional packages!
- A RESTful API is expected.
- There are inconsistencies between the API and the front-end; it's up to you to decide what needs to be changed.
- You can only create an astronaut in orbit around a habitable planet!
- The back-end is poorly designed, and you need to choose a suitable pattern/architecture.

## Services descriptions

This project consists of a multi-service application using Docker Compose.
The services include a MySQL database, a
backend server built with Node.js, and a frontend server.

```
+-------------------+       +--------------------+       +---------------------+
|                   |       |                    |       |                     |
|  MySQL Database   |       |   Backend Server   |       |   Frontend Server   |
| (db-eleven-test)  | <-->  |   (server-eleven)  | <-->  |    (front-eleven)   |
|    Port: 3306     |       |     Port: 4000     |       |      Port: 3000     |
|                   |       |                    |       |                     |
+-------------------+       +--------------------+       +---------------------+
```

## How to Launch the Project

1. **Ensure Docker and Docker Compose are installed on your machine.**

2. **Navigate to the project root directory:**

   ```sh
   cd path/to/project-root
   ```

3. **Build and run the Docker containers:**

   ```sh
   docker-compose up -d
   ```

   This command will build and start the services defined in the `docker-compose.yml` file. The backend server will wait
   for the MySQL database to be ready before running migrations and seeds.
