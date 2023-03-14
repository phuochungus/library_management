const libraryRules = require("../models/rulesSchema");

class LibraryRules {
  static getLibraryRules = async () => {
    try {
      let response = await libraryRules.find();
      return response[0];
    } catch (error) {
      throw new Error("Library rules not found in DB");
    }
  };
}

module.exports = LibraryRules;
