"use client";
import { PropertyForm } from "@/components/propiedades/property-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { set } from "zod";

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

  type Property = {
    id: string;
    name: string;
    address: string;
    price: number;
    image?: string;
    created_at: string;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const { data, error } = await supabase.from("properties").select();
      if (error) {
        console.log(error);
        toast.error("Error loading properties");
      } else {
        setProperties(data);
        console.log(data);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Propiedades</h1>
          <p className="text-md text-muted-foreground">
            Registra, elimina, edita tus propiedades
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Añadir propiedad</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar una propiedad</DialogTitle>
              <DialogDescription>
                Rellena el formulario para registrar una nueva propiedad.
              </DialogDescription>
            </DialogHeader>
            <PropertyForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex h-full items-center justify-center">
        {loading ? (
          <Skeleton className="h-[30px] w-[500px]" />
        ) : properties.length === 0 ? (
          <p className="text-muted-foreground">
            No hay propiedades registradas.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="flex justify-between rounded-md border p-4 shadow-sm"
              >
                <div>
                  <h2 className="font-semibold">{prop.name}</h2>
                  <p>{prop.address}</p>
                </div>
                <div className="font-medium">${prop.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
