import sqlite3

connection = sqlite3.connect("applications.db")

connection.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY,
        company TEXT NOT NULL,
        status TEXT NOT NULL,
        position TEXT NOT NULL
    )
""")

def get_applications():
    connection = sqlite3.connect("applications.db")

    connection.row_factory = sqlite3.Row

    cursor = connection.execute("""
        SELECT * FROM applications
    """)

    rows = cursor.fetchall()

    applications = [dict(row) for row in rows]

    connection.close()

    return applications

def create_application(company: str, status: str, position: str):
    connection = sqlite3.connect("applications.db")
    cursor = connection.execute("""
        INSERT INTO applications (company, status, position)
            VALUES (?, ?, ?)
        """,(company, status, position))
    #Fetches ID generated for the newly inserted row
    new_id = cursor.lastrowid

    connection.commit()
    connection.close()
    
    return new_id

def delete_application(id_num: int):
    connection = sqlite3.connect("applications.db")

    cursor = connection.execute(
        "DELETE FROM applications WHERE ID = ?"
        , (id_num,)
    )

    deleted = cursor.rowcount > 0

    connection.commit()
    connection.close()

    return deleted

def update_application(id_num: int, status: str):
    connection = sqlite3.connect("applications.db")
    cursor = connection.execute("""
        UPDATE applications 
        SET status = ? 
        WHERE id = ?                            
    """, (status, id_num))

    updated = cursor.rowcount > 0

    connection.commit()
    connection.close()

    return updated

connection.commit()
connection.close()