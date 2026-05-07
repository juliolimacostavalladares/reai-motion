import type {
	BrandKit,
	VideoScript,
	Questionnaire,
	AgentProgress,
} from '../types';

interface ProgressCallback {
	(progress: Partial<AgentProgress>): void;
}

export async function generateScript(
	brandKit: BrandKit,
	questionnaire: Questionnaire,
	onProgress: ProgressCallback,
): Promise<VideoScript> {
	try {
		onProgress({
			progress: 10,
			message: 'Analyzing questionnaire...',
		});

		const {videoGoal, targetAudience, duration, mainMessage, callToAction} =
			questionnaire;

		onProgress({
			progress: 30,
			message: 'Generating scenes...',
		});

		// Calculate number of scenes based on duration
		const numScenes = Math.ceil(duration / 5); // ~5 seconds per scene
		const sceneDuration = Math.floor(duration / numScenes);

		onProgress({
			progress: 50,
			message: 'Creating script content...',
		});

		// Generate scenes
		const scenes = generateScenes(
			videoGoal,
			mainMessage,
			callToAction,
			numScenes,
			sceneDuration,
			brandKit.tone,
		);

		onProgress({
			progress: 80,
			message: 'Finalizing script...',
		});

		const script: VideoScript = {
			scenes,
			totalDuration: duration,
			musicStyle: determineMusicStyle(brandKit.tone),
			pacing: determinePacing(duration),
		};

		return script;
	} catch (error) {
		console.error('Error generating script:', error);
		throw new Error(
			`Failed to generate script: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
}

function generateScenes(
	videoGoal: string,
	mainMessage: string,
	callToAction: string | undefined,
	numScenes: number,
	sceneDuration: number,
	tone: string,
): any[] {
	const scenes = [];

	// Scene 1: Hook/Introduction
	scenes.push({
		id: 'scene-1',
		duration: sceneDuration,
		text: 'Introducing our solution',
		voiceOver: `Welcome. Today we're sharing something special.`,
		visualDescription: 'Logo animation with fade-in effect',
		layout: 'centered',
	});

	// Middle scenes: Content
	const middleScenes = numScenes - 2;
	for (let i = 0; i < middleScenes; i++) {
		scenes.push({
			id: `scene-${i + 2}`,
			duration: sceneDuration,
			text: mainMessage,
			voiceOver: `Here's what makes us different: ${mainMessage}`,
			visualDescription: `Key benefit ${i + 1} visualization`,
			layout: i % 2 === 0 ? 'left' : 'right',
		});
	}

	// Last scene: Call to action
	if (callToAction) {
		scenes.push({
			id: `scene-${numScenes}`,
			duration: sceneDuration,
			text: callToAction,
			voiceOver: callToAction,
			visualDescription: 'Call-to-action with button or link',
			layout: 'centered',
		});
	}

	return scenes;
}

function determineMusicStyle(tone: string): string {
	const toneMap: Record<string, string> = {
		professional: 'corporate, ambient',
		creative: 'upbeat, modern',
		friendly: 'cheerful, light',
		technical: 'electronic, futuristic',
		energetic: 'dynamic, powerful',
	};

	for (const [key, value] of Object.entries(toneMap)) {
		if (tone.includes(key)) {
			return value;
		}
	}

	return 'modern, professional';
}

function determinePacing(duration: number): 'slow' | 'medium' | 'fast' {
	if (duration <= 15) return 'fast';
	if (duration <= 45) return 'medium';
	return 'slow';
}
