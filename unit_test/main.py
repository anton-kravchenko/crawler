from pyquery import PyQuery
import urllib
import sqlite3

db_connect = sqlite3.connect('vacancies.sqlite')
cursor = db_connect.cursor()
dou_vacancy_url = 'http://jobs.dou.ua/vacancies/'
vacancies = {}


def main():
    init_database()
    check_specialisation_items()
    check_positions_for_specialisation()


def init_database():
    cursor.executescript('''
        DROP TABLE IF EXISTS Specialisation;
        DROP TABLE IF EXISTS Position;

        CREATE TABLE Specialisation (
            id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            name    TEXT UNIQUE
        );

        CREATE TABLE Position (
            id  INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            specialisation  INTEGER,
            title   TEXT
        );
    ''')


def check_specialisation_items():
    print 'Retrieving ', dou_vacancy_url

    raw_page = urllib.urlopen(dou_vacancy_url)
    document = PyQuery(raw_page.read())
    document('select>option').each(lambda i, item: store_specialisation(PyQuery(item).attr('value')))
    print len(cursor.execute('SELECT * FROM Specialisation').fetchall()), 'specialisations retrieved'


def store_specialisation(item):
    if len(item) > 1 and type(item) is str:
        cursor.execute('INSERT OR IGNORE INTO Specialisation (name) VALUES ( ? )', (item, ))
        db_connect.commit()


def check_positions_for_specialisation():
    specialisation_items = cursor.execute('SELECT name FROM Specialisation').fetchall()
    for specialisation in specialisation_items:
        specialisation = str(specialisation[0])
        argument = urllib.urlencode({'category': specialisation})
        url = (dou_vacancy_url+'?%s' % argument)
        print 'Retrieving ', url
        raw_page = urllib.urlopen(url)
        document = PyQuery(raw_page.read())
        document('.vacancy').each(lambda i, item: store_position(specialisation, PyQuery(item).find('.title').text()))

        specialisation_id = cursor.execute('SELECT id FROM Specialisation WHERE name=?', (specialisation,)).fetchone()[0]
        cursor.execute('SELECT COUNT(*) FROM Position WHERE specialisation=?', (specialisation_id,))
        positions_count = cursor.fetchone()[0]
        print positions_count, 'items retrieved for', specialisation


def store_position(specialisation, position):
    specialisation_id = cursor.execute('SELECT id FROM Specialisation WHERE name=?', (specialisation,)).fetchone()[0]
    cursor.execute('INSERT OR IGNORE INTO Position(specialisation, title) VALUES(?, ?)', (specialisation_id, position))
    db_connect.commit()


if __name__ == "__main__":
    main()

