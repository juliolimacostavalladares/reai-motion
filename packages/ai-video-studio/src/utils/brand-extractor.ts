import axios from 'axios';
import * as cheerio from 'cheerio';
import type {BrandKit, AgentProgress} from '../types';

interface ProgressCallback {
	(progress: Partial<AgentProgress>): void;
}

function extractColorsFromCSS(
	$: cheerio.CheerioAPI,
): Record<string, string | undefined> {
	const colors: Record<string, string | undefined> = {};

	// Look for common color patterns in CSS
	const styleElements = $('style');
	let cssText = '';

	styleElements.each((_i: number, elem: cheerio.Element) => {
		cssText += $(elem).text();
	});

	// Extract hex colors
	const hexPattern = /#[0-9A-Fa-f]{6}/g;
	const hexColors = cssText.match(hexPattern) || [];

	if (hexColors.length > 0) {
		colors.primary = hexColors[0];
		colors.secondary = hexColors[1] || hexColors[0];
		colors.accent = hexColors[2] || hexColors[0];
	}

	// Look for background colors
	const bgPattern = /background-color:\s*([^;]+)/g;
	const bgMatch = bgPattern.exec(cssText);
	if (bgMatch) {
		colors.background = bgMatch[1].trim();
	}

	return colors;
}

function extractFonts(
	$: cheerio.CheerioAPI,
): Record<string, string | undefined> {
	const fonts: Record<string, string | undefined> = {};

	// Look for font-family in style attributes
	const styleElements = $('[style*="font-family"]');
	if (styleElements.length > 0) {
		const fontFamily = styleElements.first().attr('style');
		if (fontFamily) {
			const match = fontFamily.match(/font-family:\s*([^;]+)/);
			if (match) {
				fonts.body = match[1].trim().split(',')[0].replace(/['"]/g, '');
			}
		}
	}

	// Look for heading fonts
	const headings = $('h1, h2, h3');
	if (headings.length > 0) {
		const headingStyle = headings.first().attr('style');
		if (headingStyle) {
			const match = headingStyle.match(/font-family:\s*([^;]+)/);
			if (match) {
				fonts.heading = match[1].trim().split(',')[0].replace(/['"]/g, '');
			}
		}
	}

	return fonts;
}

function analyzeTone(text: string): string {
	// Simple tone analysis based on keywords
	const tones: string[] = [];

	const keywords: Record<string, string[]> = {
		professional: ['professional', 'enterprise', 'business', 'corporate'],
		creative: ['creative', 'design', 'art', 'innovation'],
		friendly: ['friendly', 'fun', 'happy', 'joy', 'love'],
		technical: ['technical', 'advanced', 'technology', 'development'],
		energetic: ['energy', 'fast', 'dynamic', 'powerful', 'strong'],
	};

	const lowerText = text.toLowerCase();

	for (const [tone, words] of Object.entries(keywords)) {
		const count = words.filter((word) => lowerText.includes(word)).length;
		if (count > 0) {
			tones.push(tone);
		}
	}

	return tones.length > 0 ? tones.join(', ') : 'professional, modern';
}

export async function extractBrand(
	url: string,
	onProgress: ProgressCallback,
): Promise<BrandKit> {
	try {
		onProgress({
			progress: 10,
			message: 'Fetching website...',
		});

		// Fetch website
		const response = await axios.get(url, {timeout: 10000});
		const html = response.data;

		onProgress({
			progress: 30,
			message: 'Analyzing colors...',
		});

		// Parse HTML
		const $ = cheerio.load(html);

		// Extract colors from CSS
		const colors = extractColorsFromCSS($);

		onProgress({
			progress: 60,
			message: 'Extracting fonts...',
		});

		// Extract fonts
		const fonts = extractFonts($);

		onProgress({
			progress: 80,
			message: 'Analyzing tone of voice...',
		});

		// Extract text for tone analysis
		const bodyText = $('body').text().substring(0, 1000);

		// Simple tone analysis (in production, use LLM)
		const tone = analyzeTone(bodyText);

		onProgress({
			progress: 95,
			message: 'Finalizing brand kit...',
		});

		const brandKit: BrandKit = {
			colors: {
				primary: colors.primary || '#0066CC',
				secondary: colors.secondary || '#FF6B35',
				accent: colors.accent || '#F7B801',
				background: colors.background || '#FFFFFF',
				text: colors.text || '#000000',
			},
			fonts: {
				heading: fonts.heading || 'Inter',
				body: fonts.body || 'Open Sans',
			},
			tone,
		};

		return brandKit;
	} catch (error) {
		console.error('Error extracting brand:', error);
		throw new Error(
			`Failed to extract brand: ${error instanceof Error ? error.message : 'Unknown error'}`,
		);
	}
}
