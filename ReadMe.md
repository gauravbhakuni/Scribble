# 🎨 Scribble Clone

A full-stack multiplayer drawing and guessing game inspired by [Scribble.io](https://skribbl.io). Built with **React**, **Node.js**, **Socket.io**, and **TailwindCSS** — supporting real-time chat, canvas drawing, and room-based multiplayer.

## ✨ Features

- 🎮 Realtime multiplayer rooms
- 🧑‍🤝‍🧑 Chat with other players in the same room
- 🖌 Collaborative canvas with multiple colors & eraser
- 🔄 Socket.io-based real-time updates
- 🧠 Turn-based guessing logic *(coming soon)*

## 🗂 Folder Structure

```
scribble-clone/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Pages like Lobby, Game, etc.
│       ├── hooks/           # Custom hooks like useSocket
│       ├── context/         # Global context (e.g., user, room state)
│       ├── utils/           # Utility functions
│       ├── socket/          # Socket connection logic
│       ├── styles/          # TailwindCSS configs
│       ├── App.js
│       ├── index.js
│
├── server/
│   ├── controllers/         # Room/Game controllers
│   ├── sockets/             # Socket event handlers
│   ├── models/              # Data models (if needed)
│   ├── utils/               # Word generation, etc.
│   ├── config/              # CORS/env configs
│   ├── index.js             # Server entry point
│   ├── server.js            # Socket + HTTP server
│   └── constants.js         # Game-related constants
│
├── README.md
├── .gitignore
```

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/gauravbhakuni/Scribble.git
cd Scribble
```

### 2️⃣ Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 3️⃣ Run the app

```bash
cd server
npm start

cd ../client
npm start
```

## 🛠 Tech Stack

- **Frontend:** React, Tailwind CSS, Socket.io-client  
- **Backend:** Node.js, Express, Socket.io  
- **Real-time:** WebSockets via Socket.io

## 📌 To Do

- [x] Real-time canvas sync
- [x] Chat system per room
- [ ] Turn-based word guessing logic
- [ ] Scoreboard and game timer
- [ ] Authentication (optional)

## 🤝 Contributing

1. Fork the repo  
2. Create your feature branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "Add your message"`)  
4. Push to the branch (`git push origin feature/your-feature`)  
5. Open a Pull Request 🚀

## 📄 License

This project is open source and free to use.

## 👨‍💻 Author

**Gaurav Bhakuni**  
[github.com/gauravbhakuni](https://github.com/gauravbhakuni)
