# Secure Real-Time Chat (Web App)

This is a web application that enables users to communicate with one another in real-time. The backend handles concurrent connections using Socket.io.

![Demo](https://i.imgur.com/mNnZPQG.png)

## Get Started

### Dev:
- ```npm i && npm i --prefix ./frontend```
- ```npm start```
- In separate terminal:
- ```npm start --prefix ./frontend```

### Production:
- At root: ```npm run build```
- ```serve -s -n build```
- ```forever stopall; forever start ./backend/server.js```

