from fastapi import FastAPI

from app import models
from app.database import Base, engine
from app.routers import documents, health


# create all tables that don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(title="LinguaContext API")

app.include_router(health.router)
app.include_router(documents.router)
