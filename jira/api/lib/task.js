function Task(project_name, title, description, type, status, date, priority, parent_issue, sprint_name){

    this.project_name = project_name;
    this.sprint_name = sprint_name;
    this.title = title;
    this.description = description;
    this.type = type;
    this.status = status;
    this.date = date;
    this.priority = priority;
    this.parent_issue = parent_issue;

}

module.exports = Task;