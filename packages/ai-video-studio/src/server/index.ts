import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {setupLiveEvents} from './live-events';
import {agentRoutes} from './routes/agents';
import {projectRoutes} from './routes/projects';
import {renderRoutes} from './routes/render';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));

// Setup Server-Sent Events for live updates
const liveEvents = setupLiveEvents();

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/render', renderRoutes);
app.get('/api/events', liveEvents.handler);

// Health check
app.get('/api/health', (_req, res) => {
	res.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		version: process.env.npm_package_version || '1.0.0',
	});
});

// Error handling
app.use(
	(
		err: Error,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction,
	) => {
		console.error('Error:', err);
		res.status(500).json({
			error: err.message || 'Internal server error',
		});
	},
);

app.listen(PORT, () => {
	console.log(`🚀 AI Video Studio Backend running on http://localhost:${PORT}`);
	console.log(
		`📡 Live events available at http://localhost:${PORT}/api/events`,
	);
	console.log(`🎬 Ready to create videos!`);
});

export {liveEvents};
