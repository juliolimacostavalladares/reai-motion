import {Router as createRouter} from 'express';

const router = createRouter();

router.post('/:projectId', (_req, res) => {
	res.status(501).json({error: 'Render endpoint not yet implemented'});
});

router.get('/:projectId/status', (_req, res) => {
	res.status(501).json({error: 'Render status endpoint not yet implemented'});
});

export {router as renderRoutes};
