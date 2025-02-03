#!/bin/bash

# We make way to use a newer version, so lets convert ${VERSION} to a variable to make it easier to change
VERSION=20250113

# Prompt the user for if they would like to continue with this bookwom version
echo "Would you like to load the image for bookworm-${VERSION}? (y/n)"
read -r response
if [ "$response" != "y" ]; then
    echo "Exiting..."
    exit 0
fi

# Move to the fragments directory
cd fragments

# Combine the fragments back into a single compressed tar file
cat bookworm-${VERSION}.tar.gz.* > bookworm-${VERSION}.tar.gz

# Verify the checksum
echo "Verifying checksums..."
sha256sum -c .checksums.sha256 && echo "Checksum verification successful" || echo "Checksum verification failed"

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