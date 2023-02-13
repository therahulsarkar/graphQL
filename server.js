import { ApolloServer, gql } from 'apollo-server'
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core' 
// import { quotes } from './db'
import { users, quotes} from './db.js '
import { randomBytes } from 'crypto'

//* Schemas
const typeDefs = gql`
    type Query{
        users: [User]
        quotes : [Quote]
        user(id:ID!): User
    }

    type User{
        id: ID
        firstName: String
        lastName: String
        email: String
        quote: [Quote]
    }

    type Quote{
        name: String
        by: ID
    }

    #Creating a schema for new user's signup input
    input newUserInput{
        firstName:String! 
        lastName:String! 
        email:String!
        password:String!
    }

    # Creating a mutation for creating new user with our predefined input type
    type Mutation{
        signupUser(newUser: newUserInput!): User
    }
`

//* Resolvers
const resolvers = {
    Query:{
        users: ()=> users,
        quotes: ()=> quotes,
        user: (_, {id}) => users.find((usr)=> usr.id == id), 
    },
    User:{
        quote: (user)=> quotes.filter((qt)=> qt.by == user.id ) 
    },
    // Mutation:{
    //     signupUser: (_, {firstName, lastName, email, password})=>{
    //         const id = randomBytes(5).toString('hex');  
    //         users.push({
    //             id,
    //             firstName,
    //             lastName,
    //             email,
    //             password
    //         })

    //         return users.find((usr)=> usr.id == id)

    //     }
    // }
    Mutation:{
        signupUser: (_, {newUser})=>{
            const id = randomBytes(5).toString('hex');  
            users.push({
                id,
                ...newUser 
            })

            return users.find((usr)=> usr.id == id)

        }
    }


}

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})

server.listen().then(({ url })=>{
console.log(`server listening on port ${url}`)
})