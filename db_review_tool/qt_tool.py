import sys
import sqlite3
import unicodedata
from PyQt4 import QtGui


class Window(QtGui.QMainWindow):
    def __init__(self):
        super(Window, self).__init__()
        self.resize(1000, 500)
        self.setWindowTitle('db visualizer')

        self.db_connect = sqlite3.connect('vacancies.sqlite')
        self.cursor = self.db_connect.cursor()
        self.specialisations = {}

        self.spec_view = None
        self.pos_view = None

        self.init_list_views()
        self.fill_specialisations_list_view()
        self.fill_positions_list_view(1)

    def get_specialisations_from_db(self):
        self.cursor.execute('select * from Specialisation')
        return self.cursor.fetchall()

    def get_positions_by_id_from_db(self, id):
        self.cursor.execute('select title from Position where specialisation=?', (id,))
        return self.cursor.fetchall()

    def init_list_views(self):
        self.spec_view = QtGui.QListView(self)
        self.spec_view.resize(150, 500)

        self.pos_view = QtGui.QListView(self)
        self.pos_view.resize(750, 500)
        self.pos_view.move(150, 0)

    def fill_specialisations_list_view(self):
        model = QtGui.QStandardItemModel()

        data = self.get_specialisations_from_db()
        for item in data:
            name = unicodedata.normalize('NFKD', item[1]).encode('ascii', 'ignore')
            self.specialisations[name] = item[0]
            list_item = QtGui.QStandardItem(name)
            model.appendRow(list_item)

        self.spec_view.setModel(model)
        self.spec_view.clicked.connect(self.click_handler)

    def click_handler(self, index):
        spec_name = str(index.model().data(index, 0).toString())
        print 'Select', self.specialisations[spec_name], spec_name

        self.fill_positions_list_view(self.specialisations[spec_name])

    def fill_positions_list_view(self, id):
        model = QtGui.QStandardItemModel()

        data = self.get_positions_by_id_from_db(id)
        for item in data:
            name = unicodedata.normalize('NFKD', item[0]).encode('ascii', 'ignore')
            list_item = QtGui.QStandardItem(name)
            model.appendRow(list_item)

        self.pos_view.setModel(model)

app = QtGui.QApplication(sys.argv)
gui = Window()
gui.show()
sys.exit(app.exec_())


