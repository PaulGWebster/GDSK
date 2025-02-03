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
./fetch_minio.sh
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
