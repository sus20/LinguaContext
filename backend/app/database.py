import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import URL, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# find the backend directory
BACKEND_DIR = Path(__file__).resolve().parents[1]

# load environment variables
load_dotenv(BACKEND_DIR / "dev.env")

# construct database URL ("postgresql+psycopg://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME")
DATABASE_URL = URL.create(
    drivername="postgresql+psycopg",
    username=os.environ["POSTGRES_USER"],
    password=os.environ["POSTGRES_PASSWORD"],
    host=os.environ["DATABASE_HOST"],
    port=int(os.environ["DATABASE_PORT"]),
    database=os.environ["POSTGRES_DB"]
)

# create database engine
engine = create_engine(DATABASE_URL)

# create session factory
SessionLocal = sessionmaker(autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
