-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Email" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "UserType" TEXT NOT NULL,
    "CreationTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateTime" DATETIME,
    "DeleteTime" DATETIME
);

-- CreateTable
CREATE TABLE "Login" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "UserId" INTEGER NOT NULL,
    "LoginTime" DATETIME NOT NULL,
    "LogoutTime" DATETIME,
    "AuthCookie" TEXT NOT NULL,
    CONSTRAINT "Login_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Worker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "WorkerName" TEXT NOT NULL,
    "WorkerType" TEXT NOT NULL,
    "WorkerStatus" TEXT,
    "CreationTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateTime" DATETIME,
    "DeleteTime" DATETIME
);

-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "MediaName" TEXT NOT NULL,
    "MediaType" TEXT,
    "MediaExtension" TEXT,
    "MediaStatus" TEXT,
    "CreationTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdateTime" DATETIME,
    "DeleteTime" DATETIME
);

-- CreateTable
CREATE TABLE "MediaTags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "TagName" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    CONSTRAINT "MediaTags_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MediaKeywords" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Keywords" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    CONSTRAINT "MediaKeywords_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");
