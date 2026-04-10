import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@as-integrations/express5'
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

async function startServer() {
    const app = express();

    const server = new ApolloServer({
        typeDefs:`
        type User{
        id:ID!,
        name:String!,
        username:String!,
        email:String!
        }
        type Todos{
        id:ID!,
        title:String!,
        completed:Boolean!
        user:User!
        }
        
        type Query{
        getTodos:[Todos]
        getUsers:[User]
        getAUser(id:ID!):User
        }
        `,
        resolvers:{
            Todos:{
                user:async (Todos)=>((await axios.get(`https://jsonplaceholder.typicode.com/users/${Todos.userId}`)).data)
            },
            Query:{
                getTodos: async()=>((await axios.get('https://jsonplaceholder.typicode.com/todos/')).data),
                getUsers: async()=>((await axios.get('https://jsonplaceholder.typicode.com/users/')).data),
                getAUser: async(parent,{id})=>((await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data)
            }
        }
    });

    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(4000, () => {
        console.log("Server is running on http://localhost:4000/graphql");
    });
}

startServer();