import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: NetServer & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
} 