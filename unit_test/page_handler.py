from abstract_page_handler import *


class PageHandler(AbstractPageHandler):
    def __init__(self, source_set_up, specialisations_handler, db_connect, cursor):
        AbstractPageHandler.__init__(self, source_set_up, specialisations_handler, db_connect, cursor)
        self.put_label_to_db()

    def grep_data(self):
        self.grep_positions_for_specialisation()

    def put_label_to_db(self):
        self.cursor.execute('INSERT OR IGNORE INTO Source (name) VALUES ( ? )', (self.label, ))
        self.db_connect.commit()
        self.cursor.execute('SELECT id FROM Source WHERE name=?', (self.label, ))
        self.label_index = int(self.cursor.fetchone()[0])

    def grep_positions_for_specialisation(self):
        specialisation_items = self.specialisations_handler.get_specialisations()
        for specialisation in specialisation_items:
            param = urllib.urlencode({self.search_key: specialisation})
            url = (self.root_url+'?%s' % param)

            if self.use_key_as_param is False:
                param = urllib.pathname2url(specialisation)
                url = (self.root_url+'%s' % param)

            print 'Retrieving ', url
            raw_page = urllib.urlopen(url)
            document = PyQuery(raw_page.read())
            document(self.root_el).each(lambda i, item: self.store_position(specialisation, PyQuery(item)
                                                                            .find(self.child_el).text()))

            specialisation_id = self.cursor.execute('SELECT id FROM Specialisation WHERE name=? ',
                                                    (specialisation,)).fetchone()[0]

            self.db_connect.commit()
            self.cursor.execute('SELECT COUNT(*) FROM Position WHERE specialisation=? AND source=?',
                                (specialisation_id, self.label_index))

            print self.cursor.fetchone()[0], 'items retrieved for', specialisation

        self.cursor.execute('SELECT COUNT(*) FROM Position WHERE source=?',
                                (self.label_index, ))

        print 'RESULTS FROM', self.label, ':', self.cursor.fetchone()[0], 'items retrieved\n'

    def store_position(self, specialisation, position):
        specialisation_id = self.cursor.execute('SELECT id FROM Specialisation WHERE name=?',
                                                (specialisation,)).fetchone()[0]

        self.cursor.execute('INSERT OR IGNORE INTO Position(specialisation, title, source) VALUES(?, ?, ?)',
                            (specialisation_id, position, self.label_index))
