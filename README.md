# Weather Report Application

A full-stack application for managing and comparing weather forecasts, built with Go (backend) and Next.js (frontend).

## Features

- Weather forecast data management
- Compare multiple forecasts
- Modern UI with data tables
- RESTful API
- PostgreSQL database

## Prerequisites

- Docker and Docker Compose
- Go 1.21+ (for local backend development)
- Node.js 18+ (for local frontend development)
- PostgreSQL 16+ (if running locally)

## Running with Docker

The easiest way to run the application is using Docker Compose:

1. Clone the repository:
```bash
git clone https://github.com/rein1410/weather-report
cd weather-report
```

2. Copy the environment template
```bash
cd backend
cp .env.template .env
```

3. Update the `.env` file with your API key

4. Start the application:
```bash
docker-compose up --build
```

This will start:
- Frontend at http://localhost:3000
- Backend at http://localhost:8080
- PostgreSQL database at localhost:5432

## Running Locally

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the backend:
```bash
export OPENWEATHER_API_KEY=your_api_key; go run cmd/app/main.go
```

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment template:
```bash
cp .env.template .env
```

4. Update the `.env` file with your backend URL

5. Run the frontend:
```bash
npm run dev
```

## API Examples

### Get All Forecasts

```bash
curl http://localhost:8080/api/daily-forecast
```

Response:
```json
{
    ...
    "list": [
        {
            "dt": 1745128800,
            "temp": 303.96,
            "pressure": 1008,
            "humidity": 1008,
            "clouds": 75
        },
        ...
    ]
}
```

### Get Forecast History

```bash
curl http://localhost:8080/api/history
```

The history endpoint supports pagination, filtering, and sorting through query parameters:

#### Pagination
- `limit`: Number of items per page (default: 10)
- `page`: Page number (0-based)

#### Filtering
Filters are specified using the format: `filters=field:operator:value`
Multiple filters can be combined using semicolons: `filters=field1:operator1:value1;field2:operator2:value2`

Supported operators:
- `eq`: Equal to
- `gt`: Greater than
- `lt`: Less than
- `gte`: Greater than or equal to
- `lte`: Less than or equal to
- `in`: In a list of values
- `between`: Between two values

Example:
```bash
# Get forecasts from a specific date
curl "http://localhost:8080/api/history?filters=dt:eq:1745427600"

# Get forecasts with temperature greater than 300 Kelvin
curl "http://localhost:8080/api/history?filters=temp:gt:300"

# Combine multiple filters
curl "http://localhost:8080/api/history?filters=temp:gt:300;humidity:lt:1011"
```

#### Sorting
Sort fields are specified using the `sorts` parameter. Prefix a field with `-` for descending order.

Example:
```bash
# Sort by temperature ascending
curl "http://localhost:8080/api/history?sorts=temp"

# Sort by temperature descending
curl "http://localhost:8080/api/history?sorts=-temp"

# Sort by multiple fields
curl "http://localhost:8080/api/history?sorts=-temp,humidity"
```

#### Combined Example
```bash
# Get page 2 with 5 items per page, filtered for temperatures above 300 Kelvin, sorted by temperature descending
curl "http://localhost:8080/api/history?limit=5&page=1&filters=temp:gt:300&sorts=-temp"
```

Response:
```json
{
    "total": 100,
    "total_pages": 20,
    "page": 1,
    "list": [
        {
            "dt": 1745128800,
            "temp": 300.96,
            "pressure": 1008,
            "humidity": 1008,
            "clouds": 75
        },
        ...
    ]
}
```

## Development

- Backend is written in Go using a clean architecture approach
- Frontend is built with Next.js and TypeScript
- UI components use shadcn/ui
- Data tables are implemented using TanStack Table

## Testing

### Frontend Testing

The frontend uses Vitest and React Testing Library for testing. To run the tests:

```bash
cd frontend
npm test
```

For more detailed information about testing, see the [Testing Documentation](frontend/__test__/README.md).

### Backend Testing

The backend uses Go's built-in testing framework. To run the tests:

```bash
cd backend
go test ./tests
```