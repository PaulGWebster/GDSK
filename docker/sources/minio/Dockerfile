# We need to arch this
FROM amd64/alpine:3.21.2 AS base

RUN apk update && apk add curl wget rsync

FROM amd64/alpine:3.21.2  AS final

COPY --from=base / / 

ENV MINIO_ACCESS_KEY_FILE=access_key
ENV MINIO_SECRET_KEY_FILE=secret_key
ENV MINIO_ROOT_USER_FILE=access_key
ENV MINIO_ROOT_PASSWORD_FILE=secret_key

EXPOSE 9001/tcp
EXPOSE 9000/tcp

LABEL name=MinIO vendor="MinIO Inc <dev@min.io>"
LABEL description="Very small image which contains MinIO server."
LABEL version="8.10"

COPY skel /tmp-data
COPY binary/minio /usr/bin/minio

WORKDIR /tmp-data

RUN rsync -azv . / && cd / && rm -Rf tmp-data

WORKDIR /usr/bin

VOLUME ["/data"]

ENTRYPOINT [ "docker-entrypoint.sh" ]
CMD ["minio"]
