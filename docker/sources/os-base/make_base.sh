#!/bin/bash

# Automatically detect the latest available version from the fragments directory
VERSION=$(ls fragments/bookworm-*.tar.gz.* | grep -oP 'bookworm-\K[0-9]{8}' | sort -r | head -n 1)

# Pull the Docker image
docker pull debian:bookworm-${VERSION}

# Save the Docker image to a tar file
docker save debian:bookworm-${VERSION} -o bookworm-${VERSION}.tar

# Compress the tar file using gzip with maximum compression
gzip -f9 bookworm-${VERSION}.tar

# Split the compressed tar file into 10MB chunks, and store them in fragments/
mkdir -p fragments
split -b 10M -a 3 --additional-suffix=.gz bookworm-${VERSION}.tar.gz fragments/bookworm-${VERSION}.tar.gz.

# Remove the original compressed tar file
rm bookworm-${VERSION}.tar.gz

# Create a checksum file for the fragments
cd fragments
sha256sum * > .checksums.sha256

# Change back to the original directory
cd ..

# Prompt the user for if they would load to run load_image.sh
echo "Would you like to load the image now? (y/n)"
read -r response
if [ "$response" = "y" ]; then
    ./load_image.sh
fi