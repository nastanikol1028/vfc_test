FROM nginx:stable-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css app.js languages.js translations.js product-classifier.js knowledge.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 80
