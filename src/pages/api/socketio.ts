import { Server as ServerIO } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends NextApiResponse {
  socket: {
    server: any;
  };
}

let io: ServerIO;

const ioHandler = async (req: NextApiRequest, res: SocketServer) => {
  if (!res.socket.server.io) {
    console.log('Initialisation du serveur Socket.IO');
    
    const httpServer = res.socket.server;
    io = new ServerIO(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling'],
      pingTimeout: 120000,
      pingInterval: 25000,
      upgradeTimeout: 30000,
      maxHttpBufferSize: 1e8,
      allowEIO3: true
    });

    // Stocker l'instance Socket.IO globalement
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connecté:', socket.id);

      // Récupérer l'ID de l'utilisateur depuis l'authentification
      const userId = socket.handshake.auth.userId;
      if (userId) {
        console.log('Utilisateur rejoint la room:', userId);
        socket.join(userId);
      } else {
        console.log('Pas d\'ID utilisateur fourni');
      }

      socket.on('disconnect', () => {
        console.log('Client déconnecté:', socket.id);
      });
    });
  } else {
    console.log('Socket.IO déjà initialisé');
  }

  // Nécessaire pour Next.js API Routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await new Promise((resolve) => {
    res.socket.server.io.on('connection', resolve);
  });

  res.end();
};

export default ioHandler; 