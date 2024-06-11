"use client";
import { Button } from "./button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const createPatienteSchema = z.object({
  name: z.string(),
  document: z.string(),
  sexo: z.string(),
  dataDeNascimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data inválida",
  }),
});

type CreatePatienteSchema = z.infer<typeof createPatienteSchema>;

export function CreatePatienteDialog() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreatePatienteSchema>({
    resolver: zodResolver(createPatienteSchema),
  });

  function handleCreatePatiente(data: CreatePatienteSchema) {
    event?.preventDefault();
    console.log(data);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo paciente</DialogTitle>
        <DialogDescription>Criar novo paciente no sistema</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreatePatiente)} className="space-y-6">
        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="name">Nome do paciente</Label>
          <Input className="col-span-3" id="name" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="document">Documento</Label>
          <Input
            className="col-span-3"
            id="document"
            {...register("document")}
           />
            {errors.document && <p>{errors.document.message}</p>}
          
        </div>

        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="sexo">Sexo</Label>
          <Input className="col-span-3" id="sexo" {...register("sexo")} />
          
        </div>

        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="date">Data de Nascimento</Label>
          <Input
            type="date"
            className="col-span-3"
            id="date"
            {...register("dataDeNascimento")}
          />
          {errors.dataDeNascimento && <p>{errors.dataDeNascimento.message}</p>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
