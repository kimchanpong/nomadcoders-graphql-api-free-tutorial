import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id:1,
        text:"first one!",
        userId: "2"
    },
    {
        id:2,
        text:"second one!",
        userId: "1"
    }
];

let users = [
    {
        id: "1",
        firstName: "nico",
        lastName: "las",
        username: "chanpong"
    },
    {
        id: "2",
        firstName: "kim",
        lastName: "chan",
        username: "kimchan"
    }
];

const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String
        fullName: String!
    }
    
    type Tweet {
        id: ID!
        text: String!
        author: User
    }
    
    type Query {
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        ping:String!
    }
    
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(root, {id}) {
            return tweets.find(tweet => tweet.id === id);
        },
        allUsers() {
            return users;
        }
    },
    Mutation: {
        postTweet(_, {text, userId}) {
            const newTweet = {
                id: tweets.length + 1,
                text,
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, {id}) {
            const tweet = tweets.find(tweet => ("" + tweet.id) === id);

            if(!tweet) {
                return false;
            }

            tweets = tweets.filter(tweet => ("" + tweet.id) !== id);
            console.log('tweets=', tweets);
            return true;
        }
    },
    User: {
        firstName({firstName}) {
          return firstName;
        },
        fullName({firstName, lastName}) {
            return `${firstName} ${lastName}`;
        },
    },
    Tweet: {
        author({userId}){
            return users.find((user) => user.id === userId);
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});
server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});