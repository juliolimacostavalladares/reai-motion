#!/usr/bin/env bun

/**
 * Test MCP Server locally
 * This simulates what Claude Code does when calling MCP tools
 */

import {spawn} from 'child_process';

interface MCPRequest {
	jsonrpc: string;
	id: number;
	method: string;
	params?: any;
}

interface MCPResponse {
	jsonrpc: string;
	id: number;
	result?: any;
	error?: any;
}

class MCPClient {
	private process: any;
	private requestId = 1;

	constructor() {
		this.process = spawn('bun', ['src/mcp/server.ts'], {
			cwd: process.cwd(),
			stdio: ['pipe', 'pipe', 'inherit'],
		});
	}

	async sendRequest(method: string, params?: any): Promise<any> {
		return new Promise((resolve, reject) => {
			const request: MCPRequest = {
				jsonrpc: '2.0',
				id: this.requestId++,
				method,
				params,
			};

			let responseData = '';

			this.process.stdout.on('data', (data: Buffer) => {
				responseData += data.toString();
				try {
					const response: MCPResponse = JSON.parse(responseData);
					if (response.error) {
						reject(new Error(response.error.message));
					} else {
						resolve(response.result);
					}
				} catch (e) {
					// Not complete JSON yet, wait for more data
				}
			});

			this.process.stdin.write(JSON.stringify(request) + '\n');
		});
	}

	close() {
		this.process.kill();
	}
}

async function testMCPServer() {
	console.log('🚀 Testing MCP Server\n');
	console.log('='.repeat(50));

	const client = new MCPClient();

	try {
		// Test 1: List tools
		console.log('\n🔍 Test 1: List available tools');
		const tools = await client.sendRequest('tools/list');
		console.log('✅ Available tools:', tools.tools.map((t: any) => t.name));

		// Test 2: Extract brand
		console.log('\n🔍 Test 2: Extract brand from website');
		const brandKit = await client.sendRequest('tools/call', {
			name: 'extract_brand',
			arguments: {
				url: 'https://remotion.dev',
				sessionId: 'test-session-1',
			},
		});
		console.log('✅ Brand extracted:', JSON.parse(brandKit.content[0].text));

		// Test 3: Generate script
		console.log('\n🔍 Test 3: Generate script');
		const script = await client.sendRequest('tools/call', {
			name: 'generate_script',
			arguments: {
				brandKit: JSON.parse(brandKit.content[0].text),
				questionnaire: {
					videoGoal: 'Explain Remotion',
					targetAudience: 'Developers',
					duration: 30,
					mainMessage: 'Create videos with React',
					callToAction: 'Try it now',
				},
				sessionId: 'test-session-1',
			},
		});
		console.log('✅ Script generated:', JSON.parse(script.content[0].text));

		console.log('\n' + '='.repeat(50));
		console.log('✅ All MCP tests passed!');
	} catch (error) {
		console.error('\n❌ MCP test failed:', error);
		process.exit(1);
	} finally {
		client.close();
	}
}

// Run tests
testMCPServer().catch((error) => {
	console.error('\n💥 MCP test suite failed:', error);
	process.exit(1);
});
