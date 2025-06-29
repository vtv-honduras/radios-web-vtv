-- Este script es para referencia de la estructura de datos en Firestore
-- Firestore es una base de datos NoSQL, por lo que no usa SQL
-- Pero aquí documentamos la estructura de los documentos

-- Colección: stations
-- Documento ejemplo:
{
  "name": "Radio Popular",
  "genre": "Pop / Top 40",
  "coverImage": "https://example.com/image.jpg",
  "streamUrl": "https://stream.zenolive.com/2w81t82wx3duv",
  "listeners": 1245,
  "description": "La mejor música pop y los éxitos del momento.",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}

-- Para inicializar Firebase:
-- 1. Crear proyecto en Firebase Console
-- 2. Habilitar Firestore Database
-- 3. Configurar reglas de seguridad
-- 4. Añadir variables de entorno en .env.local
