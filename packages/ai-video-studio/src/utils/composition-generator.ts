import fs from 'fs/promises';
import path from 'path';
import type {Storyboard, BrandKit, AgentProgress} from '../types';

interface ProgressCallback {
	(progress: Partial<AgentProgress>): void;
}

export async function composeVideo(
	storyboard: Storyboard,
	template: string,
	brandKit: BrandKit,
	projectId: string,
	onProgress: ProgressCallback,
): Promise<{compositionPath: string; previewUrl: string}> {
	try {
		onProgress({
			progress: 10,
			message: 'Preparing composition...',
		});

		const projectDir = path.join(
			process.cwd(),
			'.remotion-ai-studio',
			'projects',
			projectId,
		);
		await fs.mkdir(projectDir, {recursive: true});

		onProgress({
			progress: 30,
			message: 'Generating Remotion code...',
		});

		// Generate composition code
		const compositionCode = generateCompositionCode(
			storyboard,
			brandKit,
			template,
		);

		onProgress({
			progress: 60,
			message: 'Saving composition file...',
		});

		// Save composition file
		const compositionPath = path.join(projectDir, 'composition.tsx');
		await fs.writeFile(compositionPath, compositionCode);

		onProgress({
			progress: 80,
			message: 'Setting up preview...',
		});

		// Save config for preview
		const configPath = path.join(projectDir, 'config.json');
		await fs.writeFile(
			configPath,
			JSON.stringify(
				{
					template,
					brandKit,
					storyboard,
					compositionPath,
				},
				null,
				2,
			),
		);

		onProgress({
			progress: 95,
			message: 'Finalizing...',
		});

		return {
			compositionPath,
			previewUrl: `/preview/${projectId}`,
		};
	} catch (error) {
		console.error('Error composing video:', error);
		throw new Error(
			`Failed to compose video: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
}

function generateCompositionCode(
	storyboard: Storyboard,
	brandKit: BrandKit,
	template: string,
): string {
	const scenesCode = storyboard.scenes
		.map(
			(scene, index) => `
  <Sequence from={${index * 30}} durationInFrames={90}>
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '${brandKit.colors.background || '#FFFFFF'}',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <h1 style={{
        fontSize: 48,
        fontFamily: '${brandKit.fonts.heading}',
        color: '${brandKit.colors.text || '#000000'}',
        margin: 0,
      }}>
        ${scene.elements[1]?.content || 'Scene ' + (index + 1)}
      </h1>
      <p style={{
        fontSize: 24,
        fontFamily: '${brandKit.fonts.body}',
        color: '${brandKit.colors.secondary}',
        marginTop: 20,
      }}>
        ${scene.elements[2]?.content || 'Visual content'}
      </p>
    </div>
  </Sequence>
`,
		)
		.join('\n');

	return `import React from 'react';
import {Composition, Sequence, AbsoluteFill} from 'remotion';

export const AIVideoComposition: React.FC<{brandKit: any}> = ({brandKit}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '${brandKit.colors.background || '#FFFFFF'}'}}>
      ${scenesCode}
    </AbsoluteFill>
  );
};

export const registerComposition = () => {
  return (
    <Composition
      id="ai-video"
      component={AIVideoComposition}
      durationInFrames={${storyboard.scenes.length * 90}}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{brandKit: ${JSON.stringify(brandKit)}}}
    />
  );
};
`;
}
