var express = require('express')
var expressGraphQL = require('express-graphql')
var { buildSchema } = require('graphql')

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String,
    test: Test
  }
  type Mutation {
    create(input: TestInput): Test
  }
  type Test {
    id: String
    name: String
  }
  input TestInput {
    foo: String
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
	hello: () => {
		return 'Hello world!'
	},
	test: (...args) => {
		return { name: 'Some test' }
	},
	create: (vars, ...args) => {
		console.log(vars)
		return { id: 'hjfjhfh', name: 'Some new test' }

	}
}

var app = express()
app.use(
	'/graphql',
	expressGraphQL({
		schema: schema,
		rootValue: root,
		graphiql: true
	})
)
app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')
