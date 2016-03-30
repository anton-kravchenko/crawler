class SpecialisationsHandler:
    def __init__(self, specialisations, db_connect, cursor):
        self.specialisations = specialisations
        self.db_connect = db_connect
        self.cursor = cursor
        self.store_specialisations(specialisations)

    def store_specialisations(self, specialisations):
        for item in specialisations:
            self.cursor.execute('INSERT OR IGNORE INTO Specialisation (name) VALUES ( ? )', (item, ))

        self.db_connect.commit()

    def get_specialisations(self):
        return self.specialisations
