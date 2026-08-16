```call from async business Rule```
    
(function executeRule(current, previous /* null when async */) {

    if (!current.u_jira_id) {

        try {

            // Create REST Message V2 object
            var r = new sn_ws.RESTMessageV2();
            // Get token from system property
            var token = gs.getProperty("jira.api.token");
            // HTTP configuration
            r.setHttpMethod("POST");
            r.setEndpoint("https://reqres.in/api/users?page=2");
            // Authentication
            r.setBasicAuth("example@gmail.com", token);
            // Headers
            r.setRequestHeader("Accept", "application/json");
            r.setRequestHeader("Content-Type", "application/json");

            // Request body
            var requestBody = {
                name: current.short_description + "",
                description: current.description + ""
            };

            r.setRequestBody(JSON.stringify(requestBody));

            // Execute request
            var response = r.execute();

            var statusCode = response.getStatusCode();
            var responseBody = response.getBody();

            gs.info("Jira Response Status: " + statusCode);
            gs.info("Jira Response Body: " + responseBody);

            // Success
            if (statusCode == 201) {
                var responseObj = JSON.parse(responseBody);
                current.u_jira_key = responseObj.key;
                current.u_jira_id = responseObj.id;
                current.u_is_jira_successfull = true;
                current.update();
                gs.addInfoMessage( "Jira Issue created successfully: " + responseObj.key  );
            } else {
                gs.error( "Jira issue creation failed. Status: " +   statusCode + " Response: " + responseBody );
            }

        } catch (ex) {
            gs.error(  "Error while creating Jira issue: " + ex.message );
            gs.addErrorMessage( "Unexpected error while creating the Jira issue." );
        }

    } else {
        gs.info( "Jira Issue already created, no need to create another Jira issue." );
    }

})(current, previous);



'''  Scripted rest API  '''
(function process( request reponse) {

var body = request. body.data; //body from jira
var jiraId = body.issue.id;
var summary = body.issue.issue.fields.summary; // from jira that contains short description

var grincident = new Gliderecord("incident");
grincident.addQuery("u_jira_id",jiraid);
grincident.query();
if(grincident.next()){
    grincident.short_description = summary;
    grincident.update();
    
}
    
})(request, response)


//Script include to make OAuth 2.0 dynamic
var DynamicTokenUtils = Class.create();
DynamicTokenUtils.prototype = {
    initialize: function() {
    },

    getDynamicToken: function() {
        try {
            // Instantiate the OAuth client
            var client = new sn_auth.GlideOAuthClient();
            
            // "My_OAuth_Registry_Name" matches the 'Name' of your Application Registry record
            // "password" or "client_credentials" matches your provider's grant type
            var tokenRequest = new sn_auth.GlideOAuthClientRequest();
            tokenRequest.setGrantType("client_credentials"); 
            
            // Request the token dynamically
            var tokenResponse = client.requestTokenByRequest("My_OAuth_Registry_Name", tokenRequest);
            
            if (tokenResponse) {
                var token = tokenResponse.getToken();
                var accessToken = token.getAccessToken();
                var expiresIn = token.getExpiresIn();
                
                gs.info("Successfully fetched dynamic token. Expires in: " + expiresIn + " seconds.");
                return accessToken;
            }
        } catch (ex) {
            gs.error("Error generating dynamic OAuth token: " + ex.getMessage());
        }
        return null;
    },

    type: 'DynamicTokenUtils'
};


// Call that Script include from Async bussiness rule
var tokenUtil = new DynamicTokenUtils();
var dynamicToken = tokenUtil.getDynamicToken();

if (dynamicToken) {
    var request = new sn_wrapper.RESTMessageV2();
    request.setEndpoint("https://external-service.com");
    request.setMethod("GET");
    
    // Dynamically inject the bearer token into the Authorization Header
    request.setRequestHeader("Authorization", "Bearer " + dynamicToken);
    
    var response = request.execute();
    var responseBody = response.getBody();
    gs.info(responseBody);
}
