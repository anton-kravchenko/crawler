import sqlite3
import urllib
from pyquery import PyQuery
import re


class AbstractPageHandler:
    def __init__(self, source_set_up, specialisations_handler, db_connect, cursor):
        self.source_set_up = source_set_up
        self.specialisations_handler = specialisations_handler

        self.label = source_set_up.label
        self.label_index = -1

        self.root_url = source_set_up.root_url
        self.search_url = source_set_up.search_url
        self.add_root_url_to_link = source_set_up.add_root_url_to_link
        self.search_key = source_set_up.search_key
        self.use_key_as_param = source_set_up.use_key_as_param

        self.root_el = source_set_up.grep_query.root_el
        self.child_el = source_set_up.grep_query.child_el
        self.link_el = source_set_up.grep_query.link_el
        self.pos_amount_el = source_set_up.grep_query.pos_amount_el

        self.load_all_pages = source_set_up.load_all_pages

        self.db_connect = db_connect
        self.cursor = cursor

    def grep_data(self):
        pass

    def put_label_to_db(self):
        pass

    def check_specialisation_items(self):
        pass

    def grep_positions_for_specialisation(self):
        pass

    def store_position(self, specialisation, position):
        pass
