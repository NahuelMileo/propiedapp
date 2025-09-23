"use client";
import { PropertyForm } from "@/components/propiedades/property-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import placeholder from "../../../public/placeholder.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { DeletePropertyDialog } from "@/components/propiedades/delete-property-dialog";

export default function Page() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );

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

  const eliminar = async (id: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar la propiedad");
      return;
    } else {
      setProperties(properties.filter((prop) => prop.id !== id));
      toast.success("Propiedad eliminada");
    }
  };

  const editar = () => {};

  return (
    <div className="flex h-full flex-col">
      <Toaster position="top-right" richColors />
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
            <PropertyForm
              onCreate={(newProp) =>
                setProperties((prev) => [newProp, ...prev])
              }
            />
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
          <div className="grid grid-cols-2 gap-4">
            {properties.map((prop) => (
              <Card key={prop.id}>
                <CardHeader>
                  <CardTitle>{prop.name}</CardTitle>
                  <CardDescription>{prop.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    priority
                    src={prop.image ?? placeholder}
                    alt={prop.name}
                    width={400}
                    height={400}
                    className="aspect-square object-cover"
                  />
                </CardContent>
                <CardFooter className="justify-between">
                  <Button onClick={editar}>Editar</Button>
                  <DeletePropertyDialog
                    propertyName={prop.name}
                    onDelete={() => eliminar(prop.id)}
                  />
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
