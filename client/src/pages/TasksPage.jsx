import { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Checkbox } from "../components/ui/checkbox"
import { ScrollArea } from "../components/ui/scroll-area"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { AlertCircle, CalendarDays, Edit, Plus, Search, Trash2 } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { getAllCompletedTasks, getAllUncompletedTasks } from "../api/tasks";
import SubTaskCardCheck from '../components/SubTaskCardCheck'

export default function Component() {

  const { getTasks, tasks, markTaskAsCompletedOrNot, deleteTask } = useTasks();
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("all");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [moreInfo, setMoreInfo] = useState(null);
  const navigate = useNavigate();


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

  const handleComplete = async (task) => {
    console.log("task", task)
    await markTaskAsCompletedOrNot(task.id);
    await getTasks();
  };

  useEffect(() => {
    const filterTasks = async () => {
      let tasksToFilter = tasks;
      if (view === "completed") {
        const res = await getAllCompletedTasks();
        tasksToFilter = res.data;
      } else if (view === "uncompleted") {
        const res = await getAllUncompletedTasks();
        tasksToFilter = res.data;
      } else if (view === "overdue") {
        tasksToFilter = tasks.filter((task) => {
          if (!task.completed) {
            return new Date(task.date) < new Date();
          }
          return false;
        });
      }
      setFilteredTasks(tasksToFilter);
    };

    filterTasks();
  }, [view, tasks]);

  const filterTasksrender = filteredTasks.filter(task =>
    task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const handleDelete = async (id) => {
    await deleteTask(id);
    await getTasks();
  };

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
                <TabsTrigger value="all" onClick={() => setView("all")}>Todas</TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setView("uncompleted")}>Pendientes</TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setView("completed")}>Completadas</TabsTrigger>
                <TabsTrigger value="overdue" onClick={() => setView("overdue")}>Vencidas</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ScrollArea className="h-[400px] pr-4">
                  {filterTasksrender.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col p-4 mb-2 border rounded-lg hover:bg-accent"
                      style={getBorderStyle(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => handleComplete(task)}
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : undefined}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {new Date(task.date).toISOString().split("T")[0]}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigate(`/tasks/${task.id}`)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <button onClick={() => setMoreInfo(moreInfo === task.id ? null : task.id)}>
                            {moreInfo === task.id ? (
                              <i className="fa-solid fa-angle-up "></i>
                            ) : (
                              <i className="fa-solid fa-angle-down "></i>
                            )}
                          </button>
                        </div>
                      </div>
                      <div
                        className={`transition-max-height duration-1000 ease-in-out overflow-hidden ${moreInfo === task.id ? "max-h-96" : "max-h-0"
                          }`}
                      >
                        {moreInfo === task.id && (
                          <div>
                            <p
                              className="text-gray-500 break-all"
                              dangerouslySetInnerHTML={{
                                __html: task.description.replace(/\n/g, "<br />"),
                              }}
                            ></p>
                            {task?.subTasks?.length > 0 && (
                              <>
                                <div>
                                  <span>Subtareas ({task?.subTasks.length})</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {task?.subTasks.map((subTask, i) => {
                                    return (
                                      <SubTaskCardCheck
                                        key={i}
                                        subTask={subTask}
                                        handleComplete={handleComplete}
                                      />
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="pending">
                <ScrollArea className="h-[400px] pr-4">
                  {filterTasksrender.filter(t => !t.completed).map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col p-4 mb-2 border rounded-lg hover:bg-accent"
                      style={getBorderStyle(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => markTaskAsCompletedOrNot(task.id)}
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : undefined}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {new Date(task.date).toISOString().split("T")[0]}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigate(`/tasks/${task.id}`)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <button onClick={() => setMoreInfo(moreInfo === task.id ? null : task.id)}>
                            {moreInfo === task.id ? (
                              <i className="fa-solid fa-angle-up "></i>
                            ) : (
                              <i className="fa-solid fa-angle-down "></i>
                            )}
                          </button>
                        </div>
                      </div>
                      <div
                        className={`transition-max-height duration-1000 ease-in-out overflow-hidden ${moreInfo === task.id ? "max-h-96" : "max-h-0"
                          }`}
                      >
                        {moreInfo === task.id && (
                          <div>
                            <p
                              className="text-gray-300 break-all"
                              dangerouslySetInnerHTML={{
                                __html: task.description.replace(/\n/g, "<br />"),
                              }}
                            ></p>
                            {task?.subTasks?.length > 0 && (
                              <>
                                <div>
                                  <span>Subtareas ({task?.subTasks.length})</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {task?.subTasks.map((subTask, i) => {
                                    return (
                                      <SubTaskCardCheck
                                        key={i}
                                        subTask={subTask}
                                        handleComplete={handleComplete}
                                      />
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="completed">
                <ScrollArea className="h-[400px] pr-4">
                  {filterTasksrender.filter(t => t.completed).map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col p-4 mb-2 border rounded-lg hover:bg-accent"
                      style={getBorderStyle(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => markTaskAsCompletedOrNot(task.id)}
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : undefined}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            {new Date(task.date).toISOString().split("T")[0]}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigate(`/tasks/${task.id}`)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <button onClick={() => setMoreInfo(moreInfo === task.id ? null : task.id)}>
                            {moreInfo === task.id ? (
                              <i className="fa-solid fa-angle-up "></i>
                            ) : (
                              <i className="fa-solid fa-angle-down "></i>
                            )}
                          </button>
                        </div>
                      </div>
                      <div
                        className={`transition-max-height duration-1000 ease-in-out overflow-hidden ${moreInfo === task.id ? "max-h-96" : "max-h-0"
                          }`}
                      >
                        {moreInfo === task.id && (
                          <div>
                            <p
                              className="text-gray-300 break-all"
                              dangerouslySetInnerHTML={{
                                __html: task.description.replace(/\n/g, "<br />"),
                              }}
                            ></p>
                            {task?.subTasks?.length > 0 && (
                              <>
                                <div>
                                  <span>Subtareas ({task?.subTasks.length})</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {task?.subTasks.map((subTask, i) => {
                                    return (
                                      <SubTaskCardCheck
                                        key={i}
                                        subTask={subTask}
                                        handleComplete={handleComplete}
                                      />
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="overdue">
                <ScrollArea className="h-[400px] pr-4">
                  {filterTasksrender.filter(t => !t.completed && isOverdue(t.date)).map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col p-4 mb-2 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                      style={getBorderStyle(task)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => markTaskAsCompletedOrNot(task.id)}
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : undefined}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-sm text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {new Date(task.date).toISOString().split("T")[0]}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              navigate(`/tasks/${task.id}`)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(task.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <button onClick={() => setMoreInfo(moreInfo === task.id ? null : task.id)}>
                            {moreInfo === task.id ? (
                              <i className="fa-solid fa-angle-up "></i>
                            ) : (
                              <i className="fa-solid fa-angle-down "></i>
                            )}
                          </button>
                        </div>
                      </div>
                      <div
                        className={`transition-max-height duration-1000 ease-in-out overflow-hidden ${moreInfo === task.id ? "max-h-96" : "max-h-0"
                          }`}
                      >
                        {moreInfo === task.id && (
                          <div>
                            <p
                              className="text-gray-300 break-all"
                              dangerouslySetInnerHTML={{
                                __html: task.description.replace(/\n/g, "<br />"),
                              }}
                            ></p>
                            {task?.subTasks?.length > 0 && (
                              <>
                                <div>
                                  <span>Subtareas ({task?.subTasks.length})</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                  {task?.subTasks.map((subTask, i) => {
                                    return (
                                      <SubTaskCardCheck
                                        key={i}
                                        subTask={subTask}
                                        handleComplete={handleComplete}
                                      />
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <div>{filterTasksrender.length} tareas en total</div>
            <div>{filterTasksrender.filter(t => t.completed).length} completadas</div>
            <div>{filterTasksrender.filter(t => !t.completed && isOverdue(t.date)).length} vencidas</div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}