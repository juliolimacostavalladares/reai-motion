// Type definitions for AI Video Studio

export interface BrandKit {
	colors: {
		primary: string;
		secondary: string;
		accent: string;
		background?: string;
		text?: string;
	};
	fonts: {
		heading: string;
		body: string;
	};
	tone: string;
	logo?: string; // base64 encoded
}

export interface VideoScene {
	id: string;
	duration: number; // in seconds
	text: string;
	voiceOver?: string;
	visualDescription: string;
	layout?: 'centered' | 'left' | 'right' | 'split';
	elements?: SceneElement[];
}

export interface SceneElement {
	type: 'text' | 'image' | 'shape' | 'video';
	content: string;
	animation?: 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'scale' | 'none';
	style?: Record<string, any>;
	position?: {
		x: number;
		y: number;
	};
}

export interface VideoScript {
	scenes: VideoScene[];
	totalDuration: number;
	musicStyle?: string;
	pacing: 'slow' | 'medium' | 'fast';
}

export interface Storyboard {
	scenes: Array<{
		id: string;
		thumbnail?: string; // base64 encoded
		layout: string;
		elements: SceneElement[];
	}>;
}

export interface VideoConfig {
	id: string;
	name: string;
	brandKit: BrandKit;
	script: VideoScript;
	storyboard: Storyboard;
	template: 'marketing' | 'explainer' | 'social-media' | 'custom';
	format: 'mp4' | 'webm' | 'gif';
	quality: 'high' | 'medium' | 'low';
	width: number;
	height: number;
	fps: number;
}

export interface Project {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	status:
		| 'draft'
		| 'generating'
		| 'ready'
		| 'rendering'
		| 'completed'
		| 'error';
	currentStep: 'brand' | 'script' | 'storyboard' | 'preview' | 'render';
	brandKit?: BrandKit;
	script?: VideoScript;
	storyboard?: Storyboard;
	videoConfig?: VideoConfig;
	renderOutput?: string; // path to rendered video
	error?: string;
}

export interface AgentProgress {
	phase:
		| 'brand-extraction'
		| 'script-generation'
		| 'storyboard-generation'
		| 'video-composition';
	progress: number; // 0-100
	message: string;
	status: 'idle' | 'running' | 'completed' | 'error';
	error?: string;
}

export interface Questionnaire {
	videoGoal: string;
	targetAudience: string;
	duration: number; // in seconds
	mainMessage: string;
	callToAction?: string;
	additionalNotes?: string;
}

export interface MCPToolRequest {
	name: string;
	arguments: Record<string, any>;
}

export interface MCPToolResponse {
	success: boolean;
	data?: any;
	error?: string;
}
