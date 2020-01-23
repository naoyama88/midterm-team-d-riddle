const database = require("../util/database");
const mongodb = require("mongodb");

class Comment {
  constructor(riddleId, author, comment, upVote, downVote) {
    this.riddleId = riddleId;
    this.author = author;
    this.comment = comment;
    this.upVote = upVote;
    this.downVote = downVote;
  }

  saveComment() {
    database
      .getDB()
      .collection("comments")
      .insertOne(this)
      .then(result => {
        console.log(result);
        console.log("success!");
      })
      .catch(err => {
        console.log(err);
      });
  }

  static getAllComment() {
    return database
      .getDB()
      .collection("comments")
      .find()
      .toArray()
      .then(result => {
        console.log(result);
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  static deleteComment(id) {
    return database
      .getDB()
      .collection("comments")
      .deleteOne({ _id: new mongodb.ObjectId(id) });
  }

  static deleteAllComment(riddleId) {
    return database
      .getDB()
      .collection("comments")
      .remove( { riddle_id: riddleId } );
  }

  static updateComment(id, author, comment) {
    return database
      .getDB()
      .collection("comments")
      .updateOne(
        { _id: new mongodb.ObjectId(id) },
        { $set: { author: author, comment: comment } }
      );
  }
}

module.exports = Comment;
