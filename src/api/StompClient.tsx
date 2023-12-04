import { Client } from '@stomp/stompjs';

const client = new Client({
  brokerURL: process.env.VITE_APP_BASE_SOCKET,
  reconnectDelay: 2000,
});

export const StompClient = client;
