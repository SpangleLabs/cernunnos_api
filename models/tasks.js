var db = require("../dbconnection");

var Tasks = {

    getAllTasks: function () {
        "use strict";
        return db.then(function (conn) {
            return conn.query("select * from tasks");
        });
    },

    getTasksById: function (id) {
        "use strict";
        return db.then(function (conn) {
            return conn.query("select * from tasks where task_id=?", [id]);
        });
    },

    getTasksByCategoryId: function (id) {
        "use strict";
        return db.then(function (conn) {
            return conn.query("select * from tasks where category_id=?", [id]);
        });
    },

    addTask: function (Task) {
        "use strict";
        return db.then(function (conn) {
            return conn.query("insert into tasks (`name`,`category_id`) " +
                    "values (?,?,?)", [Task.common_name, Task.category_id]);
        });
    },

    deleteTask: function (id) {
        return db.then(function (conn) {
            return conn.query("delete from tasks where task_id=?", [id]);
        });
    },

    updateTask: function (id,Task) {
        return db.then(function (conn) {
            return conn.query("update species set name=?, category_id=? where task_id=?",
                    [Task.name, Task.category_id, id]);
        });
    }

};
module.exports = Tasks;