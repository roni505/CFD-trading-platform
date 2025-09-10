import z from "zod";

export const OnboardingSchema = z.object({
    email: z.email(),
})