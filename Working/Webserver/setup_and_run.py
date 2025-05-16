import os
import mysql.connector
import time
from app import app  # your Flask app

# === MySQL credentials ===
MYSQL_HOST = "localhost"
MYSQL_USER = "Admin"
MYSQL_PASSWORD = "Admin"
MYSQL_DB = "Bored_Games"

# === SQL file paths ===
BASE_SQL_DIR = os.path.abspath(os.path.join(os.getcwd(), '../Database'))
CREATION_SQL = os.path.join(BASE_SQL_DIR, 'Creation.sql')
INSERT_SQL = os.path.join(BASE_SQL_DIR, 'SQL_insert_blob.txt')
VIEWS_TRIGGERS_SQL = os.path.join(BASE_SQL_DIR, 'Views_Triggers_functions.sql')

def execute_sql_file(cursor, path):
    print(f"▶ Running SQL: {os.path.basename(path)}")
    with open(path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    statements = sql_content.split(';')
    for statement in statements:
        stmt = statement.strip()
        if stmt:
            try:
                cursor.execute(stmt)
            except Exception as e:
                print(f"⚠️ Error executing:\n{stmt}\n→ {e}")

def setup_database():
    print("📡 Connecting to MySQL...")
    connection = mysql.connector.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD
    )
    cursor = connection.cursor()

    # Create DB if not exists
    cursor.execute(f"CREATE DATABASE IF NOT EXISTS {MYSQL_DB}")
    cursor.execute(f"USE {MYSQL_DB}")

    # Execute scripts
    execute_sql_file(cursor, CREATION_SQL)
    execute_sql_file(cursor, INSERT_SQL)
    execute_sql_file(cursor, VIEWS_TRIGGERS_SQL)

    connection.commit()
    cursor.close()
    connection.close()
    print("✅ Database setup complete.")

def launch_flask():
    print("🚀 Starting Flask app...")
    app.run(debug=True)

if __name__ == "__main__":
    setup_database()
    time.sleep(2)
    launch_flask()
