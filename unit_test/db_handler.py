import sqlite3


class DbHandler:
    def __init__(self, db_name):
        self.db_name = db_name
        self.db_connect = None
        self.cursor = None

    def init_database(self):
        self.db_connect = sqlite3.connect(self.db_name)
        self.cursor = self.db_connect.cursor()
        self.cursor.executescript('''
            DROP TABLE IF EXISTS Specialisation;
            DROP TABLE IF EXISTS Position;
            DROP TABLE IF EXISTS Source;

            CREATE TABLE Specialisation (
                id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                name    TEXT UNIQUE
            );

            CREATE TABLE Position (
                id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                specialisation  INTEGER,
                title   TEXT,
                source INTEGER
            );

            CREATE TABLE Source (
                id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                name TEXT UNIQUE
            );
        ''')
        return self

    def get_db_connect(self):
        return self.db_connect

    def get_cursor(self):
        return self.cursor
