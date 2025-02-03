#!/bin/bash

# We make way to use a newer version, so lets convert ${VERSION} to a variable to make it easier to change
VERSION=20250113

# Pull the Docker image
docker pull debian:bookworm-${VERSION}

# Save the Docker image to a tar file
docker save debian:bookworm-${VERSION} -o bookworm-${VERSION}.tar

# Compress the tar file using gzip with maximum compression
gzip -f9 bookworm-${VERSION}.tar

# Split the compressed tar file into 10MB chunks, and store them in fragments/
mkdir -p fragments
split -b 5M -a 3 --additional-suffix=.gz bookworm-${VERSION}.tar.gz fragments/bookworm-${VERSION}.tar.gz.

# Remove the original compressed tar file
rm bookworm-${VERSION}.tar.gz

# Create a checksum file for the fragments
cd fragments
sha256sum * > .bookworm-${VERSION}.sha256sum

# Prompt the user if they would like to load the VERSION back into a standard docker image
read -p "Would you like to load the Docker image back from the fragments? (y/n): " choice
if [[ "$choice" == "y" ]]; then
    cd ..
    ./load_image.sh "$VERSION"
fi
