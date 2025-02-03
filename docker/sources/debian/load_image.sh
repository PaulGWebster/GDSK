#!/bin/bash

# Check if a version argument is passed, if not exit
if [[ -z "$1" ]]; then
    echo "No version argument passed. Exiting."
    exit 1
fi

# Assign the passed argument to VERSION
VERSION=$1

# Move to the fragments directory
cd fragments

CHECKSUM=".bookworm-$1.sha256sum"

# Check if a version argument is passed and is valid (e.g., a non-empty string)
if [[ -n "$1" && -f "${CHECKSUM}" ]]; then
    echo "Loading Docker image for version $1"
    VERSION=$1
else
    echo "No valid version argument passed, using default version $VERSION"

    # Validate the default version
    if [[ ! -f "bookworm-${VERSION}.sha256sum" ]]; then
        echo "Default version $VERSION is not valid. Exiting."
        exit 1
    fi
fi

# Combine the fragments back into a single compressed tar file
cat bookworm-${VERSION}.tar.gz.* > bookworm-${VERSION}.tar.gz

# Verify the checksum
echo "Verifying checksums..."
if sha256sum -c "${CHECKSUM}"; then
    echo "Checksum verification successful"
else
    echo "Checksum verification failed"
    rm bookworm-${VERSION}.tar.gz
    exit 1
fi

# Decompress the tar file
gunzip bookworm-${VERSION}.tar.gz

# Load the Docker image from the tar file
docker load -i bookworm-${VERSION}.tar

# Tag the Docker image
docker tag debian:bookworm-${VERSION} osbase:${VERSION}
docker tag debian:bookworm-${VERSION} osbase:latest
echo "Image tagged as osbase:${VERSION}"
echo "Image tagged as osbase:latest"

# Clean up the tar file
rm bookworm-${VERSION}.tar