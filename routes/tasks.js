"use strict";
var express = require("express");
var Tasks = require("../models/tasks.js");
var router = new express.Router();

/* GET tasks */
router.get("/:id?", function (req, res, next) {
    if (req.params.id) {
        Tasks.getTasksById(req.params.id).catch(function (err) {
            res.json(err);
        }).then(function (rows) {
            if (rows.length === 0) {
                res.err(404);
            } else {
                rows.forEach(function (row) {
                    var rowResult = {};
                    rowResult.species_id = row.species_id;
                    rowResult.common_name = row.common_name;
                    rowResult.latin_name = row.latin_name;
                    rowResult.category_id = row.category_id;
                    res.json(rowResult);
                });
            }
        });
    } else {
        Tasks.getAllTasks().catch(function (err) {
            res.json(err);
        }).then(function (rows) {
            res.json(rows);
        });
    }
});

/* add new task */
router.post("/", function (req, res, next) {
    Tasks.addTask(req.body).catch(function (err) {
        res.json(err);
    }).then(function (count) {
        res.json(req.body);
    });
});

module.exports = router;
