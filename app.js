const exp = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = exp();

app.use(exp.static("public")); //  --> to use the external files(static files) and images in localhost
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        }
      }
    ]
  };
  const Jsondata = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/bd30f05ef5";

  const options = {
    method: "POST",
    auth: "sarthak:5f231ab22be0324883d0e83cc03530d4-us10",
  };

  const request = https.request(url, options, (respond) => {

    if(respond.statusCode == 200){
        res.sendFile(__dirname+"/success.html")
    }
    else {
        res.sendFile(__dirname+"/failure.html")
    }

    respond.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(Jsondata);
  request.end();
});

app.post("/failure" , (req,res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000 , () => {
  console.log("Server started");
});
