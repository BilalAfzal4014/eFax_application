const express = require("express");
const HttpErrorResponseHandler = require("../../errors/handlers/http-error-response-handler");
const BusinessError = require('../../errors/business-error');
const ErrorTypes = require('../../errors/error-types');

const applyMiddlewares = (app) => {
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    app.use(cors());
};

const applyErrorMiddlewares = (app) => {
    app.use(pathNotFound());
    app.use(serverErrorMiddleware());
};

const cors = () => (req, res, next) => {
    res.header("Access-control-allow-origin", (process.env.ALLOWED_ORIGIN || "*"));
    res.header("Access-control-allow-headers", "authorization, content-type");

    if (req.method === "OPTIONS") {
        res.header("Access-control-allow-methods", "GET, PUT, POST, PATCH, DELETE");
        return res.status(200).json();
    }

    next();
};


const pathNotFound = () => (req, res, next) => {
    const error = new BusinessError(
        ErrorTypes.NOT_FOUND,
        "Path doesn't exist", [],
        "BusinessError from pathNotFound middleware"
    );

    next(error);
};

const serverErrorMiddleware = () => (error, req, res, next) => {
    return new HttpErrorResponseHandler(res).handleError(error);
};

const extractPaginationInfo = (req, resp, next) => {
    req.paginationInfo = {
        pageNo: req.query.pageNo || 1,
        chunkSize: req.query.chunkSize || 10
    }

    delete req.query.pageNo;
    delete req.query.chunkSize;

    next();
}

module.exports = {
    applyMiddlewares,
    applyErrorMiddlewares,
    extractPaginationInfo
};