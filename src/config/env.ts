import { z } from "zod";

const envSchema = z.object({
	VITE_APP_NAME: z.string().trim().min(1).default("Estante Local"),
});

export const env = envSchema.parse(import.meta.env);
