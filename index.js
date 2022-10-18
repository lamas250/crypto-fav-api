const { ApolloServer, gql } = require('apollo-server')
const { Coins, sequelize } = require('./models')

const port = '4000';

// typeDefs and resolvers

const typeDefs = gql`
  type Coin { name: String, symbol: String, price: String, imageUrl: String, favorite: Boolean }
  type Query { 
    coins(offset: Int, limit: Int ): [Coin], 
    favorites: [Coin]
  }
  type Mutation {
    addCoin(symbol: String!): Coin
    removeCoin(symbol: String!): Coin
  }
`;

//  resolve map

const resolvers = {
  Query: {
    coins: async (_, {offset = 0, limit = 10}) => {
      const coins = await Coins.findAll({
        limit,
        offset,
        order: [['id', 'ASC']]
      });
      return coins;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen({port}, () => console.log(`Server is running at ${port}`));