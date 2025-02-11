#!/bin/bash

# Make sure all base diretories are present
mkdir -p fragments base

# Check if a version argument is provided, otherwise use 'latest'
VERSION=${1:-latest}

# Check for internet connectivity
if ping -c1 -w5 8.8.8.8 &> /dev/null; then
    # Pull the Docker image
    if ! docker pull amd64/alpine:${VERSION}; then
        echo "Error: Version ${VERSION} not found."
        exit 1
    fi
else
    echo "No internet connection. Using local fragments."
    VERSION=$(ls base/alpine-*.tar 2>/dev/null | sed -e 's/base\/alpine-\(.*\)\.tar/\1/' | sort -V | tail -n 1)
    if [ -z "$VERSION" ]; then
        echo "Cannot proceed, no cached records"
        exit 1
    fi
fi

# Determine the actual version for 'latest'
if [ "$VERSION" == "latest" ]; then
    REALVERSION=$(docker run --rm amd64/alpine:latest sh -c 'cat /etc/alpine-release')
else
    REALVERSION=$VERSION
fi

# If the version is 'latest', use the derived version from alpine-release
if [ "$VERSION" == "latest" ]; then
    VERSION=$REALVERSION
fi

OVIRGIN=$VERSION
echo "Version: LATEST=>${VERSION}"
LATEST=$VERSION

# Lets store the image as a tar file
BASEPATH="base/alpine-${VERSION}.tar"
docker save -o base/alpine-${VERSION}.tar amd64/alpine:latest

# Ensure the fragments directory exists
mkdir -p fragments

# Split the tar/gz file into 1MB chunks
split -b 1m -a 3 ${BASEPATH} fragments/alpine-${VERSION}.tar.gz.

# Recreate the tar/gz file from the chunks, and load the image
cat fragments/alpine-${VERSION}.tar.* | docker load 

# Show the latest .tar.tz image within he file directory os-base and assign it to LATESTIMAGE
LATESTIMAGE="os$(ls -t base/alpine-${VERSION}.tar | head -n1)"
echo "Latest tarball: ${LATESTIMAGE}"

# Finally create a real parh/type:version
IMAGENAME=$(echo ${LATESTIMAGE} | cut -d ':' -f 1)
IMAGETAG="amd64/alpine:${VERSION}"
docker tag amd64/alpine:latest ${IMAGETAG}
echo "Image:Tag created: ${IMAGETAG}"

echo "${IMAGETAG}" > latest