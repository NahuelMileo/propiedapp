import z from "zod";

export const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres",
    })
    .max(50, {
      message: "El nombre debe tener como máximo 50 caracteres",
    }),
  address: z
    .string()
    .min(5, {
      message: "La dirección debe tener al menos 5 caracteres",
    })
    .max(100, {
      message: "La dirección debe tener como máximo 100 caracteres",
    }),
  image: z.instanceof(File).optional(),
  price: z
    .number({ error: "El precio debe ser un número" })
    .positive("El precio no puede ser negativo"),
});

export type PropertyFormData = z.infer<typeof FormSchema>;
