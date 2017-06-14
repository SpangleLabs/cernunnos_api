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
                var row_result = {};
                row_result.species_id = rows[0].species_id;
                row_result.common_name = rows[0].common_name;
                row_result.latin_name = rows[0].latin_name;
                row_result.category_id = rows[0].category_id;
                res.json(row_result);
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
