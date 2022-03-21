# Node Challenge

Take home test for Node.js developers.

## The challenge

This challenge has been designed to measure your knowledge of Node.js, Express, Typescript and various technologies, like monorepos, databases and testing. For your exercise, you will be enhancing this API which serves as the backend for the Pleo app. Whenever a user of the app navigates to the expenses view, it calls this API to collect the list of expenses for that user.

Your objective is to write this new route to fetch the list of expenses for a given user. Right now that domain is empty, so you'll have to build everything from scratch- but you can look over at the user domain for inspiration. Please make sure that the endpoint scales adequately and supports paging, sorting and filtering. Additionally, we would also like you to write some tests for your route.

Finally, as a bonus objective, try to improve any aspect of this API. It could be to add more TS types, better security, tests, add features, graphql support, etc. 

## Instructions

Fork this repo with your solution. Ideally, we'd like to see your progression through commits, and don't forget to update the README.md to explain your thought process.

Please let us know how long the challenge takes you. We're not looking for how speedy or lengthy you are. It's just really to give us a clearer idea of what you've produced in the time you decided to take. Feel free to go as big or as small as you want.

## Install

Make sure that you have a modern version of `yarn` that supports workspaces (`>= 1.0`), then run:

```bash
yarn
```

You will also need to [install Postgres](https://www.postgresqltutorial.com/install-postgresql-macos/), create a `challenge` database and load the sql file `dump.sql`:

```bash
psql challenge < dump.sql
```

## Start

To enable logs, use the standard `NODE_DEBUG` flag with the value `DEBUG`

```bash
NODE_DEBUG=DEBUG yarn start
```

## Test

Make sure that you have a modern version of `yarn` that supports workspaces, then run:

```bash
yarn test
```

The command above will run the following test suites sequentially:

| Test suite | Run command | Description |
-------------|-------------|-------------|
| Unit | `yarn test:unit` | Simple unit tests. |
| Mid-level | `yarn test:mid-level` | Small integration tests that integration of small components together.  |
| Acceptances | `yarn test:acceptance` | Large integration tests, system tests, end-to-end tests. |


Happy hacking 😁!

## My Thought Process

In terms of implementing the new feature for expenses, I tried to stick to the same convention/folder structure of the user domain, but if i added anything new (like validation and graphql for example) I set that stuff up according to what I know.

### Added/Update features
Each section will refer to the commit it's related to using the commit hash
### Config #29eb40c
Added the `env` to the default config to support letting the app which env it's running in (some packages utilize that value in order to toggle stuff on/off like playground for graphQl) and updated the host to run on the given port from the env var

### Validation middleware #9b05043
I decided to use **joi** for validation for it's flexibility, tons of different features and ease of use, although other packages like **ajv** are better when it comes to performance joi is way easier.

I decided to build a higher order function that given 3 **optional** schemas, it would validate the incoming req input (body, params, query) against the corresponding schema (body schema, params schema, query schema), using closure to save the compiled schemas it returns a middleware that can be placed on top of the any express route to validate it's input.

I decided to treat the utils as my common folder for things that can be used across different domains, one of them is some validation schemas for pagination stuff like `limit` and `page` which should be the same across all our REST API endpoints

### Get user expenses endpoint #89c846f
Like I said I followed the same conventions used in the user domain, so the files and functionally should be pretty similar to the already built get user details here are my design choices for the allowed inputs:
- userId: The required user id for which we should fetch expenses
- status: A filter option for status which validates against an enum for the allowed values
- startDate: The minium `date_created` for user expenses
- endDate: The maximum `date_created` for user expenses
- sortBy: The sort by field which validates against an enum (decided that `date_created` is good enough for sorting)
- order: The order direction -1 or 1 for descending or ascending ordering 
- limit: The number of returned records has a maximum(50) and minium(1) and a default value (25)
- page: The page number for skipping rows has a minimum of  1

#### Response 
```js
{
    expenses: Expenses [] // the records that match the given input
    pagination :{
        totalCount: Number  // the total number of counts for the given input
        pages: Number // the total number of pages for the given input
    }
}
```

#### Model
Since the input is dynamic (not all of them are required) This is the best solution I could come up with that is simple and uses the same SQL string stitching format in get user details

### Get user expenses docs #da7373a
API documentation is one of the main pillars of building an API, I decided to use swagger as it follows the open API spec (which should be familiar to other developers coming from other programming languages) and it's easy to setup.

I added the schema of the allowed input to the endpoint and the response schema and example for both, plus the possible status code that could be returned

### Setting up the graphql server #c00e68e
For the graphql server I went with apollo which I think is the defacto framework for building graphql APIs, plus it was easy to plug it in on top of express. I made a new server file for setting up the graphQl server. It exported a function that takes our express app and http server and attaches it self to the path `/graphql`, used plugins:

- Apollo playground plugin for **development** environments only
- Apollo Drain http server for graceful shutdowns

Since we have different domains and each one is responsible for it's own **schema** and **resolvers** I decided to use `graphql tools` for stitching and merging to combine all the graphql schemas and resolvers from different domains into one (for now it only merges schema and resolvers from expense domain)

### Add get user expenses to graphQL  #d539469
Each domain will have it's own `schema.graphql` file (which is automatically collected and parsed) that has all the necessary types, queries and mutation for the given domain (it should resemble our REST API endpoint in terms of response, validation..).

Then each domain will have a **resolver** folder which has all the needed resolvers for the defined schema types, queries and mutation


### Tests #b373d6e
I decided to do e2e test as I saw that there wasn't really anything I could write tests for apart from my validation middleware generator but I decided to put my effort in to testing the get user expenses endpoint.

#### Setup
I added a new custom matcher `isSorted` for checking if a given array is sorted or not which can be used for assertion in the sorting tests

#### Test Suite
For each given input I decided to add a test case validating the return data against the incoming input 


## Things That Caught My eye

### Async Utils
I liked the `to` especially having that return format that is similar to callbacks (error first, data second) is a cool way of capturing errors in async functions instead of the old try catch, didn't really understand deferred code wise I know the intuition behind it I guess is to execute an async code in the future

### Domain Driven Development
Two of the things I want to improve my knowledge on is DDD and TDD This is probably my first project that I got to interact with that follows DDD if I'm not mistaken :D.

### Docker File Setup
I liked the idea of having one docker file for all the different uses of our app, building for dev, testing and so on by stopping at the appropriate stage.

### Testing
This has to be the biggest positive for me the different levels of testing is nice I usually followed `nestJs` convention of having unit tests and e2e tests but could see use cases for mid-level tests as well, the jest setup as well was cool having it run some setup files for injecting custom matchers. And I don't if ever seen test suites that run against the API using the network (in our case `localhost:9001`) so a lot of stuff here is kind of new to me.

I assumed that the API was setup with **static data** needed to be able to run the tests. for e2 test I usually run an in memory mongo server or SQLlite to simulate the db layer and create fake data in each test suite which is delete afterwards. 

## Things That I Found A Bit Quirky

### REST API conventions
I checked out the existing get user details route which was `/get-user-details` which doesn't necessarily follow the best practices of REST API (having the action as part of the path, the verb GET should provide that info) I think a better path would've been `GET /users/:id/details`.

Plus I think the endpoint for expenses as well should've been in the users domain (since the url would've looked something like this `GET /users/:id/expenses`) but I think that would've violated the separate domain thing, I thought maybe we could have the database layer (model) as a supporting sub-domain which the main domains can call (the use domain can call the expense model to get user expenses) but then again my knowledge about DDD is limited so I could be wrong.

### Native modules
Maybe this is just because this is a test not an actual app but I was surprised to see that the logger was made from scratch not using pino or anything similar, same goes for the db model layer using the native driver is something you don't see that much in the wild people usually use ORM like sequelize or prisma which provides a lot fo cool stuff out of the box.

## Things I would've liked to add

### Authorization
I would've liked to add maybe a layer of authorization to allow only the same use to view his own expenses only but that meant implementing a sign in functionality and jwt probably and I felt that that would deviate to much from what was required

### Add GraphQL User Type To Expenses
I would've liked to add also the user as a return with the expenses so if needed the client can get the user data along with expenses but that meant having the two domains being coupled together somehow as i needed to add the `User` type resolver in the **expense** resolvers folder not the user resolvers, which I felt was wrong in terms of architecture

## Things I think I could've done better
I'm pretty happy with the outcome, but for tests I feel like you guys have a much higher standard than what I did so would really like to know your feedback regarding on that

## Task Time line 
On saturday it took me about 5~6 hours to kind of look around the project figure everything out and implement the needed endpoint with documentation.

On sunday I started implementing the graphQl setup which took me a while because the last time I used apollo was on v2 and they released v3 which has minor breaking changes one of them is how to get the playground up and running, Then I added the query resolvers and all that stuff again almost 5~6 hours

On monday I just wrote the tests and updated this README.md file to add my notes which took about 3~4 hours 

Thanks for the opportunity, can't wait to hear your feedback
