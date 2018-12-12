# capstone_server

To run, you must be able to expose port 3000 so that a non local machine can run it. There may be some node dependencies
needed to run so in both the / and /client directories of this project run:
$ npm install
If this fails, please install node.js and try again.

Running the server is fairly simple. If it is the first time starting the server, a React build must be created. Run the 
following commands:
$ cd capstone_server/client
$ npm run build
This should give a clean build and report no errors. Any errors are likely missing dependencies.


Outside the project folder, run:
$ npm start --prefix <Name of the directory>/
The next command (likely has to be in a new terminal) is however you are able to expose port 3000. For this project, I ran:
$ ./ngrok http 3000 -subdomain=<reserved domain>
Where ngrok is a service that allows one to expose ports for non local access.

If you are unable to expose ports, contact the owner of this repo and he can run it on his machine, and you access the page at
5halfcap.ngrok.io

Requires Firefox or Google Chrome browsers.
