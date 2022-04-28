FROM nginx
COPY dist/dxsuite-ng-admin/ /usr/share/nginx/html/dxsuite-apps/
COPY dist/dxsuite-ng-admin/index.html /usr/share/nginx/html/
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 8889