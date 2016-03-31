import sqlite3


class DbHandler:
    def __init__(self, set_up):
        self.db_name = set_up.get_db_name()
        self.db_overwrite_flag = set_up.get_db_overwrite_flag()
        self.db_connect = None
        self.cursor = None

    def init_database(self):
        self.db_connect = sqlite3.connect(self.db_name)
        self.cursor = self.db_connect.cursor()
        if self.db_overwrite_flag is True:
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
                    source INTEGER,
                    link TEXT
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
