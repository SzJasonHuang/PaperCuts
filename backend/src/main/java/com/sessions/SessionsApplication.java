package com.sessions;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import static com.mongodb.client.model.Filters.eq;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SessionsApplication {
    public static void main(String[] args) {
        // Replace the placeholder with your MongoDB deployment's connection string
        String uri = "mongodb+srv://whuang45_db_user:clijlassMZeEPzqm@hackthecoast.hgra0ow.mongodb.net/?appName=HacktheCoast";
        try (MongoClient mongoClient = MongoClients.create(uri)) {
            MongoDatabase database = mongoClient.getDatabase("HackTheCoast");
            MongoCollection<Document> collection = database.getCollection("Users");
            Document doc = collection.find(eq("userId", "U12345")).first();
            if (doc != null) {
                System.out.println(doc.toJson());
            } else {
                System.out.println("No matching documents found.");
            }
        }
    }
}
