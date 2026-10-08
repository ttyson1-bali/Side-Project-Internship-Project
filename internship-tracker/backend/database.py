import sqlite3

connection = sqlite3.connect("applications.db")

connection.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY,
        company TEXT NOT NULL,
        status TEXT NOT NULL
    )
""")

def get_applications():
    connection = sqlite3.connect("applications.db")
    cursor = connection.execute("""
        SELECT * FROM applications                          
    """)
    rows = cursor.fetchall()

    connection.close()
    return rows

def add_application(company: str, status: str):
    connection = sqlite3.connect("applications.db")
    cursor = connection.execute("""
        INSERT INTO applications (company, status)
            VALUES (? , ?)
        """,(company, status))
    #Fetches ID generated for the newly inserted row
    new_id = cursor.lastrowid

    connection.commit()
    connection.close()
    
    return new_id

connection.commit()
connection.close()