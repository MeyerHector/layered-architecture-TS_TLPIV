import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { CalendarDays, CheckCircle, ListTodo } from 'lucide-react'
import Img from '../assets/image/img.png'

export default function HomePage() {
  

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="container px-4 py-24 text-center md:px-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Gestiona tus tareas con facilidad
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
              Organiza tus tareas, simplifica tu rutina y mejora tu productividad con Taskify nuestro gestor de tareas intuitivo y potente.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="font-medium">
              <Link to="/login">Comenzar</Link>
              </Button>
            </div>
          </div>
          <div style={{ padding: 80 }}> 
            <img src={Img} alt="gestor" style={{border: "solid 1px black"}} />
            <section id="cont-section" className="container px-4 py-16 md:px-6">
              <h2 className="mb-12 text-center text-3xl font-bold">Características principales</h2>
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="flex flex-col items-center p-6 text-center bg-primary text-white">
                  <ListTodo className="mb-4 h-12 w-12 text-white" />
                  <h3 className="mb-2 text-xl font-bold">Organización Simple</h3>
                  <p className="text-muted-foreground">
                    Gestiona tus tareas de manera eficiente con una interfaz intuitiva.
                  </p>
                </Card>
                <Card className="flex flex-col items-center p-6 text-center bg-primary text-white">
                  <CheckCircle className="mb-4 h-12 w-12 text-white" />
                  <h3 className="mb-2 text-xl font-bold">Seguimiento en Tiempo Real</h3>
                  <p className="text-muted-foreground">
                    Mantén el control de tus progresos con actualizaciones instantáneas.
                  </p>
                </Card>
                <Card className="flex flex-col items-center p-6 text-center bg-primary text-white">
                  <CalendarDays className="mb-4 h-12 w-12 text-white" />
                  <h3 className="mb-2 text-xl font-bold">Calendario de tareas</h3>
                  <p className="text-muted-foreground">
                    Ver las fechas de tus tareas.
                  </p>
                </Card>
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>© 2024 Gestor de Tareas. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

