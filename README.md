# Tartar

A web application to rate and compare tartar dishes from different restaurants.

## 📋 Description

Tartar is an application that allows you to discover, rate, and compare tartar dishes from various restaurants. You can evaluate each dish based on its taste, texture, and presentation.

## ✨ Features

- Add and view tartar ratings
- Detailed scoring system (taste, texture, presentation)
- Multi-currency support with automatic USD conversion
- Restaurant location and mapping
- Search restaurants using Google Places API

## 🛠️ Technology Stack

### Frontend
- **Framework**: React with Vite
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Routing**: Generouted

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (via Prisma ORM)
- **External APIs**: Google Places API, Exchange Rate API

## 🚀 Installation

The easiest way to run Tartar is using Docker:

```bash
# Pull the Docker image
docker pull imprevisible/tartar

# Run the container with required environment variables
docker run -p 80:80 \
  -e DATABASE_URL=${DATABASE_URL} \
  -e GOOGLE_PLACES_API_KEY=${GOOGLE_PLACES_API_KEY} \
  imprevisible/tartar
```

### Required Environment Variables

- `DATABASE_URL`: Connection string for your PostgreSQL database
- `GOOGLE_PLACES_API_KEY`: API key for Google Places integration

## 🏗️ Project Structure

```
tartar/
├── backend/               # NestJS backend
│   ├── prisma/            # Database ORM
│   └── src/
│       ├── modules/       # Feature modules
│       │   ├── restaurant/ # Restaurant module
│       │   └── tartar/    # Tartar module
│       └── prisma/        # Prisma service
│
├── frontend/              # React frontend
│   └── src/
│       ├── components/    # UI components
│       │   └── ui/        # Shadcn UI components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utilities and constants
│       ├── pages/         # Application pages
│       └── types/         # TypeScript type definitions
│
└── docker-compose.yml     # Docker configuration
```

## 📱 Usage

1. Browse the list of available tartars
2. Select a tartar to view its details
3. View detailed ratings and restaurant information
4. Add your own tartar ratings
5. Search for restaurants to add new tartars

## 📝 License

[GNU AGPL 3.0](LICENSE)
