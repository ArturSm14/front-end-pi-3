import { Button } from "./button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface Data{
    id: number;
    queixaPrincipal: string;
    medico: string;
    diagnostico: string;
    paciente: string;
}

const createConsultaSchema = z.object({
    queixaPrincipal: z.string(),
    medico: z.string(),
    diagnostico : z.string(),
    paciente: z.string()
})

type CreateConsultasSchema = z.infer<typeof createConsultaSchema>;

export function CreateConsultaDialog( { onAddConsulta} : { onAddConsulta: (newConsulta : Data) => void}) {

    const { register, handleSubmit, formState: { errors } } = useForm<CreateConsultasSchema>({
        resolver: zodResolver(createConsultaSchema),
    });

    const [ loading, setLoading] = useState(false)

    async function handleCreateConsulta(data: CreateConsultasSchema) {
        event?.preventDefault();
        console.log(data);
        setLoading(true);
        try{
            const newConsulta= await addConsulta(data);
            onAddConsulta(newConsulta);
        } catch (error) {
            console.error('Erro ao adicionar consulta', error)
        } finally {
            setLoading(false)
        }
    }

    async function addConsulta(newConsulta: Omit<Data, 'id'>): Promise<Data>{
        try {
            const response = await fetch('http://localhost:3000/consultas', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(newConsulta)
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
        <DialogTitle>Nova consulta</DialogTitle>
        <DialogDescription>Criar nova consulta no sistema</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleCreateConsulta)} className="space-y-6">
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
          <Input
            className="col-span-3"
            id="paciente"
            {...register("paciente")}
          />
          {errors.paciente && <p>{errors.paciente.message}</p>}
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
