const Riddle = require("../models/riddle");
const Comment = require("../models/comment");
const util = require("../util/util");
const url = require("url");

exports.getHomePage = (req, res, next) => {
  const filter = req.query.filter;
  Riddle.getAll().then(async riddles => {
    // Filter the riddles here //
    let sortedRiddles = await util.filterRiddle(filter, riddles);
    res.render("home", { riddles: sortedRiddles, filter });
  });
};

exports.createRiddle = (req, res, next) => {
  res.render("create");
};

exports.postRiddle = (req, res, next) => {
  const riddle = new Riddle(
    req.body.author,
    req.body.title,
    req.body.content,
    util.getRandomBgImg(),
    0,
    new Date()
  );
  riddle.save();
  res.redirect("/");
};

exports.detailRiddle = (req, res, next) => {
  const riddleId = req.params.riddleId;
  const isEditing = req.query.edit;

  Riddle.get(riddleId).then(riddle => {
    riddle.date = util.getFormattedDate(riddle.date);
    const bgImgFile = riddle.image_url || util.getRandomBgImg();
    Comment.getAllComment().then(comments => {
      res.render("detail", {
        riddle,
        comments,
        editMode: isEditing,
        bgImgFile,
        editComment: req.query.editComment,
        editCommentId: req.query.editCommentId,
        createComment: req.query.createComment
      });
    });
  });
};

exports.deleteRiddle = async (req, res, next) => {
  const riddleId = req.body.riddleId;
  Comment.deleteAllComment(riddleId);
  await Riddle.delete(riddleId);
  res.redirect("/");
};

exports.like = async (req, res, next) => {
  const riddleId = req.body.riddleId;
  const imgUrl = req.body.imgUrl;
  await Riddle.like(riddleId);
  res.redirect("/riddles/" + riddleId + "?imgUrl=" + imgUrl);
};

exports.showCommentForm = (req, res, next) => {
  res.redirect(
    url.format({
      pathname: "/riddles/" + req.query.riddleId,
      query: {
        createComment: true
      }
    })
  );
};

exports.createComment = (req, res, next) => {
  const comment = new Comment(
    req.body.riddleId,
    req.body.author,
    req.body.comment,
    0,
  );
  comment.saveComment();
  res.redirect("/riddles/" + req.body.riddleId);
};

exports.commentVote = async (req, res, next) => {
  const { id, vote, riddle_id } = req.body;
  let value = vote == 'agree'? 1: -1;
  await Comment.voteComment(id, value)
  res.redirect(`/riddles/${riddle_id}`)
}

exports.editComment = (req, res, next) => {
  res.redirect(
    url.format({
      pathname: "/riddles/" + req.query.riddleId,
      query: {
        editComment: true,
        editCommentId: req.query.commentId
      }
    })
  );
};

exports.updateComment = async (req, res, next) => {
  await Comment.updateComment(
    req.body.commentId,
    req.body.author,
    req.body.comment
  );
  res.redirect("/riddles/" + req.body.riddleId);
};

exports.deleteComment = async (req, res, next) => {
  await Comment.deleteComment(req.body.commentId);
  res.redirect("/riddles/" + req.body.riddleId);
};

// API get all riddles
exports.apiGetAllRiddles = (req, res, next) => {
  Riddle.getAll().then(riddles => {
    res.send(riddles);
  });
}

// API get a riddle
exports.apiGetRiddle = (req, res, next) => {
  const riddleId = req.params.riddleId;
  Riddle.get(riddleId).then(riddle => {
    res.send(riddle);
  });
}

// API get comments
exports.apiGetComments = (req, res, next) => {
  const riddleId = req.params.riddleId;
  Comment.getRelatedComment(riddleId).then(comments => {
    res.send(comments);
  });
}

// API like a riddle
exports.apiLike = async (req, res, next) => {
  const riddleId = req.body.riddleId;
  await Riddle.like(riddleId);
  res.send('ok');
}

exports.apiDeleteRiddle = async (req, res, next) => {
  const riddleId = req.body.riddleId;
  Comment.deleteAllComment(riddleId);
  await Riddle.delete(riddleId);
  res.send('ok');
}

exports.apiCreateRiddle = async (req, res, next) => {
  const riddle = new Riddle(
    req.body.author,
    req.body.title,
    req.body.content,
    util.getRandomBgImg(),
    0,
    new Date()
  );
  riddle.save();
  res.send('ok');
}

exports.apiCreateComment = async (req, res, next) => {
  const comment = new Comment(
    req.body.riddleId,
    req.body.author,
    req.body.comment,
    0,
  );
  comment.saveComment();
  res.send('ok');
}

exports.apiCommentVote = async (req, res, next) => {
  const { id, vote, riddle_id } = req.body;
  let value = vote == 'agree'? 1: -1;
  await Comment.voteComment(id, value)
  res.send('ok');
}

exports.apiDeleteComment = async (req, res, next) => {
  await Comment.deleteComment(req.body.commentId);
  res.send('ok');
}

exports.apiUpdateComment = async (req, res, next) => {
  await Comment.updateComment(
    req.body.commentId,
    req.body.author,
    req.body.comment
  );
  res.send('ok');
}