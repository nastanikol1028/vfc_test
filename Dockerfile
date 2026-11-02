FROM nginx:stable-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html style.css app.js languages.js translations.js product-classifier.js knowledge.js category-content.js site-ux.js robots.txt sitemap.xml 404.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
RUN chmod -R a+rX /usr/share/nginx/html
EXPOSE 80

COPY about/ /usr/share/nginx/html/about/
COPY articles/ /usr/share/nginx/html/articles/
COPY cases/ /usr/share/nginx/html/cases/
COPY catalog/ /usr/share/nginx/html/catalog/
COPY certification/ /usr/share/nginx/html/certification/
COPY contacts/ /usr/share/nginx/html/contacts/
COPY cookies/ /usr/share/nginx/html/cookies/
COPY declaration/ /usr/share/nginx/html/declaration/
COPY guide/ /usr/share/nginx/html/guide/
COPY how/ /usr/share/nginx/html/how/
COPY marketplaces/ /usr/share/nginx/html/marketplaces/
COPY partners/ /usr/share/nginx/html/partners/
COPY privacy/ /usr/share/nginx/html/privacy/
COPY registry/ /usr/share/nginx/html/registry/
COPY request/ /usr/share/nginx/html/request/
COPY reviews/ /usr/share/nginx/html/reviews/
COPY select/ /usr/share/nginx/html/select/
COPY services/ /usr/share/nginx/html/services/
COPY specifications/ /usr/share/nginx/html/specifications/
COPY terms/ /usr/share/nginx/html/terms/
COPY voluntary/ /usr/share/nginx/html/voluntary/

