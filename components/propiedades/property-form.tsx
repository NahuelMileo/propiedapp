import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormSchema } from "@/lib/validations/property";
import z from "zod";
import { createBrowserClient } from "@supabase/ssr";
import { toast, Toaster } from "sonner";
import { useState } from "react";

type PropertyFormProps = {
  onCreate?: (newProperty: Property) => void;
};

export function PropertyForm({ onCreate }: PropertyFormProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      address: "",
      image: undefined,
      price: undefined as unknown as number,
    },
  });

  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const user_id = user?.id;
    if (!user_id) {
      toast.error("Usuario no autenticado");
      return;
    }

    let imageUrl: string | null = null;

    if (data.image) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(`${user_id}/${Date.now()}-${data.image.name}`, data.image);

      if (uploadError) {
        console.log(uploadError);
        toast.error("Error al subir imagen");
        return;
      }

      // Generar URL pública
      const { data: publicUrl } = supabase.storage
        .from("images")
        .getPublicUrl(uploadData.path);

      imageUrl = publicUrl.publicUrl;
    }
    const { data: insertedData, error } = await supabase
      .from("properties")
      .insert({
        name: data.name,
        address: data.address,
        price: data.price,
        owner_id: user_id,
        image: imageUrl,
      })
      .select()
      .single();

    if (error) {
      toast.error("Error al crear la propiedad");
    } else {
      toast.success("Propiedad creada con éxito");
      form.reset();
      if (onCreate && insertedData) {
        onCreate(insertedData);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la propiedad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ubicación  de la propiedad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file); // guardamos el File en react-hook-form
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value !== undefined ? String(field.value) : ""}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Procesando..." : "Enviar"}
        </Button>
      </form>
    </Form>
  );
}
