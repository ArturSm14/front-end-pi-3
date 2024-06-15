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
import { useState } from "react";

interface Data {
  id: number;
  name: string;
  document: string;
  sexo: string;
  dataDeNascimento: string; 
}

const createPatienteSchema = z.object({
  name: z.string(),
  document: z.string(),
  sexo: z.string(),
  dataDeNascimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data inválida",
  }),
});

type CreatePatienteSchema = z.infer<typeof createPatienteSchema>;

export function CreatePatienteDialog( { onAddPaciente } : { onAddPaciente: (newPaciente : Data) => void}) {

  const { register, handleSubmit, formState: { errors } } = useForm<CreatePatienteSchema>({
    resolver: zodResolver(createPatienteSchema),
  });

  const [loading, setLoading] = useState(false)

  async function handleCreatePatiente(data: CreatePatienteSchema) {
    event?.preventDefault();
    console.log(data);
    setLoading(true);
    try{
      const newPaciente = await addPaciente(data);
      onAddPaciente(newPaciente);
    } catch (error) {
      console.error('Erro ao adicionar paciente', error);
    } finally {
      setLoading(false);
    }
  }

  async function addPaciente(newPaciente: Omit<Data, 'id'>): Promise<Data>{
    try {
      const response = await fetch('http://localhost:8080/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(newPaciente)
      });

      if (!response.ok) {
        throw new Error('Erro ao adicionar paciente');
      }

      const data: Data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro: ', error);
      throw error;
    }
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
          <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
