FROM gdsr:osbase AS minimal

RUN apk update && apk add bash shadow

RUN chsh -s bash

FROM minimal AS lang-deps

COPY scripts/* /usr/local/bin/

RUN mkdir -p /build /mnt/sys

ADD extra/* /build/

RUN make_links

RUN apk add build-base zlib-dev openssl-dev curl wget tar bzip2-dev xz-dev sqlite-dev readline-dev libffi-dev musl-dev

WORKDIR /build/perl

ENV CPPFLAGS="-D_GNU_SOURCE" \
    CFLAGS="${CFLAGS} -Os -march=x86-64 -mtune=generic -fstack-protector-strong -flto"\
    CXXFLAGS="-Os -march=x86-64" \
    LDFLAGS="-L/usr/lib -flto" \
    CXXFLAGS="${CFLAGS}"

RUN ./Configure -des \
    -Dprefix=/usr \
    -Dusethreads \
    -Duse64bitall \
    -Duselargefiles \
    -Duselongdouble=y \
    -Dcccdlflags='-fPIC' \
    -Doptimize="${CFLAGS}" \
    -Dldflags="${LDFLAGS}" \
    -Duseshrplib 

RUN make libperl.so \
    && make -j$(nproc) \
    && make test_harness \
    && make install \
    && make clean

WORKDIR /build/Python

ENV LC_ALL=C.UTF-8 \
    LANG=C.UTF-8

ENV CPPFLAGS="-D_GNU_SOURCE" \
    CFLAGS="${CFLAGS} -Os -march=x86-64 -mtune=generic -fstack-protector-strong -flto" \
    CXXFLAGS="-Os -march=x86-64" \
    LDFLAGS="-L/usr/lib -flto" \
    CXXFLAGS="${CFLAGS}"

RUN ./configure --prefix=/usr \
        --enable-optimizations \
        --with-ensurepip=install \
        --enable-shared \
        LDFLAGS="${LDFLAGS}" \
        CFLAGS="${CFLAGS}" \
        CPPFLAGS="${CPPFLAGS}" \
    && make -j$(nproc) \
    && make install \
    && make clean

WORKDIR /

#  CFLAGS="-I/usr/include" LDFLAGS="-L/lib" CFLAGS="$CFLAGS -O2 -march=native" CXXFLAGS="$CXXFLAGS -O2 -march=native"

# ./Configure -des \
#   -Dprefix=/usr/local/perl5.40 \
#   -Dusethreads \
#   -Duse64bitall \
#   -Dcccdlflags='-fPIC' \
#   -Dcc='gcc' \
#   -Duseshrplib \
#   -Doptimize="$CFLAGS"
#   -Dusemymalloc=n
#   -Dldflags='-lpthread -lm -lrt -lcrypt'
#   -Dnoextensions='DB_File GDBM_File NDBM_File ODBM_File'
#   -Dlocincpth="/usr/include/locale"

#   curl -L https://cpanmin.us | /usr/local/perl5.40/bin/perl - --self-upgrade


# RUN cd /build/perl*/ \
#     && ./Configure -des -Dprefix=/mnt/sys/perl \
#     && make -j$(nproc) \
#     && make install

CMD [ "bash" ]