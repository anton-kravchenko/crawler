from db_handler import DbHandler
from page_handler import PageHandler
from set_up_settings import SetUp
from specialisations_handler import SpecialisationsHandler


def main():
    set_up = SetUp('./setup.json')
    db_handler = DbHandler(set_up.get_db_name()).init_database()
    specialisations_handler = SpecialisationsHandler(set_up.get_specialisations(),
                                                     db_handler.get_db_connect(), db_handler.get_cursor())

    page_handlers = []
    for source in set_up.get_sources():
        page_handlers.append(PageHandler(source, specialisations_handler, db_handler.get_db_connect(), db_handler.get_cursor()))

    for page in page_handlers:
        page.grep_data()

if __name__ == "__main__":
    main()

#TODO: parse setup file
#TODO remove code duplicates
#TODO log to file
#TODO make field for positions count (load from field in search page)
#TODO make field for pages count
#TODO load from all pages
