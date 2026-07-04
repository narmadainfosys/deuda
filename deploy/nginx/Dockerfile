FROM nginx:1.27-alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY deuda.conf /etc/nginx/conf.d/deuda.conf
COPY pemba.conf /etc/nginx/conf.d/pemba.conf
COPY chintan.conf /etc/nginx/conf.d/chintan.conf
COPY bipin.conf /etc/nginx/conf.d/bipin.conf
