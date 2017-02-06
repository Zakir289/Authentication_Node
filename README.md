This is a simple authentication module, which helps to register and login. Here authentication works based Token based authentication, when user logs in,  A token will be returned to the user based on that the user will communicate with all the other servers. 

The Token will reside in the browser for the amount of time the token is created. The token will be validated based on the secret key at the server's end. I am using **sha512**. 


1. install the dependencies with **npm install**.
2. Run the mongodb with default port.
3. node server/app.js will start the server in the foreground.
