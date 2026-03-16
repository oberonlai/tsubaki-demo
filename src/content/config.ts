import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Codotx Team'),
    image: z.object({ src: z.string(), alt: z.string() }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
