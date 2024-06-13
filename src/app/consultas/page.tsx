"use client"
import { Button } from "@/components/ui/button";
import { CreateConsultaDialog } from "@/components/ui/create-consulta-dialog";
import { CreatePatienteDialog } from "@/components/ui/create-patiente-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { EditConsultaDialog } from "@/components/ui/edit-consulta-dialog";
import { EditPatienteDialog } from "@/components/ui/edit-patiente-dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeX, FilePenLine } from "lucide-react";
import { useEffect, useState } from "react";

interface Data{
    id: number;
    queixaPrincipal: string;
    medico: string;
    diagnostico: string;
    paciente: string;
}

export default function Consultas(){

    const [consultas, setConsultas] = useState<Data[]>([]);
    const [loading, setLoading]= useState(true)
    const [selectedConsulta, setSelectedConsulta] = useState<Data | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:3000/consultas')
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados');
                }
                const data: Data[] = await response.json();
                setConsultas(data);
            } catch (error) {
                console.error('Erro: ', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData();
    }, []);

    async function handleAddConsulta(newConsulta: Data){
        setConsultas((prev) => [...prev, newConsulta]);
    }

    async function handleUpdateConsulta(updatedConsulta:Data) {
        setConsultas((prev) => 
            prev.map((consulta) => 
                consulta.id === updatedConsulta.id ? updatedConsulta : consulta
            )
        );
    }

    async function handleDeleteConsulta(id: number) {
        try {
            const response = await fetch(`http://localhost:3000/consultas/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar paciente');
            }

            setConsultas((prev) => prev.filter((consulta) => consulta.id !== id));
        } catch (error) {
            console.error('Erro ao deletar paciente:', error)
        }
    }

    return(

        <div className="flex flex-col m-10 p-3">
                <div className="flex flex-col mb-8 gap-4">
                    <h2 className="text-4xl">Lista de Cosnultas</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-[200px]">Registrar nova consulta</Button>
                        </DialogTrigger>
                        
                        <CreateConsultaDialog onAddConsulta={handleAddConsulta}/>
                    </Dialog>

                </div>
                <Table>
                    <TableCaption>Lista de consultas...</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-extrabold">Id</TableHead>
                            <TableHead className="font-extrabold">Queixa principal</TableHead>
                            <TableHead className="font-extrabold">Medico</TableHead>
                            <TableHead className="font-extrabold">Diagnóstico</TableHead>
                            <TableHead className="font-extrabold">Paciente</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Carregando</TableCell>
                            </TableRow>
                        ) : (
                            consultas.map((consulta) => (
                                <TableRow key={consulta.id}>
                                    <TableCell className="font-medium">{consulta.id}</TableCell>
                                    <TableCell>{consulta.queixaPrincipal}</TableCell>
                                    <TableCell>{consulta.medico}</TableCell>
                                    <TableCell>{consulta.diagnostico}</TableCell>
                                    <TableCell>{consulta.paciente}</TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <TableCell><FilePenLine onClick={() => setSelectedConsulta(consulta)} className="cursor-pointer"/></TableCell>
                                        </DialogTrigger>
                                        
                                       {selectedConsulta && (
                                            <EditConsultaDialog 
                                                consultaId={selectedConsulta.id}
                                                initialData={selectedConsulta}
                                                onConsultaUpdated={handleUpdateConsulta}
                                            />
                                       )}
                                    </Dialog>
                                    <TableCell><BadgeX onClick={() => handleDeleteConsulta(consulta.id)} className="cursor-pointer"/></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
    )
}