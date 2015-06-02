# Coding Challenge Description

Create a job queue whose workers fetch data from a URL and store the results
in a database.  The job queue should expose a REST API for adding jobs and
checking their status / results.

Example:

User submits `www.google.com` to your endpoint.  The user gets back a job
id. Your system fetches www.google.com (the result of which would be HTML)
and stores the result.  The user asks for the status of the job id and if
the job is complete, he gets a response that includes the HTML for
www.google.com.

# Solution

## Assumptions

It's assumed that multiple jobs may be run in parallel. It's further assumed that the queue behavior requires jobs to be started in FIFO order, but that completion order does not matter (i.e. you don't have to wait for one job to complete before starting another one).

Features like server clusters running on a single database, limiting the number of concurrently executing jobs, and crash recovery are all out of scope for this exercise.

## Requirements

Other than the dependencies listed in `package.json`, the only requirement
is MongoDB. The connection settings for mongo can be changed in
`config.json`.

## API

### POST /jobs

A new job may be created with a request following this format:

```http
POST /jobs
Content-Type: application/json

{"url": "http://www.google.com"}
```

A successful response follows this format:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "556bbc066262dca111af2876",
  "status": "pending",
  "url": "http://www.google.com",
  "createdAt": "2015-06-01T01:57:26.718Z"
}
```

### GET /jobs/:id

Job status may be retrieved with a request following this format:

```http
GET /jobs/556bbc066262dca111af2876
```

A successful response follows this format:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "556bbc066262dca111af2876",
  "status": "complete",
  "url": "http://www.google.com",
  "createdAt": "2015-06-01T01:57:26.718Z",
  "response": "<!DOCTYPE>\n<html>...</html>",
  "statusCode": 200
}
```

The `status` property may be one of `pending`, `running`, `complete`, or `error`. In the case of an `error` status, an additional property, `message`, will contain any error message available.
