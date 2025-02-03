# Minio Fetch Script

This script automates the process of fetching the latest Minio binary, verifying its checksum, and creating a versioned tarball. Additionally, it creates a symlink to the latest version of the Minio binary and outputs the version and checksum of the binary.

## Features

- Fetches the latest Minio binary.
- Verifies the checksum of the downloaded binary.
- Creates a versioned tarball of the binary.
- Creates a symlink to the latest version of the Minio binary.
- Outputs the version of Minio and the checksum of the binary.

## Usage

To check for a new version of Minio and perform the above actions, simply run:

```sh
cd binary &&  ./fetch_minio.sh && cd .. && docker run -it -p9000:9000 -p36553:36553 gdsk:minio server ~/.docker-minio
```

## Execution example

```sh
pwebster@ubuntu:~/work/GDSK/docker/sources/minio$ docker run -it gdsk:minio server /home/shared
INFO: Formatting 1st pool, 1 set(s), 1 drives per set.
INFO: WARNING: Host local has more than 0 drives of set. A host failure will result in data becoming unavailable.
MinIO Object Storage Server
Copyright: 2015-2025 MinIO, Inc.
License: GNU AGPLv3 - https://www.gnu.org/licenses/agpl-3.0.html
Version: RELEASE.2025-01-20T14-49-07Z (go1.23.5 linux/amd64)

API: http://172.17.0.4:9000  http://127.0.0.1:9000 
   RootUser: minioadmin 
   RootPass: minioadmin 

WebUI: http://172.17.0.4:36553 http://127.0.0.1:36553  
   RootUser: minioadmin 
   RootPass: minioadmin 

CLI: https://min.io/docs/minio/linux/reference/minio-mc.html#quickstart
   $ mc alias set 'myminio' 'http://172.17.0.4:9000' 'minioadmin' 'minioadmin'

Docs: https://docs.min.io
WARN: Detected default credentials 'minioadmin:minioadmin', we recommend that you change these values with 'MINIO_ROOT_USER' and 'MINIO_ROOT_PASSWORD' environment variables
```


## Requirements

- Ensure you have the necessary permissions to execute the script.
- Internet connection to fetch the latest Minio binary.

## Example Output

```
Fetching Minio binary and checksum
Minio RELEASE.2025-01-20T14-49-07Z valid, with checksum:
    local:  3439ca54a18f931cb900b35db0fa223f9ef9ab0c872ec63bbd115777863f4f91
    remote: 3439ca54a18f931cb900b35db0fa223f9ef9ab0c872ec63bbd115777863f4f91
)
Creating a versioned tarball, so it will fit within the git size limit
Updating symlink to the latest version
Done
```

## Result

```
$ ls -la
total 153724
drwxrwxr-x 2 pwebster pwebster      4096 Feb  2 20:18 .
drwxrwxr-x 4 pwebster pwebster      4096 Feb  2 18:38 ..
-rwxrwxr-x 1 pwebster pwebster      1169 Feb  2 20:18 fetch_minio.sh
-rwxrwxr-x 1 pwebster pwebster 117088408 Feb  2 20:18 minio
lrwxrwxrwx 1 pwebster pwebster        41 Feb  2 20:18 minio-latest.tar.gz -> minio-RELEASE.2025-01-20T14-49-07Z.tar.gz
-rw-rw-r-- 1 pwebster pwebster  40301974 Feb  2 20:18 minio-RELEASE.2025-01-20T14-49-07Z.tar.gz
-rw-rw-r-- 1 pwebster pwebster      1187 Feb  2 20:16 README.md
```

## License

This project is licensed under the AGPL-3.0 License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contact

For any questions or issues, please contact the maintainer.
