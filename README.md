# HapiVueExample
Example project made with hapi server (backend) and vue (frontend)

# backend
install mongodb: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

install node.js and npm

    sudo apt update
    
    sudo apt install nodejs npm
    
cd server

npm install

node server.js

# frontend
cd client

npm install -g @vue/cli

npm install

npm run build (change config/index.js to match IP from server)

install nginx tp serve client and reverse proxy to api
````
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root <WORKING_DIR>/client/dist;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ /index.html;
	}

	location /api/ {
		proxy_pass http://127.0.0.1:3000/;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_pass_request_headers on;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
	}
}
````
