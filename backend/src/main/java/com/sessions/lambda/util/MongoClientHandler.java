package com.sessions.lambda.util;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class MongoClientHandler {

    private static MongoClient mongoClient;
    private static MongoDatabase database;

    private static final String ENV_MONGODB_URI = "MONGODB_URI";
    private static final String ENV_MONGODB_DATABASE = "MONGODB_DATABASE";

    public static MongoClient getClient() {
        if (mongoClient == null) {
            String uri = System.getenv(ENV_MONGODB_URI);
            if (uri == null || uri.isEmpty()) {
                throw new RuntimeException("MONGODB_URI environment variable is not set");
            }
            mongoClient = MongoClients.create(uri);
        }
        return mongoClient;
    }

    public static MongoDatabase getDatabase() {
        if (database == null) {
            String dbName = System.getenv(ENV_MONGODB_DATABASE);
            if (dbName == null || dbName.isEmpty()) {
                throw new RuntimeException("MONGODB_DATABASE environment variable is not set");
            }
            database = getClient().getDatabase(dbName);
        }
        return database;
    }

    public static MongoCollection<Document> getUsersCollection() {
        return getDatabase().getCollection("Users");
    }

    public static MongoCollection<Document> getPdfSessionsCollection() {
        return getDatabase().getCollection("PdfSessions");
    }
}
