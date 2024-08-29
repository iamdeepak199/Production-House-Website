const express = require('express');  //import express
const router = express.Router();     //import Router & creates a new instance of an Express Router object. 

// Dashboard route
router.get('/dashboard', (req, res) => {
  // Check if the user is authenticated
  if (!req.session.user) {         
    return res.redirect('/login'); // Redirect to login if not authenticated
  }

  // Render the dashboard and pass the user data
  res.render('dashboard', { user: req.session.user });
});
module.exports = router;   //export router 








/*1.req.session: This is an object that holds data for the current user's session.
               This data can include user information, preferences, or any other information that needs to persist between requests.*/
/*2.req.session.user: This would be a property on the session object where user-specific information 
               (like a user ID or user profile data) is stored0.*/
/*3. In practical terms, this line is often used to determine if a user is logged in. If req.session.user is falsy,
                 it implies that the user is not authenticated, and you might redirect them to a login page or show an error message.*/

/*4.res.render('dashboard', { user: req.session.user }): This method is used to render a view template (like an EJS, Pug, or Handlebars template) and send the resulting HTML to the client.
'dashboard': This is the name of the view template to render. Express will look for a file named dashboard.hbs, dashboard.pug, or similar, depending on your template engine configuration, in the views directory.
{ user: req.session.user }: This is the data object passed to the view template. It provides the data that the template can use to render dynamic content. In this case, user: req.session.user is passing the user object from the session to the template, making it available for rendering.
req.session.user: This refers to the user data stored in the session. Sessions are used to keep track of user-specific data across requests. Here, req.session.user would typically contain information about the logged-in user, such as their username or ID.*/            