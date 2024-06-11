
import Image from "next/image";
import Link from "next/link";


export default function Home() {

  return (
    <header className="w-full flex justify-center items-center gap-9">
      <h1 className="text-xl">Administração de Pacientes</h1>
      <ul className="flex justify-center items-center gap-5">
        <li><Link href="/pacientes">Pacientes</Link></li>
        <li><a href="">Imc</a></li>
      </ul>
    </header>
  );
}
