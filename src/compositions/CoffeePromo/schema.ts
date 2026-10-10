import { z } from "zod";

/** Editable promo copy. Change it in the Studio sidebar or with --props. */
export const coffeePromoSchema = z.object({
  shopName: z.string(),
  tagline: z.string(),
  lines: z.array(z.string()).length(3),
  offer: z.string(),
  cta: z.string(),
  address: z.string(),
});

export type CoffeePromoProps = z.infer<typeof coffeePromoSchema>;
