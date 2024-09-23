import express from 'express'

function getParams<T = any>(req: express.Request) {
    let response = {} as T
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length) {
    response={...response,...req.body as T}
  }
  if (req.query && typeof req.query === 'object' && Object.keys(req.query).length) {
    response={...response,...req.query as T}
  } 
   if (req.params && typeof req.params === 'object' && Object.keys(req.params).length) {
    response={...response,...req.params as T}
  }

  return response as T
}

export default getParams
