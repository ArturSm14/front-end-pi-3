import Link from "next/link";


export default function Home() {

  return (
    <main className=" w-full h-[40em] flex flex-col justify-center items-center gap-9">
      <h1 className="text-xl">Administração de Pacientes</h1>
      <ul className="bg-black rounded-2xl  text-white w-[30em] h-[25em] flex flex-col justify-center items-center gap-14">
          <li><Link className="bg-white text-black p-7 rounded-2xl" href="/pacientes">Pacientes</Link></li>
          <li><Link className="bg-white text-black p-7 rounded-2xl" href="/imc">IMC</Link></li>
          <li><Link className="bg-white text-black p-7 rounded-2xl" href="/consultas">Consultas</Link></li>
      </ul>
    </main>
  );
}
