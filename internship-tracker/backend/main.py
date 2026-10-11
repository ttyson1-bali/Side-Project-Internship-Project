from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import database
from pydantic import BaseModel

class ApplicationCreate(BaseModel):
    company: str
    status: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def root():
    return {"message": "Internship Tracker API"}

@app.get("/applications")
def get_applications():
    return database.get_applications()
    

@app.post("/applications")
def create_application(application: ApplicationCreate):

    new_id = database.create_application(
        company = application.company ,
        status = application.status 
    )
    return {"id": new_id}

data = {
    "company": "HII", 
    "status" : "offer"
}
applications = ApplicationCreate(**data)
create_application(application= applications)
