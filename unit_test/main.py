from db_handler import DbHandler
from page_handler import PageHandler
from set_up_settings import SetUp
from specialisations_handler import SpecialisationsHandler


def main():
    set_up = SetUp('./setup.json')
    db_handler = DbHandler(set_up).init_database()
    specialisations_handler = SpecialisationsHandler(set_up.get_specialisations(),
                                                     db_handler.get_db_connect(), db_handler.get_cursor())

    page_handlers = []
    for source in set_up.get_sources():
        page_handlers.append(PageHandler(source, specialisations_handler, db_handler.get_db_connect(),
                                         db_handler.get_cursor()))

    for page in page_handlers:
        page.grep_data()

if __name__ == "__main__":
    main()

# TODO log to file
# TODO make field for positions count (load from field in search page)
# TODO make field for pages count
# TODO load text for positions
# TODO find the way to load only useful info about position
# TODO do not store same positions
# TODO load from all pages
# TODO: update qt tool
# TODO create tool for editing and creating of set_up files
# TODO think about operates service from android
# TODO properly handle exceptions in parser
# TODO handle empty selectors
# TODO handle db errors
