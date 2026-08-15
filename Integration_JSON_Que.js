>>> Have nested JSON, ask them to retrieve any one value if they have good experience in Integrations.
var data = {
  "employee": {
    "id": "E123",
    "name": "John Doe",
    "contact": {
      "email": "john.doe@example.com",
      "phone": "555-1234"
    },
    "skills": [
      {"name": "JavaScript", "level": "Advanced"},
      {"name": "Integration", "level": "Expert"},
      {"name": "Python", "level": "Intermediate"}
    ]
  }
};
// Access nested value
var phoneNumber = data.employee.contact.phone;
console.log(phoneNumber); // Output: 555-1234


>>>>How to parse a JSON?
var rBody = ‘{‘’id”: “2”, “firstName”:”Nikhil”,”lastname”:”Gayakwad”,”photo”:”https://sample_link.com”}’;
var parseJson = JSON.parse(rBody);
var parsedData = parseJson.photo;
gs.print(parsedData);

var rBody=’{\”status\”: \”Work order created Successfully.”,\”,href\”:\”/workforceManagemet/api/v1/workOrders/13432\”}’;
var pJson = pbody.split(‘/’).pop();
gs.print(pJson);
gs.print(lValue);

var rBody= ‘{“a”:”b”:[{“x”:[{“z”:”bc”},{“g”:”yc”}]}’;
//get the value of g
var pbody= JSON.parse(rBody);
var test = pBody.b[0].x[1].g;
gs.print(test);

