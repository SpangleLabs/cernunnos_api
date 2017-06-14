var express = require("express");
var Categories = require("../models/categories.js");
var Tasks = require("../models/tasks.js");
var Promise = require("promise");
var router = new express.Router();

function add_subcategories_and_return(res, rows) {
    var subcategory_promises = [];
    var species_promises = [];
    rows.forEach(function (row) {
        var category_id = row.category_id;
        subcategory_promises.push(Categories.getCategoriesByParentId(category_id).catch(function (err) {
            res.json(err);
        }).then(function (sub_rows) {
            return sub_rows;
        }));
        species_promises.push(Tasks.getTasksByCategoryId(category_id).catch(function (err) {
            res.json(err);
        }).then(function (species) {
            return species;
        }));
    });
    Promise.all(subcategory_promises.concat(species_promises)).catch(function (err) {
        res.json(err);
    }).then(function (values) {
        var row_results = [];
        rows.forEach(function (row, i) {
            var row_result = {};
            row_result.category_id = row.category_id;
            row_result.name = row.name;
            row_result.category_level_id = row.category_level_id;
            row_result.parent_category_id = row.parent_category_id;
            row_result.sub_categories = values[i];
            row_result.species = values[i + rows.length]; // I don't know if this is nightmares.
            row_results.push(row_result);
        });
        res.json(row_results);
    });
}

/* GET categories listing. */
router.get("/:id?", function (req, res, next) {
    if (req.params.id) {
        Categories.getCategoryById(req.params.id).catch(function (err) {
            res.json(err);
        }).then(function (rows) {
            add_subcategories_and_return(res, rows);
        });
    } else {
        Categories.getBaseCategories().catch(function (err) {
            res.json(err);
        }).then(function (rows) {
            add_subcategories_and_return(res, rows);
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
