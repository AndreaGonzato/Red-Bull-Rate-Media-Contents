const dbCollections = {
    USERS : "users",
    CONTENTS : "contents"
};

// this do not permit to change the the attribute USERS of the Collections
Object.defineProperty(dbCollections, "USERS", {
    value: "users",
    writable: false,
});


// this do not permit to change the the attribute TWEETS of Collection
Object.defineProperty(dbCollections, "CONTENTS", {
    value: "contents",
    writable: false,
});


module.exports = dbCollections;

