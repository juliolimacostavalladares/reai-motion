import {Router, type Router as ExpressRouter} from 'express';
import type {AgentProgress} from '../../types';
import {extractBrand} from '../../utils/brand-extractor';
import {composeVideo} from '../../utils/composition-generator';
import {generateScript} from '../../utils/script-generator';
import {generateStoryboard} from '../../utils/storyboard-generator';
import {liveEvents} from '../index';

const router: ExpressRouter = Router();

// Extract brand from URL or logo
router.post('/extract-brand', async (req, res) => {
	try {
		const {url, projectId} = req.body;

		// Send initial progress
		const sendProgress = (progress: Partial<AgentProgress>) => {
			liveEvents.sendEvent({
				type: 'agent-progress',
				projectId,
				...progress,
			});
		};

		sendProgress({
			phase: 'brand-extraction',
			progress: 0,
			message: 'Starting brand extraction...',
			status: 'running',
		});

		// Extract brand
		const brandKit = await extractBrand(url, sendProgress);

		sendProgress({
			phase: 'brand-extraction',
			progress: 100,
			message: 'Brand extraction completed!',
			status: 'completed',
		});

		res.json({success: true, data: brandKit});
	} catch (error) {
		console.error('Error extracting brand:', error);
		liveEvents.sendEvent({
			type: 'agent-progress',
			projectId: req.body.projectId,
			phase: 'brand-extraction',
			progress: 0,
			message: 'Brand extraction failed',
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Generate script
router.post('/generate-script', async (req, res) => {
	try {
		const {brandKit, questionnaire, projectId} = req.body;

		const sendProgress = (progress: Partial<AgentProgress>) => {
			liveEvents.sendEvent({
				type: 'agent-progress',
				projectId,
				...progress,
			});
		};

		sendProgress({
			phase: 'script-generation',
			progress: 0,
			message: 'Generating video script...',
			status: 'running',
		});

		const script = await generateScript(brandKit, questionnaire, sendProgress);

		sendProgress({
			phase: 'script-generation',
			progress: 100,
			message: 'Script generation completed!',
			status: 'completed',
		});

		res.json({success: true, data: script});
	} catch (error) {
		console.error('Error generating script:', error);
		liveEvents.sendEvent({
			type: 'agent-progress',
			projectId: req.body.projectId,
			phase: 'script-generation',
			progress: 0,
			message: 'Script generation failed',
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Generate storyboard
router.post('/generate-storyboard', async (req, res) => {
	try {
		const {script, brandKit, projectId} = req.body;

		const sendProgress = (progress: Partial<AgentProgress>) => {
			liveEvents.sendEvent({
				type: 'agent-progress',
				projectId,
				...progress,
			});
		};

		sendProgress({
			phase: 'storyboard-generation',
			progress: 0,
			message: 'Creating storyboard...',
			status: 'running',
		});

		const storyboard = await generateStoryboard(script, brandKit, sendProgress);

		sendProgress({
			phase: 'storyboard-generation',
			progress: 100,
			message: 'Storyboard generation completed!',
			status: 'completed',
		});

		res.json({success: true, data: storyboard});
	} catch (error) {
		console.error('Error generating storyboard:', error);
		liveEvents.sendEvent({
			type: 'agent-progress',
			projectId: req.body.projectId,
			phase: 'storyboard-generation',
			progress: 0,
			message: 'Storyboard generation failed',
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Compose video
router.post('/compose-video', async (req, res) => {
	try {
		const {storyboard, template, brandKit, projectId} = req.body;

		const sendProgress = (progress: Partial<AgentProgress>) => {
			liveEvents.sendEvent({
				type: 'agent-progress',
				projectId,
				...progress,
			});
		};

		sendProgress({
			phase: 'video-composition',
			progress: 0,
			message: 'Composing video...',
			status: 'running',
		});

		const composition = await composeVideo(
			storyboard,
			template,
			brandKit,
			projectId,
			sendProgress,
		);

		sendProgress({
			phase: 'video-composition',
			progress: 100,
			message: 'Video composition completed!',
			status: 'completed',
		});

		res.json({success: true, data: composition});
	} catch (error) {
		console.error('Error composing video:', error);
		liveEvents.sendEvent({
			type: 'agent-progress',
			projectId: req.body.projectId,
			phase: 'video-composition',
			progress: 0,
			message: 'Video composition failed',
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
		res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

export {router as agentRoutes};
