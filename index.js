const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const open = require("open");
const convertFactory = require("electron-html-to");
const githubAPI = require("./API")
const generateHTML = require("./generateHTML");

/////////////////////////////////////////////////
//-------------dependencies end---------------//
////////////////////////////////////////////////
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
        choices: ["pink", "red", "blue", "green"]
    }
];

function init() {
    inquirer.prompt(questions).then(({ github, color }) => {
        console.log("((Getting data))");
        githubAPI.getUser(github).then(response =>
          githubAPI.getTotalStars(github)
        .then(stars => {
          return generateHTML({stars,color,...response.data });})
    .then(html => {
      const conversion = convertFactory({
        converterPath: convertFactory.converters.PDF
      });
      conversion({ html }, function(err, result) {
        if (err) { return console.error(err);}
        result.stream.pipe(fs.createWriteStream(path.join(__dirname, "profile.pdf")));
        conversion.kill();
      });

      open(path.join(process.cwd(), "profile.pdf"));
    }));
});
}

init();