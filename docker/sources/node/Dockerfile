FROM amd64/alpine:3.21.2 AS osbase

RUN apk update \
  && apk add build-base ccache ninja python3 musl-dev sudo linux-headers bash

ADD src/v23.7.0.tar /build

WORKDIR /build

RUN chsh -s bash

RUN cd "$(find . -mindepth 1 -maxdepth 1 -type d -print -quit)"  \
  && mkdir -p ../node \
  && ./configure --prefix=/build/node \
  && export PATH="/usr/lib/ccache:$PATH" \
  && export THREADCOUNT=$(nproc) \
  && ccache --max-size=6G \
  && make -j$THREADCOUNT \
  && make install 

#FROM amd64/alpine:3.21.2 AS nodebase

#COPY --from=osbase /build/install /usr/

CMD "sh"
