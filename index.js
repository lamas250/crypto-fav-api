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


// map model attribute and make a select before
const mapAttributes = (model, {fieldNodes}) => {
  const columns = new Set(Object.keys(model.rawAttributes));
  const requested_attributes = fieldNodes[0].selectionSet.selections
    .map(({name: {value}}) => value);

  return requested_attributes.filter(attribute => columns.has(attribute))
}

//  resolve map
const resolvers = {
  Query: {
    coins: async (_, { offset = 0, limit = 10 }, context, info) => {
      const coins = await Coins.findAll({
        limit,
        offset,
        order: [["id", "ASC"]],
        attributes: mapAttributes(Coins, info),
      });
      return coins;
    },
    favorites: async (parent, args, context, info) => {
      const coins = await Coins.findAll({
        where: { favorite: true },
        attributes: mapAttributes(Coins, info),
      });
      return coins;
    },
  },
  Mutation: {
    addCoin: async (_, { symbol }, context, info) => {
      const [updated] = await Coins.update(
        { favorite: true },
        {
          where: { symbol: symbol },
        }
      );
      if (updated) {
        const updatedCoin = await Coins.findOne({
          where: { symbol: symbol },
          attributes: mapAttributes(Coins, info),
        });
        return updatedCoin;
      }
      throw new Error("Coin not updated to true");
    },
    removeCoin: async (_, { symbol }, context, info) => {
      const [updated] = await Coins.update(
        { favorite: false },
        {
          where: { symbol: symbol },
        }
      );
      if (updated) {
        const updatedCoin = await Coins.findOne({
          where: { symbol: symbol },
          attributes: mapAttributes(Coins, info),
        });
        return updatedCoin;
      }
      throw new Error("Coin not updated to false");
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen({port}, () => console.log(`Server is running at ${port}`));