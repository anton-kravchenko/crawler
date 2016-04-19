define([
	'jquery',
	'underscore',
	'text!./templates/app_template.html',
	'text!./templates/landingTemplate.html',
	'text!./templates/sign_in_template.html',
	'text!./templates/sign_up_template.html',
	'text!./templates/main_view_template.html',
	'text!./templates/new_customer_template.html',
	'text!./templates/sign_in_up_buttons.html',
	'text!./templates/edit_popup_template.html',
	'text!./templates/new_project_popup_template.html',
	'text!./templates/new_task_template.html',
	'text!./templates/header_template.html',
	'text!./templates/issue_item_template.html',
	'text!./templates/detailed_issue_view_template.html',
	'text!./templates/projects_dropdown_item.html'

], function ($, _, 	app_template,
					landing_template,
					sign_in_template,
					sign_up_template,
					main_view_template,
					new_customer_template,
					sign_in_up_buttons,
					edit_popup_template,
					new_project_popup_template,
					new_task_template,
					header_template,
					issue_item_template,
					detailed_issue_view_template,
					projects_dropdown_item
	) {

	return {
		app_template : _.template(app_template),
		landing_template : _.template(landing_template),
		sign_in_template : _.template(sign_in_template),
		sign_up_template : _.template(sign_up_template),
		main_view_template : _.template(main_view_template),
		new_customer_template : _.template(new_customer_template),
		sign_in_up_buttons : _.template(sign_in_up_buttons),
		edit_popup_template : _.template(edit_popup_template),
		new_project_popup_template : _.template(new_project_popup_template),
		new_task_template : _.template(new_task_template),
		header_template : _.template(header_template),
		issue_item_template : _.template(issue_item_template),
		detailed_issue_view_template : _.template(detailed_issue_view_template),
		projects_dropdown_item : _.template(projects_dropdown_item)
	} 
});
 