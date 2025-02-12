# We need to arch this
FROM amd64/alpine:3.21.2 AS buildbase

RUN apk update && apk add curl wget rsync nano bash shadow build-base zlib-dev openssl openssl-dev pcre-dev

RUN chsh -s /bin/bash

RUN mkdir -p /build/src /build/target

ADD src/nginx* /build/src/

RUN mv /build/src/nginx* /build/src/nginx

WORKDIR /build/src/nginx

RUN ./configure --prefix=/build/target/ --with-threads --with-http_ssl_module --with-http_v2_module --with-http_v3_module --with-stream --with-http_realip_module --with-http_addition_module --with-http_mp4_module --with-http_auth_request_module --http-log-path=/var/log/nginx --with-compat --with-pcre-jit

RUN make -j$(nproc) && make install 

CMD ["/bin/bash"]