FROM nginx
COPY build/ /usr/share/nginx/html/dxsuite-apps/
COPY build/index.html /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8889