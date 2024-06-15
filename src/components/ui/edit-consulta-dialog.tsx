"use client"
import { Button } from "./button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

interface Data{
    id: number;
    queixaPrincipal: string;
    medico: string;
    diagnostico: string;
    paciente: number;
}

const editConsultaSchema = z.object({
    id: z.number(),
    queixaPrincipal: z.string(),
    medico: z.string(),
    diagnostico : z.string(),
    paciente: z.coerce.number().min(1, "Selecione um paciente"),
})

type EditConsultaSchema = z.infer<typeof editConsultaSchema>;

export function EditConsultaDialog({
    consultaId,
    initialData,
    onConsultaUpdated,
} : {
    consultaId: number;
    initialData: Data;
    onConsultaUpdated: (updatedConsulta: Data) => void;
}) {

    const { register, handleSubmit, setValue, formState: { errors }, }= useForm<EditConsultaSchema>({
        resolver: zodResolver(editConsultaSchema),
        defaultValues: initialData,
    });

    const [pacientes, setPacientes] = useState<{ id: number, name: string}[]>([])

    useEffect(() => {
      async function fetchPacientes() {
        try {
          const response = await fetch(`http://localhost:8080/pacientes/nomes`);

          if(!response.ok) {
            throw new Error('Erro ao buscar pacientes');
          }

          const data = await response.json();
          setPacientes(data);
        } catch (error) {
          console.error('Erro ao buscar pacientes: ', error);
        }
      }

      fetchPacientes();
    }, []);

    useEffect(() => {
        if (initialData) {
            setValue("queixaPrincipal", initialData.queixaPrincipal);
            setValue("medico", initialData.medico);
            setValue("diagnostico", initialData.diagnostico);
            setValue("paciente", initialData.paciente);
        }
    }, [initialData, setValue])

    async function updateConsulta(
        id: number,
        updatedConsulta: Omit<Data, "id">
    ): Promise<Data> {
        try {
            const response = await fetch(`http://localhost:8080/consultas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedConsulta),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar consulta');
            }

            const data: Data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro: ', error);
            throw error;
        }
    }

    async function handleFormSubmit(data: EditConsultaSchema) {
        event?.preventDefault();
        try {
            const updatedConsulta = await updateConsulta(consultaId, {...data, paciente: Number(data.paciente)});
            onConsultaUpdated(updatedConsulta);
        } catch (error) {
            console.error("Erro ao atualizar consulta :", error)
        }
    }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar consulta</DialogTitle>
        <DialogDescription>Atualizar informações da consulta</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="queixaPrincipal">Queixa Principal</Label>
          <Input className="col-span-3" id="queixaPrincipal" {...register("queixaPrincipal")} />
          {errors.queixaPrincipal && <p>{errors.queixaPrincipal.message}</p>}
        </div>

        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="medico">Médico</Label>
          <Input
            className="col-span-3"
            id="medico"
            {...register("medico")}
          />
          {errors.medico && <p>{errors.medico.message}</p>}
        </div>

        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="diagnostico">Diagnóstico</Label>
          <Input 
            className="col-span-3" 
            id="diagnostico" 
            {...register("diagnostico")} 
          />
          {errors.diagnostico && <p>{errors.diagnostico.message}</p>}
        </div>

        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="paciente">Paciente</Label>
          <select className="col-span-3" id="paciente" {...register("paciente")}>
              {pacientes.map(paciente => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.name}
                </option>
              ))}
          </select>
          {errors.paciente && <p>{errors.paciente.message}</p>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
