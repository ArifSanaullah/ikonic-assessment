# Real-Time Chat Application

A real-time chat application built using Socket.io, Node.js, and NextJS. Users can join different rooms, exchange messages, send private messages, and more.

## Features

- **Multiple Rooms**: Users can join different rooms and send messages within those rooms.
- **Private Messages**: Users can send private messages to specific individuals within the same room.
- **Typing Indicator**: Implements a feature that shows when a user is typing a message.
- **Notifications**: Notifies users when someone joins or leaves the room.
- **Message History**: Stores and displays the last 10 messages exchanged in a room for new users joining.

## Tech Stack

- Node.js
- Socket.io
- React
- MongoDB

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/arifsanaullah/ikonic-assessment.git
    ```

2. Change into the project directory:

    ```bash
    cd ikonic-assessment
    ```

3. Install dependencies for the server:

    ```bash
    cd server
    npm install
    ```

4. Install dependencies for the client:

    ```bash
    cd ../client
    npm install
    ```

### Configuration

1. Set up a MongoDB database and update the connection string in `server/server.js`.

2. Configure other environment variables if necessary.

### Usage

1. Start the server:

    ```bash
    cd server
    npm start
    ```

2. Start the client:

    ```bash
    cd ../client
    npm start
    ```

3. Open your browser and go to `http://localhost:3000` to access the chat application.

## Contributing

Feel free to contribute by opening issues or submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.