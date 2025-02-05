FROM node:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY index.js ./
COPY swagger.yaml ./
EXPOSE 9001
CMD ["npm", "start"]

# Use the specified base image
FROM osbase:latest

LABEL maintainer="Paul G Webster / Berat Emre Nebioglu"

LABEL redhat_maintainer="Red Hat, Inc."
LABEL redhat_com.redhat.component="ubi8-micro-container"
LABEL redhat_name="ubi8/ubi-micro"
LABEL redhat_version="8.10"
LABEL redhat_com.redhat.license_terms="https://www.redhat.com/en/about/red-hat-end-user-license-agreements#UBI"
LABEL redhat_summary="ubi8 micro image"
LABEL redhat_description="Very small image"
LABEL redhat_io.k8s.display-name="Ubi8-micro"
LABEL redhat_io.openshift.expose-services=""
LABEL redhat_release="19"
LABEL redhat_name="MinIO" vendor="MinIO Inc <dev@min.io>"

ARG RELEASE=RELEASE.2025-01-20T14-49-07Z

ENV MINIO_ACCESS_KEY_FILE=access_key \
    MINIO_SECRET_KEY_FILE=secret_key \
    MINIO_ROOT_USER_FILE=access_key \
    MINIO_ROOT_PASSWORD_FILE=secret_key

COPY binary/minio /usr/bin/minio

COPY skel/ /

COPY CREDITS /licenses/CREDITS
COPY LICENSE /licenses/LICENSE

EXPOSE 9000/tcp
VOLUME ["/data"]

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["minio"]
