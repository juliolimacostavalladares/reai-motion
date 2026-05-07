#!/usr/bin/env node

/**
 * MCP Server for AI Video Studio
 * This server exposes tools for Claude Code to interact with the video creation agents
 */

import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {extractBrand} from '../utils/brand-extractor.js';
import {composeVideo} from '../utils/composition-generator.js';
import {generateScript} from '../utils/script-generator.js';
import {generateStoryboard} from '../utils/storyboard-generator.js';

const server = new Server(
	{
		name: 'remotion-ai-video-studio',
		version: '1.0.0',
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [
			{
				name: 'extract_brand',
				description:
					'Extract brand colors, fonts, and tone from a website URL. Returns a BrandKit object with primary/secondary/accent colors, heading/body fonts, and tone of voice.',
				inputSchema: {
					type: 'object',
					properties: {
						url: {
							type: 'string',
							description: 'The website URL to analyze',
						},
						sessionId: {
							type: 'string',
							description: 'Unique session identifier for tracking progress',
						},
					},
					required: ['url', 'sessionId'],
				},
			},
			{
				name: 'generate_script',
				description:
					'Generate a video script based on brand kit and questionnaire answers. Creates scenes with text, voice-over, and visual descriptions.',
				inputSchema: {
					type: 'object',
					properties: {
						brandKit: {
							type: 'object',
							description: 'Brand kit from extract_brand',
						},
						questionnaire: {
							type: 'object',
							description:
								'Answers to video questions (goal, audience, duration, message, CTA)',
							properties: {
								videoGoal: {type: 'string'},
								targetAudience: {type: 'string'},
								duration: {type: 'number'},
								mainMessage: {type: 'string'},
								callToAction: {type: 'string'},
							},
							required: [
								'videoGoal',
								'targetAudience',
								'duration',
								'mainMessage',
							],
						},
						sessionId: {
							type: 'string',
							description: 'Unique session identifier',
						},
					},
					required: ['brandKit', 'questionnaire', 'sessionId'],
				},
			},
			{
				name: 'generate_storyboard',
				description:
					'Create a visual storyboard from the script. Generates thumbnails, layouts, and scene elements.',
				inputSchema: {
					type: 'object',
					properties: {
						script: {
							type: 'object',
							description: 'Video script from generate_script',
						},
						brandKit: {
							type: 'object',
							description: 'Brand kit for styling',
						},
						sessionId: {
							type: 'string',
							description: 'Unique session identifier',
						},
					},
					required: ['script', 'brandKit', 'sessionId'],
				},
			},
			{
				name: 'compose_video',
				description:
					'Generate Remotion composition code from storyboard. Creates a .tsx file with the video composition.',
				inputSchema: {
					type: 'object',
					properties: {
						storyboard: {
							type: 'object',
							description: 'Storyboard from generate_storyboard',
						},
						template: {
							type: 'string',
							enum: ['marketing', 'explainer', 'social-media', 'custom'],
							description: 'Template to use for composition',
						},
						brandKit: {
							type: 'object',
							description: 'Brand kit for styling',
						},
						projectId: {
							type: 'string',
							description: 'Project ID for saving files',
						},
						sessionId: {
							type: 'string',
							description: 'Unique session identifier',
						},
					},
					required: [
						'storyboard',
						'template',
						'brandKit',
						'projectId',
						'sessionId',
					],
				},
			},
		],
	};
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const {name, arguments: args} = request.params;

	try {
		switch (name) {
			case 'extract_brand': {
				if (!args || typeof args !== 'object') {
					throw new Error('Invalid arguments');
				}

				const {url} = args as {url: string};
				if (!url || typeof url !== 'string') {
					throw new Error('url is required and must be a string');
				}

				const progressCallback = (progress: any) => {
					console.error(
						`[extract_brand] ${progress.progress}% - ${progress.message}`,
					);
				};

				const brandKit = await extractBrand(url, progressCallback);

				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(brandKit, null, 2),
						},
					],
				};
			}

			case 'generate_script': {
				if (!args || typeof args !== 'object') {
					throw new Error('Invalid arguments');
				}

				const {brandKit, questionnaire} = args as {
					brandKit: any;
					questionnaire: any;
				};
				if (!brandKit) {
					throw new Error('brandKit is required');
				}

				if (!questionnaire) {
					throw new Error('questionnaire is required');
				}

				const progressCallback = (progress: any) => {
					console.error(
						`[generate_script] ${progress.progress}% - ${progress.message}`,
					);
				};

				const script = await generateScript(
					brandKit,
					questionnaire,
					progressCallback,
				);

				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(script, null, 2),
						},
					],
				};
			}

			case 'generate_storyboard': {
				if (!args || typeof args !== 'object') {
					throw new Error('Invalid arguments');
				}

				const {script, brandKit} = args as {script: any; brandKit: any};
				if (!script) {
					throw new Error('script is required');
				}

				if (!brandKit) {
					throw new Error('brandKit is required');
				}

				const progressCallback = (progress: any) => {
					console.error(
						`[generate_storyboard] ${progress.progress}% - ${progress.message}`,
					);
				};

				const storyboard = await generateStoryboard(
					script,
					brandKit,
					progressCallback,
				);

				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(storyboard, null, 2),
						},
					],
				};
			}

			case 'compose_video': {
				if (!args || typeof args !== 'object') {
					throw new Error('Invalid arguments');
				}

				const {storyboard, template, brandKit, projectId} = args as {
					storyboard: any;
					template: string;
					brandKit: any;
					projectId: string;
				};
				if (!storyboard) {
					throw new Error('storyboard is required');
				}

				if (!template) {
					throw new Error('template is required');
				}

				if (!brandKit) {
					throw new Error('brandKit is required');
				}

				if (!projectId) {
					throw new Error('projectId is required');
				}

				const progressCallback = (progress: any) => {
					console.error(
						`[compose_video] ${progress.progress}% - ${progress.message}`,
					);
				};

				const result = await composeVideo(
					storyboard,
					template,
					brandKit,
					projectId,
					progressCallback,
				);

				return {
					content: [
						{
							type: 'text',
							text: JSON.stringify(result, null, 2),
						},
					],
				};
			}

			default:
				throw new Error(`Unknown tool: ${name}`);
		}
	} catch (error) {
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify({
						error: error instanceof Error ? error.message : 'Unknown error',
					}),
				},
			],
			isError: true,
		};
	}
});

// Start server
async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('AI Video Studio MCP Server running on stdio');
}

main().catch((error) => {
	console.error('Fatal error:', error);
	process.exit(1);
});
