import { z } from 'zod';

export const PostFrontmatterSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(120, 'Title too long (max 120 chars)'),
  description: z.string().max(200, 'Description too long (max 200 chars)').optional(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z
    .array(
      z
        .string()
        .regex(/^[a-z0-9-]+$/, 'Tags must be lowercase alphanumeric and hyphen only')
    )
    .default([]),
  draft: z.boolean().default(false),
  status: z.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
  aliases: z.array(z.string()).default([]),
  translationKey: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
