-----------onload client Script---------------
//Make all fields on child incident readonly So can only users modify parent incident.
function onLoad(){
if(g_form.getValue('parent_incident' !=''))
g_form.disable();
}

----------onChange client Script-------------
//When priority changes, automatically update the impact field.
funtion onChange(control, oldValue, newValue, isLoading){
//So basically, (control, oldValue, newValue, isLoading) = "what field changed, what was the value before, what is it now, and did this happen during form load?"
if (isLoading || newValue ===’ ’) {
  return;
}
switch(newValue){
  case ‘1’: g_form.setValue(‘impact’, ‘1’);
  break;
  case ‘2’: g_form.setValue(‘impact’, ‘2’);
  break;
  default: g_form.setValue(‘impact’,’3 ’)
}
}



------onCellEdit client Script---------- 
//Prevent state change to’closed’ in incident List
funtion onCellEdit(sysIDs, table, oldValue, newValue, callback) {
var saveAndClose = true;
if(newValue = 7){
alert(“you cannot change the state to ‘closed’ from the list view. Please use the form”);
saveAndClose = false;
}
callback(saveAndClose);
//callback → A function you must call when your custom logic finishes, so that ServiceNow knows the edit is complete and can refresh the list accordingly.
}


------OnSubmit client Script---------- 
//Ensuring due date is after start Date
function onSubmit() {
  var startDate = g_form.getValue('start_date');
  var dueDate = g_form.getValue('due_date');
  var startDateObj = new Date(startDate);
  var dueDateObj = new Date(dueDate);
  if (dueDateObj < startDateObj) {
    g_form.addErrorMessage('Due Date cannot be earlier than Start Date.');
    return false; 
  }
  return true;
}


--------->How to Hide Category and Subcategory for ITIL Users at the Form Level in ServiceNow?
if (g_user.hasRole('itil')) {
    g_form.setDisplay('category', false);
    g_form.setDisplay('subcategory', false);
}



--------->Create a new field date and add validation for the date field so that it takes only future date.
config -form design -Add date field:
funtion onChange(control, oldValue, newValue, isLoading){
if(isLoading || newValue ===' ')
Return;
}
var selectedDate = new Date(newValue);
var today = new Date();
today.setHours(0,0,0,0);
if(selectedDate <= today) {
g_form.showFieldMsg(‘date’, ‘Date must be in the future.’ , ‘error’);
g_form.setValue(‘date’,' ');
}
}



-------->Make assignment group and assigned to fields editable only to admin and incident manager. For others, these fields should be read-only
funtion onLoad(){
if(!g_user.hasRoleExactly(‘admin’) || !g_user.hasRoleExactly(‘incident_manager’)){
g_form.setReadOnly(‘assigment_group’, true);
g_form.setReadOnly(‘assigned_to’, true);
}
}



------>Make all the fields read-only on the incident form when the state changes to Closed.
onChange Client script, Field name: State
if(newValue==’7’){
var fields = g_form.getEditableFields();
for(var x= 0;x<fields.length;x++){
g_form.setReadOnly(fields[x], true);
}
} 


-------->if You want to implement the same scenerios for onLoad and onChange.
•	Write onChange Client Script
•	Write-down your onload script inside if (isLoading || newValue === '').
•	Write-down your onchange code outside if (isLoading || newValue === ''). 
⚠️ “If the form is still loading, or the new value is blank, then stop running the rest of the script.”



-------->Change the number field background colour of the incident if the priority is Critical
function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') return;
    var element = g_form.getElement('number');
    element.style.backgroundColor = (newValue == '1') ? 'red' : 'white';
}
//isTemplate → A boolean that tells you if the field value is being set by applying a template (a predefined set of values).








