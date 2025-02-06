# Milestones
1. **Development Environment Setup**

    *Description: Set up the development environment and configure necessary tools. Prove source build of each individual service that will be present in the Docker stack, not the schemas for the databases, just proof they will run.*
    *Testing: Verify the environment setup by running a simple test script.*

2. **Basic File Conversion Implementation**

    *Description: Implement basic file conversion functionality for a few formats.*
    *Testing: Test conversions manually and compare output files for accuracy.*

3. **Keyword Extraction Module**

    *Description: Develop the keyword extraction module using the Higgyface library.*
    *Testing: Validate keyword extraction on sample files and check relevance.*

4. **Link Inference Engine**

    *Description: Implement the link inference engine to connect files based on keywords.*
    *Testing: Test link inference with a set of related files and verify connections.*

5. **API Development**

    *Description: Develop the OpenAPI v2 API for worker connections.*
    *Testing: Use API testing tools like Postman to verify endpoints and responses.*

6. **Database Integration**

    *Description: Integrate SQLite for storing file states and metadata. File paths and SHA values will be tied to UUIDs, which will be locatable to items in MinIO buckets.*
    *Testing: Perform CRUD operations on the database and verify data integrity.*

7. **Storage Solution**

    *Description: Set up MinIO for storing binary data, metadata, and keywords.*
    *Testing: Upload and retrieve files from MinIO to ensure proper storage.*

8. **Ingress Configuration**

    *Description: Configure Nginx as the single ingress point for the Docker Compose stack.*
    *Testing: Test access to the system through Nginx and verify routing.*

9. **Performance and Scalability Testing**

    *Description: Conduct performance and scalability tests to ensure the system can handle load.*
    *Testing: Use load testing tools to simulate high traffic and measure performance.*

10. **Documentation and User Feedback**

     *Description: Update documentation and gather user feedback for improvements.*
     *Testing: Review documentation for completeness and clarity, and address user feedback.*

# Developer notes

    - **Text Files (TXT)**: Python - Easy to handle text processing and manipulation.
    - **Word Documents (DOCX)**: Python - Libraries like python-docx make it straightforward to work with DOCX files.
    - **PDF Files (PDF)**: Python - Libraries such as PyPDF2 and pdfminer.six are well-suited for PDF manipulation.
    - **Excel Files (XLSX)**: Python - Pandas and openpyxl provide robust support for Excel file operations.
    - **Images (JPEG, PNG)**: Python - PIL (Pillow) and OpenCV are excellent for image processing tasks.
    - **Audio Files (MP3, WAV)**: Python - Libraries like pydub and librosa are effective for audio file handling.
    - **Video Files (MP4, AVI)**: Python - MoviePy and OpenCV can be used for video processing.
    - **JSON Files (JSON)**: JavaScript - Native support in JavaScript makes it ideal for handling JSON data.
    - **XML Files (XML)**: Java - Libraries like JAXB and DOM/SAX parsers are well-suited for XML processing.
    - **CSV Files (CSV)**: Python - Pandas provides excellent support for CSV file operations.
    - **Markdown Files (MD)**: JavaScript - Libraries like markdown-it make it easy to parse and manipulate Markdown content.
