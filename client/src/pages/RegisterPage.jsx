import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, Mail, Lock, ArrowLeft, User } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { signup, authState, errors: registerErrors = [] } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (authState.isLogged) navigate("/tasks")
  }, [authState.isLogged, navigate])

  const onSubmit = handleSubmit((data) => {
    signup(data)
  })

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[#0F1729] border-zinc-800">
        <div className="p-4">
          <Link to="/login">
            <Button variant="outline" className="text-black border-zinc-700 hover:bg-[#1A2337] hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
        </div>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Crear una cuenta
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Ingresa tus datos para registrarte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mostrar errores de registro */}
          {registerErrors.map((error, i) => (
            <p className="bg-red-500 p-2 text-white text-center my-2" key={i}>
              {error}
            </p>
          ))}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                <Input
                  className="pl-10 bg-[#1A2337] border-zinc-800 text-white placeholder:text-zinc-400"
                  placeholder="Nombre completo"
                  type="text"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">
                    Name is required for registration
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                <Input
                  className="pl-10 bg-[#1A2337] border-zinc-800 text-white placeholder:text-zinc-400"
                  placeholder="Ingrese su Email"
                  type="email"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs italic">
                    Email is required for registration
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
                <Input
                  className="pl-10 pr-10 bg-[#1A2337] border-zinc-800 text-white placeholder:text-zinc-400"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su Contraseña"
                  {...register("password", { required: true })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 text-zinc-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">
                    {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  </span>
                </Button>
                {errors.password && (
                  <p className="text-red-500 text-xs italic">
                    Password is required for registration
                  </p>
                )}
              </div>
            </div>
            <Button className="w-full bg-white text-black hover:bg-zinc-200" type="submit">
              <UserPlus className="mr-2 h-4 w-4" />
              Registrarse
            </Button>
            <div className="text-center text-sm">
              <span className="text-zinc-400">¿Ya tienes una cuenta? </span>
              <Link to="/login" className="text-white hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
