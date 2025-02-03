#!/bin/bash

# Define the base URL for Minio binary and checksum
BASE_URL="https://dl.min.io/server/minio/release/linux-amd64"

# Announce the what the script is doing
echo "Fetching Minio binary and checksum"

# Fetch the latest Minio binary
curl -sO "${BASE_URL}/minio"

# Make the Minio binary executable
chmod +x minio

# Get the Minio version
MINIO_VERSION=$(./minio --version | head -n 1 | cut -d' ' -f 3)

# Remove extra data from the sha sums we only need the hash
MINIOSHA_BIN=$(sha256sum minio | cut -d' ' -f1)
MINIOSHA_VAL=$(curl -s "${BASE_URL}/minio.${MINIO_VERSION}.sha256sum" | cut -d' ' -f1)

# Compare the sha sums
DOEXIT=2
if [ "${MINIOSHA_BIN}" != "${MINIOSHA_VAL}" ]; then
  DOEXIT=1
  echo "Minio binary checksum failed, with checksum:"
else
  DOEXIT=0
  echo "Minio ${MINIO_VERSION} valid, with checksum:"
fi

echo "  local:  ${MINIOSHA_BIN}"
echo "  remote: ${MINIOSHA_VAL}"
echo ")"

if [ ${DOEXIT} == 1 ]; then
  exit 1
fi

echo "Creating a versioned tarball, so it will fit within the git size limit"
if tar -czf minio-${MINIO_VERSION}.tar.gz minio; then
  echo "Updating symlink to the latest version"
  mkdir -p archive
  mv minio-${MINIO_VERSION}.tar.gz archive/
  ln -sf archive/minio-${MINIO_VERSION}.tar.gz minio-latest.tar.gz
else
  echo "Failed to create tarball"
  rm minio-${MINIO_VERSION}* || true
  exit 1
fi

echo "Done"
 

