#!/usr/bin/env node

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SOURCE_DIR = join(__dirname, '../notes/05-Library/bolus');
const TARGET_DIR = join(__dirname, 'src/lib/posts');

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
	const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return { metadata: {}, body: content };
	}

	const frontmatterText = match[1];
	const body = content.slice(match[0].length).trim();

	// Simple YAML parser for our specific use case
	const metadata = {};
	let currentKey = null;
	let currentArray = [];

	const lines = frontmatterText.split('\n');
	for (const line of lines) {
		// Check if it's a key-value pair
		const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);
		if (keyValueMatch) {
			// Save previous array if exists
			if (currentKey && currentArray.length > 0) {
				metadata[currentKey] = currentArray;
				currentArray = [];
			}

			const [, key, value] = keyValueMatch;
			currentKey = key;

			if (value) {
				// Direct value
				metadata[key] = value.replace(/^["']|["']$/g, '');
				currentKey = null;
			}
			// else it's likely an array that follows
		} else if (line.trim().startsWith('-')) {
			// Array item
			const value = line.trim().slice(1).trim().replace(/^["']|["']$/g, '');
			currentArray.push(value);
		}
	}

	// Save last array if exists
	if (currentKey && currentArray.length > 0) {
		metadata[currentKey] = currentArray;
	}

	return { metadata, body };
}

/**
 * Generate frontmatter string from metadata object
 */
function generateFrontmatter(metadata) {
	let frontmatter = '---\n';

	for (const [key, value] of Object.entries(metadata)) {
		if (Array.isArray(value)) {
			frontmatter += `${key}:\n`;
			for (const item of value) {
				frontmatter += `  - "${item}"\n`;
			}
		} else {
			frontmatter += `${key}: ${value}\n`;
		}
	}

	frontmatter += '---\n';
	return frontmatter;
}

/**
 * Ensure all required fields are present in metadata
 */
function ensureRequiredFields(metadata, filename, body) {
	const defaults = {
		title: metadata.title || basename(filename, '.md'),
		unit: metadata.unit || 'Portion',
		content: metadata.content || '0',
		category: metadata.category || 'Uncategorized',
		quantities: metadata.quantities || ['1']
	};

	return { ...defaults, ...metadata };
}

/**
 * Sync markdown files from source to target directory
 */
async function syncNotes() {
	try {
		console.log('🔄 Syncing markdown notes...\n');
		console.log(`Source: ${SOURCE_DIR}`);
		console.log(`Target: ${TARGET_DIR}\n`);

		// Ensure target directory exists
		await mkdir(TARGET_DIR, { recursive: true });

		// Read all files from source directory
		const files = await readdir(SOURCE_DIR);
		const markdownFiles = files.filter((file) => file.endsWith('.md'));

		console.log(`Found ${markdownFiles.length} markdown file(s)\n`);

		let syncedCount = 0;
		let skippedCount = 0;

		for (const file of markdownFiles) {
			const sourcePath = join(SOURCE_DIR, file);
			const targetPath = join(TARGET_DIR, file);

			try {
				// Read source file
				const content = await readFile(sourcePath, 'utf-8');

				// Parse frontmatter
				const { metadata, body } = parseFrontmatter(content);

				// Ensure all required fields
				const completeMetadata = ensureRequiredFields(metadata, file, body);

				// Generate new content with complete frontmatter
				const newFrontmatter = generateFrontmatter(completeMetadata);
				const newContent = `${newFrontmatter}\n${body}`;

				// Write to target directory
				await writeFile(targetPath, newContent, 'utf-8');

				console.log(`✅ ${file}`);
				syncedCount++;
			} catch (err) {
				console.error(`❌ ${file}: ${err.message}`);
				skippedCount++;
			}
		}

		console.log(`\n📊 Summary:`);
		console.log(`   Synced: ${syncedCount}`);
		if (skippedCount > 0) {
			console.log(`   Skipped: ${skippedCount}`);
		}
		console.log(`\n✨ Sync complete!`);
	} catch (err) {
		console.error('❌ Error during sync:', err.message);
		process.exit(1);
	}
}

// Run the sync
syncNotes();
