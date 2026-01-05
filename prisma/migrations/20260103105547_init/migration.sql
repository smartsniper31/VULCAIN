-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "preferences" JSONB
);

-- CreateTable
CREATE TABLE "trends" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "searchVolume" INTEGER NOT NULL,
    "growthRate" REAL NOT NULL,
    "imageUrl" TEXT,
    "sourceUrl" TEXT NOT NULL,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trendId" TEXT NOT NULL,
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "trends" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "trends_slug_key" ON "trends"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "trends_title_key" ON "trends"("title");

-- CreateIndex
CREATE INDEX "trends_createdAt_idx" ON "trends"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_trendId_key" ON "favorites"("userId", "trendId");
