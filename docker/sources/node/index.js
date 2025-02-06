const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
// Load the OpenAPI schema
const swaggerDocument = YAML.load('./swagger.yaml');
const generateCookie  = require("./utils/cookie.js");
const cookieCheck = require("./utils/cookieCheck.js")
const messageObj = require("./utils/messages.js")

const multer = require('multer');
const upload = multer();
const dbConfig = require('./config/db_config.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbConfig.Database_url, 
    },
  },
});
const app = express();
app.use(express.json()); 
app.use(cookieParser());

//echo end point
app.post("/api/echo", cookieCheck, async(req, res) => {

  return res.status(200).json({"success" : true, "message": "succesful request", object : null })
})
// Register end point
// There is no entry in swagger for the system. 
// This is only for testing purpose.
// If you need that end point we can use it later. 
// This is isolated system. We may not need bcrypt. 
app.post('/api/register', async (req, res) => {
  const { email, name, password, userType } = req.body;

  // Check if all required fields are present
  if (!email || !name || !password || !userType) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  // Check if the email is already registered
  const existingUser = await prisma.user.findUnique({
    where: { Email: email },
  });

  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email is already taken" });
  }

  try {
    // Hash the password with bcrypt (using a salt rounds of 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        Email: email,
        Name: name,
        Password: hashedPassword,
        UserType: userType,
      },
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "User successfully registered",
      user: {
        id: newUser.id,
        email: newUser.Email,
        name: newUser.Name,
        userType: newUser.UserType,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});

// login end point
// if we use base64 since it is isolated system. I will change bcrypt.compare
// to whatever it is necessary.

app.post('/api/auth/login', async (req, res) => {
  const existingCookie = req.headers.cookie;
  const { username, password } = req.body;

  try{
    if(existingCookie){
    
      // Check user is already login
      const existingAuthCookie = existingCookie.split("=")[1]; 
      console.log(existingCookie)
      const login = await prisma.login.findMany({
        where: { AuthCookie: existingAuthCookie }, 
      });
    

      if(login){
        return res.status(401).json({"success": false,   message: messageObj["AlreadyExit"], object: null }); 
      }
    }
      else{
        // Check if user exists (assuming you have a User model)
        const user = await prisma.user.findMany({
            where: { Name : username },
        });

        if (!user) {
          return res.status(401).json({"success": false,   message: messageObj["InvalidCredentials"], object: null }); 
        }


        // Compare password using bcrypt
        const match = await bcrypt.compare(password, user[0].Password);

        if (!match) {
            return res.status(401).json({"success": false,   message: messageObj["InvalidCredentials"], object: null }); 
        }
      
        const authCookie = generateCookie()


        res.cookie('sessionId', authCookie); // Set cookie options as needed

        // Insert login record into the database
        await prisma.login.create({
          data: {
              UserId: user[0].id,
              AuthCookie: authCookie,
              LoginTime: new Date(),
          },
        });
        // i could return login object but i am sending cookie to browser. I think that will be enough.
        return res.status(200).json({"success": true,   message: messageObj["SuccesfulLogin"], object: null }); 
    }
  }

  
  catch(e){
    return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});

// Auth logout endpoint
app.post('/api/auth/logout', cookieCheck, async (req, res) => {
  const { sessionId } =  req.headers.cookie.split("=")[1];;
  try{
      // Find the login record associated with the sessionId
      const loginRecord = await prisma.login.findMany({
          where: { AuthCookie: sessionId },
      });

      if (loginRecord) {
          // Update the LogoutTime for the record
          await prisma.login.updateMany({
              where: { id: loginRecord.id },
              data: { LogoutTime: new Date() },
          });
          
          // Clear the cookie
          res.clearCookie('sessionId');

          return res.status(200).json({"success": true,   message: messageObj["SuccesfulLogout"], object: null }); 
      } else {
        return res.status(404).json({"success": false,   message: messageObj["SessionNotFound"], object: null }); 
      }
  }
  catch (error) {
      console.error(error);
      return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});

// POST /worker - Create a new worker
app.post('/api/worker', cookieCheck, async (req, res) => {
  const { name, status } = req.body;

  try {
      const newWorker = await prisma.worker.create({
          data: {
              WorkerName : name,
              WorkerStatus : status,
              WorkerType : "new-worddetector"
          },
      });
      res.status(201).send({"success": true, "message": messageObj["OperationSuccessful"], object :  newWorker });
  } catch (error) {
      console.error(error);
      return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});

// GET /worker/:id - Retrieve a worker by ID
app.get('/api/worker/:id', cookieCheck, async (req, res) => {
  const { id } = req.params;

  try {
      const worker = await prisma.worker.findUnique({
          where: { id: Number(id) },
      });

      if (!worker) {
        return res.status(404).json({"success": false,   message: messageObj["WorkerNotFound"], object: null }); 
      }

      res.status(201).send({"success": true, "message": messageObj["OperationSuccessful"], object : worker });
  } catch (error) {
      console.error(error);
      return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});

// PUT /worker/:id - Update a worker by ID
app.put('/api/worker/:id', cookieCheck, async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  try {
      const updatedWorker = await prisma.worker.update({
          where: { id: Number(id) },
          data: {
              WorkerName : name,
              WorkerStatus : status,
          },
      });

      res.status(201).send({"success": true, "message": messageObj["OperationSuccessful"], object : updatedWorker });
  } catch (error) {
      console.error(error);
      return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});

// DELETE /worker/:id - Delete a worker by ID
app.delete('/api/worker/:id' , cookieCheck, async (req, res) => {
  const { id } = req.params;

  try {
      await prisma.worker.delete({
          where: { id: Number(id) },
      });

      res.status(201).send({"success": true, "message": messageObj["OperationSuccessful"], object : null });
  } catch (error) {
      console.error(error);
      return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});


// /api/media/find
// Returns a document ID based on provided keywords.
app.post('/api/media/find', cookieCheck, async (req, res) => {
  const { keyword } = req.body; 

  try {
  

      const mediaEntries = await prisma.media.findMany({
         where: {
            MediaKeywords: {
                  some: {
                      Keywords: {
                          in: keyword, // Match any of the provided keywords
                      },
                  },
              },
          },
          
          include: {
              MediaTags: true,       // Include related tags
              MediaKeywords: true,   // Include related keywords
          },
      });

      if (mediaEntries.length === 0) {
        return res.status(404).json({"success": false,   message: messageObj["NoMediaKeywords"], object: null }); 
      }

      // Respond with the found media entries
      return res.status(201).json({ success: true, message: messageObj["FileListed"], object: mediaEntries });
  } catch (error) {
      console.error(error);
      return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});
// /api/media/tags
// Returns tags associated with a specific document ID.
app.get('/api/media/tags', cookieCheck, async (req, res) => {
  const docid = parseInt(req.query.docid); // Get docid from query parameters

  try {
      // Validate docid
      if (isNaN(docid)) {
         
          return res.status(400).json({"success": false,   message: messageObj["InvalidDocid"], object: null }); 
      }

      // Find media entries that match the provided docid
      const mediaEntries = await prisma.media.findMany({
          where: {
              id: docid, // Match the media entry with the provided docid
             
          },
          include: {
              MediaTags: true,       // Include related tags
              MediaKeywords: true,   // Include related keywords
          },
      });

      if (mediaEntries.length === 0) {
        return res.status(400).json({"success": false,   message: messageObj["MediaNotFoundwithDocid"], object: null }); 
      }

      // Respond with the found media entries
      return res.status(201).json({ success: true, message: messageObj["FileListed"], object: mediaEntries });
  } catch (error) {
      console.error(error);
      return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});
// /api/media/filename
// Returns the filename associated with a specific document ID.

app.post('/api/media/filename', cookieCheck, upload.single('file'), async (req, res) => {
  
  try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({"success": false,   message: messageObj["FileNotUploaded"], object: null }); 
      }

      // Extract file metadata
      const mediaName = req.file.originalname;
      const mediaType = req.file.mimetype;
      const mediaExtension = mediaName.split('.').pop();
      const mediaStatus = 'new';

      // Create a new Media entry in the database
      const newMedia = await prisma.media.create({
          data: {
              MediaName: mediaName,
              MediaType: mediaType,
              MediaExtension: mediaExtension,
              MediaStatus: mediaStatus,
          },
      });




      // Respond with the created media object
      res.status(201).json({ success: true, message: messageObj["FileUpload"], media: newMedia });
  } catch (error) {
      console.error(error);
      return res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});



// /api/user{id}
app.get('/api/user/:id', cookieCheck,  async (req, res) => {

  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findMany({
      where: {
        id: userId,
      },
    });


    if (user.length > 0) { // Check if the array has any elements
      res.status(200).json({
          success: true,
          message: messageObj["ListofUsers"],
          object: user
      });
  } else {
      res.status(404).json({
          success: false,
          message: messageObj["UserNotFound"],
          object: null
      });
  }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({"success": false,   message: messageObj["ServerError"], object: null }); 
  }
});


// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
const PORT = 9001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API documentation is available at http://localhost:${PORT}/api-docs`);
});