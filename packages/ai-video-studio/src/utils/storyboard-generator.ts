import type {VideoScript, BrandKit, Storyboard, AgentProgress} from '../types';

interface ProgressCallback {
	(progress: Partial<AgentProgress>): void;
}

interface SceneElement {
	type: string;
	content: string;
	animation?: string;
	style: Record<string, string | number>;
	position?: {x: number; y: number};
}

interface SceneData {
	id: string;
	text: string;
	layout?: string;
}

function generateThumbnailPlaceholder(color: string): string {
	// Generate a simple SVG placeholder as base64
	const svg = `
    <svg width="200" height="112" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="112" fill="${color}"/>
      <text x="100" y="56" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle">
        Scene Thumbnail
      </text>
    </svg>
  `;

	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function generateElements(
	scene: SceneData,
	brandKit: BrandKit,
): SceneElement[] {
	const elements: SceneElement[] = [];

	// Add background
	elements.push({
		type: 'shape',
		content: 'rectangle',
		style: {
			width: '100%',
			height: '100%',
			fill: brandKit.colors.background || '#FFFFFF',
		},
	});

	// Add text
	elements.push({
		type: 'text',
		content: scene.text,
		animation: 'fadeIn',
		style: {
			fontSize: 48,
			fontFamily: brandKit.fonts.heading,
			color: brandKit.colors.text || '#000000',
			fontWeight: 'bold',
		},
		position: {x: 50, y: 40},
	});

	// Add visual description as placeholder
	elements.push({
		type: 'image',
		content: 'placeholder',
		animation: 'slideIn',
		style: {
			width: 400,
			height: 300,
			opacity: 0.8,
		},
		position: {x: 50, y: 55},
	});

	return elements;
}

export function generateStoryboard(
	script: VideoScript,
	brandKit: BrandKit,
	onProgress: ProgressCallback,
): Storyboard {
	try {
		onProgress({
			progress: 10,
			message: 'Analyzing script...',
		});

		onProgress({
			progress: 30,
			message: 'Creating visual descriptions...',
		});

		const scenes = script.scenes.map((scene, index) => {
			onProgress({
				progress: 30 + (index / script.scenes.length) * 60,
				message: `Processing scene ${index + 1} of ${script.scenes.length}...`,
			});

			return {
				id: scene.id,
				thumbnail: generateThumbnailPlaceholder(brandKit.colors.primary),
				layout: scene.layout || 'centered',
				elements: generateElements(scene, brandKit),
			};
		});

		onProgress({
			progress: 95,
			message: 'Finalizing storyboard...',
		});

		const storyboard: Storyboard = {
			scenes,
		};

		return storyboard;
	} catch (error) {
		console.error('Error generating storyboard:', error);
		throw new Error(
			`Failed to generate storyboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
}
