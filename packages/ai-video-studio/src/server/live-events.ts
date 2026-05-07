import type {Request, Response} from 'express';

type Client = {
	id: string;
	response: Response;
};

let clients: Client[] = [];

export interface LiveEventsServer {
	handler: (req: Request, res: Response) => void;
	sendEvent: (event: any) => void;
	sendEventToClient: (clientId: string, event: any) => void;
}

export const setupLiveEvents = (): LiveEventsServer => {
	const handler = (req: Request, res: Response) => {
		// Set headers for SSE
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');
		res.setHeader('Access-Control-Allow-Origin', '*');

		// Send initial connection message
		const clientId = `client-${Date.now()}-${Math.random()}`;
		res.write(`data: ${JSON.stringify({type: 'connected', clientId})}\n\n`);

		// Add client to list
		const client: Client = {id: clientId, response: res};
		clients.push(client);

		console.log(`Client connected: ${clientId} (total: ${clients.length})`);

		// Remove client on disconnect
		req.on('close', () => {
			clients = clients.filter((c) => c.id !== clientId);
			console.log(
				`Client disconnected: ${clientId} (remaining: ${clients.length})`,
			);
		});
	};

	const sendEvent = (event: any) => {
		const data = JSON.stringify(event);
		clients.forEach((client) => {
			client.response.write(`data: ${data}\n\n`);
		});
	};

	const sendEventToClient = (clientId: string, event: any) => {
		const client = clients.find((c) => c.id === clientId);
		if (client) {
			const data = JSON.stringify(event);
			client.response.write(`data: ${data}\n\n`);
		}
	};

	return {
		handler,
		sendEvent,
		sendEventToClient,
	};
};
