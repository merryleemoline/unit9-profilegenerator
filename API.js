// var jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const { window } = new JSDOM();
// const { document } = (new JSDOM('')).window;
// global.document = document;
// var $ = jQuery = require('jquery')(window);

// const API = {
//     getUser(username) {
//         var api_url = `https://api.github.com/users/`
//         var username = `${username}`
//         var clientId = `${process.env.CLIENT_ID}`
//         var clientSecret = `${process.env.CLIENT_SECRET}`
//         $.ajax({
//             url: api_url + username + '?client_id=' + clientId + '&client_secret=' + clientSecret,
//             contentType: "application/json",
//             dataType: 'json',
//             success: function (result) {
//                 console.log(result.data.reduce((acc, curr) => {
//                     acc += curr.stargazers_count;
//                     return acc;
//                 }, 0))
//             }
//         })
//     }
// }
// LOL JQUERY GOT TOO COMPLICATED


const axios = require("axios");
require("dotenv").config();

const githubAPI = {
  getUser(username) {
    var api_url = `https://api.github.com/users/`
    var username = `${username}`
    var clientId = `${process.env.CLIENT_ID}`
    var clientSecret = `${process.env.CLIENT_SECRET}`
    return axios
      .get(api_url + username + '?client_id=' + clientId + '&client_secret=' + clientSecret)
      .catch(err => {
        console.log(`User not found`);
        process.exit(1);
      });
  },
  getTotalStars(username) {
    var api_url = `https://api.github.com/users/`
    var username = `${username}`
    var clientId = `${process.env.CLIENT_ID}`
    var clientSecret = `${process.env.CLIENT_SECRET}`
    return axios
      .get(api_url + username + '/repos?client_id=' + clientId + '&client_secret=' + clientSecret + '&perpage=100')
      .then(response => {
        return response.data.reduce((acc, curr) => {
          acc += curr.stargazers_count;
          return acc;}, 0);
      });
    }}

module.exports = githubAPI;