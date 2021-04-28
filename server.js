const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList, isNullableType } = require('graphql');
const { Client } = require('pg');

const table = 'todo."Todo"';

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
    description: 'Root query',
    fields: () => ({
        todos: {
            type: GraphQLList(TodoType),
            resolve: (parent, args, ctx, resInfo) => {
                return client.query(`SELECT * FROM todo."Todo"`).then(res => res.rows);
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

const RootMutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({
        deleteTodo: {
            type: GraphQLInt,
            args: { todoID: { type: GraphQLNonNull(GraphQLInt) } },
            resolve: (parent, args, ctx, resInfo) => {
                client.query(`DELETE from ${table} WHERE "todoID" = ${args.todoID}`).then(res => { return args.todoID });
            }
        },
        createTodo: {
            type: GraphQLInt,
            args: { task: { type: GraphQLNonNull(GraphQLString) }, category: { type: GraphQLNonNull(GraphQLString) } },
            resolve: (parents, args, ctx, resInfo) => {
                client.query(`INSERT INTO ${table} (task, category) VALUES ('${args.task}', '${args.category}')`);
            }
        },
    }),
});

const schema = new GraphQLSchema({ query: QueryRoot, mutation: RootMutation });

const app = express();
app.use(cors());
app.use('/api', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4000);