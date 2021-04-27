const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList } = require('graphql');
const { Client } = require('pg')

const client = new Client({
    host: "localhost",
    user: "postgres",
    password: "superuser",
    database: "todo",
    port: 5432
});
client.connect();

const TodoType = new GraphQLObjectType({
    name: 'todo',
    description: 'A todo',
    fields: () => ({
        todoID: { type: new GraphQLNonNull(GraphQLInt) },
        task: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
    }),
});

const QueryRoot = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        todos: {
            type: GraphQLList(TodoType),
            resolve: (parent, args, ctx, resInfo) => {
                return client.query(`SELECT * FROM todo."Todo"`, (err, res) => {
                    return err ? err : res.rows;
                });
            },
        },
        todo: {
            type: TodoType,
            args: { todoID: { type: GraphQLNonNull(GraphQLInt) } },
            resolve: (parent, args, ctx, resInfo) => {
                return client.query(`SELECT * FROM todo."Todo" WHERE "todoID" = ${args.todoID}`, (err, res) => {
                    return err ? err : res.rows[0];
                });
            },
        }
    }),
});

const schema = new GraphQLSchema({ query: QueryRoot });

const app = express();
app.use('/api', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4000);