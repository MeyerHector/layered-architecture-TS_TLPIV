# Usa una imagen base de Node.js
FROM node:21.7.3-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos
COPY . .

# Expone el puerto (ajusta según el puerto del cliente)
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start", "dev"]
