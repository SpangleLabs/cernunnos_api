var express = require("express");
var Categories = require("../models/categories.js");
var Tasks = require("../models/tasks.js");
var Promise = require("promise");
var router = new express.Router();

function addSubcategoriesAndReturn(res, rows) {
    var subcategoryPromises = [];
    var taskPromises = [];
    rows.forEach(function (row) {
        var categoryId = row.category_id;
        subcategoryPromises.push(Categories.getCategoriesByParentId(categoryId).catch(function (err) {
            res.json(err);
        }).then(function (subRows) {
            return subRows;
        }));
        taskPromises.push(Tasks.getTasksByCategoryId(categoryId).catch(function (err) {
            res.json(err);
        }).then(function (tasks) {
            return tasks;
        }));
    });
    Promise.all(subcategoryPromises.concat(taskPromises)).catch(function (err) {
        res.json(err);
    }).then(function (values) {
        var rowResults = [];
        rows.forEach(function (row, i) {
            var rowResult = {};
            rowResult.category_id = row.category_id;
            rowResult.name = row.name;
            rowResult.category_level_id = row.category_level_id;
            rowResult.parent_category_id = row.parent_category_id;
            rowResult.sub_categories = values[i];
            rowResult.species = values[i + rows.length]; // I don't know if this is nightmares.
            rowResults.push(rowResult);
        });
        res.json(rowResults);
    });
}

/* GET categories listing. */
router.get("/:id?", function (req, res, next) {
    if (req.params.id) {
        Categories.getCategoryById(req.params.id).catch(function (err) {
            res.json(err);
        }).then(function (rows) {
            addSubcategoriesAndReturn(res, rows);
        });
    } else {
        Categories.getBaseCategories().catch(function (err) {
            res.json(err);
        }).then(function (rows) {
            addSubcategoriesAndReturn(res, rows);
        });
    }
});

router.post("/", function (req, res, next) {
    Categories.addCategory(req.body).catch(function (err) {
        res.json(err);
    }).then(function (count) {
        res.json(req.body);
    });
});

module.exports = router;
