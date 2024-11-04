import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { ScrollArea } from "../components/ui/scroll-area"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { AlertCircle, CalendarDays, Edit, Plus, Search, Trash2 } from "lucide-react"
import { Link } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'

export default function Component() {

  const { getTasks, tasks } = useTasks();
  const [setTasks] = useState();
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        await getTasks();
      } catch (err) {
        setError("Error al cargar las tareas");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [getTasks]);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;



  const toggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, importance: !task.importance } : task
    ))
  }

  const editTask = (taskId, newTitle) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    ))
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }



  const getBorderStyle = (task) => {
    switch (task.importance) {
      case "URGENTE":
        return { borderLeft: '4px solid #ff0f00' }
      case "ALTA":
        return { borderLeft: '4px solid #FFC300' }
      case "MEDIA":
        return { borderLeft: '4px solid #42ff00' }
      case "BAJA":
        return { borderLeft: '4px solid #00d1ff' }
      default:
        return { borderLeft: '4px solid gray' }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 md:p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mis Tareas</CardTitle>
                <CardDescription>Gestiona tus tareas diarias de forma eficiente</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8 w-[200px] sm:w-[300px]"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link to={"/add-task"} >
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Tarea
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="completed">Completadas</TabsTrigger>
                <TabsTrigger value="overdue">Vencidas</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <ScrollArea className="h-[400px] pr-4">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 mb-2 border rounded-lg hover:bg-accent"
                      style={getBorderStyle(task)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          {new Date(task.date).toLocaleDateString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newTitle = prompt("Editar tarea", task.title)
                            if (newTitle) editTask(task.id, newTitle)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="pending">
                <ScrollArea className="h-[400px] pr-4">
                  {filteredTasks.filter(t => !t.completed).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 mb-2 border rounded-lg hover:bg-accent"
                      style={getBorderStyle(task)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span>{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          {new Date(task.date).toLocaleDateString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newTitle = prompt("Editar tarea", task.title)
                            if (newTitle) editTask(task.id, newTitle)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="completed">
                <ScrollArea className="h-[400px] pr-4">
                  {filteredTasks.filter(t => t.completed).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 mb-2 border rounded-lg hover:bg-accent"
                      style={getBorderStyle(task)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className="line-through text-muted-foreground">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="w-4 h-4 mr-2" />
                          {new Date(task.date).toLocaleDateString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newTitle = prompt("Editar tarea", task.title)
                            if (newTitle) editTask(task.id, newTitle)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="overdue">
                <ScrollArea className="h-[400px] pr-4">
                  {filteredTasks.filter(t => !t.completed && isOverdue(t.dueDate)).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 mb-2 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                      style={getBorderStyle(task)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className="text-red-600 dark:text-red-400">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {new Date(task.date).toLocaleDateString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newTitle = prompt("Editar tarea", task.title)
                            if (newTitle) editTask(task.id, newTitle)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div>{filteredTasks.length} tareas en total</div>
            <div>{filteredTasks.filter(t => t.completed).length} completadas</div>
            <div>{filteredTasks.filter(t => !t.completed && isOverdue(t.date)).length} vencidas</div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}