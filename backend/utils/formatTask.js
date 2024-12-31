const { format } = require("date-fns");

const formatTask = (task) => {
    return {
        ...task.toJSON(),
        dueDate: {
            raw: task.dueDate,
            formatted: format(new Date(task.dueDate), "MM/dd/yyyy"),
        },
        createdAt: {
            raw: task.createdAt,
            formatted: format(new Date(task.createdAt), "MM/dd/yyyy hh:mm a"),
        },
        updatedAt: {
            raw: task.updatedAt,
            formatted: format(new Date(task.updatedAt), "MM/dd/yyyy hh:mm a"),
        }
    };
};

module.exports = formatTask;
