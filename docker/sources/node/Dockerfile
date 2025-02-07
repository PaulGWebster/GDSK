FROM amd64/alpine:3.21.2 AS osbase

RUN apk update \
  && apk add build-base ninja python3 musl-dev sudo linux-headers bash shadow

ADD src/v23.7.0.tar /build/src

WORKDIR /build

RUN mkdir node
RUN chsh -s bash

RUN cd src/node* \
  && ln -s $(pwd) /build/source

WORKDIR /build/source

RUN ./configure --prefix=/build/target

RUN make -j$(nproc)

RUN make install

RUN make clean

FROM amd64/alpine:3.21.2 AS nodedeps

RUN apk update && apk add libgcc libstdc++

FROM nodedeps AS osextra

RUN apk update && apk add bash shadow

FROM amd64/alpine:3.21.2 AS nodethin

RUN mkdir -p /app

WORKDIR /app

COPY --from=nodedeps / /
COPY --from=osextra / /
COPY --from=osbase /build/target/ /usr/

RUN chsh -s bash

FROM scratch AS nodefinal

COPY --from=nodethin / /

CMD "bash"
