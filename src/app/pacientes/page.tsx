import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog, DialogTrigger
} from "@/components/ui/dialog";
import { BadgeX } from 'lucide-react';
import { FilePenLine } from 'lucide-react';
import { CreatePatienteDialog } from "@/components/ui/create-patiente-dialog";


export default function Pacientes(){

    return(
        <>
            <div className="flex flex-col m-10 p-3">
                <div className="flex flex-col mb-8 gap-4">
                    <h2 className="text-4xl">Lista de Pacientes</h2>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-[200px]">Registrar Paciente</Button>
                        </DialogTrigger>
                        
                        <CreatePatienteDialog />
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
                        <TableRow>
                            <TableCell className="font-medium">INV001</TableCell>
                            <TableCell>29986743984</TableCell>
                            <TableCell>Antonio Artur</TableCell>
                            <TableCell>Masculino</TableCell>
                            <TableCell>14/11/2002</TableCell>
                            <TableCell><FilePenLine className="cursor-pointer"/></TableCell>
                            <TableCell><BadgeX className="cursor-pointer"/></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </>


    )
}