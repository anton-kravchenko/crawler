import json
import sys


class Source:
    def __init__(self, label, root_url, search_url, add_root_url_to_link, search_key, use_key_as_param,
                 root_el, child_el, link_el, pos_amount_el, pages_holder_el, next_page, load_all_pages):
        self.label = label
        self.root_url = root_url
        self.search_url = search_url
        self.add_root_url_to_link = True
        self.search_key = search_key
        self.use_key_as_param = True
        self.grep_query = SearchQuery(root_el, child_el, link_el, pos_amount_el, pages_holder_el, next_page)
        self.load_all_pages = True

        if str(use_key_as_param) == 'false':
            self.use_key_as_param = False

        if str(add_root_url_to_link) == 'false':
            self.add_root_url_to_link = False

        if str(load_all_pages) == 'false':
            self.load_all_pages = False


class SearchQuery:
    def __init__(self, root_el, child_el, link_el, pos_amount_el, pages_holder_el, next_page):
        self.root_el = root_el
        self.child_el = child_el
        self.link_el = link_el
        self.pos_amount_el = pos_amount_el
        self.pages_holder_el = pages_holder_el
        self.next_page = next_page


class SetUp:
    def __init__(self, set_up_file='./setup.json'):
        self.set_up_file = set_up_file

        self.db_name = 'data.sqlite'
        self.db_overwrite = False
        self.sources = []
        self.specialisations = []
        self.set_up_is_valid = True

        self.load_set_up()
        self.is_set_up_valid()

    def load_set_up(self):
        try:
            with open(self.set_up_file) as raw_set_up_data:
                set_up_data = json.load(raw_set_up_data)

                if len(set_up_data.keys()) > 0:
                    self.process_set_up_data(set_up_data)
                else:
                    print 'ERROR : setup file is not valid'
        except Exception:
            sys.exit('ERROR: set_up file not found')

    def is_set_up_valid(self):
        if self.set_up_is_valid is False:
            sys.exit('ERROR: setup file is not valid')

    def process_set_up_data(self, set_up_data):
        self.process_db_set_up(set_up_data['db'])
        self.process_sources_set_up(set_up_data['sources'])
        self.process_specialisations_set_up(set_up_data['specialisations'])

    def process_db_set_up(self, db_settings):
        if db_settings is not None:
            if db_settings['db_name'] is not None:
                self.db_name = db_settings['db_name']
            else:
                print 'INFO: db_name is not specified, using default: db_name=?' % self.db_name

            if db_settings['db_overwrite'] is not None:
                if str(db_settings['db_overwrite']) == 'true':
                    self.db_overwrite = True
                else:
                    self.db_overwrite = False
            else:
                print 'INFO: overwrite_db is not specified, using default: overwrite_db=?' % self.db_name
        else:
            print 'INFO: db settings is not specified, using defaults: db_name=?, overwrite_db=?' \
                  % self.db_name, self.db_overwrite

    def process_sources_set_up(self, sources):
        if sources is not None and len(sources) > 0:
            for source in sources:
                if source['include'] == 'true':
                    self.sources.append(Source(source['label'],
                                               source['root_url'],
                                               source['search_url'],
                                               source['add_root_url_to_link'],
                                               source['search_key'],
                                               source['use_key_as_param'],
                                               source['grep_query']['root_el'],
                                               source['grep_query']['child_el'],
                                               source['grep_query']['link_el'],
                                               source['grep_query']['pos_amount_el'],
                                               source['grep_query']['pages_holder_el'],
                                               source['grep_query']['next_page'],
                                               source['load_all_pages']))
        else:
            print 'ERROR: sources are note specified. Can\'t perform searching'

    def process_specialisations_set_up(self, specialisations):
        if specialisations is not None and len(specialisations) > 0:
            for item in specialisations:
                if item['include'] == 'true':
                    self.specialisations.append(str(item['type']))
        else:
            print 'ERROR: specialisations are not specified. Can\'t perform search.'
            self.set_up_is_valid = False

        if len(self.specialisations) is 0:
            print 'ERROR: all specialisations are marked with \'include\'=false. Can\'t perform search.'
            self.set_up_is_valid = False

    def get_db_name(self):
        return self.db_name

    def get_db_overwrite_flag(self):
        return self.db_overwrite

    def get_sources(self):
        return self.sources

    def get_specialisations(self):
        return self.specialisations
