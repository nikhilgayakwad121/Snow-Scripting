```call from background Script```
(function() {
    try {
        // Create REST MessageV2 object
        var r = new sn_ws.RESTMessageV2();
        r.setHttpMethod("GET");
        r.setEndpoint("https://reqres.in/api/users?page=2");

        // Execute request
        var response = r.execute();
        var responseBody = response.getBody();
        var httpStatus = response.getStatusCode();
        gs.info("HTTP Status: " + httpStatus);

        if (httpStatus == 200) {
            var parsed = JSON.parse(responseBody);

            // Using while loop instead of forEach
            var i = 0;
            while (i < parsed.data.length) {
                var user = parsed.data[i];

                var gr = new GlideRecord("u_users");
                gr.addQuery("u_id", user.id); // prevent duplicates
                gr.query();
                if (gr.next()) {
                    // Update existing record
                    gr.u_email = user.email;
                    gr.u_first_name = user.first_name;
                    gr.u_last_name = user.last_name;
                    gr.u_avatar = user.avatar;
                    gr.update();
                    gs.info("Updated user: " + user.id);
                } else {
                    // Insert new record
                    gr.initialize();
                    gr.u_id = user.id;
                    gr.u_email = user.email;
                    gr.u_first_name = user.first_name;
                    gr.u_last_name = user.last_name;
                    gr.u_avatar = user.avatar;
                    gr.insert();
                    gs.info("Inserted new user: " + user.id);
                }

                i++; // increment counter
            }
        } else {
            gs.error("Failed to fetch API data. Status: " + httpStatus);
        }
    } catch (ex) {
        gs.error("Error: " + ex.message);
    }
})();


```Rest message: API Endpoint, Authentication, Http Query parameter, {resquest body : “sys_id: ${sys_id}”}```
(function executeRule(current, previous){
var r = new sn_ws.RESTMesssageV2(‘Rest Message Name’, ‘Method Name);
r.setStringParameterNoEscape(‘sys_id ’, current.sys_id);
var response = r.execute();
var responseBody = response.getBody();
var httpStatus = response.getStatusCode();
gs.addInfoMessage(“Update – new response status: ”+ httpStatus);

if(httpStatus.toString()==’200’){
                 try{
                 var checkIncident = new sn_ws.RESTMessageV2(‘rest Message Name’, ‘Method Name’);
                  checkIncident.setStringParameterNoEscape(‘sys_id’, current.sys_id);
                  checkIncident.setStringParameterNoEscape(‘short_description’, current.short_description);
                  var checkResponse = checkIncident.execute;
                  var checkResponseBody = checkResponse.getBody();
                  var gethttpStatus = response.getStatusCode();
                  }
                  catch(ex){
                      var message = ex.message;
                  }

})(current, previous);
