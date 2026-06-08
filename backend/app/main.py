from fastapi import FastAPI

app = FastAPI(title="Zetage Booking System API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Zetage Booking System API"}
