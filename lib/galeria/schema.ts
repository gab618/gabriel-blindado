import { z } from 'zod';

const SLUG_REGEX = /^[a-z0-9-]+$/;
const RELATIVE_KEY_REGEX = /^[a-z0-9/_-]+\.(webp|avif|jpg|png)$/;

export const GaleriaItemSchema = z.object({
  id: z
    .string()
    .min(1, 'id não pode ser vazio')
    .regex(SLUG_REGEX, 'id deve conter apenas letras minúsculas, números e hífens'),
  title: z
    .string()
    .min(1, 'title não pode ser vazio')
    .max(120, 'title muito longo (máx. 120 caracteres)'),
  description: z
    .string()
    .max(500, 'description muito longa (máx. 500 caracteres)')
    .optional(),
  date: z.coerce.date(),
  src: z
    .string()
    .regex(
      RELATIVE_KEY_REGEX,
      'src deve ser uma chave relativa no bucket (ex: "desenhos/sonic.webp"), sem http(s):// nem barras iniciais'
    )
    .refine(
      (val) => !val.includes('..') && !val.startsWith('/'),
      'src não pode conter ".." nem começar com "/"'
    ),
  width: z.number().int('width deve ser inteiro').positive('width deve ser positivo'),
  height: z.number().int('height deve ser inteiro').positive('height deve ser positivo'),
  medium: z.string().max(80, 'medium muito longo (máx. 80 caracteres)').optional(),
  blurDataURL: z
    .string()
    .startsWith('data:image/', 'blurDataURL deve começar com "data:image/"')
    .optional(),
  tags: z
    .array(z.string().regex(SLUG_REGEX, 'tags devem conter apenas letras minúsculas, números e hífens'))
    .default([]),
});

export type GaleriaItemRaw = z.infer<typeof GaleriaItemSchema>;

export const GaleriaTemaSchema = z.object({
  slug: z
    .string()
    .min(1, 'slug não pode ser vazio')
    .regex(SLUG_REGEX, 'slug deve conter apenas letras minúsculas, números e hífens'),
  title: z
    .string()
    .min(1, 'title não pode ser vazio')
    .max(80, 'title muito longo (máx. 80 caracteres)'),
  description: z
    .string()
    .max(300, 'description muito longa (máx. 300 caracteres)')
    .optional(),
  order: z.number().int('order deve ser inteiro').default(0),
  cover: z
    .string()
    .regex(SLUG_REGEX, 'cover deve ser o id de um item do tema')
    .optional(),
});

export type GaleriaTemaRaw = z.infer<typeof GaleriaTemaSchema>;
