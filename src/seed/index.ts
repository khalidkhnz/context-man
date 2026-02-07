import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { projectService, documentService, skillService } from '../services/index.js';
import { Project } from '../models/project.model.js';
import { DocumentType } from '../types/document.types.js';
import { SkillType } from '../types/skill.types.js';

// Import all seed data
import { backendTechstacks } from './techstacks/backend.js';
import { frontendTechstacks } from './techstacks/frontend.js';
import { fullstackTechstacks } from './techstacks/fullstack.js';
import { databaseTechstacks } from './techstacks/database.js';
import { devopsTechstacks } from './techstacks/devops.js';
import { backendSkills } from './skills/backend.js';
import { frontendSkills } from './skills/frontend.js';
import { databaseSkills } from './skills/database.js';
import { devopsSkills } from './skills/devops.js';
import { generalSkills } from './skills/general.js';

interface SeedTechstack {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  techstack: string;
  codingGuidelines?: string;
}

interface SeedSkill {
  projectSlug: string; // 'all' means add to all projects
  name: string;
  type: SkillType;
  description: string;
  content: string;
  tags: string[];
}

async function seedProject(techstack: SeedTechstack) {
  console.log(`  Creating project: ${techstack.name}...`);

  // Check if project exists
  const existing = await projectService.findBySlug(techstack.slug);
  if (existing) {
    console.log(`    Project ${techstack.slug} already exists, skipping...`);
    return existing;
  }

  const project = await projectService.create({
    slug: techstack.slug,
    name: techstack.name,
    description: techstack.description,
    tags: techstack.tags,
    isTemplate: true,
  });

  if (!project) {
    console.error(`    Failed to create project: ${techstack.slug}`);
    return null;
  }

  // Add TECHSTACK document
  await documentService.create(techstack.slug, {
    type: DocumentType.TECHSTACK,
    title: 'TECHSTACK',
    content: techstack.techstack,
    tags: techstack.tags,
    changeNote: 'Seeded',
  });

  // Add CODING_GUIDELINES if provided
  if (techstack.codingGuidelines) {
    await documentService.create(techstack.slug, {
      type: DocumentType.CODING_GUIDELINES,
      title: 'CODING_GUIDELINES',
      content: techstack.codingGuidelines,
      tags: techstack.tags,
      changeNote: 'Seeded',
    });
  }

  console.log(`    ✓ Created ${techstack.slug}`);
  return project;
}

async function seedSkill(skill: SeedSkill, projectSlugs: string[]) {
  const targetSlugs = skill.projectSlug === 'all' ? projectSlugs : [skill.projectSlug];

  for (const slug of targetSlugs) {
    // Check if skill exists
    const existing = await skillService.findByProjectAndName(slug, skill.name);
    if (existing) {
      continue; // Skip if exists
    }

    await skillService.create(slug, {
      name: skill.name,
      type: skill.type,
      description: skill.description,
      content: skill.content,
      tags: skill.tags,
      changeNote: 'Seeded',
    });
  }
}

export async function runSeed() {
  console.log('🌱 Starting seed...\n');

  await connectDatabase();

  // Collect all techstacks (needed early for migration)
  const allTechstacks: SeedTechstack[] = [
    ...backendTechstacks,
    ...frontendTechstacks,
    ...fullstackTechstacks,
    ...databaseTechstacks,
    ...devopsTechstacks,
  ];

  // Collect all skills
  const allSkills: SeedSkill[] = [
    ...backendSkills,
    ...frontendSkills,
    ...databaseSkills,
    ...devopsSkills,
    ...generalSkills,
  ];

  // Mark any existing seeded projects as templates (migration for existing data)
  const allTechstackSlugs = allTechstacks.map(t => t.slug);
  await Project.updateMany(
    { slug: { $in: allTechstackSlugs }, isTemplate: { $ne: true } },
    { $set: { isTemplate: true } }
  );
  console.log('  Marked existing seeded projects as templates\n');

  console.log('📦 Creating projects with techstacks...\n');
  const createdSlugs: string[] = [];

  for (const techstack of allTechstacks) {
    const project = await seedProject(techstack);
    if (project) {
      createdSlugs.push(techstack.slug);
    }
  }

  console.log(`\n✓ Created ${createdSlugs.length} projects\n`);

  console.log('🛠️  Adding skills...\n');
  let skillCount = 0;

  for (const skill of allSkills) {
    await seedSkill(skill, createdSlugs);
    skillCount++;
    if (skillCount % 10 === 0) {
      console.log(`  Added ${skillCount} skills...`);
    }
  }

  console.log(`\n✓ Added ${skillCount} skills\n`);

  await disconnectDatabase();
  console.log('🌱 Seed completed!\n');
}

// Run if called directly
runSeed().catch(console.error);
