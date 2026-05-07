import {Router} from 'express';
import {v4 as uuidv4} from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import type {Project} from '../../types';

const router = Router();
const PROJECTS_DIR = path.join(process.cwd(), '.remotion-ai-studio', 'projects');

// Ensure projects directory exists
async function ensureProjectsDir() {
	await fs.mkdir(PROJECTS_DIR, {recursive: true});
}

// Get all projects
router.get('/', async (req, res) => {
	try {
		await ensureProjectsDir();
		const files = await fs.readdir(PROJECTS_DIR);
		const projects: Project[] = [];

		for (const file of files) {
			if (file.endsWith('.json')) {
				const content = await fs.readFile(
					path.join(PROJECTS_DIR, file),
					'utf-8',
				);
				projects.push(JSON.parse(content));
			}
		}

		// Sort by updatedAt descending
		projects.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
		);

		res.json(projects);
	} catch (error) {
		console.error('Error fetching projects:', error);
		res.status(500).json({error: 'Failed to fetch projects'});
	}
});

// Get single project
router.get('/:id', async (req, res) => {
	try {
		const {id} = req.params;
		const projectPath = path.join(PROJECTS_DIR, `${id}.json`);
		const content = await fs.readFile(projectPath, 'utf-8');
		const project: Project = JSON.parse(content);
		res.json(project);
	} catch (error) {
		console.error('Error fetching project:', error);
		res.status(404).json({error: 'Project not found'});
	}
});

// Create new project
router.post('/', async (req, res) => {
	try {
		await ensureProjectsDir();
		const {name} = req.body;

		const project: Project = {
			id: uuidv4(),
			name: name || 'Untitled Project',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			status: 'draft',
			currentStep: 'brand',
		};

		const projectPath = path.join(PROJECTS_DIR, `${project.id}.json`);
		await fs.writeFile(projectPath, JSON.stringify(project, null, 2));

		// Create project directory
		const projectDir = path.join(PROJECTS_DIR, project.id);
		await fs.mkdir(projectDir, {recursive: true});

		res.status(201).json(project);
	} catch (error) {
		console.error('Error creating project:', error);
		res.status(500).json({error: 'Failed to create project'});
	}
});

// Update project
router.patch('/:id', async (req, res) => {
	try {
		const {id} = req.params;
		const updates = req.body;

		const projectPath = path.join(PROJECTS_DIR, `${id}.json`);
		const content = await fs.readFile(projectPath, 'utf-8');
		const project: Project = JSON.parse(content);

		const updatedProject: Project = {
			...project,
			...updates,
			updatedAt: new Date().toISOString(),
		};

		await fs.writeFile(projectPath, JSON.stringify(updatedProject, null, 2));

		res.json(updatedProject);
	} catch (error) {
		console.error('Error updating project:', error);
		res.status(500).json({error: 'Failed to update project'});
	}
});

// Delete project
router.delete('/:id', async (req, res) => {
	try {
		const {id} = req.params;
		const projectPath = path.join(PROJECTS_DIR, `${id}.json`);
		await fs.unlink(projectPath);

		// Delete project directory
		const projectDir = path.join(PROJECTS_DIR, id);
		await fs.rm(projectDir, {recursive: true, force: true});

		res.status(204).send();
	} catch (error) {
		console.error('Error deleting project:', error);
		res.status(500).json({error: 'Failed to delete project'});
	}
});

export {router as projectRoutes};
