var StringUtils = {
    unique: function(l) {
        return Math.random().toString(36).substring(2, l ? l + 2 : 7);
    }
};