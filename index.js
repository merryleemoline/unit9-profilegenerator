const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const open = require("open");
const convertFactory = require("electron-html-to");
const generateHTML = require("./generateHTML");
require("dotenv").config();

const questions = [
    {
        type: "input",
        name: "github",
        message: "What is your GitHub username?"
    },

    {
        type: "list",
        name: "color",
        message: "What is your favorite color?",
        choices: ["orange", "black", "blue", "green"]
    }
];

function writeToFile(fileName, data) {
    return fs.writeFileSync(path.join(process.cwd(), fileName), data);
}

function init() {
    inquirer.prompt(questions).then(({ github, color }) => {
        console.log("Searching...");

        api
            .getUser(github)
            .then(response =>
                api.getTotalStars(github).then(stars => {
                    return generateHTML({
                        stars,
                        color,
                        ...response.data
                    });
                })
            )
            .then(html => {
                const conversion = convertFactory({
                    converterPath: convertFactory.converters.PDF
                });

                conversion({ html }, function (err, result) {
                    if (err) {
                        return console.error(err);
                    }

                    result.stream.pipe(
                        fs.createWriteStream(path.join(__dirname, "resume.pdf"))
                    );
                    conversion.kill();
                });

                open(path.join(process.cwd(), "resume.pdf"));
            });
    });
}
///--------------API----------------///

const api = {
    getUser(username) {
        var api_url = `https://api.github.com/users/`
        var username = `${username}`
        var clientId = `${process.env.CLIENT_ID}`
        var clientSecret = `${process.env.CLIENT_SECRET}`
        $.ajax({
            url: api_url + username + '?client_id=' + clientId + '&client_secret=' + clientSecret,
            contentType: "application/json",
            dataType: 'json',
            success: function (result) {
                console.log(result);

            },
        })
    },
}





init();
