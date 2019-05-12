FROM node:8
MAINTAINER Yoann Rohrbasser <yoann.rohrbasser@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/Auditor.js"]