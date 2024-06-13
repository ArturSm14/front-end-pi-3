"use client"
import { Button } from "./button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

interface Data {
    id: number;
    name: string;
    document: string;
    sexo: string;
    dataDeNascimento: string; 
}

const editPatienteSchema = z.object({
    name: z.string(),
    document: z.string(),
    sexo: z.string(),
    dataDeNascimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Data inválida",
    }),
});

type EditPatienteSchema = z.infer<typeof editPatienteSchema>;

export function EditPatienteDialog({ 
    patientId, 
    initialData, 
    onPatientUpdated,
} : { 
    patientId: number; 
    initialData: Data; 
    onPatientUpdated: (updatedPatient: Data) => void;
}) {

    const { register, handleSubmit, setValue, formState: { errors }, } = useForm<EditPatienteSchema>({
        resolver : zodResolver(editPatienteSchema),
        defaultValues: initialData,
    });

    useEffect(() => {
        if (initialData) {
            setValue("name", initialData.name);
            setValue("document", initialData.document);
            setValue("sexo", initialData.sexo);
            setValue("dataDeNascimento", initialData.dataDeNascimento);
        }
    }, [initialData, setValue])

    async function updatePaciente(
        id: number, 
        updatedPaciente : Omit<Data, "id">
    ): Promise<Data> {
        try {
            const response = await fetch(`http://localhost:3000/pacientes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'applicantion/json',
                },
                body: JSON.stringify(updatedPaciente),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar paciente');
            }

            const data: Data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro: ', error);
            throw error;
        }
    }

    async function handleFormSubmit(data: EditPatienteSchema) {
        event?.preventDefault();
        try {
            const updatedPatient = await updatePaciente(patientId, data);
            onPatientUpdated(updatedPatient);
        } catch (error) {
            console.error("Erro ao atualizar paciente :", error)
        }
    }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar paciente</DialogTitle>
        <DialogDescription>Atualizar infromações do paciente</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)}  className="space-y-6">
        <div className=" grid grid-cols-6 items-center text-right gap-3">
          <Label htmlFor="name">Nome do paciente</Label>
          <Input 
            className="col-span-3" 
            id="name" 
            {...register("name")} 
          />
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
          <Input 
            className="col-span-3" 
            id="sexo" 
            {...register("sexo")}  
          />
          {errors.sexo && <p>{errors.sexo.message}</p>}
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
          <Button type="submit" >
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
