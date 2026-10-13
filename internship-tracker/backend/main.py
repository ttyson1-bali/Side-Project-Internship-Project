from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi import HTTPException
import database
from pydantic import BaseModel

class ApplicationCreate(BaseModel):
    company: str
    status: str

class ApplicationUpdate(BaseModel):
    status: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.delete("/applications/{id_num}")
def delete_application(id_num: int):
    deleted = database.delete_application(id_num)

    if deleted:
        return {"message": "Entry deleted successfully"}
    raise HTTPException(
        status_code = 404,
        detail = "Application not found"
    )

@app.patch("/applications/{id_num}")
def update_application(id_num:int, application: ApplicationUpdate ):
    update = database.update_application(id_num, application.status)

    if update:
        return{"message": "Entry updated successfully"}
    raise HTTPException(
        status_code = 404,
        detail = "Application could not be updated"
    )
