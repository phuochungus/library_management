const { response } = require("express");
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
  static modifyRules = async (ObjectOfRules) => {
    libraryRules
      .findOneAndUpdate({}, { ...ObjectOfRules })
      .then((response) => console.log(response));
  };
}

module.exports = LibraryRules;
