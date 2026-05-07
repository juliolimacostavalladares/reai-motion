import {Router} from 'express';

const router = Router();

// TODO: Implement render routes
// This will use @remotion/renderer to render the final video

router.post('/:projectId', async (req, res) => {
	res.status(501).json({error: 'Render endpoint not yet implemented'});
});

router.get('/:projectId/status', async (req, res) => {
	res.status(501).json({error: 'Render status endpoint not yet implemented'});
});

export {router as renderRoutes};
