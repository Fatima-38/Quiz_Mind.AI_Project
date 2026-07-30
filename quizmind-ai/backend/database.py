import os
import sqlite3

# Vercel par /tmp use hoga, local par local file
if os.environ.get("VERCEL"):
    DB_NAME = "/tmp/quizmind.db"
else:
    DB_NAME = "quizmind.db"

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            correct INTEGER NOT NULL,
            total INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            options TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT,
            topic TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()