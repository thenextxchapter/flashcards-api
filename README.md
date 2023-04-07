# Flashcards API

This project is a RESTful API for creating and managing flashcards.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/thenextxchapter/flashcards-api.git
cd flashcards
```

2. Copy the example environment file and update it with your own settings:

```bash
cp .public.env
```

You may need to update the database connection settings in the .env file to match your environment.

3. Load up the Docker container

```bash
db:dev:restart
```

This will start the database and run the database migrations to create the necessary tables.

4. Start the server

```bash
yarn start:dev
```

### API documentation

The API documentation will available at http://localhost:3000/

### Usage

The API exposes the following endpoints:

#### Auth endpoints

- `POST /auth/sigin` - Login with email and password
- `POST /auth/signup` - Create a new user account

#### User endpoints

- `GET /users/me` - Get the current user
- `PATCH /users/me` - Update the current user

#### Flashcard endpoints

- `GET /flashcards` - Get all flashcards
- `GET /flashcards/:id` - Get a flashcard by id
- `POST /flashcards` - Create a new flashcard
- `PATCH /flashcards/:id` - Update a flashcard
- `DELETE /flashcards/:id` - Delete a flashcard
- `GET /flashcards/:id/decks` - Get all decks that a flashcard is in
- `GET /flashcards/:id/decks/:deckId` - Get a deck that a flashcard is in
- `GET /flashcards/:id/tags` - Get all tags that a flashcard is in
- `GET /flashcards/:id/tags/:tagId` - Get a tag that a flashcard is in

#### Deck endpoints

- `GET /decks` - Get all decks
- `GET /decks/:id` - Get a deck by id
- `POST /decks` - Create a new deck
- `PATCH /decks/:id` - Update a deck
- `DELETE /decks/:id` - Delete a deck
- `GET /decks/:id/flashcards` - Get all flashcards that are in a deck
- `GET /decks/:id/flashcards/:flashcardId` - Get a flashcard that is in a deck

#### Tag endpoints

- `GET /tags` - Get all tags
- `GET /tags/:id` - Get a tag by id
- `POST /tags` - Create a new tag
- `PATCH /tags/:id` - Update a tag
- `DELETE /tags/:id` - Delete a tag
- `GET /tags/:id/flashcards` - Get all flashcards that are in a tag
- `GET /tags/:id/flashcards/:flashcardId` - Get a flashcard that is in a tag

## Other ToDos or Features to Add Later
- [ ] Implement Pagination, filtering, and sorting
- [ ] Modify the User and Auth endpoints to not return the password and make the response more secure and lean
- [ ] Implement a Review endpoint to allow users to review flashcards based on a schedule and algorithm to determine which flashcards to review