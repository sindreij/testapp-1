FROM nginx:alpine
ADD public /usr/share/nginx/html

EXPOSE 80
