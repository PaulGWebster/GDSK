# We need to arch this
FROM amd64/alpine:3.21.2 AS buildbase

RUN apk update && apk add curl wget rsync nano bash shadow build-base unzip tcl tcl-dev icu-dev icu-libs icu

RUN chsh -s /bin/bash

RUN mkdir -p /build/src /build/target

COPY src/sqlite* /build/src/

RUN cd /build/src && unzip *.zip  && mv sqlite-src-*/* . &&  rm -Rf *.zip sqlite-src-* 

WORKDIR /build/src 

RUN ./configure --prefix=/build/target  --scanstatus --test-status --memsys5 --session --fts4 --fts5 --geopoly --rtree --update-limit
RUN make -j$(nproc) && make install

CMD ["/bin/bash"]