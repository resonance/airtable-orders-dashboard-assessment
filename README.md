# 📦 Airtable Orders Sync API

Backend construido con **FastAPI**, **PostgreSQL** y **Airtable API** para sincronizar, almacenar y administrar órdenes localmente, con soporte para paginación, actualización parcial y resúmenes estadísticos para dashboards.

---

##  Stack Tecnológico

- **Python 3.10+**
- **FastAPI**
- **SQLAlchemy**
- **Alembic (migraciones)**
- **PostgreSQL**
- **psycopg2-binary**
- **APScheduler**
- **Airtable REST API**
- **Pydantic v2**
- **Uvicorn**

---

## Requisitos del Sistema

Asegúrate de tener instalado:

```bash
python --version     # >= 3.10
pip --version
psql --version

Estructura del Proyecto
pgsql
Copy code
backend_api/
│
├── app/
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   └── order.py
│   ├── schemas/
│   │   └── order_schema.py
│   ├── services/
│   │   ├── airtable_service.py
│   │   └── sync_service.py
│   ├── controllers/
│   │   └── order_controller.py
│   └── routes/
│       └── order_routes.py
│
├── alembic/
│   ├── versions/
│   └── env.py
│
├── main.py
├── requirements.txt
├── .env
└── README.md

Dependencias (requirements.txt)
txt
fastApi
uvicorn
requests
python-dotenv
SQLAlchemy
Psycopg2-binary
alembic
apscheduler
pydantic
apscheduler
python-dateutil

⚙️ Variables de Entorno (.env)
env
Copy code
DATABASE_URL=postgresql://master:password@localhost:5432/resonance

# tener en cuenta que debe crear la base de datos por comandos y debe crear el user master y su password

AIRTABLE_API_KEY=keyXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXX
AIRTABLE_TABLE_ID=tblXXXXXXXXXXXX

SYNC_INTERVAL_MINUTES=5
DEBUG=true
🗄️ Base de Datos (PostgreSQL)
1️⃣ Crear usuario (si no existe)
sql
Copy code
CREATE USER master WITH PASSWORD 'password';
2️⃣ Crear base de datos
sql
Copy code
CREATE DATABASE resonance OWNER master;
3️⃣ Dar permisos
sql
Copy code
GRANT ALL PRIVILEGES ON DATABASE resonance TO master;
📦 Instalación del Backend
1️⃣ Crear entorno virtual
bash
Copy code
python -m venv venv
source venv/bin/activate
(Windows)

bash
Copy code
venv\Scripts\activate
2️⃣ Instalar dependencias
bash
Copy code
pip install -r requirements.txt
🧬 Migraciones (Alembic)
1️⃣ Inicializar Alembic (una sola vez)
bash
Copy code
alembic init alembic
2️⃣ Configurar alembic.ini
ini
Copy code
sqlalchemy.url = postgresql://master:password@localhost:5432/resonance
3️⃣ Importar modelos en alembic/env.py
python
Copy code
from app.database import Base
from app.models.order import Order

target_metadata = Base.metadata
4️⃣ Crear migración
bash
Copy code
alembic revision --autogenerate -m "create orders table"
5️⃣ Ejecutar migración
bash
Copy code
alembic upgrade head
▶️ Ejecutar el Servidor
bash
Copy code
uvicorn main:app --reload
Servidor disponible en:

cpp
Copy code
http://127.0.0.1:8000

Documentación Automática
FastAPI expone Swagger automáticamente:

arduino
Copy code
http://127.0.0.1:8000/docs
Endpoints Principales
Listar órdenes (paginación + filtros)
http

Copy code
GET /api/orders
Query params:

page
page_size
status
priority
customer
start_date
end_date

Obtener orden por record_id
http
Copy code
GET /api/orders/id/{record_id}
Actualizar status y prioridad
http
Copy code
PATCH /api/orders/{record_id}
Body:

json
Copy code
{
  "status": "Sent",
  "priority": "High"
}

Resumen de órdenes (charts)
http
Copy code
GET /api/orders/summary
Sincronización manual con Airtable
http
Copy code
POST /api/orders/sync

Sincronización Automática
Se ejecuta al iniciar la aplicación

Se ejecuta cada SYNC_INTERVAL_MINUTES

Detecta cambios por updated_at

Evita duplicados por record_id

Pruebas con Postman
Ejemplo:
arduino
Copy code
http://127.0.0.1:8000/api/orders?page=1&page_size=10

Estados y Prioridades
Status válidos
Pending
Processing
Sent
Delivered
Cancelled
Priority válidas
Low
Medium
High