"use client"
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog, DialogTrigger
} from "@/components/ui/dialog";
import { BadgeX } from 'lucide-react';
import { FilePenLine } from 'lucide-react';
import { CreatePatienteDialog } from "@/components/ui/create-patiente-dialog";
import { useEffect, useState } from "react";
import { EditPatienteDialog } from "@/components/ui/edit-patiente-dialog";


interface Data {
   id: number;
   name: string;
   document: string;
   sexo: string;
   dataDeNascimento: string; 
}

export default function Pacientes(){

    const [pacientes, setPacientes] = useState<Data[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPaciente, setSelectedPaciente] = useState<Data | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:3000/pacientes')
                if(!response.ok){
                    throw new Error('Erro ao buscar dados');
                }
                const data: Data[] = await response.json();
                setPacientes(data);
            } catch (error) {
                console.error('Erro:', error);
            } finally {
                setLoading(false)
            }
        }

        fetchData();
    }, []);

    async function handleAddPaciente(newPaciente: Data) {
        setPacientes((prev) => [...prev, newPaciente])
    }

    async function handleUpdatePaciente(updatedPaciente: Data) {
        setPacientes((prev) =>
            prev.map((paciente) =>
                paciente.id === updatedPaciente.id ? updatedPaciente : paciente
            )
        );
    }

    async function handleDeletePaciente(id: number) {
        try {
            const response = await fetch(`http://localhost:3000/pacientes/${id}`, {
                method: 'DELETE',
            });
        
            if (!response.ok) {
                throw new Error('Erro ao deletar paciente');
            }

            setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));
        } catch (error) {
            console.error('Erro ao deletar paciente:', error)
        }

    }

    return(
            <div className="flex flex-col m-10 p-3">
                <div className="flex flex-col mb-8 gap-4">
                    <h2 className="text-4xl">Lista de Pacientes</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-[200px]">Registrar Paciente</Button>
                        </DialogTrigger>
                        
                        <CreatePatienteDialog onAddPaciente={handleAddPaciente}/>
                    </Dialog>

                </div>
                <Table>
                    <TableCaption>Lista de pacientes.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-extrabold">Id</TableHead>
                            <TableHead className="font-extrabold">Documento</TableHead>
                            <TableHead className="font-extrabold">Nome</TableHead>
                            <TableHead className="font-extrabold">Sexo</TableHead>
                            <TableHead className="font-extrabold">Data de Nascimento</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Carregando</TableCell>
                            </TableRow>
                        ) : (
                            pacientes.map((paciente) => (
                                <TableRow key={paciente.id}>
                                    <TableCell className="font-medium">{paciente.id}</TableCell>
                                    <TableCell>{paciente.document}</TableCell>
                                    <TableCell>{paciente.name}</TableCell>
                                    <TableCell>{paciente.sexo}</TableCell>
                                    <TableCell>{paciente.dataDeNascimento}</TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <TableCell><FilePenLine onClick={() => setSelectedPaciente(paciente)} className="cursor-pointer"/></TableCell>
                                        </DialogTrigger>
                                        
                                        {selectedPaciente && (
                                            <EditPatienteDialog 
                                            patientId={selectedPaciente.id}
                                            initialData={selectedPaciente}
                                            onPatientUpdated={handleUpdatePaciente}
                                        />
                                        )}
                                    </Dialog>
                                    <TableCell><BadgeX onClick={() => handleDeletePaciente(paciente.id)} className="cursor-pointer"/></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>


    )
}