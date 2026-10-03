-----------Count catalog items not been used in last 12 months------------
var unusedCount = 0;
var catItem = new GlideRecord('sc_cat_item');
catItem.query();
while (catItem.next()) {
    var req = new GlideRecord('sc_req_item');
    req.addQuery('cat_item', catItem.sys_id);
    req.addQuery('opened_at', '>=', gs.daysAgoStart(365));
    req.setLimit(1); 
    req.query();
    if (!req.hasNext()) {
        unusedCount++;
    }
}
gs.print("Catalog items not used in last 12 months: " + unusedCount);


-------------Count and display incident categories (groupBy) from incident table (use GlideAggregate)
var ga = new GlideAggregate('incident');
ga.addAggregate('COUNT');
ga.groupBy('category');
ga.query();

while (ga.next()) {
    var category = ga.getDisplayValue('category'); // More readable
    var count = ga.getAggregate('COUNT');
    gs.print(category + ' => ' + count);
}


------------Recent 10 incident numbers which are linked to Problem record & never got reassigned
var gr = new GlideRecord("incident");
gr.addNotNullQuery("problem_id");        
gr.addQuery("reassignment_count", 0);    
gr.orderByDesc("sys_created_on");        
gr.setLimit(10);
gr.query();
while (gr.next()) {
    gs.print(gr.number);
}


------------------Print the incident updated today(1), without if/while loop-----------
var gr = new GlideRecord(‘incident’);
gr.addQuery(sys_updated_on);
gr.query();
gr.next()&&gs.print(gr.number);


-----------------print the incident updated today state wise and print the state also--------
var gr = new GlideAggregate('incident');
var today = gs.beginningOfToday();
gr.addQuery('sys_updated_on', '>=', today);
gr.addAggregate('COUNT', 'state');
gr.groupBy('state');
gr.query();
while (gr.next()) {
    gs.print(gr.getDisplayValue('state') + ' count is ' + gr.getAggregate('COUNT', 'state'));
}

----------------Find duplicate users in sys_user by 'name' and delete extras------------------
var seenNames = {};
var grUser = new GlideRecord('sys_user');
grUser.orderBy('name'); // Ensures consistent ordering
grUser.query();
while (grUser.next()) {
    var userName = grUser.name.toString().trim();
    if (seenNames[userName]) {
        gs.print('Deleting duplicate user: ' + userName + ' | Sys ID: ' + grUser.sys_id);
        grUser.deleteRecord();
    } else {
        seenNames[userName] = true; // First occurrence is kept
    }
}
gs.print('Duplicate cleanup complete.');

---------------Check If a Record Has Attachments and Build a Link--------------
var attachment_link = ' ';
var rec = new GlideRecord('sc_req_item');
rec.addQuery('sys_id', current.request_item);
rec.query();
if (rec.next()) { 
    if (rec.hasAttachments()) {
        attachment_link = gs.getProperty('glide.servlet.uri') + rec.getLink();
    }
}


---------------Check which all incident having attachment-----------------
var grIncident = new GlideRecord('incident');
    grIncident.query();
    while (grIncident.next()) {
        var hasAttachment = false;
        // Check sys_attachment table for this incident
        var grAttach = new GlideReord('sys_attachment');
        grAttach.addQuery('table_name', 'incident');
        grAttach.addQuery('table_sys_id', grIncident.sys_id);
        grAttach.query();
        if (grAttach.hasNext()) {
            hasAttachment = true;
        }
        gs.print(
            grIncident.number + ' | Has Attachments: ' + (hasAttachment ? 'Yes' : 'No')
        );
}


-------------------Need latest 10 records from Incident table, Priority is Critical, State is Resolved, Category is Network.
var gr = new GlideRecord(‘incident’);
gr.addQuery(sys_updated_on);
gr.addQuery(‘priority’,1);
gr.addQuery(‘state’, 6);
gr.addQuery(‘category’,’Network’);
gr.setLimit(10);
gr.query();
while(gr.next())
{
   gs.print(‘incident number=’+gr.number+’, Short description=’+gr.short_description);
}


--------------------Print the incident number which assigned to you recently with if and else loop--------------------
var gr = new GlideRecord(‘incident’);
gr.addQuery(sys_updated_on);
gr,addQuery(‘assigned_to’,gs. getUserID);
gr.setLimit(1);
gr.query();
if(gr.next())
{
    gs.print(gr.number);
}

---------------------Close the incident which are resolved in last 7 days--------------------
var gr = new GlideRecord(‘incident’);
gr.addQuery(‘state’, 6);
gr.addQuery(sys_updated_on, ‘>=’, gs.daysgoStart(7);
gr.query();
while(gr.next())
{
gr.state= 7;
gr.update();
}


-------------------ServiceNow Script to Assign Active Network Incidents with Missing Assignment Group--------------
var groupGR = new GlideRecord('sys_user_group');
groupGR.addQuery('name', 'IT Team');
groupGR.query();
if (groupGR.next()) {
    var itTeamSysId = groupGR.getUniqueValue();
    var gr = new GlideRecord('incident');
    gr.addQuery('category', 'network');
    gr.addQuery('active', true);
    gr.addNullQuery('assignment_group');      // Only if assignment group is empty
    gr.addNullQuery('assignment_duration');   // Only if assignment duration is empty
    gr.query();
    var incCount = 0;
    while (gr.next()) {
        gr.setWorkflow(false); // Disable workflow for silent update
        gr.assignment_group = itTeamSysId;
        gr.update();
        incCount++;
    }
    gs.info('✅ Total incidents updated and assigned to IT Team: ' + incCount);
} else {
    gs.error('❌ IT Team group not found.');
}



----------------Count of Incidents by Assigned User------------------------------
var gr = new GlideAggregate('incident');
gr.addAggregate('COUNT');
gr.groupBy('assigned_to');
gr.query();

while (gr.next()) {
    var assignedTo = gr.getValue('assigned_to'); // sys_id
    var assignedToDisplay = gr.getDisplayValue('assigned_to'); // name or blank
    var count = gr.getAggregate('COUNT');

    if (assignedTo) {
        gs.print('Assigned to: ' + assignedToDisplay + ' | Count: ' + count);
    } else {
        gs.print('Assigned to: [Unassigned] | Count: ' + count);
    }
}



----------------Incident that are assigned to me recently------------------------------
var currentUser = gs.getUserID();
var gr = new GlideRecord('incident');
gr.addQuery('assigned_to', currentUser);
gr.orderByDesc('sys_created_on');
gr.setLimit(10);
gr.query();
if (!gr.hasNext()) {
    gs.info('No incidents assigned to you.');
} else {
    gs.info('Recent incidents assigned to you:');
    while (gr.next()) {
        gs.info('Incident: ' + gr.getValue('number') +
                ' | Short Description: ' + gr.getValue('short_description') +
                ' | Created On: ' + gr.getDisplayValue('sys_created_on'));
    }
}


--------------Update the records of resolved state incidents to closed state how can do this-------------------
 var gr = new GlideRecord('incident');
 gr.addQuery('state', 6);
 gr.query();
 while(gr.next()){
 gr.state= '7';
 gr.setWorkflow(false);
 gr.update();
}


-------------Print Incidents That Have Attachment----------------------
 var inc =  new GlideRecord('incident');
inc.query();
while(inc.next()){
var att = new GlideRecord('sys_attachment');
att.addQuery('table_name','incident');
att.addQuery('table_sys_id',inc.sys_id);
att.query();
if(att.hasNext()){
gs.info("Incident Number:" + inc.number);
}


---------------Print list of problem record that are assigned to me logged in user , check if logged user have write access, return the number,
var userID = gs.getUserID(); // Logged-in user's sys_id
var count = 0;
var gr = new GlideRecord('problem');
gr.addQuery('assigned_to', userID);
gr.query();
while (gr.next()) {
    if (gr.canWrite()) {
        count++;
    }
}
gs.info('User ' + userID + ' has write access to ' + count + ' Problem records assigned to them.');


--------------We need to close the incident which are resolved in last 7 days in serviceNow------------------
var gr = new GlideRecord('incident');
gr.addQuery('state', ‘6’);
gr.addQuery('sys_updated_on', '>=', gs.daysAgoStart(7));
gr.query();
while (gr.next())
    gr.state = 7; 
    gr.update();
}


----------------Write a script to print a incident number of category or network----------------------
var gr = new GlideRecord('incident');
gr.addQuery('category', 'network');
gr.query();
while (gr.next()) 
{    gs.print('Incident number: ' + gr.getValue('number'));
}



----------------Script to close 100 incident that were created last year are still in the work in progress state
var gr = new GlideRecord('incident');
gr.addQuery('sys_created_on', '>=', gs.daysAgoStart(365));
gr.setLimit(100);
gr.query();
var count = 0;
while (gr.next()) {
    gr.state = 7; // 7 = Closed
    gr.close_code = 'Solved (Permanently)'; // or choose an appropriate close code
    gr.close_notes = 'Auto-closed by script due to inactivity.';
    gr.update();
    count++;
}
gs.print('Closed ' + count + ' incident(s) from last year.');


------------Write a script to print the list of active incident as per assignment group------------
var gr= new GlideAggregate("incident");
gr.addQuery("active",true);
gr.addAggregate("COUNT");
gr.groupBy("assignment_group");
gr.query();
while(gr.next()){
 var countOf=gr.getAggregate("COUNT");
 var groupName=gr.getDisplayValue("assignment_group");
 gs.print(groupName+' :  '+countOf);
}


------------------write a background script that will show how many roles the current logged in user have------------------
var userId = gs.getUserID(); // Get the current user's sys_id
var user = new GlideRecord('sys_user');
if (user.get(userId)) {
    var roleGr = new GlideRecord('sys_user_has_role');
    roleGr.addQuery('user', userId);
    roleGr.query();
    var count = 0;
    while (roleGr.next()) {
        count++;
    }
    gs.print('User: ' + user.name + ' has ' + count + ' role(s).');
} else {
    gs.print('User not found.');
}



---------------------Write a script to print all the incidents related to problem using script------------------------
var grINC = new GlideRecord('incident'); // Glide all the incidents from incident table
grINC.addNotNullQuery('problem_id'); // Filter incidents that ARE related to a problem
grINC.query(); 
while (grINC.next()) {
    gs.info('Incident Number: ' + grINC.getValue('number')); // Print incident number
}

------------Setting a GlideRecord Variable to Null--------------------------
var gr1 = new GlideRecord('incident'); 
gr1.query(); 
while(gr1.next()) 
{ 
    gr1.priority = "NULL"; 
    gr1.update(); 
}



------------ 𝐢𝐬 it 𝐩𝐨𝐬𝐬𝐢𝐛𝐥𝐞 𝐭𝐨 𝐮𝐩𝐝𝐚𝐭𝐞 𝐚 𝐫𝐞𝐜𝐨𝐫𝐝 𝐰𝐢𝐭𝐡𝐨𝐮𝐭 𝐮𝐩𝐝𝐚𝐭𝐢𝐧𝐠 𝐢𝐭𝐬 𝐬𝐲𝐬𝐭𝐞𝐦 𝐟𝐢𝐞𝐥𝐝𝐬(𝐥𝐢𝐤𝐞 𝐬𝐲𝐬_𝐮𝐩𝐝𝐚𝐭𝐞𝐝_𝐛𝐲, 𝐬𝐲𝐬_𝐮𝐩𝐝𝐚𝐭𝐞𝐝_𝐨𝐧)---------------
var gr = new GlideRecord(‘incident’);
gr.query();
if(gr.next()){
gr.autosysfields(false);
short_description = “Testing”;
gr.update();
}


----------------Prevent users from changing the priority field manually------------------------
//When to Run: before Update, Table: incident
if (current.priority != previous.priority) {
gs.addErrorMessage("Priority cannot be changed manually.");
current.priority = previous.priority;
}


-------------------write a business rule for incident table that if an user is having ITIL role,then he can see all the inactive incidents.
//When to run->Before, Query BR Advanced
if (gs.hasRole('itil'))
{
   current.addQuery('active', true);   // For non-ITIL users, limit to only active incidents
} 


---------------------Write a background script to resolve all low-priority incidents that are in the InProgress state,
var gr = new GlideRecord('incident');
gr.addEncodedQuery('state=2^priority=4'); 
gr.query();
while (gr.next()) {
    gr.state = 4; 
    gr.resolution_code = 'Resolved by Background Script';
    gr.update();
}
gs.print('All low-priority In Progress incidents have been resolved.');

-------------------How to restrict user from submitting form without attachment--------------
//Before insert BR
var gr= new GlideRecord("sys_attachment");
gr.addQuery("table_sys_id",current.sys_id);
gr.query();
if (!gr.hasNext()) {
gs.addErrorMessage("Attachment is required to submit this Request");
current.setAbortAction(true);
}


----------------When a new task is created, auto-assign it to the "IT Support" group if no assignment group is set. 
//before insertBR
if (!current.assignment_group) {
    var group = new GlideRecord('sys_user_group');
    group.addQuery('name', 'IT Support');
    group.query();
    if (group.next()) {
        current.assignment_group = group.sys_id;
    }
}


--------------------If an incident is assigned to a user, check if the user is in the "IT Support" group before allowing assignment.
if (current.assigned_to) {
    var userID = current.assigned_to;
    var group = new GlideRecord('sys_user_grmember');
    group.addQuery('user', userID);
    group.addQuery('group.name', 'IT Support');
    group.query();
    if (!group.next()) {
        gs.addErrorMessage('Assigned user must be a member of the IT Support group.');
        current.setAbortAction(true);
    }
}



-----------------Find Problems with Related Incidents (Using addJoinQuery)
// Query Problems that have at least one related Incident
var prob = new GlideRecord('problem');
prob.addJoinQuery('incident'); // Joins with 'incident' table via reference
prob.query();
while (prob.next()) {
    gs.print('Problem Number: ' + prob.number);
}



------------------Find Inactive Problems with Active Associated Incidents
var gr = new GlideRecord('problem');
var grSQ = gr.addJoinQuery('incident');
gr.addQuery('active', 'false');
grSQ.addCondition('active', 'true');
gr.query();
while (gr.next()) {
    gs.print(gr.getValue('number'));
}



----------------Find Problems Where opened_by Matches Incident's caller_id
var gr = new GlideRecord('problem');
gr.addJoinQuery('incident', 'opened_by', 'caller_id');
gr.query();
while (gr.next()) {
    gs.print('Problem Number: ' + gr.getValue('number'));
}



--------------Use addOrCondition() to Query with OR Logic in GlideRecord-----------------
var gr = new GlideRecord('incident');
var qc = gr.addQuery('category', 'hardware');
qc.addOrCondition('category', 'software');
gr.addQuery('priority', '1');
gr.query();
while (gr.next()) {
    gs.print(gr.number);
}


-------------------Check If Current User Can Delete an Attachment (Using GlideSecurityManager)
var att = new GlideRecord('sys_attachment');
att.get('$[sys_attachment.sys_id]');  // Get the attachment record by sys_id
var sm = GlideSecurityManager.get(); // Get the security manager instance
var checkMe = 'record/sys_attachment/delete'; // Define the permission to check
var canDelete = sm.hasRightsTo(checkMe, att); // Check if the user has delete rights on the attachment
gs.log('canDelete: ' + canDelete); 



---------------Check if a Role Exists in a Specific User Group---------------------
var group = new GlideRecord('sys_user_group'); // Targeting user groups
group.addQuery('name', 'GROUP_NAME');          // Find group by name
group.setLimit(1);                             // Limit to one result
group.query();
if (group.next()) {
  if (gs.hasRoleInGroup('role_name', group)) {
    gs.print('User has role in group');
  } else {
    gs.print('User does NOT have role in group');
  }
}

-------------------Count Number of Records in a Table Using GlideAggregate---------------------
var count = new GlideAggregate('incident');       
count.addAggregate('COUNT');                      
count.query();                                    
var incidents = 0;                                
if (count.next())  {                             
    incidents = count.getAggregate('COUNT');      
    gs.print("Total incidents: " + incidents);        
};


------------Count Active Incidents Using GlideAggregate--------------------------
var count = new GlideAggregate('incident');       
count.addQuery('active', 'true');                 
count.addAggregate('COUNT');                      
count.query();                                    
var incidents = 0;                                
if (count.next())                                 
incidents = count.getAggregate('COUNT');      
gs.print("Active incidents: " + incidents);       



------------------Count of Open Incidents Grouped by Category----------
var count = new GlideAggregate('incident');                   
count.addQuery('active', 'true');                             
count.addAggregate('COUNT', 'category');                      
count.query();                                                
while (count.next()) {
    var category = count.category;                            
    var categoryCount = count.getAggregate('COUNT', 'category'); 
    gs.log("There are currently " + categoryCount + " incidents with a category of " + category);
}



-----------------Multiple Aggregations (MIN, MAX, AVG) on sys_mod_count Grouped by Category------------------
var count = new GlideAggregate('incident');                         
count.addAggregate('MIN', 'sys_mod_count');                         
count.addAggregate('MAX', 'sys_mod_count');                         
count.addAggregate('AVG', 'sys_mod_count');                         
count.groupBy('category');                                          
count.query();                                                      
while (count.next()) {
    var min = count.getAggregate('MIN', 'sys_mod_count');           // Retrieve MIN
    var max = count.getAggregate('MAX', 'sys_mod_count');           // Retrieve MAX
    var avg = count.getAggregate('AVG', 'sys_mod_count');           // Retrieve AVG
    var category = count.category.getDisplayValue();                // Get display value of category

    gs.log(category + " Update counts: MIN = " + min +
           " MAX = " + max + " AVG = " + avg);                      // Log results
}



------------------Compare Incident Category Counts Between Two Previous Months-------------------
var agg = new GlideAggregate('incident');
agg.addAggregate('count', 'category');                                     // Count incidents per category
agg.orderByAggregate('count', 'category');                                 // Order by count
agg.orderBy('category');                                                   // Then order by category
agg.addQuery('opened_at', '>=', 'javascript:gs.monthsAgoStart(2)');        // 2 months ago start
agg.addQuery('opened_at', '<=', 'javascript:gs.monthsAgoEnd(2)');          // 2 months ago end
agg.query();
while (agg.next()) {
    var category = agg.category;
    var count = agg.getAggregate('count', 'category');
    var query = agg.getQuery();                                            // Get query for reuse
    var agg2 = new GlideAggregate('incident');
    agg2.addAggregate('count', 'category');
    agg2.orderByAggregate('count', 'category');
    agg2.orderBy('category');
    agg2.addQuery('opened_at', '>=', 'javascript:gs.monthsAgoStart(3)');   // 3 months ago start
    agg2.addQuery('opened_at', '<=', 'javascript:gs.monthsAgoEnd(3)');     // 3 months ago end
    agg2.addEncodedQuery(query);                                           // Apply previous query
    agg2.query();
    var last = "";
    while (agg2.next()) {
        last = agg2.getAggregate('count', 'category');                     // Get previous month count
    }

    gs.log(category + ": Last month: " + count + " | Previous Month: " + last);
}



---------------Get Distinct Count of Field in Group Query Using GlideAggregate--------------------
var agg = new GlideAggregate('incident');
agg.addAggregate('count');
agg.addAggregate('count(distinct', 'category');
agg.addQuery('opened_at', '>=', 'javascript:gs.monthsAgoStart(2)');
agg.addQuery('opened_at', '<=', 'javascript:gs.monthsAgoEnd(2)');
agg.groupBy('priority');
agg.query();
while (agg.next()) {
    gs.info(
        'Incidents in priority ' + agg.priority + ' = ' +
        agg.getAggregate('count') + 
        ' (' + agg.getAggregate('count(distinct', 'category') + ' categories)'
    );
}



--------------Write a background script for count incident which SLA has been breached------------------
var slaBreached = 0;
var slaGr = new GlideAggregate("task_sla");
slaGr.addQuery("task.sys_class_name", "incident");
slaGr.addQuery("has_breached", true);
slaGr.addAggregate("COUNT");
slaGr.query();
if (slaGr.next()) {
 slaBreached = slaGr.getAggregate("COUNT");
}
gs.print("Count of incidents with breached SLAs: " + slaBreached);



--------------𝐖𝐫𝐢𝐭𝐞 𝐚 𝐁𝐚𝐜𝐤𝐠𝐫𝐨𝐮𝐧𝐝 𝐬𝐜𝐫𝐢𝐩𝐭 𝐜𝐨𝐝𝐞 𝐭𝐨 𝐥𝐢𝐧𝐤 𝐈𝐧𝐜𝐢𝐝𝐞𝐧𝐭 𝐫𝐞𝐜𝐨𝐫𝐝 𝐭𝐨 𝐚 𝐏𝐫𝐨𝐛𝐥𝐞𝐦 𝐫𝐞𝐜𝐨𝐫𝐝------------------------
var gr = new GlideRecord('incident');
gr.addQuery('number','INC0007001');
gr.addNullQuery('problem_id');
gr.query();
while(gr.next()){
 gr.problem_id = "62304320731823002728660c4cf6a7e8"; // Problem sys_id
 gr.update();
}



----------------Write a script to print the list of incident as per assignment group--------------
var gr= new GlideAggregate("incident");
gr.addQuery("active",true);
gr.addAggregate("COUNT");
gr.groupBy("assignment_group");
gr.query();
while(gr.next()){
 var countOf=gr.getAggregate("COUNT");
 var groupName=gr.getDisplayValue("assignment_group");
 gs.print(countOf+’’+ groupName);
}



----------------Examples of Extracting the Contents of an Iterator into an Array------------------
var groupsArray = gs.getUser().getMyGroups().toArray();
function returnCurrentUserGroup(){
 var myUserObject = gs.getUser();
 var myUserGroups = myUserObject.getMyGroups();
 var groupsArray = new Array();
 var it = myUserGroups.iterator();
 var i=0;
 while(it.hasNext()){
 var myGroup = it.next();
 groupsArray[i]=myGroup;
 i++;
 }
 return groupsArray;
}
var test = returnCurrentUserGroup();
gs.print(test[1]);



------------------Query Incidents Visible to an ITIL User in a Specific Domain (Using queryNoDomain)
// From any domain (using queryNoDomain()), look up the incidents that the ITIL user (in the Database Atlanta domain) can see. Expected: incidents with the 'global' or 'Database Atlanta' domain.
var domain = new GlideRecord('sys_user');
domain.addQuery('user_name', 'itil');
domain.queryNoDomain();
if (domain.next()) {
    var domainQuery = new GlideRecord('incident');
    domainQuery.addQuery('active', true);
    domainQuery.addDomainQuery(domain);
    domainQuery.query();
    gs.print('Number of Incidents for ITIL user: ' + domainQuery.getRowCount());
    while (domainQuery.next()) {
        gs.print(domainQuery.number);
    }
}


-----------Accessing Sys IDs from the watch_list Field (Glide List)
var list = current.watch_list.toString();
var array = list.split(",");
for (var i = 0; i < array.length; i++) {
    gs.print("Reference value is: " + array[i]);
}


------------Getting Display Values (User Names) from the watch_list Field-------------
var list = current.watch_list.getDisplayValue();
var array = list.split(",");
for (var i = 0; i < array.length; i++) {
    gs.print("Display value is: " + array[i]);
}

---------------------Purpose of indexOf("searchString") with Glide Lists
var userId = "46d44b5e0a0a3c190053f614c5f3ae63"; // Example sys_id
if (!current.watch_list.nil() && current.watch_list.toString().indexOf(userId) != -1) {
    gs.print("User is in the watch list.");
} else {
    gs.print("User is NOT in the watch list.");
}

-----------User reference field, when we choose a user in one field I want to popup email address in the next field?  
//Use this onChange script on the user field with script include



------------------Create a common mail script for emails that will contain INC number, short description, Priority and configuration item: -
In your email notification body, add: ${mail_script: script_name}
(function runMailScript(current, template, email, email_action, event) {
    template.print("Incident Number: " + current.number + "<br />");
    template.print("Short Description: " + current.short_description + "<br />");
    template.print("Priority: " + current.priority.getDisplayValue() + "<br />");
    template.print("Configuration Item: " + current.cmdb_ci.getDisplayValue() + "<br />");
})(current, template, email, email_action, event);


---------------Problem related to the incident should get displayed in a related list on the incident.
//To show related Problems on an Incident, I created a defined relationship:
// Applies to table: Incident
// Queries from table: Problem
(function refineQuery(current, parent) {
  current.addQuery('sys_id', parent.problem_id);
})(current, parent);



----------------You need to create a UI Action button that, when clicked, will automatically change the state of 
-----------------an incident to "Resolved" and also set the "Resolved by" field to the current user. 
We can write the below script in 𝐔𝐈 𝐀𝐜𝐭𝐢𝐨𝐧.
// 𝐍𝐚𝐦𝐞: XXX    𝐓𝐚𝐛𝐥𝐞: Incident
// 𝐀𝐜𝐭𝐢𝐨𝐧 𝐧𝐚𝐦𝐞: resolve_incident
// 𝐅𝐨𝐫𝐦 𝐁𝐮𝐭𝐭𝐨𝐧: Checked
𝐎𝐧𝐜𝐥𝐢𝐜𝐤: Leave blank (to use the server-side script).
𝐂𝐨𝐧𝐝𝐢𝐭𝐢𝐨𝐧: current.state != 6 (to display the button only if the incident is not already resolved).
if (!gs.hasRole('itil')) {
    gs.addErrorMessage("You do not have permission to resolve incidents.");
    return;
}
current.state = 6;
current.resolved_by = gs.getUserID();
current.resolved_at = new GlideDateTime();
current.update(); 
action.setRedirectURL(current);


-------------------Display duplicate records in any table without using GlideAggregat
(function() {
var duplicates = {}; // object to track occurrences
var gr = new GlideRecord('incident');
gr.query();
// Loop through all recordswhile (gr.next()) {
    var key = gr.short_description.toString(); // field to check duplicates
    if (duplicates[key]) {
        duplicates[key].push(gr.sys_id.toString());
    } else {
        duplicates[key] = [gr.sys_id.toString()];
    }
}
// Print only keys with more than one record (duplicates)
for (var key in duplicates) {
    if (duplicates[key].length > 1) {
        gs.info('Duplicate short_description: ' + key + ' | Sys IDs: ' + duplicates[key].join(', '));
    }
}
})();



---------------Display duplicate records in any table using GlideAggregate--------------------
(function() {
    var ga = new GlideAggregate('incident');
    ga.addAggregate('COUNT', 'short_description');  // count occurrences
    ga.groupBy('short_description');                // group by the field to check duplicates
    ga.query();
    while (ga.next()) {
        var count = parseInt(ga.getAggregate('COUNT', 'short_description'), 10);
        if (count > 1) {
            gs.info('Duplicate short_description: ' + ga.short_description + ' | Count: ' + count);
        }
    }
})();



----------------Background Script to display incident caller_id sort by their count . Display only the top 3 incident callers in servicenow
var agg = new GlideAggregate("incident");
agg.addAggregate("COUNT");
agg.groupBy("caller_id");
agg.orderByAggregate("COUNT");
agg.query();
var i = 0;
while (agg.next() && i < 3) {
    var caller = agg.caller_id.getDisplayValue();
    var count = agg.getAggregate("COUNT");
    gs.print(caller + " | " + count);
    i++;
}

>>>> Using event as trigger, crate an incident. event can be triggered from BR,UI actions or any flow
Create an Event Script (Business Rule → Respond to Event)
(function runEventScript(event, current, previous) {
    // Create new Incident
    var inc = new GlideRecord('incident');
    inc.initialize();

    // You can set dynamic values here based on event params
    inc.short_description = "Incident created from event: " + event.name;
    inc.description = "Triggered by event [" + event.name + "].\n" +
                      "Parm1: " + event.parm1 + "\n" +
                      "Parm2: " + event.parm2;
    inc.caller_id = gs.getUserID(); // current logged in user
    inc.impact = 3; // default values
    inc.urgency = 3;
    inc.insert();

})(event, current, previous);
From a Business Rule
gs.eventQueue("custom.incident.create", current, "Parm1 value", "Parm2 value");


>>>> Background Script using Catalog API
(function() {
    var catAPI = new sn_sc.CatalogAPI();

    // Create a request for a catalog item
    var request = catAPI.createOrderNow(
        'e0d08b13c3330100c8b837659bba8fb4', // Catalog item sys_id
        {
            'requested_for': gs.getUserID(),
            'justification': 'Created from Catalog API'
        }
    );
    if (request) {
        gs.print('Service Request created: ' + request.request_number);
    } else {
        gs.print('Failed to create request');
    }
})();









