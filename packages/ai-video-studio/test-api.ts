#!/usr/bin/env bun

/**
 * Quick test script for AI Video Studio
 * Tests all agent endpoints
 */

import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

async function testHealth() {
	console.log('🔍 Testing health endpoint...');
	try {
		const response = await axios.get(`${API_BASE}/health`);
		console.log('✅ Health check passed:', response.data);
		return true;
	} catch (error) {
		console.error('❌ Health check failed:', error);
		return false;
	}
}

async function testCreateProject() {
	console.log('\n🔍 Testing project creation...');
	try {
		const response = await axios.post(`${API_BASE}/projects`, {
			name: 'Test Project - ' + new Date().toISOString(),
		});
		console.log('✅ Project created:', response.data.id);
		return response.data.id;
	} catch (error) {
		console.error('❌ Project creation failed:', error);
		return null;
	}
}

async function testBrandExtraction(projectId: string) {
	console.log('\n🔍 Testing brand extraction...');
	try {
		const response = await axios.post(`${API_BASE}/agents/extract-brand`, {
			url: 'https://remotion.dev',
			projectId,
		});
		console.log('✅ Brand extracted:', response.data.data);
		return response.data.data;
	} catch (error) {
		console.error('❌ Brand extraction failed:', error);
		return null;
	}
}

async function testScriptGeneration(projectId: string, brandKit: any) {
	console.log('\n🔍 Testing script generation...');
	try {
		const response = await axios.post(`${API_BASE}/agents/generate-script`, {
			brandKit,
			questionnaire: {
				videoGoal: 'Explain Remotion framework',
				targetAudience: 'Developers',
				duration: 30,
				mainMessage: 'Create videos with React',
				callToAction: 'Try Remotion today',
			},
			projectId,
		});
		console.log('✅ Script generated:', response.data.data);
		return response.data.data;
	} catch (error) {
		console.error('❌ Script generation failed:', error);
		return null;
	}
}

async function testStoryboardGeneration(
	projectId: string,
	script: any,
	brandKit: any,
) {
	console.log('\n🔍 Testing storyboard generation...');
	try {
		const response = await axios.post(
			`${API_BASE}/agents/generate-storyboard`,
			{
				script,
				brandKit,
				projectId,
			},
		);
		console.log('✅ Storyboard generated:', response.data.data);
		return response.data.data;
	} catch (error) {
		console.error('❌ Storyboard generation failed:', error);
		return null;
	}
}

async function testVideoComposition(
	projectId: string,
	storyboard: any,
	brandKit: any,
) {
	console.log('\n🔍 Testing video composition...');
	try {
		const response = await axios.post(`${API_BASE}/agents/compose-video`, {
			storyboard,
			template: 'marketing',
			brandKit,
			projectId,
		});
		console.log('✅ Video composed:', response.data.data);
		return response.data.data;
	} catch (error) {
		console.error('❌ Video composition failed:', error);
		return null;
	}
}

async function testGetProject(projectId: string) {
	console.log('\n🔍 Testing get project...');
	try {
		const response = await axios.get(`${API_BASE}/projects/${projectId}`);
		console.log('✅ Project retrieved:', response.data);
		return response.data;
	} catch (error) {
		console.error('❌ Get project failed:', error);
		return null;
	}
}

async function runTests() {
	console.log('🚀 Starting AI Video Studio Tests\n');
	console.log('=' .repeat(50));

	// Test 1: Health check
	const healthOk = await testHealth();
	if (!healthOk) {
		console.error('\n❌ Backend is not running. Start it with: bun run dev:backend');
		process.exit(1);
	}

	// Test 2: Create project
	const projectId = await testCreateProject();
	if (!projectId) {
		console.error('\n❌ Failed to create project');
		process.exit(1);
	}

	// Test 3: Extract brand
	const brandKit = await testBrandExtraction(projectId);
	if (!brandKit) {
		console.error('\n❌ Failed to extract brand');
		process.exit(1);
	}

	// Test 4: Generate script
	const script = await testScriptGeneration(projectId, brandKit);
	if (!script) {
		console.error('\n❌ Failed to generate script');
		process.exit(1);
	}

	// Test 5: Generate storyboard
	const storyboard = await testStoryboardGeneration(projectId, script, brandKit);
	if (!storyboard) {
		console.error('\n❌ Failed to generate storyboard');
		process.exit(1);
	}

	// Test 6: Compose video
	const composition = await testVideoComposition(projectId, storyboard, brandKit);
	if (!composition) {
		console.error('\n❌ Failed to compose video');
		process.exit(1);
	}

	// Test 7: Get project
	const project = await testGetProject(projectId);
	if (!project) {
		console.error('\n❌ Failed to get project');
		process.exit(1);
	}

	console.log('\n' + '='.repeat(50));
	console.log('✅ All tests passed!');
	console.log(`\n📁 Project ID: ${projectId}`);
	console.log(`📂 Project files: .remotion-ai-studio/projects/${projectId}/`);
	console.log(`🎬 Composition: ${composition.compositionPath}`);
	console.log(`👁️  Preview: ${composition.previewUrl}`);
	console.log('\n🎉 AI Video Studio is working correctly!');
}

// Run tests
runTests().catch((error) => {
	console.error('\n💥 Test suite failed:', error);
	process.exit(1);
});
