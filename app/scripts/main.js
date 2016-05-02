// 'use strict';

// var username = 'MC3D';
// var baseURL = 'https://api.github.com/users/MC3D';
// var token = window.token;
//
// if(typeof(token) !== 'undefined'){
//   $.ajaxSetup({
//     headers: {
//       'Authorization': 'token ' + token,
//     }
//   });
// }
//
// // templateId (template must have ID), location (reference to location in html), model is an object model
// function renderTemplate(templateId, location, model) {
//     // convert templateId to string
//     var templateString = $(templateId).text();
//     // complies js templates into functions that can be evaluated for rendering
//     var templateFunction = _.template(templateString);
//     // pass object model to function
//     var renderedTemplate = templateFunction(model);
//     // append template to set location
//     $(location).append(renderedTemplate);
// }
//
// $.getJSON("https://api.github.com/users/MC3D").done(function(data) {
//   var userData = {
//       avatar: data.avatar_url,
//       avatarURL: data.html_url,
//       username: data.login,
//       name: data.name,
//       memberSince: moment(data.created_at).format('MMM DD, YYYY'),
//       followers: data.followers,
//       following: data.following,
//   };
//
//   $.getJSON("https://api.github.com/users/MC3D/starred").done(function(data) {
//     userData.starred = data.length,
//
//     $.getJSON("https://api.github.com/users/MC3D/orgs").done(function(data) {
//       // map produces a new array
//       var orgData = _.map(data, function(org){
//         return {
//           orgAvatar: org.avatar_url,
//           orgName: org.login
//         };
//       }); // closes orgData map method
//
//       renderTemplate('#template_header', '.header', userData);
//       renderTemplate('#template_sidebar', '.sidebar', userData);
//
//       _.each(orgData, function(org){
//         renderTemplate('#template_sidebar_orgs', '.orgs', org);
//       }); // closes underscore for each method
//     }); // closes JSON call for orgs
//   }); // closes JSON call for starred
// }); // closes JSON call for user
//
// $.getJSON(baseURL + '/repos').done(function(data) {
//   var sortedData = _.sortBy(data, 'updated_at').reverse();
//   _.each(sortedData, function(data) {
//     var repoData = {
//         name: data.name,
//         updated: moment(data.updated_at).fromNow(),
//         language: data.language,
//         stargazersCount: data.stargazers_count,
//         forksCount: data.forks,
//         repoUrl: data.html_url,
//         fullName: data.full_name
//     };
//     renderTemplate('#template_page_repos', '.page', repoData);
//   });
// });
