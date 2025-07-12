
# Novarian Gift Shop

This is a contribute project between Django and React to create a gift shop website named Novarian.

![Novarian Hero Image](./novarian.png)

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Frontend:** React, Next.js, TypeScript
- **Database:** PostgreSQL
- **Caching/Message Broker:** Redis
- **Web Server/Reverse Proxy:** Nginx
- **Other:** Docker, CSS, HTML, JavaScript, Shell

## Setup

To run project locally, in production or using Docker you need to setup environment variables first. Rename the `.env.example` to `.env` and fill the required values.

### Backend Setup (Django)

1. Install dependencies:
First install [uv package manager](https://docs.astral.sh/uv/getting-started/installation/) (feel free to read [uv documents](https://docs.astral.sh/uv/getting-started/))

   ```bash
   pip install uv
   ```

2. install packages:

   ```bash
   cd backend
   un sync
   ```

3. Run migrations:

   ```bash
   uv run manage.py migrate
   ```

4. Start the backend server:

   ```bash
   uv run manage.py runserver
   ```

### Frontend Setup (React/Next.js)

1. Install dependencies [bun bundler](https://bun.sh/docs/installation)):

   ```bash
   bun install
    ```

2. go to the fronend directory

   ```bash
   cd frontend
   ```
   
3. Start the frontend development server:

   ```bash
   npm run dev
   ```

4. Access the frontend at: [http://localhost:3000](http://localhost:3000)

### Running with Docker

- Just build and start all services **(recommended)**:
  
   ```bash
   docker compose up --build
   ```

## Project Structure

Brief overview of the main directories and their purposes.

```bash
Novarian
├── backend          # Django project
├── compose.yaml     # Docker Compose file
├── dockerfiles      # Docker files
├── frontend         # React/Next.js project
├── .env.example     ## .env.example file which must be
│                    ## modified like mentioned in 'Setup'
├── LICENSE
└── README.md
```

## Contributing

Contributions are always welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/).
