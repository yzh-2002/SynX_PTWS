FROM nginx:stable-alpine3.17

RUN rm -rf /usr/share/nginx/html/*

COPY ./dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx","-g","daemon off;"]