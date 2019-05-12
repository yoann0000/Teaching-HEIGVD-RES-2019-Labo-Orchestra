FROM node:8
MAINTAINER Yoann Rohrbasser <yoann.rohrbasser@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install uuid

ENTRYPOINT ["node", "/opt/app/Musician.js"]