const { format } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");
const formatTask = (task) => {
    return {
        ...task.toJSON(),
        dueDate: {
            raw: task.dueDate,
            formatted: format(new Date(task.dueDate), "MM/dd/yyyy"),
        },
        createdAt: {
            raw: task.createdAt,
            formatted: format(
                toZonedTime (new Date(task.createdAt), "UTC"),
                "MM/dd/yyyy hh:mm a"
            ),
        },
        updatedAt: {
            raw: task.updatedAt,
            formatted: format(
                toZonedTime(new Date(task.updatedAt), "UTC"),
                "MM/dd/yyyy hh:mm a"
            ),
        },
    };
};

module.exports = formatTask;
