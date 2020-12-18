FROM nginx:alpine
ADD public /usr/share/nginx/html

RUN --mount=type=secret,id=my-secret,required,dst=/foobar ls /foobar && cat  /foobar/test.txt

EXPOSE 80
