# ERD: Invoice System

This document explores the design of Invoice System, an Talent Track one place to create and manage all types of invoices.

We'll use a basic client/server architecture, where a single server is deployed
on an internal server next to a relational database, and serving HTTP traffic from
a private endpoint.

## Storage

We'll use a relational database (schema follows) to fast retrieval of invoices data.
A database implementation such as mysql suffices.
Data will be stored on the server on a separate, backed
up volume for resilience. There will be no replication or sharding of data at
this early stage.

### Schema:

We'll need at least the following entities to implement the service: [see](./ddl.sql)

## Server

A simple HTTP server is responsible for authentication, serving stored data, and
potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- Mysql2 to be used as mysql deriver (connect to database).

### Auth

A simple JWT-based auth mechanism is to be used, with passwords
encrypted and stored in the database.

### API TODO

**Auth**:

```
/login  [POST]
```

## Clients

For now we'll start with a single web client.

The web client will be implemented in React.js.
API server will serve a static bundle of the React app.
Uses ReactQuery to talk to the backend.
Uses Chakra UI for building the CSS components.

## Hosting

The code is hosted on Github. The server is deployed on a private server. The database is hosted on the same server. The server is accessible via a private endpoint.
