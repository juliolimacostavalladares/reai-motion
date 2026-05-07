import {Router, type Router as ExpressRouter} from 'express';

const router: ExpressRouter = Router();

// TODO: Implement render routes
// This will use @remotion/renderer to render the final video

router.post('/:projectId', async (_req, res) => {
	res.status(501).json({error: 'Render endpoint not yet implemented'});
});

router.get('/:projectId/status', async (_req, res) => {
	res.status(501).json({error: 'Render status endpoint not yet implemented'});
});

export {router as renderRoutes};
