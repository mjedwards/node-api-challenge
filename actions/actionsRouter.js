const express = require("express");

const router = express.Router();

const actionFnct = require("../data/helpers/actionModel");

router.get("/", (req, res) => {
  actionFnct.get().then(actions => {
    res.status(200).json(actions);
  });
});

router.get("/:id", validateActionsId(), (req, res) => {
  const { id } = req.params;

  actionFnct.get(id).then(action => {
    res.status(200).json(action);
  });
});

router.delete("/:id", validateActionsId(), (req, res) => {
  const { id } = req.params;

  actionFnct.remove(id).then(dltd => {
    if (dltd) {
      res.json({ action: "this action has been deleted." });
    } else {
      res.status(404).json({ message: "Action is not found" });
    }
  });
});

router.put("/:id", validateActionsId(), (req, res) => {
  const { id } = req.params;
  const newAction = req.body;

  actionFnct.get(id).then(updatedAction => {
    if (updatedAction) {
      actionFnct.update(id, newAction).then(action => {
        res.json(action);
      });
    } else {
      res.status(400).json({
        error: "No content found!"
      });
    }
  });
});

// middleware

function validateActionsId(req, res, next) {
  return (req, res, next) => {
    actionFnct.get(req.params.id).then(action => {
      if (action) {
        res.json(action);
      } else {
        res.status(404).json({
          erroMessage: "Action not found"
        });
      }
    });
    next();
  };
}

module.exports = router;
